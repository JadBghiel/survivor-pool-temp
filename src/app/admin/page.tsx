'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import OverviewTab from './components/OverviewTab'
import UserTab, { UserItem } from './components/UserTab'
import JobTab, { JobItem } from './components/JobTab'
import LogTab, { ActivityLog } from './components/LogTab'

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'jobs' | 'logs'>('overview')
  const [users, setUsers] = useState<UserItem[]>([])
  const [jobs, setJobs] = useState<JobItem[]>([])
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return router.push('/')

    fetch('/api/admin/overview', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        setUsers(data.users ?? [])
        setJobs(data.jobs ?? [])
        setLogs(data.logs ?? [])
        setLoading(false)
      })
      .catch(() => router.push('/'))
  }, [router])

  const patchStatus = async (endpoint: string, body: object, onSuccess: () => void) => {
    setError(null)
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Action failed')
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed')
    }
  }

  // Derived stats directly from state — 0 extra state variables or counter math required
  const stats = {
    totalUsers: users.length,
    seekers: users.filter((u) => u.role === 'SEEKER').length,
    employers: users.filter((u) => u.role === 'EMPLOYER').length,
    admins: users.filter((u) => u.role === 'ADMIN').length,
    activeJobs: jobs.filter((j) => j.status === 'PUBLISHED').length,
    pendingJobs: jobs.filter((j) => j.status === 'PENDING').length,
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <p className="animate-pulse text-sm font-medium text-neutral-500">
          Authenticating administrator access...
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <header className="border-b border-neutral-200 bg-white px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="rounded bg-red-600 px-2.5 py-1 text-xs font-bold text-white uppercase tracking-wider">
              Admin Mode
            </span>
            <h1 className="text-lg font-bold">Platform Control Panel</h1>
          </div>
          <button
            onClick={() => router.push('/')}
            className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            ← Back to Main App
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-6">
        {error && (
          <div className="mb-4 rounded-lg bg-red-100 p-3 text-xs font-medium text-red-800 dark:bg-red-950/80 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="mb-6 flex space-x-2 border-b border-neutral-200 pb-2 dark:border-neutral-800">
          {[
            { key: 'overview', label: 'System Overview' },
            { key: 'users', label: 'User Management' },
            { key: 'jobs', label: 'Job Moderation' },
            { key: 'logs', label: 'Audit Logs' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setError(null); setActiveTab(tab.key as typeof activeTab) }}
              className={`rounded-md px-4 py-2 text-xs font-semibold transition-colors ${
                activeTab === tab.key
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                  : 'text-neutral-600 hover:bg-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && <OverviewTab stats={stats} />}
        {activeTab === 'users' && (
          <UserTab
            users={users}
            onToggleStatus={(id, current) =>
              patchStatus(`/api/admin/users/${id}/status`, { status: current === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' }, () =>
                setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: current === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' } : u)))
              )
            }
          />
        )}
        {activeTab === 'jobs' && (
          <JobTab
            jobs={jobs}
            onUpdateStatus={(id, status) =>
              patchStatus(`/api/admin/jobs/${id}/status`, { status }, () =>
                setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status } : j)))
              )
            }
          />
        )}
        {activeTab === 'logs' && <LogTab logs={logs} />}
      </main>
    </div>
  )
}