import { useEffect } from 'react'
import { useOS } from './store/os'
import { useViewport } from './lib/useViewport'
import Wallpaper from './components/shell/Wallpaper'
import Desktop from './components/shell/Desktop'
import Taskbar from './components/shell/Taskbar'
import StartMenu from './components/shell/StartMenu'
import Window from './components/shell/Window'
import LockScreen from './components/shell/LockScreen'
import MobileHome from './components/shell/MobileHome'
import MusicWidget from './components/music/MusicWidget'

export default function App() {
  const { vw, vh, isMobile } = useViewport()
  const { theme, wallpaper, locked, startOpen, windows } = useOS()

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  return (
    <div className="fixed inset-0 overflow-hidden" onContextMenu={(e) => e.preventDefault()}>
      <Wallpaper index={wallpaper} dark={theme === 'dark'} />

      {!locked && (isMobile ? <MobileHome /> : <Desktop vw={vw} vh={vh} />)}

      {/* Always mounted so music keeps playing across layouts and window changes. */}
      <MusicWidget isMobile={isMobile} />

      {!locked && windows.map((w) => <Window key={w.id} win={w} vw={vw} vh={vh} isMobile={isMobile} />)}

      {!locked && !isMobile && <Taskbar />}
      {!locked && !isMobile && startOpen && <StartMenu />}

      {locked && <LockScreen />}
    </div>
  )
}
