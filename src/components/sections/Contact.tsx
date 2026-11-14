"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Mail } from "lucide-react";
import { Magnetic } from "@/components/motion/Magnetic";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { CopyButton } from "@/components/ui/CopyButton";
import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/config/site";
import { BrandIcon } from "@/lib/brand-icons";
import { duration, ease, inView } from "@/lib/motion";

function Tile({ children }: { children: React.ReactNode }) {
  return (
    <div className="spotlight flex h-full flex-col rounded-tile bg-bg-2 p-7 text-left transition-transform duration-700 ease-out-expo hover:-translate-y-1 sm:p-8">
      {children}
    </div>
  );
}

const tileLabel = "mt-10 text-[13px] font-semibold text-muted";
const tileAction =
  "inline-flex items-center gap-1.5 text-[15px] font-medium text-accent transition-colors hover:underline hover:underline-offset-4";

export function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden pb-28 pt-32 text-center sm:pb-40 sm:pt-48">
      {/* A second horizon, smaller, glowing up behind the headline. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[56rem] overflow-hidden [mask-image:linear-gradient(to_bottom,black_55%,transparent)]">
        <div className="absolute left-1/2 top-[30%] size-[110vmax] -translate-x-1/2 sm:top-[22%] sm:size-[90vmax]">
          <div className="aurora-haze animate-spin-slow size-full opacity-25 blur-3xl dark:opacity-40" />
        </div>
      </div>

      <div className="container-page relative">
        <motion.p
          className="text-[17px] font-semibold text-gradient sm:text-[21px]"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inView}
          transition={{ duration: duration.slow, ease: ease.out }}
          data-reveal
        >
          Contact
        </motion.p>

        {/* One element (not split pieces) so the flowing gradient stays continuous across the line. */}
        <motion.h2
          className="text-display text-shimmer mx-auto mt-4 max-w-[11ch] pb-[0.06em] text-balance"
          initial={{ opacity: 0, y: 40, scale: 0.96, filter: "blur(16px)" }}
          whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          viewport={inView}
          transition={{ duration: duration.cinematic * 1.3, ease: ease.out, delay: 0.1 }}
          data-reveal
        >
          Let&apos;s build something.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inView}
          transition={{ duration: duration.slow, ease: ease.out, delay: 0.4 }}
          data-reveal
        >
          <p className="mx-auto mt-8 max-w-xl text-pretty text-[17px] leading-[1.47] text-muted sm:text-[21px] sm:leading-[1.38]">
            Have a project, an idea or a question? Email is the best way to reach me.
          </p>
          <div className="mt-10 flex justify-center">
            <Magnetic>
              <span className="glow-ring block">
                <ButtonLink href={`mailto:${site.email}`} size="lg" icon={<ArrowUpRight className="size-4" />}>
                  Send an email
                </ButtonLink>
              </span>
            </Magnetic>
          </div>
        </motion.div>

        <RevealGroup className="mx-auto mt-24 grid max-w-5xl gap-4 sm:mt-32 md:grid-cols-3" each={0.08}>
          <RevealItem>
            <Tile>
              <span className="grid size-12 place-items-center rounded-2xl bg-bg text-fg">
                <Mail className="size-[22px]" strokeWidth={1.9} />
              </span>
              <p className={tileLabel}>Email</p>
              <a
                href={`mailto:${site.email}`}
                className="mt-1 break-all text-[21px] font-semibold tracking-[-0.015em] underline-offset-4 hover:underline"
              >
                {site.email}
              </a>
              <div className="mt-auto pt-8">
                <CopyButton value={site.email} label="Copy email address" bare className={tileAction}>
                  Copy email
                </CopyButton>
              </div>
            </Tile>
          </RevealItem>
          <RevealItem>
            <Tile>
              <span className="grid size-12 place-items-center rounded-2xl bg-[#5865F2] text-white">
                <BrandIcon name="discord" className="size-[22px]" />
              </span>
              <p className={tileLabel}>Discord</p>
              <p className="mt-1 text-[21px] font-semibold tracking-[-0.015em]">{site.discord}</p>
              <div className="mt-auto pt-8">
                <CopyButton value={site.discord} label={`Copy Discord username ${site.discord}`} bare className={tileAction}>
                  Copy username
                </CopyButton>
              </div>
            </Tile>
          </RevealItem>
          <RevealItem>
            <Tile>
              <span className="grid size-12 place-items-center rounded-2xl bg-fg text-bg">
                <BrandIcon name="github" className="size-[22px]" />
              </span>
              <p className={tileLabel}>GitHub</p>
              <p className="mt-1 text-[21px] font-semibold tracking-[-0.015em]">@{site.github.username}</p>
              <div className="mt-auto pt-8">
                <a href={site.github.url} target="_blank" rel="noopener noreferrer" className={tileAction}>
                  View profile <ArrowUpRight className="size-4" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </div>
            </Tile>
          </RevealItem>
        </RevealGroup>

        {site.linkedin && (
          <p className="mt-8 text-sm text-muted">
            Also on{" "}
            <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="font-medium text-accent hover:underline">
              LinkedIn
            </a>
            .
          </p>
        )}
      </div>
    </section>
  );
}
