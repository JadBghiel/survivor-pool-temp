'use client'

import React, { useState, useEffect } from 'react'

type User = {
  id: string
  email: string
  role: 'SEEKER' | 'EMPLOYER' | 'ADMIN'
  seekerProfile?: { firstName: string; lastName: string } | null
  employerProfile?: { companyName: string } | null
}

export function AuthHeader() {
  const [user, setUser] = useState<User | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isLogin, setIsLogin] = useState(true)

  // Form states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'SEEKER' | 'EMPLOYER'>('SEEKER')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [error, setError] = useState<string | null>(null)

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setFirstName('')
    setLastName('')
    setCompanyName('')
    setError(null)
  }

  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    if (savedToken) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) {
            setUser(data)
          } else {
            localStorage.removeItem('token')
            setUser(null)
          }
        })
        .catch(() => {
          localStorage.removeItem('token')
          setUser(null)
        })
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
    const body = isLogin
      ? { email, password }
      : { email, password, role, firstName, lastName, companyName }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok) {
        let errorMessage = 'An error occurred'

        // 1. Check if error payload is stringified JSON from Zod
        const rawErr = data.error || data
        let parsedIssues: { message?: string; path?: string[] }[] | null = null

        if (typeof rawErr?.message === 'string') {
          try {
            const parsed = JSON.parse(rawErr.message)
            if (Array.isArray(parsed)) parsedIssues = parsed
          } catch {
            errorMessage = rawErr.message
          }
        } else if (Array.isArray(rawErr?.issues)) {
          parsedIssues = rawErr.issues
        } else if (typeof rawErr === 'string') {
          errorMessage = rawErr
        }

        // 2. Format parsed Zod issues cleanly
        if (parsedIssues && parsedIssues.length > 0) {
          errorMessage = parsedIssues
            .map((issue) => {
              const field = issue.path?.length ? `${issue.path.join('.')}: ` : ''
              return `${field}${issue.message}`
            })
            .join(' | ')
        }

        throw new Error(errorMessage)
      }

      localStorage.setItem('token', data.token)
      setUser(data.user)
      setIsOpen(false)
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <div className="flex items-center justify-end border-b border-neutral-200 pb-4 dark:border-neutral-800">
      <div>
        {user ? (
          <div className="flex items-center gap-3">
            <div className="text-right text-xs">
              <p className="font-medium text-neutral-900 dark:text-neutral-100">
                {user.role === 'EMPLOYER'
                  ? user.employerProfile?.companyName || user.email
                  : `${user.seekerProfile?.firstName || ''} ${user.seekerProfile?.lastName || ''}`.trim() || user.email}
              </p>
              <p className="text-neutral-500">{user.role === 'EMPLOYER' ? 'Employer' : 'Job Seeker'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="rounded bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
            >
              Log out
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              resetForm()
              setIsOpen(true)
            }}
            className="rounded bg-neutral-900 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            Log in / Register
          </button>
        )}
      </div>

      {/* Modal overlay with high z-index (z-[9999]) to layer over Leaflet map */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">
                {isLogin ? 'Log In' : 'Create Account'}
              </h2>
              <button
                onClick={() => {
                  resetForm()
                  setIsOpen(false)
                }}
                className="text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded bg-red-50 p-2 text-xs font-medium text-red-600 dark:bg-red-950/50 dark:text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              {!isLogin && (
                <div>
                  <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400">
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'SEEKER' | 'EMPLOYER')}
                    className="mt-1 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-1.5 text-sm dark:border-neutral-700"
                  >
                    <option value="SEEKER">Job Seeker</option>
                    <option value="EMPLOYER">Employer (€400/month)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john.doe@example.com"
                  className="mt-1 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-1.5 text-sm dark:border-neutral-700"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-1.5 text-sm dark:border-neutral-700"
                />
              </div>

              {!isLogin && role === 'SEEKER' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                      className="mt-1 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-1.5 text-sm dark:border-neutral-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      className="mt-1 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-1.5 text-sm dark:border-neutral-700"
                    />
                  </div>
                </div>
              )}

              {!isLogin && role === 'EMPLOYER' && (
                <div>
                  <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Tech Solutions"
                    className="mt-1 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-1.5 text-sm dark:border-neutral-700"
                  />
                </div>
              )}

              <button
                type="submit"
                className="mt-2 w-full rounded-md bg-neutral-900 py-2 text-xs font-medium text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
              >
                {isLogin ? 'Log In' : 'Create Account'}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  resetForm()
                  setIsLogin(!isLogin)
                }}
                className="text-xs text-neutral-500 underline underline-offset-4 hover:text-neutral-800 dark:hover:text-neutral-200"
              >
                {isLogin
                  ? "Don't have an account? Register"
                  : 'Already have an account? Log in'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}