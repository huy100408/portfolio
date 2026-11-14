"use client";

import Image from "next/image";
import { useRef } from "react";
import young from "@/assets/about/brian-young.jpg";
import { gsap, mq, useGSAP } from "@/lib/gsap";

const alt = "Brian as a young child in a yellow shirt with a red paper flower, standing on the grass outside.";

/**
 * "Where it started": a pinned, scroll-driven scene around a childhood photo.
 * The opening line fades out, the photo rises and turns from black-and-white to colour,
 * and the closing line ties it to today.
 *
 * Without motion (reduced motion or no JavaScript) it's a plain stacked layout. GSAP adds
 * `data-animated` only when it builds the scene, and the layered CSS in globals.css keys off that.
 */
export function Origin() {
  const stage = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ desktop: mq.desktopMotion, mobile: mq.mobileMotion }, (ctx) => {
        const el = stage.current!;
        const desktop = Boolean(ctx.conditions?.desktop);
        el.dataset.animated = "";
        const q = gsap.utils.selector(el);
        // Blur is lovely but expensive; keep it to desktop.
        const blur = (px: number) => (desktop ? { filter: `blur(${px}px)` } : {});

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "+=260%",
            scrub: 0.8,
            pin: true,
            anticipatePin: 1,
          },
        });

        tl.fromTo(q("[data-o-line='1']"), { opacity: 1, scale: 1, y: 0, ...blur(0) }, { opacity: 0, scale: 0.9, y: -60, ...blur(14), duration: 0.8, ease: "power1.out" }, 0.1)
          .fromTo(q("[data-o-photo]"), { opacity: 0, scale: 0.55, y: 80 }, { opacity: 1, scale: 1, y: 0, duration: 1.5, ease: "power2.out" }, 0.5)
          .fromTo(q("[data-o-zoom]"), { scale: 1.25 }, { scale: 1, duration: 3.6 }, 0.35)
          .fromTo(q("[data-o-line='2']"), { opacity: 0, y: 40, ...blur(10) }, { opacity: 1, y: 0, ...blur(0), duration: 0.8, ease: "power2.out" }, 1.3)
          .fromTo(q("[data-o-color]"), { opacity: 0 }, { opacity: 1, duration: 1.2 }, 1.7)
          .fromTo(q("[data-o-glow]"), { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 1.4 }, 1.6)
          .to(q("[data-o-line='2']"), { opacity: 0, y: -30, ...blur(10), duration: 0.6 }, 3.1)
          .to(q("[data-o-photo]"), { scale: 0.9, y: -24, duration: 1 }, 3.1)
          .fromTo(q("[data-o-line='3']"), { opacity: 0, y: 40, ...blur(10) }, { opacity: 1, y: 0, ...blur(0), duration: 0.9, ease: "power2.out" }, 3.5)
          .to({}, { duration: 0.6 });

        return () => {
          delete el.dataset.animated;
        };
      });
    },
    { scope: stage },
  );

  return (
    <section id="origin" aria-label="Where it started" data-nav-theme="dark" className="dark relative bg-bg text-fg">
      <div ref={stage} className="origin-stage relative overflow-hidden">
        <div className="origin-inner container-page flex flex-col items-center gap-12 py-28 text-center sm:py-40">
          <p data-o-line="1" className="max-w-4xl text-h2 text-balance">
            Every story starts somewhere.
          </p>

          <figure data-o-photo className="origin-photo relative w-[min(30rem,80vw)]">
            {/* Warm light picked from the photo's yellow shirt and red flower. */}
            <div
              data-o-glow
              aria-hidden
              className="pointer-events-none absolute -inset-[22%] rounded-full bg-[radial-gradient(closest-side,rgb(255_196_0/0.35),rgb(255_80_60/0.18)_55%,transparent)] blur-2xl"
            />
            <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-bg-2 shadow-lift ring-1 ring-white/10 sm:rounded-[2.5rem]">
              <div data-o-zoom className="absolute inset-0 will-change-transform">
                <Image
                  src={young}
                  alt={alt}
                  placeholder="blur"
                  sizes="(min-width: 640px) 30rem, 80vw"
                  className="absolute inset-0 size-full object-cover grayscale"
                />
                <Image
                  data-o-color
                  src={young}
                  alt=""
                  aria-hidden
                  sizes="(min-width: 640px) 30rem, 80vw"
                  className="absolute inset-0 size-full object-cover"
                />
              </div>
            </div>
          </figure>

          <p data-o-line="2" className="origin-caption max-w-3xl text-h3 text-balance">
            This is where mine began.
          </p>

          <p data-o-line="3" className="origin-caption max-w-4xl text-h3 text-balance">
            <span className="text-muted">Today, I create </span>
            <span className="text-gradient">modern applications and intelligent solutions</span>
            <span className="text-muted"> through code.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
