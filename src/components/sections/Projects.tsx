"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Fragment, useCallback, useRef, useState } from "react";
import { projectBuild } from "@/components/graphics/ProjectArt";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { ProjectModal } from "@/components/ui/ProjectModal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { projects } from "@/config/projects";
import { site } from "@/config/site";
import { BrandIcon } from "@/lib/brand-icons";
import { ScrollTrigger, gsap, mq, useGSAP } from "@/lib/gsap";
import { fadeUp, inView } from "@/lib/motion";

/*
 * A deck of sticky cards. Each card stops near the top of the screen and the next one slides
 * up over it, while the covered card shrinks back and dims. Each card's artwork is drawn by scroll.
 *
 * The cards themselves are sticky, so scroll positions are read from the plain spacers between
 * them ([data-stack-mark]): the bottom of spacer i is where card i starts in the page.
 */
export function Projects() {
  const root = useRef<HTMLElement>(null);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const open = projects.find((p) => p.slug === openSlug) ?? null;
  const close = useCallback(() => setOpenSlug(null), []);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-stack-card]");
      const marks = gsap.utils.toArray<HTMLElement>("[data-stack-mark]");

      // A card's height feeds its sticky `top`, so a card taller than the screen still shows its bottom.
      let raf = 0;
      const measure = () => cards.forEach((c) => c.style.setProperty("--h", `${c.offsetHeight}px`));
      measure();
      const ro = new ResizeObserver(() => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          measure();
          ScrollTrigger.refresh();
        });
      });
      cards.forEach((c) => ro.observe(c));

      const mm = gsap.matchMedia();
      mm.add(mq.motion, () => {
        const cleanups: (() => void)[] = [];
        const last = cards.length - 1;
        cards.forEach((card, i) => {
          const stage = card.querySelector("[data-stage]");
          if (stage) {
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: marks[i],
                start: "bottom 85%",
                endTrigger: marks[i + 1],
                // Done just as the next card comes in (for the last card: just before it settles).
                end: i < last ? "bottom 80%" : "top 80%",
                scrub: 0.5,
              },
            });
            const cleanup = projectBuild(projects[i])(stage, tl);
            if (cleanup) cleanups.push(cleanup);
          }

          if (i < last) {
            const next = cards[i + 1];
            const covered = {
              trigger: marks[i + 1],
              start: "bottom bottom",
              end: () => `bottom ${parseFloat(getComputedStyle(next).top) || 0}px`,
              scrub: true,
              invalidateOnRefresh: true,
            };
            gsap.fromTo(
              card.querySelector("[data-project-card]"),
              { scale: 1 },
              { scale: 0.92, transformOrigin: "50% 0%", ease: "none", scrollTrigger: covered },
            );
            gsap.fromTo(card.querySelector("[data-card-shade]"), { opacity: 0 }, { opacity: 0.55, ease: "none", scrollTrigger: covered });
          }
        });
        return () => cleanups.forEach((fn) => fn());
      });

      return () => {
        ro.disconnect();
        cancelAnimationFrame(raf);
        mm.revert();
      };
    },
    { scope: root },
  );

  return (
    <section id="projects" ref={root} className="relative py-28 sm:py-40">
      <div className="container-page">
        <SectionHeading
          label="Projects"
          title="Selected work."
          description="Open any project for the full story, screenshots and links."
          align="split"
        />

        <div className="relative">
          {projects.map((p, i) => (
            <Fragment key={p.slug}>
              <div data-stack-mark aria-hidden className={i === 0 ? "h-0" : "h-[10svh] lg:h-[28svh]"} />
              <div data-stack-card className="stack-card" style={{ "--i": i } as React.CSSProperties}>
                <ProjectCard project={p} index={i} total={projects.length} onOpen={setOpenSlug} />
              </div>
            </Fragment>
          ))}
          {/* Holds the finished deck on screen for a moment before it scrolls away. */}
          <div data-stack-mark aria-hidden className="h-[6svh] lg:h-[14svh]" />
        </div>

        <motion.a
          href={site.github.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-6 flex items-center justify-between gap-6 rounded-tile bg-bg-2 px-6 py-6 transition-colors hover:bg-bg-3 sm:px-10 sm:py-9 lg:mt-10"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          data-reveal
        >
          <span className="flex min-w-0 items-center gap-4 sm:gap-6">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-fg text-bg sm:size-14">
              <BrandIcon name="github" className="size-6 sm:size-7" />
            </span>
            <span className="min-w-0">
              <span className="block text-[21px] font-semibold tracking-[-0.02em] sm:text-[28px]">More on GitHub</span>
              <span className="block truncate text-[15px] text-muted sm:text-[17px]">github.com/{site.github.username}</span>
            </span>
          </span>
          <ArrowUpRight className="size-6 shrink-0 text-accent transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          <span className="sr-only">(opens in a new tab)</span>
        </motion.a>
      </div>

      <ProjectModal project={open} onClose={close} />
    </section>
  );
}
