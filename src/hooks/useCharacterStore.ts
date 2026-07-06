import { useEffect, useState } from 'react'
import type { CharacterData } from '../types'
import { clearCachedCharacter, loadCachedCharacter, saveCachedCharacter } from '../lib/storage'
import { deleteCharacterRemote, loadCharacter, saveCharacterRemote, syncLeaderboard } from '../lib/supabase'

/** Perso unique lié au compte connecté (userId) : cache local instantané + source de vérité Supabase. */
export function useCharacterStore(userId: string | null) {
  const [char, setChar] = useState<CharacterData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saveErr, setSaveErr] = useState(false)

  useEffect(() => {
    if (!userId) {
      setChar(null)
      setLoading(false)
      return
    }
    let active = true
    setLoading(true)
    const cached = loadCachedCharacter(userId)
    if (cached) setChar(cached)

    loadCharacter(userId).then((remote) => {
      if (!active) return
      if (remote) {
        setChar(remote)
        saveCachedCharacter(userId, remote)
      } else if (cached) {
        // Créé hors-ligne ou sync cloud précédente ratée : on retente de le pousser.
        void saveCharacterRemote(userId, cached)
      }
      setLoading(false)
    })

    return () => {
      active = false
    }
  }, [userId])

  const persist = (next: CharacterData) => {
    if (!userId) return
    setChar(next)
    setSaveErr(!saveCachedCharacter(userId, next))
    void saveCharacterRemote(userId, next)
    void syncLeaderboard(userId, next)
  }

  const deleteCharacter = () => {
    if (!userId) return
    clearCachedCharacter(userId)
    void deleteCharacterRemote(userId)
    setChar(null)
  }

  return { char, loading, saveErr, createCharacter: persist, updateActive: persist, deleteCharacter }
}
