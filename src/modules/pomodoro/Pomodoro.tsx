import { useEffect, useState } from 'react';

const formatTime=(seconds:number)=>`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;
const presets:[number,string,string][]=[[25,'Foco','◎'],[5,'Pausa curta','▱'],[15,'Pausa longa','♧']];
const RADIUS=45;
const CIRCUMFERENCE=2*Math.PI*RADIUS;

export default function Pomodoro(){
  const [total,setTotal]=useState(25*60);
  const [seconds,setSeconds]=useState(25*60);
  const [running,setRunning]=useState(false);
  const [sessions,setSessions]=useState(0);
  const [focus,setFocus]=useState('');

  useEffect(()=>{if(!running)return;const timer=window.setInterval(()=>setSeconds(value=>{if(value<=1){window.clearInterval(timer);setRunning(false);setSessions(total=>total+1);return 0}return value-1}),1000);return()=>window.clearInterval(timer)},[running]);
  const choose=(minutes:number)=>{setRunning(false);setTotal(minutes*60);setSeconds(minutes*60)};
  const reset=()=>{setRunning(false);setSeconds(total)};
  const progress=total>0?Math.min(1,Math.max(0,(total-seconds)/total)):0;
  const dashOffset=CIRCUMFERENCE*(1-progress);

  return <section className="pomodoro-module">
    <article className="workout-hero pomodoro-hero"><div className="pomodoro-hero-art" aria-hidden="true"><img src="/home-peace-flower-reference.svg" alt=""/></div><div className="pomodoro-hero-copy"><b>FOCO COM LEVEZA</b><p>Escolha uma tarefa, comece um ciclo<br className="pomodoro-desktop-break"/> e cuide de uma coisa de cada vez.</p></div><img className="pomodoro-hero-branch" src="/home-peace-flower-reference.svg" alt="" aria-hidden="true"/></article>
    <article className="card pomodoro-card pomodoro-workspace">
      <div className="pomodoro-head">
        <div className="pomodoro-title"><small>POMODORO</small><h3>{focus||'Hora de focar'}</h3><strong>{sessions?`${sessions} ${sessions===1?'sessão concluída':'sessões concluídas'}`:'Nenhuma sessão ainda'}</strong></div>
        <div className="pomodoro-sessions" aria-label={`${sessions} sessão(ões) concluída(s)`}>
          {sessions>0?<>{Array.from({length:Math.min(sessions,6)}).map((_,index)=><i key={index} className="pomodoro-session-dot"/>)}{sessions>6&&<small>+{sessions-6}</small>}</>:<small>Nenhuma sessão ainda</small>}
        </div>
      </div>
      <div className="pomodoro-clock">
        <svg className="pomodoro-ring" viewBox="0 0 100 100" aria-hidden="true">
          <circle className="pomodoro-ring-track" cx="50" cy="50" r={RADIUS}/>
          <circle className="pomodoro-ring-fill" cx="50" cy="50" r={RADIUS} style={{strokeDasharray:CIRCUMFERENCE,strokeDashoffset:dashOffset}}/>
        </svg>
        <b>{formatTime(seconds)}</b><small>{running?'foco em andamento':'pronta para começar'}</small>
      </div>
      <div className="pomodoro-presets">{presets.map(([minutes,label,icon])=><button type="button" className={total===minutes*60?'selected':''} key={minutes} onClick={()=>choose(minutes)}><i aria-hidden="true">{icon}</i><span><b>{label}</b><strong>{minutes} min</strong></span></button>)}</div>
      <label className="pomodoro-focus"><span>No que você quer focar?</span><div><i aria-hidden="true">⌕</i><input value={focus} onChange={event=>setFocus(event.target.value)} placeholder="Ex.: responder mensagens" aria-label="No que você quer focar?"/></div></label>
      <div className="pomodoro-actions"><button type="button" onClick={reset} aria-label="Reiniciar Pomodoro">↻</button><button type="button" className="primary" onClick={()=>setRunning(value=>!value)}>{running?'Pausar foco':'Começar foco'} <span aria-hidden="true">▶</span></button></div>
      <div className="pomodoro-tip"><i aria-hidden="true">✧</i><span>Dica: quando o ciclo terminar, faça uma pausa breve antes de começar o próximo.</span></div>
    </article>
  </section>;
}
