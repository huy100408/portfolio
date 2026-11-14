"use client";

import { motion } from "framer-motion";
import type { SkillCategory } from "@/config/skills";
import { BrandIcon, brandColor } from "@/lib/brand-icons";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

const chip = {
  hidden: { opacity: 0, y: 14, scale: 0.9 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: ease.out } },
};

export function SkillCard({ category, index, className }: { category: SkillCategory; index: number; className?: string }) {
  return (
    <div
      className={cn(
        "spotlight group/card flex h-full flex-col overflow-hidden rounded-tile bg-bg-2 p-7 sm:p-8",
        className,
      )}
    >
      <div className="flex items-baseline justify-between">
        <h3 className="text-[24px] font-semibold tracking-[-0.02em] sm:text-[28px]">{category.title}</h3>
        <span className="text-[13px] text-muted tabular-nums">
          {category.skills.length} {category.skills.length === 1 ? "tool" : "tools"}
        </span>
      </div>
      <p className="mt-1 text-[15px] text-muted sm:text-[17px]">{category.blurb}</p>

      <motion.ul
        className="mt-auto flex flex-wrap gap-2 pt-8"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.15 } } }}
      >
        {category.skills.map((s, i) => (
          <motion.li key={s.name} variants={chip} data-reveal>
            {/* Inner span floats on its own slow loop, offset per chip so they never move in sync. */}
            <span
              className="animate-float inline-block"
              style={{ animationDelay: `${-(i * 0.7 + index * 1.3)}s`, animationDuration: `${5 + (i % 3)}s` }}
            >
              <span
                className="group/chip inline-flex items-center gap-2 rounded-full bg-bg px-3.5 py-2 text-[14px] font-medium transition-[translate,box-shadow] duration-300 ease-out-expo hover:-translate-y-1 hover:shadow-soft"
                style={{ "--brand": brandColor(s.icon) ?? "var(--fg)" } as React.CSSProperties}
              >
                {s.icon && (
                  <BrandIcon
                    name={s.icon}
                    className="size-4 text-muted transition-[color,rotate,scale] duration-300 group-hover/chip:rotate-[-8deg] group-hover/chip:scale-110 group-hover/chip:text-[var(--brand)]"
                  />
                )}
                {s.name}
              </span>
            </span>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}
