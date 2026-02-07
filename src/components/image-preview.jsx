"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

// interface ImagePreviewProps {
//   src?: string;
//   alt?: string;
//   className?: string;
//   placeholder?: string;
//   onErrorChange?: (hasError: boolean) => void; // callback per aggiornare formErrors
// }

export function ImagePreview({
  src,
  alt = "Anteprima immagine",
  className,
  placeholder = "Nessuna immagine",
  onErrorChange,
}) {
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  // Reset errore quando cambia il src
  useEffect(() => {
    setHasError(false);
    setCurrentSrc(src);
  }, [src]);

  // Handler caricamento errore immagine
  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      if (onErrorChange) onErrorChange(true);
    }
  };

  // Handler caricamento immagine riuscito
  const handleLoad = () => {
    if (hasError) {
      setHasError(false);
      if (onErrorChange) onErrorChange(false);
    }
  };

  return (
    <div
      className={cn(
        "w-full text-muted-foreground overflow-hidden flex items-center justify-center border border-border rounded-lg min-h-16",
        className
      )}
    >
      <div className="w-3/5 flex items-center justify-center">
        {currentSrc && !hasError ? (
          <img
            src={currentSrc}
            alt={alt}
            className="w-full h-full object-cover object-center"
            onError={handleError}
            onLoad={handleLoad}
          />
        ) : (
          <span className="text-sm text-center px-2">{placeholder}</span>
        )}
      </div>
    </div>
  );
}
