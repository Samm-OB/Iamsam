import { useEffect, useState } from 'react'
import { useOS } from '../../store/os'
import { useClock } from '../../lib/useViewport'
import { profile } from '../../data/profile'
import { FileIcon } from '../icons/Icons'

export default function LockScreen() {
  const unlock = useOS((s) => s.unlock)
  const now = useClock(1000)
  const [leaving, setLeaving] = useState(false)

  const go = () => {
    if (leaving) return
    setLeaving(true)
    setTimeout(unlock, 380)
  }

  useEffect(() => {
    const onKey = () => go()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <div role="button" tabIndex={0} aria-label="Unlock" onClick={go}
      className="fixed inset-0 z-[20000] flex flex-col items-center text-white no-select"
      style={{
        background: 'rgba(0,0,0,.18)',
        backdropFilter: 'blur(2px)',
        transition: 'transform .38s cubic-bezier(.6,0,.4,1), opacity .38s',
        transform: leaving ? 'translateY(-100%)' : 'none',
        opacity: leaving ? 0.6 : 1,
      }}>
      <div className="mt-[12vh] text-center" style={{ textShadow: '0 2px 12px rgba(0,0,0,.35)' }}>
        <div className="text-[18px] font-semibold">{now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</div>
        <div className="text-[96px] sm:text-[120px] font-semibold leading-none mt-1 tabular-nums">
          {now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).replace(/\s?[AP]M$/i, '')}
        </div>
      </div>
      <div className="flex-1" />
      <div className="flex flex-col items-center gap-3 mb-[10vh]">
        <FileIcon name="user" size={88} />
        <div className="text-2xl font-semibold" style={{ textShadow: '0 1px 8px rgba(0,0,0,.4)' }}>{profile.name}</div>
        <div className="text-sm opacity-90">{profile.title}</div>
        <button className="mt-3 h-9 px-6 rounded-md text-sm"
          style={{ background: 'rgba(255,255,255,.18)', border: '1px solid rgba(255,255,255,.3)', backdropFilter: 'blur(20px)' }}>
          Sign in
        </button>
        <div className="text-xs opacity-75 mt-2">Click anywhere or press any key</div>
      </div>
    </div>
  )
}
