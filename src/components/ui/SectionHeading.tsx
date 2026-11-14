"use client";

import { motion } from "framer-motion";
import { SplitText } from "@/components/motion/SplitText";
import { duration, ease, inView } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Apple-style section header: a small gradient label, a big headline that blurs in
 * word by word, and an optional muted description.
 */
export function SectionHeading({
  label,
  title,
  description,
  className,
  align = "left",
  id,
}: {
  label: string;
  title: string;
  description?: React.ReactNode;
  className?: string;
  align?: "left" | "center" | "split";
  id?: string;
}) {
  const center = align === "center";
  return (
    <header className={cn("mb-14 sm:mb-20", center && "mx-auto max-w-4xl text-center", className)}>
      <motion.p
        className="mb-4 inline-block text-[17px] font-semibold tracking-[-0.01em] text-gradient sm:mb-5 sm:text-[21px]"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={inView}
        transition={{ duration: duration.slow, ease: ease.out }}
        data-reveal
      >
        {label}
      </motion.p>
      <div className={cn(align === "split" && "grid gap-6 lg:grid-cols-12 lg:items-end")}>
        <SplitText
          as="h2"
          id={id}
          effect="blur"
          text={title}
          delay={0.1}
          className={cn("text-h2 text-balance", align === "split" && "lg:col-span-7")}
        />
        {description && (
          <motion.p
            className={cn(
              "mt-6 text-pretty text-[17px] leading-[1.47] text-muted sm:text-[21px] sm:leading-[1.38]",
              center ? "mx-auto max-w-2xl" : "max-w-xl",
              align === "split" && "lg:col-span-5 lg:mt-0 lg:justify-self-end",
            )}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: duration.slow, ease: ease.out, delay: 0.35 }}
            data-reveal
          >
            {description}
          </motion.p>
        )}
      </div>
    </header>
  );
}
