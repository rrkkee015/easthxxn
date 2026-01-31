"use client";

import { useCallback, useRef, useState } from "react";

export function MdxImage(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const ref = useCallback((node: HTMLImageElement | null) => {
    imgRef.current = node;
    if (node?.complete && node.naturalHeight > 0) {
      setLoaded(true);
    }
  }, []);

  return (
    <span className="not-prose relative my-6 block aspect-video w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-800">
      {!loaded && (
        <span className="absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-800" />
      )}
      <img
        {...props}
        ref={ref}
        loading="eager"
        onLoad={() => setLoaded(true)}
        className={`h-full w-full object-cover transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </span>
  );
}
