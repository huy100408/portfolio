"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { ProjectStage, projectAccent } from "@/components/graphics/ProjectArt";
import type { Project } from "@/config/projects";
import { BrandIcon } from "@/lib/brand-icons";
import { fadeUp, inView, staggerParent } from "@/lib/motion";
import { TechBadge } from "./Badge";

const textLink =
  "inline-flex items-center gap-1.5 text-[15px] font-medium text-accent hover:underline hover:underline-offset-4";

/**
 * One card of the projects deck: artwork on a black stage (top on phones, right on large screens)
 * and the write-up beside it. `[data-card-shade]` dims the card when the next one covers it.
 */
export function ProjectCard({
  project,
  index,
  total,
  onOpen,
}: {
  project: Project;
  index: number;
  total: number;
  onOpen: (slug: string) => void;
}) {
  return (
    <article
      data-project-card
      className="group relative overflow-hidden rounded-tile bg-bg-2 shadow-lift lg:grid lg:h-[min(600px,calc(100svh-7.5rem))] lg:grid-cols-12"
    >
      <button
        type="button"
        onClick={() => onOpen(project.slug)}
        aria-label={`Open details for ${project.name}`}
        className="block w-full p-2.5 text-left sm:p-3 lg:order-2 lg:col-span-7 lg:h-full"
      >
        <span className="relative block aspect-[4/3] overflow-hidden rounded-[20px] sm:aspect-[16/10] lg:aspect-auto lg:h-full">
          <ProjectStage
            project={project}
            priority={index < 2}
            className="transition-[scale] duration-1000 ease-out-expo group-hover:scale-[1.015] motion-reduce:transition-none"
          />
        </span>
      </button>

      <motion.div
        className="flex flex-col px-6 pb-7 pt-4 sm:px-9 sm:pb-9 sm:pt-6 lg:order-1 lg:justify-center lg:col-span-5 lg:px-10 lg:py-10 xl:px-12 xl:py-12"
        variants={staggerParent(0.06, 0.05)}
        initial="hidden"
        whileInView="show"
        viewport={inView}
      >
        <motion.p variants={fadeUp} data-reveal className="flex items-center gap-2.5 text-[13px] font-semibold tabular-nums text-muted">
          <span className="size-2 rounded-full" style={{ background: projectAccent[project.art] }} />
          {String(index + 1).padStart(2, "0")}
          <span aria-hidden className="text-line-strong">/</span>
          {String(total).padStart(2, "0")}
          {project.year && <span className="font-medium">· {project.year}</span>}
        </motion.p>

        <motion.div variants={fadeUp} data-reveal>
          <h3 className="mt-3 text-balance text-[30px] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[40px] lg:mt-5 lg:text-[36px] xl:text-[44px]">
            {project.name}
          </h3>
          <p className="mt-2 text-[17px] text-muted sm:text-[19px]">{project.tagline}</p>
        </motion.div>

        <motion.p variants={fadeUp} data-reveal className="mt-4 line-clamp-4 text-pretty text-[15px] leading-relaxed text-fg/80 sm:text-[17px] lg:line-clamp-3 xl:line-clamp-4">
          {project.summary}
        </motion.p>

        {project.tech.length > 0 && (
          <motion.ul variants={fadeUp} data-reveal className="mt-5 flex flex-wrap gap-1.5" aria-label="Technologies">
            {project.tech.slice(0, 5).map((t) => (
              <li key={t}>
                <TechBadge name={t} />
              </li>
            ))}
            {project.tech.length > 5 && (
              <li className="self-center px-1 text-[12px] font-medium text-muted">+{project.tech.length - 5}</li>
            )}
          </motion.ul>
        )}

        <motion.div variants={fadeUp} data-reveal className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 lg:mt-9">
          <button
            type="button"
            onClick={() => onOpen(project.slug)}
            className="group/btn inline-flex h-10 items-center gap-1 rounded-full bg-cta pl-5 pr-4 text-[15px] font-medium text-white transition-[background-color,scale] hover:bg-cta-hover active:scale-95"
          >
            View details
            <ChevronRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" strokeWidth={2.2} />
          </button>
          {project.repo && (
            <a href={project.repo} target="_blank" rel="noopener noreferrer" className={textLink}>
              <BrandIcon name="github" className="size-3.5" />
              GitHub
              <span className="sr-only">repository for {project.name} (opens in a new tab)</span>
            </a>
          )}
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noopener noreferrer" className={`${textLink} gap-1`}>
              {project.demoLabel ?? "Live demo"}
              <ArrowUpRight className="size-3.5" />
              <span className="sr-only">for {project.name} (opens in a new tab)</span>
            </a>
          )}
        </motion.div>
      </motion.div>

      <div data-card-shade aria-hidden className="pointer-events-none absolute inset-0 bg-bg opacity-0" />
    </article>
  );
}
