"use client";

import { motion } from "framer-motion";
import { SplitText } from "@/components/motion/SplitText";
import { duration, ease, inView } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function SectionHeading({
  index,
  label,
  title,
  description,
  className,
  align = "left",
}: {
  index: string;
  label: string;
  title: string;
  description?: React.ReactNode;
  className?: string;
  align?: "left" | "split";
}) {
  return (
    <header className={cn("mb-12 sm:mb-16", className)}>
      <div className="mb-8 flex items-center gap-4 sm:mb-10">
        <span className="eyebrow tabular-nums text-fg">{index}</span>
        <motion.span
          aria-hidden
          className="h-px flex-1 origin-left bg-line"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={inView}
          transition={{ duration: duration.cinematic * 1.4, ease: ease.out }}
        />
        <span className="eyebrow">{label}</span>
      </div>
      <div className={cn(align === "split" && "grid gap-6 lg:grid-cols-12 lg:items-end")}>
        <SplitText as="h2" text={title} className={cn("text-h2 text-balance", align === "split" && "lg:col-span-7")} />
        {description && (
          <motion.p
            className={cn(
              "mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted sm:text-lg",
              align === "split" && "lg:col-span-5 lg:mt-0 lg:justify-self-end",
            )}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: duration.slow, ease: ease.out, delay: 0.25 }}
            data-reveal
          >
            {description}
          </motion.p>
        )}
      </div>
    </header>
  );
}
