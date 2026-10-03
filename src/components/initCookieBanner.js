const STORAGE_KEY = "navident:cookie-notice-accepted";

export function initCookieBanner() {
  const banner = document.querySelector("[data-cookie-banner]");
  const button = banner?.querySelector("[data-cookie-banner-accept]");
  const spacer = document.querySelector("[data-cookie-banner-spacer]");
  if (!banner || !button || !spacer) return;

  try {
    if (localStorage.getItem(STORAGE_KEY) === "true") return;
  } catch {
    // The notice remains usable when browser storage is unavailable.
  }

  banner.hidden = false;
  spacer.hidden = false;
  const updateSpacer = () => {
    spacer.style.height = `${banner.getBoundingClientRect().height}px`;
  };
  const observer = new ResizeObserver(updateSpacer);
  observer.observe(banner);
  updateSpacer();

  button.addEventListener("click", () => {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // Closing the notice must still work when storage is blocked.
    }
    banner.hidden = true;
    spacer.hidden = true;
    observer.disconnect();
  }, { once: true });
}
