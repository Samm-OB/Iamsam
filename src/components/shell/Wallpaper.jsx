// Original abstract wallpapers drawn in SVG (no external images needed).

function Bloom({ dark }) {
  const petals = Array.from({ length: 9 }, (_, i) => i)
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
      <defs>
        <radialGradient id="bg-bloom" cx="50%" cy="55%" r="75%">
          <stop offset="0" stopColor={dark ? '#0a2a5c' : '#d6e8fb'} />
          <stop offset="1" stopColor={dark ? '#030a1a' : '#9ec3ea'} />
        </radialGradient>
        <linearGradient id="petal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={dark ? '#4cc2ff' : '#7fd3ff'} stopOpacity=".95" />
          <stop offset=".55" stopColor={dark ? '#0f6cbd' : '#1a86e0'} stopOpacity=".85" />
          <stop offset="1" stopColor={dark ? '#0a1f66' : '#0d4fa8'} stopOpacity=".9" />
        </linearGradient>
        <filter id="soft"><feGaussianBlur stdDeviation="1.2" /></filter>
        <filter id="glow"><feGaussianBlur stdDeviation="60" /></filter>
      </defs>
      <rect width="1600" height="900" fill="url(#bg-bloom)" />
      <ellipse cx="800" cy="500" rx="420" ry="260" fill={dark ? '#1677d6' : '#ffffff'} opacity={dark ? 0.35 : 0.6} filter="url(#glow)" />
      <g transform="translate(800 520)" filter="url(#soft)">
        {petals.map((i) => (
          <path key={i}
            d="M0 0 C 70 -60, 120 -230, 0 -330 C -120 -230, -70 -60, 0 0 Z"
            fill="url(#petal)"
            opacity={0.55 + (i % 3) * 0.12}
            transform={`rotate(${-100 + i * 25}) scale(${1 - Math.abs(i - 4) * 0.07})`} />
        ))}
        <circle r="22" fill={dark ? '#bfe9ff' : '#ffffff'} opacity=".7" />
      </g>
    </svg>
  )
}

function Dune() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b1a4a" />
          <stop offset=".45" stopColor="#c2557a" />
          <stop offset=".75" stopColor="#f7a26b" />
        </linearGradient>
        <linearGradient id="d1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e07b55" /><stop offset="1" stopColor="#7a2f4a" /></linearGradient>
        <linearGradient id="d2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a23f5c" /><stop offset="1" stopColor="#3a1638" /></linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#sky)" />
      <circle cx="1080" cy="470" r="110" fill="#ffd9a0" opacity=".9" />
      <path d="M0 620 C 300 520, 600 560, 900 600 S 1400 520, 1600 560 V900 H0Z" fill="url(#d1)" />
      <path d="M0 740 C 380 640, 700 720, 1000 700 S 1450 640, 1600 690 V900 H0Z" fill="url(#d2)" />
    </svg>
  )
}

function Aurora() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
      <defs>
        <linearGradient id="night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#020611" /><stop offset="1" stopColor="#0b1f2e" /></linearGradient>
        <filter id="blur-a"><feGaussianBlur stdDeviation="40" /></filter>
      </defs>
      <rect width="1600" height="900" fill="url(#night)" />
      <g filter="url(#blur-a)" opacity=".85">
        <path d="M-100 420 C 300 200, 600 520, 900 300 S 1500 180, 1700 320 L1700 420 C 1400 300, 1100 560, 800 440 S 200 380, -100 520Z" fill="#19e6a8" />
        <path d="M-100 300 C 400 120, 700 380, 1000 200 S 1500 120, 1700 200 L1700 260 C 1300 200, 1000 420, 700 320 S 100 260, -100 360Z" fill="#7a5cff" opacity=".7" />
      </g>
      <path d="M0 760 L180 640 L320 720 L520 580 L700 700 L900 600 L1100 720 L1300 620 L1600 740 V900 H0Z" fill="#03080f" />
    </svg>
  )
}

export const WALLPAPER_COUNT = 3

export default function Wallpaper({ index, dark }) {
  const W = [Bloom, Dune, Aurora][index % WALLPAPER_COUNT]
  return (
    <div className="absolute inset-0 -z-0 pointer-events-none">
      <W dark={dark} />
    </div>
  )
}
