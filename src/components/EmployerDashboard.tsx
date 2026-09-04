'use client'

import { useState } from 'react'

// mock figures for the press kit. the real dashboard reads these from the db in
// week 2, this component exists so the screen can be shown and screenshotted now
const STATS = [
  { label: 'Offres en ligne', value: '2' },
  { label: 'Vues cette semaine', value: '1 248' },
  { label: 'Candidatures reçues', value: '37' },
  { label: 'Taux de réponse', value: '92 %' },
]

const LISTINGS = [
  { title: 'Responsable d’exploitation logistique', city: 'Bordeaux', views: 812, applications: 24, status: 'En ligne' },
  { title: 'Préparateur de commandes (CACES 1)', city: 'Bordeaux', views: 436, applications: 13, status: 'En ligne' },
]

const APPLICATIONS = [
  { name: 'Camille Fabre', role: 'Responsable d’exploitation logistique', date: '3 sept.', status: 'Nouvelle' },
  { name: 'Yanis Bouchet', role: 'Responsable d’exploitation logistique', date: '3 sept.', status: 'Nouvelle' },
  { name: 'Sofia Marchetti', role: 'Préparateur de commandes (CACES 1)', date: '2 sept.', status: 'En cours' },
  { name: 'Thomas Rey', role: 'Responsable d’exploitation logistique', date: '2 sept.', status: 'En cours' },
  { name: 'Awa Diallo', role: 'Préparateur de commandes (CACES 1)', date: '1 sept.', status: 'Entretien' },
]

const STATUS_COLORS: Record<string, string> = {
  Nouvelle: 'bg-blue-50 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300',
  'En cours': 'bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300',
  Entretien: 'bg-green-50 text-green-800 dark:bg-green-950/50 dark:text-green-300',
}

export function EmployerDashboard() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-400 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:bg-neutral-900"
      >
        Tableau de bord employeur
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold">Tableau de bord</h2>
                <p className="mt-0.5 text-sm text-neutral-600 dark:text-neutral-400">
                  Atlantique Logistique — SIRET 812 345 678 00019
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800"
                >
                  <p className="text-2xl font-semibold" style={{ color: '#1B3A6B' }}>
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">{stat.label}</p>
                </div>
              ))}
            </div>

            <h3 className="mt-7 text-sm font-semibold uppercase tracking-wide text-neutral-500">
              Mes offres
            </h3>
            <div className="mt-2 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase text-neutral-500">
                  <tr className="border-b border-neutral-200 dark:border-neutral-800">
                    <th className="py-2 pr-4 font-medium">Intitulé</th>
                    <th className="py-2 pr-4 font-medium">Commune</th>
                    <th className="py-2 pr-4 font-medium">Vues</th>
                    <th className="py-2 pr-4 font-medium">Candidatures</th>
                    <th className="py-2 font-medium">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {LISTINGS.map((listing) => (
                    <tr key={listing.title} className="border-b border-neutral-100 dark:border-neutral-800/60">
                      <td className="py-2.5 pr-4">{listing.title}</td>
                      <td className="py-2.5 pr-4 text-neutral-600 dark:text-neutral-400">{listing.city}</td>
                      <td className="py-2.5 pr-4 tabular-nums">{listing.views}</td>
                      <td className="py-2.5 pr-4 tabular-nums">{listing.applications}</td>
                      <td className="py-2.5">
                        <span className="rounded bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-800 dark:bg-green-950/50 dark:text-green-300">
                          {listing.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="mt-7 text-sm font-semibold uppercase tracking-wide text-neutral-500">
              Candidatures récentes
            </h3>
            <div className="mt-2 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase text-neutral-500">
                  <tr className="border-b border-neutral-200 dark:border-neutral-800">
                    <th className="py-2 pr-4 font-medium">Candidat</th>
                    <th className="py-2 pr-4 font-medium">Offre</th>
                    <th className="py-2 pr-4 font-medium">Reçue le</th>
                    <th className="py-2 font-medium">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {APPLICATIONS.map((application) => (
                    <tr
                      key={application.name}
                      className="border-b border-neutral-100 dark:border-neutral-800/60"
                    >
                      <td className="py-2.5 pr-4 font-medium">{application.name}</td>
                      <td className="py-2.5 pr-4 text-neutral-600 dark:text-neutral-400">
                        {application.role}
                      </td>
                      <td className="py-2.5 pr-4 text-neutral-600 dark:text-neutral-400">
                        {application.date}
                      </td>
                      <td className="py-2.5">
                        <span
                          className={`rounded px-2 py-0.5 text-[11px] font-medium ${STATUS_COLORS[application.status]}`}
                        >
                          {application.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-6 text-xs text-neutral-500">
              Données de démonstration. Le tableau de bord sera alimenté par les candidatures réelles
              en semaine 2.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
