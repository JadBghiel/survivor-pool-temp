'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CONTRACT_TYPES = [
  { value: 'CDI', label: 'CDI' },
  { value: 'CDD', label: 'CDD' },
  { value: 'INTERNSHIP', label: 'Stage' },
  { value: 'APPRENTICESHIP', label: 'Alternance' },
  { value: 'FREELANCE', label: 'Freelance' },
] as const

type Props = {
  isOpen: boolean
  onClose: () => void
}

// publish a listing form for employer only, refacotred from  AuthHeader, talks
// straight to POST /api/jobs , see src/lib/routes/jobs.ts for the server side
export function PublishJobModal({ isOpen, onClose }: Props) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [contractType, setContractType] = useState<(typeof CONTRACT_TYPES)[number]['value']>('CDI')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [radiusKm, setRadiusKm] = useState('25')
  const [error, setError] = useState<string | null>(null)
  const [isPublishing, setIsPublishing] = useState(false)

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setContractType('CDI')
    setAddress('')
    setCity('')
    setPostalCode('')
    setRadiusKm('25')
    setError(null)
  }

  const close = () => {
    resetForm()
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsPublishing(true)

    const token = localStorage.getItem('token')

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          title,
          description,
          contractType,
          address,
          city,
          postalCode,
          radiusKm: Number(radiusKm),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "impossible de publier loffre")
      }

      close()
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "impossible de publier l'offre")
    } finally {
      setIsPublishing(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Publier une offre</h2>
          <button onClick={close} className="text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200">
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded bg-red-50 p-2 text-xs font-medium text-red-600 dark:bg-red-950/50 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400">Titre du poste</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Développeur backend Node.js"
              className="mt-1 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-1.5 text-sm dark:border-neutral-700"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400">Description</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Missions, équipe, télétravail..."
              className="mt-1 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-1.5 text-sm dark:border-neutral-700"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400">Type de contrat</label>
            <select
              value={contractType}
              onChange={(e) => setContractType(e.target.value as (typeof CONTRACT_TYPES)[number]['value'])}
              className="mt-1 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-1.5 text-sm dark:border-neutral-700"
            >
              {CONTRACT_TYPES.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400">Adresse</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="12 rue de la Fosse"
              className="mt-1 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-1.5 text-sm dark:border-neutral-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400">Ville</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Nantes"
                className="mt-1 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-1.5 text-sm dark:border-neutral-700"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400">Code postal</label>
              <input
                type="text"
                required
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="44000"
                className="mt-1 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-1.5 text-sm dark:border-neutral-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400">
              Rayon de diffusion (km)
            </label>
            <input
              type="number"
              required
              min={1}
              max={200}
              value={radiusKm}
              onChange={(e) => setRadiusKm(e.target.value)}
              className="mt-1 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-1.5 text-sm dark:border-neutral-700"
            />
          </div>

          <button
            type="submit"
            disabled={isPublishing}
            className="mt-2 w-full rounded-md bg-neutral-900 py-2 text-xs font-medium text-white hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            {isPublishing ? 'Publication en cours…' : "Publier l'offre"}
          </button>
        </form>
      </div>
    </div>
  )
}
