"use client";

import { ArrowUpRight, Plus } from "lucide-react";
import type { Project } from "@/config/projects";
import { BrandIcon } from "@/lib/brand-icons";
import { TiltCard } from "@/components/motion/TiltCard";
import { TechBadge } from "./Badge";
import { ProjectMedia } from "./ProjectMedia";
import { cn } from "@/lib/utils";

export function ProjectCard({
  project,
  index,
  total,
  onOpen,
  className,
}: {
  project: Project;
  index: number;
  total: number;
  onOpen: (slug: string) => void;
  className?: string;
}) {
  return (
    <TiltCard className={cn("rounded-tile", className)} max={5}>
      <article data-project-card className="spotlight group flex h-full flex-col overflow-hidden rounded-tile bg-bg-2">
        <div className="flex flex-1 flex-col px-7 pt-8 sm:px-9 sm:pt-10">
          <p className="text-[13px] font-semibold text-muted tabular-nums">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            {project.year && <span> · {project.year}</span>}
          </p>
          <h3 className="mt-2 text-[28px] font-semibold leading-tight tracking-[-0.02em] sm:text-[32px]">{project.name}</h3>
          <p className="mt-1 text-[17px] text-muted">{project.tagline}</p>
          <p className="mt-4 line-clamp-3 text-pretty text-[15px] leading-relaxed text-fg/80">{project.summary}</p>

          {project.tech.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Technologies">
              {project.tech.slice(0, 5).map((t) => (
                <li key={t}>
                  <TechBadge name={t} />
                </li>
              ))}
              {project.tech.length > 5 && (
                <li className="self-center px-1 text-[12px] font-medium text-muted">+{project.tech.length - 5}</li>
              )}
            </ul>
          )}

          <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-7">
            <button
              type="button"
              onClick={() => onOpen(project.slug)}
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-cta px-4 text-sm font-medium text-white transition-[background-color,scale] hover:bg-cta-hover active:scale-95"
            >
              <Plus className="size-4 transition-transform duration-300 group-hover:rotate-90" strokeWidth={2} />
              Details
            </button>
            {project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[15px] font-medium text-accent hover:underline hover:underline-offset-4"
              >
                <BrandIcon name="github" className="size-3.5" />
                GitHub
                <span className="sr-only">repository for {project.name} (opens in a new tab)</span>
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[15px] font-medium text-accent hover:underline hover:underline-offset-4"
              >
                {project.demoLabel ?? "Live demo"}
                <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                <span className="sr-only">for {project.name} (opens in a new tab)</span>
              </a>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onOpen(project.slug)}
          className="mt-8 block rounded-[20px] px-4 pb-4 text-left sm:px-5 sm:pb-5"
          aria-label={`Open details for ${project.name}`}
        >
          <ProjectMedia project={project} priority={index < 2} />
        </button>
      </article>
    </TiltCard>
  );
}
