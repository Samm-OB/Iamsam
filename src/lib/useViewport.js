import { useEffect, useState } from 'react'

export const MOBILE_BREAKPOINT = 768

function read() {
  return { vw: window.innerWidth, vh: window.innerHeight, isMobile: window.innerWidth < MOBILE_BREAKPOINT }
}

export function useViewport() {
  const [vp, setVp] = useState(read)
  useEffect(() => {
    const onResize = () => setVp(read())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return vp
}

export function useClock(intervalMs = 1000) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), intervalMs)
    return () => clearInterval(t)
  }, [intervalMs])
  return now
}
