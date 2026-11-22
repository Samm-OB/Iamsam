import { useState } from 'react'
import { aboutText } from '../data/profile'
import { projects } from '../data/projects'
import { Glyph, Poster } from '../components/icons/Icons'

// ---------------------------------------------------------------- Notepad
export function Notepad({ win }) {
  const [text, setText] = useState(win.props.text ?? aboutText)
  const [pos, setPos] = useState({ ln: 1, col: 1 })
  const onSelect = (e) => {
    const before = e.target.value.slice(0, e.target.selectionStart).split('\n')
    setPos({ ln: before.length, col: before[before.length - 1].length + 1 })
  }
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-1 px-2 h-9 text-[13px] shrink-0">
        {['File', 'Edit', 'View'].map((m) => <button key={m} className="btn-subtle px-3 h-7">{m}</button>)}
      </div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} onSelect={onSelect} spellCheck={false}
        className="flex-1 resize-none outline-none p-4 scroll text-[14px] leading-relaxed"
        style={{ background: 'var(--card)', fontFamily: 'Consolas, "Cascadia Mono", ui-monospace, monospace', borderTop: '1px solid var(--stroke)' }} />
      <div className="h-7 shrink-0 flex items-center gap-6 px-4 text-xs" style={{ color: 'var(--text-2)', borderTop: '1px solid var(--stroke)' }}>
        <span>Ln {pos.ln}, Col {pos.col}</span>
        <span className="hidden sm:inline">{text.length} characters</span>
        <span className="flex-1" />
        <span className="hidden sm:inline">100%</span>
        <span className="hidden sm:inline">Windows (CRLF)</span>
        <span>UTF-8</span>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- Document (Word-style page)
export function DocumentViewer({ win }) {
  const e = win.props.entry
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-1 px-2 h-10 text-[13px] shrink-0" style={{ background: 'var(--layer)', borderBottom: '1px solid var(--stroke)' }}>
        {['File', 'Home', 'Insert', 'Layout', 'View'].map((m, i) => (
          <button key={m} className="btn-subtle px-3 h-7" style={i === 1 ? { color: 'var(--accent)', fontWeight: 600 } : undefined}>{m}</button>
        ))}
        <span className="flex-1" />
        <span className="text-xs px-2" style={{ color: 'var(--text-3)' }}>Read-only</span>
      </div>
      <div className="flex-1 scroll py-8 px-4" style={{ background: 'color-mix(in srgb, var(--mica) 85%, #888 15%)' }}>
        <article className="mx-auto max-w-[640px] min-h-[600px] bg-white text-[#1b1b1b] px-10 sm:px-16 py-14 shadow-md"
          style={{ fontFamily: 'Calibri, "Segoe UI", Arial, sans-serif' }}>
          <p className="text-xs uppercase tracking-widest text-[#185ABD] font-semibold">{e.period}</p>
          <h1 className="text-[26px] font-semibold mt-2 leading-tight">{e.heading}</h1>
          <p className="text-[15px] text-[#555] mt-1">{e.org}</p>
          <hr className="my-6 border-[#ddd]" />
          {e.body.map((p, i) => <p key={i} className="text-[15px] leading-7 mb-4">{p}</p>)}
          {e.bullets && (
            <>
              <h2 className="text-[15px] font-semibold mt-6 mb-2 text-[#185ABD]">Highlights</h2>
              <ul className="list-disc pl-6 space-y-1.5 text-[15px] leading-6">
                {e.bullets.map((b) => <li key={b}>{b}</li>)}
              </ul>
            </>
          )}
        </article>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- Project (Photos-style)
export function ProjectViewer({ win }) {
  const p = projects.find((x) => x.id === win.props.projectId)
  const [i, setI] = useState(0)
  if (!p) return null
  const imgs = p.images
  return (
    <div className="h-full @container">
      <div className="h-full flex flex-col @3xl:flex-row">
        <div className="relative flex-1 min-h-[220px] grid place-items-center p-4" style={{ background: '#111' }}>
          <img src={imgs[i]} alt={`${p.name} screenshot ${i + 1}`} className="max-w-full max-h-full object-contain rounded" />
          {imgs.length > 1 && (
            <>
              <button aria-label="Previous image" className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full grid place-items-center bg-black/50 text-white hover:bg-black/70"
                onClick={() => setI((i - 1 + imgs.length) % imgs.length)}><Glyph name="back" size={16} /></button>
              <button aria-label="Next image" className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full grid place-items-center bg-black/50 text-white hover:bg-black/70"
                onClick={() => setI((i + 1) % imgs.length)}><Glyph name="forward" size={16} /></button>
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-white/80 bg-black/50 rounded-full px-2.5 py-0.5">{i + 1} / {imgs.length}</span>
            </>
          )}
        </div>
        <aside className="@3xl:w-[340px] shrink-0 scroll p-5 max-h-[50%] @3xl:max-h-none" style={{ background: 'var(--layer)', borderLeft: '1px solid var(--stroke)' }}>
          <p className="text-xs" style={{ color: 'var(--text-2)' }}>{p.folder}</p>
          <h1 className="text-xl font-semibold mt-0.5">{p.name}</h1>
          {p.link && (
            <a href={p.link} target="_blank" rel="noreferrer" className="btn-accent inline-flex items-center gap-2 h-8 px-3 mt-3 text-[13px]">
              <Glyph name="external" size={14} /> {p.link.includes('github.com') ? 'View on GitHub' : 'Open live site'}
            </a>
          )}
          <p className="text-[13px] leading-relaxed mt-4 whitespace-pre-line" style={{ color: 'var(--text-2)' }}>{p.description}</p>
          {p.features.length > 0 && (
            <>
              <h2 className="text-[13px] font-semibold mt-5 mb-2">Features</h2>
              <ul className="text-[13px] space-y-1 list-disc pl-5" style={{ color: 'var(--text-2)' }}>{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
            </>
          )}
          <h2 className="text-[13px] font-semibold mt-5 mb-2">Tech stack</h2>
          <div className="flex flex-wrap gap-1.5">
            {p.tech.map((t) => <span key={t} className="text-xs px-2 py-1 rounded" style={{ background: 'var(--card)', border: '1px solid var(--stroke)' }}>{t}</span>)}
          </div>
        </aside>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- Movies & TV
export function MediaViewer({ win }) {
  const { item, label } = win.props
  return (
    <div className="h-full scroll @container" style={{ background: 'var(--layer)' }}>
      <div className="flex flex-col @lg:flex-row gap-6 p-6">
        <div className="w-40 @lg:w-52 shrink-0 aspect-[2/3] rounded-lg overflow-hidden shadow-lg text-2xl">
          <Poster seed={item.title} src={item.poster} className="w-full h-full" />
        </div>
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--accent)' }}>{label}</p>
          <h1 className="text-2xl font-semibold mt-1">{item.title}</h1>
          {item.year && <p className="text-[13px] mt-1" style={{ color: 'var(--text-2)' }}>{item.year}</p>}
          {item.rating > 0 && <div className="flex gap-0.5 mt-3" aria-label={`${item.rating} out of 5`}>
            {Array.from({ length: 5 }, (_, i) => (
              <svg key={i} viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
                <path d="M10 2.5l2.3 4.8 5.2.7-3.8 3.6.9 5.2L10 14.3l-4.6 2.5.9-5.2L2.5 8l5.2-.7L10 2.5z" fill={i < item.rating ? '#f7b500' : 'none'} stroke={i < item.rating ? '#f7b500' : 'var(--text-3)'} strokeWidth="1" />
              </svg>
            ))}
          </div>}
          {item.take && (
            <>
              <h2 className="text-[13px] font-semibold mt-6 mb-1">My take</h2>
              <p className="text-[15px] leading-relaxed">{item.take}</p>
            </>
          )}
          <p className="text-[13px] mt-6" style={{ color: 'var(--text-2)' }}>On Sam&apos;s watch list.</p>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- PDF
export function PdfViewer({ win }) {
  const { src, name } = win.props
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-1 px-3 h-10 shrink-0 text-[13px]" style={{ background: 'var(--layer)', borderBottom: '1px solid var(--stroke)' }}>
        <span className="truncate flex-1">{name}</span>
        <a href={src} download className="btn-subtle h-8 px-2 flex items-center gap-1.5"><Glyph name="download" size={16} /> Download</a>
        <a href={src} target="_blank" rel="noreferrer" className="btn-subtle h-8 px-2 flex items-center gap-1.5"><Glyph name="external" size={16} /> Open in new tab</a>
      </div>
      <object data={`${src}#view=FitH`} type="application/pdf" className="flex-1 w-full" style={{ background: '#525659' }} aria-label={name}>
        <div className="h-full grid place-items-center p-6 text-center">
          <div>
            <p className="mb-4">This browser can’t show the PDF inline.</p>
            <a href={src} target="_blank" rel="noreferrer" className="btn-accent inline-flex h-9 px-4 items-center">Open {name}</a>
          </div>
        </div>
      </object>
    </div>
  )
}
