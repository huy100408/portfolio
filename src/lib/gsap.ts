"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

/** Media queries used with gsap.matchMedia() so effects are created and reverted per condition. */
export const mq = {
  motion: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
  desktopMotion: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
  mobileMotion: "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
};

export { gsap, ScrollTrigger, useGSAP };
