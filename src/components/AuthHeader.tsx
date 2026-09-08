'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCurrentUser } from '@/lib/useCurrentUser'
import { LoginModal } from '@/components/LoginModal'
import { PublishJobModal } from '@/components/PublishJobModal'

// header bar: shows the logged in user (or a login button), and opens the
// two modals below. the modals and the "who is logged in" state each moved
// to their own file, this component now only owns whats visible in the
// bar itself and which modal is open
export function AuthHeader() {
  const router = useRouter()
  const { user, setUser, logout } = useCurrentUser()
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isPublishOpen, setIsPublishOpen] = useState(false)

  return (
    <div className="flex items-center justify-end border-b border-neutral-200 pb-4 dark:border-neutral-800">
      <div>
        {user ? (
          <div className="flex items-center gap-3">
            <div className="text-right text-xs">
              <p className="font-medium text-neutral-900 dark:text-neutral-100">
                {user.role === 'ADMIN'
                  ? 'System Administrator'
                  : user.role === 'EMPLOYER'
                  ? user.employerProfile?.companyName || user.email
                  : `${user.seekerProfile?.firstName || ''} ${user.seekerProfile?.lastName || ''}`.trim() || user.email}
              </p>
              <p className="text-neutral-500">
                {user.role === 'ADMIN' ? 'Administrator' : user.role === 'EMPLOYER' ? 'Employer' : 'Job Seeker'}
              </p>
            </div>
            {user.role === 'ADMIN' && (
              <button
                onClick={() => router.push('/admin')}
                className="rounded bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
              >
                Admin Dashboard
              </button>
            )}
            {user.role === 'EMPLOYER' && (
              <button
                onClick={() => setIsPublishOpen(true)}
                className="rounded bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
              >
                Publier une offre
              </button>
            )}
            <button
              onClick={logout}
              className="rounded bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
            >
              Log out
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsLoginOpen(true)}
            className="rounded bg-neutral-900 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            Log in / Register
          </button>
        )}
      </div>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccess={(loggedInUser) => {
          setUser(loggedInUser)
          setIsLoginOpen(false)
        }}
      />

      <PublishJobModal isOpen={isPublishOpen} onClose={() => setIsPublishOpen(false)} />
    </div>
  )
}
