import { useEffect, useRef, useState } from 'react'
import { addPhoto, compressImage, deletePhoto, listPhotos, type ProgressPhoto } from '../lib/photos'
import { fmtDate } from '../lib/dates'

interface ProgressPhotosProps {
  charId: string
}

export function ProgressPhotos({ charId }: ProgressPhotosProps) {
  const [photos, setPhotos] = useState<ProgressPhoto[]>([])
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const reload = () => listPhotos(charId).then(setPhotos).catch(() => setErr('Photos indisponibles sur cet appareil.'))

  useEffect(() => {
    void reload()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [charId])

  const onFile = async (file: File) => {
    setBusy(true)
    setErr('')
    try {
      await addPhoto(charId, await compressImage(file))
      await reload()
    } catch {
      setErr("Impossible d'enregistrer la photo (stockage plein ?).")
    }
    setBusy(false)
  }

  const remove = async (id: number) => {
    await deletePhoto(id).catch(() => setErr('Suppression impossible.'))
    await reload()
  }

  const first = photos[0]
  const last = photos[photos.length - 1]

  return (
    <div className="mb-3 rounded-2xl border border-line bg-surface p-4">
      <p className="m-0 font-display text-[14.5px] font-semibold uppercase tracking-wide">📸 Photos de progression</p>
      <p className="mt-1 text-[12.5px] leading-relaxed text-muted">
        Même pose, même lumière, ~1×/mois. Les photos restent sur CET appareil — jamais envoyées nulle part.
      </p>

      {photos.length >= 2 && first && last && (
        <div className="mt-2.5">
          <div className="flex gap-2">
            <figure className="m-0 min-w-0 flex-1">
              <img src={first.dataUrl} alt={`Photo du ${fmtDate(first.date)}`} className="w-full rounded-[10px] border border-line" />
              <figcaption className="mt-1 text-center text-[11px] text-muted">Avant · {fmtDate(first.date)}</figcaption>
            </figure>
            <figure className="m-0 min-w-0 flex-1">
              <img src={last.dataUrl} alt={`Photo du ${fmtDate(last.date)}`} className="w-full rounded-[10px] border border-accent" />
              <figcaption className="mt-1 text-center text-[11px] text-accent">Maintenant · {fmtDate(last.date)}</figcaption>
            </figure>
          </div>
        </div>
      )}

      {photos.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-2">
          {photos.map((p) => (
            <div key={p.id} className="relative">
              <img src={p.dataUrl} alt={`Photo du ${fmtDate(p.date)}`} className="h-20 w-20 rounded-lg border border-line object-cover" />
              <button
                onClick={() => remove(p.id)}
                aria-label={`Supprimer la photo du ${fmtDate(p.date)}`}
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-line bg-surface2 text-[10px] text-muted"
              >
                ✕
              </button>
              <span className="block text-center text-[10px] text-muted">{fmtDate(p.date)}</span>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => fileRef.current?.click()}
        disabled={busy}
        className="mt-2.5 w-full rounded-[10px] border border-line px-4 py-2.5 text-sm text-muted disabled:opacity-50"
      >
        {busy ? 'Enregistrement…' : '＋ Ajouter une photo'}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) void onFile(f)
          e.target.value = ''
        }}
      />
      {err && <p className="mt-1.5 text-[12.5px] text-red">{err}</p>}
    </div>
  )
}
