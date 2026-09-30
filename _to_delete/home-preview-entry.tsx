import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import '../src/App.css'
import Home from '../src/modules/home/Home'

function Harness(){
  const [quickCreate,setQuickCreate]=useState<'task'|'habit'|null>(null)
  const pendingTasks=[
    {id:'t1',title:'Enviar relatório',date:'2026-09-06',time:'14:30',category:'Trabalho',priority:'Alta',done:false},
    {id:'t2',title:'Ligar para o dentista',date:'2026-09-06',time:'',category:'Saúde',priority:'Normal',done:false},
  ]
  const pendingHabits=[
    {id:'h1',name:'Caminhar 20 minutos',time:'07:00',category:'Bem-estar',days:['SEG'],done:false},
  ]
  const completedTasks=[{id:'t3',title:'Tomar remédio',date:'2026-09-06',time:'08:00',category:'Saúde',priority:'Normal',done:true}]
  const completedHabits:any[]=[]
  const [navOpen,setNavOpen]=useState(false)
  const [page,setPage]=useState('home')
  return <div className="app">
    <header className="mobile-topbar">
      <button type="button" className="mobile-menu-button" onClick={()=>setNavOpen(v=>!v)} aria-expanded={navOpen} aria-label={navOpen?"Fechar menu":"Abrir menu"}><span aria-hidden="true">{navOpen?"×":"☰"}</span><small>{navOpen?"Fechar":"Menu"}</small></button>
      <button type="button" className="mobile-brand" onClick={()=>setPage('home')} aria-label="Ir para o início"><img src="/essence-life-logo.png" alt="" className="brand-logo"/><span><strong>Essence Life</strong><small>Seu bem-estar em equilíbrio</small></span></button>
      <span className="mobile-topbar-actions"><button type="button" className="mobile-bell-button" aria-label="Notificações"><span aria-hidden="true">🔔</span></button><button type="button" className="mobile-profile-button" aria-label="Abrir perfil"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg><i aria-hidden="true"/></button></span>
    </header>
    <aside style={{width:260,flexShrink:0,background:'#fff',borderRight:'1px solid #f1d8d4'}} /><main>
    <Home
      session={{name:'Aline'} as any}
      pendingHabits={pendingHabits as any}
      pendingTasks={pendingTasks as any}
      completedHabits={completedHabits as any}
      completedTasks={completedTasks as any}
      totalToday={4}
      completedToday={1}
      dayProgress={35}
      waterToday={500}
      quickCreate={quickCreate}
      setQuickCreate={setQuickCreate}
      openPage={()=>{}}
      registerHomeWater={()=>750}
      unregisterHomeWater={()=>250}
      completeHomeHabit={()=>{}}
      completeHomeTask={()=>{}}
      setHomeTasks={()=>{}}
      setHomeHabits={()=>{}}
    />
  </main>
    <nav className="mobile-bottom-nav" aria-label="Navegação principal">
      <button type="button" className={page==='home'?'active':''} onClick={()=>setPage('home')}><span>Início</span></button>
      <button type="button" className={page==='agenda'?'active':''} onClick={()=>setPage('agenda')}><span>Agenda</span></button>
      <button type="button" className="" onClick={()=>setPage('agenda')}><span>Tarefas</span></button>
      <button type="button" className={page==='routine'?'active':''} onClick={()=>setPage('routine')}><span>Hábitos</span></button>
      <button type="button" className={navOpen?'active':''} onClick={()=>setNavOpen(v=>!v)}><span>Mais</span></button>
    </nav>
  </div>
}

createRoot(document.getElementById('root')!).render(<StrictMode><Harness /></StrictMode>)
