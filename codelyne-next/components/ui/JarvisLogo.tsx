import { cn } from "@/lib/utils";

interface JarvisLogoProps {
  className?: string;
  heartbeat?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

const LOGO_SRC = "/attached_assets/FINAL_CODELYNE_LOGO_WHITE_1767597548677.png";

export function JarvisLogo({ className, heartbeat = false, size = "md" }: JarvisLogoProps) {
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-14 h-14",
    lg: "w-20 h-20",
    xl: "w-32 h-32",
  };

  return (
    <div className={cn("relative flex items-center justify-center select-none", sizeClasses[size], className)}>
      <div className={cn(
        "relative z-10 w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-primary/10 border border-white/10 shadow-lg",
        heartbeat && "ring-2 ring-primary/20 animate-pulse"
      )}>
        <img
          src={LOGO_SRC}
          alt="Codelyne Technologies Logo"
          className="w-full h-full object-cover scale-[1.8] translate-x-[2%]"
        />
      </div>
    </div>
  );
}
