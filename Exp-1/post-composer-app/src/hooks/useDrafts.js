import { useCallback, useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'

const STORAGE_KEY = 'wire-desk:drafts'

/**
 * FACTORY PATTERN
 * ---------------------------------------------------------------------------
 * createDraft() is the single place a "draft" object gets constructed. Every
 * caller goes through this factory instead of hand-rolling object literals,
 * which guarantees every draft in the app has the same shape (id, timestamps,
 * status, etc.) no matter where it was created from.
 */
function createDraft({ content = '', platformIds = [], mediaCount = 0 } = {}) {
  const now = new Date().toISOString()
  return {
    id: (crypto.randomUUID && crypto.randomUUID()) || `draft-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    content,
    platformIds,
    mediaCount,
    status: 'draft', // draft | published | failed
    createdAt: now,
    updatedAt: now,
  }
}

/**
 * useDrafts centralizes all CRUD operations for post drafts, backed by
 * localStorage via useLocalStorage. Components never touch storage directly
 * — they call the functions this hook returns, which keeps the persistence
 * mechanism swappable (see README for "next steps: real backend").
 */
export function useDrafts() {
  const [drafts, setDrafts] = useLocalStorage(STORAGE_KEY, [])

  const saveDraft = useCallback(
    ({ content, platformIds, mediaCount }) => {
      const draft = createDraft({ content, platformIds, mediaCount })
      setDrafts((prev) => [draft, ...prev])
      return draft
    },
    [setDrafts]
  )

  const updateDraft = useCallback(
    (id, updates) => {
      setDrafts((prev) =>
        prev.map((d) =>
          d.id === id
            ? { ...d, ...updates, updatedAt: new Date().toISOString() }
            : d
        )
      )
    },
    [setDrafts]
  )

  const deleteDraft = useCallback(
    (id) => {
      setDrafts((prev) => prev.filter((d) => d.id !== id))
    },
    [setDrafts]
  )

  const getDraft = useCallback((id) => drafts.find((d) => d.id === id) ?? null, [drafts])

  const markStatus = useCallback(
    (id, status) => updateDraft(id, { status }),
    [updateDraft]
  )

  const sortedDrafts = useMemo(
    () => [...drafts].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)),
    [drafts]
  )

  return {
    drafts: sortedDrafts,
    saveDraft,
    updateDraft,
    deleteDraft,
    getDraft,
    markStatus,
  }
}
