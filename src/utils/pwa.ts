export type NotificationAvailability =
  | "unsupported"
  | "default"
  | "granted"
  | "denied";

export type LocalNotification = {
  id: string;
  title: string;
  body: string;
  at?: number;
  tag?: string;
  requireInteraction?: boolean;
  data?: Record<string, unknown>;
};

const localNotificationTimeouts = new Map<string, number>();

export function getNotificationAvailability(): NotificationAvailability {
  if (!("Notification" in window) || !("serviceWorker" in navigator)) {
    return "unsupported";
  }

  return Notification.permission;
}

export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return null;

  try {
    return await navigator.serviceWorker.register("/service-worker.js");
  } catch (error) {
    console.error("No se pudo registrar el service worker", error);
    return null;
  }
}

export async function requestRestNotificationPermission() {
  if (getNotificationAvailability() === "unsupported") {
    return "unsupported" as const;
  }

  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    await registerServiceWorker();
  }

  return permission;
}

export const requestNotificationPermission = requestRestNotificationPermission;

async function getReadyRegistration() {
  const registered = await registerServiceWorker();
  if (!registered) return null;

  return navigator.serviceWorker.ready;
}

export async function scheduleLocalNotification(notification: LocalNotification) {
  if (getNotificationAvailability() !== "granted") return;

  schedulePageFallbackNotification(notification);

  const registration = await getReadyRegistration();
  const worker = registration?.active ?? registration?.waiting ?? registration?.installing;
  worker?.postMessage({
    type: "SCHEDULE_NOTIFICATION",
    payload: notification,
  });
}

export async function showLocalNotification(notification: LocalNotification) {
  await scheduleLocalNotification({
    ...notification,
    at: Date.now(),
  });
}

export async function cancelLocalNotification(id: string) {
  clearPageFallbackNotification(id);

  if (!("serviceWorker" in navigator)) return;

  const registration = await navigator.serviceWorker.getRegistration();
  const worker = registration?.active ?? registration?.waiting ?? registration?.installing;
  worker?.postMessage({
    type: "CANCEL_NOTIFICATION",
    payload: { id },
  });
}

export async function scheduleRestNotification(endsAt: number, body: string) {
  await scheduleLocalNotification({
    id: "fitapp-rest-timer",
    title: "Descanso terminado",
    body,
    at: endsAt,
    tag: "fitapp-rest-timer",
    requireInteraction: true,
    data: { intent: "resume-workout" },
  });
}

export async function cancelRestNotification() {
  await cancelLocalNotification("fitapp-rest-timer");
}

function schedulePageFallbackNotification(notification: LocalNotification) {
  clearPageFallbackNotification(notification.id);

  const delay = Math.max(0, Number(notification.at || Date.now()) - Date.now());
  const timeoutId = window.setTimeout(async () => {
    localNotificationTimeouts.delete(notification.id);

    if (getNotificationAvailability() !== "granted") return;

    const registration = await getReadyRegistration();
    await registration?.showNotification(notification.title, {
      body: notification.body,
      icon: "/fitapp-logo.png",
      badge: "/fitapp-logo.png",
      tag: notification.tag || notification.id,
      requireInteraction: Boolean(notification.requireInteraction),
      data: notification.data || { url: "/" },
    });
  }, delay);

  localNotificationTimeouts.set(notification.id, timeoutId);
}

function clearPageFallbackNotification(id: string) {
  const timeoutId = localNotificationTimeouts.get(id);
  if (!timeoutId) return;

  window.clearTimeout(timeoutId);
  localNotificationTimeouts.delete(id);
}
