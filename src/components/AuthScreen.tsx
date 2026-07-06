import { useState } from 'react'
import type { AuthResult } from '../lib/auth'
import { supabase } from '../lib/supabase'

interface AuthScreenProps {
  onSignUp: (email: string, password: string) => Promise<AuthResult>
  onSignIn: (email: string, password: string) => Promise<AuthResult>
}

export function AuthScreen({ onSignUp, onSignIn }: AuthScreenProps) {
  const [mode, setMode] = useState<'in' | 'up'>('in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [info, setInfo] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async () => {
    setErr('')
    setInfo('')
    if (!email.trim()) return setErr('Il te faut un email.')
    if (password.length < 6) return setErr('Mot de passe : 6 caractères minimum.')
    setBusy(true)
    const result = mode === 'up' ? await onSignUp(email.trim(), password) : await onSignIn(email.trim(), password)
    setBusy(false)
    if (result.error) return setErr(result.error)
    if (result.needsEmailConfirmation) {
      setInfo('Compte créé — vérifie ta boîte mail pour confirmer ton adresse, puis connecte-toi.')
      setMode('in')
    }
  }

  return (
    <div className="mx-auto min-h-screen max-w-[520px] px-3.5 pb-10 pt-4">
      <div className="pt-6 text-center">
        <p className="m-0 font-display text-[11.5px] font-semibold tracking-[2.5px] text-accent">IRON QUEST</p>
        <h1 className="m-0 mt-0.5 font-display text-[38px] font-bold leading-tight">{mode === 'up' ? 'CRÉE TON COMPTE' : 'CONNEXION'}</h1>
      </div>

      {!supabase && (
        <p className="mt-3.5 rounded-2xl border border-line bg-surface p-4 text-sm text-red">
          Compte indisponible : cette installation n'a pas de Supabase configuré (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY manquantes).
        </p>
      )}

      <div className="mt-3.5">
        <input
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          aria-label="Email"
          className="mb-2 w-full rounded-[10px] border border-line bg-surface2 px-3.5 py-3 text-base text-ink"
        />
        <input
          type="password"
          autoComplete={mode === 'up' ? 'new-password' : 'current-password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe"
          aria-label="Mot de passe"
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          className="mb-2 w-full rounded-[10px] border border-line bg-surface2 px-3.5 py-3 text-base text-ink"
        />

        {err && <p className="mt-2 text-center text-sm text-red">{err}</p>}
        {info && <p className="mt-2 text-center text-sm text-accent">{info}</p>}

        <button
          onClick={submit}
          disabled={busy || !supabase}
          className="mt-3 w-full rounded-[10px] bg-accent px-4 py-3 font-display text-sm font-semibold uppercase tracking-wide text-[#1A1A1A] transition-transform duration-100 active:scale-[0.97] disabled:opacity-50"
        >
          {busy ? 'Un instant…' : mode === 'up' ? 'CRÉER MON COMPTE' : 'SE CONNECTER'}
        </button>

        <button
          onClick={() => {
            setMode(mode === 'up' ? 'in' : 'up')
            setErr('')
            setInfo('')
          }}
          className="mt-2.5 w-full rounded-[10px] border border-line px-4 py-2.5 text-sm text-muted"
        >
          {mode === 'up' ? 'Déjà un compte ? Se connecter' : 'Pas encore de compte ? En créer un'}
        </button>
      </div>
    </div>
  )
}
