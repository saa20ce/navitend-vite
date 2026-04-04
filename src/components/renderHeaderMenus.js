export function renderHeaderMenus(menuItems) {
  const desktopMenu = document.querySelector("[data-desktop-menu]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");

  if (!desktopMenu || !mobileMenu) {
    console.error("Missing header menu elements");
    return;
  }

  desktopMenu.innerHTML = menuItems
    .map(
      ({ href, label }) => `
        <a href="${href}"
          class="text-[18px] leading-[1] text-[#FF7948] transition-colors duration-200 hover:text-[#868686]">${label}</a>
      `,
    )
    .join("");

  mobileMenu.innerHTML = menuItems
    .map(
      ({ href, label }, index) => `
        <a href="${href}"
          data-menu-link
          class="border-b border-[#D9D9D9] py-[13px] text-[17px] font-[400] leading-[1.1] transition-colors duration-200 ${index === 0 ? "text-[#FF7948] hover:text-[#FF7948]" : "text-[#FF7948] hover:text-[#FF7948]"
        }">${label}</a>
      `,
    )
    .join("");
}
