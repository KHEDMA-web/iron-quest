import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  error: Error | null
}

const RELOADED_ONCE_KEY = 'ironquest-stale-chunk-reload'

/** Après un déploiement, un onglet resté ouvert peut essayer de charger un chunk (ex: le
 * ProfileScreen lazy-loadé) dont le hash n'existe plus sur le serveur — Vite/React voit ça comme
 * une exception de rendu. Pas un vrai bug : un simple rechargement récupère la nouvelle version. */
function isStaleChunkError(error: Error): boolean {
  return /dynamically imported module|Failed to fetch dynamically imported module|Importing a module script failed|ChunkLoadError/i.test(error.message)
}

/** Filet de sécurité : une erreur de rendu ne doit jamais laisser un écran blanc, les données restent en localStorage. */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('IRON QUEST — erreur non gérée :', error, info.componentStack)
    if (isStaleChunkError(error) && !sessionStorage.getItem(RELOADED_ONCE_KEY)) {
      sessionStorage.setItem(RELOADED_ONCE_KEY, '1')
      location.reload()
    }
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="mx-auto flex min-h-screen max-w-[520px] flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-4xl" aria-hidden>
          💥
        </p>
        <h1 className="m-0 font-display text-xl font-bold">Un imprévu de partie.</h1>
        <p className="m-0 text-sm text-muted">
          Une erreur a interrompu l'affichage. Tes données restent sauvegardées sur cet appareil — recharge la page pour reprendre la quête.
        </p>
        <button
          onClick={() => location.reload()}
          className="mt-1 rounded-[10px] bg-accent px-4 py-2.5 font-display text-sm font-semibold uppercase tracking-wide text-[#1A1A1A]"
        >
          Recharger
        </button>
      </div>
    )
  }
}
