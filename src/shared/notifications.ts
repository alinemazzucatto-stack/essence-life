import { Capacitor, registerPlugin } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

export type NotificationPermission = 'granted' | 'denied' | 'prompt' | 'unsupported';

const NotificationSettings = registerPlugin<{ open: () => Promise<void> }>('NotificationSettings');

const webPermission = (): NotificationPermission => {
  if (!('Notification' in window)) return 'unsupported';
  return Notification.permission === 'default' ? 'prompt' : Notification.permission;
};

export const getNotificationPermission = async (): Promise<NotificationPermission> => {
  if (Capacitor.isNativePlatform()) {
    const status = await LocalNotifications.checkPermissions();
    return status.display as NotificationPermission;
  }
  return webPermission();
};

export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (Capacitor.isNativePlatform()) {
    const status = await LocalNotifications.requestPermissions();
    return status.display as NotificationPermission;
  }
  if (!('Notification' in window)) return 'unsupported';
  const status = await Notification.requestPermission();
  return status === 'default' ? 'prompt' : status;
};

export const sendNotificationTest = async () => {
  const title = 'Essence Life';
  const body = 'Seu lembrete está funcionando ✨';
  if (Capacitor.isNativePlatform()) {
    await LocalNotifications.schedule({ notifications: [{ id: 990001, title, body }] });
    return;
  }
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(title, { body, icon: '/icon-192.png', badge: '/icon-192.png', tag: 'essence-test' });
    return;
  }
  new Notification(title, { body });
};

export const openNotificationSettings = async () => {
  if (Capacitor.isNativePlatform()) await NotificationSettings.open();
};
const hydrationNotificationIds = Array.from({ length: 36 }, (_, index) => 831000 + index);

export const cancelHydrationReminders = async () => {
  if (!Capacitor.isNativePlatform()) return;
  await LocalNotifications.cancel({ notifications: hydrationNotificationIds.map(id => ({ id })) });
};

export const scheduleHydrationReminders = async (intervalMinutes: number) => {
  if (!Capacitor.isNativePlatform()) return;
  const safeInterval = Math.max(15, Math.round(intervalMinutes));
  await cancelHydrationReminders();
  const now = Date.now();
  await LocalNotifications.schedule({
    notifications: hydrationNotificationIds.map((id, index) => ({
      id,
      title: 'Essence Life',
      body: 'Hora de beber água e cuidar de você. 💧',
      schedule: {
        at: new Date(now + (index + 1) * safeInterval * 60 * 1000),
        allowWhileIdle: true,
      },
    })),
  });
};

export const scheduleDailyReminder = async (id: string, title: string, time: string, enabled: boolean) => {
  if (!Capacitor.isNativePlatform()) return;
  const notificationId = 840000 + Array.from(id).reduce((total, char) => (total * 31 + char.charCodeAt(0)) % 100000, 0);
  await LocalNotifications.cancel({ notifications: [{ id: notificationId }] });
  if (!enabled) return;
  const [hour, minute] = time.split(':').map(Number);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return;
  await LocalNotifications.schedule({
    notifications: [{
      id: notificationId,
      title: 'Essence Life',
      body: title,
      schedule: { on: { hour, minute }, repeats: true, allowWhileIdle: true },
    }],
  });
};
