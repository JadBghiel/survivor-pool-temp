'use client'

import { useState } from 'react'

// iphone-ish viewport, so the frame matches what a phone actually renders
const PHONE_WIDTH = 390
const PHONE_HEIGHT = 844

// the site renders itself inside the frame through an iframe. ?frame=1 tells
// page.tsx to hide this toolbar inside it, otherwise the button would appear
// within its own preview
export function MobilePreview() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-400 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:bg-neutral-900"
      >
        Vue mobile
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-4 bg-neutral-100 p-6 dark:bg-neutral-950">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute right-6 top-6 rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:bg-white dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-900"
          >
            Fermer
          </button>

          {/* phone bezel */}
          <div
            className="relative rounded-[3rem] bg-neutral-900 p-3 shadow-2xl"
            style={{ width: PHONE_WIDTH + 24, height: PHONE_HEIGHT + 24 }}
          >
            {/* notch */}
            <div className="absolute left-1/2 top-3 z-10 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-neutral-900" />
            <iframe
              src="/?frame=1"
              title="Aperçu mobile"
              className="rounded-[2.25rem] border-0 bg-white"
              style={{ width: PHONE_WIDTH, height: PHONE_HEIGHT }}
            />
          </div>

          <p className="text-xs text-neutral-500">
            Aperçu {PHONE_WIDTH} × {PHONE_HEIGHT}
          </p>
        </div>
      )}
    </>
  )
}
