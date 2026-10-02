import type { ReactNode } from 'react';
import moonBotanical from '../../assets/cycle-phase-moon-botanical.png';
import './CyclePhaseCard.css';

type CyclePhaseCardProps = { phase: string; cycleDay: number; daysUntilPeriod: number | null };
type PhaseDetail = { label: string; description: string; energy: string; sensitivity: string; rest: string };

const phases: Record<string, PhaseDetail> = {
  Menstrual: { label: 'Fase menstrual', description: 'Seu corpo está iniciando um novo ciclo. Nesta fase, é comum perceber menor energia e uma maior necessidade de descanso e autocuidado.', energy: 'Pode diminuir', sensitivity: 'Pode aumentar', rest: 'Pode ser maior' },
  Folicular: { label: 'Fase folicular', description: 'Seu corpo está se preparando para a ovulação. A energia pode aumentar gradualmente, trazendo mais disposição e sensação de renovação.', energy: 'Pode aumentar', sensitivity: 'Pode diminuir', rest: 'Pode ser menor' },
  Ovulatória: { label: 'Fase ovulatória', description: 'Você está no período próximo à ovulação. Algumas pessoas percebem mais energia, disposição e sociabilidade nesta fase.', energy: 'Pode aumentar', sensitivity: 'Pode aumentar', rest: 'Pode ser menor' },
  Lútea: { label: 'Fase lútea', description: 'Seu corpo está se preparando para a próxima menstruação. Nesta fase, você pode perceber mudanças na energia, no humor e uma maior necessidade de descanso.', energy: 'Pode diminuir', sensitivity: 'Pode aumentar', rest: 'Pode ser maior' },
};

function CalendarIcon({ size = 24 }: { size?: number }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4M17 3v4M3 10h18"/></svg>; }
function BoltIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m13 2-9 12h7l-1 8 10-13h-7z" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round"/></svg>; }
function HeartIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 8.7c0 5.2-8.8 10.5-8.8 10.5S3.2 13.9 3.2 8.7A4.7 4.7 0 0 1 12 6.4a4.7 4.7 0 0 1 8.8 2.3Z" fill="none" stroke="currentColor" strokeWidth="1.9"/></svg>; }
function MoonIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.6 15.4A8.7 8.7 0 0 1 8.6 3.4 8.8 8.8 0 1 0 20.6 15.4Z" fill="none" stroke="currentColor" strokeWidth="1.9"/></svg>; }
function Arrow({ direction }: { direction: 'up' | 'down' }) { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d={direction === 'up' ? 'm6 14 6-6 6 6M12 8v12' : 'm6 10 6 6 6-6M12 16V4'} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>; }

function MoonIllustration() { return <div className="cl-moon-scene"><img className="cl-moon-image" src={moonBotanical} alt="" /></div>; }

function CycleSignal({ icon, title, description, trend, tone }: { icon: ReactNode; title: string; description: string; trend: 'up' | 'down'; tone: string }) { return <div className="cl-cycle-signal"><div className={`cl-cycle-signal-icon cl-cycle-signal-icon-${tone}`}>{icon}</div><div className="cl-cycle-signal-text"><strong>{title}</strong><span>{description}</span></div><div className="cl-cycle-signal-trend" aria-label={trend === 'up' ? 'Tendência de aumento' : 'Tendência de diminuição'}><Arrow direction={trend}/></div></div>; }

export default function CyclePhaseCard({ phase, cycleDay, daysUntilPeriod }: CyclePhaseCardProps) {
  const current = phases[phase] ?? { label: 'Seu ciclo', description: 'Registre sua última menstruação para acompanhar as estimativas do seu ciclo com mais clareza.', energy: 'Acompanhe seu ritmo', sensitivity: 'Observe seu corpo', rest: 'Cuide de você' };
  const periodValue = daysUntilPeriod === null ? 'Sem estimativa' : `~ ${daysUntilPeriod} ${daysUntilPeriod === 1 ? 'dia' : 'dias'}`;
  return <section className="cl-cycle-card" aria-label={`Informações do ciclo: ${current.label}`}>
    <div className="cl-cycle-content"><div className="cl-cycle-main"><span className="cl-cycle-eyebrow">Fase estimada</span><h2 className="cl-cycle-title">{current.label}</h2><div className="cl-cycle-day"><CalendarIcon size={21}/><span>{cycleDay > 0 ? `Dia ${cycleDay} do ciclo` : 'Configure sua referência'}</span></div><div className="cl-next-period"><div className="cl-next-period-icon"><CalendarIcon size={26}/></div><div className="cl-next-period-content"><span className="cl-next-period-label">Próxima menstruação em</span><strong className="cl-next-period-value">{periodValue}</strong></div></div><p className="cl-cycle-description">{current.description}</p></div><div className="cl-cycle-illustration" aria-hidden="true"><MoonIllustration /></div></div>
    <div className="cl-cycle-divider"/><div className="cl-cycle-signals"><CycleSignal icon={<BoltIcon/>} title="Energia" description={current.energy} trend={current.energy.includes('diminuir') ? 'down' : 'up'} tone="energy"/><CycleSignal icon={<HeartIcon/>} title="Sensibilidade" description={current.sensitivity} trend={current.sensitivity.includes('diminuir') ? 'down' : 'up'} tone="sensitivity"/><CycleSignal icon={<MoonIcon/>} title="Descanso" description={current.rest} trend={current.rest.includes('menor') ? 'down' : 'up'} tone="rest"/></div>
  </section>;
}
