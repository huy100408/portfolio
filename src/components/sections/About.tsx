"use client";

import { useRef } from "react";
import { capabilityArt } from "@/components/graphics/CapabilityArt";
import { Glow, StageBackdrop } from "@/components/graphics/svg";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { gsap, mq, useGSAP } from "@/lib/gsap";

const statement =
  "I'm Brian, a developer who likes turning ideas into working software. I build modern applications, experiment with artificial intelligence, and enjoy the moment code starts moving things in the real world.";

const interests: { title: string; text: string }[] = [
  { title: "Software engineering", text: "Writing code that is clear, tested and easy to change." },
  { title: "Modern applications", text: "Apps for the web and the desktop that feel fast and polished." },
  { title: "Artificial intelligence", text: "Assistants and tools that put models to practical use." },
  { title: "Web development", text: "Interfaces built with React, Next.js and TypeScript." },
  { title: "Robotics & automation", text: "Getting software to sense, decide and act." },
  { title: "Learning new technologies", text: "Picking up a new tool by building something real with it." },
];

/** Matches the `cap-wide` CSS variant (minus the motion part, checked separately). */
const WIDE = "(min-width: 1024px) and (min-height: 640px)";

function Index({ i, accent }: { i: number; accent: string }) {
  return (
    <p className="flex items-center gap-2.5 text-[13px] font-semibold tabular-nums text-muted">
      <span className="size-2 rounded-full" style={{ background: accent }} />
      {String(i + 1).padStart(2, "0")}
      <span aria-hidden className="text-line-strong">/</span>
      {String(interests.length).padStart(2, "0")}
    </p>
  );
}

export function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Words light up one by one as the paragraph scrolls through the viewport.
      mm.add(mq.motion, () => {
        gsap.fromTo(
          "[data-word]",
          { opacity: 0.14 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.05,
            scrollTrigger: { trigger: "[data-statement]", start: "top 80%", end: "bottom 45%", scrub: 0.6 },
          },
        );
      });

      // The motion graphics: drawn by scroll. Static (finished) art when motion is reduced.
      mm.add({ wide: WIDE, motion: mq.motion }, (ctx) => {
        const { wide, motion } = ctx.conditions ?? {};
        if (!motion) return;
        const cleanups: (() => void)[] = [];
        const add = (fn: void | (() => void)) => fn && cleanups.push(fn);

        if (wide) {
          // One pinned stage; each line of text below scrubs its own graphic, then hands over to the next.
          const items = gsap.utils.toArray<HTMLElement>("[data-cap-desktop] [data-cap-item]");
          const layers = gsap.utils.toArray<HTMLElement>("[data-cap-desktop] [data-cap-art]");
          const segs = gsap.utils.toArray<HTMLElement>("[data-cap-desktop] [data-cap-seg]");
          const last = items.length - 1;
          items.forEach((li, i) => {
            const text = li.querySelector("[data-cap-text]");
            const build = { trigger: li, start: "top 60%", end: "top top" };
            const tl = gsap.timeline({ scrollTrigger: { ...build, scrub: 0.5 } });
            add(capabilityArt[i].build(layers[i], tl));
            gsap.fromTo(segs[i], { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { ...build, scrub: true } });

            // The outgoing graphic is mostly gone before the next one fades in, so two never blend.
            if (i > 0) {
              const enter = { trigger: li, start: "top 55%", end: "top 43%", scrub: true };
              gsap.fromTo(layers[i], { opacity: 0, scale: 1.05 }, { opacity: 1, scale: 1, ease: "none", scrollTrigger: enter });
              gsap.fromTo(text, { opacity: 0.18 }, { opacity: 1, ease: "none", scrollTrigger: enter });
            }
            if (i < last) {
              const leave = { trigger: li, start: "bottom 67%", end: "bottom 55%", scrub: true };
              gsap.fromTo(layers[i], { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.96, ease: "none", immediateRender: false, scrollTrigger: leave });
              gsap.fromTo(text, { opacity: 1 }, { opacity: 0.18, ease: "none", immediateRender: false, scrollTrigger: leave });
            }
          });
        } else {
          // Phones and tablets: each tile draws itself as it scrolls up the screen.
          gsap.utils.toArray<HTMLElement>("[data-cap-mobile] [data-cap-stage]").forEach((stage, i) => {
            const tl = gsap.timeline({ scrollTrigger: { trigger: stage, start: "top 92%", end: "bottom 55%", scrub: 0.5 } });
            add(capabilityArt[i].build(stage, tl));
          });
        }
        return () => cleanups.forEach((fn) => fn());
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="about" ref={root} className="relative py-28 sm:py-40 cap-wide:pb-12">
      <div className="container-page">
        <SectionHeading label="About" title="Code with a purpose." />

        <div className="max-w-5xl">
          <p
            data-statement
            className="text-pretty text-[28px] font-semibold leading-[1.18] tracking-[-0.025em] sm:text-[40px] sm:leading-[1.14] lg:text-[48px] lg:leading-[1.1]"
          >
            {statement.split(" ").map((w, i) => (
              <span key={i} data-word className="inline">
                {w}{" "}
              </span>
            ))}
          </p>
          <p className="mt-10 max-w-2xl text-pretty text-[17px] leading-[1.47] text-muted sm:text-[21px] sm:leading-[1.38]">
            I learn by building. Each project is a chance to pick up a new tool, understand it properly and ship
            something people can use, from AI assistants to study apps.
          </p>
        </div>

        <h3 className="text-h3 mt-24 sm:mt-36">What I work on.</h3>

        {/* Large screens: text scrolls on the left, a pinned stage on the right plays one graphic per line. */}
        <div data-cap-desktop className="hidden grid-cols-12 gap-x-12 cap-wide:grid xl:gap-x-16">
          <ol className="col-span-5 pb-[34svh] pt-[6svh]">
            {interests.map(({ title, text }, i) => (
              <li key={title} data-cap-item className="flex min-h-[80svh] flex-col justify-center">
                <div data-cap-text>
                  <Index i={i} accent={capabilityArt[i].accent} />
                  <h4 className="mt-4 text-balance text-[40px] font-semibold leading-[1.05] tracking-[-0.03em] xl:text-[48px]">
                    {title}
                  </h4>
                  <p className="mt-4 max-w-md text-pretty text-[21px] leading-[1.38] text-muted">{text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="col-span-7">
            <div className="sticky top-0 flex h-[100svh] items-center">
              <div className="dark relative ml-auto aspect-[4/3] w-full max-w-[calc(74svh*4/3)] overflow-hidden rounded-[32px] bg-bg border border-white/[0.08]">
                <div className="stage-dots absolute inset-0" />
                {capabilityArt.map(({ Art, accent }, i) => (
                  <div key={i} data-cap-art={i} className="absolute inset-0">
                    <Glow accent={accent} />
                    <Art />
                  </div>
                ))}
                <div aria-hidden className="absolute inset-x-8 bottom-6 flex gap-1.5">
                  {interests.map(({ title }) => (
                    <span key={title} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/15">
                      <span data-cap-seg className="block h-full origin-left rounded-full bg-white/80" />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Phones, tablets and reduced motion: one tile per interest, each drawn as it scrolls in. */}
        <ul data-cap-mobile className="mt-12 grid gap-x-5 gap-y-12 sm:mt-16 sm:grid-cols-2 sm:gap-y-14 lg:grid-cols-3 cap-wide:hidden">
          {interests.map(({ title, text }, i) => {
            const { Art, accent } = capabilityArt[i];
            return (
              <li key={title}>
                <div data-cap-stage className="dark relative aspect-[4/3] overflow-hidden rounded-[24px] bg-bg border border-white/[0.08]">
                  <StageBackdrop accent={accent} />
                  <Art />
                </div>
                <div className="mt-5 px-1">
                  <Index i={i} accent={accent} />
                  <h4 className="mt-2 text-[24px] font-semibold leading-tight tracking-[-0.02em]">{title}</h4>
                  <p className="mt-2 text-pretty text-[17px] leading-[1.47] text-muted">{text}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
