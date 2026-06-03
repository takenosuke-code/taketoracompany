"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export default function LoadingScreen() {
  const [phase, setPhase] = useState<"loading" | "reveal" | "done">("loading");
  const [progress, setProgress] = useState(0);
  const [videoReady, setVideoReady] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  // Check sessionStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasVisited = sessionStorage.getItem("taketora-visited");
      if (!hasVisited) {
        setShouldShow(true);
        // Prevent body scroll while loading
        document.body.style.overflow = "hidden";
      } else {
        setPhase("done");
      }
    }
  }, []);

  // Deterministic progress: 0 → 92 over ~2200ms with ease-out cubic.
  // Cap at 92 until video ready or fallback fires, so the bar never
  // sits visibly motionless waiting on a slow video load.
  useEffect(() => {
    if (!shouldShow) return;

    const startedAt = Date.now();
    const DURATION = 1200;
    const CAP_BEFORE_READY = 92;

    progressInterval.current = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const t = Math.min(elapsed / DURATION, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      const target = eased * CAP_BEFORE_READY;
      setProgress((prev) => (target > prev ? target : prev));
    }, 30);

    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, [shouldShow]);

  // When video is ready, push progress to 100 quickly.
  useEffect(() => {
    if (videoReady && shouldShow) {
      const quickFinish = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(quickFinish);
            return 100;
          }
          return Math.min(prev + 4, 100);
        });
      }, 20);
      return () => clearInterval(quickFinish);
    }
  }, [videoReady, shouldShow]);

  // Trigger reveal when progress hits 100
  useEffect(() => {
    if (progress >= 100 && phase === "loading") {
      // Small delay before reveal starts
      setTimeout(() => {
        setPhase("reveal");
      }, 400);
    }
  }, [progress, phase]);

  // Handle reveal completion
  useEffect(() => {
    if (phase === "reveal") {
      const timer = setTimeout(() => {
        setPhase("done");
        document.body.style.overflow = "";
        sessionStorage.setItem("taketora-visited", "true");
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // Fallback: auto-complete after 1.5s even if the video never loads, so the
  // splash never blocks the hero (and therefore LCP) on a slow connection.
  useEffect(() => {
    if (!shouldShow) return;
    const fallback = setTimeout(() => {
      setVideoReady(true);
    }, 1500);
    return () => clearTimeout(fallback);
  }, [shouldShow]);

  const handleVideoReady = useCallback(() => {
    setVideoReady(true);
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        phase === "reveal"
          ? "opacity-0 scale-105"
          : "opacity-100 scale-100"
      }`}
      aria-hidden="true"
    >
      {/* Video Background */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          onCanPlayThrough={handleVideoReady}
          onLoadedData={handleVideoReady}
          className="w-full h-full object-cover scale-110"
          style={{
            animation: "loadingKenBurns 8s ease-in-out infinite alternate",
          }}
        >
          <source
            src="https://raemfaxgstoezqgbtdry.supabase.co/storage/v1/object/public/site-assets/Taketorahorizontal.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* Overlays */}
      <div className="absolute inset-0 bg-stone-950/80" />
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-stone-950/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-stone-950/40 via-transparent to-stone-950/40" />

      {/* Decorative particles / floating gold dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="loading-particle"
            style={{
              left: `${8 + Math.random() * 84}%`,
              top: `${8 + Math.random() * 84}%`,
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Center Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4">
        {/* Decorative ring */}
        <div className="loading-ring-outer absolute w-52 h-52 sm:w-64 sm:h-64" />
        <div className="loading-ring-inner absolute w-44 h-44 sm:w-56 sm:h-56" />

        {/* Brand wordmark (decorative splash — not the page heading) */}
        <div
          role="img"
          aria-label="TAKETORA"
          className="font-serif text-4xl sm:text-5xl md:text-7xl tracking-[0.3em] text-shimmer drop-shadow-2xl mb-3 loading-text-entrance"
          style={{ animationDelay: "0.3s" }}
        >
          TAKETORA
        </div>

        {/* Subtitle */}
        <div
          className="flex items-center gap-3 sm:gap-4 mb-8 loading-text-entrance"
          style={{ animationDelay: "0.6s" }}
        >
          <div className="h-px w-8 sm:w-14 bg-gradient-to-r from-transparent to-[#D4AF37]/60" />
          <p className="text-xs sm:text-sm font-light tracking-[0.35em] text-[#D4AF37]/80 uppercase">
            京都 · 東山
          </p>
          <div className="h-px w-8 sm:w-14 bg-gradient-to-l from-transparent to-[#D4AF37]/60" />
        </div>

        {/* Progress bar */}
        <div
          className="w-48 sm:w-64 loading-text-entrance"
          style={{ animationDelay: "0.9s" }}
        >
          {/* Track */}
          <div className="relative h-[1px] bg-[#D4AF37]/15 rounded-full overflow-hidden">
            {/* Fill */}
            <div
              className="absolute left-0 top-0 h-full rounded-full transition-all duration-100 ease-out"
              style={{
                width: `${progress}%`,
                background:
                  "linear-gradient(90deg, #D4AF37 0%, #F2E8DC 50%, #D4AF37 100%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 2s linear infinite",
              }}
            />
          </div>

          {/* Percentage / status text */}
          <div className="flex justify-between items-center mt-3">
            <span className="text-[10px] text-[#F2E8DC]/30 tracking-[0.2em] uppercase font-light">
              Loading
            </span>
            <span className="text-[10px] text-[#D4AF37]/50 tracking-widest font-light tabular-nums">
              {Math.min(Math.round(progress), 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Bottom decorative lines */}
      <div className="absolute bottom-0 left-0 right-0 h-px">
        <div
          className="h-full bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent transition-all duration-300"
          style={{ opacity: progress > 10 ? 1 : 0 }}
        />
      </div>

      {/* Corner decorations */}
      <div className="absolute top-6 left-6 w-10 h-10 border-t border-l border-[#D4AF37]/20 rounded-tl-lg loading-corner-entrance" />
      <div
        className="absolute top-6 right-6 w-10 h-10 border-t border-r border-[#D4AF37]/20 rounded-tr-lg loading-corner-entrance"
        style={{ animationDelay: "0.1s" }}
      />
      <div
        className="absolute bottom-6 left-6 w-10 h-10 border-b border-l border-[#D4AF37]/20 rounded-bl-lg loading-corner-entrance"
        style={{ animationDelay: "0.2s" }}
      />
      <div
        className="absolute bottom-6 right-6 w-10 h-10 border-b border-r border-[#D4AF37]/20 rounded-br-lg loading-corner-entrance"
        style={{ animationDelay: "0.3s" }}
      />
    </div>
  );
}
