import type { CharacterData } from '../../types'
import type { GameCompute } from '../../lib/gameCompute'
import { SHOPPING } from '../../data/shopping'
import { Gauge } from '../Gauge'

interface ShoppingTabProps {
  data: CharacterData
  game: GameCompute
  persist: (next: CharacterData) => void
}

export function ShoppingTab({ data, game, persist }: ShoppingTabProps) {
  const { week, shopWeek, shopChecked, shopTotal, shopDone } = game

  const toggleItem = (id: string) =>
    persist({ ...data, shopping: { ...data.shopping, [shopWeek]: { ...shopChecked, [id]: !shopChecked[id] } } })

  return (
    <section>
      <div className="mb-3 rounded-2xl border border-line bg-surface p-4">
        <div className="flex items-baseline justify-between">
          <p className="m-0 font-display text-[14.5px] font-semibold uppercase tracking-wide">🛒 Ravitaillement — semaine {week}</p>
          <span className={`text-xs ${shopDone === shopTotal ? 'text-green' : 'text-muted'}`}>
            {shopDone}/{shopTotal}
          </span>
        </div>
        <Gauge label="" value={shopDone} max={shopTotal} unit="articles" color="#57C88B" />
        <p className="text-[12.5px] leading-relaxed text-muted">
          Quantités calées sur les 7 menus (base « prise de muscle » ; classes sèche/forme : réduis féculents et lait de soja). Budget ≈ 75-95 €. Se remet à zéro chaque semaine. Batch cooking :
          dimanche, cuis 500 g de riz + 600 g de poulet d'avance.
        </p>
      </div>
      {SHOPPING.map(([cat, items]) => (
        <div key={cat} className="mb-3 rounded-2xl border border-line bg-surface p-4">
          <p className="m-0 mb-1 border-b border-line pb-1 font-display text-[13px] uppercase tracking-wide text-muted">{cat}</p>
          {items.map(([id, label]) => {
            const on = !!shopChecked[id]
            return (
              <button key={id} onClick={() => toggleItem(id)} aria-pressed={on} className={`flex w-full items-center gap-3 border-b border-line py-2 text-ink last:border-b-0 ${on ? 'opacity-55' : ''}`}>
                <span
                  className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md border-2 text-sm font-bold text-bg"
                  style={{ background: on ? '#57C88B' : 'transparent', borderColor: on ? '#57C88B' : '#8B93A1' }}
                >
                  {on ? '✓' : ''}
                </span>
                <span className={`text-left text-[13.5px] ${on ? 'line-through' : ''}`}>{label}</span>
              </button>
            )
          })}
        </div>
      ))}
    </section>
  )
}
