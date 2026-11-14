#!/usr/bin/env node
/**
 * Saves a snapshot of public GitHub data to src/data/github-snapshot.json.
 * The site shows this snapshot when the live GitHub API is unavailable or rate limited.
 *
 * Runs automatically before `npm run build`. If the network or API fails,
 * the existing snapshot is kept and the build continues.
 *
 * Optional: set GITHUB_TOKEN (e.g. in GitHub Actions) for a higher rate limit.
 * The token is only used here at build time and never reaches the browser.
 */
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const USER = "huy100408";
const OUT = fileURLToPath(new URL("../src/data/github-snapshot.json", import.meta.url));

const headers = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "portfolio-snapshot",
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

const pick = (obj, keys) => Object.fromEntries(keys.map((k) => [k, obj[k] ?? null]));

async function get(path) {
  const res = await fetch(`https://api.github.com${path}`, { headers, signal: AbortSignal.timeout(10_000) });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${path}`);
  return res.json();
}

try {
  const [user, repos, events] = await Promise.all([
    get(`/users/${USER}`),
    get(`/users/${USER}/repos?per_page=100&sort=pushed`),
    get(`/users/${USER}/events/public?per_page=100`).catch(() => []),
  ]);

  const snapshot = {
    fetchedAt: new Date().toISOString(),
    user: pick(user, ["login", "name", "avatar_url", "html_url", "public_repos", "followers", "following", "created_at"]),
    repos: repos.map((r) =>
      pick(r, [
        "name", "description", "language", "stargazers_count", "forks_count",
        "updated_at", "pushed_at", "html_url", "homepage", "topics", "fork", "archived",
      ]),
    ),
    events: events.map((e) => ({
      id: e.id,
      type: e.type,
      created_at: e.created_at,
      repo: { name: e.repo.name },
      payload: {
        ref: e.payload?.ref ?? null,
        ref_type: e.payload?.ref_type ?? null,
        action: e.payload?.action ?? null,
        release: e.payload?.release ? { tag_name: e.payload.release.tag_name } : null,
      },
    })),
  };

  await writeFile(OUT, JSON.stringify(snapshot, null, 2) + "\n");
  console.log(`GitHub snapshot saved: ${snapshot.repos.length} repos, ${snapshot.events.length} events.`);
} catch (err) {
  console.warn(`GitHub snapshot skipped (keeping the existing one): ${err.message}`);
}
