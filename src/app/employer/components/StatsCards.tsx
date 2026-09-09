'use client'

export type Stats = {
  totalJobs: number
  activeJobs: number
  pendingJobs: number
  totalViews: number
  totalApplications: number
}

export default function StatsCards({
  stats,
  applicationsAvailable,
}: {
  stats: Stats
  applicationsAvailable: boolean
}) {
  const cards = [
    { title: 'Offres publiées', value: stats.activeJobs, sub: `${stats.totalJobs} au total`, color: 'text-emerald-600 dark:text-emerald-400' },
    { title: 'En attente de modération', value: stats.pendingJobs, sub: 'Visibles une fois validées', color: 'text-amber-500' },
    { title: 'Vues cumulées', value: stats.totalViews, sub: 'Toutes offres confondues', color: '' },
    {
      title: 'Candidatures reçues',
      value: applicationsAvailable ? stats.totalApplications : '—',
      sub: applicationsAvailable ? 'Toutes offres confondues' : 'Fonctionnalité pas encore disponible',
      color: applicationsAvailable ? '' : 'text-neutral-400',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <div key={c.title} className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-xs font-medium text-neutral-500">{c.title}</p>
          <p className={`mt-2 text-3xl font-extrabold ${c.color}`}>{c.value}</p>
          <p className="mt-1 text-xs text-neutral-400">{c.sub}</p>
        </div>
      ))}
    </div>
  )
}
