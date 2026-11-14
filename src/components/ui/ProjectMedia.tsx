import Image from "next/image";
import type { Project } from "@/config/projects";
import { ProjectArt } from "./ProjectArt";
import { cn } from "@/lib/utils";

/**
 * The image area of a project card.
 * Layers: [data-parallax] wrapper (moved by GSAP on scroll)
 *       → image (moved by the tilt's --mx/--my and scaled on hover via the `translate`/`scale` properties,
 *         so the two effects never fight over `transform`).
 */
export function ProjectMedia({ project, priority }: { project: Project; priority?: boolean }) {
  const img = project.images[0];
  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-line bg-bg-2">
      <div data-parallax className="absolute -inset-[8%] will-change-transform">
        <div
          className="size-full transition-[scale] duration-700 ease-out-expo group-hover:scale-[1.05] motion-reduce:transition-none"
          style={{ translate: "calc(var(--mx, 0) * -18px) calc(var(--my, 0) * -18px)" }}
        >
          {img ? (
            <Image
              src={img.src}
              alt={img.alt}
              placeholder="blur"
              priority={priority}
              sizes="(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw"
              className="size-full object-cover object-top"
            />
          ) : (
            <ProjectArt kind={project.art} />
          )}
        </div>
      </div>
      {project.needsInfo && (
        <span className={cn("absolute left-3 top-3 rounded-full border border-line bg-bg/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted backdrop-blur")}>
          Details coming soon
        </span>
      )}
    </div>
  );
}
