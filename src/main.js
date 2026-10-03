import "./styles/tailwind.css";
import "./styles/fonts.css";

// Data
import servicePrices from "./data/servicePrices.json";

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
import { initContactMap } from "./components/initContactMap";

renderHeaderMenus(menuItems);

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
initContactMap();
