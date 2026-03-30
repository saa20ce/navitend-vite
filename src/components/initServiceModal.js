export function initServiceModal(pricesData) {
  const overlay = document.querySelector("[data-service-modal-overlay]");
  const panel = document.querySelector("[data-service-modal-panel]");
  const title = document.querySelector("[data-service-modal-title]");
  const description = document.querySelector("[data-service-modal-description]");
  const tableBody = document.querySelector("[data-service-modal-table]");
  const closeButtons = document.querySelectorAll("[data-service-modal-close]");
  const triggers = document.querySelectorAll("[data-service-trigger]");

  if (!overlay || !panel || !title || !description || !tableBody || !triggers.length) {
    return;
  }

  const pricesMap = new Map(pricesData.map((service) => [service.id, service]));

  const setModalState = (isOpen) => {
    overlay.classList.toggle("pointer-events-none", !isOpen);
    overlay.classList.toggle("opacity-0", !isOpen);
    overlay.classList.toggle("backdrop-blur-none", !isOpen);
    overlay.classList.toggle("backdrop-blur-xl", isOpen);

    panel.classList.toggle("opacity-0", !isOpen);
    panel.classList.toggle("-translate-y-4", !isOpen);
    panel.classList.toggle("translate-y-0", isOpen);
    panel.classList.toggle("lg:-translate-y-[calc(50%)]", isOpen);

    document.body.classList.toggle("overflow-hidden", isOpen);
  };

  const renderRows = (rows) =>
    rows
      .map(
        ({ name, price }, index) => `
          <tr>
            <td class="align-top border-r border-[#B9B0A7] px-[16px] py-[12px] text-[16px] lg:text-[14px] leading-[1.4] text-[#5B5B5B] lg:px-[20px] lg:py-[16px] lg:text-[16px] ${index < rows.length - 1 ? "border-b" : ""} border-[#B9B0A7]">
              ${name}
            </td>
            <td class="align-middle px-[16px] py-[18px] text-[14px] font-[700] leading-[1.2] text-[#FF6F3D] lg:px-[20px] lg:text-[16px] ${index < rows.length - 1 ? "border-b" : ""} border-[#B9B0A7]">
              ${price}
            </td>
          </tr>
        `,
      )
      .join("");

  const openModal = (serviceId) => {
    const service = pricesMap.get(serviceId);

    if (!service) {
      return;
    }

    title.textContent = `${service.title}:`;
    description.textContent = service.description;
    tableBody.innerHTML = renderRows(service.prices);
    setModalState(true);
  };

  const closeModal = () => {
    setModalState(false);
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      openModal(trigger.dataset.serviceId);
    });
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });
}
