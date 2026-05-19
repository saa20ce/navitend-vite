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
import requisite from "../partials/section8-requisite.html?raw";
import licensesSection from "../partials/section9-licenses.html?raw";

// Data
import { servicesData } from "./data/services";
import servicePrices from "./data/servicePrices.json";
import { renderServices } from "./components/renderServices";

import { doctorsData } from "./data/doctors";
import doctorsDataCardsModal from "./data/doctorsDataCardsModal";
import { renderDoctors } from "./components/renderDoctors";
import { licenses } from "./data/licenses";
import { requisitesAccordion } from "./data/requisitesAccordion";
import { renderRequisitesAccordion } from "./components/renderRequisitesAccordion";

import { menuItems } from "./data/menuItems";
import { initContactForms } from "./components/initContactForms";
import { renderHeaderMenus } from "./components/renderHeaderMenus";

import { banners } from "./data/banners";
import { initContactModal } from "./components/initContactModal";
import { initBannerSlider } from "./components/renderBannerSlider";
import { initDoctorsSlider } from "./components/initDoctorsSlider";
import { initLicensesSlider } from "./components/initLicensesSlider";
import { initMobileMenu } from "./components/initMobileMenu";
import { initRequisitesAccordion } from "./components/initRequisitesAccordion";
import { initServiceModal } from "./components/initServiceModal";
import { initDoctorsModal } from "./components/initDoctorsModal";
import { initReviewLabWidget } from "./components/initReviewLabWidget";

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
    ${requisite}
    ${licensesSection}
  </main>
  ${footer}
  ${contactModal}
`;

renderHeaderMenus(menuItems);

const servicesGrid = document.querySelector("#services-grid");
renderServices(servicesGrid, servicesData);

const docrotsGrid = document.querySelector("#doctors-grid");
const doctorsMobileTrack = document.querySelector("[data-doctors-track]");
renderDoctors(docrotsGrid, doctorsData, doctorsMobileTrack);

const requisitesAccordionContainer = document.querySelector("[data-requisite-accordion]");
renderRequisitesAccordion(requisitesAccordionContainer, requisitesAccordion);

initContactForms();
initBannerSlider(banners);
initContactModal();
initDoctorsSlider(doctorsData);
initMobileMenu();
initRequisitesAccordion();
initLicensesSlider(licenses);
initServiceModal(servicePrices);
initDoctorsModal(doctorsDataCardsModal);
initReviewLabWidget();
