import { useEffect, useState } from 'react'
import type { Session } from '../lib/auth'
import { getSession, onAuthChange, signIn, signOut, signUp } from '../lib/auth'

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    let active = true
    getSession().then((s) => {
      if (active) {
        setSession(s)
        setAuthLoading(false)
      }
    })
    const unsubscribe = onAuthChange((s) => setSession(s))
    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  return { session, userId: session?.user.id ?? null, authLoading, signUp, signIn, signOut }
}
