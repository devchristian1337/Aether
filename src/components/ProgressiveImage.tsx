import { useState, useEffect } from "react";
import { Box, Skeleton } from "@mui/material";

interface ProgressiveImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
}

export default function ProgressiveImage({
  src,
  alt,
  width = "auto",
  height = "auto",
  className,
}: ProgressiveImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>("");

  useEffect(() => {
    const img = new Image();
    img.src = src;

    img.onload = () => {
      setCurrentSrc(src);
      setIsLoading(false);
    };

    img.onerror = () => {
      setError(true);
      setIsLoading(false);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  if (error) {
    return (
      <Box
        sx={{
          width,
          height,
          bgcolor: "rgba(0, 0, 0, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 1,
          color: "error.main",
          fontSize: "0.75rem",
        }}
      >
        Failed to load image
      </Box>
    );
  }

  return (
    <Box sx={{ position: "relative", width, height }}>
      {isLoading && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            borderRadius: 1,
          }}
        />
      )}
      {currentSrc && (
        <img
          src={currentSrc}
          alt={alt}
          className={className}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "4px",
            opacity: isLoading ? 0 : 1,
            transition: "opacity 0.3s ease-in-out",
          }}
        />
      )}
    </Box>
  );
}
