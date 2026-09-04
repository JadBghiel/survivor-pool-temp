'use client'

import { useCallback, useState } from 'react'
import JobsMap from '@/app/JobsMapClient'

// summary shape, flattened by page.tsx before it crosses into the client
export type BoardJob = {
  id: string
  title: string
  company: string
  city: string
  contractType: string
  latitude: number
  longitude: number
}

type JobDetail = BoardJob & {
  description: string
  address: string
  postalCode: string
  radiusKm: number
  createdAt: string
}

const CONTRACT_LABELS: Record<string, string> = {
  CDI: 'CDI',
  CDD: 'CDD',
  INTERNSHIP: 'Stage',
  APPRENTICESHIP: 'Alternance',
  FREELANCE: 'Freelance',
}

// the seeded seeker profile, so the application flow shows a filled-in candidate
// instead of empty fields
const DEMO_CANDIDATE = {
  firstName: 'Camille',
  lastName: 'Fabre',
  email: 'camille.fabre@example.fr',
  headline: 'Chargée de projet logistique, 4 ans d’expérience',
}

type ApplyStep = 'closed' | 'profile' | 'message' | 'sent'

export function JobsBoard({ jobs }: { jobs: BoardJob[] }) {
  const [detail, setDetail] = useState<JobDetail | null>(null)
  const [isLoadingDetail, setIsLoadingDetail] = useState(false)
  const [applyStep, setApplyStep] = useState<ApplyStep>('closed')
  const [motivation, setMotivation] = useState(
    "Bonjour,\n\nVotre offre correspond précisément à mon parcours : quatre ans en coordination logistique, dont deux sur un site de taille comparable. Je serais ravie d'en échanger avec vous.\n\nCamille Fabre",
  )

  const openDetail = useCallback(async (id: string) => {
    setIsLoadingDetail(true)
    try {
      const res = await fetch(`/api/jobs/${id}`)
      if (res.ok) setDetail(await res.json())
    } finally {
      setIsLoadingDetail(false)
    }
  }, [])

  const closeAll = () => {
    setDetail(null)
    setApplyStep('closed')
  }

  return (
    <>
      {/* mobile: map above, list below (source order). desktop (lg+): list
          becomes a left sidebar next to the map, via lg:order only - the dom
          order stays map-then-list so mobile is untouched */}
      <div className="lg:flex lg:items-start lg:gap-6">
        <div className="lg:order-2 lg:min-w-0 lg:flex-1">
          <JobsMap jobs={jobs} onSelectJob={openDetail} />
        </div>

        {jobs.length === 0 ? (
          <p className="mt-4 rounded-lg border border-dashed border-neutral-300 p-6 text-sm text-neutral-600 dark:border-neutral-700 dark:text-neutral-400 lg:order-1 lg:mt-0 lg:w-80 lg:shrink-0">
            Aucune offre. Lancez <code className="font-mono">npx prisma db seed</code> pour peupler la base.
          </p>
        ) : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:order-1 lg:mt-0 lg:sticky lg:top-4 lg:grid-cols-1 lg:w-80 lg:max-h-[calc(100vh-2rem)] lg:shrink-0 lg:overflow-y-auto lg:pr-1">
            {jobs.map((job) => (
              <li key={job.id}>
                <button
                  type="button"
                  onClick={() => openDetail(job.id)}
                  className="w-full rounded-lg border border-neutral-200 p-4 text-left transition-colors hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600"
                >
                  <span className="inline-block rounded bg-neutral-100 px-1.5 py-0.5 text-[11px] font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                    {CONTRACT_LABELS[job.contractType] ?? job.contractType}
                  </span>
                  <h2 className="mt-2 font-medium leading-snug">{job.title}</h2>
                  <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                    {job.company} | {job.city}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {isLoadingDetail && !detail && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/40">
          <p className="rounded-lg bg-white px-4 py-2 text-sm dark:bg-neutral-900">Chargement de l’offre…</p>
        </div>
      )}

      {/* fiche détaillée d'une offre */}
      {detail && applyStep === 'closed' && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span
                  className="inline-block rounded px-2 py-0.5 text-[11px] font-semibold text-white"
                  style={{ backgroundColor: '#1B3A6B' }}
                >
                  {CONTRACT_LABELS[detail.contractType] ?? detail.contractType}
                </span>
                <h2 className="mt-2 text-xl font-semibold leading-tight">{detail.title}</h2>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                  {detail.company}
                </p>
              </div>
              <button
                onClick={closeAll}
                className="shrink-0 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
              >
                ✕
              </button>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-y border-neutral-200 py-4 text-sm dark:border-neutral-800">
              <div>
                <dt className="text-xs uppercase tracking-wide text-neutral-500">Lieu</dt>
                <dd className="mt-0.5">
                  {detail.address}, {detail.postalCode} {detail.city}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-neutral-500">Rayon de diffusion</dt>
                <dd className="mt-0.5">{detail.radiusKm} km</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-neutral-500">Contrat</dt>
                <dd className="mt-0.5">{CONTRACT_LABELS[detail.contractType] ?? detail.contractType}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-neutral-500">Publiée le</dt>
                <dd className="mt-0.5">
                  {new Date(detail.createdAt).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </dd>
              </div>
            </dl>

            <div className="mt-5 whitespace-pre-line text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
              {detail.description}
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={closeAll}
                className="rounded-md px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
              >
                Fermer
              </button>
              <button
                onClick={() => setApplyStep('profile')}
                className="rounded-md px-4 py-2 text-sm font-medium text-white"
                style={{ backgroundColor: '#1B3A6B' }}
              >
                Postuler à cette offre
              </button>
            </div>
          </div>
        </div>
      )}

      {/* parcours de candidature, 3 étapes */}
      {detail && applyStep !== 'closed' && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Candidature</h2>
                <p className="mt-0.5 text-sm text-neutral-600 dark:text-neutral-400">
                  {detail.title} — {detail.company}
                </p>
              </div>
              <button
                onClick={closeAll}
                className="shrink-0 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
              >
                ✕
              </button>
            </div>

            {/* stepper */}
            <ol className="mt-5 flex items-center gap-2 text-xs">
              {(['profile', 'message', 'sent'] as const).map((step, i) => {
                const order = ['profile', 'message', 'sent']
                const isDone = order.indexOf(applyStep) > i
                const isCurrent = applyStep === step
                return (
                  <li key={step} className="flex flex-1 items-center gap-2">
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white"
                      style={{ backgroundColor: isDone || isCurrent ? '#1B3A6B' : '#9CA3AF' }}
                    >
                      {i + 1}
                    </span>
                    <span className={isCurrent ? 'font-medium' : 'text-neutral-500'}>
                      {['Profil', 'Message', 'Envoyée'][i]}
                    </span>
                    {i < 2 && <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700" />}
                  </li>
                )
              })}
            </ol>

            {applyStep === 'profile' && (
              <div className="mt-5 space-y-4">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Votre profil sera transmis à l’employeur avec votre candidature.
                </p>
                <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
                  <p className="font-medium">
                    {DEMO_CANDIDATE.firstName} {DEMO_CANDIDATE.lastName}
                  </p>
                  <p className="mt-0.5 text-sm text-neutral-600 dark:text-neutral-400">
                    {DEMO_CANDIDATE.headline}
                  </p>
                  <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                    {DEMO_CANDIDATE.email}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {['Logistique', 'Gestion de projet', 'Excel', 'SAP'].map((skill) => (
                      <span
                        key={skill}
                        className="rounded bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setApplyStep('closed')}
                    className="rounded-md px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                  >
                    Retour à l’offre
                  </button>
                  <button
                    onClick={() => setApplyStep('message')}
                    className="rounded-md px-4 py-2 text-sm font-medium text-white"
                    style={{ backgroundColor: '#1B3A6B' }}
                  >
                    Continuer
                  </button>
                </div>
              </div>
            )}

            {applyStep === 'message' && (
              <div className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400">
                    Message à l’employeur
                  </label>
                  <textarea
                    rows={7}
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    className="mt-1 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm leading-relaxed dark:border-neutral-700"
                  />
                </div>
                <div className="rounded-md border border-dashed border-neutral-300 p-3 text-sm text-neutral-600 dark:border-neutral-700 dark:text-neutral-400">
                  CV joint : <span className="font-medium">CV_Camille_Fabre.pdf</span>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setApplyStep('profile')}
                    className="rounded-md px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                  >
                    Retour
                  </button>
                  <button
                    onClick={() => setApplyStep('sent')}
                    className="rounded-md px-4 py-2 text-sm font-medium text-white"
                    style={{ backgroundColor: '#1B3A6B' }}
                  >
                    Envoyer ma candidature
                  </button>
                </div>
              </div>
            )}

            {applyStep === 'sent' && (
              <div className="mt-5 space-y-4 text-center">
                <div
                  className="mx-auto flex h-12 w-12 items-center justify-center rounded-full text-2xl text-white"
                  style={{ backgroundColor: '#1B3A6B' }}
                >
                  ✓
                </div>
                <p className="font-medium">Candidature envoyée</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {detail.company} a reçu votre profil et votre message pour l’offre «&nbsp;{detail.title}&nbsp;».
                  Vous pouvez suivre son avancement depuis votre espace candidatures.
                </p>
                <button
                  onClick={closeAll}
                  className="mx-auto block rounded-md px-4 py-2 text-sm font-medium text-white"
                  style={{ backgroundColor: '#1B3A6B' }}
                >
                  Terminer
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
