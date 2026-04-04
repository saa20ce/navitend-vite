export function createServiceCard({ id, title, icon }) {
  return `
    <button
      type="button"
      data-service-trigger
      data-service-id="${id}"
      class="flex w-full flex-row flex-nowrap justify-between gap-3 rounded-[20px] bg-[#F4F4F4] p-7 text-left transition-colors duration-200 hover:bg-[#EDEDED]"
    >
      <div class="flex flex-row flex-nowrap items-center gap-3">
        <div class="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-white lg:h-[58px] lg:w-[58px]">
          <img src="${icon}" alt="" class="w-auto" />
        </div>

        <div class="text-left text-base font-[600] leading-[120%] text-[#4F4F4F] lg:text-xl">
          ${title}
        </div>
      </div>

      <img
        src="./assets/chevronRight.svg"
        alt=""
        class="w-auto self-center"
      />
    </button>
  `;
}

export function renderServices(container, services) {
  if (!container) {
    console.error("Container not found");
    return;
  }
  container.innerHTML = services.map(createServiceCard).join("");
}
