"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { soundtrack } from "@/config/music";
import { loadYouTubeApi, PlayerState, type YTPlayer } from "@/lib/youtube";
import { useIntro } from "./IntroProvider";

export type MusicStatus = "idle" | "loading" | "playing" | "paused" | "blocked" | "error";

type MusicContextValue = {
  status: MusicStatus;
  /** True once the YouTube player has loaded. */
  ready: boolean;
  /** Element the visible YouTube player is mounted into (rendered by the Soundtrack section). */
  hostRef: React.RefObject<HTMLDivElement | null>;
  load: () => void;
  play: () => void;
  pause: () => void;
  toggle: () => void;
};

const MusicContext = createContext<MusicContextValue | null>(null);

/** localStorage key. "off" means the visitor paused the music, so it won't start by itself again. */
const PREF_KEY = "music";

const readPref = () => {
  try {
    return localStorage.getItem(PREF_KEY);
  } catch {
    return null;
  }
};
const writePref = (value: string | null) => {
  try {
    if (value === null) localStorage.removeItem(PREF_KEY);
    else localStorage.setItem(PREF_KEY, value);
  } catch {}
};

/**
 * Background music through the YouTube IFrame API.
 * - The API and player load lazily: after the intro when the browser is idle, when the
 *   Soundtrack section comes near, or when the visitor presses play.
 * - Browsers only allow sound after the visitor interacts, so playback starts on the first
 *   click or key press (unless they paused it on an earlier visit).
 * - If the browser still blocks it (common on iOS), status becomes "blocked" and the UI
 *   asks the visitor to press play on the video itself.
 */
export function MusicProvider({ children }: { children: React.ReactNode }) {
  const { done } = useIntro();
  const [status, setStatus] = useState<MusicStatus>("idle");
  const [ready, setReady] = useState(false);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const player = useRef<YTPlayer | null>(null);
  const pending = useRef<Promise<YTPlayer> | null>(null);
  const wantPlay = useRef(false);
  const blockTimer = useRef<number | undefined>(undefined);
  // Mirrors `status` for event handlers, which must not read stale state.
  const statusRef = useRef<MusicStatus>("idle");
  const update = useCallback((next: MusicStatus) => {
    statusRef.current = next;
    setStatus(next);
  }, []);

  /** If playback hasn't actually started shortly after asking, the browser blocked it. */
  const watchForBlock = useCallback((p: YTPlayer) => {
    window.clearTimeout(blockTimer.current);
    blockTimer.current = window.setTimeout(() => {
      const s = p.getPlayerState();
      if (wantPlay.current && s !== PlayerState.PLAYING && s !== PlayerState.BUFFERING) update("blocked");
    }, 2500);
  }, [update]);

  const ensurePlayer = useCallback((): Promise<YTPlayer> => {
    if (player.current) return Promise.resolve(player.current);
    if (pending.current) return pending.current;
    const host = hostRef.current;
    if (!host) return Promise.reject(new Error("The music player has nowhere to mount"));

    const created = loadYouTubeApi().then(
      (YT) =>
        new Promise<YTPlayer>((resolve) => {
          // YouTube replaces this node with its iframe. React never renders children into the host,
          // so it never fights over these nodes.
          const mount = document.createElement("div");
          host.replaceChildren(mount);
          const p = new YT.Player(mount, {
            host: "https://www.youtube-nocookie.com",
            videoId: soundtrack.videoId,
            width: "100%",
            height: "100%",
            playerVars: {
              playsinline: 1,
              rel: 0,
              loop: 1,
              playlist: soundtrack.videoId,
              origin: window.location.origin,
            },
            events: {
              onReady: () => {
                player.current = p;
                p.setVolume(soundtrack.volume);
                setReady(true);
                resolve(p);
                if (wantPlay.current) {
                  p.playVideo();
                  watchForBlock(p);
                }
              },
              onStateChange: ({ data }) => {
                if (data === PlayerState.PLAYING) {
                  window.clearTimeout(blockTimer.current);
                  wantPlay.current = true;
                  update("playing");
                } else if (data === PlayerState.PAUSED) {
                  update("paused");
                } else if (data === PlayerState.ENDED) {
                  // Loop (the playlist parameter loops too; this is the fallback).
                  p.seekTo(0, true);
                  p.playVideo();
                }
              },
              onAutoplayBlocked: () => update("blocked"),
              onError: () => update("error"),
            },
          });
        }),
    );
    pending.current = created;
    created.catch(() => {
      pending.current = null;
      update("error");
    });
    return created;
  }, [update, watchForBlock]);

  const load = useCallback(() => {
    ensurePlayer().catch(() => {});
  }, [ensurePlayer]);

  const play = useCallback(() => {
    wantPlay.current = true;
    writePref(null);
    if (statusRef.current !== "playing") update("loading");
    if (player.current) {
      player.current.playVideo();
      watchForBlock(player.current);
    } else {
      ensurePlayer().catch(() => update("error"));
    }
  }, [ensurePlayer, update, watchForBlock]);

  const pause = useCallback(() => {
    wantPlay.current = false;
    writePref("off");
    window.clearTimeout(blockTimer.current);
    player.current?.pauseVideo();
    update(player.current ? "paused" : "idle");
  }, [update]);

  const toggle = useCallback(() => {
    if (statusRef.current === "playing" || statusRef.current === "loading") pause();
    else play();
  }, [pause, play]);

  // Start on the first click or key press. Keeps listening until the music actually plays,
  // so a blocked first attempt gets another chance on the next interaction.
  useEffect(() => {
    if (readPref() === "off") return;
    const ignored = new Set(["Tab", "Shift", "Control", "Alt", "Meta", "Escape", "CapsLock"]);
    let tries = 0;
    const stop = () => {
      window.removeEventListener("click", onGesture, true);
      window.removeEventListener("keydown", onGesture, true);
    };
    function onGesture(e: Event) {
      if (e instanceof KeyboardEvent && (ignored.has(e.key) || e.metaKey || e.ctrlKey || e.altKey)) return;
      // The player's own controls handle their clicks.
      if ((e.target as Element | null)?.closest?.("[data-music-control]")) return;
      if (statusRef.current === "playing" || statusRef.current === "paused" || readPref() === "off") return stop();
      play();
      if (++tries >= 3) stop();
    }
    window.addEventListener("click", onGesture, true);
    window.addEventListener("keydown", onGesture, true);
    return stop;
  }, [play]);

  // Preload the player after the intro, while the browser is idle, so the first click starts music quickly.
  useEffect(() => {
    if (!done || readPref() === "off") return;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (saveData) return;
    let idle = 0;
    const t = window.setTimeout(() => {
      if ("requestIdleCallback" in window) idle = window.requestIdleCallback(load, { timeout: 4000 });
      else load();
    }, 2500);
    return () => {
      window.clearTimeout(t);
      if (idle) window.cancelIdleCallback(idle);
    };
  }, [done, load]);

  useEffect(
    () => () => {
      window.clearTimeout(blockTimer.current);
      player.current?.destroy();
      player.current = null;
      pending.current = null;
    },
    [],
  );

  const value = useMemo(
    () => ({ status, ready, hostRef, load, play, pause, toggle }),
    [status, ready, load, play, pause, toggle],
  );
  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic must be used inside <MusicProvider>");
  return ctx;
}
