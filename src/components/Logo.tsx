// dani's logo. accent recolore en teal (var(--color-accent)) le 2026-09-07:
// le bleu institutionnel #1B3A6B a ete retire, cf. email 7 de benjamin sellami
export function LogoMark({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M12 23C12 23 4 15.6 4 10a8 8 0 0 1 16 0c0 5.6-8 13-8 13ZM12 5a5 5 0 1 0 0 10a5 5 0 1 0 0-10Z"
      />
      <path fill="var(--color-accent)" d="M10.2 7L15 10l-4.8 3Z" />
    </svg>
  )
}

export function Logo({ size = 24, textClassName = '' }: { size?: number; textClassName?: string }) {
  return (
    <div className="inline-flex items-center gap-2">
      <LogoMark size={size} className="text-neutral-900 dark:text-neutral-100" />
      <span
        className={textClassName}
        style={{ fontFamily: 'var(--font-ui)', letterSpacing: '-0.02em' }}
      >
        Chomage<span className="font-bold" style={{ color: 'var(--color-accent)' }}>Go</span>
      </span>
    </div>
  )
}
