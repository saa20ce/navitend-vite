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

export function initBannerSlider(slides) {
	if (!slides?.length) {
		console.error('Missing banner slides');
		return;
	}

	const titleEl = document.querySelector('#banner-title');
	const text1El = document.querySelector('#banner-text-1');
	const text2El = document.querySelector('#banner-text-2');
	const linkEl = document.querySelector('#banner-link');
	const mobileImageEl = document.querySelector('#banner-image-mobile');
	const desktopImageEl = document.querySelector('#banner-image-desktop');
	const bgEl = document.querySelector('#banner-background');
	const dotsEl = document.querySelector('#banner-dots');
	const prevBtn = document.querySelector('#banner-prev');
	const nextBtn = document.querySelector('#banner-next');

	if (
		!titleEl ||
		!text1El ||
		!text2El ||
		!linkEl ||
		!mobileImageEl ||
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

	function renderDots() {
		dotsEl.innerHTML = slides
			.map((_, index) => createDot(index, index === currentIndex))
			.join('');

		const dotButtons = dotsEl.querySelectorAll('.banner-dot');

		dotButtons.forEach((dot) => {
			dot.addEventListener('click', () => {
				const index = Number(dot.dataset.index);
				currentIndex = index;
				renderSlide();
			});
		});
	}

	function renderSlide() {
		const slide = slides[currentIndex];

		titleEl.innerHTML = slide.title;
		text1El.innerHTML = slide.text1;
		text2El.innerHTML = slide.text2;
		linkEl.href = slide.href || '#';

		mobileImageEl.src = slide.mobileImage;
		mobileImageEl.alt = slide.imageAlt || '';

		desktopImageEl.src = slide.desktopImage;
		desktopImageEl.alt = slide.imageAlt || '';

		bgEl.style.backgroundImage = `
      url('${slide.mobileBg}')
    `;

		if (window.innerWidth >= 1024) {
			bgEl.style.backgroundImage = `url('${slide.desktopBg}')`;
		}

		renderDots();
	}

	function goToPrev() {
		currentIndex = currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
		renderSlide();
	}

	function goToNext() {
		currentIndex = currentIndex === slides.length - 1 ? 0 : currentIndex + 1;
		renderSlide();
	}

	prevBtn.addEventListener('click', goToPrev);
	nextBtn.addEventListener('click', goToNext);

	window.addEventListener('resize', renderSlide);

	renderSlide();
}