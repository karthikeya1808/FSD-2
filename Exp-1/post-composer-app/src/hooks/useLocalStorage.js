import { useEffect, useState } from 'react'

/**
 * A small, reusable hook that syncs a piece of state with localStorage.
 * This is the persistence layer the rest of the app builds on top of —
 * swapping it out for a real API call later (see services/postService.js)
 * is the natural "next experiment" in this module.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored ? JSON.parse(stored) : initialValue
    } catch (err) {
      console.warn(`useLocalStorage: failed to read key "${key}"`, err)
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (err) {
      console.warn(`useLocalStorage: failed to write key "${key}"`, err)
    }
  }, [key, value])

  return [value, setValue]
}
