"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SkillCard } from "@/components/ui/SkillCard";
import { skillCategories } from "@/config/skills";
import { BrandIcon } from "@/lib/brand-icons";
import { inView, scaleIn } from "@/lib/motion";

// Bento layout: Frontend gets the large tile.
const layout: Record<string, string> = {
  Frontend: "md:col-span-2 lg:col-span-2 lg:row-span-2",
  Programming: "",
  Backend: "",
  Tools: "",
  Other: "",
};

export function Skills() {
  const allIcons = skillCategories.flatMap((c) => c.skills).filter((s) => s.icon);

  return (
    <section id="skills" className="relative overflow-hidden py-28 sm:py-40">
      <div className="container-page">
        <SectionHeading
          label="Skills"
          title="Tools I build with."
          description="The languages, frameworks and tools I use across my projects."
          align="center"
        />
      </div>

      {/* Continuous icon marquee */}
      <div
        className="marquee relative mb-12 flex overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] sm:mb-16"
        aria-hidden
      >
        <div className="animate-marquee flex shrink-0 gap-3 pr-3">
          {[...allIcons, ...allIcons].map((s, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2.5 whitespace-nowrap rounded-full bg-bg-2 px-5 py-3 text-[15px] font-medium text-muted"
            >
              <BrandIcon name={s.icon!} className="size-[18px] text-fg" />
              {s.name}
            </span>
          ))}
        </div>
      </div>

      <div className="container-page">
        <motion.div
          className="grid auto-rows-[minmax(200px,auto)] gap-4 md:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          whileInView="show"
          viewport={inView}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
        >
          {skillCategories.map((c, i) => (
            <motion.div key={c.title} variants={scaleIn} className={layout[c.title] ?? ""} data-reveal>
              <SkillCard category={c} index={i} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
