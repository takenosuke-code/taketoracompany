"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

type AnimationVariant = 
  | "fade-up" 
  | "fade-down" 
  | "fade-left" 
  | "fade-right" 
  | "scale" 
  | "blur"
  | "slide-up";

interface ScrollRevealSectionProps {
  children: ReactNode;
  className?: string;
  variant?: AnimationVariant;
  delay?: number;
  duration?: number;
  threshold?: number;
}

const variantStyles: Record<AnimationVariant, { hidden: string; visible: string }> = {
  "fade-up": {
    hidden: "opacity-0 translate-y-10",
    visible: "opacity-100 translate-y-0",
  },
  "fade-down": {
    hidden: "opacity-0 -translate-y-10",
    visible: "opacity-100 translate-y-0",
  },
  "fade-left": {
    hidden: "opacity-0 -translate-x-10",
    visible: "opacity-100 translate-x-0",
  },
  "fade-right": {
    hidden: "opacity-0 translate-x-10",
    visible: "opacity-100 translate-x-0",
  },
  scale: {
    hidden: "opacity-0 scale-95",
    visible: "opacity-100 scale-100",
  },
  blur: {
    hidden: "opacity-0 blur-sm scale-[0.98]",
    visible: "opacity-100 blur-0 scale-100",
  },
  "slide-up": {
    hidden: "opacity-0 translate-y-16",
    visible: "opacity-100 translate-y-0",
  },
};

export default function ScrollRevealSection({
  children,
  className = "",
  variant = "fade-up",
  delay = 0,
  duration = 800,
  threshold = 0.12,
}: ScrollRevealSectionProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const el = ref.current;

    // Use a lower effective threshold and rootMargin for better mobile detection
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        threshold: Math.min(threshold, 0.05),
        rootMargin: "100px 0px",
      }
    );

    observer.observe(el);

    // Fallback: if the element is already in or near the viewport on mount,
    // make it visible. This handles cases where IntersectionObserver
    // doesn't fire correctly on some mobile browsers.
    const checkVisibility = () => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      // Element is considered "near viewport" if it's within 150px of the visible area
      if (rect.top < windowHeight + 150 && rect.bottom > -150) {
        setIsVisible(true);
        observer.disconnect();
      }
    };

    // Check on mount after a short delay (allow layout to settle)
    const mountTimer = setTimeout(checkVisibility, 100);

    // Also listen for scroll as a fallback for mobile
    const handleScroll = () => {
      checkVisibility();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      clearTimeout(mountTimer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [threshold]);

  const styles = variantStyles[variant];

  return (
    <div
      ref={ref}
      className={`transition-all ease-out ${
        isVisible ? styles.visible : styles.hidden
      } ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
