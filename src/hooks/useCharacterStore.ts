import { useState } from 'react'
import type { CharacterData, Store } from '../types'
import { loadStore, saveStore } from '../lib/storage'
import { syncLeaderboard } from '../lib/supabase'

export function useCharacterStore() {
  const [store, setStore] = useState<Store>(() => loadStore())
  const [saveErr, setSaveErr] = useState(false)

  const persistStore = (next: Store) => {
    setStore(next)
    setSaveErr(!saveStore(next))
  }

  const active = store.active && store.profiles[store.active] ? store.profiles[store.active] : null

  const selectCharacter = (id: string) => persistStore({ ...store, active: id })

  const createCharacter = (id: string, char: CharacterData) => persistStore({ profiles: { ...store.profiles, [id]: char }, active: id })

  const updateActive = (next: CharacterData) => {
    if (!store.active) return
    persistStore({ ...store, profiles: { ...store.profiles, [store.active]: next } })
    void syncLeaderboard(next)
  }

  const switchCharacter = () => persistStore({ ...store, active: null })

  const deleteActive = () => {
    if (!store.active) return
    const nextProfiles = { ...store.profiles }
    delete nextProfiles[store.active]
    persistStore({ profiles: nextProfiles, active: null })
  }

  return { store, active, saveErr, selectCharacter, createCharacter, updateActive, switchCharacter, deleteActive }
}
