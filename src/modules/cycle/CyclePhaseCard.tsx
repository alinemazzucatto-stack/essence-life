import './CyclePhaseCard.css';

type CyclePhaseCardProps = { phase: string; cycleDay: number; daysUntilPeriod: number | null };

const details: Record<string, { title: string; text: string; energy: string; sensitivity: string; rest: string }> = {
  Menstrual: { title: 'Fase menstrual', text: 'Seu corpo está em um novo começo. Acolha seu ritmo e priorize o conforto que fizer sentido hoje.', energy: 'Pode diminuir', sensitivity: 'Pode aumentar', rest: 'Pode ser maior' },
  Folicular: { title: 'Fase folicular', text: 'Após a menstruação, a energia costuma voltar aos poucos. É um bom momento para explorar o que te anima.', energy: 'Pode aumentar', sensitivity: 'Pode diminuir', rest: 'Pode ser menor' },
  Ovulatória: { title: 'Fase ovulatória', text: 'Nesta fase, você pode perceber mais disposição e conexão. Observe seu corpo com curiosidade e gentileza.', energy: 'Pode aumentar', sensitivity: 'Pode aumentar', rest: 'Pode ser menor' },
  Lútea: { title: 'Fase lútea', text: 'Seu corpo está se preparando para a próxima menstruação. Nesta fase, você pode perceber mudanças na energia, no humor e uma maior necessidade de descanso.', energy: 'Pode diminuir', sensitivity: 'Pode aumentar', rest: 'Pode ser maior' },
};

function Icon({ name }: { name: 'calendar' | 'bolt' | 'heart' | 'moon' }) {
  if (name === 'calendar') return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4M17 3v4M3 10h18"/></svg>;
  if (name === 'bolt') return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" stroke="none" d="M13.2 2 4.8 13h6.5L10.8 22l8.4-11h-6.5L13.2 2Z"/></svg>;
  if (name === 'heart') return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" stroke="none" d="M12 21S3.7 16 3.7 9.6C3.7 6.6 5.8 4.5 8.5 4.5c1.6 0 2.9.8 3.5 2 0 0 .1.2.1.2s.1-.2.1-.2c.7-1.2 2-2 3.5-2 2.7 0 4.8 2.1 4.8 5.1C20.5 16 12 21 12 21Z"/></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" stroke="none" d="M20.7 15.6A9 9 0 0 1 8.4 3.3 9 9 0 1 0 20.7 15.6Z"/></svg>;
}

function Branch({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 180 220" aria-hidden="true"><path d="M20 220C58 155 85 98 158 13"/><path d="M65 150c-39-8-43-39-34-58 29 9 42 32 34 58ZM93 111c-6-36 15-51 37-55 4 31-10 49-37 55ZM118 76c6-32 28-39 47-34-5 29-22 40-47 34ZM45 187c-27 5-43-12-45-31 25-4 41 10 45 31Z"/></svg>;
}

export default function CyclePhaseCard({ phase, cycleDay, daysUntilPeriod }: CyclePhaseCardProps) {
  const info = details[phase] ?? { title: 'Seu ciclo', text: 'Registre sua última menstruação para acompanhar as estimativas do seu ciclo com mais clareza.', energy: 'Acompanhe seu ritmo', sensitivity: 'Observe seu corpo', rest: 'Cuide de você' };
  const day = cycleDay > 0 ? `Dia ${cycleDay} do ciclo` : 'Configure sua referência';
  const period = daysUntilPeriod === null ? 'Sem estimativa' : `~ ${daysUntilPeriod} ${daysUntilPeriod === 1 ? 'dia' : 'dias'}`;
  const signals = [{ icon: 'bolt' as const, label: 'Energia', value: info.energy, tone: 'gold' }, { icon: 'heart' as const, label: 'Sensibilidade', value: info.sensitivity, tone: 'coral' }, { icon: 'moon' as const, label: 'Descanso', value: info.rest, tone: 'lilac' }];
  return <article className="cl-phase-card" aria-label={`Fase do ciclo: ${info.title}`}>
    <Branch className="cl-phase-branch cl-phase-branch--top" /><Branch className="cl-phase-branch cl-phase-branch--bottom" />
    <div className="cl-phase-card__main"><div className="cl-phase-copy">
      <span className="cl-phase-eyebrow">Fase estimada</span><h2>{info.title}</h2>
      <div className="cl-phase-day"><Icon name="calendar" />{day}</div>
      <div className="cl-phase-period"><Icon name="calendar" /><span>Próxima menstruação em <strong>{period}</strong></span><b aria-hidden="true">›</b></div>
      <p>{info.text}</p>
    </div><div className="cl-phase-moon" aria-hidden="true"><span className="cl-phase-orbit"/><span className="cl-phase-star cl-phase-star--one">✦</span><span className="cl-phase-star cl-phase-star--two">✦</span><div className="cl-phase-crescent"/></div></div>
    <div className="cl-phase-divider" />
    <div className="cl-phase-signals">{signals.map((signal) => <div className="cl-phase-signal" key={signal.label}><span className={`cl-phase-signal__icon ${signal.tone}`}><Icon name={signal.icon} /></span><span><strong>{signal.label}</strong><small>{signal.value}</small></span><b aria-hidden="true">{signal.value.includes('diminuir') ? '↓' : '↑'}</b></div>)}</div>
  </article>;
}
