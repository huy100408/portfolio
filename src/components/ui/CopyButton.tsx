"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { useCopy } from "@/hooks/useCopy";
import { cn } from "@/lib/utils";

/** Copy-to-clipboard button with an animated confirmation and a screen-reader announcement. */
export function CopyButton({
  value,
  label,
  className,
  children,
}: {
  value: string;
  /** Accessible name, e.g. "Copy email address". */
  label: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const { copy, copied, failed } = useCopy();
  const ok = copied === value;

  return (
    <button
      type="button"
      onClick={() => copy(value)}
      aria-label={label}
      className={cn(
        "relative inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-2 text-sm font-medium transition-colors hover:border-line-strong hover:bg-bg-2",
        ok && "border-emerald-500/40 text-emerald-600 dark:text-emerald-400",
        className,
      )}
    >
      <span className="relative grid size-4 place-items-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={ok ? "ok" : "copy"}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute"
          >
            {ok ? <Check className="size-4" strokeWidth={2.25} /> : <Copy className="size-4" strokeWidth={1.75} />}
          </motion.span>
        </AnimatePresence>
      </span>
      <span>{ok ? "Copied" : failed ? "Copy failed" : (children ?? "Copy")}</span>
      <span className="sr-only" aria-live="polite">
        {ok ? "Copied to clipboard" : failed ? "Could not copy. Select the text and copy it manually." : ""}
      </span>
    </button>
  );
}
