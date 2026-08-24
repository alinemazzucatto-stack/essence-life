import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

export type NotificationPermission = 'granted' | 'denied' | 'prompt' | 'unsupported';

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
