import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Capacitor } from '@capacitor/core'
import { Keyboard } from '@capacitor/keyboard'
import './index.css'
import App from './App.tsx'

// A new deployment can replace hashed lazy-loaded files while an older app
// shell is still open. Reload once to retrieve the matching entry bundle.
const recoverFromStaleChunk = (reason: unknown) => {
  const message = reason instanceof Error ? reason.message : String(reason ?? '')
  if (!/failed to fetch dynamically imported module|importing a module script failed/i.test(message)) return
  const recoveryKey = 'essence:stale-chunk-recovery'
  if (sessionStorage.getItem(recoveryKey)) return
  sessionStorage.setItem(recoveryKey, '1')
  window.location.reload()
}
window.addEventListener('error', event => recoverFromStaleChunk(event.error ?? event.message))
window.addEventListener('unhandledrejection', event => recoverFromStaleChunk(event.reason))

// The sleep navigation is rendered by a lazy module. Apply the selected state
// directly to the element as well, so late-loaded generic button styles cannot
// erase the active tab while its horizontal list is being scrolled.
const syncSleepTabAppearance = () => {
  document.querySelectorAll<HTMLButtonElement>('.sleep-navigation .sleep-tabs button').forEach(button => {
    const selected = button.classList.contains('selected')
    button.style.setProperty('background', selected ? '#b45d72' : '#fff', 'important')
    button.style.setProperty('border-color', selected ? '#b45d72' : '#eadbd8', 'important')
    button.style.setProperty('color', selected ? '#fff' : '#59403c', 'important')
    button.style.setProperty('-webkit-text-fill-color', selected ? '#fff' : '#59403c', 'important')
  })
}
const sleepTabObserver = new MutationObserver(syncSleepTabAppearance)
sleepTabObserver.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] })
syncSleepTabAppearance()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// On Android tablets the WebView stays at its full height. When the native
// keyboard appears, scroll the active field into the visible area ourselves.
let keyboardHeight = 0
const revealActiveField = () => {
  const active = document.activeElement
  if (!(active instanceof HTMLElement) || !active.matches('input, textarea, select, [contenteditable="true"]')) return
  window.setTimeout(() => {
    const rect = active.getBoundingClientRect()
    const safeTop = 72
    const safeBottom = window.innerHeight - keyboardHeight - 20
    const offset = rect.top < safeTop ? rect.top - safeTop : rect.bottom - safeBottom
    if (offset > 0) window.scrollBy({ top: offset, behavior: 'smooth' })
  }, 140)
}
document.addEventListener('focusin', revealActiveField)
window.visualViewport?.addEventListener('resize', revealActiveField)

if (Capacitor.isNativePlatform()) {
  Keyboard.addListener('keyboardDidShow', ({ keyboardHeight: height }) => {
    keyboardHeight = height
    document.documentElement.style.setProperty('--essence-keyboard-height', `${height}px`)
    document.body.classList.add('keyboard-open')
    revealActiveField()
  })
  Keyboard.addListener('keyboardDidHide', () => {
    keyboardHeight = 0
    document.documentElement.style.removeProperty('--essence-keyboard-height')
    document.body.classList.remove('keyboard-open')
  })
}

const notificationAction = new URLSearchParams(window.location.search).get('notificationAction')
if (notificationAction) {
  window.history.replaceState({}, '', window.location.pathname)
  window.setTimeout(() => {
    const messages: Record<string, string> = {
      complete: 'A notificação pediu confirmação de uma ação. Abra a agenda para revisar.',
      snooze: 'O lembrete será sinalizado como adiado por 10 minutos.',
      water: 'Confirme o registro de 250 ml de água no seu dia.',
    }
    if (!window.confirm(messages[notificationAction] || 'Confirme a ação recebida.')) return
    if (notificationAction === 'water') {
      let entries: { id: string; date: string; time: string; ml: number }[] = []
      try {
        const saved = JSON.parse(localStorage.getItem('essence:water-entries') || '[]')
        if (Array.isArray(saved)) entries = saved
      } catch {}
      const date = new Date().toISOString().slice(0, 10)
      entries.unshift({ id: crypto.randomUUID(), date, time: new Date().toTimeString().slice(0, 5), ml: 250 })
      localStorage.setItem('essence:water-entries', JSON.stringify(entries))
      localStorage.setItem('essence:water', String(entries.filter(entry => entry.date === date).reduce((sum, entry) => sum + entry.ml, 0)))
    }
    if (notificationAction === 'snooze') localStorage.setItem('essence:last-snoozed-notification', new Date().toISOString())
    if (notificationAction === 'complete') window.location.assign('/app?focus=agenda')
  }, 250)
}
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js?rev=essence-life-v53-chunk-recovery').catch(() => undefined)
  })
}
