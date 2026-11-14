import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative inline-flex select-none items-center justify-center gap-2 overflow-hidden rounded-full font-medium " +
  "transition-[background-color,color,border-color,box-shadow,transform] duration-300 ease-out-expo active:scale-[0.97] " +
  "disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-cta text-white hover:bg-cta-hover",
  secondary: "border border-cta/80 text-accent hover:border-cta hover:bg-cta hover:text-white",
  ghost: "text-muted hover:text-fg hover:bg-bg-2",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[15px]",
  lg: "h-12 px-7 text-[17px] sm:h-14 sm:px-8",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

type CommonProps = { variant?: Variant; size?: Size; className?: string; children: React.ReactNode };

/** Text that rolls up to a duplicate of itself on hover. */
function Roll({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-flex overflow-hidden">
      <span className="transition-transform duration-500 ease-out-expo group-hover/btn:-translate-y-full motion-reduce:transition-none">
        {children}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 translate-y-full transition-transform duration-500 ease-out-expo group-hover/btn:translate-y-0 motion-reduce:hidden"
      >
        {children}
      </span>
    </span>
  );
}

export function Button({
  variant,
  size,
  className,
  children,
  icon,
  ...props
}: CommonProps & { icon?: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={buttonClasses(variant, size, className)} {...props}>
      <Roll>{children}</Roll>
      {icon}
    </button>
  );
}

export function ButtonLink({
  variant,
  size,
  className,
  children,
  icon,
  external,
  ...props
}: CommonProps & { icon?: React.ReactNode; external?: boolean } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={buttonClasses(variant, size, className)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    >
      <Roll>{children}</Roll>
      {icon}
      {external && <span className="sr-only">(opens in a new tab)</span>}
    </a>
  );
}
