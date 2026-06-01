const CACHE_NAME = "fitapp-pwa-v1";
const APP_SHELL = ["/", "/index.html", "/manifest.webmanifest", "/fitapp-logo.png", "/favicon.svg"];
const restTimers = new Map();

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type === "opaque") {
            return response;
          }

          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match("/index.html"));
    })
  );
});

self.addEventListener("message", (event) => {
  const { type, payload } = event.data || {};
  if (!payload?.id) return;

  if (type === "CANCEL_REST_NOTIFICATION") {
    clearRestTimer(payload.id);
    return;
  }

  if (type === "SCHEDULE_REST_NOTIFICATION") {
    clearRestTimer(payload.id);

    const delay = Math.max(0, Number(payload.endsAt) - Date.now());
    const timeoutId = setTimeout(() => {
      restTimers.delete(payload.id);
      self.registration.showNotification(payload.title || "Descanso terminado", {
        body: payload.body || "Volve a la rutina.",
        icon: "/fitapp-logo.png",
        badge: "/fitapp-logo.png",
        tag: payload.id,
        renotify: true,
        requireInteraction: true,
        data: { url: "/" },
      });
    }, delay);

    restTimers.set(payload.id, timeoutId);
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }

      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }

      return undefined;
    })
  );
});

function clearRestTimer(id) {
  const timeoutId = restTimers.get(id);
  if (timeoutId) {
    clearTimeout(timeoutId);
    restTimers.delete(id);
  }
}
