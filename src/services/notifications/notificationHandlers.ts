import * as Notifications from 'expo-notifications';

export type NotificationResponseHandler = (alertId: string) => void;

let responseHandler: NotificationResponseHandler | null = null;

export function setNotificationResponseHandler(handler: NotificationResponseHandler) {
  responseHandler = handler;
}

export function setupNotificationResponseListener() {
  return Notifications.addNotificationResponseReceivedListener((response) => {
    const alertId = response.notification.request.content.data?.alertId as string | undefined;
    if (alertId && responseHandler) {
      responseHandler(alertId);
    }
  });
}
