// Original Fluent-style icons drawn for samOS (not Microsoft assets).

const folderBadges = {
  'folder-school': <path d="M24 25.5l-7 3.4 7 3.4 7-3.4-7-3.4zm-4.4 5.2v2.6c0 .9 2 1.9 4.4 1.9s4.4-1 4.4-1.9v-2.6L24 32.8l-4.4-2.1z" fill="#fff" opacity=".92" />,
  'folder-code': <path d="M20.5 27.5l-3 3 3 3M27.5 27.5l3 3-3 3M25.4 26.5l-2.8 8" stroke="#fff" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity=".95" />,
  'folder-video': <path d="M18 27.2c0-.9.7-1.6 1.6-1.6h6.8c.9 0 1.6.7 1.6 1.6v6c0 .9-.7 1.6-1.6 1.6h-6.8c-.9 0-1.6-.7-1.6-1.6v-6zm10.2 1.5l3.3-2v7.6l-3.3-2v-3.6z" fill="#fff" opacity=".92" />,
  'folder-music': <path d="M27.5 24.8v7.6a2.2 2.2 0 1 1-1.4-2.05V27.3l-5.3 1.3v5.2a2.2 2.2 0 1 1-1.4-2.05V26.2l8.1-1.4z" fill="#fff" opacity=".92" />,
  'folder-work': <path d="M21.6 26v-1.1c0-.6.5-1.1 1.1-1.1h2.6c.6 0 1.1.5 1.1 1.1V26h2.5c.8 0 1.4.6 1.4 1.4v5.2c0 .8-.6 1.4-1.4 1.4h-9.8c-.8 0-1.4-.6-1.4-1.4v-5.2c0-.8.6-1.4 1.4-1.4h2.5zm1.3 0h2.2v-.9h-2.2v.9z" fill="#fff" opacity=".92" />,
}

function Folder({ badge }) {
  return (
    <svg viewBox="0 0 48 48" width="100%" height="100%">
      <defs>
        <linearGradient id="fBack" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E7A630" /><stop offset="1" stopColor="#D08B16" /></linearGradient>
        <linearGradient id="fFront" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFD86B" /><stop offset="1" stopColor="#F8BE36" /></linearGradient>
      </defs>
      <path d="M4 11.5C4 9.6 5.6 8 7.5 8h10.3c.9 0 1.8.4 2.4 1l2.6 2.6c.4.4 1 .7 1.6.7H40.5c1.9 0 3.5 1.6 3.5 3.5V36c0 1.9-1.6 3.5-3.5 3.5h-33C5.6 39.5 4 37.9 4 36V11.5z" fill="url(#fBack)" />
      <path d="M4 18.5c0-1.9 1.6-3.5 3.5-3.5h33c1.9 0 3.5 1.6 3.5 3.5V37c0 1.9-1.6 3.5-3.5 3.5h-33C5.6 40.5 4 38.9 4 37V18.5z" fill="url(#fFront)" />
      <path d="M4 18.5c0-1.9 1.6-3.5 3.5-3.5h33c1.9 0 3.5 1.6 3.5 3.5v.6H4v-.6z" fill="#fff" opacity=".35" />
      {badge && <g transform="translate(0 -1)">{folderBadges[badge]}</g>}
    </svg>
  )
}

function Page({ color, children, fold = '#fff' }) {
  return (
    <svg viewBox="0 0 48 48" width="100%" height="100%">
      <path d="M10 5.5C10 4.7 10.7 4 11.5 4h17.4L39 14.1v28.4c0 .8-.7 1.5-1.5 1.5h-26c-.8 0-1.5-.7-1.5-1.5v-37z" fill={fold} stroke="#0002" strokeWidth=".6" />
      <path d="M28.9 4v8.6c0 .8.7 1.5 1.5 1.5H39" fill="#e6e6e6" stroke="#0002" strokeWidth=".6" />
      {color && <rect x="5" y="22" width="22" height="16" rx="2.2" fill={color} />}
      {children}
    </svg>
  )
}

const file = {
  doc: (
    <Page color="#185ABD">
      <path d="M9.2 26.5l1.9 7.5 2-6.4 2 6.4 1.9-7.5" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinejoin="round" transform="translate(1.5 0)" />
      <path d="M30 20h5M30 25h5M30 30h5M30 35h5" stroke="#9ab6e0" strokeWidth="1.4" />
    </Page>
  ),
  pdf: (
    <Page color="#C4314B">
      <text x="16" y="33.5" fontSize="8" fontWeight="700" fill="#fff" textAnchor="middle" fontFamily="Segoe UI, Arial">PDF</text>
    </Page>
  ),
  txt: (
    <Page>
      <path d="M15 17h18M15 21.5h18M15 26h18M15 30.5h12M15 35h15" stroke="#8a8a8a" strokeWidth="1.4" />
    </Page>
  ),
  zip: (
    <Page>
      <path d="M22 4v4h3v3h-3v3h3v3h-3v3h3v3" stroke="#d6a52a" strokeWidth="2.2" fill="none" />
      <rect x="20.5" y="25" width="6" height="7" rx="1.2" fill="#d6a52a" />
    </Page>
  ),
  image: (
    <Page>
      <rect x="14" y="17" width="20" height="18" rx="2" fill="#4cc2ff" />
      <circle cx="19.5" cy="22.3" r="2.3" fill="#fff" />
      <path d="M14 32l6-6 4.5 4.5L28 27l6 6v.1c0 1.1-.9 1.9-2 1.9H16c-1.1 0-2-.9-2-2v-1z" fill="#127d3a" />
    </Page>
  ),
  video: (
    <Page>
      <rect x="13" y="18" width="22" height="17" rx="2.2" fill="#6b46c1" />
      <path d="M21.5 22.5v8l6.5-4-6.5-4z" fill="#fff" />
    </Page>
  ),
  audio: (
    <Page>
      <circle cx="24" cy="27" r="10" fill="#e3008c" />
      <path d="M27 21.8v7.4a2.1 2.1 0 1 1-1.3-1.95V24.3l-4.2 1v4.9a2.1 2.1 0 1 1-1.3-1.95v-5.3l6.8-1.15z" fill="#fff" />
    </Page>
  ),
}

const apps = {
  explorer: <Folder />,
  desktop: (
    <svg viewBox="0 0 48 48" width="100%" height="100%">
      <rect x="4" y="8" width="40" height="27" rx="3" fill="#0f6cbd" />
      <rect x="6.5" y="10.5" width="35" height="22" rx="1.6" fill="#4cc2ff" />
      <path d="M18 40h12M24 35v5" stroke="#6b6b6b" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  ),
  notepad: (
    <svg viewBox="0 0 48 48" width="100%" height="100%">
      <rect x="9" y="7" width="30" height="36" rx="3" fill="#fff" stroke="#0003" />
      <rect x="9" y="7" width="30" height="7" rx="3" fill="#2d7dd2" />
      <path d="M14 21h20M14 26h20M14 31h20M14 36h13" stroke="#9aa5b1" strokeWidth="1.6" />
      <path d="M16 4.5v6M24 4.5v6M32 4.5v6" stroke="#585858" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  photos: (
    <svg viewBox="0 0 48 48" width="100%" height="100%">
      <rect x="5" y="9" width="38" height="30" rx="5" fill="#0078d4" />
      <circle cx="16" cy="19" r="4" fill="#ffd335" />
      <path d="M5 33l11-11 8 8 6-6 13 13v.5c0 1.7-1.3 3-3 3H8c-1.7 0-3-1.3-3-3V33z" fill="#43d17c" />
    </svg>
  ),
  player: (
    <svg viewBox="0 0 48 48" width="100%" height="100%">
      <defs><linearGradient id="mp" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ff6a3d" /><stop offset="1" stopColor="#e3008c" /></linearGradient></defs>
      <rect x="5" y="5" width="38" height="38" rx="10" fill="url(#mp)" />
      <path d="M20 16v16l13-8-13-8z" fill="#fff" />
    </svg>
  ),
  taskmgr: (
    <svg viewBox="0 0 48 48" width="100%" height="100%">
      <rect x="5" y="7" width="38" height="34" rx="5" fill="#1f8a70" />
      <path d="M10 28h7l3-9 5 15 4-10 2 4h7" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 48 48" width="100%" height="100%">
      <rect x="4" y="10" width="40" height="28" rx="4" fill="#0f6cbd" />
      <path d="M4 15l20 12 20-12" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinejoin="round" />
    </svg>
  ),
  recycle: (
    <svg viewBox="0 0 48 48" width="100%" height="100%">
      <path d="M11 13h26l-2.4 27c-.1 1.1-1 2-2.2 2H15.6c-1.2 0-2.1-.9-2.2-2L11 13z" fill="#cfe4f7" stroke="#6d8fb0" strokeWidth="1.2" />
      <rect x="9" y="9" width="30" height="5" rx="2" fill="#a9c9e8" stroke="#6d8fb0" strokeWidth="1.2" />
      <path d="M19 19l1 18M24 19v18M29 19l-1 18" stroke="#6d8fb0" strokeWidth="1.3" />
    </svg>
  ),
  user: (
    <svg viewBox="0 0 48 48" width="100%" height="100%">
      <circle cx="24" cy="24" r="22" fill="#0f6cbd" />
      <text x="24" y="31" fontSize="20" fontWeight="600" fill="#fff" textAnchor="middle" fontFamily="Segoe UI, Arial">S</text>
    </svg>
  ),
}

export function FileIcon({ name, size = 48, className = '' }) {
  let content
  if (name?.startsWith('folder')) content = <Folder badge={name === 'folder' ? null : name} />
  else content = file[name] ?? apps[name] ?? file.txt
  return (
    <span className={`inline-block shrink-0 ${className}`} style={{ width: size, height: size }} aria-hidden="true">
      {content}
    </span>
  )
}

// ---- Line glyphs (Fluent System Icons style, 20px grid) ----
const g = {
  back: 'M12.5 4.5L7 10l5.5 5.5',
  forward: 'M7.5 4.5L13 10l-5.5 5.5',
  up: 'M10 16V4.5M5 9.5l5-5 5 5',
  down: 'M4.5 7.5L10 13l5.5-5.5',
  chevronRight: 'M8 5l5 5-5 5',
  refresh: 'M15.5 10a5.5 5.5 0 1 1-1.6-3.9M15.5 3.5v3h-3',
  search: 'M8.5 3.5a5 5 0 1 1 0 10 5 5 0 0 1 0-10zM12.2 12.2l4.3 4.3',
  close: 'M5 5l10 10M15 5L5 15',
  minimize: 'M5 10h10',
  maximize: 'M5.5 5.5h9v9h-9z',
  restore: 'M5.5 7.5h7v7h-7zM7.5 7.5v-2h7v7h-2',
  play: 'M6.5 4.2v11.6c0 .6.6.9 1.1.6l9-5.8c.5-.3.5-1 0-1.3l-9-5.8c-.5-.3-1.1 0-1.1.7z',
  pause: 'M6 4.5h2.5v11H6zM11.5 4.5H14v11h-2.5z',
  next: 'M5 4.5v11l8-5.5-8-5.5zM15 4.5v11',
  prev: 'M15 4.5v11l-8-5.5 8-5.5zM5 4.5v11',
  volume: 'M3.5 7.5h3l4-3.5v12l-4-3.5h-3zM13.5 7a4 4 0 0 1 0 6M15.5 5a7 7 0 0 1 0 10',
  mute: 'M3.5 7.5h3l4-3.5v12l-4-3.5h-3zM13 8l4 4M17 8l-4 4',
  wifi: 'M2.5 8a11 11 0 0 1 15 0M5 10.7a7.4 7.4 0 0 1 10 0M7.5 13.3a3.6 3.6 0 0 1 5 0M10 16h.01',
  power: 'M10 3v6.5M6 5.3a6 6 0 1 0 8 0',
  grid: 'M4 4h5v5H4zM11 4h5v5h-5zM4 11h5v5H4zM11 11h5v5h-5z',
  list: 'M4 5h12M4 10h12M4 15h12',
  sort: 'M6 4v12M3.5 13.5L6 16l2.5-2.5M14 16V4M11.5 6.5L14 4l2.5 2.5',
  home: 'M3.5 9L10 3.5 16.5 9v7a.5.5 0 0 1-.5.5h-4v-4.5h-4V16.5H4a.5.5 0 0 1-.5-.5V9z',
  external: 'M8 4.5H5a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5v-3M11 4.5h4.5V9M15.5 4.5L9 11',
  music: 'M8 14.5V5l8-1.5V13M8 14.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM16 13a2 2 0 1 1-4 0 2 2 0 0 1 4 0z',
  moon: 'M15.5 12.5A6.5 6.5 0 0 1 7.5 4.5a6.5 6.5 0 1 0 8 8z',
  sun: 'M10 6.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zM10 2v1.5M10 16.5V18M2 10h1.5M16.5 10H18M4.3 4.3l1.1 1.1M14.6 14.6l1.1 1.1M4.3 15.7l1.1-1.1M14.6 5.4l1.1-1.1',
  image: 'M4 5h12v10H4zM4 13l4-4 3 3 2-2 3 3',
  more: 'M5 10h.01M10 10h.01M15 10h.01',
  send: 'M3.5 10L16.5 4l-3.5 12.5-3-5-6.5-1.5zM10 11.5l6.5-7.5',
  shuffle: 'M3 6h3l7 8h4M14.5 11.5L17 14l-2.5 2.5M3 14h3l2-2.3M11 8.3L13 6h4M14.5 3.5L17 6l-2.5 2.5',
  plus: 'M10 4v12M4 10h12',
  battery: 'M3 7h12v6H3zM15.5 9h1.5v2h-1.5M4.5 8.5h7v3h-7z',
  star: 'M10 3l2.1 4.4 4.8.6-3.5 3.3.9 4.7L10 13.7 5.7 16l.9-4.7L3.1 8l4.8-.6L10 3z',
  copy: 'M7 7h8.5v9H7zM4.5 13V4h8',
  download: 'M10 3.5v9M6 9l4 4 4-4M4 16h12',
  print: 'M6 8V3.5h8V8M5 14H3.5V8.5h13V14H15M6 11.5h8V17H6z',
  zoomIn: 'M8.5 3.5a5 5 0 1 1 0 10 5 5 0 0 1 0-10zM12.2 12.2l4.3 4.3M6.5 8.5h4M8.5 6.5v4',
  zoomOut: 'M8.5 3.5a5 5 0 1 1 0 10 5 5 0 0 1 0-10zM12.2 12.2l4.3 4.3M6.5 8.5h4',
  shield: 'M10 2.5l6 2.2v4.6c0 3.9-2.6 6.9-6 8.2-3.4-1.3-6-4.3-6-8.2V4.7l6-2.2zM7.5 10l1.8 1.8 3.4-3.6',
  github: 'M10 2.5a7.5 7.5 0 0 0-2.4 14.6c.4.1.5-.2.5-.4v-1.4c-2.1.5-2.5-.9-2.5-.9-.3-.9-.8-1.1-.8-1.1-.7-.5 0-.5 0-.5.8.1 1.2.8 1.2.8.7 1.2 1.8.8 2.2.6.1-.5.3-.8.5-1-1.7-.2-3.4-.8-3.4-3.7 0-.8.3-1.5.8-2-.1-.2-.3-1 .1-2 0 0 .6-.2 2.1.8a7 7 0 0 1 3.8 0c1.4-1 2.1-.8 2.1-.8.4 1 .2 1.8.1 2 .5.5.8 1.2.8 2 0 2.9-1.8 3.5-3.4 3.7.3.2.5.7.5 1.4v2.1c0 .2.1.5.5.4A7.5 7.5 0 0 0 10 2.5z',
  linkedin: 'M4 7.5h2.5V16H4zM5.25 3.5a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8zM8.5 7.5h2.4v1.2c.4-.7 1.3-1.4 2.6-1.4 2.6 0 3 1.7 3 3.9V16H14v-4.2c0-1 0-2.3-1.4-2.3s-1.6 1.1-1.6 2.2V16H8.5z',
}

const filled = new Set(['play', 'pause', 'github', 'linkedin'])

export function Glyph({ name, size = 16, className = '', strokeWidth = 1.3 }) {
  const d = g[name]
  const isFilled = filled.has(name)
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} className={`shrink-0 ${className}`} aria-hidden="true"
      fill={isFilled ? 'currentColor' : 'none'} stroke={isFilled ? 'none' : 'currentColor'}
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  )
}

// Start button glyph: a personal monogram tile instead of the Windows logo (trademark).
export function StartGlyph({ size = 24 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <defs><linearGradient id="sg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#3ccbf4" /><stop offset="1" stopColor="#0f6cbd" /></linearGradient></defs>
      <rect x="2" y="2" width="20" height="20" rx="5.5" fill="url(#sg)" />
      <path d="M15.3 8.4c-.7-.9-1.9-1.4-3.3-1.4-1.9 0-3.2 1-3.2 2.5 0 3.3 6.6 1.9 6.6 5 0 1.5-1.4 2.5-3.4 2.5-1.5 0-2.8-.6-3.5-1.6" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </svg>
  )
}

// Generated cover for media items without a poster.
export function Poster({ seed = '', src, className = '' }) {
  if (src) return <img src={src} alt="" className={`object-cover ${className}`} />
  let h = 0
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) % 360
  const initials = seed.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
  return (
    <div className={`grid place-items-center text-white font-semibold ${className}`}
      style={{ background: `linear-gradient(150deg, hsl(${h} 70% 45%), hsl(${(h + 50) % 360} 65% 25%))` }}>
      <span style={{ fontSize: '2.2em', letterSpacing: '.02em', opacity: 0.9 }}>{initials}</span>
    </div>
  )
}
