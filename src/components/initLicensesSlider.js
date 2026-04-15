function createDot(index, isActive) {
  return `
    <button
      type="button"
      data-licenses-dot
      data-index="${index}"
      aria-label="Перейти к слайду ${index + 1}"
      class="rounded-full transition-all duration-200 ${isActive ? "bg-[#FF7848] h-[16px] w-[16px]" : "bg-[#8F8F8F] h-[10px] w-[10px]"}"
    ></button>
  `;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function initLicensesSlider(items) {
  const viewport = document.querySelector("[data-licenses-viewport]");
  const track = document.querySelector("[data-licenses-track]");
  const dots = document.querySelector("[data-licenses-dots]");
  const prevBtn = document.querySelector("[data-licenses-prev]");
  const nextBtn = document.querySelector("[data-licenses-next]");

  if (!viewport || !track || !dots || !prevBtn || !nextBtn || !items?.length) {
    return;
  }

  let currentIndex = 0;
  let startX = 0;
  let startY = 0;
  let dragOffset = 0;
  let isPointerDown = false;
  let isDragging = false;
  let blockSlideClick = false;

  const getVisibleCount = () => (window.innerWidth >= 1024 ? 4 : 1);
  const getGap = () => (window.innerWidth >= 1024 ? 18 : 14);
  const getMaxIndex = () => Math.max(0, items.length - getVisibleCount());
  const isMobileViewport = () => window.innerWidth < 1024;

  const renderSlides = () => {
    track.innerHTML = items
      .map(
        ({ src, alt }) => `
          <a
            href="${src}"
            target="_blank"
            rel="noopener noreferrer"
            class="licenses-slide shrink-0 bg-transparent"
            data-licenses-slide-link
          >
            <div class="flex h-[100%] items-center justify-center overflow-hidden bg-white lg:h-[620px]">
              <img src="${src}" alt="${alt}" class="h-full w-full object-contain" />
            </div>
          </a>
        `,
      )
      .join("");

    track.querySelectorAll("[data-licenses-slide-link]").forEach((link) => {
      link.addEventListener("click", (event) => {
        if (blockSlideClick) {
          event.preventDefault();
        }
      });
    });
  };

  const updateSlideSizes = () => {
    const visibleCount = getVisibleCount();
    const slideWidth = (viewport.clientWidth - getGap() * (visibleCount - 1)) / visibleCount;

    track.querySelectorAll(".licenses-slide").forEach((slide) => {
      slide.style.width = `${slideWidth}px`;
    });
  };

  const renderDots = () => {
    const maxIndex = getMaxIndex();

    dots.innerHTML = Array.from({ length: maxIndex + 1 }, (_, index) =>
      createDot(index, index === currentIndex),
    ).join("");

    dots.querySelectorAll("[data-licenses-dot]").forEach((dot) => {
      dot.addEventListener("click", () => {
        currentIndex = Number(dot.dataset.index);
        updatePosition();
      });
    });
  };

  const updateButtons = () => {
    const maxIndex = getMaxIndex();
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === maxIndex;
    prevBtn.classList.toggle("opacity-40", currentIndex === 0);
    nextBtn.classList.toggle("opacity-40", currentIndex === maxIndex);
  };

  const updatePosition = () => {
    const slide = track.querySelector(".licenses-slide");

    if (!slide) {
      return;
    }

    currentIndex = clamp(currentIndex, 0, getMaxIndex());
    const offset = currentIndex * (slide.clientWidth + getGap()) - dragOffset;
    track.style.transform = `translateX(-${offset}px)`;

    renderDots();
    updateButtons();
  };

  prevBtn.addEventListener("click", () => {
    currentIndex -= 1;
    dragOffset = 0;
    updatePosition();
  });

  nextBtn.addEventListener("click", () => {
    currentIndex += 1;
    dragOffset = 0;
    updatePosition();
  });

  function onPointerDown(event) {
    if (!isMobileViewport()) {
      return;
    }

    isPointerDown = true;
    isDragging = false;
    blockSlideClick = false;
    startX = event.clientX;
    startY = event.clientY;
    dragOffset = 0;
    track.style.transition = "none";
  }

  function onPointerMove(event) {
    if (!isPointerDown || !isMobileViewport()) {
      return;
    }

    const diffX = event.clientX - startX;
    const diffY = event.clientY - startY;

    if (!isDragging) {
      if (Math.abs(diffX) < 8) {
        return;
      }

      if (Math.abs(diffY) > Math.abs(diffX)) {
        isPointerDown = false;
        return;
      }

      isDragging = true;
      blockSlideClick = true;
    }

    const isAtFirstSlide = currentIndex === 0;
    const isAtLastSlide = currentIndex === getMaxIndex();
    const isPullingPastFirst = isAtFirstSlide && diffX > 0;
    const isPullingPastLast = isAtLastSlide && diffX < 0;

    dragOffset = isPullingPastFirst || isPullingPastLast ? diffX * 0.35 : diffX;
    updatePosition();
  }

  function onPointerEnd() {
    if (!isMobileViewport()) {
      return;
    }

    if (!isPointerDown && !isDragging) {
      return;
    }

    const threshold = viewport.offsetWidth * 0.18;
    const diff = dragOffset;

    isPointerDown = false;

    if (!isDragging) {
      return;
    }

    isDragging = false;

    if (diff <= -threshold) {
      currentIndex += 1;
    } else if (diff >= threshold) {
      currentIndex -= 1;
    }

    dragOffset = 0;
    track.style.transition = "transform 0.28s ease";
    updatePosition();

    window.setTimeout(() => {
      blockSlideClick = false;
    }, 80);
  }

  viewport.addEventListener("pointerdown", onPointerDown);
  viewport.addEventListener("pointermove", onPointerMove);
  viewport.addEventListener("pointerup", onPointerEnd);
  viewport.addEventListener("pointercancel", onPointerEnd);
  viewport.addEventListener("pointerleave", onPointerEnd);

  window.addEventListener("resize", () => {
    currentIndex = clamp(currentIndex, 0, getMaxIndex());
    dragOffset = 0;
    updateSlideSizes();
    updatePosition();
  });

  renderSlides();
  updateSlideSizes();
  updatePosition();
}
