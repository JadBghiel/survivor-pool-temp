'use client'

import { useState, useRef, useEffect } from 'react'
import JobsMap from './JobsMapClient'
import { LocateMeButton } from '@/components/LocateMeButton'

type Job = {
    id: string
    title: string
    city: string
    contractType: string
    latitude: number
    longitude: number
    description: string
    address: string
    postalCode: string
    radiusKm: number
    createdAt: string
    employer: { companyName: string }
}

export default function JobsView({ jobs }: { jobs: Job[] }) {
  // aquí guardaremos la oferta seleccionada (por ahora sin usar)
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null)

    const [userPosition, setUserPosition] = useState<{ lat: number; lng: number } | null>(null)

    // guarda una referencia a cada tarjeta, por id
    const cardRefs = useRef<Record<string, HTMLLIElement | null>>({})
    const detailsRef = useRef<HTMLDialogElement>(null)
    const selectedJob = jobs.find((j) => j.id === selectedJobId) ?? null

    // cuando cambia la selección, desliza la lista hasta esa tarjeta
    useEffect(() => {
        if (!selectedJobId) return
        cardRefs.current[selectedJobId]?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
        })
    }, [selectedJobId])

    return (
    <>
    <div className="mb-4">
        <LocateMeButton onLocated={(lat, lng) => setUserPosition({ lat, lng })} />
    </div>
    <div className="flex flex-col md:flex-row md:items-start gap-6 mt-4">
        <div className="md:basis-3/5">
        <JobsMap
            jobs={jobs}
            selectedJobId={selectedJobId}
            onSelectJob={setSelectedJobId}
            userPosition={userPosition}
        />
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
                ref={(el) => { cardRefs.current[job.id] = el }}
                onClick={() => {
                    setSelectedJobId(job.id)
                    detailsRef.current?.showModal()
                }}
                className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                    selectedJobId === job.id

                        ? 'border-neutral-500 bg-neutral-100 dark:border-neutral-500 dark:bg-neutral-800'
                        : 'border-neutral-200 hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600'
                    }`}
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
        <dialog
        ref={detailsRef}
        className="job-popup w-[min(42rem,92vw)] rounded-2xl border-2 border-neutral-200 bg-white p-0 backdrop:bg-black/40 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
        >
        {selectedJob && (
        <div className="p-8">
            <div className="flex items-start justify-between gap-3">
            <div>
                <span className="inline-block rounded-md bg-blue-100 px-2.5 py-1 text-sm font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    {selectedJob.contractType}
                </span>
                <h2 className="mt-3 text-2xl font-bold leading-tight">{selectedJob.title}</h2>
                <p className="mt-1.5 text-lg text-neutral-600 dark:text-neutral-400">
                    {selectedJob.employer.companyName} · {selectedJob.city}
                </p>
            </div>
            <button
                type="button"
                onClick={() => detailsRef.current?.close()}
                aria-label="Fermer"
                className="rounded-lg p-2 text-xl text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900"
            >
                ✕
            </button>
            </div>
            <div className="mt-6 border-t-2 border-neutral-200 pt-6 text-base dark:border-neutral-700">
                <p className="leading-relaxed text-neutral-700 dark:text-neutral-300">{selectedJob.description}</p>
                <p className="mt-4 text-neutral-500"> {selectedJob.address}, {selectedJob.postalCode} {selectedJob.city}</p>
                <p className="mt-1.5 text-neutral-500"> Rayon : {selectedJob.radiusKm} km</p>
            </div>
        </div>
        )}
    </dialog>
    </>
    )
}
