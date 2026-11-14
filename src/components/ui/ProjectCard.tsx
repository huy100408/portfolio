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
    <TiltCard className={cn("rounded-2xl", className)}>
      <article
        data-project-card
        className="animated-border group flex h-full flex-col rounded-2xl border border-line bg-bg p-3 shadow-soft transition-shadow duration-500 hover:shadow-lift"
      >
        <button
          type="button"
          onClick={() => onOpen(project.slug)}
          className="block rounded-xl text-left"
          aria-label={`Open details for ${project.name}`}
        >
          <ProjectMedia project={project} priority={index < 2} />
        </button>

        <div className="flex flex-1 flex-col px-2 pb-2 pt-5 sm:px-3">
          <div className="flex items-center justify-between font-mono text-[11px] text-muted">
            <span className="tabular-nums">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
            {project.year && <span>{project.year}</span>}
          </div>
          <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">{project.name}</h3>
          <p className="mt-1 text-sm text-muted">{project.tagline}</p>
          <p className="mt-4 line-clamp-3 text-pretty text-[15px] leading-relaxed text-fg/80">{project.summary}</p>

          {project.tech.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Technologies">
              {project.tech.slice(0, 5).map((t) => (
                <li key={t}>
                  <TechBadge name={t} />
                </li>
              ))}
              {project.tech.length > 5 && (
                <li className="self-center px-1 font-mono text-[11px] text-muted">+{project.tech.length - 5}</li>
              )}
            </ul>
          )}

          <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
            <button
              type="button"
              onClick={() => onOpen(project.slug)}
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-fg px-4 text-sm font-medium text-bg transition-transform active:scale-95"
            >
              <Plus className="size-4 transition-transform duration-300 group-hover:rotate-90" strokeWidth={2} />
              Details
            </button>
            {project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-3.5 text-sm font-medium transition-colors hover:border-line-strong hover:bg-bg-2"
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
                className="inline-flex h-9 items-center gap-1 rounded-full px-3 text-sm font-medium text-muted transition-colors hover:text-fg"
              >
                {project.demoLabel ?? "Live demo"}
                <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                <span className="sr-only">for {project.name} (opens in a new tab)</span>
              </a>
            )}
          </div>
        </div>
      </article>
    </TiltCard>
  );
}
