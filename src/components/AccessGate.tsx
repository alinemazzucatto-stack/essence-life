import { planNames, upgradeCopy } from '../shared/access-control';
import type { SubscriptionPlan } from '../shared/access-control';

type AccessGateProps = { title: string; required: SubscriptionPlan; onOpenPlans: () => void };

export default function AccessGate({ title, required, onOpenPlans }: AccessGateProps) {
  return <section className="card access-gate"><div className="gate-badge">🔒 Acesso bloqueado</div><h3>{title}</h3><p>{upgradeCopy(required)} Ative o plano {planNames[required]} para abrir este módulo.</p><div className="gate-actions"><button type="button" className="primary" onClick={onOpenPlans}>Ver planos</button><button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Agora não</button></div><small>Os módulos liberados continuam disponíveis normalmente no seu plano atual.</small></section>;
}