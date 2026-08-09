import { today } from './app-utils';

export type SubscriptionPlan = 'free' | 'essential' | 'plus' | 'premium';
export type AppPage = 'home' | 'sleep' | 'nutrition' | 'house' | 'agenda' | 'finance' | 'cycle' | 'routine' | 'diary' | 'workouts' | 'beauty' | 'profile';
export type GatedPage = Exclude<AppPage, 'home' | 'profile'>;
export type Subscription = { plan: SubscriptionPlan; periodMonth: string; monthlyUsed: number; extraCredits: number; trialEnds?: string; trialUsed?: boolean; selectedPlan?: SubscriptionPlan };

export const planNames: Record<SubscriptionPlan, string> = { free: 'Gratuito', essential: 'Essencial', plus: 'Essencial', premium: 'Pro' };
const planRank: Record<SubscriptionPlan, number> = { free: 0, essential: 1, plus: 2, premium: 3 };
const requiredPlanByPage: Record<GatedPage, SubscriptionPlan> = { agenda: 'free', routine: 'free', diary: 'essential', sleep: 'essential', nutrition: 'premium', workouts: 'premium', beauty: 'premium', cycle: 'essential', finance: 'premium', house: 'premium' };

export const readSubscription = (): Subscription => {
  const defaults: Subscription = { plan: 'free', periodMonth: today().slice(0, 7), monthlyUsed: 0, extraCredits: 3 };
  try { return { ...defaults, ...JSON.parse(localStorage.getItem('essence:subscription') || '{}') }; }
  catch { return defaults; }
};
export const planMeets = (current: SubscriptionPlan, required: SubscriptionPlan) => planRank[current] >= planRank[required];
export const requiredPlanForPage = (page: AppPage): SubscriptionPlan => page === 'home' || page === 'profile' ? 'free' : requiredPlanByPage[page];

export const pageMeta: Record<AppPage, { title: string; copy: string }> = {
  home: { title: '🌸 Bem-vinda ao Essence Life', copy: 'Sua vida organizada com leveza.' }, sleep: { title: '🌙 Sono', copy: 'Acompanhe seu descanso, regularidade e fatores que influenciam suas noites.' },
  nutrition: { title: '🥗 Nutrição', copy: 'Refeições, hidratação e objetivos no seu ritmo.' }, house: { title: '🏠 Casa & Compras', copy: 'Projetos, compras e orçamento em um só lugar.' },
  agenda: { title: '📅 Agenda', copy: 'Organize compromissos, hábitos e tarefas.' }, finance: { title: '💰 Finanças', copy: 'Entradas, saídas e metas com clareza.' },
  cycle: { title: '🌸 Ciclo', copy: 'Acompanhe seu ritmo com delicadeza.' }, routine: { title: '🗓️ Rotina', copy: 'Planeje sua semana com tranquilidade.' },
  diary: { title: '📔 Diário', copy: 'Registre sentimentos e pensamentos.' }, workouts: { title: '🏋️ Treinos', copy: 'Monte seus treinos e acompanhe a evolução.' }, beauty: { title: '🪞 Beleza & Cuidados', copy: 'Organize seus rituais de autocuidado com leveza.' },
  profile: { title: '👤 Perfil & conta', copy: 'Atualize seu acesso e seus dados neste dispositivo.' },
};
export const upgradeCopy = (required: SubscriptionPlan) => required === 'essential' || required === 'plus' ? 'Esse módulo faz parte do plano Essencial.' : 'Esse módulo faz parte do plano Pro.';