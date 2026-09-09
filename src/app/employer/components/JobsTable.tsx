'use client'

export type DashboardJob = {
  id: string
  title: string
  city: string
  contractType: string
  status: 'PUBLISHED' | 'PENDING' | 'FLAGGED'
  viewCount: number
  applicationCount: number
  archived: boolean
  publishedAt: string
}

const STATUS_STYLES: Record<DashboardJob['status'], string> = {
  PUBLISHED: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400',
  PENDING: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400',
  FLAGGED: 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-400',
}

const STATUS_LABELS: Record<DashboardJob['status'], string> = {
  PUBLISHED: 'Publiée',
  PENDING: 'En attente',
  FLAGGED: 'Signalée',
}

export default function JobsTable({
  jobs,
  applicationsAvailable,
}: {
  jobs: DashboardJob[]
  applicationsAvailable: boolean
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
        <h2 className="text-base font-bold">Mes offres</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-500 dark:border-neutral-800 dark:bg-neutral-800/50 dark:text-neutral-400">
            <tr>
              <th className="px-6 py-3 font-semibold">Intitulé</th>
              <th className="px-6 py-3 font-semibold">Commune</th>
              <th className="px-6 py-3 font-semibold">Contrat</th>
              <th className="px-6 py-3 font-semibold">Publiée le</th>
              <th className="px-6 py-3 font-semibold">Statut</th>
              <th className="px-6 py-3 font-semibold text-right">Vues</th>
              <th className="px-6 py-3 font-semibold text-right">Candidatures</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {jobs.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-neutral-500">
                  Aucune offre publiée pour le moment.
                </td>
              </tr>
            ) : (
              jobs.map((j) => (
                <tr key={j.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30">
                  <td className="px-6 py-4 font-medium">
                    {j.title}
                    {j.archived && (
                      <span className="ml-2 rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                        archivée
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">{j.city}</td>
                  <td className="px-6 py-4 font-mono text-[11px]">{j.contractType}</td>
                  <td className="px-6 py-4 text-neutral-500">{j.publishedAt}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${STATUS_STYLES[j.status]}`}>
                      {STATUS_LABELS[j.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-semibold">{j.viewCount}</td>
                  <td className="px-6 py-4 text-right text-neutral-400">
                    {applicationsAvailable ? j.applicationCount : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
