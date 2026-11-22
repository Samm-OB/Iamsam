import { create } from 'zustand'
import { appMeta, TASKBAR_H } from '../lib/appMeta'
import { load, save } from '../lib/storage'
import { pathTo, getNode } from '../data/fs'
import { useMusic } from './music'

let nextId = 1

// Centre of a window's taskbar button, so minimize can fly the window into it.
function taskbarTarget(id) {
  try {
    const el = document.querySelector(`[data-taskbar-win="${id}"]`)
    if (el) {
      const r = el.getBoundingClientRect()
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
    }
  } catch {
    /* no DOM */
  }
  return { x: window.innerWidth / 2, y: window.innerHeight }
}

const prefersDark = () => {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  } catch {
    return false
  }
}

export const useOS = create((set, get) => ({
  // ---- shell state ----
  locked: true,
  theme: load('theme', prefersDark() ? 'dark' : 'light'),
  wallpaper: load('wallpaper', 0),
  startOpen: false,
  startQuery: '',
  widgetOpen: true,

  unlock: () => set({ locked: false }),
  lock: () => set({ locked: true, startOpen: false }),
  toggleTheme: () => {
    const theme = get().theme === 'dark' ? 'light' : 'dark'
    save('theme', theme)
    set({ theme })
  },
  nextWallpaper: (count) => {
    const wallpaper = (get().wallpaper + 1) % count
    save('wallpaper', wallpaper)
    set({ wallpaper })
  },
  setStart: (open, query = '') => set({ startOpen: open, startQuery: query }),
  toggleWidget: () => set((s) => ({ widgetOpen: !s.widgetOpen })),

  // ---- window manager ----
  windows: [],
  zTop: 10,
  focusedId: null,

  openApp: ({ app, props = {}, title, icon, key }) => {
    const { windows, zTop } = get()
    const wkey = key ?? app
    const existing = windows.find((w) => w.key === wkey && !w.closing)
    if (existing) {
      get().focus(existing.id)
      return existing.id
    }
    const meta = appMeta[app]
    const vw = window.innerWidth
    const vh = window.innerHeight - TASKBAR_H
    const w = Math.min(meta.w, vw - 40)
    const h = Math.min(meta.h, vh - 40)
    const offset = (windows.filter((x) => !x.closing).length % 6) * 28
    const id = nextId++
    const win = {
      id,
      key: wkey,
      app,
      props,
      title: title ?? meta.title,
      icon: icon ?? meta.icon,
      x: Math.max(8, Math.round((vw - w) / 2) - 70 + offset),
      y: Math.max(8, Math.round((vh - h) / 2) - 50 + offset),
      w,
      h,
      z: zTop + 1,
      minimized: false,
      maximized: false,
      snap: null,
      closing: false,
    }
    set({ windows: [...windows, win], zTop: zTop + 1, focusedId: id, startOpen: false })
    return id
  },

  // Open whatever a file-system node points to.
  openNode: (id) => {
    const node = getNode(id)
    if (!node) return
    if (node.kind === 'folder') {
      get().openApp({ app: 'explorer', key: `explorer:${id}`, title: node.name, icon: node.icon === 'folder' ? 'explorer' : node.icon, props: { path: pathTo(id) } })
      return
    }
    const { app, props = {} } = node.open
    if (app === 'play-song') {
      useMusic.getState().playIndex(props.index)
      set({ widgetOpen: true, startOpen: false })
      return
    }
    const meta = appMeta[app]
    get().openApp({ app, props, key: `${app}:${id}`, title: meta.title === node.name ? meta.title : `${node.name} - ${meta.title}`, icon: meta.icon })
  },

  update: (id, patch) => set((s) => ({ windows: s.windows.map((w) => (w.id === id ? { ...w, ...patch } : w)) })),

  focus: (id) =>
    set((s) => ({
      zTop: s.zTop + 1,
      focusedId: id,
      startOpen: false,
      windows: s.windows.map((w) => (w.id === id ? { ...w, z: s.zTop + 1, minimized: false } : w)),
    })),

  minimize: (id) =>
    set((s) => {
      const rest = s.windows.filter((w) => w.id !== id && !w.minimized && !w.closing)
      const top = rest.sort((a, b) => b.z - a.z)[0]
      return {
        focusedId: top ? top.id : null,
        windows: s.windows.map((w) => (w.id === id ? { ...w, minimized: true, minTo: taskbarTarget(id) } : w)),
      }
    }),

  toggleMaximize: (id) =>
    set((s) => ({ windows: s.windows.map((w) => (w.id === id ? { ...w, maximized: !w.maximized && !w.snap, snap: null } : w)) })),

  close: (id) => {
    set((s) => ({ windows: s.windows.map((w) => (w.id === id ? { ...w, closing: true } : w)) }))
    setTimeout(() => {
      set((s) => {
        const windows = s.windows.filter((w) => w.id !== id)
        const top = [...windows].filter((w) => !w.minimized).sort((a, b) => b.z - a.z)[0]
        return { windows, focusedId: s.focusedId === id ? (top ? top.id : null) : s.focusedId }
      })
    }, 140)
  },

  // Taskbar click behaviour, same as Windows.
  taskbarClick: (id) => {
    const { windows, focusedId } = get()
    const w = windows.find((x) => x.id === id)
    if (!w) return
    if (w.minimized) get().focus(id)
    else if (focusedId === id) get().minimize(id)
    else get().focus(id)
  },

  showDesktop: () => set((s) => ({ focusedId: null, windows: s.windows.map((w) => ({ ...w, minimized: true, minTo: taskbarTarget(w.id) })) })),
}))
