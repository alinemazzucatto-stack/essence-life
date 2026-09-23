import './CyclePhaseCard.css';

type CyclePhaseCardProps = {
  phase: string;
  dayLabel: string;
  description: string;
};

export default function CyclePhaseCard({ phase, dayLabel, description }: CyclePhaseCardProps) {
  const explanations: Record<string, string> = {
    Menstrual: 'É o período da menstruação. Algumas pessoas podem preferir mais conforto, pausa e acolhimento nesta fase.',
    Folicular: 'É a fase que começa após a menstruação e segue até a ovulação. A energia pode retornar aos poucos.',
    Ovulatória: 'É uma fase estimada próxima à ovulação. Cada corpo pode vivê-la de uma maneira diferente.',
    Lútea: 'É o período após a ovulação e antes da próxima menstruação. Algumas pessoas percebem mudanças de energia, humor ou necessidade de descanso.',
  };

  return (
    <article className="cycle-phase-card">
      <svg className="cycle-phase-card__foliage cycle-phase-card__foliage--left" aria-hidden="true" viewBox="0 0 52 70" fill="none"><path d="M13 69C20 49 28 30 37 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M22 49c-10-2-15-9-15-18 10 1 15 7 15 18ZM29 34c1-10 7-16 16-18 0 10-6 16-16 18ZM17 60C9 60 4 55 3 47c9 0 14 5 14 13Z" fill="currentColor" opacity=".92"/></svg>
      <svg className="cycle-phase-card__foliage cycle-phase-card__foliage--right" aria-hidden="true" viewBox="0 0 52 70" fill="none"><path d="M13 69C20 49 28 30 37 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M22 49c-10-2-15-9-15-18 10 1 15 7 15 18ZM29 34c1-10 7-16 16-18 0 10-6 16-16 18ZM17 60C9 60 4 55 3 47c9 0 14 5 14 13Z" fill="currentColor" opacity=".92"/></svg>
      <div className="cycle-phase-card__symbol" aria-hidden="true">◔</div>
      <small>FASE ESTIMADA</small>
      <h3>{phase}</h3>
      <strong>{dayLabel}</strong>
      <p>{explanations[phase] || description}</p>
    </article>
  );
}
