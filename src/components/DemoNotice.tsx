// mention imposee par le cabinet (email 7, benjamin sellami, 2026-09-07).
// le texte est repris mot pour mot, ne pas le reformuler.
export const DEMO_NOTICE = 'Démonstrateur technique, ne constitue pas un service public en exploitation.'

export function DemoNotice({ className = '' }: { className?: string }) {
  return (
    <footer className={`text-xs text-neutral-500 dark:text-neutral-400 ${className}`}>
      {DEMO_NOTICE}
    </footer>
  )
}
