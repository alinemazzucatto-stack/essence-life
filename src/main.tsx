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

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js?rev=rose-v36').catch(() => undefined)
  })
}