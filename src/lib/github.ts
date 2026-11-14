/**
 * Public GitHub data, fetched from the browser (GitHub Pages has no server).
 *
 * - No token: only public, unauthenticated endpoints (60 requests/hour per visitor IP).
 * - Responses are cached in sessionStorage for CACHE_TTL to stay well under that limit.
 * - When the API fails or is rate limited, the build-time snapshot
 *   (src/data/github-snapshot.json, written by scripts/snapshot-github.mjs) is shown instead.
 */
import snapshot from "@/data/github-snapshot.json";

export const GITHUB_USER = "huy100408";
const API = "https://api.github.com";
const CACHE_KEY = `gh-cache:${GITHUB_USER}:v1`;
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

/* ---------- Raw shapes (only the fields we read; the snapshot script keeps the same keys) ---------- */

type RawUser = {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
};

type RawRepo = {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  pushed_at: string;
  html_url: string;
  homepage: string | null;
  topics?: string[];
  fork: boolean;
  archived?: boolean;
};

type RawEvent = {
  id: string;
  type: string;
  created_at: string;
  repo: { name: string };
  payload: {
    ref?: string | null;
    ref_type?: string;
    action?: string;
    release?: { tag_name?: string } | null;
  };
};

export type RawGitHub = { fetchedAt: string; user: RawUser; repos: RawRepo[]; events: RawEvent[] };

/* ---------- Normalized shapes used by the UI ---------- */

export type Repo = {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  updatedAt: string;
  url: string;
  homepage: string | null;
  topics: string[];
};

export type Activity = { id: string; label: string; repo: string; date: string; count: number };

export type GitHubData = {
  fetchedAt: string;
  profile: {
    login: string;
    name: string | null;
    avatarUrl: string;
    url: string;
    publicRepos: number;
    followers: number;
    following: number;
    createdAt: string;
  };
  repos: Repo[];
  totals: { stars: number; forks: number };
  languages: { name: string; count: number }[];
  activity: Activity[];
  /** Event counts per day (YYYY-MM-DD) from the public events feed (last 90 days max). */
  eventDays: Record<string, number>;
};

export type GitHubSource = "live" | "cache" | "snapshot";

export class RateLimitError extends Error {
  constructor(public resetAt: Date | null) {
    super("GitHub API rate limit reached");
  }
}

/* ---------- Normalization ---------- */

function describeEvent(e: RawEvent): string | null {
  const ref = e.payload.ref?.replace("refs/heads/", "");
  switch (e.type) {
    case "PushEvent":
      return ref ? `Pushed to ${ref}` : "Pushed commits";
    case "CreateEvent":
      return e.payload.ref_type === "repository"
        ? "Created repository"
        : `Created ${e.payload.ref_type ?? "ref"}${ref ? ` ${ref}` : ""}`;
    case "ReleaseEvent":
      return `Published release ${e.payload.release?.tag_name ?? ""}`.trim();
    case "WatchEvent":
      return "Starred";
    case "ForkEvent":
      return "Forked";
    case "PullRequestEvent":
      return `${e.payload.action === "closed" ? "Closed" : "Opened"} a pull request`;
    case "IssuesEvent":
      return `${e.payload.action === "closed" ? "Closed" : "Opened"} an issue`;
    case "PublicEvent":
      return "Made repository public";
    default:
      return null;
  }
}

export function normalize(raw: RawGitHub): GitHubData {
  const repos = raw.repos
    .filter((r) => !r.fork && !r.archived)
    .sort((a, b) => +new Date(b.pushed_at) - +new Date(a.pushed_at))
    .map<Repo>((r) => ({
      name: r.name,
      description: r.description,
      language: r.language,
      stars: r.stargazers_count,
      forks: r.forks_count,
      updatedAt: r.pushed_at ?? r.updated_at,
      url: r.html_url,
      homepage: r.homepage || null,
      topics: r.topics ?? [],
    }));

  const langCounts = new Map<string, number>();
  for (const r of repos) if (r.language) langCounts.set(r.language, (langCounts.get(r.language) ?? 0) + 1);

  const events = [...raw.events].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));

  const eventDays: Record<string, number> = {};
  for (const e of events) {
    const day = e.created_at.slice(0, 10);
    eventDays[day] = (eventDays[day] ?? 0) + 1;
  }

  // Collapse runs of the same action on the same repo and day ("Pushed to main ×9").
  const activity: Activity[] = [];
  for (const e of events) {
    const label = describeEvent(e);
    if (!label) continue;
    const repo = e.repo.name;
    const day = e.created_at.slice(0, 10);
    const prev = activity[activity.length - 1];
    if (prev && prev.label === label && prev.repo === repo && prev.date.slice(0, 10) === day) {
      prev.count += 1;
    } else {
      activity.push({ id: e.id, label, repo, date: e.created_at, count: 1 });
    }
  }

  return {
    fetchedAt: raw.fetchedAt,
    profile: {
      login: raw.user.login,
      name: raw.user.name,
      avatarUrl: raw.user.avatar_url,
      url: raw.user.html_url,
      publicRepos: raw.user.public_repos,
      followers: raw.user.followers,
      following: raw.user.following,
      createdAt: raw.user.created_at,
    },
    repos,
    totals: {
      stars: repos.reduce((n, r) => n + r.stars, 0),
      forks: repos.reduce((n, r) => n + r.forks, 0),
    },
    languages: [...langCounts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count),
    activity: activity.slice(0, 6),
    eventDays,
  };
}

/* ---------- Fetching ---------- */

async function getJSON<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    signal,
    headers: { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" },
  });
  if (res.status === 403 || res.status === 429) {
    const remaining = res.headers.get("x-ratelimit-remaining");
    const reset = res.headers.get("x-ratelimit-reset");
    if (remaining === "0" || res.status === 429) {
      throw new RateLimitError(reset ? new Date(Number(reset) * 1000) : null);
    }
  }
  if (!res.ok) throw new Error(`GitHub API ${res.status} for ${path}`);
  return res.json() as Promise<T>;
}

export function getSnapshot(): GitHubData | null {
  const raw = snapshot as unknown as Partial<RawGitHub>;
  if (!raw.user || !raw.repos) return null;
  return normalize({ fetchedAt: raw.fetchedAt ?? "", user: raw.user, repos: raw.repos, events: raw.events ?? [] });
}

function readCache(): GitHubData | null {
  try {
    const item = sessionStorage.getItem(CACHE_KEY);
    if (!item) return null;
    const parsed = JSON.parse(item) as { at: number; data: GitHubData };
    if (Date.now() - parsed.at > CACHE_TTL) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

function writeCache(data: GitHubData) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data }));
  } catch {
    /* storage unavailable: fine, we just refetch next time */
  }
}

export async function fetchGitHub(
  opts: { signal?: AbortSignal; force?: boolean } = {},
): Promise<{ data: GitHubData; source: GitHubSource }> {
  if (!opts.force) {
    const cached = readCache();
    if (cached) return { data: cached, source: "cache" };
  }
  const [user, repos, events] = await Promise.all([
    getJSON<RawUser>(`/users/${GITHUB_USER}`, opts.signal),
    getJSON<RawRepo[]>(`/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`, opts.signal),
    // The events feed is a nice-to-have; don't fail the whole section without it.
    getJSON<RawEvent[]>(`/users/${GITHUB_USER}/events/public?per_page=100`, opts.signal).catch((err) => {
      if (err instanceof RateLimitError) throw err;
      return [] as RawEvent[];
    }),
  ]);
  const data = normalize({ fetchedAt: new Date().toISOString(), user, repos, events });
  writeCache(data);
  return { data, source: "live" };
}

/** GitHub's language colours for the languages likely to appear. Unknown ones get a neutral gray. */
export const languageColors: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  "C++": "#f34b7d",
  C: "#555555",
  Swift: "#F05138",
  Shell: "#89e051",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  PLpgSQL: "#336790",
};
