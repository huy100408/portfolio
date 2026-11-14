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
        <SectionHeading index="01" label="About" title="Code with a purpose." />

        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <p data-statement className="text-pretty text-[1.65rem] font-medium leading-[1.25] tracking-[-0.025em] sm:text-4xl sm:leading-[1.2]">
              {statement.split(" ").map((w, i) => (
                <span key={i} data-word className="inline">
                  {w}{" "}
                </span>
              ))}
            </p>
            <p className="mt-8 max-w-xl text-pretty text-lg leading-relaxed text-muted">
              I learn by building. Each project is a chance to pick up a new tool, understand it properly and ship
              something people can use, from AI assistants to study apps.
            </p>
          </div>

          <RevealGroup as="ul" className="border-t border-line lg:col-span-5" each={0.07}>
            {interests.map(({ title, text, icon: Icon }, i) => (
              <RevealItem as="li" key={title} className="group border-b border-line">
                <div className="flex items-start gap-4 py-5 transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5">
                  <span className="mt-0.5 font-mono text-xs text-muted tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold tracking-tight">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
                  </div>
                  <span className="grid size-9 shrink-0 place-items-center rounded-full border border-line text-muted transition-all duration-500 ease-out-expo group-hover:rotate-[-8deg] group-hover:border-fg group-hover:bg-fg group-hover:text-bg">
                    <Icon className="size-4" strokeWidth={1.75} />
                  </span>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
