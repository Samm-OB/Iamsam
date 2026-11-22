import { useEffect, useRef } from 'react'
import { useMusic, formatTime } from '../../store/music'
import { useOS } from '../../store/os'
import { Glyph } from '../icons/Icons'

// Always mounted (hidden with CSS when closed) so the YouTube iframe — and the music — never restarts.
export default function MusicWidget({ isMobile }) {
  const slot = useRef(null)
  const { mount, tracks, index, playing, buffering, current, duration, error, toggle, next, prev, seek, ready } = useMusic()
  const { widgetOpen, toggleWidget, openNode, locked } = useOS()
  const track = tracks[index]

  useEffect(() => {
    mount(slot.current)
  }, [mount])

  const visible = widgetOpen && !locked

  return (
    <aside aria-label="Music widget" aria-hidden={!visible}
      className="fixed acrylic rounded-xl overflow-hidden no-select"
      style={{
        zIndex: isMobile ? 40 : 6,
        top: isMobile ? 'calc(env(safe-area-inset-top) + 40px)' : 12,
        right: 12,
        left: isMobile ? 12 : 'auto',
        width: isMobile ? 'auto' : 340,
        boxShadow: 'var(--shadow-flyout)',
        color: 'var(--text)',
        transition: 'transform .3s cubic-bezier(.1,.9,.2,1), opacity .2s',
        transform: visible ? 'none' : isMobile ? 'translateY(-130%)' : 'translateX(calc(100% + 24px))',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
      }}>
      <div className="flex items-center justify-between px-3 h-9">
        <span className="flex items-center gap-2 text-xs font-semibold">
          <Glyph name="music" size={14} /> Sam&apos;s Playlist
        </span>
        <span className="flex">
          <button className="btn-subtle w-7 h-7 grid place-items-center" title="Open Media Player" aria-label="Open Media Player" onClick={() => openNode('player')}>
            <Glyph name="external" size={14} />
          </button>
          {!isMobile && (
            <button className="btn-subtle w-7 h-7 grid place-items-center" title="Hide widget" aria-label="Hide widget" onClick={toggleWidget}>
              <Glyph name="close" size={12} />
            </button>
          )}
        </span>
      </div>

      {/* The YouTube player lives here (16:9). */}
      <div className="relative mx-3 rounded-md overflow-hidden bg-black aspect-video">
        <div ref={slot} className="absolute inset-0 [&>iframe]:w-full [&>iframe]:h-full" />
        {!ready && <div className="absolute inset-0 grid place-items-center text-xs text-white/70">Loading player…</div>}
      </div>

      <div className="px-4 pt-3 pb-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold truncate">{track?.title}</div>
          <div className="text-xs truncate" style={{ color: 'var(--text-2)' }}>
            {error ? <span style={{ color: '#e8705f' }}>{error}</span> : track?.artist}
          </div>
        </div>

        <input type="range" min="0" max={duration || 0} step="1" value={Math.min(current, duration || 0)}
          onChange={(e) => seek(Number(e.target.value))} aria-label="Seek"
          className="w-full mt-3 h-1 accent-[var(--accent)]" disabled={!duration} />
        <div className="flex justify-between text-[11px] -mt-0.5" style={{ color: 'var(--text-3)' }}>
          <span>{formatTime(current)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        <div className="flex items-center justify-center gap-3 mt-1">
          <button className="btn-subtle w-9 h-9 grid place-items-center" onClick={prev} aria-label="Previous"><Glyph name="prev" size={16} /></button>
          <button className="btn-accent w-11 h-11 grid place-items-center !rounded-full" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>
            {buffering ? <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" /> : <Glyph name={playing ? 'pause' : 'play'} size={18} />}
          </button>
          <button className="btn-subtle w-9 h-9 grid place-items-center" onClick={next} aria-label="Next"><Glyph name="next" size={16} /></button>
        </div>
      </div>
    </aside>
  )
}
