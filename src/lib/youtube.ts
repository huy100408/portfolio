/**
 * Minimal typings and a loader for the YouTube IFrame Player API.
 * https://developers.google.com/youtube/iframe_api_reference
 */

export type YTPlayer = {
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  setVolume(volume: number): void;
  getPlayerState(): number;
  destroy(): void;
};

type YTEvent<T = unknown> = { target: YTPlayer; data: T };

export type YTPlayerOptions = {
  host?: string;
  videoId: string;
  width?: string | number;
  height?: string | number;
  playerVars?: Record<string, string | number>;
  events?: {
    onReady?: (e: YTEvent) => void;
    onStateChange?: (e: YTEvent<number>) => void;
    onError?: (e: YTEvent<number>) => void;
    onAutoplayBlocked?: (e: YTEvent) => void;
  };
};

type YTNamespace = {
  Player: new (el: HTMLElement, options: YTPlayerOptions) => YTPlayer;
};

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export const PlayerState = { UNSTARTED: -1, ENDED: 0, PLAYING: 1, PAUSED: 2, BUFFERING: 3, CUED: 5 } as const;

let api: Promise<YTNamespace> | null = null;

/** Loads the API script once. Resolves when `YT.Player` is ready to use. */
export function loadYouTubeApi(): Promise<YTNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (api) return api;
  api = new Promise<YTNamespace>((resolve, reject) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      if (window.YT) resolve(window.YT);
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => {
      api = null;
      reject(new Error("Could not load the YouTube player"));
    };
    document.head.appendChild(script);
  });
  return api;
}
