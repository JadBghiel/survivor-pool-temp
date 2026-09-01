'use client'

import { useRef, useState } from 'react'
import { requestBrowserLocation, type GeolocationResult } from '@/lib/geolocation'

// this notice is shown before we ever call the browser's own permission
// genrric prompt ("this site wants your location")
// and cannot be customized, for now
// dialog is the actual "clear, accessible information notice".
const FALLBACK_NOTE = 'Vous pouvez continuer à parcourir toutes les offres'

const OUTCOME_MESSAGES: Record<Exclude<GeolocationResult['status'], 'success'>, string> = {
  denied: `Vous avez refusé l'accès à votre position, ${FALLBACK_NOTE}`,
  unavailable: `Impossible de déterminer votre position pour le moment, ${FALLBACK_NOTE}`,
  timeout: `La demande de localisation a expiré, ${FALLBACK_NOTE}`,
  unsupported: `Votre navigateur ne prend pas en charge la géolocalisation, ${FALLBACK_NOTE}`,
}

type Step = 'idle' | 'notice' | 'locating' | 'done'

export function LocateMeButton() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [step, setStep] = useState<Step>('idle')
  const [result, setResult] = useState<GeolocationResult | null>(null)

  function openNotice() {
    setResult(null)
    setStep('notice')
    dialogRef.current?.showModal()
  }

  function decline() {
    // nothing was requested, nothing to undo. the browser's own permission
    // prompt never goes 
    dialogRef.current?.close()
  }

  async function accept() {
    setStep('locating')
    const outcome = await requestBrowserLocation()
    setResult(outcome)
    setStep('done')
  }

  function closeAfterResult() {
    dialogRef.current?.close()
  }

  function resetOnClose() {
    // fires on every close, including ESC the coordinates only ever
    // lived in "result", this components own react state, dropping it
    // NOT SAVED
    setStep('idle')
    setResult(null)
  }

  return (
    <>
      <button
        type="button"
        onClick={openNotice}
        className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-400 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:bg-neutral-900"
      >
        Offres près de moi
      </button>

      <dialog
        ref={dialogRef}
        onClose={resetOnClose}
        className="w-[min(24rem,90vw)] rounded-lg border border-neutral-200 bg-white p-0 text-neutral-900 backdrop:bg-black/40 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
      >
        <div className="p-5">
          {step === 'notice' && (
            <>
              <h2 className="font-medium">Utiliser votre position ?</h2>
              <ul className="mt-3 list-disc space-y-1.5 pl-4 text-sm text-neutral-600 dark:text-neutral-400">
                <li>utilisée pour trier les offres par distance</li>
                <li>donnée par votre navigateur, jamais devinée par nos serveurs</li>
                <li>conservée uniquement dans votre navigateur, pour cette visite</li>
                <li>jamais enregistrée sur nos serveurs ni liée à un compte</li>
              </ul>
              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={decline}
                  className="rounded-md px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-900"
                >
                  Refuser
                </button>
                <button
                  type="button"
                  onClick={accept}
                  className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                >
                  Autoriser
                </button>
              </div>
            </>
          )}

          {step === 'locating' && (
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Localisation en cours…</p>
          )}

          {step === 'done' && result && (
            <>
              <p className="text-sm">
                {result.status === 'success'
                  ? `Position trouvée (précision ~${Math.round(result.accuracy)} m). Le tri des offres par distance arrive avec la carte.`
                  : OUTCOME_MESSAGES[result.status]}
              </p>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={closeAfterResult}
                  className="rounded-md px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-900"
                >
                  Fermer
                </button>
              </div>
            </>
          )}
        </div>
      </dialog>
    </>
  )
}
