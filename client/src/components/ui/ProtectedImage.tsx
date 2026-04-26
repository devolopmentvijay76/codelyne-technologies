import { cn } from "@/lib/utils";

interface ProtectedImageProps {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
  decoding?: "async" | "sync" | "auto";
  width?: number | string;
  height?: number | string;
}

export function ProtectedImage({
  src,
  alt,
  className,
  wrapperClassName,
  loading = "lazy",
  fetchPriority,
  decoding = "async",
  width,
  height,
}: ProtectedImageProps) {
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
    return false;
  };

  return (
    <div 
      className={cn("relative overflow-hidden", wrapperClassName)}
      onContextMenu={handleContextMenu}
    >
      <img
        src={src}
        alt={alt}
        className={cn("select-none", className)}
        onContextMenu={handleContextMenu}
        onDragStart={handleDragStart}
        draggable={false}
        loading={loading}
        decoding={decoding}
        {...(fetchPriority ? { fetchPriority } : {})}
        {...(width !== undefined ? { width } : {})}
        {...(height !== undefined ? { height } : {})}
        style={{
          WebkitUserSelect: "none",
          userSelect: "none",
          WebkitTouchCallout: "none",
        }}
      />
      <div 
        className="absolute inset-0 z-10" 
        onContextMenu={handleContextMenu}
        style={{ background: "transparent" }}
      />
    </div>
  );
}
