/**
 * Technologies, grouped by category. `icon` is a key in src/lib/brand-icons.ts.
 * No proficiency levels on purpose.
 */
export type Skill = { name: string; icon?: string };
export type SkillCategory = { title: string; blurb: string; skills: Skill[] };

export const skillCategories: SkillCategory[] = [
  {
    title: "Programming",
    blurb: "General-purpose languages",
    skills: [
      { name: "Python", icon: "python" },
      { name: "C++", icon: "cplusplus" },
    ],
  },
  {
    title: "Frontend",
    blurb: "Interfaces for the web",
    skills: [
      { name: "HTML", icon: "html" },
      { name: "CSS", icon: "css" },
      { name: "JavaScript", icon: "javascript" },
      { name: "TypeScript", icon: "typescript" },
      { name: "React", icon: "react" },
      { name: "Next.js", icon: "nextjs" },
      { name: "Tailwind CSS", icon: "tailwind" },
    ],
  },
  {
    title: "Backend",
    blurb: "Servers and runtimes",
    skills: [{ name: "Node.js", icon: "nodejs" }],
  },
  {
    title: "Tools",
    blurb: "Shipping and collaboration",
    skills: [
      { name: "Git", icon: "git" },
      { name: "GitHub", icon: "github" },
      { name: "Vercel", icon: "vercel" },
    ],
  },
  {
    title: "Other",
    blurb: "Areas of focus",
    skills: [{ name: "AI / Machine Learning", icon: "ai" }],
  },
];
