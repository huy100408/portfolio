"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { useIntro } from "@/components/providers/IntroProvider";
import { useMusic } from "@/components/providers/MusicProvider";
import { soundtrack } from "@/config/music";
import { ease } from "@/lib/motion";
import { cn, scrollToSection } from "@/lib/utils";
import { Equalizer } from "./Equalizer";

/**
 * Floating "now playing" remote for the soundtrack.
 * It controls the YouTube player in the Soundtrack section, and hides while that section is on screen.
 */
export function MusicPill() {
  const { status, toggle, play } = useMusic();
  const { done } = useIntro();
  const [playerInView, setPlayerInView] = useState(false);
  const [overDark, setOverDark] = useState(false);

  useEffect(() => {
    const target = document.getElementById("soundtrack");
    if (!target) return;
    const io = new IntersectionObserver(([entry]) => setPlayerInView(entry.isIntersecting), { threshold: 0.35 });
    io.observe(target);
    return () => io.disconnect();
  }, []);

  // Match the section underneath, like the navbar does: dark glass over the black sections.
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const y = window.innerHeight - 48;
      const dark = Array.from(document.querySelectorAll<HTMLElement>("[data-nav-theme='dark']")).some((el) => {
        const r = el.getBoundingClientRect();
        return r.top <= y && r.bottom >= y;
      });
      setOverDark(dark);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const playing = status === "playing";
  const blocked = status === "blocked";
  const error = status === "error";

  const onClick = () => {
    if (blocked) {
      // The browser wants a press on the video itself.
      play();
      scrollToSection("soundtrack");
      return;
    }
    toggle();
  };

  const label = playing
    ? `Pause “${soundtrack.title}”`
    : blocked
      ? "Sound is blocked. Go to the player"
      : `Play “${soundtrack.title}” by ${soundtrack.artist}`;

  return (
    <AnimatePresence>
      {done && !playerInView && !error && (
        <motion.div
          data-music-control
          className={cn("fixed bottom-4 right-4 z-30 sm:bottom-6 sm:right-6", overDark && "dark")}
          initial={{ opacity: 0, y: 24, scale: 0.9, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: 16, scale: 0.94, filter: "blur(6px)" }}
          transition={{ duration: 0.7, ease: ease.out, delay: 0.4 }}
        >
          <div className={cn("rounded-full transition-shadow duration-500", playing && "glow-ring")}>
            <button
              type="button"
              onClick={onClick}
              aria-label={label}
              aria-pressed={playing}
              className={cn(
                "group flex h-12 items-center gap-3 rounded-full border border-line/70 py-1.5 pl-1.5 pr-4 text-left text-fg shadow-soft transition-transform duration-300 ease-out-expo hover:scale-[1.03] active:scale-[0.97]",
                // Opaque while the colour ring spins behind it, frosted glass otherwise.
                playing ? "bg-bg" : "glass",
              )}
            >
              <span
                className={cn(
                  "grid size-9 shrink-0 place-items-center rounded-full transition-colors duration-300",
                  playing ? "bg-fg text-bg" : "bg-cta text-white",
                )}
              >
                {status === "loading" ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : playing ? (
                  <Pause className="size-4 fill-current" aria-hidden />
                ) : (
                  <Play className="size-4 translate-x-px fill-current" aria-hidden />
                )}
              </span>
              <span className="flex min-w-0 flex-col leading-tight">
                <span className="text-[13px] font-semibold">{blocked ? "Tap to play" : soundtrack.title}</span>
                <span className="text-[11px] text-muted">{blocked ? "Sound was blocked" : soundtrack.artist}</span>
              </span>
              <Equalizer on={playing} className={cn("ml-1 h-3.5", playing ? "text-accent" : "text-muted")} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
