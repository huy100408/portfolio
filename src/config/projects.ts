import type { StaticImageData } from "next/image";
import jarvisHud from "@/assets/projects/jarvis-hud.jpg";
import jarvisSettings from "@/assets/projects/jarvis-settings.jpg";
import nakanoLanding from "@/assets/projects/nakano-landing.jpg";

export type ProjectArtKind = "home" | "robot" | "assistant" | "education" | "academy";

export type Project = {
  slug: string;
  name: string;
  /** Short category line under the name. */
  tagline: string;
  /** One or two sentences for the card. */
  summary: string;
  /** Longer bullet points for the detail view. Only real, verified features. */
  highlights: string[];
  tech: string[];
  /** Real screenshots. When empty, generated artwork is shown instead. */
  images: { src: StaticImageData; alt: string }[];
  art: ProjectArtKind;
  /** Only set when the repository really exists and is public. */
  repo?: string;
  /** Only set when a real, working demo or website exists. */
  demo?: string;
  /** Button label for `demo`. Defaults to "Live demo". */
  demoLabel?: string;
  year?: string;
  /**
   * true = details have not been verified yet. The card shows "Details coming soon"
   * and, in development, a reminder to fill this entry in.
   */
  needsInfo?: boolean;
};

export const projects: Project[] = [
  {
    slug: "smartlife",
    name: "SmartLife",
    tagline: "Smart Home Dashboard",
    summary:
      "A smart home dashboard project. A full write-up, tech stack and screenshots are on the way.",
    highlights: [],
    tech: [],
    images: [],
    art: "home",
    needsInfo: true, // TODO(Brian): add summary, highlights, tech, repo and screenshots.
  },
  {
    slug: "vex-iq",
    name: "VEX IQ",
    tagline: "Robotics & Automation",
    summary:
      "Robotics and automation work with the VEX IQ platform. A full write-up and photos are on the way.",
    highlights: [],
    tech: [],
    images: [],
    art: "robot",
    needsInfo: true, // TODO(Brian): add summary, highlights, tech, repo and photos.
  },
  {
    slug: "jarvis",
    name: "Jarvis AI",
    tagline: "Personal AI Assistant",
    summary:
      "A self-hosted AI assistant for macOS that sees and controls the screen, takes voice or text commands, and pairs with a native iOS companion app.",
    highlights: [
      "Autonomous agent loop on macOS: screenshot and accessibility tree in, tool call out, then verify the result.",
      "Native SwiftUI iOS companion app that streams the Mac screen in real time and sends touch, keyboard, voice and text input.",
      "FastAPI server with two WebSocket channels: one for the live screen stream, one for agent logs and spoken replies.",
      "Human-in-the-loop security gate: passwords, destructive shell commands and payment buttons pause the agent until you approve, deny or enter a secret on your phone.",
      "Desktop app with assistant, screen, voice and telemetry views, plus accent themes and personalization.",
      "One-command installer for macOS, with built releases published on GitHub.",
    ],
    tech: ["Python", "FastAPI", "WebSockets", "PyObjC", "SwiftUI", "Node.js", "TypeScript"],
    images: [
      { src: jarvisHud, alt: "Jarvis desktop app showing the assistant view with an online status panel" },
      { src: jarvisSettings, alt: "Jarvis settings screen with theme accents and personalization options" },
    ],
    art: "assistant",
    repo: "https://github.com/huy100408/jarvis-install",
    demo: "https://huy100408.github.io/jarvis-install/",
    demoLabel: "Website",
    year: "2026",
  },
  {
    slug: "teacher-assist-ai",
    name: "Teacher Assist AI",
    tagline: "AI Education Platform",
    summary:
      "An AI platform for education. A full write-up, tech stack and screenshots are on the way.",
    highlights: [],
    tech: [],
    images: [],
    art: "education",
    needsInfo: true, // TODO(Brian): add summary, highlights, tech, repo and screenshots.
  },
  {
    slug: "nakano-academy",
    name: "Nakano Academy",
    tagline: "Study App · Web, macOS & Windows",
    summary:
      "A study app inspired by The Quintessential Quintuplets, where five tutors teach Math, English, AP Human Geography, Computer Science and Science.",
    highlights: [
      "Runs in the browser, on macOS (Apple Silicon and Intel) and on Windows.",
      "Google sign-in with progress synced across devices through Supabase, including an offline queue.",
      "Flashcards, three practice tiers with step-by-step explanations, and spaced-repetition review of weak spots.",
      "A report card with a five-axis mastery radar and letter grades.",
      "A deduction mini-game, an item system, keyboard shortcuts and a mobile tab bar.",
      "GitHub Actions deploy the website and build both desktop installers on release tags.",
    ],
    tech: ["React", "Vite", "Tailwind CSS", "Electron", "Supabase", "JavaScript"],
    images: [{ src: nakanoLanding, alt: "Nakano Academy website landing screen" }],
    art: "academy",
    repo: "https://github.com/huy100408/nakano-academy",
    demo: "https://huy100408.github.io/nakano-academy/learn/",
    year: "2026",
  },
];
