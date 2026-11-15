import Image from "next/image";
import type { Project, ProjectArtKind } from "@/config/projects";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { DIM, FAINT, INK, P, StageBackdrop, VOID, drawIn, fadeIn, popIn, ring, rr, star, svgProps, typeIn, type Build } from "./svg";

/*
 * Artwork for project cards. Projects with real screenshots show them in window frames;
 * the others get a line graphic of what the project is about. Like the capability graphics,
 * everything is drawn finished and `build` scrubs it in.
 */

const q = (root: Element) => gsap.utils.selector(root);
const end = (tl: gsap.core.Timeline) => tl.set({}, {}, 1);

/** One solid accent per project. */
export const projectAccent: Record<ProjectArtKind, string> = {
  home: "#ff9f0a",
  robot: "#30d158",
  assistant: "#2997ff",
  education: "#ffd60a",
  academy: "#ff375f",
};

/* ---------------- SmartLife: a home and the dashboard that runs it ---------------- */
function HomeArt() {
  const A = projectAccent.home;
  return (
    <svg {...svgProps}>
      <P data-d d="M40 236H214" stroke={DIM} />
      <P data-d d="M62 152L134 92L206 152" stroke={INK} strokeWidth={2} />
      <P data-d d="M80 138V236H188V138" stroke={INK} />
      <P data-d d={rr(120, 194, 28, 42, 5)} stroke={DIM} />
      {[
        [94, 156],
        [152, 156],
      ].map(([x, y]) => (
        <g key={x}>
          <path d={rr(x, y, 22, 22, 4)} stroke={DIM} />
          <rect data-win x={x + 2} y={y + 2} width={18} height={18} rx={3} fill={A} />
        </g>
      ))}
      {/* Wi-Fi above the roof. */}
      {[10, 19, 28].map((r, i) => (
        <P key={r} data-wifi d={`M${134 - r * 0.8} ${78 - r * 0.6}A${r} ${r} 0 0 1 ${134 + r * 0.8} ${78 - r * 0.6}`} stroke={i === 0 ? A : DIM} strokeWidth={2} />
      ))}
      <circle data-wifi-dot cx={134} cy={80} r={3} fill={A} />
      {/* Link between the house and the panel. */}
      <P data-link d="M188 190C206 190 206 150 228 150" stroke={DIM} />
      <circle data-pkt cx={228} cy={150} r={3} fill={A} />

      {/* Dashboard panel. */}
      <P data-d d={rr(228, 60, 124, 180, 16)} stroke={INK} fill={VOID} />
      <rect data-t x={244} y={82} width={46} height={6} rx={3} fill={INK} />
      <path d={rr(304, 76, 34, 18, 9)} stroke={DIM} />
      <rect data-track x={305} y={77} width={32} height={16} rx={8} fill={A} />
      <circle data-knob cx={329} cy={85} r={6} fill="#f5f5f7" />
      {[
        [244, 30],
        [260, 46],
        [276, 22],
        [292, 54],
        [308, 40],
        [324, 60],
      ].map(([x, h], i) => (
        <rect key={x} data-bar x={x} y={170 - h} width={10} height={h} rx={3} fill={i === 5 ? A : "rgb(245 245 247 / 0.3)"} />
      ))}
      <path d="M244 176H334" stroke={FAINT} />
      <path d={ring(268, 208, 16)} stroke={FAINT} strokeWidth={4} />
      <path data-dial d={ring(268, 208, 16)} pathLength={1} stroke={A} strokeWidth={4} strokeDasharray="0.7 3" />
      <rect data-t x={296} y={198} width={40} height={6} rx={3} fill={INK} />
      <rect data-t x={296} y={210} width={26} height={5} rx={2.5} fill={DIM} />
    </svg>
  );
}

const buildHome: Build = (root, tl) => {
  const $ = q(root);
  drawIn(tl, $("[data-d]"), 0, 0.2, 0.025);
  popIn(tl, $("[data-win]"), 0.26, 0.06, 0.05);
  drawIn(tl, $("[data-wifi]"), 0.32, 0.06, 0.04);
  popIn(tl, $("[data-wifi-dot]"), 0.3, 0.04);
  drawIn(tl, $("[data-link]"), 0.42, 0.1);
  tl.fromTo($("[data-pkt]"), { opacity: 0, scale: 0, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, duration: 0.04 }, 0.5);
  typeIn(tl, $("[data-t]"), 0.3, 0.05, 0.12);
  // The switch flips on.
  tl.fromTo($("[data-knob]"), { x: -16 }, { x: 0, duration: 0.07, ease: "power2.inOut" }, 0.54);
  tl.fromTo($("[data-track]"), { opacity: 0 }, { opacity: 1, duration: 0.06 }, 0.55);
  tl.fromTo($("[data-bar]"), { scaleY: 0, transformOrigin: "50% 100%" }, { scaleY: 1, duration: 0.08, stagger: 0.025, ease: "power2.out" }, 0.6);
  tl.fromTo($("[data-dial]"), { attr: { "stroke-dashoffset": 0.7 } }, { attr: { "stroke-dashoffset": 0 }, duration: 0.18, ease: "power2.out" }, 0.76);
  end(tl);
};

/* ---------------- VEX IQ: a robot runs its route and scores ---------------- */
const ROUTE = "M108 228C108 150 170 150 200 150S292 150 292 76";
const PIECES: [number, number][] = [
  [143, 160],
  [200, 150],
  [257, 141],
];

function RobotArt() {
  const A = projectAccent.robot;
  return (
    <svg {...svgProps}>
      <P data-d d={rr(70, 36, 260, 228, 12)} stroke={INK} />
      <g data-grid stroke={FAINT}>
        {[113, 157, 200, 243, 287].map((x) => (
          <path key={x} d={`M${x} 36V264`} />
        ))}
        {[93, 150, 207].map((y) => (
          <path key={y} d={`M70 ${y}H330`} />
        ))}
      </g>
      <path d={rr(84, 206, 48, 44, 9)} stroke={DIM} strokeDasharray="3 4" />
      <path data-plan d={ROUTE} pathLength={1} stroke={DIM} strokeDasharray="0.012 0.02" />
      <P data-trail d={ROUTE} stroke={A} strokeWidth={2.4} />
      <g data-goal>
        <path d={rr(268, 52, 48, 48, 10)} stroke={A} strokeWidth={1.8} />
        <rect data-goal-fill x={269} y={53} width={46} height={46} rx={9} fill={A} fillOpacity={0.16} />
      </g>
      {PIECES.map(([x, y], i) => (
        <g key={x} data-piece={i} opacity={0}>
          <path d={`M${x} ${y - 8}l7 4v8l-7 4l-7 -4v-8Z`} fill={VOID} stroke={A} strokeWidth={1.8} />
        </g>
      ))}
      <g data-bot transform="translate(292 76)">
        <rect x={-15} y={-12} width={4} height={10} rx={1.5} fill={INK} />
        <rect x={11} y={-12} width={4} height={10} rx={1.5} fill={INK} />
        <rect x={-15} y={4} width={4} height={10} rx={1.5} fill={INK} />
        <rect x={11} y={4} width={4} height={10} rx={1.5} fill={INK} />
        <rect x={-11} y={-14} width={22} height={28} rx={6} fill={VOID} stroke={INK} strokeWidth={1.8} />
        <rect data-load x={-6} y={-3} width={12} height={10} rx={2.5} fill={A} />
        <path d="M-6 -9H6" stroke={A} strokeWidth={2.4} />
      </g>
      <g data-check>
        <circle cx={316} cy={52} r={11} fill={A} />
        <path d="M311 52.5l3.4 3.4 6.4-6.6" stroke={VOID} strokeWidth={2.4} />
      </g>
    </svg>
  );
}

const buildRobot: Build = (root, tl) => {
  const $ = q(root);
  const route = root.querySelector<SVGPathElement>("[data-trail]")!;
  const bot = root.querySelector("[data-bot]")!;
  const load = root.querySelector<SVGElement>("[data-load]")!;
  const pieces = PIECES.map((_, i) => root.querySelector<SVGElement>(`[data-piece="${i}"]`)!);
  const len = route.getTotalLength();
  // Where along the route each piece sits (0–1).
  const at = PIECES.map(([px, py]) => {
    let best = 0;
    let dist = Infinity;
    for (let s = 0; s <= 200; s++) {
      const p = route.getPointAtLength((s / 200) * len);
      const d = (p.x - px) ** 2 + (p.y - py) ** 2;
      if (d < dist) [dist, best] = [d, s / 200];
    }
    return best;
  });
  const place = (u: number) => {
    const p = route.getPointAtLength(u * len);
    const n = route.getPointAtLength(Math.min(len, u * len + 1));
    const b = route.getPointAtLength(Math.max(0, u * len - 1));
    const angle = (Math.atan2(n.y - b.y, n.x - b.x) * 180) / Math.PI + 90;
    bot.setAttribute("transform", `translate(${p.x} ${p.y}) rotate(${angle})`);
    let carried = 0;
    pieces.forEach((el, i) => {
      // Visible until the robot drives over it, then picked up.
      const o = Math.min(1, Math.max(0, (at[i] + 0.015 - u) / 0.03));
      el.setAttribute("opacity", String(o));
      if (o < 0.5) carried++;
    });
    load.setAttribute("fill-opacity", String(0.25 + carried * 0.25));
  };
  const state = { u: 0 };
  drawIn(tl, $("[data-d]"), 0, 0.12);
  fadeIn(tl, $("[data-grid]"), 0.06, 0.08);
  fadeIn(tl, $("[data-plan]"), 0.12, 0.08);
  fadeIn(tl, $("[data-goal]"), 0.14, 0.06);
  tl.fromTo($("[data-bot]"), { opacity: 0 }, { opacity: 1, duration: 0.04 }, 0.14);
  drawIn(tl, route, 0.2, 0.62, 0, "power1.inOut");
  tl.fromTo(state, { u: 0 }, { u: 1, duration: 0.62, ease: "power1.inOut", onUpdate: () => place(state.u) }, 0.2);
  tl.fromTo($("[data-goal-fill]"), { opacity: 0 }, { opacity: 1, duration: 0.06 }, 0.82);
  popIn(tl, $("[data-check]"), 0.86, 0.08);
  place(0);
  end(tl);
  return () => place(1);
};

/* ---------------- Teacher Assist AI: a lesson, a question, an answer ---------------- */
function EducationArt() {
  const A = projectAccent.education;
  return (
    <svg {...svgProps}>
      <P data-d d={rr(52, 40, 160, 220, 14)} stroke={INK} fill={VOID} />
      <rect data-t x={70} y={58} width={30} height={8} rx={4} fill={A} />
      <rect data-t x={70} y={74} width={104} height={10} rx={5} fill={INK} />
      {[98, 110, 122].map((y, i) => (
        <rect key={y} data-t x={70} y={y} width={[120, 108, 72][i]} height={5} rx={2.5} fill={DIM} />
      ))}
      {[150, 178, 206].map((y, i) => (
        <g key={y}>
          <path d={rr(70, y - 8, 16, 16, 5)} stroke={DIM} />
          <P data-tick d={`M74 ${y}l3 3.2 6-6.4`} stroke={A} strokeWidth={2} />
          <rect data-t x={96} y={y - 3} width={[84, 64, 76][i]} height={6} rx={3} fill="rgb(245 245 247 / 0.34)" />
        </g>
      ))}
      <path d="M70 232H194" stroke={FAINT} />
      <rect data-t x={70} y={240} width={40} height={5} rx={2.5} fill={DIM} />

      <g data-q>
        <path d={rr(240, 48, 112, 42, 16)} fill="rgb(245 245 247 / 0.08)" />
        <rect x={254} y={62} width={70} height={5} rx={2.5} fill={INK} />
        <rect x={254} y={73} width={46} height={5} rx={2.5} fill={DIM} />
      </g>
      <g data-a>
        <path d={rr(228, 104, 132, 102, 18)} fill={VOID} stroke={A} strokeOpacity={0.6} />
        <path d={star(248, 124, 7)} fill={A} />
      </g>
      <g data-typing opacity={0}>
        {[262, 274, 286].map((x) => (
          <circle key={x} cx={x} cy={156} r={3.5} fill={INK} />
        ))}
      </g>
      {[124, 142, 156, 170, 184].map((y, i) => (
        <rect key={y} data-ans x={i === 0 ? 262 : 244} y={y - 2.5} width={[60, 96, 82, 100, 54][i]} height={5} rx={2.5} fill={i === 0 ? INK : DIM} />
      ))}
      <g data-spark>
        <path d={star(330, 236, 15)} fill={A} />
        <path d={star(300, 252, 6)} fill={A} />
      </g>
    </svg>
  );
}

const buildEducation: Build = (root, tl) => {
  const $ = q(root);
  drawIn(tl, $("[data-d]"), 0, 0.14);
  typeIn(tl, $("[data-t]"), 0.1, 0.05, 0.022);
  tl.fromTo($("[data-q]"), { opacity: 0, y: 14, scale: 0.9, transformOrigin: "100% 100%" }, { opacity: 1, y: 0, scale: 1, duration: 0.08, ease: "back.out(1.6)" }, 0.34);
  tl.fromTo($("[data-a]"), { opacity: 0, y: 14, scale: 0.9, transformOrigin: "0% 0%" }, { opacity: 1, y: 0, scale: 1, duration: 0.08, ease: "back.out(1.6)" }, 0.44);
  tl.fromTo($("[data-typing]"), { opacity: 0 }, { opacity: 1, duration: 0.03 }, 0.5);
  tl.fromTo($("[data-typing] circle"), { y: 0 }, { y: -4, duration: 0.025, stagger: 0.012, yoyo: true, repeat: 3, ease: "sine.inOut" }, 0.52);
  tl.to($("[data-typing]"), { opacity: 0, duration: 0.02 }, 0.62);
  typeIn(tl, $("[data-ans]"), 0.63, 0.05, 0.025);
  drawIn(tl, $("[data-tick]"), 0.76, 0.05, 0.04);
  popIn(tl, $("[data-spark] path"), 0.88, 0.07, 0.03);
  end(tl);
};

/* ---------------- Fallback (used only if a project with screenshots loses them) ---------------- */
function OrbArt({ kind }: { kind: ProjectArtKind }) {
  const A = projectAccent[kind];
  return (
    <svg {...svgProps}>
      {[34, 62, 90].map((r) => (
        <P key={r} data-ring d={ring(200, 150, r)} stroke={r === 34 ? A : DIM} />
      ))}
      <circle data-core cx={200} cy={150} r={14} fill={A} />
    </svg>
  );
}

const buildOrb: Build = (root, tl) => {
  const $ = q(root);
  drawIn(tl, $("[data-ring]"), 0, 0.4, 0.15);
  popIn(tl, $("[data-core]"), 0.6, 0.2);
  end(tl);
};

const art: Record<ProjectArtKind, { Art: () => React.JSX.Element; build: Build }> = {
  home: { Art: HomeArt, build: buildHome },
  robot: { Art: RobotArt, build: buildRobot },
  education: { Art: EducationArt, build: buildEducation },
  assistant: { Art: () => <OrbArt kind="assistant" />, build: buildOrb },
  academy: { Art: () => <OrbArt kind="academy" />, build: buildOrb },
};

/* ---------------- Screenshots in window frames ---------------- */
function Frame({ image, className, priority }: { image: Project["images"][number]; className?: string; priority?: boolean }) {
  return (
    <div className={cn("overflow-hidden rounded-[10px] bg-[#1c1c1e] shadow-[0_30px_60px_-20px_rgb(0_0_0/0.9)] ring-1 ring-white/12", className)}>
      <div className="flex h-[clamp(12px,3.2cqw,20px)] items-center gap-[clamp(3px,0.8cqw,5px)] px-[clamp(6px,1.6cqw,10px)]">
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-[clamp(4px,1cqw,7px)] rounded-full bg-white/20" />
        ))}
      </div>
      <Image
        src={image.src}
        alt={image.alt}
        placeholder="blur"
        priority={priority}
        sizes="(min-width: 1024px) 44vw, 92vw"
        className="block h-auto w-full"
      />
    </div>
  );
}

function Shots({ project, priority }: { project: Project; priority?: boolean }) {
  const [front, back] = project.images;
  if (back) {
    return (
      <>
        <div data-shot-back className="absolute left-[6%] top-[9%] w-[min(60cqw,calc(62cqh*1.4))]">
          <Frame image={back} className="opacity-80" />
        </div>
        <div data-shot-front className="absolute bottom-[8%] right-[6%] w-[min(66cqw,calc(68cqh*1.4))]">
          <Frame image={front} priority={priority} />
        </div>
      </>
    );
  }
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div data-shot-front className="w-[min(80cqw,calc(78cqh*1.5))]">
        <Frame image={front} priority={priority} />
      </div>
    </div>
  );
}

const buildShots: Build = (root, tl) => {
  const $ = q(root);
  tl.fromTo(
    $("[data-shot-front]"),
    { rotationX: 32, y: 90, scale: 0.86, opacity: 0, transformPerspective: 1400, transformOrigin: "50% 100%" },
    { rotationX: 0, y: 0, scale: 1, opacity: 1, duration: 0.7, ease: "power3.out" },
    0.05,
  );
  if ($("[data-shot-back]").length)
    tl.fromTo($("[data-shot-back]"), { xPercent: -18, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, 0.3);
  end(tl);
};

/** The build for a project's stage: screenshots or line graphic. */
export const projectBuild = (project: Project): Build => (project.images.length ? buildShots : art[project.art].build);

/**
 * The black stage with a project's artwork. Always dark, in both themes, so the art reads the same.
 * Fills its parent; give the parent a size (aspect ratio or height).
 */
export function ProjectStage({ project, priority, className }: { project: Project; priority?: boolean; className?: string }) {
  const accent = projectAccent[project.art];
  const { Art } = art[project.art];
  return (
    <div data-stage className={cn("dark absolute inset-0 overflow-hidden bg-bg [container-type:size]", className)}>
      <StageBackdrop accent={accent} />
      {project.images.length ? <Shots project={project} priority={priority} /> : <Art />}
    </div>
  );
}
