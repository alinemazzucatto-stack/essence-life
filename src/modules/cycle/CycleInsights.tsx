import './CycleInsights.css';
import botanical from '../../assets/cycle-insights-botanical.png';

type Entry = { id: string; date: string; flow: string; symptoms: string[] };
type Symptom = { name: string; count: number };
type Props = { entries: Entry[]; cycleLength: number; cycleDay: number; phase: string; hasReference: boolean; symptoms: Symptom[]; suggestions: string[] };

type IconName = 'calendar' | 'drop' | 'flower' | 'heart';

function CycleIcon({ name }: { name: IconName }) {
  if (name === 'calendar') return <svg viewBox="0 0 24 24" fill="none"><rect x="4" y="5.5" width="16" height="14" rx="3" stroke="currentColor" strokeWidth="1.9"/><path d="M8 3.5v4M16 3.5v4M4 10h16" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"/></svg>;
  if (name === 'drop') return <svg viewBox="0 0 24 24"><path d="M12 3.3C9 7 6.4 10.2 6.4 13.6a5.6 5.6 0 1 0 11.2 0C17.6 10.2 15 7 12 3.3Z" fill="currentColor"/></svg>;
  if (name === 'flower') return <svg viewBox="0 0 24 24"><g fill="currentColor"><ellipse cx="12" cy="5.6" rx="3.2" ry="4.2"/><ellipse cx="18.2" cy="9.2" rx="3.2" ry="4.2" transform="rotate(60 18.2 9.2)"/><ellipse cx="18.2" cy="15.4" rx="3.2" ry="4.2" transform="rotate(120 18.2 15.4)"/><ellipse cx="12" cy="18.4" rx="3.2" ry="4.2"/><ellipse cx="5.8" cy="15.4" rx="3.2" ry="4.2" transform="rotate(60 5.8 15.4)"/><ellipse cx="5.8" cy="9.2" rx="3.2" ry="4.2" transform="rotate(120 5.8 9.2)"/></g><circle cx="12" cy="12" r="2.5" fill="#fff8fb"/></svg>;
  return <svg viewBox="0 0 24 24"><path d="M12 20.2 4.4 13a5 5 0 0 1 7.1-7L12 6.5l.5-.5a5 5 0 0 1 7.1 7L12 20.2Z" fill="currentColor"/></svg>;
}

function Sprig() { return <svg viewBox="0 0 70 90" fill="none"><path d="M14 85C25 61 37 36 57 8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/><path d="M27 59c-13 0-20-7-21-17 13 0 20 6 21 17ZM38 43c1-13 8-20 20-22-1 13-7 20-20 22ZM20 73C10 73 4 68 3 59c11 0 17 5 17 14Z" fill="currentColor" opacity=".72"/></svg>; }

export default function CycleInsights({ entries, cycleLength, hasReference, symptoms, suggestions }: Props) {
  const total = Math.max(entries.length, 1);
  const flowDays = entries.filter(entry => entry.flow !== 'Sem fluxo').length;
  const mainSymptom = symptoms.find(item => item.count > 0);
  const menstruationDays = flowDays || 1;
  const regularity = hasReference ? 'Regular' : 'Em acompanhamento';
  const care = suggestions.length ? suggestions.slice(0, 3) : ['Chá de conforto', 'Respiração de 5 min', 'Compressa morna'];

  return <section className="cycle-insights-view">
    <header className="cycle-insights-intro">
      <div><h2>Seus insights do ciclo</h2><p>Entenda seus padrões e receba recomendações personalizadas.</p></div>
      <img src={botanical} alt="" aria-hidden="true" />
    </header>

    <section className="cycle-insights-hero">
      <article className="cycle-insights-regularity">
        <span className="cycle-insights-icon calendar"><CycleIcon name="calendar" /></span>
        <div><b>Seu ciclo é</b><h3>{regularity}</h3><p>Seus ciclos têm se mantido estáveis nos últimos meses.</p></div>
        <i className="cycle-insights-sprig"><Sprig /></i>
      </article>
      <article className="cycle-insights-duration">
        <div className="cycle-insights-ring"><b>{cycleLength}</b><span>dias</span></div>
        <div><b>Duração média<br/>do ciclo</b><p>Varia entre<br/>{Math.max(21, cycleLength - 1)} e {cycleLength + 2} dias</p></div>
      </article>
    </section>

    <section className="cycle-insights-metrics">
      <article><span className="cycle-insights-icon flow"><CycleIcon name="drop" /></span><div><small>Duração da<br/>menstruação</small><strong>{menstruationDays} {menstruationDays === 1 ? 'dia' : 'dias'}</strong><p>Varia entre 4 e 6 dias</p></div></article>
      <article><span className="cycle-insights-icon ovulation"><CycleIcon name="flower" /></span><div><small>Ovulação</small><strong>Dia 14</strong><p>Em média</p></div></article>
      <article><span className="cycle-insights-icon rest"><CycleIcon name="heart" /></span><div><small>Fase lútea</small><strong>{Math.max(10, cycleLength - 14)} dias</strong><p>Em média</p></div></article>
    </section>

    <article className="cycle-insights-pattern">
      <div className="cycle-section-title"><div><h3>Como você se sente ao longo do ciclo</h3><p>Com base nos seus registros mais recentes.</p></div></div>
      <div className="cycle-pattern-plot"><div className="cycle-pattern-scale"><span>Alta</span><span>Média</span><span>Baixa</span></div><div className="cycle-pattern-lines"><div className="cycle-phase-band menstrual">Menstruação</div><div className="cycle-phase-band follicular">Fase folicular</div><div className="cycle-phase-band ovulation">Ovulação</div><div className="cycle-phase-band luteal">Fase lútea</div><svg viewBox="0 0 600 130" preserveAspectRatio="none" aria-hidden="true"><path className="energy" d="M0 78 C45 65 72 92 112 70 S178 56 220 76 S280 62 320 73 S382 96 424 54 S490 35 530 61 S575 70 600 56"/><path className="mood" d="M0 96 C45 70 76 102 112 91 S180 87 220 95 S278 60 320 86 S384 68 424 81 S490 97 530 90 S575 62 600 75"/><path className="sensitivity" d="M0 100 C48 105 76 84 112 95 S180 100 220 82 S275 84 320 69 S380 44 424 70 S488 72 530 84 S574 58 600 72"/><path className="rest" d="M0 83 C45 82 76 61 112 78 S180 96 220 90 S278 80 320 92 S382 105 424 90 S490 72 530 98 S575 80 600 88"/></svg></div></div>
      <div className="cycle-pattern-key"><span className="energy">Energia</span><span className="mood">Humor</span><span className="sensitivity">Sensibilidade</span><span className="rest">Descanso</span></div>
    </article>

    <article className="cycle-insights-symptoms"><div className="cycle-section-title"><div><h3>Sintomas mais recorrentes</h3><p>Com base nos seus últimos registros.</p></div><button type="button">Ver todos ›</button></div><div className="cycle-symptom-cards"><article><span>ϟ</span><div><b>{mainSymptom?.name || 'Cólicas'}</b><strong>{mainSymptom ? Math.round(mainSymptom.count / total * 100) : 0}%</strong><small>dos registros</small></div><i><em style={{ width: `${mainSymptom ? Math.round(mainSymptom.count / total * 100) : 0}%` }} /></i></article></div></article>

    <article className="cycle-insights-recommendations"><div className="cycle-section-title"><div><h3>Recomendações para você</h3><p>Pequenos cuidados que combinam com o seu momento.</p></div></div><div>{care.map((item, index) => <button key={item} type="button"><span>{['☕', '◌', '✦'][index]}</span><b>{item}</b><small>{index === 0 ? 'Uma sugestão gentil para agora.' : 'Escolha se fizer sentido para você.'}</small><i>›</i></button>)}</div></article>
  </section>;
}
