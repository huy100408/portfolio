import { gsap } from "@/lib/gsap";

/**
 * Shared pieces for the scroll-driven line graphics.
 *
 * Every graphic is drawn on a black stage in its finished state, so it reads correctly with no
 * JavaScript, with reduced motion and inside the project dialog. A `build` function then adds
 * tweens to a timeline (0 → 1) that scroll scrubs from the empty state to that finished state.
 */

/** Adds the tweens for one graphic. May return a cleanup that restores the finished state. */
export type Build = (root: Element, tl: gsap.core.Timeline) => void | (() => void);

/** Line colours on the black stage. Each graphic adds one solid accent; no gradients. */
export const INK = "rgb(245 245 247 / 0.72)";
export const DIM = "rgb(245 245 247 / 0.26)";
export const FAINT = "rgb(245 245 247 / 0.06)";
export const VOID = "#0a0a0b";

export const svgProps = {
  viewBox: "0 0 400 300",
  fill: "none",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: 1.6,
  "aria-hidden": true,
  focusable: false,
  className: "absolute inset-0 size-full",
} as const;

/** A path that can be "drawn" with a dash offset (its length is normalised to 1). */
export function P(props: React.SVGProps<SVGPathElement>) {
  return <path pathLength={1} {...props} />;
}

/** Rounded rectangle as a path, so it can be drawn like any other line. */
export const rr = (x: number, y: number, w: number, h: number, r: number) => {
  r = Math.min(r, w / 2, h / 2);
  return `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`;
};

/** Circle as a path, starting at 12 o'clock and running clockwise. */
export const ring = (cx: number, cy: number, r: number) =>
  `M${cx} ${cy - r}a${r} ${r} 0 1 1 0 ${2 * r}a${r} ${r} 0 1 1 0 ${-2 * r}Z`;

/** Four-point sparkle. */
export const star = (cx: number, cy: number, r: number) => {
  const k = r * 0.14;
  return `M${cx} ${cy - r}C${cx + k} ${cy - k * 2} ${cx + k * 2} ${cy - k} ${cx + r} ${cy}C${cx + k * 2} ${cy + k} ${cx + k} ${cy + k * 2} ${cx} ${cy + r}C${cx - k} ${cy + k * 2} ${cx - k * 2} ${cy + k} ${cx - r} ${cy}C${cx - k * 2} ${cy - k} ${cx - k} ${cy - k * 2} ${cx} ${cy - r}Z`;
};

type Targets = gsap.TweenTarget;

/** Draws strokes on from nothing. Targets must be <P> paths. */
export function drawIn(tl: gsap.core.Timeline, targets: Targets, at: number, duration: number, stagger = 0, ease = "power1.inOut") {
  const els = gsap.utils.toArray<SVGElement>(targets);
  if (!els.length) return;
  // A gap far longer than the path, so nothing wraps round and shows at the end.
  els.forEach((el) => el.setAttribute("stroke-dasharray", "1 3"));
  tl.fromTo(els, { attr: { "stroke-dashoffset": 1.05 } }, { attr: { "stroke-dashoffset": 0 }, duration, stagger, ease }, at);
}

export function popIn(tl: gsap.core.Timeline, targets: Targets, at: number, duration = 0.08, stagger = 0) {
  tl.fromTo(
    targets,
    { scale: 0, opacity: 0, transformOrigin: "50% 50%" },
    { scale: 1, opacity: 1, duration, stagger, ease: "back.out(2)" },
    at,
  );
}

export function fadeIn(tl: gsap.core.Timeline, targets: Targets, at: number, duration = 0.08, stagger = 0) {
  tl.fromTo(targets, { opacity: 0 }, { opacity: 1, duration, stagger }, at);
}

/** Types a bar out from its left edge. */
export function typeIn(tl: gsap.core.Timeline, targets: Targets, at: number, duration = 0.05, stagger = 0.03) {
  tl.fromTo(
    targets,
    { scaleX: 0, transformOrigin: "0% 50%" },
    { scaleX: 1, duration, stagger, ease: "power2.out" },
    at,
  );
}

/** A soft pool of one accent colour behind a graphic. */
export function Glow({ accent }: { accent: string }) {
  return (
    <div
      aria-hidden
      className="absolute inset-0"
      style={{ background: `radial-gradient(55% 60% at 50% 58%, color-mix(in srgb, ${accent} 20%, transparent), transparent 72%)` }}
    />
  );
}

/** The black stage every graphic sits on: a faint dot grid and the accent glow. */
export function StageBackdrop({ accent }: { accent: string }) {
  return (
    <div aria-hidden className="absolute inset-0">
      <div className="stage-dots absolute inset-0" />
      <Glow accent={accent} />
    </div>
  );
}
