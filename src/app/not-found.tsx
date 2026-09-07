// page not found page. bloc-marque de l'Etat retire le 2026-09-07 (email 7)
import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { DemoNotice } from '@/components/DemoNotice'

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col items-center justify-center px-4 text-center">
      <Logo size={26} textClassName="text-lg font-medium" />
      <h1 className="mt-6 text-3xl font-semibold">
        Page introuvable
      </h1>
      <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
        Cette page n&apos;existe pas ou n&apos;existe plus.
      </p>
      {/* served by next, not hono, next/link is safe here */}
      <Link
        href="/"
        className="mt-6 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
      >
        Retour à la carte
      </Link>
      <DemoNotice className="mt-10" />
    </main>
  )
}
