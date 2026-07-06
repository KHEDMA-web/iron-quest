import { useState } from 'react'
import type { CharacterData, Store } from './types'
import { loadStore, saveStore } from './lib/storage'
import { deleteAllPhotos } from './lib/photos'
import { syncLeaderboard } from './lib/supabase'
import { CharacterSelect } from './components/CharacterSelect'
import { Game } from './components/Game'

export default function App() {
  const [store, setStore] = useState<Store>(() => loadStore())
  const [saveErr, setSaveErr] = useState(false)

  const persistStore = (next: Store) => {
    setStore(next)
    setSaveErr(!saveStore(next))
  }

  const active = store.active && store.profiles[store.active] ? store.profiles[store.active] : null

  if (!active) {
    return (
      <CharacterSelect
        store={store}
        saveErr={saveErr}
        onSelect={(id) => persistStore({ ...store, active: id })}
        onCreate={(id, char) => persistStore({ profiles: { ...store.profiles, [id]: char }, active: id })}
      />
    )
  }

  return (
    <Game
      data={active}
      saveErr={saveErr}
      onUpdate={(next: CharacterData) => {
        persistStore({ ...store, profiles: { ...store.profiles, [store.active as string]: next } })
        void syncLeaderboard(next)
      }}
      onSwitch={() => persistStore({ ...store, active: null })}
      onDelete={() => {
        const id = store.active as string
        const nextProfiles = { ...store.profiles }
        delete nextProfiles[id]
        // Efface aussi les photos de progression : un futur personnage au même
        // pseudo ne doit pas hériter des photos de corps du précédent.
        void deleteAllPhotos(id).catch(() => {})
        persistStore({ profiles: nextProfiles, active: null })
      }}
    />
  )
}
