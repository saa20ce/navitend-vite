function createDot(index, isActive) {
  return `
    <button
      type="button"
      class="doctor-dot rounded-full transition-all duration-200 ${
        isActive ? "bg-[#FF7948] h-[14px] w-[14px]" : "bg-[#8F8F8F] h-[8px] w-[8px]"
      }"
      data-index="${index}"
      aria-label="Перейти к врачу ${index + 1}"
    ></button>
  `;
}

export function initDoctorsSlider(items) {
  const viewport = document.querySelector("[data-doctors-viewport]");
  const track = document.querySelector("[data-doctors-track]");
  const dots = document.querySelector("[data-doctors-dots]");

  if (!viewport || !track || !dots || !items?.length) {
    return;
  }

  let currentIndex = 0;
  let startX = 0;
  let startY = 0;
  let dragOffset = 0;
  let isPointerDown = false;
  let isDragging = false;
  let blockButtonClick = false;

  const isSliderViewport = () => window.innerWidth < 1280;
  const isTabletViewport = () => window.innerWidth >= 768 && window.innerWidth < 1280;
  const getVisibleSlidesCount = () => (isTabletViewport() ? 2 : 1);
  const getMaxIndex = () => Math.max(0, items.length - getVisibleSlidesCount());
  const getSlideWidth = () => viewport.offsetWidth / getVisibleSlidesCount();

  const setTranslate = (offset, withAnimation = false) => {
    track.style.transition = withAnimation ? "transform 0.28s ease" : "none";
    track.style.transform = `translate3d(${offset}px, 0, 0)`;
  };

  const updatePosition = (withAnimation = false) => {
    const baseOffset = -currentIndex * getSlideWidth();
    setTranslate(baseOffset + dragOffset, withAnimation);
  };

  function renderDots() {
    const dotsCount = getMaxIndex() + 1;
    dots.innerHTML = Array.from({ length: dotsCount }, (_, index) => createDot(index, index === currentIndex)).join("");

    dots.querySelectorAll(".doctor-dot").forEach((dot) => {
      dot.addEventListener("click", () => {
        currentIndex = Number(dot.dataset.index);
        dragOffset = 0;
        updatePosition(true);
        renderDots();
      });
    });
  }

  function onPointerDown(event) {
    if (!isSliderViewport()) {
      return;
    }

    isPointerDown = true;
    isDragging = false;
    blockButtonClick = false;
    startX = event.clientX;
    startY = event.clientY;
    dragOffset = 0;
    track.style.transition = "none";
  }

  function onPointerMove(event) {
    if (!isPointerDown || !isSliderViewport()) {
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
      blockButtonClick = true;
    }

    const isAtFirstSlide = currentIndex === 0;
    const isAtLastSlide = currentIndex === getMaxIndex();
    const isPullingPastFirst = isAtFirstSlide && diffX > 0;
    const isPullingPastLast = isAtLastSlide && diffX < 0;

    dragOffset = isPullingPastFirst || isPullingPastLast ? diffX * 0.35 : diffX;
    updatePosition(false);
  }

  function onPointerEnd() {
    if (!isSliderViewport()) {
      return;
    }

    if (!isPointerDown && !isDragging) {
      return;
    }

    const threshold = getSlideWidth() * 0.18;
    const diff = dragOffset;

    isPointerDown = false;

    if (!isDragging) {
      return;
    }

    isDragging = false;

    if (diff <= -threshold && currentIndex < getMaxIndex()) {
      currentIndex += 1;
    } else if (diff >= threshold && currentIndex > 0) {
      currentIndex -= 1;
    }

    dragOffset = 0;
    updatePosition(true);
    renderDots();

    window.setTimeout(() => {
      blockButtonClick = false;
    }, 80);
  }

  track.querySelectorAll("[data-doctor-trigger]").forEach((button) => {
    button.addEventListener("click", (event) => {
      if (blockButtonClick) {
        event.preventDefault();
      }
    });
  });

  viewport.addEventListener("pointerdown", onPointerDown);
  viewport.addEventListener("pointermove", onPointerMove);
  viewport.addEventListener("pointerup", onPointerEnd);
  viewport.addEventListener("pointercancel", onPointerEnd);
  viewport.addEventListener("pointerleave", onPointerEnd);

  window.addEventListener("resize", () => {
    dragOffset = 0;
    currentIndex = Math.min(currentIndex, getMaxIndex());
    updatePosition();
    renderDots();
  });

  renderDots();
  updatePosition();
}
