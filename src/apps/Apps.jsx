import { useState } from 'react'
import { useMusic, formatTime } from '../store/music'
import { thumb } from '../data/playlist'
import { stack } from '../data/career'
import { profile } from '../data/profile'
import { FileIcon, Glyph } from '../components/icons/Icons'

// ---------------------------------------------------------------- Media Player
export function MediaPlayer() {
  const { tracks, index, playing, current, duration, playIndex, toggle, next, prev, seek, volume, setVolume, toggleMute, muted } = useMusic()
  const track = tracks[index]
  return (
    <div className="h-full flex flex-col @container">
      <div className="flex-1 min-h-0 flex">
        <aside className="hidden @2xl:flex w-52 shrink-0 flex-col gap-0.5 p-2 text-[13px]" style={{ borderRight: '1px solid var(--stroke)' }}>
          {[['home', 'Home'], ['music', 'Music library'], ['list', 'Playlists']].map(([g, l], i) => (
            <button key={l} className="btn-subtle relative h-9 px-3 flex items-center gap-3 text-left" style={i === 2 ? { background: 'var(--hover)' } : undefined}>
              {i === 2 && <span className="absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-full" style={{ background: 'var(--accent)' }} />}
              <Glyph name={g} size={16} /> {l}
            </button>
          ))}
        </aside>
        <main className="flex-1 min-w-0 scroll" style={{ background: 'var(--layer)' }}>
          <header className="flex items-end gap-5 p-6">
            <div className="w-28 h-28 shrink-0 rounded-lg grid grid-cols-2 overflow-hidden shadow-lg">
              {tracks.slice(0, 4).map((t) => <img key={t.videoId} src={thumb(t.videoId)} alt="" className="w-full h-full object-cover" />)}
            </div>
            <div className="min-w-0">
              <p className="text-xs" style={{ color: 'var(--text-2)' }}>Playlist</p>
              <h1 className="text-2xl font-semibold">Sam&apos;s Playlist</h1>
              <p className="text-xs mt-1" style={{ color: 'var(--text-2)' }}>{tracks.length} songs · via YouTube Music</p>
              <button className="btn-accent h-8 px-4 mt-3 inline-flex items-center gap-2 text-[13px]" onClick={() => playIndex(0)}>
                <Glyph name="play" size={14} /> Play all
              </button>
            </div>
          </header>
          <ol className="px-3 pb-4">
            {tracks.map((t, i) => {
              const active = i === index
              return (
                <li key={t.videoId}>
                  <button onClick={() => (active ? toggle() : playIndex(i))}
                    className="btn-subtle w-full grid grid-cols-[28px_40px_1fr] @lg:grid-cols-[28px_40px_1fr_1fr] items-center gap-3 px-3 py-1.5 text-left text-[13px]"
                    style={active ? { background: 'var(--selected)' } : undefined}>
                    <span className="text-center text-xs" style={{ color: active ? 'var(--accent)' : 'var(--text-3)' }}>
                      {active && playing ? <Eq /> : i + 1}
                    </span>
                    <img src={thumb(t.videoId)} alt="" className="w-10 h-10 rounded object-cover" />
                    <span className="truncate" style={active ? { color: 'var(--accent)', fontWeight: 600 } : undefined}>{t.title}</span>
                    <span className="truncate hidden @lg:block" style={{ color: 'var(--text-2)' }}>{t.artist}</span>
                  </button>
                </li>
              )
            })}
          </ol>
        </main>
      </div>

      {/* Transport bar */}
      <footer className="shrink-0 flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2" style={{ borderTop: '1px solid var(--stroke)' }}>
        <div className="flex items-center gap-3 min-w-0 flex-1 basis-48">
          <img src={thumb(track.videoId)} alt="" className="w-11 h-11 rounded object-cover" />
          <div className="min-w-0">
            <div className="text-[13px] font-semibold truncate">{track.title}</div>
            <div className="text-xs truncate" style={{ color: 'var(--text-2)' }}>{track.artist}</div>
          </div>
        </div>
        <div className="flex flex-col items-center flex-[2] basis-64">
          <div className="flex items-center gap-2">
            <button className="btn-subtle w-8 h-8 grid place-items-center" onClick={prev} aria-label="Previous"><Glyph name="prev" size={15} /></button>
            <button className="btn-accent w-9 h-9 grid place-items-center !rounded-full" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}><Glyph name={playing ? 'pause' : 'play'} size={16} /></button>
            <button className="btn-subtle w-8 h-8 grid place-items-center" onClick={next} aria-label="Next"><Glyph name="next" size={15} /></button>
          </div>
          <div className="flex items-center gap-2 w-full text-[11px]" style={{ color: 'var(--text-3)' }}>
            <span>{formatTime(current)}</span>
            <input type="range" min="0" max={duration || 0} value={Math.min(current, duration || 0)} onChange={(e) => seek(Number(e.target.value))}
              className="flex-1 h-1 accent-[var(--accent)]" aria-label="Seek" disabled={!duration} />
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        <div className="hidden @2xl:flex items-center gap-2 flex-1 justify-end">
          <button className="btn-subtle w-8 h-8 grid place-items-center" onClick={toggleMute} aria-label="Mute"><Glyph name={muted || volume === 0 ? 'mute' : 'volume'} size={16} /></button>
          <input type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="w-24 accent-[var(--accent)]" aria-label="Volume" />
        </div>
      </footer>
    </div>
  )
}

function Eq() {
  return (
    <span className="inline-flex items-end gap-[2px] h-3" aria-label="Playing">
      {[0, 0.25, 0.5].map((d) => <span key={d} className="eq-bar w-[3px] h-full rounded-sm" style={{ background: 'var(--accent)', animationDelay: `${d}s` }} />)}
    </span>
  )
}

// ---------------------------------------------------------------- Task Manager (Tech Stack)
export function TaskManager() {
  const [open, setOpen] = useState(() => new Set(stack.map((s) => s.title)))
  const [filter, setFilter] = useState('')
  const toggle = (t) => setOpen((o) => { const n = new Set(o); n.has(t) ? n.delete(t) : n.add(t); return n })
  const q = filter.trim().toLowerCase()
  const groups = stack.map((g) => ({ ...g, items: g.items.filter((i) => !q || i.toLowerCase().includes(q) || g.title.toLowerCase().includes(q)) })).filter((g) => g.items.length)
  const total = stack.reduce((n, g) => n + g.items.length, 0)

  return (
    <div className="h-full flex">
      <aside className="w-12 shrink-0 flex flex-col items-center gap-1 pt-2" style={{ borderRight: '1px solid var(--stroke)' }}>
        {['grid', 'list', 'sort', 'refresh'].map((g, i) => (
          <button key={g} className="btn-subtle relative w-10 h-9 grid place-items-center" style={i === 0 ? { background: 'var(--hover)' } : undefined} aria-label={g}>
            {i === 0 && <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full" style={{ background: 'var(--accent)' }} />}
            <Glyph name={g} size={16} />
          </button>
        ))}
      </aside>
      <div className="flex-1 min-w-0 flex flex-col" style={{ background: 'var(--layer)' }}>
        <div className="flex items-center gap-3 px-5 h-14 shrink-0">
          <h1 className="text-base font-semibold flex-1">Processes</h1>
          <label className="field h-8 w-48 flex items-center gap-2 px-2">
            <Glyph name="search" size={14} className="opacity-70" />
            <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filter tech" className="flex-1 min-w-0 bg-transparent outline-none text-xs" />
          </label>
        </div>
        <div className="flex-1 min-h-0 scroll">
          <table className="w-full text-[13px]">
            <thead className="sticky top-0" style={{ background: 'var(--layer)' }}>
              <tr className="text-left text-xs" style={{ color: 'var(--text-2)', borderBottom: '1px solid var(--stroke)' }}>
                <th className="font-normal px-5 py-2">Name</th>
                <th className="font-normal px-3 py-2 w-28">Status</th>
                <th className="font-normal px-3 py-2 w-40 hidden sm:table-cell">Category</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((g) => (
                <Group key={g.title} g={g} open={open.has(g.title) || !!q} onToggle={() => toggle(g.title)} />
              ))}
            </tbody>
          </table>
        </div>
        <div className="h-8 shrink-0 flex items-center px-5 text-xs" style={{ color: 'var(--text-2)', borderTop: '1px solid var(--stroke)' }}>
          {total} technologies running · {stack.length} groups
        </div>
      </div>
    </div>
  )
}

function Group({ g, open, onToggle }) {
  return (
    <>
      <tr className="hover:bg-[var(--hover)]" onClick={onToggle}>
        <td className="px-3 py-1.5 font-semibold" colSpan={3}>
          <span className="flex items-center gap-2">
            <Glyph name={open ? 'down' : 'chevronRight'} size={12} />
            {g.title} ({g.items.length})
          </span>
        </td>
      </tr>
      {open && g.items.map((item) => (
        <tr key={item} className="hover:bg-[var(--hover)]">
          <td className="pl-12 pr-3 py-1.5">
            <span className="flex items-center gap-2.5">
              <span className="w-4 h-4 rounded grid place-items-center text-[9px] font-bold text-white" style={{ background: `hsl(${[...item].reduce((a, c) => a + c.charCodeAt(0), 0) % 360} 55% 45%)` }}>{item[0]}</span>
              {item}
            </span>
          </td>
          <td className="px-3 py-1.5" style={{ color: 'var(--text-2)' }}>Running</td>
          <td className="px-3 py-1.5 hidden sm:table-cell" style={{ color: 'var(--text-2)' }}>{g.title}</td>
        </tr>
      ))}
    </>
  )
}

// ---------------------------------------------------------------- Mail (Contact)
export function Mail() {
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [copied, setCopied] = useState(false)
  const send = (e) => {
    e.preventDefault()
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject || 'Hello Sam')}&body=${encodeURIComponent(body)}`
  }
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch { /* clipboard blocked */ }
  }
  return (
    <div className="h-full flex @container">
      <aside className="hidden @xl:flex w-56 shrink-0 flex-col p-3 gap-1 text-[13px]" style={{ borderRight: '1px solid var(--stroke)' }}>
        <div className="flex items-center gap-3 p-2 mb-2">
          <FileIcon name="user" size={36} />
          <div className="min-w-0">
            <div className="font-semibold truncate">{profile.name}</div>
            <div className="text-xs truncate" style={{ color: 'var(--text-2)' }}>{profile.status}</div>
          </div>
        </div>
        <button className="btn-subtle h-9 px-3 flex items-center gap-3 text-left" onClick={copy}><Glyph name="copy" size={16} /> {copied ? 'Copied!' : 'Copy email'}</button>
        {profile.links.map((l) => (
          <a key={l.label} href={l.url} target="_blank" rel="noreferrer" className="btn-subtle h-9 px-3 flex items-center gap-3"><Glyph name={l.icon} size={16} /> {l.label}</a>
        ))}
        <a href={profile.resume} target="_blank" rel="noreferrer" className="btn-subtle h-9 px-3 flex items-center gap-3"><Glyph name="download" size={16} /> Resume</a>
      </aside>
      <form onSubmit={send} className="flex-1 min-w-0 flex flex-col" style={{ background: 'var(--layer)' }}>
        <div className="flex items-center gap-2 px-4 h-12 shrink-0" style={{ borderBottom: '1px solid var(--stroke)' }}>
          <button type="submit" className="btn-accent h-8 px-4 flex items-center gap-2 text-[13px]"><Glyph name="send" size={15} /> Send</button>
          <span className="text-xs" style={{ color: 'var(--text-3)' }}>Opens in your email app</span>
        </div>
        <div className="px-4 text-[13px]">
          <div className="flex items-center gap-3 h-11" style={{ borderBottom: '1px solid var(--stroke)' }}>
            <span style={{ color: 'var(--text-2)' }} className="w-14">To</span>
            <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: 'var(--selected)' }}>{profile.name} &lt;{profile.email}&gt;</span>
          </div>
          <div className="flex items-center gap-3 h-11" style={{ borderBottom: '1px solid var(--stroke)' }}>
            <label htmlFor="mail-subject" style={{ color: 'var(--text-2)' }} className="w-14">Subject</label>
            <input id="mail-subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Let's work together" className="flex-1 bg-transparent outline-none" />
          </div>
        </div>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} aria-label="Message" placeholder="Write your message…"
          className="flex-1 resize-none bg-transparent outline-none p-4 text-[14px] leading-relaxed scroll" />
      </form>
    </div>
  )
}
