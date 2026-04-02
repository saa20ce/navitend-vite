const PHONE_DIGITS_COUNT = 11;

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

    form.addEventListener("submit", (event) => {
      if (!validateForm(form)) {
        event.preventDefault();
        return;
      }

      event.preventDefault();
      form.reset();
      form.dispatchEvent(new CustomEvent("contactform:success"));
    });

    if (phoneInput instanceof HTMLInputElement) {
      phoneInput.value = formatPhone(phoneInput.value);
    }
  });
}
