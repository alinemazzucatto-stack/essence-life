import { useEffect, useState } from 'react';
import './Pomodoro.css';

const formatTime=(seconds:number)=>`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;
const presets:[number,string,'focus'|'short'|'long'][]=[[5,'Pausa curta','short'],[15,'Pausa longa','long'],[25,'Foco','focus']];
const RADIUS=45;
const CIRCUMFERENCE=2*Math.PI*RADIUS;
function LeafSprig({className}:{className:string}){return <svg className={className} viewBox="0 0 100 150" aria-hidden="true"><path d="M18 145C42 110 56 76 62 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/><path d="M38 106C18 102 10 88 13 69c19 4 28 17 25 37ZM49 79C32 75 25 61 29 44c17 4 24 16 20 35ZM61 51C45 44 43 29 50 15c15 8 18 21 11 36ZM50 116c18-2 29-13 31-31-18 0-29 11-31 31ZM58 88c17-2 27-13 28-29-16 0-26 11-28 29Z" fill="currentColor"/></svg>}
function PresetIcon({kind}:{kind:'focus'|'short'|'long'}){if(kind==='focus')return <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="10"/><circle cx="16" cy="16" r="4"/><path d="M16 2v5M16 25v5M2 16h5M25 16h5"/></svg>;if(kind==='short')return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M7 10h18v8a8 8 0 0 1-8 8h-2a8 8 0 0 1-8-8v-8Z"/><path d="M25 13h2a3 3 0 0 1 0 6h-2M11 6h3M18 6h3"/></svg>;return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 4 8 15h5l-6 8h18l-6-8h5L16 4Z"/><path d="M16 23v5"/></svg>}

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
  const markerX=50+RADIUS*Math.sin(2*Math.PI*progress);
  const markerY=50-RADIUS*Math.cos(2*Math.PI*progress);

  return <section className="pomodoro-module">
    <article className="workout-hero pomodoro-hero"><div className="pomodoro-hero-art" aria-hidden="true"><LeafSprig className="pomodoro-coral-sprig"/></div><div className="pomodoro-hero-copy"><b>FOCO COM LEVEZA</b><p>Escolha uma tarefa, comece um ciclo<br className="pomodoro-desktop-break"/> e cuide de uma coisa de cada vez.</p></div><LeafSprig className="pomodoro-hero-branch"/></article>
    <article className="card pomodoro-card pomodoro-workspace">
      <div className="pomodoro-head">
        <div className="pomodoro-title"><small>POMODORO</small><h3>{focus||'Hora de focar'}</h3><strong>{sessions?`${sessions} ${sessions===1?'sessão concluída':'sessões concluídas'}`:'Nenhuma sessão ainda'}</strong></div>
        <div className="pomodoro-sessions" aria-label={`${sessions} sessão(ões) concluída(s)`}>
          {sessions>0?<>{Array.from({length:Math.min(sessions,6)}).map((_,index)=><i key={index} className="pomodoro-session-dot"/>)}{sessions>6&&<small>+{sessions-6}</small>}</>:<small>Nenhuma sessão ainda</small>}
        </div>
      </div>
      <div className="pomodoro-clock"><LeafSprig className="pomodoro-clock-branch"/>
        <svg className="pomodoro-ring" viewBox="0 0 100 100" aria-hidden="true">
          <circle className="pomodoro-ring-track" cx="50" cy="50" r={RADIUS}/>
          <circle className="pomodoro-ring-fill" cx="50" cy="50" r={RADIUS} style={{strokeDasharray:CIRCUMFERENCE,strokeDashoffset:dashOffset}}/><circle className="pomodoro-ring-marker" cx={markerX} cy={markerY} r="4.5"/>
        </svg>
        <b>{formatTime(seconds)}</b><small>{running?'foco em andamento':'pronta para começar'}</small>
      </div>
      <div className="pomodoro-presets">{presets.map(([minutes,label,kind])=><button type="button" className={total===minutes*60?'selected':''} key={minutes} onClick={()=>choose(minutes)}><i className="pomodoro-preset-icon"><PresetIcon kind={kind}/></i><span><b>{label}</b><strong>{minutes} min</strong></span></button>)}</div>
      <label className="pomodoro-focus"><span>No que você quer focar?</span><div><i aria-hidden="true">⌕</i><input value={focus} onChange={event=>setFocus(event.target.value)} placeholder="Ex.: responder mensagens" aria-label="No que você quer focar?"/></div></label>
      <div className="pomodoro-actions"><button type="button" onClick={reset} aria-label="Reiniciar Pomodoro">↻</button><button type="button" className="primary" onClick={()=>setRunning(value=>!value)}>{running?'Pausar foco':'Começar foco'} <span aria-hidden="true">▶</span></button></div>
      <div className="pomodoro-tip"><i aria-hidden="true">✧</i><span>Dica: quando o ciclo terminar, faça uma pausa breve antes de começar o próximo.</span></div>
    </article>
  </section>;
}
