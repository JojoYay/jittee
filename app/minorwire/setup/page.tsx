'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useCallback, useEffect, useState } from 'react'
import { Syne, DM_Sans } from 'next/font/google'
import { buildIamPolicy } from '@/lib/minorwire/iamPolicy'
import type { JobPublicStatus } from '@/lib/minorwire/provision/types'

const syne = Syne({ subsets: ['latin'], weight: ['600', '700', '800'] })
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] })

type FormState = {
  region: string
  tenancyOcid: string
  compartmentOcid: string
  userOcid: string
  fingerprint: string
  privateKeyPem: string
  peerName: string
  /** Compartment *name* used only inside the IAM policy text (not submitted to provision API). */
  policyCompartmentName: string
}

const emptyForm: FormState = {
  region: 'ap-tokyo-1',
  tenancyOcid: '',
  compartmentOcid: '',
  userOcid: '',
  fingerprint: '',
  privateKeyPem: '',
  peerName: 'device1',
  policyCompartmentName: '',
}

type FieldHelp = {
  key: keyof FormState
  label: string
  placeholder: string
  where: string
  required?: boolean
}

const SUBMIT_FIELDS: FieldHelp[] = [
  {
    key: 'region',
    label: '1. Home region',
    placeholder: 'ap-tokyo-1',
    where:
      'Oracle Console top-right region menu, or Administration → Tenancy Details → Home Region. Always Free must use your home region (example: ap-tokyo-1).',
  },
  {
    key: 'tenancyOcid',
    label: '2. Tenancy OCID',
    placeholder: 'ocid1.tenancy.oc1..aaaa...',
    where:
      'Profile menu (person icon, top-right) → Tenancy → copy OCID. Starts with ocid1.tenancy.oc1..',
  },
  {
    key: 'compartmentOcid',
    label: '3. Compartment OCID (where the VM will be created)',
    placeholder: 'ocid1.tenancy.oc1.. OR ocid1.compartment.oc1..',
    where:
      'Identity → Compartments. For beginners pick the root row (same OCID as tenancy is OK). Copy that OCID. This is NOT the word Target Compartment.',
  },
  {
    key: 'userOcid',
    label: '4. User OCID (API user)',
    placeholder: 'ocid1.user.oc1..aaaa...',
    where:
      'Identity → Users → open the API user (e.g. minorwire) → copy OCID. Starts with ocid1.user.oc1..',
  },
  {
    key: 'fingerprint',
    label: '5. API key fingerprint',
    placeholder: 'aa:bb:cc:dd:...',
    where:
      'Same user → Resources → API Keys → copy Fingerprint (looks like aa:bb:cc:...).',
  },
  {
    key: 'peerName',
    label: '6. First device name (for the .conf file name)',
    placeholder: 'phone',
    where: 'Any short name you like (letters/numbers). Example: phone, laptop.',
    required: false,
  },
]

function SetupInner() {
  const params = useSearchParams()
  const sessionId = params.get('session_id')?.trim() ?? ''
  const [gate, setGate] = useState<'loading' | 'ok' | 'bad'>('loading')
  const [gateError, setGateError] = useState('')
  const [sku, setSku] = useState('')
  const [form, setForm] = useState<FormState>(emptyForm)
  const [job, setJob] = useState<JobPublicStatus | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [extraPeerName, setExtraPeerName] = useState('device2')
  const [peerBusy, setPeerBusy] = useState(false)
  const [peerError, setPeerError] = useState('')
  const [copiedPolicy, setCopiedPolicy] = useState(false)

  useEffect(() => {
    if (!sessionId) {
      setGate('bad')
      setGateError('Missing session_id. Complete PayNow checkout first.')
      return
    }
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(`/api/minorwire/session?session_id=${encodeURIComponent(sessionId)}`)
        const data = await res.json()
        if (cancelled) return
        if (!res.ok) {
          setGate('bad')
          setGateError(data.error || 'Payment not verified')
          return
        }
        setSku(data.sku || '')
        if (data.job) setJob(data.job)
        setGate('ok')
      } catch {
        if (!cancelled) {
          setGate('bad')
          setGateError('Could not verify payment')
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [sessionId])

  useEffect(() => {
    if (!job || !sessionId) return
    if (job.phase === 'done' || job.phase === 'error') return
    const t = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/minorwire/jobs/${encodeURIComponent(job.id)}?session_id=${encodeURIComponent(sessionId)}`,
        )
        const data = await res.json()
        if (res.ok && data.job) setJob(data.job)
      } catch {
        /* ignore poll errors */
      }
    }, 4000)
    return () => clearInterval(t)
  }, [job, sessionId])

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!sessionId || submitting) return
      setSubmitting(true)
      setSubmitError('')
      try {
        const res = await fetch('/api/minorwire/jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            peerName: form.peerName,
            region: form.region,
            tenancyOcid: form.tenancyOcid,
            compartmentOcid: form.compartmentOcid,
            userOcid: form.userOcid,
            fingerprint: form.fingerprint,
            privateKeyPem: form.privateKeyPem,
          }),
        })
        const data = await res.json()
        if (!res.ok) {
          setSubmitError(data.error || 'Failed to start')
          return
        }
        setJob(data.job)
      } catch {
        setSubmitError('Network error')
      } finally {
        setSubmitting(false)
      }
    },
    [sessionId, submitting, form],
  )

  const onAddPeer = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!sessionId || peerBusy) return
      setPeerBusy(true)
      setPeerError('')
      try {
        const res = await fetch('/api/minorwire/peers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, peerName: extraPeerName }),
        })
        const data = await res.json()
        if (!res.ok) {
          setPeerError(data.error || 'Failed to add device config')
          return
        }
        if (data.job) setJob(data.job)
        setExtraPeerName((n) => {
          const m = /^(.+?)(\d+)$/.exec(n)
          if (m) return `${m[1]}${Number(m[2]) + 1}`
          return `${n}2`
        })
      } catch {
        setPeerError('Network error')
      } finally {
        setPeerBusy(false)
      }
    },
    [sessionId, peerBusy, extraPeerName],
  )

  const set =
    (key: keyof FormState) => (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: ev.target.value }))

  const policyName = form.policyCompartmentName.trim() || 'REPLACE_WITH_COMPARTMENT_NAME'
  const policy = buildIamPolicy(policyName)
  const running = job && job.phase !== 'done' && job.phase !== 'error'
  const showForm = gate === 'ok' && (!job || job.phase === 'error')

  const copyPolicy = async () => {
    try {
      await navigator.clipboard.writeText(policy)
      setCopiedPolicy(true)
      setTimeout(() => setCopiedPolicy(false), 2000)
    } catch {
      /* ignore */
    }
  }

  return (
    <div className={`${dmSans.className} min-h-screen bg-[#f3f6f4] text-[#14201a]`}>
      <div className="max-w-3xl mx-auto px-4 py-16">
        <p className="text-sm font-medium tracking-[0.18em] uppercase text-[#2f6b4f] mb-3">
          MinorWire setup
        </p>
        <h1 className={`${syne.className} text-4xl font-extrabold mb-2`}>Fill these values only</h1>
        <p className="text-[#3a4f44] mb-8 leading-relaxed">
          You paste credentials once. We create one Always Free WireGuard server. Afterwards you can
          mint more device .conf files. OCI API keys are not stored.
        </p>

        {gate === 'loading' && <p>Verifying payment…</p>}
        {gate === 'bad' && (
          <div className="border border-red-300 bg-red-50 p-4 rounded-md">
            <p className="font-semibold text-red-800">Cannot start setup</p>
            <p className="text-red-700 mt-1">{gateError}</p>
            <Link href="/minorwire" className="underline mt-3 inline-block">
              Back to MinorWire
            </Link>
          </div>
        )}

        {gate === 'ok' && (
          <>
            <p className="text-sm text-[#5a6f64] mb-6">
              Purchase: <span className="font-mono">{sku}</span>
            </p>

            {job && (
              <div className="mb-8 border border-[#1d3d2e]/15 bg-white p-5 rounded-md">
                <p className={`${syne.className} font-bold text-lg`}>Status: {job.phase}</p>
                <p className="text-[#3a4f44] mt-1">{job.message}</p>
                {job.publicIp && (
                  <p className="mt-2 text-sm font-mono text-[#2f6b4f]">Public IP: {job.publicIp}</p>
                )}
                {job.error && <p className="mt-2 text-sm text-red-700 whitespace-pre-wrap">{job.error}</p>}
                {running && (
                  <p className="mt-3 text-sm text-[#5a6f64]">Working… this can take several minutes.</p>
                )}
                {job.phase === 'done' && (
                  <div className="mt-4 space-y-6">
                    <p className="text-sm text-[#5a6f64]">
                      OCI server for this purchase is fixed (one server). Device .conf files can be
                      added below anytime.
                    </p>
                    {(job.peers?.length
                      ? job.peers
                      : job.peerConf
                        ? [{ name: job.peerName || 'device', conf: job.peerConf, createdAt: job.createdAt }]
                        : []
                    ).map((p) => (
                      <div key={p.name}>
                        <p className="font-semibold mb-2">WireGuard config ({p.name})</p>
                        <textarea
                          readOnly
                          className="w-full h-36 font-mono text-xs p-3 border border-[#1d3d2e]/20 rounded bg-[#f7faf8]"
                          value={p.conf}
                        />
                        <a
                          className="mt-2 inline-flex px-4 py-2 bg-[#1d3d2e] text-white rounded-md font-semibold text-sm"
                          href={`data:text/plain;charset=utf-8,${encodeURIComponent(p.conf)}`}
                          download={`${p.name}.conf`}
                        >
                          Download {p.name}.conf
                        </a>
                      </div>
                    ))}
                    <form onSubmit={onAddPeer} className="border-t border-[#1d3d2e]/10 pt-4 space-y-3">
                      <p className="font-semibold">Add another device .conf</p>
                      <input
                        className="w-full border px-3 py-2 rounded"
                        value={extraPeerName}
                        onChange={(e) => setExtraPeerName(e.target.value)}
                        placeholder="iphone"
                        required
                      />
                      {peerError && <p className="text-sm text-red-700">{peerError}</p>}
                      <button
                        type="submit"
                        disabled={peerBusy}
                        className="px-5 py-2.5 rounded-md border border-[#1d3d2e] font-semibold disabled:opacity-60"
                      >
                        {peerBusy ? 'Adding…' : 'Create device config'}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}

            {showForm && (
              <div className="space-y-8">
                <section className="border border-amber-700/30 bg-amber-50 p-5 rounded-md">
                  <h2 className={`${syne.className} text-xl font-bold mb-2`}>
                    What was &quot;Target Compartment&quot;?
                  </h2>
                  <p className="text-[#3a4f44] leading-relaxed">
                    It is <strong>not</strong> a value you paste into the form below. It was only a
                    placeholder inside the IAM policy text. In Oracle, a compartment is a folder for
                    resources. Beginners: use the <strong>root</strong> compartment (its Name is
                    often your tenancy name; its OCID is often the same as Tenancy OCID).
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className={`${syne.className} text-2xl font-bold`}>A. Prepare in Oracle (once)</h2>
                  <ol className="list-decimal pl-5 space-y-2 text-[#3a4f44]">
                    <li>
                      Open{' '}
                      <a className="underline" href="https://cloud.oracle.com" target="_blank" rel="noreferrer">
                        cloud.oracle.com
                      </a>{' '}
                      and sign in.
                    </li>
                    <li>
                      Identity → Domains → your domain → Groups → create group <code>MinorWire</code>.
                    </li>
                    <li>
                      Identity → Domains → Users → create user for API access → add to group{' '}
                      <code>MinorWire</code>.
                    </li>
                    <li>
                      Identity → Policies → create a policy and paste the text from section B.
                    </li>
                    <li>
                      That user → API Keys → Add API Key → download the private key (.pem) once.
                    </li>
                  </ol>

                  <div className="grid gap-4">
                    <figure className="border border-[#1d3d2e]/10 bg-white rounded-md overflow-hidden">
                      <Image
                        src="/minorwire/guide/tenancy-ocid.png"
                        alt="Where to copy Tenancy OCID in Oracle Console"
                        width={1280}
                        height={720}
                        className="w-full h-auto"
                      />
                      <figcaption className="p-3 text-sm text-[#5a6f64]">
                        Tenancy OCID (blurred). Profile → Tenancy → OCID.
                      </figcaption>
                    </figure>
                    <figure className="border border-[#1d3d2e]/10 bg-white rounded-md overflow-hidden">
                      <Image
                        src="/minorwire/guide/compartment.png"
                        alt="Where to find compartment name and OCID"
                        width={1280}
                        height={720}
                        className="w-full h-auto"
                      />
                      <figcaption className="p-3 text-sm text-[#5a6f64]">
                        Compartment list: Name is for the policy text; OCID is field 3 below.
                      </figcaption>
                    </figure>
                    <figure className="border border-[#1d3d2e]/10 bg-white rounded-md overflow-hidden">
                      <Image
                        src="/minorwire/guide/api-keys.png"
                        alt="Where to copy User OCID, fingerprint, and download PEM"
                        width={1280}
                        height={720}
                        className="w-full h-auto"
                      />
                      <figcaption className="p-3 text-sm text-[#5a6f64]">
                        User OCID + API key fingerprint + private key download.
                      </figcaption>
                    </figure>
                  </div>
                </section>

                <section className="border border-[#1d3d2e]/15 bg-white/80 p-6 rounded-md space-y-3">
                  <h2 className={`${syne.className} text-2xl font-bold`}>B. IAM policy (copy into Oracle)</h2>
                  <p className="text-sm text-[#3a4f44]">
                    Type the compartment <strong>Name</strong> (not OCID) so the policy text updates.
                    Then copy the box into Oracle → Identity → Policies.
                  </p>
                  <label className="block text-sm font-medium">
                    Compartment name for policy text only
                  </label>
                  <input
                    className="w-full border px-3 py-2 rounded"
                    value={form.policyCompartmentName}
                    onChange={set('policyCompartmentName')}
                    placeholder="root compartment name (often your tenancy name)"
                    autoComplete="off"
                  />
                  <textarea
                    readOnly
                    className="w-full h-40 font-mono text-xs p-3 border rounded bg-[#f7faf8]"
                    value={policy}
                  />
                  <button
                    type="button"
                    onClick={copyPolicy}
                    className="px-4 py-2 rounded-md border border-[#1d3d2e] font-semibold text-sm"
                  >
                    {copiedPolicy ? 'Copied' : 'Copy policy'}
                  </button>
                </section>

                <form
                  onSubmit={onSubmit}
                  className="space-y-5 border border-[#1d3d2e]/15 bg-white/80 p-6 rounded-md"
                >
                  <h2 className={`${syne.className} text-2xl font-bold`}>C. Paste into this form</h2>
                  <p className="text-sm text-[#5a6f64]">
                    Only these fields are sent to create the VPN. Nothing else.
                  </p>

                  {SUBMIT_FIELDS.map((f) => (
                    <div key={f.key}>
                      <label className="block text-sm font-medium mb-1">{f.label}</label>
                      <p className="text-xs text-[#5a6f64] mb-2 leading-relaxed">{f.where}</p>
                      <input
                        required={f.required !== false}
                        className="w-full border px-3 py-2 rounded font-mono text-sm"
                        value={form[f.key]}
                        onChange={set(f.key)}
                        placeholder={f.placeholder}
                        autoComplete="off"
                      />
                    </div>
                  ))}

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      7. API private key (PEM file contents)
                    </label>
                    <p className="text-xs text-[#5a6f64] mb-2 leading-relaxed">
                      Open the downloaded .pem in Notepad and paste everything, including BEGIN /
                      END lines.
                    </p>
                    <textarea
                      required
                      className="w-full h-40 font-mono text-xs p-3 border rounded"
                      value={form.privateKeyPem}
                      onChange={set('privateKeyPem')}
                      placeholder="-----BEGIN PRIVATE KEY-----"
                      autoComplete="off"
                    />
                  </div>

                  {submitError && <p className="text-red-700 text-sm">{submitError}</p>}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-3 rounded-md bg-[#1d3d2e] text-white font-semibold disabled:opacity-60"
                  >
                    {submitting ? 'Starting…' : 'Create VPN'}
                  </button>
                </form>
              </div>
            )}
          </>
        )}

        <p className="mt-10 text-sm text-[#5a6f64]">
          <Link href="/minorwire" className="underline">
            Back to MinorWire
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function MinorWireSetupPage() {
  return (
    <Suspense fallback={<div className="p-10">Loading…</div>}>
      <SetupInner />
    </Suspense>
  )
}
