"use client";

import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { DevNote } from "@/components/ui/DevNote";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { milestones } from "@/config/journey";
import { gsap, mq, useGSAP } from "@/lib/gsap";

export function Journey({ index = "05" }: { index?: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(mq.motion, () => {
        // The rail draws itself as you scroll through the timeline.
        gsap.fromTo(
          "[data-rail]",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: "[data-timeline]", start: "top 70%", end: "bottom 60%", scrub: 0.6 },
          },
        );
        gsap.utils.toArray<HTMLElement>("[data-node]").forEach((node) => {
          gsap.fromTo(
            node,
            { scale: 0.4, backgroundColor: "var(--bg)" },
            {
              scale: 1,
              backgroundColor: "var(--fg)",
              duration: 0.5,
              ease: "back.out(2)",
              scrollTrigger: { trigger: node, start: "top 65%", toggleActions: "play none none reverse" },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="journey" ref={root} className="relative py-28 sm:py-40">
      <div className="container-page">
        <SectionHeading
          index={index}
          label="Journey"
          title="Milestones so far."
          description="Projects shipped and steps taken, newest first."
          align="split"
        />

        <div className="mb-8 max-w-xl">
          <DevNote>Add milestones in src/config/journey.ts. Only add things that happened.</DevNote>
        </div>

        <ol data-timeline className="relative ml-1.5 sm:ml-0">
          {/* Rail */}
          <span aria-hidden className="absolute top-2 bottom-2 left-0 w-px bg-line sm:left-[calc(25%+0.5px)]" />
          <span
            aria-hidden
            data-rail
            className="absolute top-2 bottom-2 left-0 w-px origin-top bg-fg sm:left-[calc(25%+0.5px)]"
          />

          {milestones.map((m) => (
            <li key={m.title} className="relative grid gap-2 pb-14 pl-8 last:pb-0 sm:grid-cols-4 sm:gap-10 sm:pl-0">
              <span
                aria-hidden
                data-node
                className="absolute top-1.5 left-[-5px] size-[11px] rounded-full border-2 border-fg bg-fg sm:left-[calc(25%-5px)]"
              />
              <Reveal className="sm:pr-10 sm:text-right">
                <p className="font-mono text-sm tabular-nums text-muted">{m.date}</p>
              </Reveal>
              <Reveal className="sm:col-span-3 sm:pl-10" delay={0.08}>
                <span className="eyebrow">{m.tag}</span>
                <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">{m.title}</h3>
                <p className="mt-3 max-w-2xl text-pretty leading-relaxed text-muted">{m.description}</p>
                {m.link && (
                  <a
                    href={m.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-4 inline-flex items-center gap-1 text-sm font-medium underline decoration-line underline-offset-4 transition-colors hover:decoration-fg"
                  >
                    {m.link.label}
                    <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                )}
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
