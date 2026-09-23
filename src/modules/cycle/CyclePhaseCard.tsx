import './CyclePhaseCard.css';

type CyclePhaseCardProps = {
  phase: string;
  dayLabel: string;
  description: string;
};

export default function CyclePhaseCard({ phase, dayLabel, description }: CyclePhaseCardProps) {
  return (
    <article className="cycle-phase-card">
      <div className="cycle-phase-card__orb" aria-hidden="true" />
      <small>FASE ESTIMADA</small>
      <h3>{phase}</h3>
      <strong>{dayLabel}</strong>
      <p>{description}</p>
    </article>
  );
}
