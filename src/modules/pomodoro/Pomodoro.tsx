import { useEffect, useState } from 'react';

const formatTime=(seconds:number)=>`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;

export default function Pomodoro(){
  const [seconds,setSeconds]=useState(25*60);
  const [running,setRunning]=useState(false);
  const [sessions,setSessions]=useState(0);
  const [focus,setFocus]=useState('');

  useEffect(()=>{if(!running)return;const timer=window.setInterval(()=>setSeconds(value=>{if(value<=1){window.clearInterval(timer);setRunning(false);setSessions(total=>total+1);return 0}return value-1}),1000);return()=>window.clearInterval(timer)},[running]);
  const choose=(minutes:number)=>{setRunning(false);setSeconds(minutes*60)};
  const reset=()=>{setRunning(false);setSeconds(25*60)};

  return <section className="pomodoro-module">
    <article className="workout-hero pomodoro-hero"><div><b>FOCO COM LEVEZA</b><h3>Seu tempo de concentração</h3><p>Escolha uma tarefa, comece um ciclo e cuide de uma coisa de cada vez.</p></div><span>◷</span></article>
    <article className="card pomodoro-card pomodoro-workspace"><div className="pomodoro-head"><div><small>POMODORO</small><h3>{focus||'Hora de focar'}</h3></div><span>{sessions} sessão(ões) concluída(s)</span></div><div className="pomodoro-clock"><b>{formatTime(seconds)}</b><small>{running?'foco em andamento':'pronta para começar'}</small></div><div className="pomodoro-presets">{[25,15,5].map(minutes=><button type="button" className={seconds===minutes*60&&!running?'selected':''} key={minutes} onClick={()=>choose(minutes)}>{minutes} min</button>)}</div><label className="pomodoro-focus">No que você quer focar?<input value={focus} onChange={event=>setFocus(event.target.value)} placeholder="Ex.: responder mensagens"/></label><div className="pomodoro-actions"><button type="button" onClick={reset} aria-label="Reiniciar Pomodoro">↻</button><button type="button" className="primary" onClick={()=>setRunning(value=>!value)}>{running?'Pausar foco':'Começar foco'} ▶</button></div></article>
    <p className="pomodoro-tip">Dica: quando o ciclo terminar, faça uma pausa breve antes de começar o próximo.</p>
  </section>;
}