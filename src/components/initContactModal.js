export function initContactModal() {
  const overlay = document.querySelector("[data-contact-modal-overlay]");
  const panel = document.querySelector("[data-contact-modal-panel]");
  const form = document.querySelector("[data-contact-modal-form]");
  const closeButtons = document.querySelectorAll("[data-contact-modal-close]");
  const triggers = document.querySelectorAll("[data-contact-modal-open]");

  if (!overlay || !panel || !form || !triggers.length) {
    console.error("Missing contact modal elements");
    return;
  }

  const setModalState = (isOpen) => {
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
    setModalState(false);
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();

      if (trigger.closest("[data-menu-panel]")) {
        const menuCloseButton = document.querySelector("[data-menu-close]");

        if (menuCloseButton instanceof HTMLElement) {
          menuCloseButton.click();
        }
      }

      setModalState(true);
    });
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  form.addEventListener("contactform:success", () => {
    closeModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });
}
