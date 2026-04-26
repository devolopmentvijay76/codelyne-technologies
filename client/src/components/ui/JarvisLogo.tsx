import { cn } from "@/lib/utils";
import logo from "@assets/FINAL_CODELYNE_LOGO_WHITE_1767597548677.png";

interface JarvisLogoProps {
  className?: string;
  heartbeat?: boolean; // Kept for backward compat but effectively disabled or simplified
  size?: "sm" | "md" | "lg" | "xl";
}

export function JarvisLogo({ className, heartbeat = false, size = "md" }: JarvisLogoProps) {
  // Increased base sizes for "BIGGER" request
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-14 h-14", // Bigger default for navbar
    lg: "w-20 h-20",
    xl: "w-32 h-32",
  };

  return (
    <div className={cn("relative flex items-center justify-center select-none", sizeClasses[size], className)}>
      {/* Clean Circular Container with simpler styling */}
      <div className={cn(
        "relative z-10 w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-primary/10 border border-white/10 shadow-lg",
        heartbeat && "ring-2 ring-primary/20 animate-pulse" // Subtle pulse only if requested
      )}>
        <img 
          src={logo} 
          alt="Codelyne Technologies Logo" 
          // Scale increased to 1.8 to emphasize the "C" as requested previously
          // Translate X slightly to center the "C" perfectly in the circle
          className="w-full h-full object-cover scale-[1.8] translate-x-[2%]" 
        />
      </div>
    </div>
  );
}
