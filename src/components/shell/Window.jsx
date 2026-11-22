import { useRef, useState } from 'react'
import { useOS } from '../../store/os'
import { FileIcon, Glyph } from '../icons/Icons'
import { TASKBAR_H } from '../../lib/appMeta'
import { appComponents } from '../../apps'

const MIN_W = 360
const MIN_H = 240
const EDGES = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw']
const edgeStyle = {
  n: 'top-0 left-2 right-2 h-1.5 cursor-ns-resize',
  s: 'bottom-0 left-2 right-2 h-1.5 cursor-ns-resize',
  e: 'right-0 top-2 bottom-2 w-1.5 cursor-ew-resize',
  w: 'left-0 top-2 bottom-2 w-1.5 cursor-ew-resize',
  ne: 'top-0 right-0 w-3 h-3 cursor-nesw-resize',
  sw: 'bottom-0 left-0 w-3 h-3 cursor-nesw-resize',
  nw: 'top-0 left-0 w-3 h-3 cursor-nwse-resize',
  se: 'bottom-0 right-0 w-3 h-3 cursor-nwse-resize',
}

// Rect actually rendered, after maximize / snap.
function displayRect(win, vw, vh) {
  const h = vh - TASKBAR_H
  if (win.maximized) return { x: 0, y: 0, w: vw, h }
  if (win.snap === 'left') return { x: 0, y: 0, w: Math.round(vw / 2), h }
  if (win.snap === 'right') return { x: Math.round(vw / 2), y: 0, w: vw - Math.round(vw / 2), h }
  return { x: win.x, y: win.y, w: win.w, h: win.h }
}

export default function Window({ win, vw, vh, isMobile }) {
  const { focus, update, minimize, toggleMaximize, close } = useOS.getState()
  const focused = useOS((s) => s.focusedId === win.id)
  const [snapPreview, setSnapPreview] = useState(null)
  const [live, setLive] = useState(false) // true while dragging/resizing: no easing then
  const drag = useRef(null)
  const App = appComponents[win.app]

  const rect = displayRect(win, vw, vh)
  const tiled = win.maximized || !!win.snap

  // ---- move ----
  const onTitleDown = (e) => {
    if (isMobile || e.button !== 0 || e.target.closest('button')) return
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { sx: e.clientX, sy: e.clientY, rect, moved: false }
    setLive(true)
  }

  const onTitleMove = (e) => {
    const d = drag.current
    if (!d) return
    const dx = e.clientX - d.sx
    const dy = e.clientY - d.sy
    if (!d.moved && Math.hypot(dx, dy) < 4) return
    if (!d.moved && tiled) {
      // Pull a maximized/snapped window off: restore its size under the cursor.
      const ratio = (d.sx - d.rect.x) / d.rect.w
      const nx = Math.round(e.clientX - win.w * ratio)
      d.rect = { x: nx, y: 0, w: win.w, h: win.h }
      d.sx = e.clientX
      d.sy = e.clientY
      update(win.id, { maximized: false, snap: null, x: nx, y: 0 })
      d.moved = true
      return
    }
    d.moved = true
    const x = d.rect.x + dx
    const y = Math.max(0, Math.min(vh - TASKBAR_H - 32, d.rect.y + dy))
    update(win.id, { x, y })
    let preview = null
    if (e.clientY <= 2) preview = 'max'
    else if (e.clientX <= 2) preview = 'left'
    else if (e.clientX >= vw - 3) preview = 'right'
    setSnapPreview(preview)
  }

  const onTitleUp = () => {
    const d = drag.current
    drag.current = null
    setLive(false)
    if (!d?.moved) return
    if (snapPreview === 'max') update(win.id, { maximized: true, snap: null })
    else if (snapPreview) update(win.id, { snap: snapPreview, maximized: false })
    setSnapPreview(null)
  }

  // ---- resize ----
  const onEdgeDown = (edge) => (e) => {
    if (e.button !== 0) return
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
    const start = { sx: e.clientX, sy: e.clientY, ...rect }
    setLive(true)
    if (tiled) update(win.id, { maximized: false, snap: null, ...rect })
    const move = (ev) => {
      const dx = ev.clientX - start.sx
      const dy = ev.clientY - start.sy
      let { x, y, w, h } = start
      if (edge.includes('e')) w = Math.max(MIN_W, start.w + dx)
      if (edge.includes('s')) h = Math.max(MIN_H, start.h + dy)
      if (edge.includes('w')) {
        w = Math.max(MIN_W, start.w - dx)
        x = start.x + start.w - w
      }
      if (edge.includes('n')) {
        h = Math.max(MIN_H, start.h - dy)
        y = Math.max(0, start.y + start.h - h)
      }
      update(win.id, { x, y, w, h })
    }
    const up = () => {
      setLive(false)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  const style = isMobile
    ? { left: 0, top: 0, width: vw, height: vh, zIndex: win.z + 100 }
    : { left: rect.x, top: rect.y, width: rect.w, height: rect.h, zIndex: win.z }

  const hidden = win.minimized
  const animClass = win.closing ? 'anim-close' : 'anim-open'

  // Minimize: shrink the window into its taskbar button (Windows-style "genie" fly-out).
  let minTransform = 'translateY(40%) scale(.6)'
  if (hidden && win.minTo && !isMobile) {
    const dx = win.minTo.x - (rect.x + rect.w / 2)
    const dy = win.minTo.y - (rect.y + rect.h / 2)
    minTransform = `translate(${dx}px, ${dy}px) scale(.08)`
  }
  const EASE = 'cubic-bezier(.2,.9,.25,1)'
  const transition = live || isMobile
    ? 'opacity .16s'
    : [
        `left .28s ${EASE}`, `top .28s ${EASE}`, `width .28s ${EASE}`, `height .28s ${EASE}`,
        `border-radius .28s ${EASE}`,
        hidden ? 'transform .3s cubic-bezier(.55,0,.75,.6)' : `transform .32s ${EASE}`,
        hidden ? 'opacity .26s ease-in .04s' : 'opacity .18s ease-out',
        `visibility 0s linear ${hidden ? '.3s' : '0s'}`,
      ].join(', ')

  return (
    <>
      {snapPreview && (
        <div className="fixed rounded-lg pointer-events-none anim-fade"
          style={{
            zIndex: win.z - 1,
            background: 'color-mix(in srgb, var(--accent) 18%, transparent)',
            border: '1px solid color-mix(in srgb, var(--accent) 50%, transparent)',
            backdropFilter: 'blur(8px)',
            ...(snapPreview === 'max' ? { inset: `8px 8px ${TASKBAR_H + 8}px 8px` }
              : snapPreview === 'left' ? { left: 8, top: 8, bottom: TASKBAR_H + 8, width: vw / 2 - 12 }
              : { right: 8, top: 8, bottom: TASKBAR_H + 8, width: vw / 2 - 12 }),
          }} />
      )}
      <section
        role="dialog"
        aria-label={win.title}
        onPointerDownCapture={() => !focused && focus(win.id)}
        className={`fixed flex flex-col mica overflow-hidden ${animClass}`}
        style={{
          ...style,
          borderRadius: isMobile || tiled ? 0 : 8,
          boxShadow: isMobile ? 'none' : focused ? 'var(--shadow-window)' : '0 0 0 1px var(--stroke), 0 4px 12px rgba(0,0,0,.12)',
          transition,
          opacity: hidden ? 0 : 1,
          transform: hidden ? minTransform : 'none',
          willChange: 'transform, opacity',
          pointerEvents: hidden ? 'none' : undefined,
          visibility: hidden ? 'hidden' : 'visible',
        }}
      >
        {/* Title bar */}
        <header
          className="flex items-center h-8 shrink-0 no-select"
          onPointerDown={onTitleDown}
          onPointerMove={onTitleMove}
          onPointerUp={onTitleUp}
          onDoubleClick={(e) => !isMobile && !e.target.closest('button') && toggleMaximize(win.id)}
          style={{ height: isMobile ? 44 : 32 }}
        >
          {isMobile && (
            <button className="btn-subtle h-full w-11 grid place-items-center" onClick={() => close(win.id)} aria-label="Back">
              <Glyph name="back" size={18} />
            </button>
          )}
          <span className={`flex items-center gap-2.5 min-w-0 flex-1 ${isMobile ? '' : 'pl-3'}`}
            style={{ color: focused ? 'var(--text)' : 'var(--text-3)' }}>
            <FileIcon name={win.icon} size={16} />
            <span className="truncate text-xs">{win.title}</span>
          </span>
          {!isMobile && (
            <div className="flex h-full">
              <CaptionButton label="Minimize" onClick={() => minimize(win.id)} glyph="minimize" />
              <CaptionButton label={tiled ? 'Restore' : 'Maximize'} onClick={() => toggleMaximize(win.id)} glyph={tiled ? 'restore' : 'maximize'} />
              <CaptionButton label="Close" onClick={() => close(win.id)} glyph="close" danger />
            </div>
          )}
        </header>

        {/* Content */}
        <div className="flex-1 min-h-0 relative">
          {App ? <App win={win} /> : <div className="p-6">Unknown app</div>}
        </div>

        {/* Resize handles */}
        {!isMobile && !win.maximized && EDGES.map((edge) => (
          <div key={edge} className={`absolute ${edgeStyle[edge]}`} onPointerDown={onEdgeDown(edge)} />
        ))}
      </section>
    </>
  )
}

function CaptionButton({ glyph, label, onClick, danger }) {
  return (
    <button
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`w-[46px] h-full grid place-items-center transition-colors ${danger ? 'hover:!bg-[var(--close-hover)] hover:text-white' : 'hover:bg-[var(--hover)]'}`}
    >
      <Glyph name={glyph} size={14} strokeWidth={1} />
    </button>
  )
}
