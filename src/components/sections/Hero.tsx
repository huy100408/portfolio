"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, ChevronDown, Mail } from "lucide-react";
import { useRef } from "react";
import { Magnetic } from "@/components/motion/Magnetic";
import { SplitText } from "@/components/motion/SplitText";
import { useIntro } from "@/components/providers/IntroProvider";
import { ButtonLink } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/CopyButton";
import { site } from "@/config/site";
import { useFinePointer, useReducedMotionPref } from "@/hooks/useMedia";
import { BrandIcon } from "@/lib/brand-icons";
import { gsap, mq, useGSAP } from "@/lib/gsap";
import { duration, ease, spring } from "@/lib/motion";
import { scrollToSection } from "@/lib/utils";

const socialLink =
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium text-muted transition-colors hover:bg-fg/5 hover:text-fg";

export function Hero() {
  const { done } = useIntro();
  const root = useRef<HTMLElement>(null);
  const fine = useFinePointer();
  const reduce = useReducedMotionPref();
  const [first, last] = site.name.split(" ");

  // The horizon leans gently toward the cursor.
  const px = useSpring(useMotionValue(0), spring.soft);
  const py = useSpring(useMotionValue(0), spring.soft);

  // Exit: as you scroll away the content recedes (smaller, fainter, softer) and the horizon sinks.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ desktop: mq.desktopMotion, mobile: mq.mobileMotion }, (ctx) => {
        const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
        const blur = ctx.conditions?.desktop ? { filter: "blur(10px)" } : {};
        gsap.fromTo(
          "[data-hero-content]",
          { scale: 1, opacity: 1, yPercent: 0, ...(ctx.conditions?.desktop ? { filter: "blur(0px)" } : {}) },
          { scale: 0.86, opacity: 0, yPercent: -12, ...blur, ease: "none", scrollTrigger: { ...st, end: "85% top" } },
        );
        gsap.to("[data-hero-bg]", { yPercent: 28, scale: 1.12, ease: "none", scrollTrigger: st });
        gsap.to("[data-hero-scroll]", { opacity: 0, ease: "none", scrollTrigger: { ...st, end: "15% top" } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const appear = (delay: number) => ({
    initial: { opacity: 0, y: 20, filter: "blur(8px)" },
    animate: done ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 20, filter: "blur(8px)" },
    transition: { duration: duration.cinematic, ease: ease.out, delay },
  });

  return (
    <section
      id="home"
      ref={root}
      aria-label="Introduction"
      className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden"
      onPointerMove={(e) => {
        if (!fine || reduce) return;
        px.set((e.clientX / window.innerWidth - 0.5) * 40);
        py.set((e.clientY / window.innerHeight - 0.5) * 24);
      }}
    >
      {/* Horizon: a slowly turning ring of colour rising from below, like light over a planet's edge. */}
      <div data-hero-bg aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, y: "18%", scale: 0.92 }}
          animate={done ? { opacity: 1, y: "0%", scale: 1 } : { opacity: 0, y: "18%", scale: 0.92 }}
          transition={{ duration: 2.4, ease: ease.out, delay: 0.2 }}
        >
          <motion.div className="absolute inset-0" style={{ x: px, y: py }}>
            <div className="absolute left-1/2 top-[66%] size-[170vmax] -translate-x-1/2 sm:top-[56%] sm:size-[150vmax]">
              <div className="animate-breathe size-full">
                <div className="aurora-haze animate-spin-slow size-full opacity-40 blur-3xl dark:opacity-60" />
              </div>
            </div>
            <div className="absolute left-1/2 top-[66%] size-[170vmax] -translate-x-1/2 sm:top-[56%] sm:size-[150vmax]">
              <div className="aurora-ring animate-spin-slow size-full opacity-80 blur-[3px] dark:opacity-100" />
            </div>
          </motion.div>
        </motion.div>
        {/* Soft colour fields drifting near the top. */}
        <div className="animate-drift absolute -left-[10%] -top-[25%] size-[55vmax] rounded-full bg-[radial-gradient(closest-side,rgb(0_113_227/0.10),transparent)] blur-2xl dark:bg-[radial-gradient(closest-side,rgb(41_151_255/0.14),transparent)]" />
        <div
          className="animate-drift absolute -right-[12%] -top-[10%] size-[45vmax] rounded-full bg-[radial-gradient(closest-side,rgb(139_92_246/0.10),transparent)] blur-2xl dark:bg-[radial-gradient(closest-side,rgb(167_139_250/0.14),transparent)]"
          style={{ animationDelay: "-11s", animationDuration: "26s" }}
        />
      </div>

      <div data-hero-content className="container-page flex flex-col items-center pb-36 pt-28 text-center sm:pb-40 sm:pt-32">
        <motion.p {...appear(0.05)} className="text-shimmer text-[17px] font-semibold tracking-[-0.01em] sm:text-[24px]" data-reveal>
          {site.title}
        </motion.p>

        <h1 className="text-display mt-4 sm:mt-5" aria-label={site.name}>
          <span className="block sm:inline">
            <SplitText text={first} by="chars" effect="blur" play={done} delay={0.15} />
          </span>
          <span className="hidden sm:inline"> </span>
          <span className="block sm:inline">
            <SplitText text={last} by="chars" effect="blur" play={done} delay={0.32} />
          </span>
        </h1>

        <SplitText
          as="p"
          text={site.intro}
          effect="blur"
          play={done}
          delay={0.7}
          className="mt-6 max-w-[34ch] text-balance text-[21px] font-semibold leading-[1.2] tracking-[-0.015em] text-muted sm:mt-8 sm:text-[28px] sm:leading-[1.15]"
        />

        <motion.div {...appear(1.05)} className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:mt-12" data-reveal>
          <Magnetic>
            <span className="glow-ring block">
              <ButtonLink
                href="#projects"
                size="lg"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("projects");
                }}
                icon={<ArrowRight className="size-4 transition-transform duration-500 ease-out-expo group-hover/btn:translate-x-0.5" />}
              >
                View Projects
              </ButtonLink>
            </span>
          </Magnetic>
          <Magnetic>
            <ButtonLink
              href="#contact"
              size="lg"
              variant="secondary"
              className="bg-bg/60 backdrop-blur"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("contact");
              }}
            >
              Contact Me
            </ButtonLink>
          </Magnetic>
        </motion.div>

        <motion.ul {...appear(1.25)} className="mt-8 flex flex-wrap items-center justify-center gap-1" aria-label="Social links" data-reveal>
          <li>
            <a href={site.github.url} target="_blank" rel="noopener noreferrer" className={socialLink}>
              <BrandIcon name="github" className="size-3.5" /> GitHub
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
          <li>
            <a href={`mailto:${site.email}`} className={socialLink}>
              <Mail className="size-3.5" strokeWidth={2} /> Email
            </a>
          </li>
          <li>
            <CopyButton
              value={site.discord}
              label={`Copy Discord username ${site.discord}`}
              bare
              className={socialLink}
            >
              Discord
            </CopyButton>
          </li>
        </motion.ul>
      </div>

      <motion.a
        href="#origin"
        onClick={(e) => {
          e.preventDefault();
          scrollToSection("origin");
        }}
        data-hero-scroll
        aria-label="Scroll down"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-[12px] sm:flex font-medium text-muted transition-colors hover:text-fg"
        initial={{ opacity: 0 }}
        animate={{ opacity: done ? 1 : 0 }}
        transition={{ delay: 1.8, duration: 0.8 }}
      >
        Scroll
        <ChevronDown className="animate-float size-4" />
      </motion.a>
    </section>
  );
}
