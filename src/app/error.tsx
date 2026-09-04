'use client'

import { Logo } from '@/components/Logo'

// next's error boundary for this route segment, catches unhandled render errors
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 leading-tight">
        <p
          className="text-[11px] font-bold uppercase tracking-wide text-[var(--color-institutional-blue)]"
          style={{ fontFamily: 'var(--font-marianne)' }}
        >
          République Française
        </p>
        <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">
          Ministère du Job et Bonheur
        </p>
      </div>
      <Logo size={26} textClassName="text-lg font-medium" />
      <h1 className="mt-6 text-3xl font-semibold" style={{ fontFamily: 'var(--font-marianne)' }}>
        Une erreur est survenue
      </h1>
      <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
        Le service rencontre un problème temporaire. Réessayez dans un instant.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
      >
        Réessayer
      </button>
    </main>
  )
}
