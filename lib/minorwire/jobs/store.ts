import { initializeApp, getApps, cert, type App } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import type { JobPhase, JobPublicStatus } from '../provision/types'

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
  error?: string
}

export async function createJobDoc(input: {
  id: string
  sessionId: string
  sku: string
}): Promise<void> {
  const now = Date.now()
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
    })
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

export function toPublicStatus(job: JobRecord): JobPublicStatus {
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
    serverProvisioned: job.phase === 'done' && Boolean(job.publicIp),
  }
}
