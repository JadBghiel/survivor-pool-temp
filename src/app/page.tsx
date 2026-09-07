import { prisma } from '@/lib/db'
import JobsView from './JobsView'
import { AuthHeader } from '@/components/AuthHeader'
import { Logo } from '@/components/Logo'
import { DemoNotice } from '@/components/DemoNotice'

// the db is read per request, never at build time. milestone 1 replaces this
// whole page with the leaflet map and this list becomes the mobile bottom sheet
export const dynamic = 'force-dynamic'

export default async function Home() {
// throw new Error('test') // TEST ERROR to see the error page
  const jobs = await prisma.job.findMany({
    where: { archivedAt: null, status: 'PUBLISHED' },
    select: {
      id: true,
      title: true,
      city: true,
      contractType: true,
      latitude: true,
      longitude: true,
      status: true,
      employer: { select: { companyName: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <AuthHeader />
      <header className="mb-8">
        {/* bloc-marque de l'Etat retire le 2026-09-07 (email 7, benjamin sellami) */}
        <h1 className="mt-1">
          <Logo size={40} textClassName="text-3xl font-semibold tracking-tight sm:text-4xl" />
        </h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Consultation libre des offres, sans compte.{' '}
          {/* served by hono, not a next page, so next/link would break it */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            className="underline underline-offset-4 text-[var(--color-accent)]"
            href="/api/docs"
          >
            Documentation de l&apos;API
          </a>
        </p>
        {/* temporary spot, milestone 1 moves this button onto the map itself */}
      </header>
      <JobsView jobs={jobs} />
      <DemoNotice className="mt-10 border-t border-neutral-200 pt-4 dark:border-neutral-800" />
    </main>
  )
}
