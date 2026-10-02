import { useState } from 'react';
import './CycleInsights.css';
import botanical from '../../assets/cycle-insights-botanical.png';

type Entry = { id: string; date: string; flow: string; symptoms: string[] };
type Symptom = { name: string; count: number };
type Props = { entries: Entry[]; cycleLength: number; cycleDay: number; phase: string; hasReference: boolean; symptoms: Symptom[]; suggestions: string[] };
type IconName = 'calendar' | 'drop' | 'bolt' | 'head' | 'sad' | 'flower' | 'heart';

function CycleIcon({ name }: { name: IconName }) {
  if (name === 'calendar') return <svg viewBox="0 0 24 24" fill="none"><rect x="4" y="5.5" width="16" height="14" rx="3" stroke="currentColor" strokeWidth="1.9"/><path d="M8 3.5v4M16 3.5v4M4 10h16" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"/></svg>;
  if (name === 'drop') return <svg viewBox="0 0 24 24"><path d="M12 3.3C9 7 6.4 10.2 6.4 13.6a5.6 5.6 0 1 0 11.2 0C17.6 10.2 15 7 12 3.3Z" fill="currentColor"/></svg>;
  if (name === 'bolt') return <svg viewBox="0 0 24 24"><path d="m13.7 2.8-8.1 10h5l-1 8.4 8.9-11h-5.1l.3-7.4Z" fill="currentColor"/></svg>;
  if (name === 'head') return <svg viewBox="0 0 24 24" fill="none"><path d="M12.2 3.7a6.8 6.8 0 0 0-3.6 12.5v2.1h6.5v-2.6a6.8 6.8 0 0 0-2.9-12Z" stroke="currentColor" strokeWidth="1.8"/><path d="M9.1 21h5.6M10.3 18.3h3.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
  if (name === 'flower') return <svg viewBox="0 0 24 24"><g fill="currentColor"><ellipse cx="12" cy="5.6" rx="3.2" ry="4.2"/><ellipse cx="18.2" cy="9.2" rx="3.2" ry="4.2" transform="rotate(60 18.2 9.2)"/><ellipse cx="18.2" cy="15.4" rx="3.2" ry="4.2" transform="rotate(120 18.2 15.4)"/><ellipse cx="12" cy="18.4" rx="3.2" ry="4.2"/><ellipse cx="5.8" cy="15.4" rx="3.2" ry="4.2" transform="rotate(60 5.8 15.4)"/><ellipse cx="5.8" cy="9.2" rx="3.2" ry="4.2" transform="rotate(120 5.8 9.2)"/></g><circle cx="12" cy="12" r="2.5" fill="#fff8fb"/></svg>;
  if (name === 'heart') return <svg viewBox="0 0 24 24"><path d="M12 20.2 4.4 13a5 5 0 0 1 7.1-7L12 6.5l.5-.5a5 5 0 0 1 7.1 7L12 20.2Z" fill="currentColor"/></svg>;
  return <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="7.6" stroke="currentColor" strokeWidth="1.8"/><path d="M9 10h.01M15 10h.01M8.8 16c1.9-2.1 4.5-2.1 6.4 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
}

function Sprig() { return <svg viewBox="0 0 70 90" fill="none"><path d="M14 85C25 61 37 36 57 8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/><path d="M27 59c-13 0-20-7-21-17 13 0 20 6 21 17ZM38 43c1-13 8-20 20-22-1 13-7 20-20 22ZM20 73C10 73 4 68 3 59c11 0 17 5 17 14Z" fill="currentColor" opacity=".72"/></svg>; }

function CareIcon({ name }: { name: 'tea' | 'exercise' | 'rest' }) {
  if (name === 'tea') return <svg viewBox="0 0 24 24" fill="none"><path d="M5 10h12v4.5a4.5 4.5 0 0 1-4.5 4.5h-3A4.5 4.5 0 0 1 5 14.5V10Z" fill="currentColor"/><path d="M17 11h1.2a2.3 2.3 0 0 1 0 4.6H17M4 21h15M9 7c-1-1.3 1-2.4 0-3.8M13 7c-1-1.3 1-2.4 0-3.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>;
  if (name === 'exercise') return <svg viewBox="0 0 24 24" fill="none"><path d="M3 9v6M6 7v10M18 7v10M21 9v6M6 12h12" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"/></svg>;
  return <svg viewBox="0 0 24 24"><path d="M12 20.7c-4.1 0-7.5-2.7-8.7-6.4 3.5-.4 6.7.9 8.7 3.3-1.1-4-3.5-6.6-6.7-8.3 3.8-.1 7.1 1.6 8.7 4.4 1.1-4.1 3.4-6.8 6.7-8.3-.1 4.4-1.7 8.1-4.7 10.4 1.9-.8 4-1 5.9-.5-1.4 3.2-4.4 5.4-8 5.4H12Z" fill="currentColor"/></svg>;
}

const fallbackSymptoms = [
  { name: 'Cólicas', icon: 'bolt' as const, value: 62 }, { name: 'Inchaço', icon: 'drop' as const, value: 48 },
  { name: 'Dor de cabeça', icon: 'head' as const, value: 38 }, { name: 'Sensibilidade', icon: 'sad' as const, value: 35 },
];

export default function CycleInsights({ entries, cycleLength, hasReference, symptoms }: Props) {
  const total = Math.max(entries.length, 1);
  const flowDays = entries.filter(entry => entry.flow !== 'Sem fluxo').length;
  const menstruationDays = flowDays || 5;
  const regularity = hasReference ? 'Regular' : 'Em acompanhamento';
  const care = [['Chá de conforto', 'Pode ajudar a aliviar as cólicas e o inchaço.', 'tea'], ['Exercício leve', 'Ajuda a reduzir o estresse e melhora o humor.', 'exercise'], ['Rotina de descanso', 'Priorize uma boa noite de sono na fase lútea para equilibrar a energia.', 'rest']] as const;
  const [completedCare, setCompletedCare] = useState<string[]>([]);
  const symptomCards = fallbackSymptoms.map((item, index) => { const actual = symptoms[index]; const value = actual ? Math.max(1, Math.round(actual.count / total * 100)) : item.value; return { ...item, name: actual?.name || item.name, value }; });
  return <section className="cycle-insights-view">
    <header className="cycle-insights-intro"><div><h2>Seus insights do ciclo</h2><p>Entenda seus padrões e receba recomendações personalizadas.</p></div><img src={botanical} alt="" aria-hidden="true" /></header>
    <section className="cycle-insights-summary">
      <article className="cycle-insights-regularity"><span className="cycle-insights-icon calendar"><CycleIcon name="calendar" /></span><div><b>Seu ciclo é</b><h3>{regularity}</h3><p>Seus ciclos têm se mantido estáveis nos últimos meses.</p></div><i className="cycle-insights-sprig"><Sprig /></i></article>
      <article className="cycle-insights-duration"><div className="cycle-insights-ring"><b>{cycleLength}</b><span>dias</span></div><div><b>Duração média<br/>do ciclo</b><p>Varia entre<br/>{Math.max(21, cycleLength - 1)} e {cycleLength + 2} dias</p></div></article>
      <article className="cycle-insights-flow"><span className="cycle-insights-icon flow"><CycleIcon name="drop" /></span><div><b>Duração da<br/>menstruação</b><strong>{menstruationDays} dias</strong><p>Varia entre 4 e 6 dias</p></div></article>
      <article className="cycle-insights-metric cycle-insights-ovulation"><span className="cycle-insights-icon"><CycleIcon name="flower" /></span><div><b>Ovulação</b><strong>Dia 14</strong><p>Em média</p></div></article>
      <article className="cycle-insights-metric cycle-insights-luteal"><span className="cycle-insights-icon"><CycleIcon name="heart" /></span><div><b>Fase lútea</b><strong>{Math.max(10, cycleLength - 14)} dias</strong><p>Em média</p></div></article>
    </section>
    <article className="cycle-insights-symptoms"><div className="cycle-section-title"><div><h3>Sintomas mais recorrentes</h3><p>Com base nos seus últimos registros.</p></div><button type="button">Ver todos <i>›</i></button></div><div className="cycle-symptom-cards">{symptomCards.map(item => <article key={item.name}><span><CycleIcon name={item.icon} /></span><div><b>{item.name}</b><strong>{item.value}%</strong></div><i><em style={{ width: `${item.value}%` }} /></i></article>)}</div></article>
    <article className="cycle-insights-recommendations"><div className="cycle-section-title"><div><h3>Recomendações para você</h3><p>Com base nos seus padrões e sintomas mais frequentes.</p></div></div><div>{care.map(([title, description, icon]) => <button key={title} type="button" className={completedCare.includes(title)?'done':''} aria-pressed={completedCare.includes(title)} onClick={()=>setCompletedCare(all=>all.includes(title)?all.filter(item=>item!==title):[...all,title])}><span><CareIcon name={icon} /></span><div><b>{title}</b><small>{completedCare.includes(title)?'Marcado como feito.':description}</small></div><i>{completedCare.includes(title)?'✓':'›'}</i></button>)}</div></article>
  </section>;
}
