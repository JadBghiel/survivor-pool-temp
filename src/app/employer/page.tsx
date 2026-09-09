'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import StatsCards, { Stats } from './components/StatsCards'
import JobsTable, { DashboardJob } from './components/JobsTable'

export default function EmployerDashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Stats | null>(null)
  const [jobs, setJobs] = useState<DashboardJob[]>([])
  const [applicationsAvailable, setApplicationsAvailable] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return router.push('/')

    fetch('/api/employer/dashboard', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        setStats(data.stats)
        setJobs(data.jobs ?? [])
        setApplicationsAvailable(data.applicationsAvailable ?? false)
        setLoading(false)
      })
      .catch(() => router.push('/'))
  }, [router])

  if (loading || !stats) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <p className="animate-pulse text-sm font-medium text-neutral-500">Chargement du tableau de bord...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <header className="border-b border-neutral-200 bg-white px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h1 className="text-lg font-bold">Tableau de bord employeur</h1>
          <button
            onClick={() => router.push('/')}
            className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            ← Retour au site
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 p-6">
        <StatsCards stats={stats} applicationsAvailable={applicationsAvailable} />

        {!applicationsAvailable && (
          <p className="rounded-lg border border-neutral-200 bg-white p-4 text-xs text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
            Le WAITING ON EMMAS PART FOR THE SUIVI DES CANDIDATURE I CANT WIRE IT RN.
          </p>
        )}

        <JobsTable jobs={jobs} applicationsAvailable={applicationsAvailable} />
      </main>
    </div>
  )
}
