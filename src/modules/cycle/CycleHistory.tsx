import './CycleHistory.css';

type Entry = { id: string; date: string; flow: string; moods?: string[]; mood?: string; symptoms: string[] };
type Props = {
  monthDate: Date; days: number; offset: number; entries: Entry[]; recorded: Map<string, Entry>;
  calendarMonth: string; isPredicted: (date: string) => boolean; onPrevious: () => void;
  onNext: () => void; onOpen: (date: string) => void; cycleLength: number;
};

const weekday = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' });
const shortDate = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' });
const shortWeekday = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' });

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

function recordIcon(entry: Entry) {
  if (entry.flow !== 'Sem fluxo') return '●';
  if (entry.symptoms.length) return '✦';
  return '♡';
}

export default function CycleHistory({ monthDate, days, offset, entries, recorded, calendarMonth, isPredicted, onPrevious, onNext, onOpen, cycleLength }: Props) {
  const recent = [...entries].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  const flowDays = entries.filter(entry => entry.flow !== 'Sem fluxo').length;
  const regularity = entries.length >= 2 ? 'Ciclo regular' : 'Em acompanhamento';

  return <section className="cycle-history-view">
    <header className="cycle-history-heading">
      <h2>Seu histórico do ciclo</h2>
      <p>Acompanhe seus registros e veja como seu ciclo vem se comportando.</p>
    </header>

    <article className="cycle-history-calendar">
      <div className="cycle-history-month">
        <button type="button" onClick={onPrevious} aria-label="Mês anterior">‹</button>
        <h3>{monthFormatter.format(monthDate)}</h3>
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
        <aside className="cycle-history-legend" aria-label="Legenda do calendário">
          <span><i className="period" />Menstruação</span>
          <span><i className="fertile" />Período estimado</span>
          <span><i className="ovulation" />Ovulação</span>
          <span><i className="symptoms" />Sintomas registrados</span>
          <span><i className="record" />Registro completo</span>
        </aside>
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
            <time><b>{shortDate.format(date).replace('.', '')}</b><small>{shortWeekday.format(date).replace('.', '')}</small></time>
            <span className={`cycle-history-entry-icon ${flow ? 'flow' : entry.symptoms.length ? 'symptom' : ''}`} aria-hidden="true">{recordIcon(entry)}</span>
            <span className="cycle-history-entry-copy"><b>{recordTitle(entry)}</b><small>{recordDetails(entry)}</small></span>
            <i aria-hidden="true">›</i>
          </button>;
        })}
      </div> : <div className="cycle-history-empty"><span>✦</span><div><b>Seus registros aparecerão aqui</b><p>Registre quando fizer sentido para acompanhar seu ritmo.</p></div></div>}
    </article>

    <article className="cycle-history-summary">
      <div className="cycle-section-title"><h3>Resumo do seu ciclo</h3><small>Últimos 3 ciclos</small></div>
      <section className="cycle-summary-metrics">
        <article><span className="summary-calendar" aria-hidden="true">▣</span><div><small>Duração média</small><strong>{cycleLength} dias</strong></div></article>
        <article><span className="summary-flow" aria-hidden="true">●</span><div><small>Duração da menstruação</small><strong>{flowDays ? `${flowDays} ${flowDays === 1 ? 'dia' : 'dias'}` : '—'}</strong></div></article>
        <article><span className="summary-regular" aria-hidden="true">↻</span><div><small>Regularidade</small><strong>{regularity}</strong></div></article>
      </section>
      <p className="cycle-history-note"><span aria-hidden="true">❋</span>{entries.length >= 2 ? 'Seu ciclo tem se mantido regular nos últimos meses.' : 'Seus próximos registros vão deixar esta leitura ainda mais pessoal.'}<i aria-hidden="true">✦</i></p>
    </article>
  </section>;
}
