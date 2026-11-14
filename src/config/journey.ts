/**
 * Developer journey timeline. Newest first.
 * Add milestones here. Only add things that happened; dates are free text.
 */
export type Milestone = {
  date: string;
  title: string;
  description: string;
  tag: "Project" | "Release" | "Learning" | "Milestone";
  link?: { label: string; href: string };
};

export const milestones: Milestone[] = [
  {
    date: "Nov 2026",
    title: "Built this portfolio",
    description:
      "Designed and built this site with Next.js, TypeScript, Tailwind CSS, Framer Motion and GSAP, exported as static files for GitHub Pages.",
    tag: "Project",
  },
  {
    date: "Nov 2026",
    title: "Released Nakano Academy v1.0.0",
    description:
      "Shipped the first release of the study app for the web, macOS and Windows, with installers built by GitHub Actions.",
    tag: "Release",
    link: { label: "Release notes", href: "https://github.com/huy100408/nakano-academy/releases" },
  },
  {
    date: "Nov 2026",
    title: "Published the Jarvis installer",
    description:
      "Made the Jarvis AI assistant installable with one command and published its built releases and website.",
    tag: "Release",
    link: { label: "Repository", href: "https://github.com/huy100408/jarvis-install" },
  },
  {
    date: "Apr 2024",
    title: "Joined GitHub",
    description: "Created the huy100408 GitHub account.",
    tag: "Milestone",
    link: { label: "Profile", href: "https://github.com/huy100408" },
  },
];
