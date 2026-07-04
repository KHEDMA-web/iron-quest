import { useCallback, useState } from 'react'

export interface ToastItem {
  id: number
  icon: string
  title: string
  subtitle?: string
}

export type ToastPush = (t: Omit<ToastItem, 'id'>) => void

const TOAST_LIFETIME_MS = 4200

export function useToasts() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const push = useCallback<ToastPush>((t) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { ...t, id }])
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), TOAST_LIFETIME_MS)
  }, [])

  return { toasts, push, toastLifetimeMs: TOAST_LIFETIME_MS }
}
