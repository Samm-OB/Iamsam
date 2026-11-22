import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useOS } from '../../store/os'
import { getNode } from '../../data/fs'
import { TASKBAR_H } from '../../lib/appMeta'
import { load, save } from '../../lib/storage'
import NodeIcon from './NodeIcon'
import ContextMenu from './ContextMenu'
import { WALLPAPER_COUNT } from './Wallpaper'

const CELL_W = 92
const CELL_H = 96
const PAD = 6

const displayName = (n) => n.name

// Place every icon in a free cell: saved spot if valid, else next free cell (column-major like Windows).
function layout(ids, saved, rows, cols) {
  const taken = new Set()
  const pos = {}
  const key = (c, r) => `${c}:${r}`
  ids.forEach((id) => {
    const p = saved[id]
    if (p && p.c < cols && p.r < rows && !taken.has(key(p.c, p.r))) {
      pos[id] = p
      taken.add(key(p.c, p.r))
    }
  })
  let c = 0
  let r = 0
  ids.forEach((id) => {
    if (pos[id]) return
    while (taken.has(key(c, r))) {
      r++
      if (r >= rows) { r = 0; c++ }
    }
    pos[id] = { c, r }
    taken.add(key(c, r))
  })
  return pos
}

export default function Desktop({ vw, vh }) {
  const ids = getNode('desktop').children
  const openNode = useOS((s) => s.openNode)
  const rows = Math.max(1, Math.floor((vh - TASKBAR_H - PAD * 2) / CELL_H))
  const cols = Math.max(1, Math.floor((vw - PAD * 2) / CELL_W))

  const [saved, setSaved] = useState(() => load('icons', {}))
  const positions = useMemo(() => layout(ids, saved, rows, cols), [ids, saved, rows, cols])
  const [selected, setSelected] = useState(() => new Set())
  const [marquee, setMarquee] = useState(null)
  const [dragOffset, setDragOffset] = useState(null)
  const [menu, setMenu] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const gesture = useRef(null)

  const cellRect = (p) => ({ x: PAD + p.c * CELL_W, y: PAD + p.r * CELL_H, w: CELL_W - 4, h: CELL_H - 4 })

  const persist = (next) => {
    setSaved(next)
    save('icons', next)
  }

  // ---- background: marquee selection ----
  const onBgDown = (e) => {
    if (e.button !== 0 || e.target !== e.currentTarget) return
    e.currentTarget.setPointerCapture(e.pointerId)
    gesture.current = { type: 'marquee', sx: e.clientX, sy: e.clientY, additive: e.ctrlKey ? new Set(selected) : new Set() }
    setSelected(new Set())
  }

  // ---- icon: select / drag ----
  const onIconDown = (e, id) => {
    if (e.button !== 0) return
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
    let sel = selected
    if (e.ctrlKey) {
      sel = new Set(selected)
      sel.has(id) ? sel.delete(id) : sel.add(id)
    } else if (!selected.has(id)) {
      sel = new Set([id])
    }
    setSelected(sel)
    gesture.current = { type: 'icon', id, sx: e.clientX, sy: e.clientY, moved: false, sel }
  }

  const onMove = (e) => {
    const g = gesture.current
    if (!g) return
    const dx = e.clientX - g.sx
    const dy = e.clientY - g.sy
    if (g.type === 'marquee') {
      const box = { x: Math.min(g.sx, e.clientX), y: Math.min(g.sy, e.clientY), w: Math.abs(dx), h: Math.abs(dy) }
      setMarquee(box)
      const hit = new Set(g.additive)
      ids.forEach((id) => {
        const r = cellRect(positions[id])
        if (r.x < box.x + box.w && r.x + r.w > box.x && r.y < box.y + box.h && r.y + r.h > box.y) hit.add(id)
      })
      setSelected(hit)
    } else if (g.type === 'icon') {
      if (!g.moved && Math.hypot(dx, dy) < 5) return
      g.moved = true
      setDragOffset({ dx, dy })
    }
  }

  const onUp = () => {
    const g = gesture.current
    gesture.current = null
    setMarquee(null)
    if (g?.type === 'icon' && g.moved && dragOffset) {
      const dc = Math.round(dragOffset.dx / CELL_W)
      const dr = Math.round(dragOffset.dy / CELL_H)
      if (dc || dr) {
        const next = {}
        ids.forEach((id) => (next[id] = positions[id]))
        const occupied = new Set(ids.filter((id) => !g.sel.has(id)).map((id) => `${positions[id].c}:${positions[id].r}`))
        g.sel.forEach((id) => {
          const p = positions[id]
          const c = Math.min(cols - 1, Math.max(0, p.c + dc))
          const r = Math.min(rows - 1, Math.max(0, p.r + dr))
          if (!occupied.has(`${c}:${r}`)) {
            next[id] = { c, r }
            occupied.add(`${c}:${r}`)
          } else occupied.add(`${p.c}:${p.r}`)
        })
        persist(next)
      }
    }
    setDragOffset(null)
  }

  // ---- keyboard ----
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest?.('input, textarea, [role=dialog]')) return
      if (e.key === 'Enter' && selected.size) selected.forEach((id) => openNode(id))
      if (e.key === 'Escape') setSelected(new Set())
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected, openNode])

  const closeMenu = useCallback(() => setMenu(null), [])

  const onBgContext = (e) => {
    e.preventDefault()
    const os = useOS.getState()
    setSelected(new Set())
    setMenu({
      x: e.clientX, y: e.clientY,
      items: [
        { label: 'Sort by name', icon: 'sort', onClick: () => persist({}) },
        { label: 'Refresh', icon: 'refresh', onClick: () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 120) } },
        'sep',
        { label: 'Next desktop background', icon: 'image', onClick: () => os.nextWallpaper(WALLPAPER_COUNT) },
        { label: os.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode', icon: os.theme === 'dark' ? 'sun' : 'moon', onClick: os.toggleTheme },
        { label: os.widgetOpen ? 'Hide music widget' : 'Show music widget', icon: 'music', onClick: os.toggleWidget },
        'sep',
        { label: 'Open About_Me.txt', icon: 'external', onClick: () => openNode('about') },
      ],
    })
  }

  const onIconContext = (e, id) => {
    e.preventDefault()
    e.stopPropagation()
    if (!selected.has(id)) setSelected(new Set([id]))
    setMenu({ x: e.clientX, y: e.clientY, items: [{ label: 'Open', icon: 'external', onClick: () => openNode(id) }] })
  }

  return (
    <div className="absolute inset-0 no-select" style={{ bottom: TASKBAR_H }}
      onPointerDown={onBgDown} onPointerMove={onMove} onPointerUp={onUp} onContextMenu={onBgContext}>
      {!refreshing && ids.map((id) => {
        const node = getNode(id)
        const r = cellRect(positions[id])
        const isSel = selected.has(id)
        const dragging = dragOffset && isSel
        return (
          <button key={id}
            className="absolute flex flex-col items-center gap-1 pt-1.5 px-1 rounded-[3px] outline-none"
            style={{
              left: r.x, top: r.y, width: r.w, height: r.h,
              transform: dragging ? `translate(${dragOffset.dx}px, ${dragOffset.dy}px)` : undefined,
              opacity: dragging ? 0.75 : 1,
              zIndex: dragging ? 5 : 1,
              background: isSel ? 'rgba(255,255,255,.22)' : undefined,
              boxShadow: isSel ? 'inset 0 0 0 1px rgba(255,255,255,.35)' : undefined,
            }}
            onPointerDown={(e) => onIconDown(e, id)}
            onDoubleClick={() => openNode(id)}
            onContextMenu={(e) => onIconContext(e, id)}
            onMouseEnter={(e) => !isSel && (e.currentTarget.style.background = 'rgba(255,255,255,.1)')}
            onMouseLeave={(e) => !isSel && (e.currentTarget.style.background = '')}
          >
            <NodeIcon node={node} size={44} />
            <span className={`text-white text-xs leading-[1.25] text-center break-words w-full ${isSel ? '' : 'line-clamp-2'}`}
              style={{ textShadow: '0 1px 2px rgba(0,0,0,.85), 0 0 1px rgba(0,0,0,.6)' }}>
              {displayName(node)}
            </span>
          </button>
        )
      })}

      {marquee && (
        <div className="fixed pointer-events-none"
          style={{ left: marquee.x, top: marquee.y, width: marquee.w, height: marquee.h, background: 'rgba(0,120,215,.25)', border: '1px solid rgba(0,120,215,.9)' }} />
      )}

      {menu && <ContextMenu {...menu} onClose={closeMenu} />}
    </div>
  )
}
