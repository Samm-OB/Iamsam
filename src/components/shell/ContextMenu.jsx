import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Glyph } from '../icons/Icons'

// items: [{ label, icon?, onClick, hint? } | 'sep']
export default function ContextMenu({ x, y, items, onClose }) {
  const ref = useRef(null)
  const [pos, setPos] = useState({ left: x, top: y })

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setPos({
      left: Math.min(x, window.innerWidth - r.width - 4),
      top: y + r.height > window.innerHeight - 52 ? Math.max(4, y - r.height) : y,
    })
  }, [x, y])

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    const esc = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('pointerdown', close, true)
    window.addEventListener('keydown', esc)
    window.addEventListener('blur', onClose)
    return () => {
      window.removeEventListener('pointerdown', close, true)
      window.removeEventListener('keydown', esc)
      window.removeEventListener('blur', onClose)
    }
  }, [onClose])

  return (
    <div ref={ref} role="menu" className="fixed z-[10000] acrylic rounded-lg p-1 min-w-[220px] anim-pop no-select"
      style={{ ...pos, boxShadow: 'var(--shadow-flyout)', color: 'var(--text)' }}
      onContextMenu={(e) => e.preventDefault()}>
      {items.map((it, i) =>
        it === 'sep' ? (
          <div key={i} className="my-1 h-px" style={{ background: 'var(--stroke)' }} />
        ) : (
          <button key={i} role="menuitem"
            className="btn-subtle w-full flex items-center gap-3 h-8 px-3 text-left text-[13px]"
            onClick={() => { onClose(); it.onClick?.() }}>
            <span className="w-4 grid place-items-center">{it.icon && <Glyph name={it.icon} size={16} />}</span>
            <span className="flex-1">{it.label}</span>
            {it.hint && <span className="text-xs" style={{ color: 'var(--text-3)' }}>{it.hint}</span>}
          </button>
        ),
      )}
    </div>
  )
}
