export const LogoMark = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="2.5" y="2.5" width="19" height="19" rx="6" className="fill-primary" />
    <circle cx="12" cy="7.6" r="1.7" fill="#FFFFFF" />
    <path d="M12 11.2v5.6" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" />
  </svg>
)

export const Logo = () => {
    return (
        <a href="/" className="flex items-center gap-2.5 px-2 text-ink no-underline">
      <LogoMark />
      <span className="font-['Manrope',sans-serif] text-xl font-extrabold text-black tracking-[-0.02em]">Irma</span>
    </a>
    )
}
