import { ArrowUpRight, Award, BadgeCheck, Trophy } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { DevNote } from "@/components/ui/DevNote";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { achievements, type Achievement } from "@/config/achievements";

const kindIcon: Record<Achievement["kind"], typeof Award> = {
  Certification: BadgeCheck,
  Award: Award,
  Competition: Trophy,
};

/** Hidden on the live site until src/config/achievements.ts has entries. */
export function Achievements() {
  const empty = achievements.length === 0;
  if (empty && process.env.NODE_ENV !== "development") return null;

  return (
    <section id="achievements" className="relative py-28 sm:py-40">
      <div className="container-page">
        <SectionHeading label="Achievements" title="Certifications & awards." />
        {empty ? (
          <DevNote>
            This section is hidden on the live site until you add entries to src/config/achievements.ts.
          </DevNote>
        ) : (
          <RevealGroup as="ul" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {achievements.map((a) => {
              const Icon = kindIcon[a.kind];
              const body = (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <Icon className="size-5" strokeWidth={1.75} />
                    <span className="text-[13px] font-semibold text-muted">{a.date}</span>
                  </div>
                  <p className="mt-8 text-[13px] font-semibold text-gradient">{a.kind}</p>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight">{a.title}</h3>
                  <p className="mt-1 text-sm text-muted">{a.issuer}</p>
                  {a.description && <p className="mt-4 text-sm leading-relaxed text-muted">{a.description}</p>}
                  {a.href && (
                    <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-accent">
                      View credential <ArrowUpRight className="size-3.5" />
                    </span>
                  )}
                </>
              );
              const cls = "spotlight block h-full rounded-tile bg-bg-2 p-7 transition-transform duration-700 ease-out-expo";
              return (
                <RevealItem as="li" key={`${a.title}-${a.date}`}>
                  {a.href ? (
                    <a href={a.href} target="_blank" rel="noopener noreferrer" className={`${cls} hover:-translate-y-1`}>
                      {body}
                    </a>
                  ) : (
                    <div className={cls}>{body}</div>
                  )}
                </RevealItem>
              );
            })}
          </RevealGroup>
        )}
      </div>
    </section>
  );
}
