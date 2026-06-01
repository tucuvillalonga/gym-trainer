const REST_NOTIFICATION_ID = "fitapp-rest-timer";

export type NotificationAvailability =
  | "unsupported"
  | "default"
  | "granted"
  | "denied";

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

async function getReadyRegistration() {
  const registered = await registerServiceWorker();
  if (!registered) return null;

  return navigator.serviceWorker.ready;
}

export async function scheduleRestNotification(endsAt: number, body: string) {
  if (getNotificationAvailability() !== "granted") return;

  const registration = await getReadyRegistration();
  const worker = registration?.active ?? registration?.waiting ?? registration?.installing;
  worker?.postMessage({
    type: "SCHEDULE_REST_NOTIFICATION",
    payload: {
      id: REST_NOTIFICATION_ID,
      endsAt,
      title: "Descanso terminado",
      body,
    },
  });
}

export async function cancelRestNotification() {
  if (!("serviceWorker" in navigator)) return;

  const registration = await navigator.serviceWorker.getRegistration();
  const worker = registration?.active ?? registration?.waiting ?? registration?.installing;
  worker?.postMessage({
    type: "CANCEL_REST_NOTIFICATION",
    payload: { id: REST_NOTIFICATION_ID },
  });
}
