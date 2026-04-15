function createDot(index, isActive) {
	return `
    <button
      type="button"
      class="cursor-pointer banner-dot rounded-full transition-all duration-200 ${
				isActive ? 'bg-[#FF7948] h-[14px] w-[14px]' : 'bg-[#8F8F8F] h-[8px] w-[8px]'
			}"
      data-index="${index}"
      aria-label="Перейти к баннеру ${index + 1}"
    ></button>
  `;
}

function createMobileSlide(slide) {
	return `
    <article
      class="banner-mobile-slide relative h-full w-full shrink-0 overflow-hidden rounded-[20px] bg-cover bg-center px-[20px] py-[28px]"
      style="background-image:url('${slide.mobileBg}')"
    >
      <div class="relative z-10 flex max-w-[230px] flex-col items-start gap-[14px]">
        <h2 class="text-[24px]/[120%] font-[800] text-[#4F4F4F]">${slide.title}</h2>
        <p class="text-[14px] font-semibold text-[#4F4F4F]">${slide.text1}</p>
        <p class="text-[12px] font-[400] text-[#4F4F4F]">${slide.text2}</p>
        <a
          href="${slide.href || '#'}"
          data-contact-modal-open
          class="mt-1.5 inline-flex h-[45px] w-[107px] items-center justify-center rounded-[16px] border border-[#FF7948] p-[12px] text-[16px] font-[600] text-[#FF7948]"
        >
          Подробнее
        </a>
      </div>

      <img
        src="${slide.mobileImage}"
        alt="${slide.imageAlt || ''}"
        class="absolute bottom-0 right-[-20px] z-10 h-[198px] w-[198px] rounded-e-[20px]"
      />
    </article>
  `;
}

export function initBannerSlider(slides) {
	if (!slides?.length) {
		console.error('Missing banner slides');
		return;
	}

	const sliderEl = document.querySelector('#banner-slider');
	const mobileTrackEl = document.querySelector('[data-banner-mobile-track]');
	const titleEl = document.querySelector('#banner-title');
	const text1El = document.querySelector('#banner-text-1');
	const text2El = document.querySelector('#banner-text-2');
	const linkEl = document.querySelector('#banner-link');
	const desktopImageEl = document.querySelector('#banner-image-desktop');
	const bgEl = document.querySelector('#banner-background');
	const dotsEl = document.querySelector('#banner-dots');
	const prevBtn = document.querySelector('#banner-prev');
	const nextBtn = document.querySelector('#banner-next');

	if (
		!sliderEl ||
		!mobileTrackEl ||
		!titleEl ||
		!text1El ||
		!text2El ||
		!linkEl ||
		!desktopImageEl ||
		!bgEl ||
		!dotsEl ||
		!prevBtn ||
		!nextBtn
	) {
		console.error('Missing banner elements');
		return;
	}

	let currentIndex = 0;
	let startX = 0;
	let startY = 0;
	let dragOffset = 0;
	let isPointerDown = false;
	let isDragging = false;
	let blockLinkClick = false;

	const isMobileViewport = () => window.innerWidth < 1024;
	const getMaxIndex = () => slides.length - 1;

	const getSlideWidth = () => sliderEl.offsetWidth;

	const setMobileTranslate = (offset, withAnimation = false) => {
		mobileTrackEl.style.transition = withAnimation ? 'transform 0.28s ease' : 'none';
		mobileTrackEl.style.transform = `translate3d(${offset}px, 0, 0)`;
	};

	const updateMobilePosition = (withAnimation = false) => {
		const baseOffset = -currentIndex * getSlideWidth();
		setMobileTranslate(baseOffset + dragOffset, withAnimation);
	};

	function renderDots() {
		dotsEl.innerHTML = slides.map((_, index) => createDot(index, index === currentIndex)).join('');

		dotsEl.querySelectorAll('.banner-dot').forEach((dot) => {
			dot.addEventListener('click', () => {
				currentIndex = Number(dot.dataset.index);
				dragOffset = 0;
				renderSlide();
			});
		});
	}

	function renderDesktopSlide() {
		const slide = slides[currentIndex];

		titleEl.innerHTML = slide.title;
		text1El.innerHTML = slide.text1;
		text2El.innerHTML = slide.text2;
		linkEl.href = slide.href || '#';

		desktopImageEl.src = slide.desktopImage;
		desktopImageEl.alt = slide.imageAlt || '';
		bgEl.style.backgroundImage = `url('${slide.desktopBg}')`;
	}

	function renderMobileSlides() {
		mobileTrackEl.innerHTML = slides.map(createMobileSlide).join('');

		mobileTrackEl.querySelectorAll('[data-contact-modal-open]').forEach((link) => {
			link.addEventListener('click', (event) => {
				if (blockLinkClick) {
					event.preventDefault();
				}
			});
		});
	}

	function renderSlide() {
		renderDots();

		if (isMobileViewport()) {
			updateMobilePosition(true);
			return;
		}

		renderDesktopSlide();
	}

	function goToPrev() {
		currentIndex = currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
		dragOffset = 0;
		renderSlide();
	}

	function goToNext() {
		currentIndex = currentIndex === slides.length - 1 ? 0 : currentIndex + 1;
		dragOffset = 0;
		renderSlide();
	}

	function onPointerDown(event) {
		if (!isMobileViewport()) {
			return;
		}

		isPointerDown = true;
		isDragging = false;
		blockLinkClick = false;
		startX = event.clientX;
		startY = event.clientY;
		dragOffset = 0;
		mobileTrackEl.style.transition = 'none';
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
			blockLinkClick = true;
		}

		const isAtFirstSlide = currentIndex === 0;
		const isAtLastSlide = currentIndex === getMaxIndex();
		const isPullingPastFirst = isAtFirstSlide && diffX > 0;
		const isPullingPastLast = isAtLastSlide && diffX < 0;

		if (isPullingPastFirst || isPullingPastLast) {
			dragOffset = diffX * 0.35;
		} else {
			dragOffset = diffX;
		}

		updateMobilePosition(false);
	}

	function onPointerEnd() {
		if (!isMobileViewport()) {
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

		if (diff <= -threshold) {
			goToNext();
		} else if (diff >= threshold) {
			goToPrev();
		} else {
			dragOffset = 0;
			updateMobilePosition(true);
		}

		window.setTimeout(() => {
			blockLinkClick = false;
		}, 80);
	}

	prevBtn.addEventListener('click', goToPrev);
	nextBtn.addEventListener('click', goToNext);

	linkEl.addEventListener('click', (event) => {
		if (blockLinkClick) {
			event.preventDefault();
		}
	});

	sliderEl.addEventListener('pointerdown', onPointerDown);
	sliderEl.addEventListener('pointermove', onPointerMove);
	sliderEl.addEventListener('pointerup', onPointerEnd);
	sliderEl.addEventListener('pointercancel', onPointerEnd);
	sliderEl.addEventListener('pointerleave', onPointerEnd);

	window.addEventListener('resize', () => {
		dragOffset = 0;
		renderSlide();
	});

	renderMobileSlides();
	renderDesktopSlide();
	renderSlide();
}
