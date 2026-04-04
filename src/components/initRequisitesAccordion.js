export function initRequisitesAccordion() {
  const items = document.querySelectorAll("[data-requisite-item]");

  if (!items.length) {
    console.error("Requisites accordion error");
    return;
  }

  const setItemState = (item, isOpen) => {
    const trigger = item.querySelector("[data-requisite-trigger]");
    const content = item.querySelector("[data-requisite-content]");
    const icon = item.querySelector("[data-requisite-icon]");
    const text = item.querySelector("[data-requisite-title]");

    if (!trigger || !content || !icon || !text) {
      console.error("Requisites accordion error");
      return;
    }

    trigger.setAttribute("aria-expanded", String(isOpen));

    content.classList.toggle("hidden", !isOpen);
    content.classList.toggle("block", isOpen);
    content.classList.toggle("mt-[14px]", isOpen);
    content.classList.toggle("lg:mt-[16px]", isOpen);

    icon.classList.toggle("rotate-90", isOpen);
    icon.classList.toggle("rotate-0", !isOpen);

    text.classList.toggle("text-[#FF7948]", isOpen);
    text.classList.toggle("text-[#4f4f4f]", !isOpen);
  };

  items.forEach((item) => {
    const trigger = item.querySelector("[data-requisite-trigger]");

    if (!trigger) {
      console.error("Requisites accordion error");
      return;
    }

    trigger.addEventListener("click", () => {
      const isExpanded = trigger.getAttribute("aria-expanded") === "true";

      items.forEach((otherItem) => {
        setItemState(otherItem, false);
      });

      setItemState(item, !isExpanded);
    });
  });
}
