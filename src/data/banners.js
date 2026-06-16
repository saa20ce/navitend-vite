const bannerDefaults = {
	mobileBg: './assets/bannerMobile.svg',
	tabletBg: './assets/tabletBg.svg',
	desktopBg: './assets/bannerDesktop.svg',
	href: '#',
};

function createBanner(banner) {
	return {
		...bannerDefaults,
		...banner,
	};
}

export const banners = [
	{
		title: 'Скидка <span class="text-[#FF7948]">20%</span><br>на 3D-томографию',
		text1:
			'Точная диагностика — первый шаг к здоровой улыбке. <br class="hidden md:block" />Запишитесь сейчас и получите доступ к точной диагностике.',
		text2: 'Ваша идеальная улыбка стартует с томографии!',
		mobileImage: './assets/Girl2-Photoroom.png?v=20260517',
		desktopImage: './assets/Girl2-Photoroom2.png?v=20260517',
		imageAlt: 'Баннер 3D-томографии',
	},
	{
		title: 'Ищем сотрудников:',
		text1:
			'Ищем в команду: <br/>‒ Ассистента стоматолога  <br/>‒ Врача стоматолога‑терапевта',
		text2: 'Присоединяйтесь к нашей медицинской команде!',
		mobileImage: './assets/Girl4-Photoroom.png?v=20260517',
		desktopImage: './assets/Girl4-Photoroom2.png?v=20260517',
		imageAlt: 'Баннер 3D диагностики',
	},
].map(createBanner);
