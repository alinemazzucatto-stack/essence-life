import './CycleInsights.css';
import botanical from '../../assets/cycle-insights-botanical.png';

type Entry = { id: string; date: string; flow: string; symptoms: string[] };
type Symptom = { name: string; count: number };
type Props = { entries: Entry[]; cycleLength: number; cycleDay: number; phase: string; hasReference: boolean; symptoms: Symptom[]; suggestions: string[] };
type IconName = 'calendar' | 'drop' | 'bolt' | 'head' | 'sad';

function CycleIcon({ name }: { name: IconName }) {
  if (name === 'calendar') return <svg viewBox="0 0 24 24" fill="none"><rect x="4" y="5.5" width="16" height="14" rx="3" stroke="currentColor" strokeWidth="1.9"/><path d="M8 3.5v4M16 3.5v4M4 10h16" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"/></svg>;
  if (name === 'drop') return <svg viewBox="0 0 24 24"><path d="M12 3.3C9 7 6.4 10.2 6.4 13.6a5.6 5.6 0 1 0 11.2 0C17.6 10.2 15 7 12 3.3Z" fill="currentColor"/></svg>;
  if (name === 'bolt') return <svg viewBox="0 0 24 24"><path d="m13.7 2.8-8.1 10h5l-1 8.4 8.9-11h-5.1l.3-7.4Z" fill="currentColor"/></svg>;
  if (name === 'head') return <svg viewBox="0 0 24 24" fill="none"><path d="M12.2 3.7a6.8 6.8 0 0 0-3.6 12.5v2.1h6.5v-2.6a6.8 6.8 0 0 0-2.9-12Z" stroke="currentColor" strokeWidth="1.8"/><path d="M9.1 21h5.6M10.3 18.3h3.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
  return <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="7.6" stroke="currentColor" strokeWidth="1.8"/><path d="M9 10h.01M15 10h.01M8.8 16c1.9-2.1 4.5-2.1 6.4 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
}

function Sprig() { return <svg viewBox="0 0 70 90" fill="none"><path d="M14 85C25 61 37 36 57 8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/><path d="M27 59c-13 0-20-7-21-17 13 0 20 6 21 17ZM38 43c1-13 8-20 20-22-1 13-7 20-20 22ZM20 73C10 73 4 68 3 59c11 0 17 5 17 14Z" fill="currentColor" opacity=".72"/></svg>; }

const fallbackSymptoms = [
  { name: 'Cólicas', icon: 'bolt' as const, value: 62 }, { name: 'Inchaço', icon: 'drop' as const, value: 48 },
  { name: 'Dor de cabeça', icon: 'head' as const, value: 38 }, { name: 'Sensibilidade', icon: 'sad' as const, value: 35 },
];

export default function CycleInsights({ entries, cycleLength, hasReference, symptoms, suggestions }: Props) {
  const total = Math.max(entries.length, 1);
  const flowDays = entries.filter(entry => entry.flow !== 'Sem fluxo').length;
  const menstruationDays = flowDays || 5;
  const regularity = hasReference ? 'Regular' : 'Em acompanhamento';
  const care = suggestions.length ? suggestions.slice(0, 3) : ['Chá de conforto', 'Exercício leve', 'Rotina de descanso'];
  const symptomCards = fallbackSymptoms.map((item, index) => { const actual = symptoms[index]; const value = actual ? Math.max(1, Math.round(actual.count / total * 100)) : item.value; return { ...item, name: actual?.name || item.name, value }; });
  return <section className="cycle-insights-view">
    <header className="cycle-insights-intro"><div><h2>Seus insights do ciclo</h2><p>Entenda seus padrões e receba recomendações personalizadas.</p></div><img src={botanical} alt="" aria-hidden="true" /></header>
    <section className="cycle-insights-summary">
      <article className="cycle-insights-regularity"><span className="cycle-insights-icon calendar"><CycleIcon name="calendar" /></span><div><b>Seu ciclo é</b><h3>{regularity}</h3><p>Seus ciclos têm se mantido estáveis nos últimos meses.</p></div><i className="cycle-insights-sprig"><Sprig /></i></article>
      <article className="cycle-insights-duration"><div className="cycle-insights-ring"><b>{cycleLength}</b><span>dias</span></div><div><b>Duração média <span>ⓘ</span><br/>do ciclo</b><p>Varia entre<br/>{Math.max(21, cycleLength - 1)} e {cycleLength + 2} dias</p></div></article>
      <article className="cycle-insights-flow"><span className="cycle-insights-icon flow"><CycleIcon name="drop" /></span><div><b>Duração da<br/>menstruação</b><strong>{menstruationDays} dias</strong><p>Varia entre 4 e 6 dias</p></div></article>
    </section>
    <article className="cycle-insights-pattern"><div className="cycle-section-title"><div><h3>Como você se sente ao longo do ciclo</h3><p>Média dos seus registros dos últimos 3 ciclos.</p></div></div><div className="cycle-pattern-plot"><div className="cycle-pattern-scale"><span>Alta</span><span>Média</span><span>Baixa</span></div><div className="cycle-pattern-lines"><div className="cycle-phase-band menstrual">Menstruação</div><div className="cycle-phase-band follicular">Fase folicular</div><div className="cycle-phase-band ovulation">Ovulação</div><div className="cycle-phase-band luteal">Fase lútea</div><svg viewBox="0 0 600 130" preserveAspectRatio="none" aria-hidden="true"><path className="energy" d="M0 78 C45 65 72 92 112 70 S178 56 220 76 S280 62 320 73 S382 96 424 54 S490 35 530 61 S575 70 600 56"/><path className="mood" d="M0 96 C45 70 76 102 112 91 S180 87 220 95 S278 60 320 86 S384 68 424 81 S490 97 530 90 S575 62 600 75"/><path className="sensitivity" d="M0 100 C48 105 76 84 112 95 S180 100 220 82 S275 84 320 69 S380 44 424 70 S488 72 530 84 S574 58 600 72"/><path className="rest" d="M0 83 C45 82 76 61 112 78 S180 96 220 90 S278 80 320 92 S382 105 424 90 S490 72 530 98 S575 80 600 88"/></svg></div></div><div className="cycle-pattern-key"><span className="energy">Energia</span><span className="mood">Humor</span><span className="sensitivity">Sensibilidade</span><span className="rest">Descanso</span></div></article>
    <article className="cycle-insights-symptoms"><div className="cycle-section-title"><div><h3>Sintomas mais recorrentes</h3><p>Com base nos seus últimos registros.</p></div><button type="button">Ver todos <i>›</i></button></div><div className="cycle-symptom-cards">{symptomCards.map(item => <article key={item.name}><span><CycleIcon name={item.icon} /></span><div><b>{item.name}</b><strong>{item.value}%</strong></div><i><em style={{ width: `${item.value}%` }} /></i></article>)}</div></article>
    <article className="cycle-insights-recommendations"><div className="cycle-section-title"><div><h3>Recomendações para você</h3><p>Com base nos seus padrões e sintomas mais frequentes.</p></div></div><div>{care.map((item, index) => <button key={item} type="button"><span>{['☕', '🏋', '✦'][index]}</span><div><b>{item}</b><small>{index === 0 ? 'Pode ajudar a aliviar as cólicas e o inchaço.' : index === 1 ? 'Ajuda a reduzir o estresse e melhora o humor.' : 'Priorize uma boa noite de sono na fase lútea para equilibrar a energia.'}</small></div><i>›</i></button>)}</div></article>
  </section>;
}
