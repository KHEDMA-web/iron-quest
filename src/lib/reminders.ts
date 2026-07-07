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

function wasSent(type: string, key: string): boolean {
  try {
    return JSON.parse(localStorage.getItem(SENT_KEY) || '{}')[type] === key
  } catch {
    return true
  }
}

function markSent(type: string, key: string) {
  try {
    const sent = JSON.parse(localStorage.getItem(SENT_KEY) || '{}')
    sent[type] = key
    localStorage.setItem(SENT_KEY, JSON.stringify(sent))
  } catch {
    // rien à faire
  }
}

/**
 * Affiche une notification sans jamais lever d'exception.
 * Sur Android Chrome, `new Notification()` en contexte page lève « Illegal
 * constructor » : il faut passer par le service worker (showNotification).
 */
async function show(title: string, body: string): Promise<boolean> {
  const options = { body, icon: '/pwa-192.png' }
  try {
    const reg = await navigator.serviceWorker?.getRegistration()
    if (reg) {
      await reg.showNotification(title, options)
      return true
    }
  } catch {
    // on tente le constructeur page ci-dessous
  }
  try {
    new Notification(title, options)
    return true
  } catch {
    return false
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

/** Vérifie l'état du jour à l'ouverture et notifie ce qui reste à faire (max 1/jour par type). */
export async function checkReminders(s: ReminderState) {
  if (!remindersEnabled()) return
  if (s.isTrainDay && !s.doneToday && !wasSent('workout', s.dayKey)) {
    if (await show('IRON QUEST — jour de séance ⚔️', `${s.sessionName} t'attend. +50 XP à la clé.`)) {
      markSent('workout', s.dayKey)
    }
  }
  if (!s.weekWeighIn && !wasSent('weighin', s.weekKey)) {
    if (await show('IRON QUEST — pesée hebdo ⚖️', 'Pas encore de pesée cette semaine. Le matin à jeun, +30 XP.')) {
      markSent('weighin', s.weekKey)
    }
  }
}
