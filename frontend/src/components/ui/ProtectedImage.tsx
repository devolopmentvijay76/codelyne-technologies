import { cn } from "@/lib/utils";
import placeholderLogo from "@assets/FINAL_CODELYNE_LOGO_WHITE_1767597548677.png";
import { useEffect, useState } from "react";

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
  const [imgSrc, setImgSrc] = useState(src);

  // If parent updates `src`, reflect it.
  useEffect(() => {
    setImgSrc(src);
  }, [src]);

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
        src={imgSrc}
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
        onError={() => {
          // When object-storage-backed URLs are unavailable locally, show a non-empty placeholder.
          setImgSrc((current) => (current === placeholderLogo ? current : placeholderLogo));
        }}
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
