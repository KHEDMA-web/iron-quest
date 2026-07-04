import { useEffect, useRef } from 'react'
import type { GameCompute } from '../lib/gameCompute'
import type { ToastPush } from './useToasts'

/** Détecte les passages de niveau et les hauts faits nouvellement débloqués pour déclencher des toasts. */
export function useGameEvents(game: GameCompute, push: ToastPush) {
  const prevLvl = useRef(game.lvl)
  const prevDone = useRef(new Set(game.achievements.filter((a) => a.done).map((a) => a.name)))
  const mounted = useRef(false)

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      prevLvl.current = game.lvl
      prevDone.current = new Set(game.achievements.filter((a) => a.done).map((a) => a.name))
      return
    }

    if (game.lvl > prevLvl.current) {
      push({ icon: '⬆️', title: `NIVEAU ${game.lvl}`, subtitle: `${game.rank.icon} ${game.rank.name}` })
    }
    prevLvl.current = game.lvl

    for (const a of game.achievements) {
      if (a.done && !prevDone.current.has(a.name)) {
        push({ icon: a.icon, title: `Haut fait : ${a.name}`, subtitle: a.desc })
      }
    }
    prevDone.current = new Set(game.achievements.filter((a) => a.done).map((a) => a.name))
  }, [game, push])
}
