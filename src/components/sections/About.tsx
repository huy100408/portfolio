"use client";

import { Bot, Brain, Code2, Globe, Layers, Sparkles, type LucideIcon } from "lucide-react";
import { useRef } from "react";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { gsap, mq, useGSAP } from "@/lib/gsap";

const statement =
  "I'm Brian, a developer who likes turning ideas into working software. I build modern applications, experiment with artificial intelligence, and enjoy the moment code starts moving things in the real world.";

const interests: { title: string; text: string; icon: LucideIcon }[] = [
  { title: "Software engineering", text: "Writing code that is clear, tested and easy to change.", icon: Code2 },
  { title: "Modern applications", text: "Apps for the web and the desktop that feel fast and polished.", icon: Layers },
  { title: "Artificial intelligence", text: "Assistants and tools that put models to practical use.", icon: Brain },
  { title: "Web development", text: "Interfaces built with React, Next.js and TypeScript.", icon: Globe },
  { title: "Robotics & automation", text: "Getting software to sense, decide and act.", icon: Bot },
  { title: "Learning new technologies", text: "Picking up a new tool by building something real with it.", icon: Sparkles },
];

/** Icon tile gradients, cycled through the brand palette. */
const tints: [string, string][] = [
  ["--brand-1", "--brand-2"],
  ["--brand-2", "--brand-3"],
  ["--brand-3", "--brand-4"],
  ["--brand-4", "--brand-3"],
  ["--brand-2", "--brand-1"],
  ["--brand-1", "--brand-3"],
];

export function About() {
  const root = useRef<HTMLElement>(null);

  // Words light up one by one as the paragraph scrolls through the viewport.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
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
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="about" ref={root} className="relative py-28 sm:py-40">
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

        <RevealGroup as="ul" className="mt-20 grid gap-4 sm:mt-28 sm:grid-cols-2 lg:grid-cols-3" each={0.07}>
          {interests.map(({ title, text, icon: Icon }, i) => (
            <RevealItem as="li" key={title} className="h-full">
              <div className="spotlight group flex h-full flex-col rounded-tile bg-bg-2 p-7 transition-transform duration-700 ease-out-expo hover:-translate-y-1 sm:p-8">
                <span
                  className="grid size-12 place-items-center rounded-2xl text-white shadow-soft transition-transform duration-700 ease-out-expo group-hover:rotate-[-6deg] group-hover:scale-110"
                  style={{ background: `linear-gradient(135deg, var(${tints[i % tints.length][0]}), var(${tints[i % tints.length][1]}))` }}
                >
                  <Icon className="size-[22px]" strokeWidth={1.9} />
                </span>
                <h3 className="mt-10 text-[21px] font-semibold leading-tight tracking-[-0.015em]">{title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted sm:text-[17px]">{text}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
