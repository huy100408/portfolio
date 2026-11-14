"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Loader2, Pause, Play } from "lucide-react";
import { useEffect, useRef } from "react";
import { Equalizer } from "@/components/music/Equalizer";
import { useMusic } from "@/components/providers/MusicProvider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { soundtrack } from "@/config/music";
import { duration, ease, inView } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * The visible YouTube player behind the site's background music.
 * YouTube's terms require the player to stay visible, so it lives here as part of the page,
 * and the floating pill is only a remote for it.
 */
export function Soundtrack() {
  const { status, ready, hostRef, load, toggle } = useMusic();
  const section = useRef<HTMLElement>(null);
  const playing = status === "playing";

  // Load the player as the section comes near, in case the idle preload hasn't run yet.
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          load();
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [load]);

  return (
    <section
      ref={section}
      id="soundtrack"
      aria-labelledby="soundtrack-title"
      data-nav-theme="dark"
      className="dark relative overflow-hidden bg-bg py-28 text-fg sm:py-40"
    >
      {/* Slow colour field behind the player. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="animate-drift absolute left-1/2 top-[38%] size-[58rem] max-w-[160vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(41_151_255/0.22),transparent)] blur-2xl" />
        <div
          className="animate-drift absolute left-[30%] top-[62%] size-[36rem] max-w-[120vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(244_114_182/0.16),transparent)] blur-2xl"
          style={{ animationDelay: "-9s" }}
        />
      </div>

      <div className="container-page relative">
        <SectionHeading
          id="soundtrack-title"
          align="center"
          label="Soundtrack"
          title="Music for the scroll."
          description={
            <>
              “{soundtrack.title}” by {soundtrack.artist} plays while you look around. It starts on your first click or key
              press, and you can pause it here or from the player in the corner.
            </>
          }
        />

        <motion.div
          className="relative mx-auto max-w-4xl"
          initial={{ opacity: 0, y: 60, scale: 0.94 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={inView}
          transition={{ duration: duration.cinematic * 1.2, ease: ease.out }}
          data-reveal
        >
          {/* Glow that breathes while music plays. */}
          <div
            aria-hidden
            className={cn(
              "aurora-haze pointer-events-none absolute -inset-[12%] rounded-full blur-3xl transition-opacity duration-1000",
              playing ? "animate-breathe opacity-70" : "opacity-25",
            )}
          />

          <div
            data-music-control
            className="relative aspect-video overflow-hidden rounded-tile bg-bg-2 shadow-lift ring-1 ring-white/10"
          >
            {/* YouTube mounts its iframe in here. */}
            <div ref={hostRef} className="absolute inset-0 [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:size-full" />

            <AnimatePresence>
              {!ready && (
                <motion.button
                  type="button"
                  onClick={toggle}
                  aria-label={`Play “${soundtrack.title}” by ${soundtrack.artist}`}
                  className="group absolute inset-0 grid place-items-center bg-[radial-gradient(120%_90%_at_50%_100%,#1d1d1f,#000)]"
                  exit={{ opacity: 0, transition: { duration: 0.6 } }}
                >
                  <span className="flex flex-col items-center gap-5">
                    <span className="grid size-20 place-items-center rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur transition-transform duration-500 ease-out-expo group-hover:scale-110 sm:size-24">
                      {status === "loading" ? (
                        <Loader2 className="size-7 animate-spin text-white" aria-hidden />
                      ) : (
                        <Play className="size-7 translate-x-0.5 fill-white text-white" aria-hidden />
                      )}
                    </span>
                    <span className="text-center">
                      <span className="block text-xl font-semibold text-white sm:text-2xl">{soundtrack.title}</span>
                      <span className="mt-1 block text-sm text-white/60">{soundtrack.artist}</span>
                    </span>
                  </span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <div className="relative mt-6 flex flex-wrap items-center justify-between gap-4 px-1">
            <div className="flex items-center gap-4">
              <Equalizer on={playing} className={cn("h-5", playing ? "text-accent" : "text-muted")} />
              <div className="leading-tight">
                <p className="text-[17px] font-semibold">{soundtrack.title}</p>
                <p className="text-sm text-muted">{soundtrack.artist}</p>
              </div>
            </div>
            <div className="flex items-center gap-2" data-music-control>
              <button
                type="button"
                onClick={toggle}
                aria-pressed={playing}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-fg px-5 text-sm font-medium text-bg transition-transform duration-300 ease-out-expo hover:scale-[1.03] active:scale-[0.97]"
              >
                {playing ? (
                  <Pause className="size-4 fill-current" aria-hidden />
                ) : (
                  <Play className="size-4 fill-current" aria-hidden />
                )}
                {playing ? "Pause" : "Play"}
              </button>
              <a
                href={soundtrack.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-medium text-accent transition-colors hover:bg-bg-2"
              >
                Watch on YouTube
                <ArrowUpRight className="size-4" aria-hidden />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
          </div>

          <p role="status" className="relative mt-4 min-h-5 px-1 text-sm text-muted">
            {status === "blocked" && "Your browser blocked the sound. Press play on the video to start it."}
            {status === "error" && "The player couldn’t load here. You can still listen on YouTube."}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
