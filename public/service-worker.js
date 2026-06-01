const CACHE_NAME = "fitapp-pwa-v2";
const APP_SHELL = ["/", "/index.html", "/manifest.webmanifest", "/fitapp-logo.png", "/favicon.svg"];
const notificationTimers = new Map();

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

  if (type === "CANCEL_NOTIFICATION") {
    clearNotificationTimer(payload.id);
    return;
  }

  if (type === "SCHEDULE_NOTIFICATION") {
    clearNotificationTimer(payload.id);

    const delay = Math.max(0, Number(payload.at || Date.now()) - Date.now());
    const timeoutId = setTimeout(() => {
      notificationTimers.delete(payload.id);
      self.registration.showNotification(payload.title || "FITAPP", {
        body: payload.body || "",
        icon: "/fitapp-logo.png",
        badge: "/fitapp-logo.png",
        tag: payload.tag || payload.id,
        renotify: true,
        requireInteraction: Boolean(payload.requireInteraction),
        data: payload.data || { url: "/" },
      });
    }, delay);

    notificationTimers.set(payload.id, timeoutId);
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = buildNotificationUrl(event.notification.data);

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

function clearNotificationTimer(id) {
  const timeoutId = notificationTimers.get(id);
  if (timeoutId) {
    clearTimeout(timeoutId);
    notificationTimers.delete(id);
  }
}

function buildNotificationUrl(data) {
  if (!data?.intent) return data?.url || "/";

  const url = new URL("/", self.location.origin);
  url.searchParams.set("notificationIntent", data.intent);

  if (data.rutinaId) url.searchParams.set("rutinaId", data.rutinaId);
  if (Number.isFinite(Number(data.indice))) {
    url.searchParams.set("indice", String(data.indice));
  }

  return url.pathname + url.search;
}
