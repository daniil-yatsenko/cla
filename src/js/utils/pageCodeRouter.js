// Initializes page-specific animations based on the data-page-name attribute.
// Ensure the main page wrapper has a unique class with data-page-name attribute
// to avoid animation code leakage across different pages.

import { homeInit } from "../pages/home.js";

export function initPageRouter() {
  const pageWrapper = document.querySelector("[data-page-name]");

  if (!pageWrapper) {
    console.warn("No data-page-name attribute found on the page wrapper.");
    return;
  }

  const pageName = pageWrapper.getAttribute("data-page-name");

  // Mapping of page names to their respective starter functions
  const pageStarters = {
    home: homeInit(),
    // Add additional page starters here
  };

  const starterFunction = pageStarters[pageName];
  if (starterFunction) {
    starterFunction();
  } else {
    console.warn(`No specific animations found for page: ${pageName}`);
  }
}
