import DraftItem from './DraftItem'
import './DraftList.css'

export default function DraftList({ drafts, onEdit, onDelete }) {
  return (
    <div className="draft-list">
      <div className="panel-label">The wire ({drafts.length})</div>
      {drafts.length === 0 ? (
        <div className="draft-list__empty">
          <p>No drafts filed yet.</p>
          <p className="draft-list__empty-sub">Save a dispatch to see it queued here.</p>
        </div>
      ) : (
        <div className="draft-list__stack">
          {drafts.map((draft) => (
            <DraftItem key={draft.id} draft={draft} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
