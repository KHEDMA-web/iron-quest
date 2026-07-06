const OPT_KEY = 'ironquest-reminders'
const SENT_KEY = 'ironquest-reminders-sent'

export const remindersSupported = () => typeof Notification !== 'undefined'

export const remindersEnabled = () => {
  try {
    return remindersSupported() && Notification.permission === 'granted' && localStorage.getItem(OPT_KEY) === '1'
  } catch {
    return false
  }
}

export async function enableReminders(): Promise<boolean> {
  if (!remindersSupported()) return false
  const perm = await Notification.requestPermission()
  if (perm !== 'granted') return false
  try {
    localStorage.setItem(OPT_KEY, '1')
  } catch {
    return false
  }
  return true
}

export function disableReminders() {
  try {
    localStorage.removeItem(OPT_KEY)
  } catch {
    // rien à faire
  }
}

/** Une seule notification par type et par jour. */
function alreadySent(type: string, dayKey: string): boolean {
  try {
    const sent = JSON.parse(localStorage.getItem(SENT_KEY) || '{}')
    if (sent[type] === dayKey) return true
    sent[type] = dayKey
    localStorage.setItem(SENT_KEY, JSON.stringify(sent))
    return false
  } catch {
    return true
  }
}

export interface ReminderState {
  dayKey: string
  weekKey: string
  isTrainDay: boolean
  doneToday: boolean
  weekWeighIn: boolean
  sessionName: string
}

/** Vérifie l'état du jour à l'ouverture et notifie ce qui reste à faire. */
export function checkReminders(s: ReminderState) {
  if (!remindersEnabled()) return
  if (s.isTrainDay && !s.doneToday && !alreadySent('workout', s.dayKey)) {
    new Notification('IRON QUEST — jour de séance ⚔️', {
      body: `${s.sessionName} t'attend. +50 XP à la clé.`,
      icon: '/pwa-192.png',
    })
  }
  if (!s.weekWeighIn && !alreadySent('weighin', s.weekKey)) {
    new Notification('IRON QUEST — pesée hebdo ⚖️', {
      body: 'Pas encore de pesée cette semaine. Le matin à jeun, +30 XP.',
      icon: '/pwa-192.png',
    })
  }
}
