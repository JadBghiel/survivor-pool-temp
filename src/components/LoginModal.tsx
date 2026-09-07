'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@/lib/useCurrentUser'

type Props = {
  isOpen: boolean
  onClose: () => void
  onSuccess: (user: User, token: string) => void
}

// login/register modal, split out of authheader (refactor)owns only the form fields
// and the submit request AuthHeader owns whether it's open and what
// happens to the logged in user afterwards
export function LoginModal({ isOpen, onClose, onSuccess }: Props) {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
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

  const close = () => {
    resetForm()
    onClose()
  }

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

        // check if error payload is stringified json from zod
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

        // format parsed zod issues cleanly
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
      onSuccess(data.user, data.token)
      resetForm()
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">{isLogin ? 'Log In' : 'Create Account'}</h2>
          <button onClick={close} className="text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200">
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
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'SEEKER' | 'EMPLOYER')}
                className="mt-1 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-1.5 text-sm dark:border-neutral-700"
              >
                <option value="SEEKER">Job Seeker</option>
                <option value="EMPLOYER">Employer</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400">Email</label>
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
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400">Password</label>
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
            {isLogin ? "Don't have an account? Register" : 'Already have an account? Log in'}
          </button>
        </div>
      </div>
    </div>
  )
}
