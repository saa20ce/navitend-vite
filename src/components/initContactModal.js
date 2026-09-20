export function initContactModal() {
  const overlay = document.querySelector("[data-contact-modal-overlay]");
  const panel = document.querySelector("[data-contact-modal-panel]");
  const form = document.querySelector("[data-contact-modal-form]");
  const closeButtons = document.querySelectorAll("[data-contact-modal-close]");
  const triggers = document.querySelectorAll("[data-contact-modal-open]");
  const entry = panel?.querySelector("[data-contact-modal-entry]");
  const success = panel?.querySelector("[data-contact-modal-success]");
  let returnFocus = null;
  let isModalOpen = false;

  if (!overlay || !panel || !form || !entry || !success) {
    console.error("Missing contact modal elements");
    return;
  }

  const setModalState = (isOpen) => {
    isModalOpen = isOpen;
    overlay.inert = !isOpen;
    overlay.setAttribute("aria-hidden", String(!isOpen));
    overlay.classList.toggle("pointer-events-none", !isOpen);
    overlay.classList.toggle("opacity-0", !isOpen);
    overlay.classList.toggle("backdrop-blur-none", !isOpen);
    overlay.classList.toggle("backdrop-blur-xl", isOpen);

    panel.classList.toggle("opacity-0", !isOpen);
    panel.classList.toggle("-translate-y-4", !isOpen);
    panel.classList.toggle("translate-y-0", isOpen);
    panel.classList.toggle("lg:-translate-y-[calc(50%+16px)]", !isOpen);
    panel.classList.toggle("lg:-translate-y-1/2", isOpen);

    document.body.classList.toggle("overflow-hidden", isOpen);
  };

  const closeModal = () => {
    if (!isModalOpen) return;
    setModalState(false);
    returnFocus?.focus();
  };

  const setView = (showSuccess) => {
    entry.hidden = showSuccess;
    success.hidden = !showSuccess;
    panel.dataset.state = showSuccess ? "success" : "form";
    panel.setAttribute("aria-labelledby", showSuccess ? "contact-success-title" : "contact-modal-title");
  };

  overlay.inert = true;
  overlay.setAttribute("aria-hidden", "true");

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();

      if (trigger.closest("[data-menu-panel]")) {
        const menuCloseButton = document.querySelector("[data-menu-close]");

        if (menuCloseButton instanceof HTMLElement) {
          menuCloseButton.click();
        }
      }

      returnFocus = trigger;
      setView(false);
      form.querySelector("[data-contact-form-status]")?.remove();
      setModalState(true);
      form.querySelector("input")?.focus();
    });
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  document.addEventListener("contactform:success", () => {
    if (!isModalOpen) returnFocus = document.activeElement;
    setView(true);
    setModalState(true);
    success.querySelector("button").focus();
  });

  document.addEventListener("keydown", (event) => {
    if (!isModalOpen) return;
    if (event.key === "Escape") {
      closeModal();
    }
    if (event.key === "Tab") {
      const view = success.hidden ? entry : success;
      const focusable = [...view.querySelectorAll('button:not(:disabled), input:not(:disabled), a[href]')];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
  });
}
