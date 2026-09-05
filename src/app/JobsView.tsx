'use client'

import { useState } from 'react'
import JobsMap from './JobsMapClient'

type Job = {
    id: string
    title: string
    city: string
    contractType: string
    latitude: number
    longitude: number
    employer: { companyName: string }
}

export default function JobsView({ jobs }: { jobs: Job[] }) {
  // aquí guardaremos la oferta seleccionada (por ahora sin usar)
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null)

    console.log('Oferta seleccionada:', selectedJobId);

    return (
    <div className="flex flex-col md:flex-row md:items-start gap-6 mt-4">
        <div className="md:basis-3/5">
        <JobsMap jobs={jobs} selectedJobId={selectedJobId} />
        </div>

        <div className="md:basis-2/5">
        {jobs.length === 0 ? (
            <p className="mt-4 rounded-lg border border-dashed border-neutral-300 p-6 text-sm text-neutral-600 dark:border-neutral-700 dark:text-neutral-400">
            Aucune offre. Lancez <code className="font-mono">npx prisma db seed</code> pour peupler la base.
            </p>
        ) : (
            <ul className="mt-4 flex flex-col gap-3">
            {jobs.map((job) => (
                <li
                key={job.id}
                onClick={() => setSelectedJobId(job.id)}
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
        </div>
    </div>
    )
}
