import {
  siCplusplus,
  siCss,
  siDiscord,
  siElectron,
  siFastapi,
  siGit,
  siGithub,
  siHtml5,
  siJavascript,
  siNextdotjs,
  siNodedotjs,
  siPython,
  siReact,
  siSupabase,
  siSwift,
  siTailwindcss,
  siTypescript,
  siVercel,
  siVite,
} from "simple-icons";
import { Brain } from "lucide-react";

type SimpleIcon = { title: string; path: string; hex: string };

/** Brand icons (Simple Icons, CC0). Only the ones the site uses are imported. */
const icons: Record<string, SimpleIcon> = {
  python: siPython,
  cplusplus: siCplusplus,
  html: siHtml5,
  css: siCss,
  javascript: siJavascript,
  typescript: siTypescript,
  react: siReact,
  nextjs: siNextdotjs,
  tailwind: siTailwindcss,
  nodejs: siNodedotjs,
  git: siGit,
  github: siGithub,
  vercel: siVercel,
  discord: siDiscord,
  fastapi: siFastapi,
  swift: siSwift,
  electron: siElectron,
  supabase: siSupabase,
  vite: siVite,
};

/** Brand colour for hover states. Near-black brands fall back to currentColor. */
export function brandColor(name?: string) {
  const icon = name ? icons[name] : undefined;
  if (!icon) return undefined;
  const hex = icon.hex.toUpperCase();
  return hex === "000000" || hex === "181717" ? undefined : `#${icon.hex}`;
}

export function BrandIcon({
  name,
  className,
  title,
}: {
  name: string;
  className?: string;
  title?: string;
}) {
  if (name === "ai") return <Brain className={className} aria-hidden={!title} strokeWidth={1.75} />;
  const icon = icons[name];
  if (!icon) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <path d={icon.path} />
    </svg>
  );
}

/** Maps a tech badge label to an icon key, when one exists. */
export const techIcon: Record<string, string> = {
  Python: "python",
  "C++": "cplusplus",
  HTML: "html",
  CSS: "css",
  JavaScript: "javascript",
  TypeScript: "typescript",
  React: "react",
  "Next.js": "nextjs",
  "Tailwind CSS": "tailwind",
  "Node.js": "nodejs",
  Git: "git",
  GitHub: "github",
  Vercel: "vercel",
  FastAPI: "fastapi",
  SwiftUI: "swift",
  Electron: "electron",
  Supabase: "supabase",
  Vite: "vite",
};
