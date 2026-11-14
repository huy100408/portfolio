"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/config/projects";
import { BrandIcon } from "@/lib/brand-icons";
import { ease, spring } from "@/lib/motion";
import { ButtonLink } from "./Button";
import { TechBadge } from "./Badge";
import { ProjectArt } from "./ProjectArt";
import { DevNote } from "./DevNote";
import { cn } from "@/lib/utils";

const list = { hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.2 } } };
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: ease.out } },
};

function Gallery({ project }: { project: Project }) {
  const [active, setActive] = useState(0);
  if (project.images.length === 0) {
    return (
      <div className="aspect-[16/10] overflow-hidden rounded-xl border border-line">
        <ProjectArt kind={project.art} />
      </div>
    );
  }
  const img = project.images[active];
  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-line bg-bg-2">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={active}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: ease.out }}
          >
            <Image src={img.src} alt={img.alt} placeholder="blur" sizes="(min-width: 768px) 720px, 100vw" className="size-full object-cover object-top" />
          </motion.div>
        </AnimatePresence>
      </div>
      {project.images.length > 1 && (
        <div className="mt-3 flex gap-2" role="tablist" aria-label="Screenshots">
          {project.images.map((im, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Screenshot ${i + 1}: ${im.alt}`}
              onClick={() => setActive(i)}
              className={cn(
                "relative h-14 w-20 overflow-hidden rounded-lg border transition-all",
                i === active ? "border-fg" : "border-line opacity-60 hover:opacity-100",
              )}
            >
              <Image src={im.src} alt="" sizes="80px" className="size-full object-cover object-top" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!project) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    closeBtn.current?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panel.current) {
        // Keep keyboard focus inside the dialog.
        const f = panel.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      html.style.overflow = prevOverflow;
      previouslyFocused?.focus({ preventScroll: true });
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          key="overlay"
          className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 1 }}
          exit={{ opacity: 1 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm dark:bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={onClose}
          />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-title"
            className="relative max-h-[92dvh] w-full max-w-3xl overflow-y-auto overscroll-contain rounded-t-3xl border border-line bg-bg shadow-lift sm:rounded-3xl"
            initial={{ opacity: 0, y: 60, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98, transition: { duration: 0.25, ease: ease.inOut } }}
            transition={spring.soft}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-bg/85 px-5 py-3 backdrop-blur sm:px-7">
              <span className="eyebrow">{project.tagline}</span>
              <button
                ref={closeBtn}
                type="button"
                onClick={onClose}
                className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-bg-2 hover:text-fg"
                aria-label="Close project details"
              >
                <X className="size-5" />
              </button>
            </div>

            <motion.div className="p-5 sm:p-7" variants={list} initial="hidden" animate="show">
              <motion.div variants={item}>
                <Gallery project={project} />
              </motion.div>

              <motion.h3 variants={item} id="project-title" className="mt-7 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                {project.name}
              </motion.h3>
              <motion.p variants={item} className="mt-3 text-pretty text-base leading-relaxed text-muted sm:text-lg">
                {project.summary}
              </motion.p>

              {project.highlights.length > 0 && (
                <motion.ul variants={list} className="mt-7 space-y-3">
                  {project.highlights.map((h) => (
                    <motion.li key={h} variants={item} className="flex gap-3 text-[15px] leading-relaxed">
                      <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" />
                      <span>{h}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              )}

              {project.needsInfo && (
                <motion.div variants={item} className="mt-6 space-y-3">
                  <p className="rounded-xl border border-dashed border-line p-4 text-sm text-muted">
                    A full write-up for this project is coming soon.
                  </p>
                  <DevNote>
                    Fill in <code>{project.slug}</code> in <code>src/config/projects.ts</code> (summary, highlights,
                    tech, repo, images) and remove <code>needsInfo</code>.
                  </DevNote>
                </motion.div>
              )}

              {project.tech.length > 0 && (
                <motion.div variants={item} className="mt-7">
                  <p className="eyebrow mb-3">Built with</p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.map((t) => (
                      <TechBadge key={t} name={t} />
                    ))}
                  </div>
                </motion.div>
              )}

              {(project.repo || project.demo) && (
                <motion.div variants={item} className="mt-8 flex flex-wrap gap-3 border-t border-line pt-6">
                  {project.repo && (
                    <ButtonLink href={project.repo} external icon={<BrandIcon name="github" className="size-4" />}>
                      View on GitHub
                    </ButtonLink>
                  )}
                  {project.demo && (
                    <ButtonLink href={project.demo} external variant="secondary" icon={<ArrowUpRight className="size-4" />}>
                      {project.demoLabel ?? "Live demo"}
                    </ButtonLink>
                  )}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
