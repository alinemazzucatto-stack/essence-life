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
      <small>FASE ESTIMADA</small>
      <h3>{phase}</h3>
      <strong>{dayLabel}</strong>
      <p>{explanations[phase] || description}</p>
    </article>
  );
}
