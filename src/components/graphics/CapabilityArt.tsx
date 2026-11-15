import { gsap } from "@/lib/gsap";
import { DIM, FAINT, INK, P, VOID, drawIn, fadeIn, popIn, ring, rr, star, svgProps, typeIn, type Build } from "./svg";

/*
 * Six line graphics for the "What I work on" scene, one per interest.
 * Each is drawn in its finished state; `build` scrubs it in from nothing.
 * Coordinates are in a 400 × 300 box.
 */

export type Graphic = { accent: string; Art: () => React.JSX.Element; build: Build };

const q = (root: Element) => gsap.utils.selector(root);
const end = (tl: gsap.core.Timeline) => tl.set({}, {}, 1);

/* ------------------------------------------------------------------ */
/* 1. Software engineering: an editor that types, refactors and passes. */
/* ------------------------------------------------------------------ */
const SE = "#2997ff";

/** [indent, width, accent?] segments per code line. */
const code: [number, number, boolean?][][] = [
  [[0, 34, true], [40, 70]],
  [[16, 46, true], [68, 92]],
  [[32, 120]],
  [[32, 38, true], [76, 64]],
  [[32, 96]],
  [[16, 22, true], [44, 54]],
  [[0, 12]],
];
const codeY = (i: number) => 98 + i * 19;

function CodeArt() {
  return (
    <svg {...svgProps}>
      <P data-d d={rr(92, 30, 248, 196, 14)} stroke={FAINT} />
      <P data-d d={rr(70, 48, 260, 204, 14)} stroke={INK} fill={VOID} />
      <P data-d d="M70 76H330" stroke={DIM} />
      <g data-f>
        {[88, 100, 112].map((x) => (
          <circle key={x} cx={x} cy={62} r={3} fill={DIM} />
        ))}
        <rect x={150} y={58} width={100} height={8} rx={4} fill={FAINT} />
      </g>
      {/* Selection behind the two lines that get swapped. */}
      <rect data-sel x={96} y={codeY(3) - 7} width={220} height={33} rx={6} fill={SE} fillOpacity={0.14} />
      {code.map((line, i) => (
        <g key={i} data-line={i}>
          <rect x={84} y={codeY(i) - 2} width={6} height={4} rx={2} fill={FAINT} />
          {line.map(([x, w, a], j) => (
            <rect key={j} data-tok x={104 + x} y={codeY(i) - 3} width={w} height={6} rx={3} fill={a ? SE : DIM} />
          ))}
        </g>
      ))}
      <g data-caret>
        <rect className="caret-blink" x={120} y={codeY(6) - 6} width={2} height={12} rx={1} fill={SE} />
      </g>
      <g data-pass>
        <circle cx={322} cy={236} r={22} fill={SE} />
        <path d="M312 236.5l6.5 6.5 13-13" stroke={VOID} strokeWidth={3.2} />
      </g>
      <circle data-pulse cx={322} cy={236} r={22} stroke={SE} strokeWidth={1.4} opacity={0} />
    </svg>
  );
}

const buildCode: Build = (root, tl) => {
  const $ = q(root);
  drawIn(tl, $("[data-d]"), 0, 0.16, 0.03);
  fadeIn(tl, $("[data-f]"), 0.1, 0.06);
  typeIn(tl, $("[data-tok]"), 0.16, 0.045, 0.028);
  fadeIn(tl, $("[data-caret]"), 0.16, 0.02);
  // Refactor: select two lines and swap them.
  tl.fromTo($("[data-sel]"), { opacity: 0, scaleX: 0.6, transformOrigin: "0% 50%" }, { opacity: 1, scaleX: 1, duration: 0.07 }, 0.56);
  tl.fromTo($('[data-line="3"]'), { y: 19 }, { y: 0, duration: 0.12, ease: "power2.inOut" }, 0.64);
  tl.fromTo($('[data-line="4"]'), { y: -19 }, { y: 0, duration: 0.12, ease: "power2.inOut" }, 0.64);
  tl.to($("[data-sel]"), { opacity: 0.35, duration: 0.06 }, 0.78);
  popIn(tl, $("[data-pass]"), 0.82, 0.08);
  tl.fromTo($("[data-pulse]"), { opacity: 0.9, scale: 1, transformOrigin: "50% 50%" }, { opacity: 0, scale: 1.9, duration: 0.12, ease: "power1.out" }, 0.86);
  end(tl);
};

/* ------------------------------------------------------------------ */
/* 2. Modern applications: data, logic and interface layers assemble.  */
/* ------------------------------------------------------------------ */
const APPS = "#ff9f0a";
const HW = 112;
const HH = 56;
const iso = (cy: number, u: number, v: number) => [200 + (u - v) * HW, cy - HH + (u + v) * HH] as const;
const isoQuad = (cy: number, u0: number, v0: number, u1: number, v1: number) => {
  const pts = [iso(cy, u0, v0), iso(cy, u1, v0), iso(cy, u1, v1), iso(cy, u0, v1)];
  return `M${pts.map((p) => p.join(" ")).join("L")}Z`;
};
const slab = (cy: number) => `M${200 - HW} ${cy}V${cy + 9}L200 ${cy + HH + 9}L${200 + HW} ${cy + 9}V${cy}`;
const top = (cy: number) => `M200 ${cy - HH}L${200 + HW} ${cy}L200 ${cy + HH}L${200 - HW} ${cy}Z`;
const LAYERS = [214, 150, 86];

function LayersArt() {
  const [c0, c1, c2] = LAYERS;
  return (
    <svg {...svgProps}>
      {/* Connectors between the layers, at the left, front and right corners. */}
      <g data-links stroke={DIM} strokeDasharray="2 5">
        {[
          [200 - HW, c2, c0],
          [200, c2 + HH, c0 + HH],
          [200 + HW, c2, c0],
        ].map(([x, y1, y2]) => (
          <path key={x + y1} d={`M${x} ${y1 + 9}V${y2}`} />
        ))}
      </g>

      {/* Data: a grid of records. */}
      <g data-layer="0">
        <path d={slab(c0)} fill={VOID} stroke={DIM} />
        <path d={top(c0)} fill={VOID} stroke={INK} />
        {[0.2, 0.4, 0.6, 0.8].flatMap((u) =>
          [0.2, 0.4, 0.6, 0.8].map((v) => {
            const [x, y] = iso(c0, u, v);
            return <circle key={`${u}${v}`} data-dot cx={x} cy={y} r={2.4} fill={DIM} />;
          }),
        )}
      </g>

      {/* Logic: a small flow of steps. */}
      <g data-layer="1">
        <path d={slab(c1)} fill={VOID} stroke={DIM} />
        <path d={top(c1)} fill={VOID} stroke={INK} />
        <P
          data-flow
          d={`M${iso(c1, 0.2, 0.5).join(" ")}L${iso(c1, 0.5, 0.5).join(" ")}L${iso(c1, 0.5, 0.2).join(" ")}M${iso(c1, 0.5, 0.5).join(" ")}L${iso(c1, 0.8, 0.8).join(" ")}`}
          stroke={APPS}
        />
        {[
          [0.2, 0.5],
          [0.5, 0.5],
          [0.5, 0.2],
          [0.8, 0.8],
        ].map(([u, v]) => {
          const [x, y] = iso(c1, u, v);
          return <circle key={`${u}${v}`} data-node cx={x} cy={y} r={4.5} fill={VOID} stroke={INK} />;
        })}
      </g>

      {/* Interface: a header and four cards light up. */}
      <g data-layer="2">
        <path d={slab(c2)} fill={VOID} stroke={DIM} />
        <path d={top(c2)} fill={VOID} stroke={INK} />
        <path data-ui="h" d={isoQuad(c2, 0.1, 0.1, 0.9, 0.24)} stroke={DIM} fill={APPS} fillOpacity={0.9} />
        {[
          [0.1, 0.34, 0.45, 0.6],
          [0.55, 0.34, 0.9, 0.6],
          [0.1, 0.68, 0.45, 0.9],
          [0.55, 0.68, 0.9, 0.9],
        ].map(([u0, v0, u1, v1]) => (
          <path key={`${u0}${v0}`} data-ui="c" d={isoQuad(c2, u0, v0, u1, v1)} stroke={DIM} fill={APPS} fillOpacity={0.28} />
        ))}
      </g>
      <P data-outline d={top(c2)} stroke={APPS} strokeWidth={2} />
    </svg>
  );
}

const buildLayers: Build = (root, tl) => {
  const $ = q(root);
  // The three layers start pressed together in the middle, then lift apart.
  [-64, 0, 64].forEach((dy, i) => {
    tl.fromTo($(`[data-layer="${i}"]`), { y: dy, opacity: 0 }, { y: 0, opacity: 1, duration: 0.22, ease: "power2.out" }, 0.02 + i * 0.06);
  });
  fadeIn(tl, $("[data-links]"), 0.36, 0.08);
  fadeIn(tl, $("[data-dot]"), 0.3, 0.04, 0.008);
  drawIn(tl, $("[data-flow]"), 0.42, 0.14, 0, "none");
  popIn(tl, $("[data-node]"), 0.42, 0.05, 0.035);
  tl.fromTo($('[data-ui="h"]'), { attr: { "fill-opacity": 0 } }, { attr: { "fill-opacity": 0.9 }, duration: 0.07 }, 0.6);
  tl.fromTo($('[data-ui="c"]'), { attr: { "fill-opacity": 0 } }, { attr: { "fill-opacity": 0.28 }, duration: 0.07, stagger: 0.05 }, 0.66);
  drawIn(tl, $("[data-outline]"), 0.82, 0.14);
  end(tl);
};

/* ------------------------------------------------------------------ */
/* 3. Artificial intelligence: a network lights a path to one answer.  */
/* ------------------------------------------------------------------ */
const AI = "#30d158";
const NX = [84, 164, 244, 316];
const NY = [
  [105, 150, 195],
  [75, 125, 175, 225],
  [75, 125, 175, 225],
  [125, 175],
];
const PATHS = [
  [0, 1, 2, 0],
  [2, 3, 1, 0],
];

function NetworkArt() {
  const edges: { d: string; key: string }[] = [];
  for (let c = 0; c < 3; c++)
    NY[c].forEach((y1, a) =>
      NY[c + 1].forEach((y2, b) => edges.push({ key: `${c}${a}${b}`, d: `M${NX[c]} ${y1}L${NX[c + 1]} ${y2}` })),
    );
  const active = new Set(PATHS.flatMap((p) => p.map((r, c) => `${c}-${r}`)));
  return (
    <svg {...svgProps}>
      {NY[0].map((y) => (
        <P key={y} data-in d={`M36 ${y}H${NX[0] - 8}`} stroke={DIM} />
      ))}
      {edges.map((e) => (
        <P key={e.key} data-edge d={e.d} stroke="rgb(245 245 247 / 0.16)" strokeWidth={1.2} />
      ))}
      {[0, 1, 2].map((c) => (
        <g key={c} data-hot={c}>
          {PATHS.map((p, k) => (
            <P key={k} d={`M${NX[c]} ${NY[c][p[c]]}L${NX[c + 1]} ${NY[c + 1][p[c + 1]]}`} stroke={AI} strokeWidth={2.2} />
          ))}
        </g>
      ))}
      {NY.map((col, c) =>
        col.map((y, r) => (
          <g key={`${c}${r}`}>
            <circle data-node cx={NX[c]} cy={y} r={7} fill={VOID} stroke={INK} />
            {active.has(`${c}-${r}`) && <circle data-lit={c} cx={NX[c]} cy={y} r={7} fill={AI} />}
          </g>
        )),
      )}
      <P data-out d={ring(NX[3], NY[3][0], 15)} stroke={AI} strokeWidth={1.6} />
      <P data-out d={`M${NX[3] + 15} ${NY[3][0]}H352`} stroke={AI} />
      <path data-spark d={star(364, NY[3][0], 10)} fill={AI} />
    </svg>
  );
}

const buildNetwork: Build = (root, tl) => {
  const $ = q(root);
  drawIn(tl, $("[data-in]"), 0, 0.08, 0.02);
  popIn(tl, $("[data-node]"), 0.04, 0.06, 0.012);
  drawIn(tl, $("[data-edge]"), 0.1, 0.14, 0.004);
  popIn(tl, $('[data-lit="0"]'), 0.36, 0.05, 0.02);
  [0, 1, 2].forEach((c) => {
    drawIn(tl, $(`[data-hot="${c}"] path`), 0.4 + c * 0.13, 0.11, 0, "power1.in");
    popIn(tl, $(`[data-lit="${c + 1}"]`), 0.5 + c * 0.13, 0.05, 0.02);
  });
  drawIn(tl, $("[data-out]"), 0.82, 0.08, 0.03);
  popIn(tl, $("[data-spark]"), 0.9, 0.08);
  end(tl);
};

/* ------------------------------------------------------------------ */
/* 4. Web development: a page assembles in a browser, then gets a click. */
/* ------------------------------------------------------------------ */
const WEB = "#64d2ff";

function WebArt() {
  return (
    <svg {...svgProps}>
      <P data-d d={rr(56, 36, 288, 228, 14)} stroke={INK} fill={VOID} />
      <P data-d d="M56 62H344" stroke={DIM} />
      <g data-chrome>
        {[72, 84, 96].map((x) => (
          <circle key={x} cx={x} cy={49} r={3} fill={DIM} />
        ))}
        <rect x={140} y={44} width={120} height={10} rx={5} fill={FAINT} />
      </g>
      <g data-nav>
        <rect x={76} y={76} width={22} height={8} rx={4} fill={WEB} />
        {[232, 258, 284].map((x) => (
          <rect key={x} x={x} y={78} width={18} height={4} rx={2} fill={DIM} />
        ))}
        <rect x={308} y={75} width={20} height={10} rx={5} fill="rgb(245 245 247 / 0.16)" />
      </g>
      <g data-hero>
        <rect x={76} y={104} width={112} height={11} rx={5.5} fill={INK} />
        <rect x={76} y={121} width={84} height={11} rx={5.5} fill={INK} />
        <rect x={76} y={142} width={104} height={5} rx={2.5} fill={DIM} />
      </g>
      <g data-btn>
        <rect x={76} y={156} width={56} height={18} rx={9} fill={WEB} />
        <rect x={88} y={163} width={32} height={4} rx={2} fill={VOID} />
      </g>
      <g data-img>
        <rect x={208} y={100} width={116} height={76} rx={10} fill="rgb(245 245 247 / 0.05)" stroke={DIM} />
        <path d="M218 166l26-28 18 18 12-12 24 22" stroke={INK} />
        <circle cx={300} cy={120} r={7} stroke={WEB} />
      </g>
      {[76, 164, 252].map((x, i) => (
        <g key={x} data-card>
          <rect x={x} y={190} width={72} height={58} rx={10} fill="rgb(245 245 247 / 0.04)" stroke={DIM} />
          <rect x={x + 10} y={200} width={18} height={18} rx={5} fill={i === 1 ? WEB : "rgb(245 245 247 / 0.14)"} />
          <rect x={x + 10} y={226} width={44} height={4} rx={2} fill={DIM} />
          <rect x={x + 10} y={235} width={30} height={4} rx={2} fill={FAINT} />
        </g>
      ))}
      <circle data-click cx={108} cy={165} r={16} stroke={WEB} strokeWidth={1.6} opacity={0} />
      <g transform="translate(112 168)">
        <g data-cursor>
          <path d="M0 0V17L4.6 12.6L8 20L11 18.6L7.7 11.4H14Z" fill="#f5f5f7" stroke={VOID} strokeWidth={1.2} />
        </g>
      </g>
    </svg>
  );
}

const buildWeb: Build = (root, tl) => {
  const $ = q(root);
  drawIn(tl, $("[data-d]"), 0, 0.14, 0.04);
  fadeIn(tl, $("[data-chrome]"), 0.1, 0.06);
  tl.fromTo($("[data-nav]"), { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.08 }, 0.18);
  typeIn(tl, $("[data-hero] rect"), 0.26, 0.06, 0.04);
  tl.fromTo($("[data-btn]"), { opacity: 0, scale: 0.6, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, duration: 0.07, ease: "back.out(2)" }, 0.4);
  tl.fromTo($("[data-img]"), { opacity: 0, scale: 0.8, rotation: 6, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, rotation: 0, duration: 0.12, ease: "power3.out" }, 0.34);
  tl.fromTo(
    $("[data-card]"),
    { opacity: 0, y: 46, rotation: (i: number) => [-8, 4, 10][i], transformOrigin: "50% 100%" },
    { opacity: 1, y: 0, rotation: 0, duration: 0.14, stagger: 0.05, ease: "power3.out" },
    0.46,
  );
  // The c‍ursor travels to the button and clicks it.
  tl.fromTo($("[data-cursor]"), { x: 300 - 112, y: 262 - 168, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 0.18, ease: "power2.inOut" }, 0.66);
  tl.to($("[data-btn]"), { scale: 0.9, duration: 0.03, yoyo: true, repeat: 1, ease: "power1.inOut" }, 0.85);
  tl.fromTo($("[data-click]"), { opacity: 0.9, scale: 0.4, transformOrigin: "50% 50%" }, { opacity: 0, scale: 1.6, duration: 0.12, ease: "power1.out" }, 0.86);
  end(tl);
};

/* ------------------------------------------------------------------ */
/* 5. Robotics & automation: sense the part, decide, pick it up.       */
/* ------------------------------------------------------------------ */
const ROBO = "#ff375f";
const SX = 150;
const SY = 232;
const L1 = 82;
const L2 = 70;
type Pose = [number, number, number];
const REST: Pose = [-12, 38, 40];
const HOVER: Pose = [59.76, 21.6, 98.64];
const GRAB: Pose = [61.57, 42.53, 75.9];
const LIFT: Pose = [21.67, 63.62, 94.71];
/** [time, pose, grip] key frames over the 0–1 timeline. */
const KEYS: [number, Pose, number][] = [
  [0, REST, 0],
  [0.36, REST, 0],
  [0.54, HOVER, 0],
  [0.64, GRAB, 0],
  [0.72, GRAB, 1],
  [0.92, LIFT, 1],
  [1, LIFT, 1],
];
const smooth = (x: number) => x * x * (3 - 2 * x);
const rad = (d: number) => (d * Math.PI) / 180;

function robotAt(t: number) {
  let k = 0;
  while (k < KEYS.length - 2 && t > KEYS[k + 1][0]) k++;
  const [t0, p0, g0] = KEYS[k];
  const [t1, p1, g1] = KEYS[k + 1];
  const f = smooth(Math.min(1, Math.max(0, (t - t0) / (t1 - t0 || 1))));
  const pose = p0.map((a, i) => a + (p1[i] - a) * f) as Pose;
  const grip = g0 + (g1 - g0) * f;
  const [a1, a2, a3] = pose;
  const ex = SX + L1 * Math.sin(rad(a1));
  const ey = SY - L1 * Math.cos(rad(a1));
  const wx = ex + L2 * Math.sin(rad(a1 + a2));
  const wy = ey - L2 * Math.cos(rad(a1 + a2));
  const th = a1 + a2 + a3;
  // The part slides along the belt, then rides in the gripper once it closes.
  let bx: number;
  let by: number;
  let br = 0;
  if (t < 0.72) {
    bx = 372 + (290 - 372) * smooth(Math.min(1, t / 0.3));
    by = 227;
  } else {
    bx = wx + 17 * Math.sin(rad(th));
    by = wy - 17 * Math.cos(rad(th));
    br = th - 180;
  }
  return { pose, grip, block: [bx, by, br] as const };
}

const final = robotAt(1);

function RobotArt() {
  const [a1, a2, a3] = final.pose;
  const [bx, by, br] = final.block;
  return (
    <svg {...svgProps}>
      <P data-d d="M30 262H370" stroke={DIM} />
      {/* Conveyor belt. */}
      <g data-belt>
        <path d={rr(246, 238, 138, 14, 7)} stroke={DIM} />
        {[260, 288, 316, 344, 372].map((x) => (
          <circle key={x} cx={x} cy={245} r={3.5} stroke={DIM} />
        ))}
      </g>
      {/* Camera and its field of view. */}
      <g data-cam>
        <path d={rr(318, 34, 40, 24, 7)} stroke={INK} fill={VOID} />
        <circle cx={338} cy={46} r={6} stroke={ROBO} />
      </g>
      <path data-cone d="M330 58L268 214H316Z" fill={ROBO} fillOpacity={0.08} stroke={ROBO} strokeOpacity={0.45} strokeDasharray="3 5" />
      <g data-box stroke={ROBO} strokeWidth={2}>
        <path d="M271 220v-12h12M309 220v-12h-12M271 234v12h12M309 234v12h-12" />
      </g>
      <g data-block transform={`translate(${bx} ${by}) rotate(${br})`}>
        <rect x={-11} y={-11} width={22} height={22} rx={4} fill={ROBO} />
      </g>
      {/* Base. */}
      <g data-base>
        <path d="M116 262L126 240H174L184 262" fill={VOID} stroke={INK} />
      </g>
      {/* Arm: shoulder → elbow → wrist, each joint nested in the last. */}
      <g data-arm>
        <g data-j1 transform={`rotate(${a1} ${SX} ${SY})`}>
          <rect x={SX - 9} y={SY - L1 - 9} width={18} height={L1 + 18} rx={9} fill={VOID} stroke={INK} />
          <g data-j2 transform={`rotate(${a2} ${SX} ${SY - L1})`}>
            <rect x={SX - 7} y={SY - L1 - L2 - 7} width={14} height={L2 + 14} rx={7} fill={VOID} stroke={INK} />
            <g data-j3 transform={`rotate(${a3} ${SX} ${SY - L1 - L2})`}>
              <path d={`M${SX - 17} ${SY - L1 - L2}H${SX + 17}`} stroke={INK} strokeWidth={3} />
              <g data-fl transform={`translate(${3 * final.grip} 0)`}>
                <path d={`M${SX - 15.5} ${SY - L1 - L2}V${SY - L1 - L2 - 26}`} stroke={INK} strokeWidth={3} />
              </g>
              <g data-fr transform={`translate(${-3 * final.grip} 0)`}>
                <path d={`M${SX + 15.5} ${SY - L1 - L2}V${SY - L1 - L2 - 26}`} stroke={INK} strokeWidth={3} />
              </g>
              <circle cx={SX} cy={SY - L1 - L2} r={4.5} fill={VOID} stroke={INK} />
            </g>
            <circle cx={SX} cy={SY - L1} r={6.5} fill={VOID} stroke={INK} />
          </g>
          <circle cx={SX} cy={SY} r={9} fill={VOID} stroke={ROBO} strokeWidth={2} />
        </g>
      </g>
    </svg>
  );
}

const buildRobot: Build = (root, tl) => {
  const $ = q(root);
  const [j1, j2, j3, fl, fr, block] = ["j1", "j2", "j3", "fl", "fr", "block"].map((k) => root.querySelector(`[data-${k}]`)!);
  const W = SY - L1 - L2;
  const render = (t: number) => {
    const s = robotAt(t);
    const [a1, a2, a3] = s.pose;
    j1.setAttribute("transform", `rotate(${a1} ${SX} ${SY})`);
    j2.setAttribute("transform", `rotate(${a2} ${SX} ${SY - L1})`);
    j3.setAttribute("transform", `rotate(${a3} ${SX} ${W})`);
    fl.setAttribute("transform", `translate(${3 * s.grip} 0)`);
    fr.setAttribute("transform", `translate(${-3 * s.grip} 0)`);
    block.setAttribute("transform", `translate(${s.block[0]} ${s.block[1]}) rotate(${s.block[2]})`);
  };
  const state = { t: 0 };
  drawIn(tl, $("[data-d]"), 0, 0.1);
  fadeIn(tl, $("[data-base], [data-belt], [data-arm]"), 0, 0.08, 0.02);
  fadeIn(tl, $("[data-cam]"), 0.06, 0.06);
  tl.fromTo($("[data-block]"), { opacity: 0 }, { opacity: 1, duration: 0.04 }, 0.02);
  // Sense: the camera sweeps, then brackets lock onto the part.
  tl.fromTo($("[data-cone]"), { opacity: 0, scaleY: 0.2, transformOrigin: "50% 0%" }, { opacity: 1, scaleY: 1, duration: 0.1 }, 0.2);
  tl.fromTo($("[data-box]"), { opacity: 0, scale: 1.6, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, duration: 0.07, ease: "power3.out" }, 0.3);
  tl.to($("[data-cone]"), { opacity: 0.35, duration: 0.08 }, 0.42);
  tl.to($("[data-box]"), { opacity: 0, duration: 0.06 }, 0.72);
  // Decide + act: one tween drives the whole arm from the key frames.
  tl.fromTo(state, { t: 0 }, { t: 1, duration: 1, ease: "none", onUpdate: () => render(state.t) }, 0);
  render(0);
  end(tl);
  return () => render(1);
};

/* ------------------------------------------------------------------ */
/* 6. Learning new technologies: steady steps up to a new skill.       */
/* ------------------------------------------------------------------ */
const LEARN = "#ffd60a";
const STEPS: [number, number][] = [
  [116, 200],
  [176, 160],
  [236, 116],
  [296, 70],
];

function LearnArt() {
  return (
    <svg {...svgProps}>
      {[200, 160, 116, 70].map((y) => (
        <path key={y} d={`M56 ${y}H352`} stroke={FAINT} strokeDasharray="2 6" />
      ))}
      <P data-axis d="M56 40V236H356" stroke={DIM} />
      <path data-area d="M56 236H116V200H176V160H236V116H296V236Z" fill={LEARN} fillOpacity={0.1} />
      <P data-stair d="M56 236H116V200H176V160H236V116H296V70" stroke={LEARN} strokeWidth={2.4} />
      {STEPS.map(([x, y], i) => (
        <g key={x}>
          {/* A new skill picked up at each step; the last step earns the star. */}
          {i < 3 && (
            <g data-chip={i}>
              <path d={rr(x - 20, y - 30, 40, 16, 8)} fill={VOID} stroke={DIM} />
              <rect x={x - 10} y={y - 24} width={14 + i * 3} height={4} rx={2} fill={INK} />
            </g>
          )}
          <circle data-step={i} cx={x} cy={y} r={5} fill={VOID} stroke={LEARN} strokeWidth={2} />
        </g>
      ))}
      <g data-star>
        <path d={star(296, 38, 14)} fill={LEARN} />
      </g>
      <P data-rings d={ring(296, 38, 21)} stroke={LEARN} strokeOpacity={0.5} />
      <path data-tw d={star(336, 30, 5)} fill={LEARN} />
      <path data-tw d={star(258, 26, 4)} fill={LEARN} />
    </svg>
  );
}

const buildLearn: Build = (root, tl) => {
  const $ = q(root);
  drawIn(tl, $("[data-axis]"), 0, 0.12);
  drawIn(tl, $("[data-stair]"), 0.12, 0.6, 0, "none");
  // Each step lands as the line reaches it.
  [0.262, 0.41, 0.563, 0.72].forEach((at, i) => {
    popIn(tl, $(`[data-step="${i}"]`), at - 0.01, 0.05);
    if (i < 3) tl.fromTo($(`[data-chip="${i}"]`), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.06 }, at + 0.01);
  });
  tl.fromTo($("[data-area]"), { opacity: 0 }, { opacity: 1, duration: 0.12 }, 0.72);
  tl.fromTo($("[data-star]"), { opacity: 0, scale: 0, rotation: -90, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, rotation: 0, duration: 0.1, ease: "back.out(2)" }, 0.76);
  drawIn(tl, $("[data-rings]"), 0.82, 0.1);
  popIn(tl, $("[data-tw]"), 0.88, 0.06, 0.04);
  end(tl);
};

export const capabilityArt: Graphic[] = [
  { accent: SE, Art: CodeArt, build: buildCode },
  { accent: APPS, Art: LayersArt, build: buildLayers },
  { accent: AI, Art: NetworkArt, build: buildNetwork },
  { accent: WEB, Art: WebArt, build: buildWeb },
  { accent: ROBO, Art: RobotArt, build: buildRobot },
  { accent: LEARN, Art: LearnArt, build: buildLearn },
];
