import { useLayoutEffect, useState } from 'react'
import { useOS } from '../../store/os'
import { useMusic } from '../../store/music'
import { getNode, pathTo } from '../../data/fs'
import { useClock } from '../../lib/useViewport'
import { FileIcon, Glyph } from '../icons/Icons'
import NodeIcon from './NodeIcon'

const DOCK = [
  { label: 'Files', icon: 'explorer', open: (os) => os.openApp({ app: 'explorer', key: 'explorer:desktop', title: 'Home', props: { path: pathTo('desktop') } }) },
  { label: 'Music', icon: 'player', open: (os) => os.openNode('player') },
  { label: 'Mail', icon: 'mail', open: (os) => os.openNode('contact') },
  { label: 'About', icon: 'notepad', open: (os) => os.openNode('about') },
]

// Phone layout: same file system and apps, laid out as a home screen. Apps open full screen.
export default function MobileHome() {
  const { openNode, widgetOpen, toggleWidget } = useOS()
  const playing = useMusic((s) => s.playing)
  const now = useClock(10_000)
  const [widgetH, setWidgetH] = useState(0)

  useLayoutEffect(() => {
    const el = document.querySelector('[aria-label="Music widget"]')
    if (!el) return
    const ro = new ResizeObserver(() => setWidgetH(el.offsetHeight))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const ids = getNode('desktop').children

  return (
    <div className="fixed inset-0 flex flex-col text-white no-select">
      <div className="h-10 shrink-0 flex items-center justify-between px-5 text-[13px] font-semibold" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <span>{now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>
        <span className="flex items-center gap-2">
          <button onClick={toggleWidget} aria-label={widgetOpen ? 'Hide music widget' : 'Show music widget'} className="p-1">
            <Glyph name="music" size={16} className={playing ? 'text-[#60cdff]' : ''} />
          </button>
          <Glyph name="wifi" size={16} />
          <Glyph name="battery" size={18} />
        </span>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-4" style={{ paddingTop: widgetOpen ? widgetH + 16 : 8, transition: 'padding .3s' }}>
        <div className="grid grid-cols-4 gap-y-5 gap-x-2">
          {ids.map((id) => {
            const n = getNode(id)
            return (
              <button key={id} onClick={() => openNode(id)} className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform">
                <span className="w-16 h-16 rounded-2xl grid place-items-center" style={{ background: 'rgba(255,255,255,.16)', backdropFilter: 'blur(20px)' }}>
                  <NodeIcon node={n} size={40} />
                </span>
                <span className="text-[11px] leading-tight text-center line-clamp-2 px-0.5" style={{ textShadow: '0 1px 3px rgba(0,0,0,.7)' }}>{n.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      <nav className="mx-3 mb-3 rounded-3xl flex justify-around py-2.5" style={{ background: 'rgba(255,255,255,.18)', backdropFilter: 'blur(30px)', marginBottom: 'calc(env(safe-area-inset-bottom) + 12px)' }}>
        {DOCK.map((d) => (
          <button key={d.label} onClick={() => d.open(useOS.getState())} aria-label={d.label} className="w-14 h-14 rounded-2xl grid place-items-center active:scale-95 transition-transform">
            <FileIcon name={d.icon} size={42} />
          </button>
        ))}
      </nav>
    </div>
  )
}
