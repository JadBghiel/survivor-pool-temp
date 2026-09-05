import { prisma } from '@/lib/db'
import JobsView from './JobsView'
import { LocateMeButton } from '@/components/LocateMeButton'
import { AuthHeader } from '@/components/AuthHeader'

// the db is read per request, never at build time. milestone 1 replaces this
// whole page with the leaflet map and this list becomes the mobile bottom sheet
export const dynamic = 'force-dynamic'

export default async function Home() {
  const jobs = await prisma.job.findMany({
    where: { archivedAt: null },
    select: {
      id: true,
      title: true,
      city: true,
      contractType: true,
      latitude: true,
      longitude: true, 
      employer: { select: { companyName: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <AuthHeader />
      <header className="mb-8">
        <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">
          Ministère du job & bnoheur
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">ChomageGo</h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Consultation libre des offres, sans compte.{' '}
          {/* served by hono, not a next page, so next/link would break it */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a className="underline underline-offset-4" href="/api/docs">
            Documentation de l&apos;API
          </a>
        </p>
        {/* temporary spot, milestone 1 moves this button onto the map itself */}
        <div className="mt-4">
          <LocateMeButton />
        </div>
      </header>
      <JobsView jobs={jobs} />
    </main>
  )
}
