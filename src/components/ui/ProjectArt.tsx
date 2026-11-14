import type { ProjectArtKind } from "@/config/projects";
import { cn } from "@/lib/utils";

/**
 * Generated line artwork for projects that don't have screenshots yet.
 * Clearly illustrative (not a fake screenshot). Strokes use currentColor + the accent.
 */
export function ProjectArt({ kind, className }: { kind: ProjectArtKind; className?: string }) {
  return (
    <div className={cn("relative size-full overflow-hidden bg-bg-2", className)}>
      <div className="bg-grid absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <svg viewBox="0 0 320 200" className="absolute inset-0 size-full text-fg/70" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {kind === "home" && (
          <g>
            <path d="M92 112 L132 78 L172 112 V150 H92 Z" />
            <path d="M120 150 V126 H144 V150" />
            <rect x="190" y="62" width="64" height="40" rx="7" />
            <rect x="190" y="110" width="30" height="40" rx="7" />
            <rect x="224" y="110" width="30" height="40" rx="7" />
            <rect x="200" y="74" width="22" height="9" rx="4.5" className="text-accent" stroke="currentColor" />
            <circle cx="217.5" cy="78.5" r="3" className="text-accent" fill="currentColor" stroke="none" />
            <path d="M200 92 H242" opacity=".5" />
            <path d="M205 140 v-14 M213 140 v-8" opacity=".7" />
            <circle cx="239" cy="130" r="9" opacity=".7" />
            <path d="M239 121 a9 9 0 0 1 9 9" className="text-accent" stroke="currentColor" strokeWidth="2" />
            <path d="M118 66 q14 -12 28 0 M110 58 q22 -20 44 0" opacity=".45" />
          </g>
        )}
        {kind === "robot" && (
          <g>
            <rect x="70" y="138" width="76" height="16" rx="4" />
            <circle cx="108" cy="130" r="8" />
            <path d="M108 122 L140 78" strokeWidth="6" opacity=".15" />
            <path d="M108 122 L140 78" />
            <circle cx="140" cy="78" r="7" />
            <path d="M140 78 L192 92" />
            <circle cx="192" cy="92" r="5" className="text-accent" stroke="currentColor" />
            <path d="M196 88 l12 -8 M196 96 l12 8" />
            <g transform="translate(236 118)">
              <circle r="20" />
              <circle r="7" className="text-accent" stroke="currentColor" />
              {Array.from({ length: 8 }).map((_, i) => (
                <rect key={i} x="-3.5" y="-27" width="7" height="8" rx="1.5" transform={`rotate(${i * 45})`} />
              ))}
            </g>
            <path d="M60 170 H264" opacity=".35" strokeDasharray="3 5" />
          </g>
        )}
        {kind === "education" && (
          <g>
            <path d="M160 70 C140 58 108 58 88 66 V146 C108 138 140 138 160 150 Z" />
            <path d="M160 70 C180 58 212 58 232 66 V146 C212 138 180 138 160 150 Z" />
            <path d="M104 86 h36 M104 98 h30 M104 110 h34" opacity=".5" />
            <path d="M180 86 h36 M180 98 h28" opacity=".5" />
            <circle cx="214" cy="40" r="4" className="text-accent" fill="currentColor" stroke="none" />
            <circle cx="248" cy="58" r="3" opacity=".7" />
            <circle cx="190" cy="34" r="3" opacity=".7" />
            <path d="M214 40 L248 58 M214 40 L190 34 M190 34 L176 54" opacity=".45" />
            <path d="M232 112 l4 -10 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 Z" className="text-accent" stroke="currentColor" />
          </g>
        )}
        {(kind === "assistant" || kind === "academy") && (
          <g>
            <circle cx="160" cy="100" r="44" />
            <circle cx="160" cy="100" r="28" opacity=".5" strokeDasharray="2 4" />
            <circle cx="160" cy="100" r="6" className="text-accent" fill="currentColor" stroke="none" />
          </g>
        )}
      </svg>
    </div>
  );
}
