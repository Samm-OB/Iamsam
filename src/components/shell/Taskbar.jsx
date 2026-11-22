import { useEffect, useRef, useState } from 'react'
import { useOS } from '../../store/os'
import { useMusic } from '../../store/music'
import { pathTo } from '../../data/fs'
import { FileIcon, Glyph, StartGlyph } from '../icons/Icons'
import { TASKBAR_H } from '../../lib/appMeta'
import { useClock } from '../../lib/useViewport'

const PINNED = [
  { app: 'explorer', title: 'File Explorer', open: (os) => os.openApp({ app: 'explorer', key: 'explorer:desktop', title: 'Home', props: { path: pathTo('desktop') } }) },
  { app: 'player', title: 'Media Player', open: (os) => os.openNode('player') },
  { app: 'notepad', title: 'Notepad', open: (os) => os.openNode('about') },
  { app: 'mail', title: 'Mail', open: (os) => os.openNode('contact') },
  { app: 'taskmgr', title: 'Task Manager', open: (os) => os.openNode('stack') },
]

export default function Taskbar() {
  const os = useOS()
  const { windows, focusedId, startOpen, setStart, taskbarClick, showDesktop } = os
  const [flyout, setFlyout] = useState(null) // 'quick' | 'calendar'

  const live = windows.filter((w) => !w.closing)
  const claimed = new Set()
  const pinnedItems = PINNED.map((p) => {
    const w = live.find((x) => x.app === p.app && !claimed.has(x.id))
    if (w) claimed.add(w.id)
    return { key: p.app, icon: p.app === 'explorer' ? 'explorer' : (w?.icon ?? p.app), title: w?.title ?? p.title, win: w, pinned: p }
  })
  const extra = live.filter((w) => !claimed.has(w.id)).map((w) => ({ key: `w${w.id}`, icon: w.icon, title: w.title, win: w }))

  return (
    <>
      <nav className="fixed left-0 right-0 bottom-0 z-[8000] taskbar-material flex items-center no-select"
        style={{ height: TASKBAR_H, borderTop: '1px solid var(--stroke)', color: 'var(--text)' }}
        onContextMenu={(e) => e.preventDefault()}>
        <div className="flex-1" />
        <div className="flex items-center gap-1">
          <TaskButton title="Start" active={startOpen} onClick={() => setStart(!startOpen)} data-start-button>
            <StartGlyph size={24} />
          </TaskButton>
          <TaskButton title="Search" onClick={() => setStart(true, '')} data-start-button>
            <Glyph name="search" size={20} />
          </TaskButton>
          {[...pinnedItems, ...extra].map((it) => {
            const state = !it.win ? null : it.win.minimized ? 'running' : it.win.id === focusedId ? 'focused' : 'running'
            return (
              <TaskButton key={it.key} title={it.title} state={state} data-taskbar-win={it.win?.id}
                onClick={() => (it.win ? taskbarClick(it.win.id) : it.pinned.open(useOS.getState()))}>
                <FileIcon name={it.icon} size={24} />
              </TaskButton>
            )
          })}
        </div>
        <div className="flex-1 flex justify-end items-center h-full">
          <MusicTray />
          <button className={`btn-subtle h-10 px-2.5 flex items-center gap-2.5 ${flyout === 'quick' ? 'bg-[var(--hover)]' : ''}`}
            data-flyout-button onClick={() => setFlyout(flyout === 'quick' ? null : 'quick')} aria-label="Quick settings">
            <Glyph name="wifi" size={16} />
            <VolumeGlyph />
            <Glyph name="battery" size={16} />
          </button>
          <ClockButton active={flyout === 'calendar'} onClick={() => setFlyout(flyout === 'calendar' ? null : 'calendar')} />
          <button title="Show desktop" aria-label="Show desktop" onClick={showDesktop}
            className="h-full w-3 ml-1 hover:bg-[var(--hover)]" style={{ borderLeft: '1px solid var(--stroke)' }} />
        </div>
      </nav>
      {flyout && <Flyout kind={flyout} onClose={() => setFlyout(null)} />}
    </>
  )
}

function TaskButton({ children, title, onClick, state, active, ...rest }) {
  return (
    <button title={title} aria-label={title} onClick={onClick} {...rest}
      className="relative w-11 h-10 grid place-items-center rounded transition-colors hover:bg-[var(--hover)] active:scale-95"
      style={{ background: state === 'focused' || active ? 'var(--hover)' : undefined }}>
      {children}
      {state && (
        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-[3px] rounded-full transition-all"
          style={{ width: state === 'focused' ? 16 : 6, background: state === 'focused' ? 'var(--accent)' : 'var(--text-3)' }} />
      )}
    </button>
  )
}

function VolumeGlyph() {
  const muted = useMusic((s) => s.muted || s.volume === 0)
  return <Glyph name={muted ? 'mute' : 'volume'} size={16} />
}

function MusicTray() {
  const { playing, toggle } = useMusic()
  const { widgetOpen, toggleWidget } = useOS()
  return (
    <button className="btn-subtle h-10 px-2 flex items-center gap-1.5" title={widgetOpen ? 'Hide music widget' : 'Show music widget'}
      onClick={toggleWidget} onContextMenu={(e) => { e.preventDefault(); toggle() }} aria-label="Music widget">
      {playing ? (
        <span className="flex items-end gap-[2px] h-3.5 w-4" aria-hidden="true">
          {[0, 0.2, 0.4].map((d) => <span key={d} className="eq-bar w-[3px] h-full rounded-sm" style={{ background: 'var(--accent)', animationDelay: `${d}s` }} />)}
        </span>
      ) : (
        <Glyph name="music" size={16} />
      )}
    </button>
  )
}

function ClockButton({ onClick, active }) {
  const now = useClock(10_000)
  return (
    <button onClick={onClick} data-flyout-button className={`btn-subtle h-10 px-2.5 text-right text-xs leading-tight ${active ? 'bg-[var(--hover)]' : ''}`}>
      <div>{now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</div>
      <div>{now.toLocaleDateString()}</div>
    </button>
  )
}

function Flyout({ kind, onClose }) {
  const ref = useRef(null)
  useEffect(() => {
    const onDown = (e) => {
      if (ref.current?.contains(e.target) || e.target.closest?.('[data-flyout-button]')) return
      onClose()
    }
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('pointerdown', onDown, true)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('pointerdown', onDown, true)
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])
  return (
    <div ref={ref} className="fixed z-[9000] right-3 acrylic rounded-lg anim-flyout"
      style={{ bottom: TASKBAR_H + 12, width: 360, maxWidth: 'calc(100vw - 24px)', boxShadow: 'var(--shadow-flyout)', color: 'var(--text)' }}>
      {kind === 'quick' ? <QuickSettings /> : <Calendar />}
    </div>
  )
}

function QuickSettings() {
  const { theme, toggleTheme, widgetOpen, toggleWidget, nextWallpaper } = useOS()
  const { volume, setVolume } = useMusic()
  const tiles = [
    { label: 'Wi-Fi', sub: 'Connected', icon: 'wifi', on: true },
    { label: 'Dark mode', icon: 'moon', on: theme === 'dark', onClick: toggleTheme },
    { label: 'Music widget', icon: 'music', on: widgetOpen, onClick: toggleWidget },
    { label: 'Wallpaper', sub: 'Next', icon: 'image', on: false, onClick: () => nextWallpaper(3) },
  ]
  return (
    <div className="p-5">
      <div className="grid grid-cols-3 gap-3">
        {tiles.map((t) => (
          <div key={t.label} className="flex flex-col items-center gap-1.5">
            <button onClick={t.onClick} aria-pressed={t.on} aria-label={t.label}
              className={`w-full h-12 rounded grid place-items-center ${t.on ? 'btn-accent' : 'btn-std'}`}>
              <Glyph name={t.icon} size={18} />
            </button>
            <span className="text-xs">{t.label}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 mt-6">
        <Glyph name={volume === 0 ? 'mute' : 'volume'} size={18} />
        <input type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(Number(e.target.value))}
          className="flex-1 accent-[var(--accent)]" aria-label="Volume" />
        <span className="text-xs w-7 text-right">{volume}</span>
      </div>
    </div>
  )
}

function Calendar() {
  const now = useClock(60_000)
  const [offset, setOffset] = useState(0)
  const view = new Date(now.getFullYear(), now.getMonth() + offset, 1)
  const startDay = view.getDay()
  const days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate()
  const cells = [...Array(startDay).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)]
  const isToday = (d) => offset === 0 && d === now.getDate()
  return (
    <div className="p-4">
      <div className="text-[13px] font-semibold mb-3 px-1">{now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</div>
      <div className="flex items-center justify-between px-1 mb-2">
        <span className="text-[13px] font-semibold">{view.toLocaleDateString([], { month: 'long', year: 'numeric' })}</span>
        <span className="flex">
          <button className="btn-subtle w-8 h-8 grid place-items-center" aria-label="Previous month" onClick={() => setOffset(offset - 1)}><Glyph name="up" size={14} /></button>
          <button className="btn-subtle w-8 h-8 grid place-items-center" aria-label="Next month" onClick={() => setOffset(offset + 1)}><Glyph name="down" size={14} /></button>
        </span>
      </div>
      <div className="grid grid-cols-7 text-center text-xs gap-y-1">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => <span key={d} className="h-8 grid place-items-center" style={{ color: 'var(--text-2)' }}>{d}</span>)}
        {cells.map((d, i) => (
          <span key={i} className="h-10 grid place-items-center">
            {d && (
              <span className="w-9 h-9 grid place-items-center rounded-full"
                style={isToday(d) ? { background: 'var(--accent)', color: 'var(--accent-text)', fontWeight: 600 } : undefined}>{d}</span>
            )}
          </span>
        ))}
      </div>
    </div>
  )
}
