import { useEffect } from 'react'

type ToastProps = {
  message: string
  open: boolean
  onClose: () => void
  durationMs?: number
}

export function Toast({ message, open, onClose, durationMs = 4200 }: ToastProps) {
  useEffect(() => {
    if (!open) return
    const id = window.setTimeout(onClose, durationMs)
    return () => window.clearTimeout(id)
  }, [open, onClose, durationMs])

  if (!open) return null

  return (
    <div className="app-toast" role="status" aria-live="polite">
      <p className="app-toast__text">{message}</p>
    </div>
  )
}
