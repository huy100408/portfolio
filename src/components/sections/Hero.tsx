"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { ArrowDownRight, Mail } from "lucide-react";
import { useRef } from "react";
import { FloatingShapes } from "@/components/motion/FloatingShapes";
import { Magnetic } from "@/components/motion/Magnetic";
import { SplitText } from "@/components/motion/SplitText";
import { useIntro } from "@/components/providers/IntroProvider";
import { ButtonLink } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/CopyButton";
import { Typewriter } from "@/components/ui/Typewriter";
import { site } from "@/config/site";
import { useReducedMotionPref } from "@/hooks/useMedia";
import { BrandIcon } from "@/lib/brand-icons";
import { gsap, mq, useGSAP } from "@/lib/gsap";
import { duration, ease } from "@/lib/motion";
import { scrollToSection } from "@/lib/utils";

// The canvas is decorative and the most expensive piece: load it after the page is interactive.
const ParticleField = dynamic(() => import("@/components/motion/ParticleField"), { ssr: false });

export function Hero() {
  const { done } = useIntro();
  const reduce = useReducedMotionPref();
  const root = useRef<HTMLElement>(null);
  const [first, last] = site.name.split(" ");

  // Cinematic exit: as you scroll away, the content lifts and fades while the background drifts slower.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(mq.motion, () => {
        const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
        gsap.to("[data-hero-content]", { yPercent: -18, opacity: 0.15, ease: "none", scrollTrigger: st });
        gsap.to("[data-hero-bg]", { yPercent: 22, ease: "none", scrollTrigger: st });
        gsap.to("[data-hero-scroll]", { opacity: 0, ease: "none", scrollTrigger: { ...st, end: "15% top" } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const appear = (delay: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: done ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
    transition: { duration: duration.slow, ease: ease.out, delay },
  });

  return (
    <section id="home" ref={root} className="relative isolate flex min-h-[100svh] flex-col overflow-hidden" aria-label="Introduction">
      {/* Background */}
      <div data-hero-bg aria-hidden className="absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_70%_60%_at_60%_40%,black,transparent)]" />
        <div className="animate-drift absolute -right-[10%] -top-[20%] size-[60vmax] rounded-full bg-[radial-gradient(circle,rgb(37_99_235/0.10),transparent_60%)] blur-2xl dark:bg-[radial-gradient(circle,rgb(96_165_250/0.10),transparent_60%)]" />
        <div className="animate-drift absolute -bottom-[30%] -left-[15%] size-[50vmax] rounded-full bg-[radial-gradient(circle,rgb(var(--particle)/0.05),transparent_60%)] blur-2xl" style={{ animationDelay: "-9s", animationDuration: "28s" }} />
        {!reduce && (
          <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: done ? 1 : 0 }} transition={{ duration: 2, delay: 0.4 }}>
            <ParticleField className="size-full" />
          </motion.div>
        )}
        <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: done ? 1 : 0 }} transition={{ duration: 1.6, delay: 0.3 }}>
          <FloatingShapes />
        </motion.div>
      </div>

      <div data-hero-content className="container-page flex flex-1 flex-col pb-24 pt-28 sm:pb-28 sm:pt-32">
        {/* Meta row */}
        <motion.div {...appear(0.1)} className="flex items-center justify-between font-mono text-xs text-muted" data-reveal>
          <span className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="animate-pulse-ring absolute inset-0 rounded-full bg-accent" />
              <span className="relative size-2 rounded-full bg-accent" />
            </span>
            Portfolio
          </span>
          <a href={site.github.url} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-fg">
            github.com/{site.github.username}
          </a>
        </motion.div>

        <div className="mt-auto pt-16">
          <motion.p {...appear(0.2)} className="eyebrow mb-6 sm:mb-8" data-reveal>
            {site.title}
          </motion.p>

          <h1 className="text-display" aria-label={site.name}>
            <span className="block">
              <SplitText text={first} by="chars" play={done} delay={0.1} />
            </span>
            <span className="block sm:pl-[12%]">
              <SplitText text={last} by="chars" play={done} delay={0.28} />
            </span>
          </h1>

          <div className="mt-10 grid gap-10 sm:mt-14 lg:grid-cols-12 lg:items-end">
            <motion.div {...appear(0.55)} className="lg:col-span-6" data-reveal>
              <Typewriter
                text={site.intro}
                start={done}
                className="max-w-xl text-pretty text-xl leading-snug tracking-[-0.01em] sm:text-2xl"
              />
            </motion.div>

            <motion.div {...appear(0.7)} className="flex flex-col gap-6 lg:col-span-6 lg:items-end" data-reveal>
              <div className="flex flex-wrap gap-3">
                <Magnetic>
                  <ButtonLink
                    href="#projects"
                    size="lg"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("projects");
                    }}
                    icon={<ArrowDownRight className="size-4 transition-transform duration-500 group-hover/btn:rotate-[-45deg]" />}
                  >
                    View Projects
                  </ButtonLink>
                </Magnetic>
                <Magnetic>
                  <ButtonLink
                    href="#contact"
                    size="lg"
                    variant="secondary"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("contact");
                    }}
                    icon={<Mail className="size-4" />}
                  >
                    Contact Me
                  </ButtonLink>
                </Magnetic>
              </div>
              <ul className="flex flex-wrap items-center gap-2" aria-label="Social links">
                <li>
                  <a
                    href={site.github.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-2 text-sm font-medium transition-colors hover:border-line-strong hover:bg-bg-2"
                  >
                    <BrandIcon name="github" className="size-4" /> GitHub
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${site.email}`}
                    className="inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-2 text-sm font-medium transition-colors hover:border-line-strong hover:bg-bg-2"
                  >
                    <Mail className="size-4" strokeWidth={1.75} /> Email
                  </a>
                </li>
                <li>
                  <CopyButton value={site.discord} label={`Copy Discord username ${site.discord}`}>
                    <span className="inline-flex items-center gap-2">
                      <BrandIcon name="discord" className="size-4" /> Discord
                    </span>
                  </CopyButton>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#about"
        onClick={(e) => {
          e.preventDefault();
          scrollToSection("about");
        }}
        data-hero-scroll
        aria-label="Scroll to the About section"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-muted transition-colors hover:text-fg sm:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: done ? 1 : 0 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <span className="flex h-9 w-5.5 justify-center rounded-full border border-current pt-1.5">
          <span className="animate-scroll-dot block size-1 rounded-full bg-current" />
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em]">Scroll</span>
      </motion.a>
    </section>
  );
}
