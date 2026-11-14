import { cn } from "@/lib/utils";

const bars = [
  { delay: "0s", duration: "0.9s" },
  { delay: "-0.35s", duration: "0.75s" },
  { delay: "-0.6s", duration: "1.05s" },
  { delay: "-0.15s", duration: "0.85s" },
];

/** Four bars that bounce while music plays. Static (and short) when paused or with reduced motion. */
export function Equalizer({ on, className }: { on: boolean; className?: string }) {
  return (
    <span aria-hidden className={cn("inline-flex h-4 items-end gap-[3px]", on && "eq-on", className)}>
      {bars.map((b, i) => (
        <span
          key={i}
          className="eq-bar h-full w-[3px] rounded-full bg-current"
          style={{ animationDelay: b.delay, animationDuration: b.duration }}
        />
      ))}
    </span>
  );
}
