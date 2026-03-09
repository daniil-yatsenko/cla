import { gsap } from "gsap";
// import { animateButton } from "../components/buttons";

const navbar = {
  navbarEl: document.querySelector(".navbar"),
  navLinks: document.querySelectorAll(".navbar_nav-link"),
  selector: document.querySelector(".navbar_page-selector"),
  menuBtn: document.querySelector(".navbar_menu-button"),
  linksWrapper: document.querySelector(".navbar_menu-wrapper"),
  overlay: document.querySelector(".navbar_overlay"),
  figure: document.querySelector(".navbar_overlay_figure-wrapper"),
  isMenuOpen: false,
  isNavbarHidden: false,
  isSetToMobile: false,
  eventListenersMap: new WeakMap(),

  openMenu(immediate = false) {
    const tl = gsap.timeline();
    return tl;
  },
  closeMenu(immediate = false) {
    const tl = gsap.timeline();
    return tl;
  },
  handleMenuClick() {
    this.menuBtn.addEventListener("click", () => {
      if (this.isMenuOpen) {
        this.closeMenu();
      } else {
        this.openMenu();
      }
    });
    this.overlay.addEventListener("click", () => {
      this.closeMenu();
    });
  },
  hide(immediate = false) {
    const tl = gsap.timeline();
    return tl;
  },
  show() {
    const tl = gsap.timeline();
    return tl;
  },
  resizeListener() {
    const resizeHandler = () => {
      const tl = gsap.timeline();

      if (window.innerWidth > 767 && this.isSetToMobile) {
        this.isMenuOpen = false;
        this.isSetToMobile = false;
      }

      if (window.innerWidth < 768 && !this.isSetToMobile) {
        this.isSetToMobile = true;
      }
      return tl;
    };

    window.addEventListener("resize", resizeHandler);
  },
  init() {
    if (window.innerWidth < 768) {
      this.isSetToMobile = true;
    }
    this.resizeListener();
    this.handleMenuClick();
  },
};

export { navbar };
