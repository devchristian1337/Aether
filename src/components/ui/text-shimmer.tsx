import React from "react";
import { cn } from "../../lib/utils";

interface TextShimmerProps {
  children: string;
  as?: React.ElementType;
  className?: string;
  duration?: number;
  spread?: number;
}

export function TextShimmer({
  children,
  as: Component = "div",
  className,
  duration = 2,
  spread = 2,
}: TextShimmerProps) {
  const dynamicSpread = React.useMemo(() => {
    return children.length * spread;
  }, [children, spread]);

  return (
    <Component
      className={cn(
        "relative inline-block bg-[length:250%_100%,auto] bg-clip-text animate-shimmer",
        "text-transparent [--base-color:#a1a1aa] [--base-gradient-color:#000]",
        "[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))] [background-repeat:no-repeat,padding-box]",
        "dark:[--base-color:#71717a] dark:[--base-gradient-color:#ffffff] dark:[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))]",
        className
      )}
      style={
        {
          "--spread": `${dynamicSpread}px`,
          "--duration": `${duration}s`,
          backgroundImage: `var(--bg), linear-gradient(var(--base-color), var(--base-color))`,
          animationDuration: `${duration}s`,
        } as React.CSSProperties
      }
    >
      {children}
    </Component>
  );
}
