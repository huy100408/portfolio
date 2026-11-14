"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { ProjectModal } from "@/components/ui/ProjectModal";
import { projects } from "@/config/projects";
import { site } from "@/config/site";
import { useMedia } from "@/hooks/useMedia";
import { BrandIcon } from "@/lib/brand-icons";
import { gsap, useGSAP } from "@/lib/gsap";
import { fadeUp, inView } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Horizontal pinned showcase only where it fits: wide + tall enough screens that allow motion. */
const HORIZONTAL_QUERY =
  "(min-width: 1024px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)";

export function Projects() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const horizontal = useMedia(HORIZONTAL_QUERY);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const open = projects.find((p) => p.slug === openSlug) ?? null;
  const close = useCallback(() => setOpenSlug(null), []);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      if (horizontal && pin.current && track.current) {
        const t = track.current;
        const distance = () => t.scrollWidth - window.innerWidth;
        const tween = gsap.to(t, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
        gsap.to("[data-progress]", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: pin.current, start: "top top", end: () => `+=${distance()}`, scrub: true },
        });
        // Each image drifts against the horizontal movement.
        gsap.utils.toArray<HTMLElement>("[data-project-card]").forEach((card) => {
          const img = card.querySelector("[data-parallax]");
          if (!img) return;
          gsap.fromTo(
            img,
            { xPercent: -5 },
            {
              xPercent: 5,
              ease: "none",
              scrollTrigger: { trigger: card, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
            },
          );
        });
      } else {
        // Vertical layout: classic vertical image parallax.
        gsap.utils.toArray<HTMLElement>("[data-project-card] [data-parallax]").forEach((img) => {
          gsap.fromTo(
            img,
            { yPercent: -5 },
            { yPercent: 5, ease: "none", scrollTrigger: { trigger: img, start: "top bottom", end: "bottom top", scrub: true } },
          );
        });
      }
    },
    { scope: root, dependencies: [horizontal], revertOnUpdate: true },
  );

  return (
    <section id="projects" ref={root} className="relative py-28 sm:py-40 lg:pb-0">
      <div className="container-page">
        <SectionHeading
          label="Projects"
          title="Selected work."
          description={
            horizontal
              ? "Keep scrolling to move through the projects. Open any card for the full story."
              : "Open any card for the full story, screenshots and links."
          }
          align="split"
          className="lg:mb-4"
        />
      </div>

      <div ref={pin} className={cn(horizontal && "flex h-[100svh] flex-col justify-center overflow-hidden")}>
        <div
          ref={track}
          className={cn(
            horizontal
              ? "flex w-max items-stretch gap-6 pl-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))] pr-[10vw] will-change-transform"
              : "container-page grid gap-6 md:grid-cols-2",
          )}
        >
          {projects.map((p, i) => (
            <motion.div
              key={p.slug}
              className={cn(horizontal && "w-[min(500px,36vw)] shrink-0")}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={inView}
              data-reveal
            >
              <ProjectCard project={p} index={i} total={projects.length} onOpen={setOpenSlug} />
            </motion.div>
          ))}

          <motion.a
            href={site.github.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "spotlight group flex flex-col justify-between rounded-tile bg-bg-2 p-8 transition-transform duration-700 ease-out-expo hover:-translate-y-1",
              horizontal ? "w-[min(340px,26vw)] shrink-0" : "min-h-56",
            )}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            data-reveal
          >
            <BrandIcon name="github" className="size-8" />
            <div>
              <p className="text-[28px] font-semibold tracking-[-0.02em]">More on GitHub</p>
              <p className="mt-2 inline-flex items-center gap-1 text-[17px] text-accent">
                github.com/{site.github.username}
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </p>
            </div>
            <span className="sr-only">(opens in a new tab)</span>
          </motion.a>
        </div>

        {horizontal && (
          <div className="container-page mt-10 flex items-center gap-4 text-[12px] font-medium text-muted">
            <span>Scroll</span>
            <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-bg-3">
              <div data-progress className="h-full origin-left scale-x-0 rounded-full bg-[linear-gradient(90deg,var(--brand-1),var(--brand-2),var(--brand-3))]" />
            </div>
            <span className="tabular-nums">{String(projects.length).padStart(2, "0")} projects</span>
          </div>
        )}
      </div>

      <ProjectModal project={open} onClose={close} />
    </section>
  );
}
