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
            <p class="mt-[8px] text-[18px] leading-[1.12] text-[#8A8A8A]">Аккредитация до ${date.replace(/Рі\.?$/, " Рі.")}</p>
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
  const doctorField = document.querySelector("[data-doctor-name-field]");
  const formSection = document.querySelector("[data-doctor-modal-form-section]");
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
    !doctorField ||
    !formSection ||
    !triggers.length
  ) {
    console.error("Missing doctors modal elements");
    return;
  }

  const doctorsMap = new Map(doctorsData.map((doctor) => [doctor.id, doctor]));

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
    doctorField.value = doctor.title;
    experience.textContent = `Опыт работы: ${doctor.experience}`;
    list.innerHTML = renderAccreditation(doctor.accreditation);
    education.textContent = doctor.education;

    setModalState(true);
  };

  const closeModal = () => {
    doctorField.value = "";
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

  form.addEventListener("contactform:success", closeModal);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });
}
