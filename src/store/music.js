import { create } from 'zustand'
import { playlist } from '../data/playlist'

// One YouTube IFrame player for the whole site, controlled by the widget,
// the Media Player app and the Music folder.

let player = null
let mounting = false
let apiPromise = null
let ticker = null
let errorStreak = 0

function loadApi() {
  if (apiPromise) return apiPromise
  apiPromise = new Promise((resolve) => {
    if (window.YT && window.YT.Player) return resolve(window.YT)
    const prev = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      prev?.()
      resolve(window.YT)
    }
    const s = document.createElement('script')
    s.src = 'https://www.youtube.com/iframe_api'
    s.async = true
    document.head.appendChild(s)
  })
  return apiPromise
}

export const useMusic = create((set, get) => ({
  tracks: playlist,
  index: 0,
  ready: false,
  playing: false,
  buffering: false,
  current: 0,
  duration: 0,
  volume: 70,
  muted: false,
  error: null,

  // Called once by the widget with the element the iframe should live in.
  mount: async (el) => {
    if (player || mounting || !el) return
    mounting = true
    const YT = await loadApi()
    const host = document.createElement('div')
    el.appendChild(host)
    player = new YT.Player(host, {
      width: '100%',
      height: '100%',
      videoId: get().tracks[get().index]?.videoId,
      playerVars: { controls: 0, playsinline: 1, rel: 0, iv_load_policy: 3, disablekb: 1, fs: 0, origin: window.location.origin },
      events: {
        onReady: () => {
          player.setVolume(get().volume)
          set({ ready: true })
          if (get().pending) {
            set({ pending: false })
            player.playVideo()
          }
        },
        onStateChange: (e) => {
          const S = window.YT.PlayerState
          if (e.data === S.PLAYING) {
            errorStreak = 0
            set({ playing: true, buffering: false, error: null, duration: player.getDuration() || 0 })
            startTicker(set)
          } else if (e.data === S.PAUSED) {
            set({ playing: false, buffering: false })
            stopTicker()
          } else if (e.data === S.BUFFERING) {
            set({ buffering: true })
          } else if (e.data === S.ENDED) {
            stopTicker()
            get().next()
          }
        },
        onError: () => {
          // Usually "embedding disabled by owner" — skip to the next track.
          errorStreak += 1
          const t = get().tracks[get().index]
          set({ error: `Couldn't play "${t?.title}". Skipping…`, playing: false })
          if (errorStreak < get().tracks.length) setTimeout(() => get().next(), 900)
          else set({ error: 'None of the tracks could be played here.' })
        },
      },
    })
  },

  playIndex: (i) => {
    const { tracks } = get()
    const index = ((i % tracks.length) + tracks.length) % tracks.length
    set({ index, current: 0, duration: 0, error: null })
    if (player && get().ready) player.loadVideoById(tracks[index].videoId)
    else set({ pending: true })
  },

  toggle: () => {
    if (!player || !get().ready) return set({ pending: !get().pending })
    if (get().playing) player.pauseVideo()
    else player.playVideo()
  },

  next: () => get().playIndex(get().index + 1),

  prev: () => {
    if (player && get().current > 3) return get().seek(0)
    get().playIndex(get().index - 1)
  },

  seek: (sec) => {
    if (!player || !get().ready) return
    player.seekTo(sec, true)
    set({ current: sec })
  },

  setVolume: (v) => {
    set({ volume: v, muted: v === 0 })
    if (player && get().ready) {
      player.setVolume(v)
      if (v > 0) player.unMute()
    }
  },

  toggleMute: () => {
    if (!player || !get().ready) return
    const muted = !get().muted
    if (muted) player.mute()
    else player.unMute()
    set({ muted })
  },
}))

function startTicker(set) {
  stopTicker()
  ticker = setInterval(() => {
    if (!player?.getCurrentTime) return
    set({ current: player.getCurrentTime() || 0, duration: player.getDuration() || 0 })
  }, 500)
}

function stopTicker() {
  if (ticker) clearInterval(ticker)
  ticker = null
}

export function formatTime(s) {
  if (!Number.isFinite(s) || s < 0) s = 0
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}
