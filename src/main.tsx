import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Capacitor } from '@capacitor/core'
import { Keyboard } from '@capacitor/keyboard'
import './index.css'
import App from './App.tsx'

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
    navigator.serviceWorker.register('/sw.js?rev=essence-life-v50-module-refresh').catch(() => undefined)
  })
}
