import { initializeApp, getApps, cert, type App } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import type { JobPhase, JobPublicStatus, JobLogEntry } from '../provision/types'
import { redactSecretMessage } from './redact'

function resolveProjectId(): string {
  if (process.env.GCLOUD_PROJECT) return process.env.GCLOUD_PROJECT
  if (process.env.GOOGLE_CLOUD_PROJECT) return process.env.GOOGLE_CLOUD_PROJECT
  if (process.env.FIREBASE_CONFIG) {
    try {
      const id = (JSON.parse(process.env.FIREBASE_CONFIG) as { projectId?: string }).projectId
      if (id) return id
    } catch {
      /* ignore */
    }
  }
  return 'jittee-corporate-site'
}

function initAdmin(): App {
  if (getApps().length) return getApps()[0]!
  const projectId = resolveProjectId()

  // App Hosting / Cloud Run: use ADC for same-project Firestore.
  // GOOGLE_SERVICE_ACCOUNT_KEY is a Drive SA from another GCP project and must not
  // be used as the Firebase Admin credential here.
  if (process.env.K_SERVICE || process.env.FIREBASE_CONFIG) {
    return initializeApp({ projectId })
  }

  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY?.replace(/^\uFEFF/, '').trim()
  if (raw) {
    const sa = JSON.parse(raw) as {
      project_id: string
      client_email: string
      private_key: string
    }
    return initializeApp({
      credential: cert({
        projectId: sa.project_id,
        clientEmail: sa.client_email,
        privateKey: sa.private_key.replace(/\\n/g, '\n'),
      }),
    })
  }
  return initializeApp({ projectId })
}

function db() {
  initAdmin()
  return getFirestore()
}

const COLLECTION = 'minorwire_jobs'
const MAX_INLINE_LOGS = 80

export type JobRecord = {
  id: string
  phase: JobPhase
  message: string
  createdAt: number
  updatedAt: number
  sessionId: string
  sku: string
  publicIp?: string
  peerName?: string
  peerConf?: string
  peers?: { name: string; conf: string; createdAt: number }[]
  /** AES-GCM blob of instance SSH PEM — never expose via API. */
  sshPrivateKeyEnc?: string
  /** Temporary AES-GCM blob of OCI creds + peerName for the runner; cleared after run. */
  payloadEnc?: string
  runStartedAt?: number
  lastKickAt?: number
  logs?: JobLogEntry[]
  error?: string
}

export async function createJobDoc(input: {
  id: string
  sessionId: string
  sku: string
  payloadEnc: string
  peerName: string
}): Promise<void> {
  const now = Date.now()
  const bootLog: JobLogEntry = {
    at: now,
    level: 'info',
    step: 'create',
    message: 'Job document created',
    phase: 'queued',
  }
  await db()
    .collection(COLLECTION)
    .doc(input.id)
    .set({
      id: input.id,
      phase: 'queued',
      message: 'Queued',
      createdAt: now,
      updatedAt: now,
      sessionId: input.sessionId,
      sku: input.sku,
      payloadEnc: input.payloadEnc,
      peerName: input.peerName,
      logs: [bootLog],
    })
  await db()
    .collection(COLLECTION)
    .doc(input.id)
    .collection('logs')
    .add(bootLog)
}

export async function appendJobLog(
  id: string,
  entry: Omit<JobLogEntry, 'at'> & { at?: number },
): Promise<void> {
  const full: JobLogEntry = {
    at: entry.at ?? Date.now(),
    level: entry.level,
    step: entry.step,
    message: redactSecretMessage(entry.message),
    phase: entry.phase,
  }
  const ref = db().collection(COLLECTION).doc(id)
  try {
    await ref.set(
      {
        logs: FieldValue.arrayUnion(full),
        updatedAt: full.at,
        _touch: FieldValue.serverTimestamp(),
      },
      { merge: true },
    )
    // Cap inline logs (best-effort; concurrent writes may briefly exceed).
    const snap = await ref.get()
    const logs = (snap.data()?.logs as JobLogEntry[] | undefined) || []
    if (logs.length > MAX_INLINE_LOGS) {
      await ref.set({ logs: logs.slice(-MAX_INLINE_LOGS) }, { merge: true })
    }
  } catch (e) {
    console.error('[minorwire] appendJobLog failed', id, e)
  }
  try {
    await ref.collection('logs').add(full)
  } catch (e) {
    console.error('[minorwire] job logs subcollection write failed', id, e)
  }
}

export async function updateJob(
  id: string,
  patch: Partial<Omit<JobRecord, 'id' | 'createdAt' | 'sessionId' | 'sku'>>,
): Promise<void> {
  await db()
    .collection(COLLECTION)
    .doc(id)
    .set(
      {
        ...patch,
        updatedAt: Date.now(),
        _touch: FieldValue.serverTimestamp(),
      },
      { merge: true },
    )
}

/** Claim queued → validating. Returns job snapshot if this caller won the claim. */
export async function claimQueuedJob(id: string): Promise<JobRecord | null> {
  const ref = db().collection(COLLECTION).doc(id)
  return db().runTransaction(async (tx) => {
    const snap = await tx.get(ref)
    if (!snap.exists) return null
    const job = snap.data() as JobRecord
    if (job.phase !== 'queued') return null
    const now = Date.now()
    const next: Partial<JobRecord> = {
      phase: 'validating',
      message: 'Validating OCI credentials',
      updatedAt: now,
      runStartedAt: now,
      lastKickAt: now,
    }
    tx.set(ref, { ...next, _touch: FieldValue.serverTimestamp() }, { merge: true })
    return { ...job, ...next } as JobRecord
  })
}

export async function clearJobPayload(id: string): Promise<void> {
  await db()
    .collection(COLLECTION)
    .doc(id)
    .set(
      {
        payloadEnc: FieldValue.delete(),
        updatedAt: Date.now(),
        _touch: FieldValue.serverTimestamp(),
      },
      { merge: true },
    )
}

export async function getJob(id: string): Promise<JobRecord | null> {
  const snap = await db().collection(COLLECTION).doc(id).get()
  if (!snap.exists) return null
  return snap.data() as JobRecord
}

export async function findJobsForSession(sessionId: string): Promise<JobRecord[]> {
  const snap = await db()
    .collection(COLLECTION)
    .where('sessionId', '==', sessionId)
    .limit(20)
    .get()
  return snap.docs
    .map((d) => d.data() as JobRecord)
    .sort((a, b) => b.createdAt - a.createdAt)
}

export async function findActiveJobForSession(sessionId: string): Promise<JobRecord | null> {
  const rows = await findJobsForSession(sessionId)
  return (
    rows.find((j) => j.phase !== 'done' && j.phase !== 'error') ??
    rows.find((j) => j.phase === 'done') ??
    rows[0] ??
    null
  )
}

export async function findCompletedJobForSession(sessionId: string): Promise<JobRecord | null> {
  const rows = await findJobsForSession(sessionId)
  return rows.find((j) => j.phase === 'done') ?? null
}

const STUCK_QUEUED_MS = 90_000

/**
 * If a job is stuck in queued with no way to run (no payload), mark error.
 * If payload exists but never claimed, leave queued for a kick — but after a long
 * wait still surface error so the setup form can be shown again.
 */
export async function recoverStuckQueuedJob(job: JobRecord): Promise<JobRecord> {
  if (job.phase !== 'queued') return job
  const age = Date.now() - job.createdAt
  if (age < STUCK_QUEUED_MS) return job

  if (!job.payloadEnc) {
    await appendJobLog(job.id, {
      level: 'error',
      step: 'recover',
      message: 'Stuck in queued without payload; marking error for resubmit',
      phase: 'error',
    })
    await updateJob(job.id, {
      phase: 'error',
      message: 'Failed',
      error: 'Provision never started. Please submit the form again.',
    })
    return (await getJob(job.id)) || job
  }

  // Payload present but runner never claimed — after 10 minutes give up for UX.
  if (age > 10 * 60_000) {
    await appendJobLog(job.id, {
      level: 'error',
      step: 'recover',
      message: 'Stuck in queued with payload for >10m; marking error',
      phase: 'error',
    })
    await updateJob(job.id, {
      phase: 'error',
      message: 'Failed',
      error: 'Provision timed out before start. Please submit the form again.',
    })
    await clearJobPayload(job.id)
    return (await getJob(job.id)) || job
  }

  return job
}

export function toPublicStatus(job: JobRecord): JobPublicStatus {
  const logs = (job.logs || []).slice(-20)
  return {
    id: job.id,
    phase: job.phase,
    message: job.message,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
    sessionId: job.sessionId,
    publicIp: job.publicIp,
    peerName: job.peerName,
    peerConf: job.peerConf,
    peers: job.peers,
    error: job.error,
    logs,
    canRetry: job.phase === 'error',
    serverProvisioned: job.phase === 'done' && Boolean(job.publicIp),
  }
}
