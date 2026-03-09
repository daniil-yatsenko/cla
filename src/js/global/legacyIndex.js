import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { CustomEase } from "gsap/CustomEase";
import Lenis from "lenis";
import barba from "@barba/core";

// animate all overlaying menus
function overlayButtons() {
  let buttons = document.querySelectorAll("[overlay-button]");
  let overlayPages = {};

  buttons.forEach((button) => {
    let currentPageName = button.getAttribute("overlay-button");
    overlayPages[currentPageName] = document.querySelector(
      `.${currentPageName}_wrapper`,
    );
    overlayPages[currentPageName].style.display = "none";

    let currentPage = overlayPages[currentPageName];

    button.addEventListener("click", () => {
      // check if anything is opened
      let somethingOpened = false;
      Object.values(overlayPages).forEach((overlayPage) => {
        if (overlayPage.classList.contains("is-opened")) {
          somethingOpened = true;
        }
      });

      if (somethingOpened == false) {
        // if nothing is opened
        openOverlayPage(currentPage, true);
      } else {
        // if something is opened
        if (currentPage.classList.contains("is-opened")) {
          // if current page is opened
          // currentPageIsOpened = true;
          closeOverlayPage(currentPage, true);
        } else {
          // if other page is opened
          Object.values(overlayPages).forEach((overlayPage) => {
            if (overlayPage.classList.contains("is-opened")) {
              // close that other page, keeping the overlay opened
              closeOverlayPage(overlayPage, false);
            }
          });
          // open current page
          openOverlayPage(currentPage, false);
        }
      }
    });
  });

  // animate menu on tablet and below
  let menuBtn = document.querySelector(".overlay_menu-btn");
  let homeBtn = document.querySelector(".overlay_home-btn");
  let logo = document.querySelector(".logo");

  menuBtn.addEventListener("click", () => {
    setInterval(() => {
      if (isOverlayMenuOpened()) {
        menuBtn.innerHTML = "Close";
        gsap.set(menuBtn, { color: "#000" });
        // gsap.set(logo, { opacity: 0, pointerEvents: "none" });
      } else {
        menuBtn.innerHTML = "Menu";
        // gsap.set(logo, { opacity: "", pointerEvents: "" });
      }
    }, 100);

    // if (window.location.pathname !== "/") {
    //   setInterval(() => {
    //     if (isOverlayMenuOpened()) {
    //       // gsap.set(menuBtn, { display: "none" });
    //       gsap.set(homeBtn, { display: "block" });
    //     } else {
    //       gsap.set(homeBtn, { display: "none" });
    //     }
    //   }, 100);
    // }
  });

  homeBtn.addEventListener("click", () => {
    window.location.href = "/";
  });
}

function isOverlayMenuOpened() {
  let menu = document.querySelector(".menu_wrapper");
  if (menu.style.display === "block") {
    return true;
  }
  return false;
}

// open overlay only
function openOverlayFunction(duration = 0.3) {
  let bodyPage = document.querySelector("body");
  let overlay = document.querySelector(".overlay");
  let mainPage = document.querySelector(".main-wrapper");
  let scroller = document.querySelector(".scroller_wrapper");
  let tl = gsap.timeline();
  let midLogo = document.querySelector(".logo");

  gsap.set(mainPage, { pointerEvents: "none" });

  if ((overlay.style.display = "none")) {
    tl.set(bodyPage, { overflow: "hidden" });
    if (lenisMain) {
      lenisMain.stop();
    }

    if (window.innerWidth < 992) {
      gsap.to(scroller, { opacity: 0 });
      // left-align the navbar logo
      if (
        midLogo &&
        (window.getComputedStyle(midLogo).textAlign === "left" ||
          !window.location.pathname.includes("projects"))
      ) {
        let logoTl = gsap.timeline();
        logoTl.to(midLogo, { opacity: 0 });
        logoTl.set(midLogo.parentNode, {
          gridColumnStart: 1,
          gridColumnEnd: 4,
          justifySelf: "left",
        });
        logoTl.set(midLogo, { textAlign: "left" });
        logoTl.to(midLogo, { opacity: 1 });
      }
    }

    tl.set(overlay, { opacity: 0 });
    tl.set(overlay, { display: "block" });
    tl.to(overlay, {
      opacity: 1,
      duration: duration,
      ease: "power1.inOut",
    });
  }
}

// close overlay only
function closeOverlayFunction(duration = 0.3) {
  let bodyPage = document.querySelector("body");
  let overlay = document.querySelector(".overlay");
  let mainPage = document.querySelector(".main-wrapper");
  let scroller = document.querySelector(".scroller_wrapper");
  let tl = gsap.timeline();
  let midLogo = document.querySelector(".logo");

  if ((overlay.style.display = "block")) {
    tl.to(overlay, {
      opacity: 0,
      duration: duration / 2,
      ease: "power1.inOut",
      delay: duration / 2,
    });
    tl.set(overlay, { display: "none", delay: duration });
    tl.set(bodyPage, { overflow: "" });

    if (lenisMain) {
      lenisMain.start();
    }

    if (window.innerWidth < 992) {
      gsap.to(scroller, { opacity: 1, delay: 0.2 });
      // reset the navbar logo
      if (
        midLogo &&
        window.getComputedStyle(midLogo).textAlign === "left" &&
        !window.location.pathname.includes("projects")
      ) {
        let logoTl = gsap.timeline();
        logoTl.to(midLogo, { opacity: 0 });
        logoTl.set(midLogo.parentNode, {
          gridColumnStart: "",
          gridColumnEnd: "",
          justifySelf: "",
        });
        logoTl.set(midLogo, { textAlign: "" });
        logoTl.to(midLogo, { opacity: 1 });
      }
    }

    gsap.set(mainPage, { pointerEvents: "" });
  }
}

// open page that sits inside the overlay
function openOverlayPage(page, openOverlay = true) {
  gsap.registerPlugin(CustomEase);
  let duration = 0.6; // set duration
  let navbar = document.querySelector(".navbar_navbar");
  let buttonName = page.classList[0].replace(/_wrapper$/, "");
  let button = document.querySelector(`[overlay-button="${buttonName}"]`);

  gsap.set(navbar, { pointerEvents: "none" });

  if (openOverlay) {
    openOverlayFunction(duration / 2);
  }

  gsap.to(page, {
    display: "block",
    opacity: 0,
    delay: duration / 2,
    duration: 0, // Zero duration to mimic the set behavior and launch onComplete
    onComplete: function () {
      alignGrids();
    },
  });
  gsap.to(page, {
    opacity: 1,
    duration: duration / 2,
    ease: "power1.inOut",
    delay: duration / 2,
  });

  if (window.innerWidth > 991) {
    button.classList.add("link-custom-underline");
  }

  page.classList.add("is-opened");
  initiateOverlayLenis(page);
  gsap.set(navbar, { pointerEvents: "", delay: 1.5 * duration });
}

// close page that sits inside the overlay
function closeOverlayPage(page, closeOverlay = true) {
  gsap.registerPlugin(CustomEase);
  let duration = 0.6; // set duration
  let navbar = document.querySelector(".navbar_navbar");
  let buttonName = page.classList[0].replace(/_wrapper$/, "");
  let button = document.querySelector(`[overlay-button="${buttonName}"]`);

  gsap.set(navbar, { pointerEvents: "none" });

  gsap.to(page, {
    opacity: 0,
    duration: duration / 2,
    ease: "power1.inOut",
  });

  button.classList.remove("link-custom-underline");

  gsap.set(page, { display: "none", delay: duration / 2 });

  if (closeOverlay) {
    closeOverlayFunction(duration);
  }

  page.classList.remove("is-opened");
  gsap.set(navbar, { pointerEvents: "", delay: 2 * duration });
}

function openDropdown(dropdown, imageCell) {
  let q = gsap.utils.selector(dropdown),
    dropdownTl = gsap.timeline();
  let dropdownCaption = dropdown.querySelector(".link-custom-underline-hover");
  dropdown.classList.add("is-opened");
  dropdownCaption.classList.add("link-custom-underline");
  dropdownTl.set(q(".dropdown_dropdown-content"), {
    display: "block",
    opacity: 0,
    height: "0rem",
    paddingTop: "0rem",
  });
  dropdownTl.to(q(".dropdown_dropdown-content"), {
    height: "auto",
    paddingTop: "0.875rem",
    duration: 0.3,
    ease: "power1.inOut",
    onComplete: function () {
      alignGrids();
    },
  });
  dropdownTl.to(q(".dropdown_dropdown-content"), {
    opacity: 1,
    duration: 0.3,
    ease: "power1.inOut",
  });
  dropdownTl.to(imageCell, {
    opacity: 1,
    delay: "-0.4",
    duration: 0.3,
  });
}

function closeDropdown(dropdown, imageCell) {
  let q = gsap.utils.selector(dropdown),
    dropdownTl = gsap.timeline();
  let dropdownCaption = dropdown.querySelector(".link-custom-underline-hover");
  dropdown.classList.remove("is-opened");
  dropdownCaption.classList.remove("link-custom-underline");
  dropdownTl.to(q(".dropdown_dropdown-content"), {
    opacity: 0,
    duration: 0.3,
    ease: "power2.out",
  });
  dropdownTl.to(q(".dropdown_dropdown-content"), {
    height: "0rem",
    paddingTop: "0rem",
    duration: 0.3,
    ease: "power2.out",
  });
  dropdownTl.set(q(".dropdown_dropdown-content"), {
    display: "none",
  });
  dropdownTl.to(imageCell, {
    opacity: 0,
    delay: "-0.4",
    duration: 0.3,
  });
}

// animate dropdowns on Services overlay page
function animateDropdowns() {
  if (window.innerWidth < 992) {
    return;
  }

  let dropdowns = document
    .querySelector(".services_wrapper")
    .querySelectorAll(".dropdown_dropdown");

  //close all dropdowns except 1st one
  dropdowns.forEach((dropdown, index) => {
    if (index > 0) {
      let dropdownIndex = dropdown.getAttribute("services-dropdown-index");
      let dropdownImage = document
        .querySelector(".services_image-collection-desktop")
        .querySelector(`[service-image="${dropdownIndex}"]`);
      closeDropdown(dropdown, dropdownImage);
    }
    if (index == 0) {
      dropdown.classList.add("is-opened");
      let dropdownCaption = dropdown.querySelector(
        ".link-custom-underline-hover",
      );
      dropdownCaption.classList.add("link-custom-underline");
    }
  });

  //main functionality
  dropdowns.forEach((dropdown, index) => {
    let dropdownToggle = dropdown.querySelector(".dropdown_dropdown-toggle");
    let imageCell = document
      .querySelector(".services_wrapper")
      .querySelector(`[service-image="${index + 1}"]`);

    dropdownToggle.addEventListener("click", () => {
      // if it was opened before
      if (dropdown.classList.contains("is-opened")) {
        // closeDropdown(dropdown);
      } else {
        // check if any other dropdown is opened, if yes - close it and its image
        let openedDropdown = document.querySelector(
          ".dropdown_dropdown.is-opened",
        );
        if (openedDropdown) {
          let openedDropdownIndex = openedDropdown.getAttribute(
            "services-dropdown-index",
          );
          let openedDropdownImageCell = document
            .querySelector(".services_wrapper")
            .querySelector(`[service-image="${openedDropdownIndex}"]`);

          closeDropdown(openedDropdown, openedDropdownImageCell);
        }
        openDropdown(dropdown, imageCell);
      }
    });
  });
}

// visual adjustments for project list: coming soon and vertical image resize
// scroll animation is handled via Webflow animations
function homeProjectList(page) {
  //grey out "Coming Soon" projects
  let projectLinks = page.querySelectorAll(".image-wrapper.is-project-list");

  projectLinks.forEach((projectLink) => {
    // if the project is complete and needs a link to project page
    let isComplete = true;
    if (
      projectLink
        .querySelector(".project-list_coming-soon-blur")
        .classList.contains("w-condition-invisible")
    ) {
      isComplete = false;
    }
    if (isComplete) {
      projectLink.href = "#";
      projectLink.style.cursor = "default";
    }

    // scale vertical project images
    let projectCovers = page.querySelectorAll(".project-list_image");
    let sideMargin = 8;
    if (window.innerWidth < 991) {
      sideMargin = 9;
    }
    if (window.innerWidth < 768) {
      sideMargin = 10;
    }
    if (window.innerWidth < 480) {
      sideMargin = 16;
    }

    projectCovers.forEach((cover) => {
      let width = cover.clientWidth;
      let height = cover.clientHeight;

      if (height > width && !cover.classList.contains("is-resized")) {
        gsap.set(cover.parentNode, {
          paddingLeft: sideMargin + "vw",
          paddingRight: sideMargin + "vw",
        });
        cover.classList.add("is-resized");
      }
    });
  });
}

// project title change on desktop
function homeProjectTitles(page) {
  if (window.innerWidth > 991) {
    gsap.registerPlugin(ScrollTrigger);
    let titleArea = page.querySelector(".project-list_animated-titles");
    let projects = page.querySelectorAll(".image-wrapper.is-project-list");
    let studioLinkX = document
      .querySelector(".studio-link")
      .getBoundingClientRect().left;

    projects.forEach((project) => {
      let title = project.querySelector(
        ".project-list_project-caption:not(.w-condition-invisible)",
      );
      let randomId = Math.random().toString(36); // set id to reference in barba transition
      title.setAttribute("id", randomId);
      project.setAttribute("id", randomId);
      let clonedTitle = title.cloneNode(true);
      gsap.set(clonedTitle, {
        opacity: 0,
        position: "absolute",
        top: "0%",
        left: "0%",
        right: "0%",
      });
      if (!clonedTitle.classList.contains("is-coming-soon")) {
        gsap.set(clonedTitle, { cursor: "pointer" });
        gsap.set(clonedTitle.children[0], {
          display: "inline-block",
        });
        clonedTitle.children[0].classList.add("link-custom-underline-hover");
      }

      titleArea.append(clonedTitle);

      clonedTitle.addEventListener("click", () => {
        project.click();
      });
    });
    // align titles to "Studio" in navbar & animate movement
    gsap.set(titleArea, {
      x: studioLinkX - titleArea.getBoundingClientRect().left,
      top: "calc(50% - 0.5rem)",
      width: window.innerWidth - (studioLinkX + 28),
    });

    projects.forEach((project, index) => {
      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: project,
          start: "top center",
          onEnter: () => {
            homeProjectTitleForward(page, index - 1);
          },
          onLeaveBack: () => {
            homeProjectTitleBackward(page, index - 1);
          },
        },
      });
    });
  }
}

// supporting function for project title change on desktop
function homeProjectTitleForward(page, index) {
  let titles = page.querySelector(".project-list_animated-titles").children;
  let currentTitle = titles[index];
  let nextTitle;
  if (titles[index + 1]) {
    nextTitle = titles[index + 1];
  }

  if (nextTitle) {
    gsap.to(currentTitle, {
      y: "-1rem",
      opacity: 0,
      duration: 0.3,
      display: "none",
      ease: "power2.inOut",
    });
    gsap.set(currentTitle, {
      y: "0rem",
    });
    gsap.set(nextTitle, {
      y: "1rem",
      opacity: 0,
    });
    gsap.to(nextTitle, {
      y: "0rem",
      opacity: 1,
      duration: 0.3,
      display: "block",
      ease: "power2.inOut",
    });
  }
}

// supporting function for project title change on desktop
function homeProjectTitleBackward(page, index) {
  let titles = page.querySelector(".project-list_animated-titles").children;
  let currentTitle = titles[index];
  let nextTitle;
  if (titles[index + 1]) {
    nextTitle = titles[index + 1];
  }

  gsap.set(currentTitle, {
    y: "-1rem",
    opacity: 0,
  });
  gsap.to(currentTitle, {
    y: "0rem",
    opacity: 1,
    display: "block",
    duration: 0.3,
    ease: "power2.inOut",
  });

  if (nextTitle) {
    gsap.to(nextTitle, {
      y: "1rem",
      opacity: 0,
      display: "none",
      duration: 0.3,
      ease: "power2.inOut",
    });
    gsap.set(nextTitle, {
      y: "0rem",
    });
  }
}

// visual adjustments for text grids on larger desktop breakpoints
function alignGrids(page = document) {
  if (window.innerWidth > 1300) {
    // let serviceLinkX = document
    //     .querySelector(".services-link")
    //     .getBoundingClientRect().left;
    // document
    //     .querySelectorAll(".project_info-wrapper-v2")
    //     .forEach((grid) => {
    //         let children = grid.children;
    //         for (let i = 0; i < children.length; i++) {
    //             if ((i + 1) % 2 === 0) {
    //                 let origX =
    //                     children[i].getBoundingClientRect().left;
    //                 let delta = serviceLinkX - origX;
    //                 if (delta > 10) {
    //                     children[i].style.transform =
    //                         `translateX(${delta}px)`;
    //                     children[i].style.width =
    //                         `${children[i].offsetWidth - delta}px`;
    //                 }
    //             }
    //         }
    //     });
    // document.querySelectorAll("[align-grid]").forEach((cell) => {
    //     cell.style.transform = "";
    //     cell.style.width = "";
    //     let origX = cell.getBoundingClientRect().left;
    //     let delta = serviceLinkX - origX;
    //     if (delta > 10) {
    //         cell.style.transform = `translateX(${delta}px)`;
    //         if (!cell.querySelector(".start-project-link"))
    //             cell.style.width = `${cell.offsetWidth - delta}px`;
    //     }
    // });
    // adjust "next" button position to match the layout
    // let nextButton = page.querySelector("#next_button");
    // if (nextButton) {
    //   let origX = nextButton.getBoundingClientRect().left;
    //   let delta = serviceLinkX - origX;
    //   nextButton.style.transform = `translateX(${delta}px)`;
    // }
  }
  document.querySelectorAll(".project_navigation").forEach((element) => {
    gsap.to(element, { opacity: 1 });
  });
}

// center the first project image on the home page on load
function homePosition(page) {
  let sectionWrapper = page.querySelector(".project-list_wrapper");
  let projectWrapper = page.querySelector(".project-list_cover-wrapper");
  let image = page.querySelector(".project-list_image");
  let padding;

  if (image.offsetHeight < image.offsetWidth) {
    // if first image is horizontal
    let ratio = projectWrapper.offsetWidth / image.offsetWidth;
    let maxHeight = image.offsetHeight * ratio;
    padding = (window.innerHeight - maxHeight) / 2;
  } else {
    // if first image is vertical
    let imageParentPadding = window.getComputedStyle(
      image.parentElement,
    ).paddingLeft;

    let maxWidth =
      projectWrapper.offsetWidth - 2 * parseFloat(imageParentPadding);
    let maxHeight = (image.offsetHeight * maxWidth) / image.offsetWidth;
    padding = (window.innerHeight - maxHeight) / 2;
  }

  if (window.innerWidth < 992) {
    padding = padding + 2;
  }
  if (window.innerWidth < 768) {
    padding = padding - 2;
  }
  gsap.set(sectionWrapper, { paddingTop: padding });
}

// lenis scroll
var lenisMain, lenisOverlay, lenisProject;
function initiateMainLenis() {
  if (lenisMain) {
    lenisMain.destroy();
  }
  lenisMain = new Lenis({
    lerp: 0.5,
    smooth: true,
  });
  const loop = (time) => {
    lenisMain.raf(time);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

function initiateOverlayLenis(overlayContent) {
  if (lenisOverlay) {
    lenisOverlay.destroy();
  }

  let overlay = document.querySelector(".overlay");

  lenisOverlay = new Lenis({
    wrapper: overlay,
    content: overlayContent,
    lerp: 0.5,
    smooth: true,
  });
  const loop = (time) => {
    lenisOverlay.raf(time);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

function initiateProjectLenis() {
  if (lenisProject) {
    lenisProject.destroy();
  }

  if (window.innerWidth > 991) {
    let wrapper = document.querySelector(".project_sticky-wrapper");
    let content = wrapper.querySelector(".text-grid");

    lenisProject = new Lenis({
      wrapper: wrapper,
      content: content,
      lerp: 0.5,
      smooth: true,
    });
    const loop = (time) => {
      lenisProject.raf(time);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
}

// currently not used
function restartWebflowAnimations() {
  window.Webflow.require("ix2").init();
  window.dispatchEvent(new Event("scroll"));
  window.dispatchEvent(new Event("scroll"));
}

function logoAlignLeftMobile(animate = true) {
  if (window.innerWidth < 992) {
    let logo = document.querySelector(".logo");
    let wfStrayElement = document.getElementById(
      "w-node-e3c3df2f-7a55-940b-0e9f-dc7b5f94ed73-f35a815e",
    );
    let tl = gsap.timeline();
    if (animate) tl.to(logo, { opacity: 0 });
    tl.set(logo, { textAlign: "left" });
    tl.set(logo.parentElement, {
      gridColumn: "1 / 3",
      justifySelf: "start",
    });
    if (window.innerWidth < 450) tl.set(logo.parentElement, { width: "10rem" });
    if (animate) tl.to(logo, { opacity: 1 });
    tl.set(wfStrayElement, { pointerEvents: "none" });
  }
}

function homeInit(page) {
  homeProjectList(page);
  homeProjectTitles(page);
  alignGrids(page);
  homePosition(page);
}

function projectInit(page) {
  alignGrids(page);
  initiateProjectLenis();

  // hiding scroller
  let scroller = document.querySelector(".scroller_component");
  if (window.innerWidth < 992) {
    gsap.set(scroller, { display: "none" });
  }

  // next / previous buttons functionality
  const navigationButtons = (callback) => {
    callback(page);
  };

  navigationButtons((page) => {
    let nexthref =
      page
        .querySelector("#post_list .w--current")
        ?.parentElement?.nextElementSibling?.querySelector("a")
        ?.getAttribute("href") || null;

    let previoushref =
      page
        .querySelector("#post_list .w--current")
        ?.parentElement?.previousElementSibling?.querySelector("a")
        ?.getAttribute("href") || null;

    let nextButton = page.querySelector("#next_button");
    if (nextButton) {
      if (nexthref == null) {
        nexthref = "#";
        nextButton.style.color = "var(--base-color-brand--gray)";
        nextButton.style.pointerEvents = "none";
      }
      nextButton.href = nexthref;
    }
    let previousButton = page.querySelector("#previous_button");
    if (previousButton) {
      if (previoushref == null) {
        previoushref = "#";
        previousButton.style.color = "var(--base-color-brand--gray)";
        previousButton.style.pointerEvents = "none";
      }
      previousButton.href = previoushref;
    }
  });

  // share buttons functionality - disabled as per revision

  // // email
  // const shareEmail = (callback) => {
  //   callback(page);
  // };

  // shareEmail((page) => {
  //   let emailButtons = page.querySelectorAll(".share-email");
  //   let currentPageUrl = window.location.href;
  //   let subject = "Check out this CLA project";
  //   let body =
  //     "I thought you might be interested in checking out this project by Cooke Landscape Architecture:\n" +
  //     currentPageUrl;
  //   let emailShareUrl =
  //     "mailto:?subject=" +
  //     encodeURIComponent(subject) +
  //     "&body=" +
  //     encodeURIComponent(body);

  //   emailButtons.forEach((button) => {
  //     button.setAttribute("href", emailShareUrl);
  //   });
  // });

  // // pinterest

  // const sharePinterest = (callback) => {
  //   callback(page);
  // };

  // sharePinterest((page) => {
  //   let pinterestButtons = page.querySelectorAll(".share-pinterest");
  //   let currentPageUrl = encodeURIComponent(window.location.href);
  //   let imageUrl = encodeURIComponent(
  //     document.getElementById("cover-image").getAttribute("src")
  //   );
  //   let description = encodeURIComponent("Check out this awesome page!");
  //   let pinterestShareUrl =
  //     "https://pinterest.com/pin/create/link/?url=" +
  //     currentPageUrl +
  //     "&media=" +
  //     imageUrl +
  //     "&description=" +
  //     description;

  //   pinterestButtons.forEach((button) => {
  //     button.setAttribute("href", pinterestShareUrl);
  //   });
  // });
}

////////////////
/// Barba.js ///
////////////////

barba.init({
  views: [
    {
      namespace: "home",
      afterEnter(data) {
        let container = document.querySelector(".main-wrapper");
        if (data.next.container) {
          container = data.next.container;
        }
        homeInit(container);

        gsap.to(document.querySelector(".page-wrapper"), {
          opacity: 1,
        });
        closeOverlayFunction();
      },
    },
    {
      namespace: "project",
      afterEnter(data) {
        let container = document.querySelector(".main-wrapper");
        if (data.next.container) {
          container = data.next.container;
        }
        projectInit(container);
      },
    },
  ],
  transitions: [
    {
      sync: false,
      name: "project-transition",
      from: { namespace: ["home"] },
      to: { namespace: ["project"] },
      leave(data) {
        return new Promise((resolve) => {
          // cloning image
          let image = data.trigger.firstElementChild;
          let clonedImage = image.cloneNode(true);
          const imageRect = image.getBoundingClientRect();
          gsap.set(clonedImage, {
            position: "absolute",
            left: imageRect.left,
            top: imageRect.top,
            width: imageRect.width,
            height: imageRect.height,
          });

          // cloning caption
          let captionId = data.trigger
            .querySelector(".project-list_project-caption")
            ?.getAttribute("id");
          let caption;
          if (window.innerWidth > 991) {
            caption = data.current.container
              .querySelector(".project-list_animated-titles")
              .querySelector(`[id="${captionId}"]`);
            caption.children[0].classList.remove("link-custom-underline-hover");
          } else {
            caption = data.trigger.querySelector(
              ".project-list_project-caption",
            );
          }

          let clonedCaption = caption.cloneNode(true);
          const captionRect = caption.getBoundingClientRect();
          gsap.set(clonedCaption, {
            position: "absolute",
            left: captionRect.left,
            top: captionRect.top,
            width: captionRect.width,
            height: captionRect.height,
          });

          const overlay = document.querySelector(".animation-overlay");
          gsap.set(overlay, { display: "block" });

          // Append the clones to the overlay
          overlay.appendChild(clonedImage);
          overlay.appendChild(clonedCaption);

          openOverlayFunction();

          gsap.to(data.current.container, {
            opacity: 0,
            duration: 0.3,
            delay: 0.3,
            onComplete: () => {
              window.scrollTo(0, 0);
              resolve();
            },
          });
        });
      },
      enter(data) {
        logoAlignLeftMobile();
        return new Promise((resolve) => {
          let clonedImage = document
            .querySelector(".animation-overlay")
            .querySelector(".project-list_image");
          let clonedCaption = document
            .querySelector(".animation-overlay")
            .querySelector(".project-list_project-caption-text");

          const targetImage =
            data.next.container.querySelector(".image-wrapper");
          const targetCaption = data.next.container.querySelector(
            ".project_title-text",
          );

          let tl = gsap.timeline();

          tl.set(data.next.container, { y: "20vh" });
          tl.from(data.next.container, {
            opacity: 0,
            duration: 0.5,
          });

          tl.call(
            requestAnimationFrame(() => {
              const clonedImageRect = clonedImage.getBoundingClientRect();
              const targetImageRect = targetImage.getBoundingClientRect();
              const clonedCaptionRect = clonedCaption.getBoundingClientRect();
              const targetCaptionRect = targetCaption.getBoundingClientRect();

              gsap.to(clonedImage, {
                x: targetImageRect.left - clonedImageRect.left,
                y: targetImageRect.top - clonedImageRect.top,
                width: targetImageRect.width,
                height: targetImageRect.height,
                duration: 0.5,
                ease: "power1.in",
              });

              gsap.set(clonedCaption, {
                width: targetCaptionRect.width,
                height: targetCaptionRect.height,
              });
              gsap.to(clonedCaption, {
                x: targetCaptionRect.left - clonedCaptionRect.left,
                y: targetCaptionRect.top - clonedCaptionRect.top,
                duration: 0.5,
                ease: "power1.in",
              });
            }),
          );

          tl.call(() => {
            closeOverlayFunction();
          });
          tl.to([data.next.container, clonedImage, clonedCaption], {
            y: "-=20vh",
            delay: 0.05,
            duration: 0.5,
          });

          setTimeout(() => {
            clonedImage.remove();
            clonedCaption.remove();
            const overlay = document.querySelector(".animation-overlay");
            gsap.set(overlay, { display: "none" });
          }, 800);
          resolve();
        });
      },
      after() {
        initiateMainLenis();
        let mainWrappers = document.querySelectorAll(".main-wrapper");
        setTimeout(() => {
          mainWrappers.forEach((mainWrapper) => {
            mainWrapper.style = null;
          });
        }, 1200);
      },
    },
    {
      name: "project-home-transition",
      from: { namespace: ["project"] },
      to: { namespace: ["home"] },
      leave(data) {
        openOverlayFunction();
        gsap.to(data.current.container, {
          opacity: 0,
          duration: 0.3,
        });
        setTimeout(() => {
          window.scrollTo(0, 0);
          window.location.reload();
        }, 250);
        return gsap.to(data.current.container, {
          opacity: 0,
          duration: 0.3,
        });
      },
    },
    {
      name: "fade",
      leave(data) {
        openOverlayFunction();
        return gsap.to(data.current.container, {
          opacity: 0,
          duration: 0.3,
        });
      },
      enter(data) {
        gsap.from(data.next.container, {
          opacity: 0,
          duration: 0.3,
          delay: 0.3,
        });
        closeOverlayFunction();
      },
      after() {
        initiateMainLenis();
        mainLenis.scrollTo(0);
        closeOverlayFunction();
      },
    },
  ],
});

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

/////////////////
/// main code ///
/////////////////

function globalInitLegacy() {
  overlayButtons();
  animateDropdowns();
  initiateMainLenis();
}

globalInitLegacy();

// document.addEventListener("DOMContentLoaded", () => {
//   globalInitLegacy();
// });
