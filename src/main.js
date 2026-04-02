import "./styles/tailwind.css";
import "./styles/fonts.css";

// HTML partials
import contactModal from "../partials/contact-modal.html?raw";
import header from "../partials/header.html?raw";
import footer from "../partials/footer.html?raw";
import banner from "../partials/section1-banner.html?raw";
import service from "../partials/section2-service.html?raw";
import about from "../partials/section3-about.html?raw";
import doctors from "../partials/section4-doctors.html?raw";
import contacts from "../partials/section5-contacts.html?raw";
import cta from "../partials/section6-cta.html?raw";
import reviews from "../partials/section7-reviews.html?raw";

// Data
import { servicesData } from "./data/services";
import servicePrices from "./data/servicePrices.json";
import { renderServices } from "./components/renderServices";

import { doctorsData } from "./data/doctors";
import doctorsDataCardsModal from "./data/doctorsDataCardsModal";
import { renderDoctors } from "./components/renderDoctors";

import { menuItems } from "./data/menuItems";
import { initContactForms } from "./components/initContactForms";
import { renderHeaderMenus } from "./components/renderHeaderMenus";

import { banners } from "./data/banners";
import { initContactModal } from "./components/initContactModal";
import { initBannerSlider } from "./components/renderBannerSlider";
import { initMobileMenu } from "./components/initMobileMenu";
import { initServiceModal } from "./components/initServiceModal";
import { initDoctorsModal } from "./components/initDoctorsModal";

const app = document.querySelector("#app");

app.innerHTML = `
  ${header}
  <main class="px-[18px] lg:px-0">
    ${banner}
    ${service}
    ${about}
    ${doctors}
    ${contacts}
    ${cta}
    ${reviews}
  </main>
  ${footer}
  ${contactModal}
`;

renderHeaderMenus(menuItems);

const servicesGrid = document.querySelector("#services-grid");
renderServices(servicesGrid, servicesData);

const docrotsGrid = document.querySelector("#doctors-grid");
renderDoctors(docrotsGrid, doctorsData);

initContactForms();
initBannerSlider(banners);
initContactModal();
initMobileMenu();
initServiceModal(servicePrices);
initDoctorsModal(doctorsDataCardsModal);