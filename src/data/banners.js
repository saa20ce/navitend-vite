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
		title: 'Скидка <span class="text-[#FF7948]">20%</span><br>на ортодонтию',
		text1:
			'Мечтаете о ровной улыбке? Сейчас — самое время! <br class="hidden md:block" />Получите скидку 20 % на все ортодонтические услуги.',
		text2: 'Начните путь к идеальным зубам уже сегодня!',
		mobileImage: './assets/HeroMob.png?v=20260517',
		desktopImage: './assets/Hero.png?v=20260517',
		imageAlt: 'Баннер ортодонтии',
	},
	{
		title: 'Ищем сотрудников:',
		showButton: false,
		text1:
			'Ищем в команду: <br/>‒ Ассистента стоматолога  <br/>‒ Врача стоматолога‑терапевта',
		text2: 'Присоединяйтесь к нашей медицинской команде!',
		mobileImage: './assets/Hero2Mob.png?v=20260517',
		desktopImage: './assets/Hero2.png?v=20260517',
		imageAlt: 'Баннер 3D диагностики',
	},
	{
		title: 'Ваша улыбка в надёжных руках',
		text1:
			'Профессиональная чистка зубов от 4000 рублей. Комфортно, безопасно и с видимым результатом. <br/>',
		text2: 'Начните путь к здоровой улыбке сегодня!',
		mobileImage: './assets/Hero3Mob.png?v=20260517',
		desktopImage: './assets/Hero3.png?v=20260517',
		imageAlt: 'Баннер 3D диагностики',
	},
].map(createBanner);
