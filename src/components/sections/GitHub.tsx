"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, GitFork, RefreshCw, Star, TriangleAlert } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { CountUp } from "@/components/motion/CountUp";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/config/site";
import { useMounted } from "@/hooks/useMounted";
import { BrandIcon } from "@/lib/brand-icons";
import {
  RateLimitError,
  fetchGitHub,
  getSnapshot,
  languageColors,
  type GitHubData,
  type GitHubSource,
} from "@/lib/github";
import { ease, inView } from "@/lib/motion";
import { cn, formatDate, timeAgo } from "@/lib/utils";

type Status =
  | { state: "idle" | "loading" }
  | { state: "ok"; source: GitHubSource }
  | { state: "error"; message: string };

const snapshot = getSnapshot();

/* ---------------------------------------------------------------- pieces */

function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("rounded-2xl border border-line bg-bg p-5 sm:p-6", className)}>{children}</div>;
}

function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-bg-3", className)} />;
}

function langColor(name: string | null) {
  return (name && languageColors[name]) || "var(--muted)";
}

function StatusBadge({ status, data }: { status: Status; data: GitHubData | null }) {
  const mounted = useMounted();
  let dot = "bg-muted";
  let text = "Waiting";
  if (status.state === "loading") {
    dot = "bg-amber-500 animate-pulse";
    text = "Fetching live data…";
  } else if (status.state === "ok") {
    dot = "bg-emerald-500";
    text = status.source === "cache" ? "Live (cached)" : "Live";
  } else if (data) {
    dot = "bg-amber-500";
    text = `Snapshot from ${mounted ? formatDate(data.fetchedAt) : "build"}`;
  } else if (status.state === "error") {
    dot = "bg-red-500";
    text = "Unavailable";
  }
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-line bg-bg px-3 py-1.5 font-mono text-[11px] text-muted">
      <span className={cn("size-1.5 rounded-full", dot)} />
      {text}
    </span>
  );
}

/** Grid of the last 12 weeks of public events (GitHub's events feed only covers ~90 days). */
function ActivityGrid({ days }: { days: Record<string, number> }) {
  const mounted = useMounted();
  const weeks = 12;
  const cells: { key: string; count: number }[] = [];
  if (mounted) {
    const today = new Date();
    // Columns are weeks (Sunday first); the last column is the current week.
    const start = new Date(today);
    start.setDate(today.getDate() - today.getDay() - (weeks - 1) * 7);
    for (let i = 0; i < weeks * 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      cells.push({ key, count: d > today ? -1 : (days[key] ?? 0) });
    }
  }
  const max = Math.max(1, ...cells.map((c) => c.count));
  const total = Object.values(days).reduce((a, b) => a + b, 0);

  return (
    <div>
      <div
        className="grid grid-flow-col grid-rows-7 gap-[3px]"
        role="img"
        aria-label={`${total} public GitHub events in the last 90 days`}
      >
        {(mounted ? cells : Array.from({ length: weeks * 7 }, (_, i) => ({ key: String(i), count: 0 }))).map((c, i) => (
          <motion.span
            key={c.key}
            title={c.count >= 0 ? `${c.key}: ${c.count} event${c.count === 1 ? "" : "s"}` : undefined}
            className={cn("aspect-square rounded-[3px]", c.count < 0 ? "bg-transparent" : c.count === 0 ? "bg-bg-3" : "bg-accent")}
            style={c.count > 0 ? { opacity: 0.25 + 0.75 * (c.count / max) } : undefined}
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: Math.floor(i / 7) * 0.03 + (i % 7) * 0.01, duration: 0.4, ease: ease.out }}
          />
        ))}
      </div>
      <p className="mt-3 font-mono text-[11px] text-muted">{total} public events · last 90 days</p>
    </div>
  );
}

/* ---------------------------------------------------------------- section */

export function GitHub({ index = "04" }: { index?: string }) {
  const root = useRef<HTMLElement>(null);
  const mounted = useMounted();
  const [data, setData] = useState<GitHubData | null>(snapshot);
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [resetAt, setResetAt] = useState<Date | null>(null);

  const load = useCallback(async (force = false, signal?: AbortSignal) => {
    setStatus({ state: "loading" });
    try {
      const res = await fetchGitHub({ force, signal });
      setData(res.data);
      setResetAt(null);
      setStatus({ state: "ok", source: res.source });
    } catch (err) {
      if (signal?.aborted) return;
      if (err instanceof RateLimitError) {
        setResetAt(err.resetAt);
        setStatus({ state: "error", message: "GitHub's hourly API limit for your network has been reached." });
      } else {
        setStatus({ state: "error", message: "Couldn't reach the GitHub API." });
      }
    }
  }, []);

  // Fetch live data only when the section is about to be seen.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctrl = new AbortController();
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          io.disconnect();
          load(false, ctrl.signal);
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      ctrl.abort();
    };
  }, [load]);

  const totalLang = data?.languages.reduce((n, l) => n + l.count, 0) ?? 0;

  return (
    <section id="github" ref={root} className="relative bg-bg-2/60 py-28 sm:py-40">
      <div className="container-page">
        <SectionHeading
          index={index}
          label="GitHub"
          title="Open source, live."
          description="Public repositories and activity, pulled straight from the GitHub API."
          align="split"
        />

        {/* Toolbar */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <StatusBadge status={status} data={data} />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => load(true)}
              disabled={status.state === "loading"}
              className="inline-flex h-9 items-center gap-2 rounded-full border border-line bg-bg px-3.5 text-sm font-medium transition-colors hover:border-line-strong disabled:opacity-50"
            >
              <RefreshCw className={cn("size-3.5", status.state === "loading" && "animate-spin")} />
              Refresh
            </button>
            <a
              href={site.github.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center gap-2 rounded-full bg-fg px-4 text-sm font-medium text-bg"
            >
              <BrandIcon name="github" className="size-3.5" /> View profile
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </div>

        {status.state === "error" && (
          <div role="status" className="mb-4 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm">
            <TriangleAlert className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <p className="text-fg/80">
              {status.message}{" "}
              {resetAt && mounted && <>It resets at {resetAt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}. </>}
              {data ? "Showing the most recent saved snapshot instead." : "Visit the profile on GitHub to see the repositories."}
            </p>
          </div>
        )}

        {!data ? (
          status.state === "error" ? null : (
            <div className="grid gap-4 lg:grid-cols-12" aria-busy="true" aria-label="Loading GitHub data">
              <Skeleton className="h-48 lg:col-span-4" />
              <Skeleton className="h-48 lg:col-span-8" />
              <Skeleton className="h-72 lg:col-span-8" />
              <Skeleton className="h-72 lg:col-span-4" />
            </div>
          )
        ) : (
          <RevealGroup className="grid gap-4 lg:grid-cols-12" each={0.08}>
            {/* Profile */}
            <RevealItem className="lg:col-span-4">
              <Panel className="flex h-full flex-col">
                <div className="flex items-center gap-4">
                  <Image
                    src={data.profile.avatarUrl}
                    alt=""
                    width={56}
                    height={56}
                    className="size-14 rounded-full border border-line"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-lg font-semibold tracking-tight">{data.profile.name ?? site.name}</p>
                    <p className="font-mono text-sm text-muted">@{data.profile.login}</p>
                  </div>
                </div>
                <dl className="mt-auto grid grid-cols-2 gap-4 pt-8 text-sm">
                  <div>
                    <dt className="text-muted">On GitHub since</dt>
                    <dd className="mt-0.5 font-medium" suppressHydrationWarning>{formatDate(data.profile.createdAt)}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Following</dt>
                    <dd className="mt-0.5 font-medium tabular-nums">{data.profile.following}</dd>
                  </div>
                </dl>
              </Panel>
            </RevealItem>

            {/* Stats */}
            <RevealItem className="lg:col-span-8">
              <div className="grid h-full grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { label: "Public repos", value: data.profile.publicRepos },
                  { label: "Stars earned", value: data.totals.stars },
                  { label: "Forks", value: data.totals.forks },
                  { label: "Followers", value: data.profile.followers },
                ].map((s) => (
                  <Panel key={s.label} className="flex flex-col justify-between">
                    <p className="text-sm text-muted">{s.label}</p>
                    <CountUp value={s.value} className="mt-6 block text-4xl font-semibold tracking-[-0.04em] tabular-nums sm:text-5xl" />
                  </Panel>
                ))}
              </div>
            </RevealItem>

            {/* Repositories */}
            <RevealItem className="lg:col-span-8">
              <Panel className="h-full p-0 sm:p-0">
                <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-6">
                  <h3 className="font-semibold tracking-tight">Recently updated</h3>
                  <span className="font-mono text-xs text-muted">{data.repos.length} public</span>
                </div>
                <ul className="divide-y divide-line">
                  {data.repos.slice(0, 6).map((r) => (
                    <li key={r.name}>
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex flex-col gap-3 px-5 py-5 transition-colors hover:bg-bg-2 sm:px-6"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <p className="font-mono text-[15px] font-medium">
                            <span className="text-muted">{data.profile.login}/</span>
                            {r.name}
                          </p>
                          <ArrowUpRight className="size-4 shrink-0 text-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" />
                        </div>
                        {r.description && <p className="text-pretty text-sm leading-relaxed text-muted">{r.description}</p>}
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-xs text-muted">
                          {r.language && (
                            <span className="inline-flex items-center gap-1.5">
                              <span className="size-2.5 rounded-full" style={{ background: langColor(r.language) }} />
                              {r.language}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1" aria-label={`${r.stars} stars`}>
                            <Star className="size-3.5" /> {r.stars}
                          </span>
                          <span className="inline-flex items-center gap-1" aria-label={`${r.forks} forks`}>
                            <GitFork className="size-3.5" /> {r.forks}
                          </span>
                          <span suppressHydrationWarning>Updated {mounted ? timeAgo(r.updatedAt) : formatDate(r.updatedAt)}</span>
                        </div>
                      </a>
                    </li>
                  ))}
                  {data.repos.length === 0 && <li className="px-6 py-8 text-sm text-muted">No public repositories yet.</li>}
                </ul>
              </Panel>
            </RevealItem>

            {/* Languages + activity */}
            <RevealItem className="flex flex-col gap-4 lg:col-span-4">
              <Panel>
                <h3 className="font-semibold tracking-tight">Languages</h3>
                <p className="mt-1 text-xs text-muted">Main language of each public repo</p>
                <div className="mt-5 flex h-2 overflow-hidden rounded-full bg-bg-3">
                  {data.languages.map((l, i) => (
                    <motion.span
                      key={l.name}
                      className="h-full origin-left"
                      style={{ width: `${(l.count / totalLang) * 100}%`, background: langColor(l.name) }}
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={inView}
                      transition={{ duration: 1, ease: ease.out, delay: 0.2 + i * 0.1 }}
                    />
                  ))}
                </div>
                <ul className="mt-4 space-y-2 text-sm">
                  {data.languages.map((l) => (
                    <li key={l.name} className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-2">
                        <span className="size-2.5 rounded-full" style={{ background: langColor(l.name) }} />
                        {l.name}
                      </span>
                      <span className="font-mono text-xs text-muted tabular-nums">
                        {l.count} repo{l.count === 1 ? "" : "s"}
                      </span>
                    </li>
                  ))}
                </ul>
              </Panel>

              <Panel className="flex-1">
                <h3 className="mb-4 font-semibold tracking-tight">Activity</h3>
                <ActivityGrid days={data.eventDays} />
                {data.activity.length > 0 && (
                  <ul className="mt-5 space-y-3 border-t border-line pt-5">
                    {data.activity.slice(0, 4).map((a) => (
                      <li key={a.id} className="flex items-start gap-3 text-sm">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-fg/40" />
                        <div className="min-w-0">
                          <p className="truncate">
                            {a.label}
                            {a.count > 1 && <span className="text-muted"> ×{a.count}</span>}
                          </p>
                          <p className="truncate font-mono text-[11px] text-muted" suppressHydrationWarning>
                            {a.repo} · {mounted ? timeAgo(a.date) : formatDate(a.date)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </Panel>
            </RevealItem>
          </RevealGroup>
        )}
      </div>
    </section>
  );
}
