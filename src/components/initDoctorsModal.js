function formatTitleParts(title) {
  const words = title
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());

  return {
    surname: words[0] ?? "",
    name: words.slice(1).join(" "),
  };
}

function renderAccreditation(items) {
  return items
    .map(
      ({ name, date }) => `
        <li class="flex gap-[10px]">
          <span class="mt-[6px] h-[7px] w-[7px] shrink-0 rounded-full bg-[#5A5A5A]"></span>
          <div>
            <p class="text-[18px] font-[700] leading-[1.18] text-[#575757]">${name}</p>
            <p class="mt-[8px] text-[18px] leading-[1.12] text-[#8A8A8A]">Аккредитация до ${date.replace(/г\.?$/, " г.")}</p>
          </div>
        </li>
      `,
    )
    .join("");
}

export function initDoctorsModal(doctorsData) {
  const overlay = document.querySelector("[data-doctor-modal-overlay]");
  const panel = document.querySelector("[data-doctor-modal-panel]");
  const photo = document.querySelector("[data-doctor-modal-photo]");
  const surname = document.querySelector("[data-doctor-modal-surname]");
  const name = document.querySelector("[data-doctor-modal-name]");
  const experience = document.querySelector("[data-doctor-modal-experience]");
  const list = document.querySelector("[data-doctor-modal-list]");
  const education = document.querySelector("[data-doctor-modal-education]");
  const form = document.querySelector("[data-doctor-modal-form]");
  const formSection = document.querySelector("[data-doctor-modal-form-section]");
  // const mobileCta = document.querySelector("[data-doctor-modal-mobile-cta]");
  // const scrollTrigger = document.querySelector("[data-doctor-modal-scroll-trigger]");
  const closeButtons = document.querySelectorAll("[data-doctor-modal-close]");
  const triggers = document.querySelectorAll("[data-doctor-trigger]");

  if (
    !overlay ||
    !panel ||
    !photo ||
    !surname ||
    !name ||
    !experience ||
    !list ||
    !education ||
    !form ||
    !formSection ||
    // !mobileCta ||
    // !scrollTrigger ||
    !triggers.length
  ) {
    console.error("Missing doctors modal elements");
    return;
  }

  const doctorsMap = new Map(doctorsData.map((doctor) => [doctor.id, doctor]));

  // const updateMobileCtaVisibility = () => {
  //   if (window.innerWidth >= 1024) {
  //     mobileCta.classList.add("opacity-0", "pointer-events-none");
  //     return;
  //   }

  //   const panelRect = panel.getBoundingClientRect();
  //   const formRect = formSection.getBoundingClientRect();
  //   const isFormReached = formRect.top <= panelRect.bottom - 120;

  //   mobileCta.classList.toggle("opacity-0", isFormReached);
  //   mobileCta.classList.toggle("pointer-events-none", isFormReached);
  // };

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

    if (isOpen) {
      panel.scrollTo({ top: 0, behavior: "auto" });
      // updateMobileCtaVisibility();
    }
  };

  const openModal = (doctorId) => {
    const doctor = doctorsMap.get(doctorId);

    if (!doctor) {
      console.error(`Doctor with id ${doctorId} not found`);
      return;
    }

    const titleParts = formatTitleParts(doctor.title);

    photo.src = doctor.photo;
    photo.alt = doctor.title;
    surname.textContent = titleParts.surname;
    name.textContent = titleParts.name;
    experience.textContent = `Опыт работы: ${doctor.experience}`;
    list.innerHTML = renderAccreditation(doctor.accreditation);
    education.textContent = doctor.education;

    setModalState(true);
  };

  const closeModal = () => {
    setModalState(false);
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      openModal(trigger.dataset.doctorId);
    });
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  // scrollTrigger.addEventListener("click", () => {
  //   formSection.scrollIntoView({ behavior: "smooth", block: "start" });
  // });

  // panel.addEventListener("scroll", updateMobileCtaVisibility);
  // window.addEventListener("resize", updateMobileCtaVisibility);

  form.addEventListener("contactform:success", closeModal);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });
}
