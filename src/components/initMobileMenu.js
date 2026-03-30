export function initMobileMenu() {
  const openButton = document.querySelector("[data-menu-open]");
  const overlay = document.querySelector("[data-menu-overlay]");
  const panel = document.querySelector("[data-menu-panel]");
  const closeButtons = document.querySelectorAll("[data-menu-close]");
  const menuLinks = document.querySelectorAll("[data-menu-link]");

  if (!openButton || !overlay || !panel) {
    return;
  }

  const setMenuState = (isOpen) => {
    openButton.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("overflow-hidden", isOpen);

    overlay.classList.toggle("pointer-events-none", !isOpen);
    overlay.classList.toggle("opacity-0", !isOpen);
    overlay.classList.toggle("backdrop-blur-none", !isOpen);
    overlay.classList.toggle("backdrop-blur-xl", isOpen);

    panel.classList.toggle("opacity-0", !isOpen);
    panel.classList.toggle("-translate-y-4", !isOpen);
    panel.classList.toggle("translate-y-0", isOpen);
  };

  openButton.addEventListener("click", () => setMenuState(true));

  closeButtons.forEach((button) => {
    button.addEventListener("click", () => setMenuState(false));
  });

  menuLinks.forEach((link) => {
    link.addEventListener("click", () => setMenuState(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuState(false);
    }
  });
}
