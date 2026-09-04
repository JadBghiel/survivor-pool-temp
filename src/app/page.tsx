import { prisma } from '@/lib/db'
import JobsMap from './JobsMapClient'
import { LocateMeButton } from '@/components/LocateMeButton'
import { AuthHeader } from '@/components/AuthHeader'
import { Logo } from '@/components/Logo'

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
        {/* esoace de protection dmd par benjamin en haut a gauche */ }
        <div className="mb-6 space-y-1 pb-2">
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
        <h1 className="mt-1">
          <Logo size={40} textClassName="text-3xl font-semibold tracking-tight sm:text-4xl" />
        </h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Consultation libre des offres, sans compte.{' '}
          {/* served by hono, not a next page, so next/link would break it */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            className="underline underline-offset-4 text-[var(--color-institutional-blue)]"
            href="/api/docs"
          >
            Documentation de l&apos;API
          </a>
        </p>
        {/* temporary spot, milestone 1 moves this button onto the map itself */}
        <div className="mt-4">
          <LocateMeButton />
        </div>
      </header>

        <JobsMap jobs={jobs} />

      {jobs.length === 0 ? (
        <p className="mt-4 rounded-lg border border-dashed border-neutral-300 p-6 text-sm text-neutral-600 dark:border-neutral-700 dark:text-neutral-400">
          Aucune offre. Lancez <code className="font-mono">npx prisma db seed</code> pour peupler la base.
        </p>
      ) : (
        // one column on mobile, two from sm up responsive
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {jobs.map((job) => (
            <li
              key={job.id}
              className="rounded-lg border border-neutral-200 p-4 transition-colors hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600"
            >
              <span className="inline-block rounded bg-neutral-100 px-1.5 py-0.5 text-[11px] font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                {job.contractType}
              </span>
              <h2 className="mt-2 font-medium leading-snug">{job.title}</h2>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                {job.employer.companyName} | {job.city}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
