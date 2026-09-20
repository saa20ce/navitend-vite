const TABLET_MAX_WIDTH = 1280;
const AUTOPLAY_DELAY = 9000;

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
        ${slide.showButton === false ? '' : `<a
          href="${slide.href || '#'}"
          data-contact-modal-open
          class="mt-1.5 inline-flex h-[45px] min-w-[107px] items-center justify-center rounded-[16px] border border-[#FF7948] p-[12px] text-[16px] font-[600] text-[#FF7948] transition-colors duration-200 hover:border-[#FF946D] hover:bg-[#FF946D] hover:text-white"
        >
          Записаться
        </a>`}
      </div>

      <img
        data-banner-image
        data-src="${slide.mobileImage}"
        alt="${slide.imageAlt || ''}"
        loading="lazy"
        decoding="async"
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
          ${slide.showButton === false ? '' : `<a
            href="${slide.href || '#'}"
            data-contact-modal-open
            class="mt-1.5 inline-flex h-[52px] w-[131px] items-center justify-center rounded-[16px] border border-[#FF7948] p-[12px] text-[18px] font-[600] text-[#FF7948] transition-colors duration-200 hover:border-[#FF946D] hover:bg-[#FF946D] hover:text-white"
          >
            Записаться
          </a>`}
        </div>

        <img
          data-banner-image
          data-src="${slide.desktopImage}"
          alt="${slide.imageAlt || ''}"
          loading="lazy"
          decoding="async"
          class="absolute bottom-[-22px] right-[-10px] z-10 h-[363px] "
        />
      </article>
    </div>
  `;
}

function createDesktopSlide(slide, index, isPrimarySlide = false) {
	const titleTag = isPrimarySlide ? 'h1' : 'h2';

	return `
    <div class="banner-desktop-slide">
      <article
        class="banner-desktop-card"
        style="background-image:url('${slide.desktopBg}')"
      >
        <div class="relative z-10 flex max-w-[650px] flex-col items-start gap-[20px]">
          <${titleTag} class="text-[48px]/[120%] font-[800] text-[#4F4F4F]">${slide.title}</${titleTag}>
          <p class="max-w-[600px] text-[22px] font-semibold text-[#4F4F4F]">${slide.text1}</p>
          <p class="text-[20px] font-[400] text-[#4F4F4F]">${slide.text2}</p>
          ${slide.showButton === false ? '' : `<a
            href="${slide.href || '#'}"
            data-contact-modal-open
            class="mt-1.5 inline-flex h-[52px] w-[131px] items-center justify-center rounded-[16px] border border-[#FF7948] p-[12px] text-[18px] font-[600] text-[#FF7948] transition-colors duration-200 hover:border-[#FF946D] hover:bg-[#FF946D] hover:text-white"
          >
            Записаться
          </a>`}
        </div>

        <img
          data-banner-image
          data-src="${slide.desktopImage}"
          alt="${slide.imageAlt || ''}"
          loading="lazy"
          decoding="async"
          class="absolute bottom-[-22px] right-[0px] z-10 h-[582px]"
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
	const desktopTrackEl = document.querySelector('[data-banner-desktop-track]');
	const dotsEl = document.querySelector('#banner-dots');
	const prevBtn = document.querySelector('#banner-prev');
	const nextBtn = document.querySelector('#banner-next');

	if (
		!sliderEl ||
		!mobileTrackEl ||
		!tabletTrackEl ||
		!desktopTrackEl ||
		!dotsEl ||
		!prevBtn ||
		!nextBtn
	) {
		console.error('Missing banner elements');
		return;
	}

	let currentIndex = 0;
	let trackIndex = 1;
	let startX = 0;
	let startY = 0;
	let dragOffset = 0;
	let isPointerDown = false;
	let isDragging = false;
	let activePointerId = null;
	let isLoopTransition = false;
	let blockLinkClick = false;
	let autoplayTimer = null;
	let isAutoplayPaused = false;

	const isMobileViewport = () => window.innerWidth < 768;
	const isTabletViewport = () => window.innerWidth >= 768 && window.innerWidth < TABLET_MAX_WIDTH;
	const getSlideWidth = () => sliderEl.offsetWidth;
	const getActiveTrack = () => {
		if (isMobileViewport()) {
			return mobileTrackEl;
		}

		if (isTabletViewport()) {
			return tabletTrackEl;
		}

		return desktopTrackEl;
	};

	const setTrackTranslate = (track, offset, withAnimation = false) => {
		track.style.transition = withAnimation ? 'transform 0.28s ease' : 'none';
		track.style.transform = `translate3d(${offset}px, 0, 0)`;
	};

	const updateTrackPosition = (withAnimation = false) => {
		const activeTrack = getActiveTrack();
		const baseOffset = -trackIndex * getSlideWidth();
		setTrackTranslate(activeTrack, baseOffset + dragOffset, withAnimation);
	};

	const getLoopedSlides = () => [slides[slides.length - 1], ...slides, slides[0]];

	function renderDots() {
		dotsEl.innerHTML = slides.map((_, index) => createDot(index, index === currentIndex)).join('');

		dotsEl.querySelectorAll('.banner-dot').forEach((dot) => {
			dot.addEventListener('click', () => {
				if (isLoopTransition) {
					return;
				}

				currentIndex = Number(dot.dataset.index);
				trackIndex = currentIndex + 1;
				dragOffset = 0;
				renderSlide();
				restartAutoplay();
			});
		});
	}

	function bindSlideLinkGuards(track) {
		track.querySelectorAll('[data-contact-modal-open]').forEach((link) => {
			link.addEventListener('click', (event) => {
				if (blockLinkClick) {
					event.preventDefault();
					event.stopImmediatePropagation();
				}
			});
		});
	}

	function loadCurrentBannerImages() {
		const images = getActiveTrack().querySelectorAll('[data-banner-image]');

		[trackIndex, trackIndex + 1].forEach((index) => {
			const image = images[index];

			if (image && !image.getAttribute('src')) {
				image.src = image.dataset.src;
			}
		});
	}

	function renderMobileSlides() {
		mobileTrackEl.innerHTML = getLoopedSlides().map(createMobileSlide).join('');
		bindSlideLinkGuards(mobileTrackEl);
	}

	function renderTabletSlides() {
		tabletTrackEl.innerHTML = getLoopedSlides().map(createTabletSlide).join('');
		bindSlideLinkGuards(tabletTrackEl);
	}

	function renderDesktopSlides() {
		const loopedSlides = getLoopedSlides();
		desktopTrackEl.innerHTML = loopedSlides
			.map((slide, index) =>
				createDesktopSlide(slide, (index - 1 + slides.length) % slides.length, index === 1),
			)
			.join('');
		bindSlideLinkGuards(desktopTrackEl);
	}

	function renderSlide() {
		renderDots();
		updateTrackPosition(true);
		loadCurrentBannerImages();
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
		if (isLoopTransition) {
			return;
		}

		currentIndex = currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
		trackIndex -= 1;
		isLoopTransition = trackIndex === 0;
		dragOffset = 0;
		renderSlide();

		if (shouldRestartAutoplay) {
			restartAutoplay();
		}
	}

	function goToNext({ shouldRestartAutoplay = true } = {}) {
		if (isLoopTransition) {
			return;
		}

		currentIndex = currentIndex === slides.length - 1 ? 0 : currentIndex + 1;
		trackIndex += 1;
		isLoopTransition = trackIndex === slides.length + 1;
		dragOffset = 0;
		renderSlide();

		if (shouldRestartAutoplay) {
			restartAutoplay();
		}
	}

	function onPointerDown(event) {
		if (
			isPointerDown ||
			isLoopTransition ||
			!event.isPrimary ||
			event.button !== 0 ||
			slides.length <= 1
		) {
			return;
		}

		isPointerDown = true;
		activePointerId = event.pointerId;
		isDragging = false;
		blockLinkClick = false;
		startX = event.clientX;
		startY = event.clientY;
		dragOffset = 0;

		getActiveTrack().style.transition = 'none';
		stopAutoplay();
	}

	function onPointerMove(event) {
		if (!isPointerDown || event.pointerId !== activePointerId) {
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
				activePointerId = null;
				restartAutoplay();
				return;
			}

			isDragging = true;
			sliderEl.style.cursor = 'grabbing';
			blockLinkClick = true;
		}


		dragOffset = diffX;

		updateTrackPosition(false);
	}

	function onPointerEnd(event) {
		if (event && event.pointerId !== activePointerId) {
			return;
		}

		if (!isPointerDown && !isDragging) {
			return;
		}

		const threshold = Math.min(getSlideWidth() * 0.18, 100);
		const diff = dragOffset;
		const cancelled = !event || event.type === 'pointercancel';

		isPointerDown = false;
		activePointerId = null;
		sliderEl.style.cursor = '';

		if (!isDragging) {
			restartAutoplay();
			return;
		}

		isDragging = false;

		if (!cancelled && diff <= -threshold) {
			goToNext();
		} else if (!cancelled && diff >= threshold) {
			goToPrev();
		} else {
			dragOffset = 0;
			updateTrackPosition(true);
			restartAutoplay();
		}

		window.setTimeout(() => {
			blockLinkClick = false;
		}, 80);
	}

	prevBtn.addEventListener('click', () => goToPrev());
	nextBtn.addEventListener('click', () => goToNext());

	function resetLoopPosition(event) {
		if (event.target !== getActiveTrack() || event.propertyName !== 'transform') {
			return;
		}

		if (trackIndex === 0) {
			trackIndex = slides.length;
			updateTrackPosition(false);
		} else if (trackIndex === slides.length + 1) {
			trackIndex = 1;
			updateTrackPosition(false);
		}

		loadCurrentBannerImages();
		isLoopTransition = false;
	}

	sliderEl.addEventListener('pointerdown', onPointerDown);
	[mobileTrackEl, tabletTrackEl, desktopTrackEl].forEach((track) => {
		track.addEventListener('transitionend', resetLoopPosition);
	});
	window.addEventListener('pointermove', onPointerMove);
	window.addEventListener('pointerup', onPointerEnd);
	window.addEventListener('pointercancel', onPointerEnd);
	window.addEventListener('blur', () => onPointerEnd());
	sliderEl.addEventListener('dragstart', (event) => event.preventDefault());
	sliderEl.addEventListener('mouseenter', pauseAutoplay);
	sliderEl.addEventListener('mouseleave', resumeAutoplay);
	sliderEl.addEventListener('focusin', pauseAutoplay);
	sliderEl.addEventListener('focusout', resumeAutoplay);
	document.addEventListener('visibilitychange', setAutoplayVisibilityState);

	window.addEventListener('resize', () => {
		activePointerId = null;
		sliderEl.style.cursor = '';
		isPointerDown = false;
		isDragging = false;
		blockLinkClick = false;
		dragOffset = 0;
		trackIndex = currentIndex + 1;
		isLoopTransition = false;
		renderSlide();
		restartAutoplay();
	});

	renderMobileSlides();
	renderTabletSlides();
	renderDesktopSlides();
	renderSlide();
	startAutoplay();
}
