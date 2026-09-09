import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Local-only dev fallback for /api/* routes that in production run as
// Cloudflare Pages Functions (see worker/api.js). `npm run dev` only starts
// Vite, so these endpoints are unreachable while developing locally and any
// call to them fails client-side with "Unexpected end of JSON input". This
// plugin answers /api/routine/generate with the same template-based fallback
// the real worker uses when the AI call is unavailable, so the feature can be
// exercised locally without an OPENAI_API_KEY or a worker running alongside.
function localApiFallback() {
  return {
    name: 'local-api-fallback',
    configureServer(server: import('vite').ViteDevServer) {
      server.middlewares.use('/api/routine/generate', (req, res, next) => {
        if (req.method !== 'POST') return next()
        const templates = [
          { name: 'Planejar as prioridades do dia', time: '08:00', category: 'Pessoal', duration: '00:10', notes: 'Escolha até três prioridades possíveis.' },
          { name: 'Pausa para movimento', time: '12:30', category: 'Saúde', duration: '00:20', notes: 'Movimente-se no seu ritmo.' },
          { name: 'Organizar um pequeno espaço', time: '18:30', category: 'Casa', duration: '00:15', notes: 'Escolha apenas uma área.' },
          { name: 'Preparar o descanso', time: '21:30', category: 'Saúde', duration: '00:20', notes: 'Reduza estímulos e desacelere.' },
        ]
        const codes = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM']
        const groups = codes.map((day, index) => ({
          day,
          items: templates
            .filter((_, i) => i === 0 || i === 3 || (index + i) % 3 === 0)
            .map((item, i) => ({
              ...item,
              id: `smart-routine-${Date.now()}-${index}-${i}`,
              days: [day],
              reminderEnabled: false,
              reminderTime: item.time,
              done: false,
            })),
        }))
        res.setHeader('content-type', 'application/json')
        res.end(JSON.stringify({
          summary: 'IA local de desenvolvimento: criamos uma semana-base leve pra você testar a tela, sem substituir seus compromissos atuais.',
          groups,
          fallback: true,
        }))
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), localApiFallback()],
})
