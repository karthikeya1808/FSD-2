import { useState } from 'react'
import PostComposer from './components/PostComposer'
import DraftList from './components/DraftList'
import Toast from './components/Toast'
import { useDrafts } from './hooks/useDrafts'
import './App.css'

export default function App() {
  const { drafts, saveDraft, updateDraft, deleteDraft } = useDrafts()
  const [editingDraft, setEditingDraft] = useState(null)
  const [toast, setToast] = useState(null)

  function handleSaveDraft(fields) {
    if (editingDraft) {
      updateDraft(editingDraft.id, fields)
      setEditingDraft(null)
      setToast({ type: 'success', message: 'Draft updated.' })
    } else {
      saveDraft(fields)
      setToast({ type: 'success', message: 'Draft saved to the wire.' })
    }
  }

  function handlePublished({ platformIds }) {
    if (editingDraft) {
      updateDraft(editingDraft.id, { status: 'published', platformIds })
      setEditingDraft(null)
    }
    setToast({
      type: 'success',
      message: `Published to ${platformIds.length} platform${platformIds.length > 1 ? 's' : ''}.`,
    })
  }

  function handleEdit(draft) {
    setEditingDraft(draft)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleDelete(id) {
    deleteDraft(id)
    if (editingDraft?.id === id) setEditingDraft(null)
  }

  return (
    <div className="app">
      <header className="masthead">
        <h1 className="masthead__title">
          Wire Desk <em>Post Composer</em>
        </h1>
        <div className="masthead__meta">
          Unit 1 · Experiment 1
          <br />
          Platform Validation &amp; Draft Management
        </div>
      </header>
      <hr className="masthead__rule" />

      <div className="desk">
        <section>
          <PostComposer
            key={editingDraft?.id ?? 'new'}
            initialDraft={editingDraft}
            onSaveDraft={handleSaveDraft}
            onPublished={handlePublished}
            onCancelEdit={() => setEditingDraft(null)}
          />
        </section>

        <section>
          <DraftList drafts={drafts} onEdit={handleEdit} onDelete={handleDelete} />
        </section>
      </div>

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  )
}
