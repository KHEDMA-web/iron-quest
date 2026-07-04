import { useEffect } from 'react'
import { useCharacterStore } from './hooks/useCharacterStore'
import { ErrorBoundary } from './components/ErrorBoundary'
import { CharacterSelect } from './components/CharacterSelect'
import { Game } from './components/Game'

export default function App() {
  const { store, active, saveErr, selectCharacter, createCharacter, updateActive, switchCharacter, deleteActive } = useCharacterStore()

  // Onboarding <-> jeu change entièrement de contenu : repartir en haut de page.
  // Dépend de l'id (store.active), pas de l'objet `active` qui change de référence à chaque sauvegarde.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [store.active])

  return (
    <ErrorBoundary>
      {active ? (
        <Game data={active} saveErr={saveErr} onUpdate={updateActive} onSwitch={switchCharacter} onDelete={deleteActive} />
      ) : (
        <CharacterSelect store={store} saveErr={saveErr} onSelect={selectCharacter} onCreate={createCharacter} />
      )}
    </ErrorBoundary>
  )
}
