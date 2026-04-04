function createAccordionItem({ id, title, content, isOpen }) {
  return `
    <article
      data-requisite-item
      class="w-full rounded-[22px] bg-white px-[16px] py-[14px] shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_3px_8px_rgba(0,0,0,0.04)] lg:rounded-[26px] lg:px-[22px] lg:py-[16px]"
    >
      <button
        type="button"
        data-requisite-trigger
        aria-expanded="${isOpen}"
        aria-controls="${id}"
        class="flex cursor-pointer w-full items-center justify-between gap-[16px] text-left"
      >
        <span 
          data-requisite-title 
          class="${isOpen ? "text-[#FF7948]" : "text-[#4f4f4f]"} text-[16px] font-[800] leading-[1.15] lg:text-[18px]"
        >
          ${title}
        </span>
        <span class="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-[#F6F4F2] lg:h-[40px] lg:w-[40px]">
          <img
            src="./assets/chevronRight.svg"
            alt=""
            data-requisite-icon
            class="h-[14px] w-auto transition duration-200 ${isOpen ? "rotate-90" : "rotate-0"}"
          />
        </span>
      </button>

      <div
        id="${id}"
        data-requisite-content
        class="${isOpen ? "mt-[14px] block" : "hidden"} overflow-hidden lg:mt-[16px]"
      >
        ${content}
      </div>
    </article>
  `;
}

export function renderRequisitesAccordion(container, items) {
  if (!container) {
    console.error("Container not found");
    return;
  }

  container.innerHTML = items.map(createAccordionItem).join("");
}
