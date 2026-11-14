import { BrandIcon, techIcon } from "@/lib/brand-icons";
import { cn } from "@/lib/utils";

export function TechBadge({ name, className }: { name: string; className?: string }) {
  const icon = techIcon[name];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-bg px-2.5 py-1 text-[12px] font-medium text-muted",
        className,
      )}
    >
      {icon && <BrandIcon name={icon} className="size-3" />}
      {name}
    </span>
  );
}
