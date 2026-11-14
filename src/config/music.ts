/**
 * Background music. Played through YouTube's embedded player, which must stay
 * visible on the page (see the Soundtrack section), so the source is always shown.
 */
export const soundtrack = {
  videoId: "cEE1gFOvUlM",
  title: "Earrings",
  artist: "Malcolm Todd",
  url: "https://www.youtube.com/watch?v=cEE1gFOvUlM",
  /** 0–100. Kept low so it sits behind the page. */
  volume: 40,
} as const;
