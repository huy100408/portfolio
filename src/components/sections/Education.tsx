import { GraduationCap } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { DevNote } from "@/components/ui/DevNote";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { education } from "@/config/education";

/** Hidden on the live site until src/config/education.ts has entries. */
export function Education({ index }: { index: string }) {
  const empty = education.length === 0;
  if (empty && process.env.NODE_ENV !== "development") return null;

  return (
    <section id="education" className="relative bg-bg-2/60 py-28 sm:py-40">
      <div className="container-page">
        <SectionHeading index={index} label="Education" title="Education." />
        {empty ? (
          <DevNote>
            This section is hidden on the live site until you add entries to src/config/education.ts.
          </DevNote>
        ) : (
          <RevealGroup as="ul" className="grid gap-4 md:grid-cols-2">
            {education.map((e) => (
              <RevealItem as="li" key={`${e.school}-${e.period}`} className="rounded-2xl border border-line bg-bg p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <span className="grid size-11 place-items-center rounded-xl border border-line">
                    <GraduationCap className="size-5" strokeWidth={1.75} />
                  </span>
                  <span className="font-mono text-xs tabular-nums text-muted">{e.period}</span>
                </div>
                <h3 className="mt-8 text-2xl font-semibold tracking-[-0.03em]">{e.school}</h3>
                <p className="mt-1 text-muted">
                  {e.credential}
                  {e.location && ` · ${e.location}`}
                </p>
                {e.notes && e.notes.length > 0 && (
                  <ul className="mt-6 space-y-2 border-t border-line pt-6 text-sm text-muted">
                    {e.notes.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                  </ul>
                )}
              </RevealItem>
            ))}
          </RevealGroup>
        )}
      </div>
    </section>
  );
}
