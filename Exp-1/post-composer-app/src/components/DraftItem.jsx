import { getPlatform } from '../config/platforms'
import './DraftItem.css'

function formatTimestamp(iso) {
  const d = new Date(iso)
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function DraftItem({ draft, onEdit, onDelete }) {
  const preview = draft.content.trim().length > 0 ? draft.content : '(empty message)'

  return (
    <article className={`draft-item draft-item--${draft.status}`}>
      <div className="draft-item__stamp">{formatTimestamp(draft.updatedAt)}</div>
      <p className="draft-item__preview">{preview}</p>
      <div className="draft-item__platforms">
        {draft.platformIds.map((id) => {
          const platform = getPlatform(id)
          if (!platform) return null
          return (
            <span
              key={id}
              className="draft-item__tag"
              style={{ '--tag-accent': platform.accent }}
            >
              {platform.shortLabel}
            </span>
          )
        })}
        {draft.status !== 'draft' && (
          <span className={`draft-item__status draft-item__status--${draft.status}`}>
            {draft.status}
          </span>
        )}
      </div>
      <div className="draft-item__actions">
        <button type="button" className="link-btn" onClick={() => onEdit(draft)}>
          Edit
        </button>
        <button type="button" className="link-btn link-btn--danger" onClick={() => onDelete(draft.id)}>
          Delete
        </button>
      </div>
    </article>
  )
}
