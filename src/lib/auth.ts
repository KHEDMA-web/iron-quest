import type { Session } from '@supabase/supabase-js'
import { supabase } from './supabase'

export type { Session }

const NOT_CONFIGURED = "Le compte n'est pas configuré sur cette installation (variables Supabase manquantes)."

const authError = (message: string) => {
  if (message.includes('Invalid login credentials')) return 'Email ou mot de passe incorrect.'
  if (message.includes('already registered') || message.includes('already been registered')) return 'Un compte existe déjà avec cet email.'
  if (message.includes('Password should be')) return 'Mot de passe trop court (6 caractères minimum).'
  if (message.includes('Unable to validate email') || message.includes('invalid')) return 'Adresse email invalide.'
  return message
}

export interface AuthResult {
  error?: string
  needsEmailConfirmation?: boolean
}

export async function signUp(email: string, password: string): Promise<AuthResult> {
  if (!supabase) return { error: NOT_CONFIGURED }
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) return { error: authError(error.message) }
  return { needsEmailConfirmation: !data.session }
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  if (!supabase) return { error: NOT_CONFIGURED }
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: authError(error.message) }
  return {}
}

export async function signOut(): Promise<void> {
  if (!supabase) return
  await supabase.auth.signOut()
}

export async function getSession(): Promise<Session | null> {
  if (!supabase) return null
  const { data } = await supabase.auth.getSession()
  return data.session
}

/** Retourne une fonction de désabonnement. */
export function onAuthChange(cb: (session: Session | null) => void): () => void {
  if (!supabase) return () => {}
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => cb(session))
  return () => subscription.unsubscribe()
}
