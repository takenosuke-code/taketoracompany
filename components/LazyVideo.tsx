"use client";

import { useEffect, useRef, useState } from "react";

interface LazyVideoProps {
  src: string;
  className?: string;
  /** Optional poster image shown until the video element mounts. */
  poster?: string;
  /** Distance from viewport (in px) at which to start loading. */
  rootMargin?: string;
}

/**
 * Renders a placeholder div until the user scrolls within rootMargin of it,
 * then mounts a real <video> element with autoplay/loop/muted. Use for
 * below-the-fold videos to keep them out of the initial network payload.
 */
export default function LazyVideo({
  src,
  className,
  poster,
  rootMargin = "200px",
}: LazyVideoProps) {
  const placeholderRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (shouldLoad) return;
    const node = placeholderRef.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [shouldLoad, rootMargin]);

  if (shouldLoad) {
    return (
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster={poster}
        className={className}
      >
        <source src={src} type="video/mp4" />
      </video>
    );
  }

  return (
    <div
      ref={placeholderRef}
      className={className}
      style={
        poster
          ? {
              backgroundImage: `url(${poster})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
      role="presentation"
    />
  );
}
