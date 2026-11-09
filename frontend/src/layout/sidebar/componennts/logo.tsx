export const Logo = () => {
    return (
        <a href="/" className="flex items-center gap-2.5 px-2 text-[#16181D] no-underline">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8" aria-hidden="true">
        <rect x="2.5" y="2.5" width="19" height="19" rx="6" fill="#2F5BEA" stroke="none" />
        <ellipse cx="12" cy="12" rx="6.5" ry="3" transform="rotate(-30 12 12)" />
        <circle cx="12" cy="12" r="1.6" fill="#FFFFFF" stroke="none" />
      </svg>
      <span className="font-['Manrope',sans-serif] text-xl font-extrabold text-black tracking-[-0.02em]">Orbit</span>
    </a>
    )
}