"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useMounted } from "@/hooks/useMounted";
import { cn } from "@/lib/utils";


export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const dark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      className={cn(
        "relative grid size-9 place-items-center overflow-hidden rounded-full text-muted transition-colors hover:bg-bg-2 hover:text-fg",
        className,
      )}
      aria-label={mounted ? `Switch to ${dark ? "light" : "dark"} mode` : "Toggle color theme"}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={dark ? "moon" : "sun"}
          initial={{ y: 14, opacity: 0, rotate: -60 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -14, opacity: 0, rotate: 60 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="grid place-items-center"
        >
          {dark ? <Moon className="size-[17px]" strokeWidth={1.75} /> : <Sun className="size-[17px]" strokeWidth={1.75} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
