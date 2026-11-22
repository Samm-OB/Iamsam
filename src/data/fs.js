// The virtual file system. Every desktop icon, folder and file comes from here.
//
// Node shape:
//   { id, name, kind: 'folder' | 'file' | 'shortcut', icon, type, detail,
//     children?: string[], open?: { app, props } }
// Folders open in File Explorer automatically; files/shortcuts use `open`.

import { profile } from './profile'
import { projects } from './projects'
import { education, experience } from './career'
import { movies, shows, anime } from './media'
import { playlist } from './playlist'

const nodes = {}
const parents = {}

function add(node, parentId) {
  nodes[node.id] = node
  if (parentId) {
    parents[node.id] = parentId
    nodes[parentId].children.push(node.id)
  }
  return node
}

const folder = (id, name, parentId, extra = {}) =>
  add({ id, name, kind: 'folder', icon: 'folder', type: 'File folder', children: [], ...extra }, parentId)

const file = (id, name, parentId, extra) => add({ id, name, kind: 'file', ...extra }, parentId)

// ---- Root -------------------------------------------------------------
add({ id: 'desktop', name: 'Desktop', kind: 'folder', icon: 'desktop', type: 'System folder', children: [] })

// ---- School -----------------------------------------------------------
folder('school', 'School', 'desktop', { icon: 'folder-school' })
education.forEach((e) =>
  file(`edu-${e.id}`, `${e.file}.docx`, 'school', {
    icon: 'doc', type: 'Word Document', detail: e.period,
    open: { app: 'document', props: { entry: e } },
  }),
)

// ---- Projects ---------------------------------------------------------
folder('projects', 'Projects', 'desktop', { icon: 'folder-code' })
const projectFolders = {}
projects.forEach((p) => {
  if (!projectFolders[p.folder]) {
    projectFolders[p.folder] = folder(`projects-${p.folder.toLowerCase().replace(/\s+/g, '-')}`, p.folder, 'projects')
  }
  const detail = p.tech.slice(0, 3).join(', ')
  if (p.images.length) {
    file(`project-${p.id}`, `${p.name}.png`, projectFolders[p.folder].id, {
      icon: 'image', thumb: p.images[0], type: 'PNG File', detail,
      open: { app: 'project', props: { projectId: p.id } },
    })
  } else {
    file(`project-${p.id}`, `${p.name}.docx`, projectFolders[p.folder].id, {
      icon: 'doc', type: 'Word Document', detail,
      open: {
        app: 'document',
        props: { entry: { heading: p.name, org: p.tech.join(' · '), period: p.folder, body: p.description.split('\n\n'), bullets: p.features, link: p.link } },
      },
    })
  }
})

// ---- Entertainment ----------------------------------------------------
folder('entertainment', 'Entertainment', 'desktop', { icon: 'folder-video' })
const mediaGroups = [
  ['movies', 'Movies', movies, 'Movie'],
  ['tv', 'TV Shows', shows, 'TV Show'],
  ['anime', 'Anime', anime, 'Anime'],
]
mediaGroups.forEach(([id, name, list, label]) => {
  folder(id, name, 'entertainment', { icon: 'folder-video' })
  list.forEach((m) =>
    file(`media-${m.id}`, `${m.title.replace(/:/g, ' -')}${m.year ? ` (${m.year})` : ''}.mp4`, id, {
      icon: 'video', poster: m.poster, posterSeed: m.title,
      type: m.rating ? `${label} · ${'★'.repeat(m.rating)}` : label, detail: m.year ? String(m.year) : label,
      open: { app: 'media', props: { item: m, label } },
    }),
  )
})

// ---- Music ------------------------------------------------------------
folder('music', 'Music', 'desktop', { icon: 'folder-music' })
playlist.forEach((s, i) =>
  file(`song-${i}`, `${s.artist} - ${s.title}.mp3`, 'music', {
    icon: 'audio', type: 'MP3 Audio', detail: s.artist,
    open: { app: 'play-song', props: { index: i } },
  }),
)

// ---- Experience -------------------------------------------------------
folder('experience', 'Experience', 'desktop', { icon: 'folder-work' })
experience.forEach((e) =>
  file(`exp-${e.id}`, `${e.file}.docx`, 'experience', {
    icon: 'doc', type: 'Word Document', detail: e.period,
    open: { app: 'document', props: { entry: e } },
  }),
)

// ---- Loose desktop files & shortcuts ----------------------------------
file('resume', 'Resume.pdf', 'desktop', {
  icon: 'pdf', type: 'PDF Document', detail: 'Curriculum vitae',
  open: { app: 'pdf', props: { src: profile.resume, name: 'Resume.pdf' } },
})
file('about', 'About_Me.txt', 'desktop', {
  icon: 'txt', type: 'Text Document', detail: 'Start here',
  open: { app: 'notepad', props: { name: 'About_Me.txt' } },
})
add({ id: 'stack', name: 'Tech Stack', kind: 'shortcut', icon: 'taskmgr', type: 'Shortcut', open: { app: 'taskmgr' } }, 'desktop')
add({ id: 'contact', name: 'Contact Me', kind: 'shortcut', icon: 'mail', type: 'Shortcut', open: { app: 'mail' } }, 'desktop')
add({ id: 'player', name: 'Media Player', kind: 'shortcut', icon: 'player', type: 'Shortcut', open: { app: 'player' } }, 'desktop')

// ---- Recycle Bin ------------------------------------------------------
folder('recycle', 'Recycle Bin', 'desktop', { icon: 'recycle', type: 'System folder' })
file('bin-1', 'portfolio_v1_FINAL_final2.zip', 'recycle', {
  icon: 'zip', type: 'Compressed Folder', detail: 'Never again',
  open: { app: 'notepad', props: { name: 'portfolio_v1_FINAL_final2.zip', text: 'This file was deleted for a reason.\n\n(Every developer has one of these.)' } },
})

// ---- Helpers ----------------------------------------------------------
export const fs = nodes
export const getNode = (id) => nodes[id]
export const getParent = (id) => parents[id]

export function pathTo(id) {
  const path = []
  let cur = id
  while (cur) {
    path.unshift(cur)
    cur = parents[cur]
  }
  return path
}

export function searchNodes(query) {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return Object.values(nodes).filter((n) => n.id !== 'desktop' && n.name.toLowerCase().includes(q))
}

export const quickAccess = ['desktop', 'school', 'projects', 'entertainment', 'music', 'experience']
