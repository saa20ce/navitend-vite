export function createDoctorsCard({ id, surname, name, description, icon }) {
  return `
    <div
      class="flex w-full flex-col flex-nowrap justify-between gap-8 rounded-[20px] bg-[#F4F4F4] bg-[url('./assets/ellipse.svg')] p-7 lg:p-[32px] lg:pb-[36px]  text-left transition-colors duration-200 hover:bg-[#EDEDED]"
    >
      <div class="flex flex-col flex-nowrap items-left">
        <div class="flex h-[110px] w-[110px] shrink-0 items-left justify-center lg:h-[140px] lg:w-[140px] lg:mb-[24px]">
          <img src="${icon}" alt="" class="w-auto" />
        </div>

        <div class="text-left text-base font-[600] leading-[150%] text-[#4F4F4F] lg:text-xl lg:mb-[16px]">
          <span class="font-bold">${surname}</span>
          <br>
          <span class="font-semibold">${name}</span>
        </div>

        ${description}
      </div>

      <a 
        href="javascript:void(0)"
        data-doctor-trigger
        data-doctor-id="${id}"
				class="inline-flex h-[45px] w-[107px] items-center justify-center rounded-[16px] border border-[#FF7948] p-[12px] text-[16px] font-[600] text-[#FF7948] lg:h-[52px] lg:w-[131px] lg:text-[18px]">
				Подробнее
			</a>
    </div>
  `;
}

export function renderDoctors(container, doctors) {
  if (!container) return;
  container.innerHTML = doctors.map(createDoctorsCard).join("");
}
