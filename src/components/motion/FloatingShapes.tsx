"use client";

import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useEffect } from "react";
import { spring } from "@/lib/motion";
import { useFinePointer, useReducedMotionPref } from "@/hooks/useMedia";

function useLayer(mx: MotionValue<number>, my: MotionValue<number>, depth: number) {
  const x = useTransform(mx, (v) => v * depth);
  const y = useTransform(my, (v) => v * depth);
  return { x, y };
}

/** Rotating wireframe cube built from six bordered faces (pure CSS 3D). */
function WireCube({ size = 96 }: { size?: number }) {
  const half = size / 2;
  const faces = [
    `rotateY(0deg) translateZ(${half}px)`,
    `rotateY(90deg) translateZ(${half}px)`,
    `rotateY(180deg) translateZ(${half}px)`,
    `rotateY(-90deg) translateZ(${half}px)`,
    `rotateX(90deg) translateZ(${half}px)`,
    `rotateX(-90deg) translateZ(${half}px)`,
  ];
  return (
    <div style={{ width: size, height: size, perspective: 600 }}>
      <div className="cube relative h-full w-full" style={{ transformStyle: "preserve-3d" }}>
        {faces.map((t) => (
          <div
            key={t}
            className="absolute inset-0 border border-fg/25 bg-bg/20"
            style={{ transform: t }}
          />
        ))}
      </div>
      <style>{`
        @keyframes cube-spin { from { transform: rotateX(-24deg) rotateY(0deg); } to { transform: rotateX(-24deg) rotateY(360deg); } }
        .cube { animation: cube-spin 18s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .cube { animation: none; transform: rotateX(-24deg) rotateY(32deg); } }
      `}</style>
    </div>
  );
}

/**
 * Geometric objects floating around the hero. Each layer moves with the cursor
 * at a different depth; each also has its own slow CSS loop.
 */
export function FloatingShapes() {
  const fine = useFinePointer();
  const reduce = useReducedMotionPref();
  const mx = useSpring(useMotionValue(0), spring.soft);
  const my = useSpring(useMotionValue(0), spring.soft);

  useEffect(() => {
    if (!fine || reduce) return;
    const onMove = (e: PointerEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [fine, reduce, mx, my]);

  const l1 = useLayer(mx, my, -40);
  const l2 = useLayer(mx, my, 24);
  const l3 = useLayer(mx, my, -16);
  const l4 = useLayer(mx, my, 36);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Orbit ring with a travelling dot */}
      <motion.div style={l1} className="absolute right-[-6rem] top-[12%] hidden md:block" data-depth="0.4">
        <div className="relative size-[26rem] lg:size-[34rem]">
          <svg viewBox="0 0 400 400" className="absolute inset-0 size-full text-line-strong">
            <circle cx="200" cy="200" r="199" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="200" cy="200" r="140" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 6" />
            <circle
              cx="200" cy="200" r="80" fill="none" stroke="currentColor" strokeWidth="1"
              strokeDasharray="503" strokeDashoffset="503"
              style={{ animation: "dash 2.4s 0.6s cubic-bezier(0.16,1,0.3,1) forwards" }}
            />
          </svg>
          <div className="animate-spin-slow absolute inset-0">
            <span className="absolute left-1/2 top-0 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" />
          </div>
        </div>
      </motion.div>

      {/* Wire cube */}
      <motion.div style={l2} className="absolute right-[12%] top-[58%] hidden lg:block">
        <div className="animate-float" style={{ animationDuration: "7s" }}>
          <WireCube size={88} />
        </div>
      </motion.div>

      {/* Small triangle */}
      <motion.div style={l3} className="absolute left-[6%] top-[22%] hidden sm:block">
        <svg width="46" height="40" viewBox="0 0 46 40" className="animate-float text-fg/30" style={{ animationDelay: "-2s" }}>
          <path d="M23 1 L45 39 H1 Z" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </motion.div>

      {/* Crosses */}
      <motion.div style={l4} className="absolute left-[44%] top-[14%]">
        <svg width="14" height="14" viewBox="0 0 14 14" className="text-fg/40">
          <path d="M7 0v14M0 7h14" stroke="currentColor" strokeWidth="1" />
        </svg>
      </motion.div>
      <motion.div style={l3} className="absolute bottom-[18%] left-[38%] hidden md:block">
        <svg width="14" height="14" viewBox="0 0 14 14" className="text-fg/40">
          <path d="M7 0v14M0 7h14" stroke="currentColor" strokeWidth="1" />
        </svg>
      </motion.div>

      {/* Dotted square */}
      <motion.div style={l2} className="absolute bottom-[26%] left-[4%] hidden lg:block">
        <div className="animate-float size-20 rounded-xl border border-dashed border-line-strong" style={{ animationDelay: "-3.5s", animationDuration: "9s" }} />
      </motion.div>
    </div>
  );
}
