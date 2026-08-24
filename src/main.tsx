import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Mantém qualquer campo nativo do Android acima do teclado virtual.
const revealActiveField = () => {
  const active = document.activeElement
  if (!(active instanceof HTMLElement) || !active.matches('input, textarea, select, [contenteditable="true"]')) return
  window.setTimeout(() => active.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' }), 120)
}
document.addEventListener('focusin', revealActiveField)
window.visualViewport?.addEventListener('resize', revealActiveField)

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js?rev=rose-v24').catch(() => undefined)
  })
}
