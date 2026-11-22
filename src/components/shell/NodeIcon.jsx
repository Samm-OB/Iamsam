import { FileIcon, Poster } from '../icons/Icons'

// Icon for a file-system node. With `thumbs`, images/videos show a preview like Explorer's large-icon view.
export default function NodeIcon({ node, size = 48, thumbs = false }) {
  if (thumbs && node.thumb) {
    return (
      <span className="grid place-items-center shrink-0" style={{ width: size, height: size }}>
        <img src={node.thumb} alt="" className="max-w-full max-h-full object-cover rounded-sm"
          style={{ width: size, height: size * 0.72, boxShadow: '0 1px 3px rgba(0,0,0,.3)' }} />
      </span>
    )
  }
  if (thumbs && node.icon === 'video') {
    return (
      <span className="grid place-items-center shrink-0" style={{ width: size, height: size }}>
        <span className="block overflow-hidden rounded-sm" style={{ width: size * 0.7, height: size, fontSize: size / 9, boxShadow: '0 1px 3px rgba(0,0,0,.3)' }}>
          <Poster seed={node.posterSeed} src={node.poster} className="w-full h-full" />
        </span>
      </span>
    )
  }
  return (
    <span className="relative inline-block shrink-0" style={{ width: size, height: size }}>
      <FileIcon name={node.icon} size={size} />
      {node.kind === 'shortcut' && (
        <svg viewBox="0 0 12 12" className="absolute left-0 bottom-0" style={{ width: size * 0.3, height: size * 0.3 }} aria-hidden="true">
          <rect width="12" height="12" rx="2" fill="#fff" stroke="#0003" />
          <path d="M3.5 8.5c0-3 1.5-4.5 4.5-4.5M6 2.5L8 4 6 5.5" stroke="#0f6cbd" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  )
}
