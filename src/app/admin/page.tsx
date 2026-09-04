'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type UserRole = 'SEEKER' | 'EMPLOYER' | 'ADMIN'

type UserItem = {
  id: string
  email: string
  role: UserRole
  createdAt: string
  status: 'ACTIVE' | 'SUSPENDED'
  seekerProfile?: { firstName: string; lastName: string } | null
  employerProfile?: { companyName: string } | null
}

type JobItem = {
  id: string
  title: string
  company: string
  city: string
  contractType: string
  status: 'PUBLISHED' | 'PENDING' | 'FLAGGED'
  publishedAt: string
}

type ActivityLog = {
  id: string
  action: string
  target: string
  timestamp: string
  actor: string
}

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'jobs' | 'logs'>('overview')

  // Mock data for demonstration - replace with your API fetches
  const [stats, setStats] = useState({
    totalUsers: 1248,
    seekers: 980,
    employers: 265,
    admins: 3,
    activeJobs: 142,
    pendingJobs: 8,
  })

  const [users, setUsers] = useState<UserItem[]>([
    {
      id: 'usr_1',
      email: 'john.doe@example.com',
      role: 'SEEKER',
      status: 'ACTIVE',
      createdAt: '2026-08-12',
      seekerProfile: { firstName: 'John', lastName: 'Doe' },
    },
    {
      id: 'usr_2',
      email: 'contact@techsolutions.com',
      role: 'EMPLOYER',
      status: 'ACTIVE',
      createdAt: '2026-08-15',
      employerProfile: { companyName: 'Tech Solutions' },
    },
    {
      id: 'usr_3',
      email: 'spam.user@example.com',
      role: 'SEEKER',
      status: 'SUSPENDED',
      createdAt: '2026-08-28',
      seekerProfile: { firstName: 'Spam', lastName: 'Account' },
    },
  ])

  const [jobs, setJobs] = useState<JobItem[]>([
    {
      id: 'job_101',
      title: 'Full Stack Engineer',
      company: 'Tech Solutions',
      city: 'Nantes',
      contractType: 'CDI',
      status: 'PUBLISHED',
      publishedAt: '2026-08-30',
    },
    {
      id: 'job_102',
      title: 'Marketing Specialist',
      company: 'Growth Agency',
      city: 'Paris',
      contractType: 'CDD',
      status: 'PENDING',
      publishedAt: '2026-09-01',
    },
    {
      id: 'job_103',
      title: 'Urgent Data Analyst',
      company: 'Unknown LLC',
      city: 'Remote',
      contractType: 'FREELANCE',
      status: 'FLAGGED',
      publishedAt: '2026-09-02',
    },
  ])

  const [logs] = useState<ActivityLog[]>([
    {
      id: 'log_1',
      action: 'USER_SUSPENDED',
      target: 'spam.user@example.com',
      timestamp: '2026-09-03 14:22',
      actor: 'testAdmin@gmail.com',
    },
    {
      id: 'log_2',
      action: 'JOB_FLAGGED',
      target: 'Job #job_103 (Urgent Data Analyst)',
      timestamp: '2026-09-02 09:15',
      actor: 'Automated Shield',
    },
    {
      id: 'log_3',
      action: 'ROLE_CHANGED',
      target: 'contact@techsolutions.com -> EMPLOYER',
      timestamp: '2026-08-15 11:04',
      actor: 'System',
    },
  ])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/')
      return
    }

    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.role === 'ADMIN') {
          setIsAdmin(true)
        } else {
          router.push('/')
        }
      })
      .catch(() => {
        router.push('/')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [router])

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' }
          : u
      )
    );
  }

  const updateJobStatus = (jobId: string, status: JobItem['status']) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status } : j))
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <p className="text-sm font-medium text-neutral-500 animate-pulse">
          Authenticating administrator access...
        </p>
      </div>
    )
  }

  if (!isAdmin) return null

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      {/* Top Header Bar */}
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
        {/* Navigation Tabs */}
        <div className="mb-6 flex space-x-2 border-b border-neutral-200 pb-2 dark:border-neutral-800">
          {[
            { key: 'overview', label: 'System Overview' },
            { key: 'users', label: 'User Management' },
            { key: 'jobs', label: 'Job Moderation' },
            { key: 'logs', label: 'Audit Logs' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
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

        {/* Tab 1: System Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <p className="text-xs font-medium text-neutral-500">Total Users</p>
                <p className="mt-2 text-3xl font-extrabold">{stats.totalUsers}</p>
                <p className="mt-1 text-xs text-neutral-400">
                  {stats.seekers} Seekers · {stats.employers} Employers
                </p>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <p className="text-xs font-medium text-neutral-500">Active Listings</p>
                <p className="mt-2 text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {stats.activeJobs}
                </p>
                <p className="mt-1 text-xs text-neutral-400">Published and broadcasting</p>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <p className="text-xs font-medium text-neutral-500">Pending Review</p>
                <p className="mt-2 text-3xl font-extrabold text-amber-500">
                  {stats.pendingJobs}
                </p>
                <p className="mt-1 text-xs text-neutral-400">Awaiting moderation approval</p>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <p className="text-xs font-medium text-neutral-500">Platform Status</p>
                <div className="mt-2 flex items-center space-x-2">
                  <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
                  <span className="text-lg font-bold">Healthy</span>
                </div>
                <p className="mt-1 text-xs text-neutral-400">Database & Auth Operational</p>
              </div>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <h2 className="text-sm font-bold">Quick Administration Actions</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveTab('jobs')}
                  className="rounded-lg bg-neutral-900 px-4 py-2 text-xs font-medium text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900"
                >
                  Review Pending Jobs ({stats.pendingJobs})
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className="rounded-lg border border-neutral-300 px-4 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                >
                  Manage User Accounts
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: User Management */}
        {activeTab === 'users' && (
          <div className="rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
              <h2 className="text-base font-bold">Registered Users</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-500 dark:border-neutral-800 dark:bg-neutral-800/50 dark:text-neutral-400">
                  <tr>
                    <th className="px-6 py-3 font-semibold">User / Profile</th>
                    <th className="px-6 py-3 font-semibold">Email</th>
                    <th className="px-6 py-3 font-semibold">Role</th>
                    <th className="px-6 py-3 font-semibold">Joined</th>
                    <th className="px-6 py-3 font-semibold">Status</th>
                    <th className="px-6 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30">
                      <td className="px-6 py-4 font-medium">
                        {u.role === 'EMPLOYER'
                          ? u.employerProfile?.companyName || 'N/A'
                          : `${u.seekerProfile?.firstName || ''} ${u.seekerProfile?.lastName || ''}`.trim() || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-neutral-500">{u.email}</td>
                      <td className="px-6 py-4 font-semibold">{u.role}</td>
                      <td className="px-6 py-4 text-neutral-500">{u.createdAt}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            u.status === 'ACTIVE'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-400'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => toggleUserStatus(u.id)}
                          className={`rounded px-2.5 py-1 text-[11px] font-medium ${
                            u.status === 'ACTIVE'
                              ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400'
                              : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400'
                          }`}
                        >
                          {u.status === 'ACTIVE' ? 'Suspend' : 'Unsuspend'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Job Moderation */}
        {activeTab === 'jobs' && (
          <div className="rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
              <h2 className="text-base font-bold">Job Post Moderation Queue</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-500 dark:border-neutral-800 dark:bg-neutral-800/50 dark:text-neutral-400">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Job Title</th>
                    <th className="px-6 py-3 font-semibold">Company</th>
                    <th className="px-6 py-3 font-semibold">Location</th>
                    <th className="px-6 py-3 font-semibold">Type</th>
                    <th className="px-6 py-3 font-semibold">Status</th>
                    <th className="px-6 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {jobs.map((j) => (
                    <tr key={j.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30">
                      <td className="px-6 py-4 font-medium">{j.title}</td>
                      <td className="px-6 py-4 text-neutral-500">{j.company}</td>
                      <td className="px-6 py-4">{j.city}</td>
                      <td className="px-6 py-4 font-mono text-[11px]">{j.contractType}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            j.status === 'PUBLISHED'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400'
                              : j.status === 'PENDING'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-400'
                          }`}
                        >
                          {j.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {j.status !== 'PUBLISHED' && (
                          <button
                            onClick={() => updateJobStatus(j.id, 'PUBLISHED')}
                            className="rounded bg-emerald-600 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-emerald-500"
                          >
                            Approve
                          </button>
                        )}
                        {j.status !== 'FLAGGED' && (
                          <button
                            onClick={() => updateJobStatus(j.id, 'FLAGGED')}
                            className="rounded bg-red-600 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-red-500"
                          >
                            Flag / Hide
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Audit Logs */}
        {activeTab === 'logs' && (
          <div className="rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
              <h2 className="text-base font-bold">System Audit Trail</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3 font-mono text-xs">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-800/40"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-red-600 dark:text-red-400">
                        [{log.action}]
                      </span>
                      <span className="text-neutral-700 dark:text-neutral-300">
                        {log.target}
                      </span>
                    </div>
                    <div className="text-neutral-400 text-[11px]">
                      By {log.actor} on {log.timestamp}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
