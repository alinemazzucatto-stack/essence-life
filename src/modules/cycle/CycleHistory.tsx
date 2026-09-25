import './CycleHistory.css';

type Entry = { id: string; date: string; flow: string; moods?: string[]; mood?: string; symptoms: string[] };
type Props = {
  monthDate: Date; days: number; offset: number; entries: Entry[]; recorded: Map<string, Entry>;
  calendarMonth: string; isPredicted: (date: string) => boolean; onPrevious: () => void;
  onNext: () => void; onOpen: (date: string) => void; cycleLength: number;
};

const weekday = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' });
const shortWeekday = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' });

function recordDateLabel(date: Date) {
  const month = new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(date).replace('.', '');
  return `${String(date.getDate()).padStart(2, '0')} ${month}.`;
}

function recordWeekdayLabel(date: Date) {
  const value = shortWeekday.format(date).replace('.', '');
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}.`;
}

function recordTitle(entry: Entry) {
  if (entry.flow !== 'Sem fluxo') return 'Menstruação';
  if (entry.symptoms.length) return 'Sintomas registrados';
  return 'Registro do ciclo';
}

function recordDetails(entry: Entry) {
  const flow = entry.flow !== 'Sem fluxo' ? `Fluxo ${entry.flow.toLowerCase()}` : '';
  const items = [flow, ...(entry.moods || (entry.mood ? [entry.mood] : [])), ...entry.symptoms].filter(Boolean);
  return items.length ? items.join(' · ') : 'Detalhes registrados neste dia';
}

function RecordIcon({ entry }: { entry: Entry }) {
  if (entry.flow !== 'Sem fluxo') return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3.2C9.1 7 6.8 9.9 6.8 13.2a5.2 5.2 0 0 0 10.4 0c0-3.3-2.3-6.2-5.2-10Z" fill="currentColor"/></svg>;
  if (entry.symptoms.length) return <svg viewBox="0 0 24 24" aria-hidden="true"><g fill="currentColor"><ellipse cx="12" cy="5.6" rx="3.4" ry="4.2"/><ellipse cx="18.4" cy="9.2" rx="3.4" ry="4.2" transform="rotate(60 18.4 9.2)"/><ellipse cx="18.4" cy="16" rx="3.4" ry="4.2" transform="rotate(120 18.4 16)"/><ellipse cx="12" cy="18.4" rx="3.4" ry="4.2"/><ellipse cx="5.6" cy="16" rx="3.4" ry="4.2" transform="rotate(60 5.6 16)"/><ellipse cx="5.6" cy="9.2" rx="3.4" ry="4.2" transform="rotate(120 5.6 9.2)"/></g><circle cx="12" cy="12" r="2.6" fill="#fff4d8"/></svg>;
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 12.5 10.3 16 17 8.5" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

function SummaryIcon({ type }: { type: 'calendar' | 'flow' | 'regularity' }) {
  if (type === 'calendar') return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="5.5" width="16" height="14" rx="3" stroke="currentColor" strokeWidth="1.9"/><path d="M8 3.5v4M16 3.5v4M4 10h16" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"/></svg>;
  if (type === 'flow') return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3.5C9 7.2 6.5 10 6.5 13.4a5.5 5.5 0 1 0 11 0C17.5 10 15 7.2 12 3.5Z" fill="currentColor" opacity=".9"/></svg>;
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 9a7 7 0 0 0-12.3-2.5L5 8.2M5 5v3.2h3.2M5 15a7 7 0 0 0 12.3 2.5l1.7-1.7M19 19v-3.2h-3.2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

export default function CycleHistory({ monthDate, days, offset, entries, recorded, calendarMonth, isPredicted, onPrevious, onNext, onOpen, cycleLength }: Props) {
  const recent = [...entries].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  const flowDays = entries.filter(entry => entry.flow !== 'Sem fluxo').length;
  const regularity = entries.length >= 2 ? 'Ciclo regular' : 'Em acompanhamento';
  const monthTitle = monthFormatter.format(monthDate).replace(/^./, letter => letter.toUpperCase());

  return <section className="cycle-history-view">
    <header className="cycle-history-heading">
      <div><h2>Seu histórico do ciclo</h2><p>Acompanhe seus registros e veja como seu ciclo vem se comportando.</p></div>
      <svg className="cycle-history-heading-leaf" viewBox="0 0 110 150" fill="none" aria-hidden="true"><path d="M16 145C36 105 56 66 89 14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/><path d="M42 100C25 96 14 82 12 62c18 2 30 15 30 38ZM58 73c3-20 16-33 35-39-2 20-15 33-35 39ZM78 44c5-18 17-27 33-30-3 18-15 28-33 30Z" fill="currentColor"/><path d="M38 94c-7-13-2-27 12-35 8 13 3 27-12 35Z" fill="#f3a7ab"/></svg>
    </header>

    <article className="cycle-history-calendar">
      <div className="cycle-history-month">
        <button type="button" onClick={onPrevious} aria-label="Mês anterior">‹</button>
        <h3>{monthTitle}</h3>
        <button type="button" onClick={onNext} aria-label="Próximo mês">›</button>
      </div>
      <div className="cycle-history-calendar-body">
        <div>
          <div className="cycle-history-week">{weekday.map(day => <b key={day}>{day}</b>)}</div>
          <div className="cycle-history-days">
            {Array.from({ length: offset }, (_, index) => <span key={`empty-${index}`} />)}
            {Array.from({ length: days }, (_, index) => {
              const day = index + 1;
              const date = `${calendarMonth}-${String(day).padStart(2, '0')}`;
              const entry = recorded.get(date);
              const predicted = isPredicted(date);
              const hasFlow = Boolean(entry && entry.flow !== 'Sem fluxo');
              const hasSymptoms = Boolean(entry?.symptoms.length);
              return <button type="button" key={date} onClick={() => onOpen(date)}
                className={[predicted ? 'predicted' : '', entry ? 'recorded' : '', hasFlow ? 'has-flow' : '', hasSymptoms ? 'has-symptoms' : ''].filter(Boolean).join(' ')}
                aria-label={`${day}${entry ? ', com registro' : ''}${predicted ? ', período estimado' : ''}`}>
                <b>{day}</b>{entry && !hasFlow && <i aria-hidden="true" />}
              </button>;
            })}
          </div>
        </div>
        <div className="cycle-history-legend" role="list" aria-label="Legenda do calendário">
          <span><i className="period" />Menstruação</span>
          <span><i className="fertile" />Período fértil</span>
          <span><i className="ovulation" />Ovulação</span>
          <span><i className="symptoms" />Sintomas registrados</span>
          <span><i className="record" />Registro completo</span>
        </div>
      </div>
    </article>

    <article className="cycle-history-records">
      <div className="cycle-section-title">
        <h3>Últimos registros</h3>
        <button type="button" onClick={() => recent[0] && onOpen(recent[0].date)}>Ver todos <span aria-hidden="true">›</span></button>
      </div>
      {recent.length ? <div className="cycle-history-record-list">
        {recent.map(entry => {
          const date = new Date(`${entry.date}T12:00:00`);
          const flow = entry.flow !== 'Sem fluxo';
          return <button type="button" className="cycle-history-row" key={entry.id} onClick={() => onOpen(entry.date)}>
            <time><b>{recordDateLabel(date)}</b><small>{recordWeekdayLabel(date)}</small></time>
            <span className={`cycle-history-entry-icon ${flow ? 'flow' : entry.symptoms.length ? 'symptom' : ''}`}><RecordIcon entry={entry} /></span>
            <span className="cycle-history-entry-copy"><b>{recordTitle(entry)}</b><small>{recordDetails(entry)}</small></span>
            <i aria-hidden="true">›</i>
          </button>;
        })}
      </div> : <div className="cycle-history-empty"><span>✦</span><div><b>Seus registros aparecerão aqui</b><p>Registre quando fizer sentido para acompanhar seu ritmo.</p></div></div>}
    </article>

    <article className="cycle-history-summary">
      <div className="cycle-section-title"><h3>Resumo do seu ciclo</h3><small>Últimos 3 ciclos</small></div>
      <section className="cycle-summary-metrics">
        <article><span className="summary-calendar"><SummaryIcon type="calendar" /></span><div><small>Duração média</small><strong>{cycleLength} dias</strong></div></article>
        <article><span className="summary-flow"><SummaryIcon type="flow" /></span><div><small>Duração da menstruação</small><strong>{flowDays ? `${flowDays} ${flowDays === 1 ? 'dia' : 'dias'}` : '—'}</strong></div></article>
        <article><span className="summary-regular"><SummaryIcon type="regularity" /></span><div><small>Regularidade</small><strong>{regularity}</strong></div></article>
      </section>
      <p className="cycle-history-note"><span aria-hidden="true"><svg viewBox="0 0 30 34" fill="none"><path d="M4 31C10 20 16 11 25 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M12 20C5 20 1 15 1 9c7 0 11 4 11 11ZM18 13c1-6 5-10 11-11-1 6-5 10-11 11Z" fill="currentColor"/></svg></span>Seu ciclo tem se mantido regular nos últimos meses.<i aria-hidden="true">✦</i></p>
    </article>
  </section>;
}
