import { useEffect, useState } from 'react';
import {
  cancelHydrationReminders,
  getNotificationPermission,
  openNotificationSettings,
  requestNotificationPermission,
  scheduleHydrationReminders,
} from '../../shared/notifications';

type HydrationCareProps = {
  goalReached: boolean;
  goal: number;
  water: number;
};

type ReminderConfig = {
  enabled: boolean;
  interval: number;
};

const storageKey = 'essence:hydration-reminder';
const initialConfig = (): ReminderConfig => {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    return { enabled: Boolean(saved.enabled), interval: Number(saved.interval) || 60 };
  } catch {
    return { enabled: false, interval: 60 };
  }
};

export default function HydrationCare({ goalReached, goal, water }: HydrationCareProps) {
  const [config, setConfig] = useState<ReminderConfig>(initialConfig);
  const [message, setMessage] = useState('');

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(config));
  }, [config]);

  const showMessage = (value: string) => {
    setMessage(value);
    window.setTimeout(() => setMessage(''), 4200);
  };

  const activateReminder = async () => {
    const current = await getNotificationPermission();
    const permission = current === 'prompt' ? await requestNotificationPermission() : current;
    if (permission !== 'granted') {
      if (permission === 'denied') await openNotificationSettings();
      showMessage('Autorize as notificações para receber os lembretes de hidratação.');
      return;
    }
    await scheduleHydrationReminders(config.interval);
    setConfig(value => ({ ...value, enabled: true }));
    showMessage(`Lembrete ativado: a cada ${config.interval} minutos.`);
  };

  const deactivateReminder = async () => {
    await cancelHydrationReminders();
    setConfig(value => ({ ...value, enabled: false }));
    showMessage('Lembrete de hidratação pausado.');
  };

  const changeInterval = async (interval: number) => {
    setConfig(value => ({ ...value, interval }));
    if (config.enabled) {
      await scheduleHydrationReminders(interval);
      showMessage(`Lembrete atualizado para cada ${interval} minutos.`);
    }
  };

  return <>
    {goalReached && <article className="card hydration-goal-card" role="status">
      <div className="hydration-goal-icon" aria-hidden="true">💧</div>
      <div>
        <small>META DIÁRIA CONCLUÍDA</small>
        <h3>Meta concluída!</h3>
        <p>Você chegou a {(goal / 1000).toFixed(1)} L hoje. Cada cuidado pequeno conta.</p>
      </div>
      <b>{(water / 1000).toFixed(1)} L</b>
    </article>}
    <article className="card hydration-reminder-card">
      <div className="card-head">
        <div><small>LEMBRETE DE HIDRATAÇÃO</small><h3>Seu copo de água no tempo certo</h3><p>Escolha de quanto em quanto tempo o Essence Life deve te lembrar.</p></div>
        <span aria-hidden="true">⏰</span>
      </div>
      <div className="hydration-reminder-controls">
        <label>Intervalo<select value={config.interval} onChange={event => void changeInterval(Number(event.target.value))}>
          <option value={30}>A cada 30 minutos</option><option value={45}>A cada 45 minutos</option><option value={60}>A cada 1 hora</option><option value={90}>A cada 1 hora e 30 min</option><option value={120}>A cada 2 horas</option>
        </select></label>
        <button className={config.enabled ? 'hydration-reminder-toggle active' : 'hydration-reminder-toggle'} type="button" onClick={() => void (config.enabled ? deactivateReminder() : activateReminder())} aria-pressed={config.enabled}>
          {config.enabled ? 'Lembrete ativo' : 'Ativar lembrete'}
        </button>
      </div>
      <p className="hydration-reminder-note">{config.enabled ? `Você será lembrada a cada ${config.interval} minutos.` : 'Você pode pausar ou mudar o intervalo quando quiser.'}</p>
      {message && <div className="hydration-reminder-message" role="status">{message}</div>}
    </article>
  </>;
}