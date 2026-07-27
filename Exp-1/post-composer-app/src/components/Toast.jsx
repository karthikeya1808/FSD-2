import { useEffect } from 'react'
import './Toast.css'

/**
 * Simple, self-dismissing toast. Controlled from the parent — pass `null`
 * as `toast` to render nothing.
 */
export default function Toast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(onDismiss, 4200)
    return () => clearTimeout(timer)
  }, [toast, onDismiss])

  if (!toast) return null

  return (
    <div className={`toast toast--${toast.type}`} role="status">
      <span className="toast__icon">{toast.type === 'error' ? '✕' : '✓'}</span>
      <span>{toast.message}</span>
      <button className="toast__close" onClick={onDismiss} aria-label="Dismiss notification">
        ×
      </button>
    </div>
  )
}
