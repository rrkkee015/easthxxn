"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";

interface MdxImageProps {
  src: string;
  alt?: string;
}

export function MdxImage(props: MdxImageProps) {
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
      <Image
        ref={ref}
        src={props.src}
        alt={props.alt ?? ""}
        fill
        sizes="(max-width: 672px) 100vw, 672px"
        onLoad={() => setLoaded(true)}
        className={`object-cover transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </span>
  );
}
