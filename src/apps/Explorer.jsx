import { useMemo, useState } from 'react'
import { useOS } from '../store/os'
import { getNode, pathTo, quickAccess } from '../data/fs'
import { FileIcon, Glyph } from '../components/icons/Icons'
import NodeIcon from '../components/shell/NodeIcon'
import { useViewport } from '../lib/useViewport'

function descendants(id) {
  const out = []
  const walk = (nid) => getNode(nid).children?.forEach((c) => { out.push(c); walk(c) })
  walk(id)
  return out
}

const sorters = {
  name: (a, b) => (a.kind === 'folder') === (b.kind === 'folder') ? a.name.localeCompare(b.name) : a.kind === 'folder' ? -1 : 1,
  type: (a, b) => (a.type ?? '').localeCompare(b.type ?? '') || a.name.localeCompare(b.name),
}

export default function Explorer({ win }) {
  const { update, openNode } = useOS.getState()
  const { isMobile } = useViewport()
  const path = win.props.path
  const currentId = path[path.length - 1]
  const current = getNode(currentId)

  const [history, setHistory] = useState({ stack: [currentId], pos: 0 })
  const [view, setView] = useState(isMobile ? 'list' : 'grid')
  const [sort, setSort] = useState('name')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)

  const go = (id, push = true) => {
    const node = getNode(id)
    update(win.id, { key: `explorer:${id}`, props: { ...win.props, path: pathTo(id) }, title: id === 'desktop' ? 'Home' : node.name, icon: node.icon === 'folder' ? 'explorer' : node.icon })
    setSelected(null)
    setQuery('')
    if (push) setHistory((h) => ({ stack: [...h.stack.slice(0, h.pos + 1), id], pos: h.pos + 1 }))
  }
  const back = () => history.pos > 0 && (go(history.stack[history.pos - 1], false), setHistory((h) => ({ ...h, pos: h.pos - 1 })))
  const forward = () => history.pos < history.stack.length - 1 && (go(history.stack[history.pos + 1], false), setHistory((h) => ({ ...h, pos: h.pos + 1 })))
  const up = () => path.length > 1 && go(path[path.length - 2])

  const items = useMemo(() => {
    const ids = query.trim() ? descendants(currentId).filter((id) => getNode(id).name.toLowerCase().includes(query.trim().toLowerCase())) : current.children
    return ids.map(getNode).sort(sorters[sort])
  }, [currentId, current, query, sort])

  const activate = (node) => (node.kind === 'folder' ? go(node.id) : openNode(node.id))

  return (
    <div className="h-full flex flex-col text-[13px]">
      {/* Address row */}
      <div className="flex items-center gap-1 px-2 h-12 shrink-0">
        <NavBtn glyph="back" label="Back" onClick={back} disabled={history.pos === 0} />
        <NavBtn glyph="forward" label="Forward" onClick={forward} disabled={history.pos >= history.stack.length - 1} />
        <NavBtn glyph="up" label="Up" onClick={up} disabled={path.length <= 1} />
        <NavBtn glyph="refresh" label="Refresh" onClick={() => setQuery('')} />
        <div className="field flex-1 min-w-0 h-8 flex items-center gap-1 px-2 ml-1 overflow-hidden">
          <FileIcon name={current.icon === 'folder' ? 'explorer' : current.icon} size={16} />
          {path.map((id, i) => (
            <span key={id} className="flex items-center gap-0.5 shrink-0">
              <Glyph name="chevronRight" size={12} className="opacity-60" />
              <button className="btn-subtle px-1.5 h-6 whitespace-nowrap" onClick={() => go(id)}>{id === 'desktop' ? 'Home' : getNode(id).name}</button>
              {i === path.length - 1 && null}
            </span>
          ))}
        </div>
        {!isMobile && (
          <label className="field h-8 w-56 flex items-center gap-2 px-2 ml-1">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Search ${current.id === 'desktop' ? 'Home' : current.name}`}
              className="flex-1 min-w-0 bg-transparent outline-none text-xs" />
            <Glyph name="search" size={14} className="opacity-70" />
          </label>
        )}
      </div>

      {/* Command bar */}
      <div className="flex items-center gap-1 px-3 h-11 shrink-0" style={{ borderTop: '1px solid var(--stroke)', borderBottom: '1px solid var(--stroke)', background: 'var(--layer)' }}>
        <button className="btn-subtle h-8 px-2 flex items-center gap-1.5" disabled title="This is a portfolio — read only">
          <Glyph name="plus" size={16} /> New
        </button>
        <span className="w-px h-6 mx-1" style={{ background: 'var(--stroke)' }} />
        <button className="btn-subtle h-8 px-2 flex items-center gap-1.5" onClick={() => setSort(sort === 'name' ? 'type' : 'name')}>
          <Glyph name="sort" size={16} /> Sort: {sort === 'name' ? 'Name' : 'Type'}
        </button>
        <button className="btn-subtle h-8 px-2 flex items-center gap-1.5" onClick={() => setView(view === 'grid' ? 'list' : 'grid')}>
          <Glyph name={view === 'grid' ? 'list' : 'grid'} size={16} /> View: {view === 'grid' ? 'Large icons' : 'Details'}
        </button>
      </div>

      <div className="flex flex-1 min-h-0" style={{ background: 'var(--layer)' }}>
        {/* Navigation pane */}
        {!isMobile && (
          <aside className="w-48 shrink-0 scroll py-2 px-1.5" style={{ borderRight: '1px solid var(--stroke)' }}>
            {quickAccess.map((id) => (
              <SideItem key={id} id={id} active={currentId === id} onClick={() => go(id)} />
            ))}
            <div className="my-2 mx-2 h-px" style={{ background: 'var(--stroke)' }} />
            <SideItem id="recycle" active={currentId === 'recycle'} onClick={() => go('recycle')} />
          </aside>
        )}

        {/* Items */}
        <main className="flex-1 min-w-0 scroll p-2 no-select" onPointerDown={(e) => e.target === e.currentTarget && setSelected(null)}>
          {query && <div className="px-2 pb-2 text-xs" style={{ color: 'var(--text-2)' }}>Search results in {current.id === 'desktop' ? 'Home' : current.name}</div>}
          {items.length === 0 && <div className="text-center py-16" style={{ color: 'var(--text-2)' }}>{query ? 'No items match your search.' : 'This folder is empty.'}</div>}

          {view === 'grid' ? (
            <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(104px, 1fr))' }}>
              {items.map((n) => (
                <button key={n.id}
                  className="flex flex-col items-center gap-1.5 p-2 rounded text-center outline-none hover:bg-[var(--hover)]"
                  style={selected === n.id ? { background: 'var(--selected)', boxShadow: 'inset 0 0 0 1px var(--selected-stroke)' } : undefined}
                  onClick={() => (isMobile ? activate(n) : setSelected(n.id))}
                  onDoubleClick={() => activate(n)}
                  onKeyDown={(e) => e.key === 'Enter' && activate(n)}>
                  <NodeIcon node={n} size={64} thumbs />
                  <span className="text-xs leading-tight line-clamp-2 break-words w-full">{n.name}</span>
                </button>
              ))}
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr style={{ color: 'var(--text-2)' }}>
                  <th className="font-normal py-1.5 px-2">Name</th>
                  <th className="font-normal py-1.5 px-2 hidden sm:table-cell">Type</th>
                  <th className="font-normal py-1.5 px-2 hidden md:table-cell">Details</th>
                </tr>
              </thead>
              <tbody>
                {items.map((n) => (
                  <tr key={n.id} tabIndex={0}
                    className="hover:bg-[var(--hover)] outline-none"
                    style={selected === n.id ? { background: 'var(--selected)' } : undefined}
                    onClick={() => (isMobile ? activate(n) : setSelected(n.id))}
                    onDoubleClick={() => activate(n)}
                    onKeyDown={(e) => e.key === 'Enter' && activate(n)}>
                    <td className="py-1 px-2 rounded-l"><span className="flex items-center gap-2"><NodeIcon node={n} size={20} /><span className="truncate">{n.name}</span></span></td>
                    <td className="py-1 px-2 hidden sm:table-cell" style={{ color: 'var(--text-2)' }}>{n.type}</td>
                    <td className="py-1 px-2 rounded-r hidden md:table-cell" style={{ color: 'var(--text-2)' }}>{n.kind === 'folder' ? `${n.children.length} items` : n.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </main>
      </div>

      {/* Status bar */}
      <div className="h-7 shrink-0 flex items-center gap-4 px-3 text-xs" style={{ color: 'var(--text-2)', background: 'var(--layer)', borderTop: '1px solid var(--stroke)' }}>
        <span>{items.length} item{items.length === 1 ? '' : 's'}</span>
        {selected && <span>1 item selected</span>}
      </div>
    </div>
  )
}

function NavBtn({ glyph, label, onClick, disabled }) {
  return (
    <button className="btn-subtle w-8 h-8 grid place-items-center" aria-label={label} title={label} onClick={onClick} disabled={disabled}>
      <Glyph name={glyph} size={16} />
    </button>
  )
}

function SideItem({ id, active, onClick }) {
  const n = getNode(id)
  return (
    <button onClick={onClick}
      className="btn-subtle relative w-full flex items-center gap-2.5 h-8 px-3 text-left text-[13px]"
      style={active ? { background: 'var(--hover)' } : undefined}>
      {active && <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full" style={{ background: 'var(--accent)' }} />}
      {id === 'desktop' ? <Glyph name="home" size={16} /> : <NodeIcon node={n} size={16} />}
      <span className="truncate">{id === 'desktop' ? 'Home' : n.name}</span>
    </button>
  )
}
