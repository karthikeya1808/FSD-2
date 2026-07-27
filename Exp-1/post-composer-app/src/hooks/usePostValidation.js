import { useMemo } from 'react'
import { validatePostForPlatforms } from '../utils/validation'

/**
 * Runs live validation for the currently-selected platforms every time
 * content, platform selection, or media count changes. Memoized so the
 * (cheap but non-trivial) validation work doesn't re-run on unrelated
 * re-renders.
 */
export function usePostValidation({ content, platformIds, mediaCount }) {
  const resultsByPlatform = useMemo(
    () => validatePostForPlatforms({ content, platformIds, mediaCount }),
    [content, platformIds, mediaCount]
  )

  const allValid = useMemo(() => {
    if (platformIds.length === 0) return false
    return platformIds.every((id) => resultsByPlatform[id]?.valid)
  }, [platformIds, resultsByPlatform])

  const anyErrors = useMemo(
    () => Object.values(resultsByPlatform).flatMap((r) => r.errors),
    [resultsByPlatform]
  )

  return { resultsByPlatform, allValid, anyErrors }
}
