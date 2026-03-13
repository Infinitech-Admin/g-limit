"use client"

import { useEffect } from "react"

export function ServiceWorkerUpdater() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    // Listen for SW_UPDATED message from the new service worker
    const handler = (event: MessageEvent) => {
      if (event.data?.type === "SW_UPDATED") {
        // Auto reload the page so users get the fresh version
        window.location.reload();
      }
    };

    navigator.serviceWorker.addEventListener("message", handler);

    // Also handle the case where SW updates while page is open
    navigator.serviceWorker.ready.then((registration) => {
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (!newWorker) return;
        newWorker.addEventListener("statechange", () => {
          if (
            newWorker.state === "activated" &&
            navigator.serviceWorker.controller
          ) {
            window.location.reload();
          }
        });
      });
    });

    return () => {
      navigator.serviceWorker.removeEventListener("message", handler);
    };
  }, []);

  return null;
}
