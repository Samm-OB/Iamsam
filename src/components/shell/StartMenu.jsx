import { useEffect, useRef, useState } from 'react'
import { useOS } from '../../store/os'
import { getNode, searchNodes, pathTo } from '../../data/fs'
import { profile } from '../../data/profile'
import { FileIcon, Glyph } from '../icons/Icons'
import NodeIcon from './NodeIcon'
import { TASKBAR_H } from '../../lib/appMeta'

const PINNED = ['explorer', 'about', 'resume', 'projects', 'school', 'experience', 'entertainment', 'music', 'player', 'stack', 'contact', 'recycle']
const RECOMMENDED = ['exp-sankore', 'project-phishscope', 'project-segmentation', 'project-forecast', 'edu-wqu', 'project-naijalist']

export default function StartMenu() {
  const { startQuery, setStart, openNode, openApp, lock } = useOS()
  const [query, setQuery] = useState(startQuery)
  const ref = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
    const onDown = (e) => {
      if (ref.current?.contains(e.target) || e.target.closest?.('[data-start-button]')) return
      setStart(false)
    }
    const onKey = (e) => e.key === 'Escape' && setStart(false)
    window.addEventListener('pointerdown', onDown, true)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('pointerdown', onDown, true)
      window.removeEventListener('keydown', onKey)
    }
  }, [setStart])

  const open = (id) => {
    setStart(false)
    if (id === 'explorer') openApp({ app: 'explorer', key: 'explorer:desktop', title: 'Home', props: { path: pathTo('desktop') } })
    else openNode(id)
  }

  const results = searchNodes(query)
  const label = (id) => (id === 'explorer' ? 'File Explorer' : getNode(id).name)

  return (
    <div ref={ref} className="fixed z-[9000] acrylic rounded-lg overflow-hidden flex flex-col anim-flyout"
      style={{
        bottom: TASKBAR_H + 12, left: '50%', marginLeft: -320, width: 640, maxWidth: 'calc(100vw - 16px)',
        height: Math.min(700, window.innerHeight - TASKBAR_H - 24), boxShadow: 'var(--shadow-flyout)', color: 'var(--text)',
      }}>
      <div className="px-8 pt-8 pb-4">
        <label className="field flex items-center gap-2 h-9 px-3 rounded-full" style={{ borderRadius: 999 }}>
          <Glyph name="search" size={16} className="opacity-70" />
          <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && results[0] && open(results[0].id)}
            placeholder="Search for files, projects and folders" className="flex-1 bg-transparent outline-none text-[13px]" />
        </label>
      </div>

      <div className="flex-1 min-h-0 scroll px-8">
        {query.trim() ? (
          <section>
            <h2 className="text-sm font-semibold mb-2">Best matches</h2>
            {results.length === 0 && <p className="text-[13px] py-6" style={{ color: 'var(--text-2)' }}>No results for “{query}”.</p>}
            {results.map((n) => (
              <button key={n.id} onClick={() => open(n.id)} className="btn-subtle w-full flex items-center gap-3 p-2 text-left">
                <NodeIcon node={n} size={32} />
                <span className="min-w-0">
                  <span className="block text-[13px] truncate">{n.name}</span>
                  <span className="block text-xs truncate" style={{ color: 'var(--text-2)' }}>{n.type} · {pathTo(n.id).slice(0, -1).map((p) => getNode(p).name).join(' › ')}</span>
                </span>
              </button>
            ))}
          </section>
        ) : (
          <>
            <section>
              <div className="flex items-center justify-between mb-2 px-2">
                <h2 className="text-sm font-semibold">Pinned</h2>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-1">
                {PINNED.map((id) => (
                  <button key={id} onClick={() => open(id)} className="btn-subtle flex flex-col items-center gap-1.5 py-3 px-1 rounded">
                    {id === 'explorer' ? <FileIcon name="explorer" size={32} /> : <NodeIcon node={getNode(id)} size={32} />}
                    <span className="text-xs text-center leading-tight line-clamp-2">{label(id)}</span>
                  </button>
                ))}
              </div>
            </section>
            <section className="mt-6 pb-4">
              <h2 className="text-sm font-semibold mb-2 px-2">Recommended</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {RECOMMENDED.map((id) => {
                  const n = getNode(id)
                  if (!n) return null
                  return (
                    <button key={id} onClick={() => open(id)} className="btn-subtle flex items-center gap-3 p-2.5 text-left">
                      <NodeIcon node={n} size={32} />
                      <span className="min-w-0">
                        <span className="block text-[13px] truncate">{n.name}</span>
                        <span className="block text-xs truncate" style={{ color: 'var(--text-2)' }}>{n.detail}</span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </section>
          </>
        )}
      </div>

      <footer className="h-16 shrink-0 flex items-center justify-between px-12" style={{ background: 'var(--hover)', borderTop: '1px solid var(--stroke)' }}>
        <button className="btn-subtle flex items-center gap-3 px-3 py-1.5" onClick={() => open('about')}>
          <FileIcon name="user" size={32} />
          <span className="text-left">
            <span className="block text-[13px]">{profile.name}</span>
            <span className="block text-[11px]" style={{ color: 'var(--text-2)' }}>{profile.title}</span>
          </span>
        </button>
        <div className="flex gap-1">
          {profile.links.map((l) => (
            <a key={l.label} href={l.url} target="_blank" rel="noreferrer" className="btn-subtle w-10 h-10 grid place-items-center" title={l.label} aria-label={l.label}>
              <Glyph name={l.icon} size={18} />
            </a>
          ))}
          <button className="btn-subtle w-10 h-10 grid place-items-center" title="Lock" aria-label="Lock" onClick={lock}>
            <Glyph name="power" size={18} />
          </button>
        </div>
      </footer>
    </div>
  )
}
