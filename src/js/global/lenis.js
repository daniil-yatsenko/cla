import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function lenisInit() {
  gsap.registerPlugin(ScrollTrigger);

  let lenis = new Lenis({
    lerp: 0.2,
    smooth: true,
  });

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
    ScrollTrigger.update();
  });

  gsap.ticker.lagSmoothing(0);

  console.log("lenis initiated");
  return lenis;
}
