import { useState } from 'react'
import PlatformSelector from './PlatformSelector'
import CharacterCounter from './CharacterCounter'
import { PLATFORM_IDS, getPlatform } from '../config/platforms'
import { usePostValidation } from '../hooks/usePostValidation'
import { extractHashtags } from '../utils/validation'
import { publishPost } from '../services/postService'
import './PostComposer.css'

const EMPTY_DRAFT = { content: '', platformIds: [PLATFORM_IDS.TWITTER], mediaCount: 0 }

/**
 * PostComposer is the primary controlled form of the module. All form state
 * (content, platforms, media count) lives here as React state — the
 * definition of a "controlled component" this experiment is teaching.
 *
 * Props:
 *  - initialDraft: optional draft object to load into the form (editing flow)
 *  - onSaveDraft(fields): called when "Save Draft" is pressed
 *  - onPublished(fields): called after a simulated publish succeeds
 *  - onCancelEdit(): called to exit "editing an existing draft" mode
 */
export default function PostComposer({ initialDraft, onSaveDraft, onPublished, onCancelEdit }) {
  const [content, setContent] = useState(initialDraft?.content ?? EMPTY_DRAFT.content)
  const [platformIds, setPlatformIds] = useState(
    initialDraft?.platformIds?.length ? initialDraft.platformIds : EMPTY_DRAFT.platformIds
  )
  const [mediaCount, setMediaCount] = useState(initialDraft?.mediaCount ?? EMPTY_DRAFT.mediaCount)
  const [publishing, setPublishing] = useState(false)
  const [publishError, setPublishError] = useState(null)
  const [touched, setTouched] = useState(false)

  const { resultsByPlatform, allValid, anyErrors } = usePostValidation({
    content,
    platformIds,
    mediaCount,
  })

  const hashtagCount = extractHashtags(content).length
  const isEditing = Boolean(initialDraft)

  function resetForm() {
    setContent('')
    setPlatformIds([PLATFORM_IDS.TWITTER])
    setMediaCount(0)
    setTouched(false)
    setPublishError(null)
  }

  function handleSaveDraft() {
    setTouched(true)
    onSaveDraft({ content, platformIds, mediaCount })
    if (!isEditing) resetForm()
  }

  async function handlePublish() {
    setTouched(true)
    if (!allValid) return
    setPublishing(true)
    setPublishError(null)
    try {
      const result = await publishPost({ content, platformIds })
      onPublished({ content, platformIds, mediaCount, result })
      resetForm()
    } catch (err) {
      setPublishError(err.message)
    } finally {
      setPublishing(false)
    }
  }

  return (
    <div className="composer">
      <div className="panel-label">{isEditing ? 'Editing dispatch' : 'New dispatch'}</div>

      <label className="composer__field-label" htmlFor="post-content">
        Message
      </label>
      <textarea
        id="post-content"
        className="composer__textarea"
        placeholder="Draft your dispatch here…"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onBlur={() => setTouched(true)}
        rows={8}
      />

      <div className="composer__meta-row">
        <span className="composer__meta-item">Hashtags: {hashtagCount}</span>
        <label className="composer__meta-item composer__media-control">
          Attachments:
          <button
            type="button"
            className="stepper-btn"
            onClick={() => setMediaCount((n) => Math.max(0, n - 1))}
            aria-label="Decrease attachment count"
          >
            −
          </button>
          <span className="stepper-value">{mediaCount}</span>
          <button
            type="button"
            className="stepper-btn"
            onClick={() => setMediaCount((n) => n + 1)}
            aria-label="Increase attachment count"
          >
            +
          </button>
        </label>
      </div>

      <div className="panel-label">Target platforms</div>
      <PlatformSelector selectedIds={platformIds} onChange={setPlatformIds} />

      {platformIds.length > 0 && (
        <div className="composer__counters">
          {platformIds.map((id) => (
            <CharacterCounter key={id} platform={getPlatform(id)} result={resultsByPlatform[id]} />
          ))}
        </div>
      )}

      {touched && anyErrors.length > 0 && (
        <ul className="composer__errors">
          {[...new Set(anyErrors)].map((err) => (
            <li key={err}>{err}</li>
          ))}
        </ul>
      )}

      {publishError && <p className="composer__publish-error">{publishError}</p>}

      <div className="composer__actions">
        {isEditing && (
          <button type="button" className="btn btn--ghost" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
        <button type="button" className="btn btn--secondary" onClick={handleSaveDraft}>
          Save Draft
        </button>
        <button
          type="button"
          className="btn btn--primary"
          onClick={handlePublish}
          disabled={!allValid || publishing}
        >
          {publishing ? 'Publishing…' : 'Publish'}
        </button>
      </div>
    </div>
  )
}
