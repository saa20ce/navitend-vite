const PHONE_DIGITS_COUNT = 11;
const API_ENDPOINT = "/api/contact";

function getDigits(value) {
  return value.replace(/\D/g, "");
}

function formatPhone(value) {
  let digits = getDigits(value);

  if (!digits) {
    return "";
  }

  if (digits[0] === "8") {
    digits = `7${digits.slice(1)}`;
  }

  if (digits[0] !== "7") {
    digits = `7${digits}`;
  }

  digits = digits.slice(0, PHONE_DIGITS_COUNT);

  let result = "+7";

  if (digits.length > 1) {
    result += ` (${digits.slice(1, 4)}`;
  }

  if (digits.length >= 5) {
    result += `) ${digits.slice(4, 7)}`;
  }

  if (digits.length >= 8) {
    result += `-${digits.slice(7, 9)}`;
  }

  if (digits.length >= 10) {
    result += `-${digits.slice(9, 11)}`;
  }

  return result;
}

function markField(input, hasError) {
  input.classList.toggle("border-[#FF6B57]", hasError);
  input.classList.toggle("ring-2", hasError);
  input.classList.toggle("ring-[#FF6B57]/20", hasError);
}

function validateForm(form) {
  const nameInput = form.querySelector('input[name="name"]');
  const phoneInput = form.querySelector('input[name="phone"]');

  if (!(nameInput instanceof HTMLInputElement) || !(phoneInput instanceof HTMLInputElement)) {
    return false;
  }

  const isNameValid = nameInput.value.trim().length >= 2;
  const isPhoneValid = getDigits(phoneInput.value).length === PHONE_DIGITS_COUNT;

  markField(nameInput, !isNameValid);
  markField(phoneInput, !isPhoneValid);

  if (!isNameValid) {
    nameInput.focus();
    return false;
  }

  if (!isPhoneValid) {
    phoneInput.focus();
    return false;
  }

  return true;
}

function getStatusElement(form) {
  let statusElement = form.querySelector("[data-contact-form-status]");

  if (!(statusElement instanceof HTMLElement)) {
    statusElement = document.createElement("p");
    statusElement.dataset.contactFormStatus = "true";
    statusElement.className =
      "mt-[12px] w-full basis-full text-[14px] leading-[1.4] text-[#6A6A6A]";
    form.append(statusElement);
  }

  return statusElement;
}

function setStatus(form, message, type = "neutral") {
  const statusElement = getStatusElement(form);

  statusElement.textContent = message;
  statusElement.classList.remove("text-[#6A6A6A]", "text-[#27AE60]", "text-[#D64545]");

  if (type === "success") {
    statusElement.classList.add("text-[#27AE60]");
    return;
  }

  if (type === "error") {
    statusElement.classList.add("text-[#D64545]");
    return;
  }

  statusElement.classList.add("text-[#6A6A6A]");
}

function getFormPayload(form) {
  const formData = new FormData(form);

  return {
    name: String(formData.get("name") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
    source: form.dataset.formSource || "site-form",
    doctor: String(formData.get("doctor") || "").trim(),
    pageUrl: window.location.href,
  };
}

async function submitContactForm(form) {
  const submitButton = form.querySelector('button[type="submit"]');
  const initialButtonText = submitButton?.textContent ?? "";

  if (submitButton instanceof HTMLButtonElement) {
    submitButton.disabled = true;
    submitButton.textContent = "Отправляем...";
    submitButton.classList.add("opacity-70", "cursor-not-allowed");
  }

  setStatus(form, "Отправляем заявку...");

  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(getFormPayload(form)),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.error || "Не удалось отправить заявку.");
    }

    setStatus(form, "Заявка отправлена. Мы скоро свяжемся с вами.", "success");
    form.reset();
    form.dispatchEvent(new CustomEvent("contactform:success"));
  } catch (error) {
    setStatus(
      form,
      error instanceof Error ? error.message : "Не удалось отправить заявку. Попробуйте еще раз.",
      "error",
    );
  } finally {
    if (submitButton instanceof HTMLButtonElement) {
      submitButton.disabled = false;
      submitButton.textContent = initialButtonText;
      submitButton.classList.remove("opacity-70", "cursor-not-allowed");
    }
  }
}

export function initContactForms() {
  const forms = document.querySelectorAll("[data-contact-form]");
  const phoneInputs = document.querySelectorAll("[data-phone-input]");

  phoneInputs.forEach((input) => {
    input.addEventListener("input", () => {
      input.value = formatPhone(input.value);
      markField(input, false);
    });

    input.addEventListener("focus", () => {
      if (!input.value) {
        input.value = "+7";
      }
    });

    input.addEventListener("blur", () => {
      if (input.value === "+7") {
        input.value = "";
      }
    });
  });

  forms.forEach((form) => {
    const nameInput = form.querySelector('input[name="name"]');
    const phoneInput = form.querySelector('input[name="phone"]');

    if (nameInput instanceof HTMLInputElement) {
      nameInput.addEventListener("input", () => {
        markField(nameInput, false);
      });
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!validateForm(form)) {
        return;
      }

      await submitContactForm(form);
    });

    if (phoneInput instanceof HTMLInputElement) {
      phoneInput.value = formatPhone(phoneInput.value);
    }
  });
}
