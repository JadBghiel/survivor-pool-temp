'use client'

type Stats = { totalUsers: number; seekers: number; employers: number; admins: number; activeJobs: number; pendingJobs: number }

export default function OverviewTab({ stats }: { stats: Stats }) {
  const cards = [
    { title: 'Total Users', value: stats.totalUsers, sub: `${stats.seekers} Seekers · ${stats.employers} Employers`, color: '' },
    { title: 'Active Listings', value: stats.activeJobs, sub: 'Published and broadcasting', color: 'text-emerald-600 dark:text-emerald-400' },
    { title: 'Pending Review', value: stats.pendingJobs, sub: 'Awaiting moderation approval', color: 'text-amber-500' },
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
      <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <p className="text-xs font-medium text-neutral-500">Platform Status</p>
        <div className="mt-2 flex items-center space-x-2">
          <span className="h-3 w-3 rounded-full bg-emerald-500" />
          <span className="text-lg font-bold">Healthy</span>
        </div>
        <p className="mt-1 text-xs text-neutral-400">Database & Auth Operational</p>
      </div>
    </div>
  )
}