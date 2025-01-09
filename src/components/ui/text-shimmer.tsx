import { cn } from "../../lib/utils";

interface TextShimmerProps {
  children: string;
  className?: string;
  duration?: number;
}

export function TextShimmer({
  children,
  className,
  duration = 1,
}: TextShimmerProps) {
  return (
    <span
      className={cn(
        "relative inline-block text-transparent bg-clip-text animate-shimmer",
        className
      )}
      style={{
        backgroundImage: "linear-gradient(90deg, #71717a 0%, #18181b 50%, #71717a 100%)",
        backgroundSize: "200% auto",
        animation: `shimmer ${duration}s linear infinite`,
      }}
    >
      {children}
    </span>
  );
}
