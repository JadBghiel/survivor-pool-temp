// loading page, as per benjamin email reuqiement

import { Logo } from '@/components/Logo'

export default function Loading() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col items-center justify-center px-4 text-center">
      <Logo size={26} textClassName="mb-6 text-lg font-medium" />
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 dark:border-neutral-800"
        style={{ borderTopColor: 'var(--color-institutional-blue)' }}
        role="status"
        aria-label="Chargement"
      />
      <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">Chargement…</p>
    </main>
  )
}
