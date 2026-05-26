export function createDoctorsCard({ id, surname, name, description, icon }, options = {}) {
  const {
    className = "",
    imageWrapperClassName = "",
    titleClassName = "",
    buttonClassName = "",
  } = options;

  return `
    <div
      class="flex w-full flex-col flex-nowrap justify-between gap-8 rounded-[20px] bg-[#F4F4F4] bg-[url('./assets/ellipse.svg')] p-7 text-left transition-colors duration-200 hover:bg-[#EDEDED] lg:p-[32px] lg:pb-[36px] ${className}"
    >
      <div class="flex flex-col flex-nowrap items-left">
        <div class="flex h-[110px] w-[110px] shrink-0 items-left justify-center lg:mb-[24px] lg:h-[140px] lg:w-[140px] ${imageWrapperClassName}">
          <img src="${icon}" alt="" class="w-auto" />
        </div>

        <div class="text-left text-base font-[600] leading-[150%] text-[#4F4F4F] lg:mb-[16px] lg:text-xl ${titleClassName}">
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
        class="inline-flex h-[45px] w-[107px] items-center justify-center rounded-[16px] border border-[#FF7948] p-[12px] text-[16px] font-[600] text-[#FF7948] transition-colors duration-200 hover:border-[#FF946D] hover:bg-[#FF946D] hover:text-white lg:h-[52px] lg:w-[131px] lg:text-[18px] ${buttonClassName}"
      >
        Подробнее
      </a>
    </div>
  `;
}

function createDoctorsMobileSlide(doctor) {
  return `
    <article class="doctor-mobile-slide w-full shrink-0 px-2 md:w-1/2 xl:w-full xl:px-0">
      ${createDoctorsCard(doctor, {
    className: "min-h-full gap-[28px] p-[24px]",
    imageWrapperClassName: "mb-[20px]",
    titleClassName: "mb-[14px] text-[18px]",
  })}
    </article>
  `;
}

export function renderDoctors(container, doctors, mobileTrack) {
  if (!container && !mobileTrack) {
    console.error("Container not found");
    return;
  }

  if (container) {
    container.innerHTML = doctors.map((doctor) => createDoctorsCard(doctor)).join("");
  }

  if (mobileTrack) {
    mobileTrack.innerHTML = doctors.map(createDoctorsMobileSlide).join("");
  }
}
