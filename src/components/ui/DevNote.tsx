import { Info } from "lucide-react";

/**
 * A reminder that only appears in `npm run dev`. Never shipped to the live site.
 * Used where content still needs to be filled in.
 */
export function DevNote({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV !== "development") return null;
  return (
    <div className="flex items-start gap-3 rounded-xl border border-dashed border-accent/50 bg-accent-soft p-4 font-mono text-xs leading-relaxed text-accent">
      <Info className="mt-px size-4 shrink-0" />
      <div>
        <span className="font-semibold">Dev only · </span>
        {children}
      </div>
    </div>
  );
}
