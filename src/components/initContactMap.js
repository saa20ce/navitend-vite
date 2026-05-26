function loadContactMap(container) {
  if (container.dataset.mapLoaded === "true") {
    return;
  }

  const frameHost = container.querySelector("[data-contact-map-frame]");
  const placeholder = container.querySelector("[data-contact-map-placeholder]");
  const mapSrc = container.dataset.mapSrc;

  if (!frameHost || !mapSrc) {
    return;
  }

  const iframe = document.createElement("iframe");
  iframe.src = mapSrc;
  iframe.title = container.dataset.mapTitle || "Интерактивная карта проезда";
  iframe.loading = "lazy";
  iframe.referrerPolicy = "no-referrer-when-downgrade";
  iframe.allowFullscreen = true;
  iframe.className = "h-full w-full border-0";

  iframe.addEventListener(
    "load",
    () => {
      frameHost.style.opacity = "1";

      if (placeholder) {
        placeholder.style.opacity = "0";
        placeholder.setAttribute("aria-hidden", "true");
      }
    },
    { once: true },
  );

  frameHost.append(iframe);
  container.dataset.mapLoaded = "true";
}

export function initContactMap() {
  const mapContainers = document.querySelectorAll("[data-contact-map]");

  if (!mapContainers.length) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    mapContainers.forEach((container) => {
      window.setTimeout(() => loadContactMap(container), 1200);
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        loadContactMap(entry.target);
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: "500px 0px",
      threshold: 0.01,
    },
  );

  mapContainers.forEach((container) => observer.observe(container));
}
