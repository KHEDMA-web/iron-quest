import { useEffect } from 'react'
import { useAuth } from './hooks/useAuth'
import { useCharacterStore } from './hooks/useCharacterStore'
import { ErrorBoundary } from './components/ErrorBoundary'
import { AuthScreen } from './components/AuthScreen'
import { CharacterSelect } from './components/CharacterSelect'
import { Game } from './components/Game'

export default function App() {
  const { userId, authLoading, signUp, signIn, signOut } = useAuth()
  const { char, loading, saveErr, createCharacter, updateActive, deleteCharacter } = useCharacterStore(userId)

  const hasChar = !!char
  // Changement d'écran (auth <-> onboarding <-> jeu) : repartir en haut de page.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [userId, hasChar])

  return (
    <ErrorBoundary>
      {authLoading || (userId && loading) ? (
        <div className="mx-auto flex min-h-screen max-w-[520px] items-center justify-center px-3.5">
          <p className="text-sm text-muted">Chargement…</p>
        </div>
      ) : !userId ? (
        <AuthScreen onSignUp={signUp} onSignIn={signIn} />
      ) : char ? (
        <Game data={char} saveErr={saveErr} onUpdate={updateActive} onSignOut={signOut} onDelete={deleteCharacter} />
      ) : (
        <CharacterSelect saveErr={saveErr} onCreate={createCharacter} />
      )}
    </ErrorBoundary>
  )
}
