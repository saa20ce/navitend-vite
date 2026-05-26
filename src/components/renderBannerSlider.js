const TABLET_MAX_WIDTH = 1280;
const AUTOPLAY_DELAY = 5000;

function createDot(index, isActive) {
	return `
    <button
      type="button"
      class="cursor-pointer banner-dot rounded-full transition-all duration-200 ${isActive ? 'bg-[#FF7948] h-[14px] w-[14px]' : 'bg-[#8F8F8F] h-[8px] w-[8px]'
		}"
      data-index="${index}"
      aria-label="Перейти к баннеру ${index + 1}"
    ></button>
  `;
}

function createMobileSlide(slide) {
	return `
    <article
      class="banner-mobile-slide relative mx-2 h-full w-[calc(100%-16px)] shrink-0 overflow-hidden rounded-[20px] bg-cover bg-center px-[20px] py-[28px]"
      style="background-image:url('${slide.mobileBg}')"
    >
      <div class="relative z-10 flex flex-col items-start gap-[14px]">
        <h2 class="text-[24px]/[120%] font-[800] text-[#4F4F4F]">${slide.title}</h2>
        <p class="text-[14px] font-semibold text-[#4F4F4F]">${slide.text1}</p>
        <p class="text-[12px] font-[400] text-[#4F4F4F]">${slide.text2}</p>
        <a
          href="${slide.href || '#'}"
          data-contact-modal-open
          class="mt-1.5 inline-flex h-[45px] w-[107px] items-center justify-center rounded-[16px] border border-[#FF7948] p-[12px] text-[16px] font-[600] text-[#FF7948] transition-colors duration-200 hover:border-[#FF946D] hover:bg-[#FF946D] hover:text-white"
        >
          Подробнее
        </a>
      </div>

      <img
        src="${slide.mobileImage}"
        alt="${slide.imageAlt || ''}"
        class="absolute bottom-0 right-[0px] z-10 h-[180px] w-[180px] rounded-e-[20px]"
      />
    </article>
  `;
}

function getTabletBackgroundImageValue(slide) {
	if (slide.tabletBg) {
		return `url('${slide.tabletBg}'), url('${slide.desktopBg}')`;
	}

	return `url('${slide.desktopBg}')`;
}

function createTabletSlide(slide) {
	return `
    <div class="banner-tablet-slide">
      <article
        class="banner-tablet-card"
        style="background-image:${getTabletBackgroundImageValue(slide)}"
      >
        <div class="relative z-10 flex max-w-[360px] flex-col items-start gap-[20px]">
          <h2 class="text-[32px]/[120%] font-[800] text-[#4F4F4F]">${slide.title}</h2>
          <p class="max-w-[600px] text-[16px] font-semibold text-[#4F4F4F]">${slide.text1}</p>
          <p class="text-[14px] font-[400] text-[#4F4F4F]">${slide.text2}</p>
          <a
            href="${slide.href || '#'}"
            data-contact-modal-open
            class="mt-1.5 inline-flex h-[52px] w-[131px] items-center justify-center rounded-[16px] border border-[#FF7948] p-[12px] text-[18px] font-[600] text-[#FF7948] transition-colors duration-200 hover:border-[#FF946D] hover:bg-[#FF946D] hover:text-white"
          >
            Подробнее
          </a>
        </div>

        <img
          src="${slide.desktopImage}"
          alt="${slide.imageAlt || ''}"
          class="absolute bottom-[-22px] right-[-10px] z-10 h-[363px] "
        />
      </article>
    </div>
  `;
}

export function initBannerSlider(slides) {
	if (!slides?.length) {
		console.error('Missing banner slides');
		return;
	}

	const sliderEl = document.querySelector('#banner-slider');
	const mobileTrackEl = document.querySelector('[data-banner-mobile-track]');
	const tabletTrackEl = document.querySelector('[data-banner-tablet-track]');
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
		!tabletTrackEl ||
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
	let autoplayTimer = null;
	let isAutoplayPaused = false;

	const isMobileViewport = () => window.innerWidth < 768;
	const isTabletViewport = () => window.innerWidth >= 768 && window.innerWidth < TABLET_MAX_WIDTH;
	const isSwipeViewport = () => isMobileViewport() || isTabletViewport();
	const getMaxIndex = () => slides.length - 1;

	const getSlideWidth = () => sliderEl.offsetWidth;
	const getActiveSwipeTrack = () => (isTabletViewport() ? tabletTrackEl : mobileTrackEl);

	const setTrackTranslate = (track, offset, withAnimation = false) => {
		track.style.transition = withAnimation ? 'transform 0.28s ease' : 'none';
		track.style.transform = `translate3d(${offset}px, 0, 0)`;
	};

	const updateSwipePosition = (withAnimation = false) => {
		const activeTrack = getActiveSwipeTrack();
		const baseOffset = -currentIndex * getSlideWidth();
		setTrackTranslate(activeTrack, baseOffset + dragOffset, withAnimation);
	};

	const getBackgroundImageValue = (slide) => {
		if (isTabletViewport() && slide.tabletBg) {
			return `url('${slide.tabletBg}'), url('${slide.desktopBg}')`;
		}

		return `url('${slide.desktopBg}')`;
	};

	function renderDots() {
		dotsEl.innerHTML = slides.map((_, index) => createDot(index, index === currentIndex)).join('');

		dotsEl.querySelectorAll('.banner-dot').forEach((dot) => {
			dot.addEventListener('click', () => {
				currentIndex = Number(dot.dataset.index);
				dragOffset = 0;
				renderSlide();
				restartAutoplay();
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
		bgEl.style.backgroundImage = getBackgroundImageValue(slide);
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

	function renderTabletSlides() {
		tabletTrackEl.innerHTML = slides.map(createTabletSlide).join('');

		tabletTrackEl.querySelectorAll('[data-contact-modal-open]').forEach((link) => {
			link.addEventListener('click', (event) => {
				if (blockLinkClick) {
					event.preventDefault();
				}
			});
		});
	}

	function renderSlide() {
		renderDots();

		if (isSwipeViewport()) {
			updateSwipePosition(true);
			return;
		}

		renderDesktopSlide();
	}

	function stopAutoplay() {
		if (!autoplayTimer) {
			return;
		}

		window.clearInterval(autoplayTimer);
		autoplayTimer = null;
	}

	function startAutoplay() {
		stopAutoplay();

		if (slides.length <= 1 || isAutoplayPaused || document.hidden) {
			return;
		}

		autoplayTimer = window.setInterval(() => {
			if (isPointerDown || isDragging || isAutoplayPaused || document.hidden) {
				return;
			}

			goToNext({ shouldRestartAutoplay: false });
		}, AUTOPLAY_DELAY);
	}

	function restartAutoplay() {
		stopAutoplay();
		startAutoplay();
	}

	function pauseAutoplay() {
		isAutoplayPaused = true;
		stopAutoplay();
	}

	function resumeAutoplay() {
		isAutoplayPaused = false;
		startAutoplay();
	}

	function setAutoplayVisibilityState() {
		if (document.hidden) {
			stopAutoplay();
			return;
		}

		startAutoplay();
	}

	function goToPrev({ shouldRestartAutoplay = true } = {}) {
		currentIndex = currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
		dragOffset = 0;
		renderSlide();

		if (shouldRestartAutoplay) {
			restartAutoplay();
		}
	}

	function goToNext({ shouldRestartAutoplay = true } = {}) {
		currentIndex = currentIndex === slides.length - 1 ? 0 : currentIndex + 1;
		dragOffset = 0;
		renderSlide();

		if (shouldRestartAutoplay) {
			restartAutoplay();
		}
	}

	function onPointerDown(event) {
		if (!isSwipeViewport()) {
			return;
		}

		isPointerDown = true;
		isDragging = false;
		blockLinkClick = false;
		startX = event.clientX;
		startY = event.clientY;
		dragOffset = 0;

		getActiveSwipeTrack().style.transition = 'none';
		stopAutoplay();
	}

	function onPointerMove(event) {
		if (!isPointerDown || !isSwipeViewport()) {
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
				restartAutoplay();
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

		updateSwipePosition(false);
	}

	function onPointerEnd() {
		if (!isSwipeViewport()) {
			return;
		}

		if (!isPointerDown && !isDragging) {
			return;
		}

		const threshold = getSlideWidth() * 0.18;
		const diff = dragOffset;

		isPointerDown = false;

		if (!isDragging) {
			restartAutoplay();
			return;
		}

		isDragging = false;

		if (diff <= -threshold) {
			goToNext();
		} else if (diff >= threshold) {
			goToPrev();
		} else {
			dragOffset = 0;
			updateSwipePosition(true);
			restartAutoplay();
		}

		window.setTimeout(() => {
			blockLinkClick = false;
		}, 80);
	}

	prevBtn.addEventListener('click', () => goToPrev());
	nextBtn.addEventListener('click', () => goToNext());

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
	sliderEl.addEventListener('mouseenter', pauseAutoplay);
	sliderEl.addEventListener('mouseleave', resumeAutoplay);
	sliderEl.addEventListener('focusin', pauseAutoplay);
	sliderEl.addEventListener('focusout', resumeAutoplay);
	document.addEventListener('visibilitychange', setAutoplayVisibilityState);

	window.addEventListener('resize', () => {
		isPointerDown = false;
		isDragging = false;
		blockLinkClick = false;
		dragOffset = 0;
		renderSlide();
		restartAutoplay();
	});

	renderMobileSlides();
	renderTabletSlides();
	renderDesktopSlide();
	renderSlide();
	startAutoplay();
}
