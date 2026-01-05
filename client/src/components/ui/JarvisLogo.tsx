import { cn } from "@/lib/utils";
import logo from "@assets/FINAL_CODELYNE_LOGO_WHITE_1767597548677.png";

interface JarvisLogoProps {
  className?: string;
  heartbeat?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

export function JarvisLogo({ className, heartbeat = false, size = "md" }: JarvisLogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  const imageSizeClasses = {
    sm: "h-4",
    md: "h-5",
    lg: "h-8",
    xl: "h-12",
  };

  return (
    <div className={cn("relative flex items-center justify-center group", sizeClasses[size], className)}>
      {/* Outer Rotating Ring */}
      <div className="absolute inset-0 rounded-full border border-primary/30 border-t-transparent border-l-transparent animate-[spin_3s_linear_infinite]" />
      
      {/* Inner Counter-Rotating Ring */}
      <div className="absolute inset-1 rounded-full border border-primary/20 border-b-transparent border-r-transparent animate-[spin_5s_linear_infinite_reverse]" />

      {/* Heartbeat / Pulse Effect */}
      {heartbeat && (
        <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-20" />
      )}
      
      {/* Static Glow Background */}
      <div className={cn(
        "absolute inset-0 bg-primary/5 rounded-full blur-sm transition-all duration-300",
        heartbeat ? "animate-pulse" : "group-hover:bg-primary/10"
      )} />

      {/* Actual Logo Image */}
      <div className="relative z-10 flex items-center justify-center">
        <img 
          src={logo} 
          alt="Codelyne Logo" 
          className={cn("w-auto object-contain transition-transform duration-300", imageSizeClasses[size], heartbeat && "scale-110")} 
        />
      </div>

      {/* Tech accents */}
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0.5 h-1 bg-primary/50" />
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0.5 h-1 bg-primary/50" />
      <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-1 h-0.5 bg-primary/50" />
      <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-1 h-0.5 bg-primary/50" />
    </div>
  );
}
