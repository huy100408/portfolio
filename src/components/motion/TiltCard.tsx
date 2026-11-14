"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { spring } from "@/lib/motion";
import { useFinePointer, useReducedMotionPref } from "@/hooks/useMedia";
import { cn } from "@/lib/utils";

/**
 * 3D tilt that follows the cursor, with a soft spotlight.
 * Exposes --mx/--my (-0.5…0.5) to children so images inside can parallax against the tilt.
 */
export function TiltCard({
  children,
  className,
  max = 7,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduce = useReducedMotionPref();
  const enabled = fine && !reduce;

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, spring.soft);
  const sy = useSpring(py, spring.soft);
  const rotateX = useTransform(sy, [-0.5, 0.5], [max, -max]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-max, max]);
  const lightX = useTransform(sx, (v) => `${(v + 0.5) * 100}%`);
  const lightY = useTransform(sy, (v) => `${(v + 0.5) * 100}%`);
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${lightX} ${lightY}, rgb(var(--particle) / 0.06), transparent 60%)`;

  return (
    <div style={{ perspective: 1100 }} className="h-full">
      <motion.div
        ref={ref}
        className={cn("relative h-full", className)}
        style={
          enabled
            ? ({ rotateX, rotateY, transformStyle: "preserve-3d", "--mx": sx, "--my": sy } as never)
            : undefined
        }
        onPointerMove={(e) => {
          if (!enabled || !ref.current) return;
          const r = ref.current.getBoundingClientRect();
          px.set((e.clientX - r.left) / r.width - 0.5);
          py.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onPointerLeave={() => {
          px.set(0);
          py.set(0);
        }}
      >
        {children}
        {enabled && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] z-10"
            style={{ background: spotlight }}
          />
        )}
      </motion.div>
    </div>
  );
}
