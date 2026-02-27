'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface ImageSlideshowProps {
  images: string[];
  altTexts?: string[];
  autoPlayInterval?: number;
  className?: string;
}

export default function ImageSlideshow({ 
  images, 
  altTexts,
  autoPlayInterval = 5000,
  className = '' 
}: ImageSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  const goToNext = useCallback(() => {
    setDirection('next');
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToPrevious = useCallback(() => {
    setDirection('prev');
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Auto-advance slideshow
  useEffect(() => {
    if (isHovered || images.length <= 1) return;

    const interval = setInterval(() => {
      goToNext();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isHovered, images.length, autoPlayInterval, goToNext]);

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 'next' : 'prev');
    setCurrentIndex(index);
  };

  if (!images || images.length === 0) return null;

  return (
    <div 
      className={`relative w-full h-full group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Image Container with Ken Burns */}
      <div className="relative w-full h-[450px] sm:h-[550px] md:h-[600px] lg:h-[700px] overflow-hidden rounded-2xl border border-amber-900/20 shadow-2xl shadow-black/30">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentIndex 
                ? 'opacity-100 z-10 scale-100' 
                : 'opacity-0 z-0 scale-105'
            }`}
          >
            <div className={`w-full h-full ${index === currentIndex ? 'animate-ken-burns' : ''}`}>
              <Image
                src={image}
                alt={altTexts?.[index] || `Taketora Kyoto gallery image ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 80vw"
                priority={index === 0}
              />
            </div>
          </div>
        ))}
        
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-stone-950/20 z-20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/20 via-transparent to-stone-950/20 z-20 pointer-events-none" />

        {/* Image counter */}
        <div className="absolute top-4 right-4 z-30 bg-stone-950/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs text-[#F2E8DC]/80 font-light tracking-wider border border-amber-900/20">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Navigation Arrows - appear on hover */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 -translate-x-2"
            aria-label="Previous image"
          >
            <div className="bg-stone-950/50 hover:bg-stone-950/70 backdrop-blur-md text-[#D4AF37] p-3 sm:p-4 rounded-full transition-all duration-300 hover:scale-110 border border-amber-900/20 hover:border-amber-700/40 hover:shadow-gold">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 translate-x-2"
            aria-label="Next image"
          >
            <div className="bg-stone-950/50 hover:bg-stone-950/70 backdrop-blur-md text-[#D4AF37] p-3 sm:p-4 rounded-full transition-all duration-300 hover:scale-110 border border-amber-900/20 hover:border-amber-700/40 hover:shadow-gold">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </>
      )}

      {/* Progress dots with animated fill */}
      {images.length > 1 && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2.5">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="relative group/dot"
              aria-label={`Go to slide ${index + 1}`}
            >
              <span
                className={`block rounded-full transition-all duration-500 ${
                  index === currentIndex
                    ? 'w-8 h-2 bg-gradient-to-r from-[#D4AF37] to-amber-500 shadow-gold'
                    : 'w-2 h-2 bg-[#D4AF37]/30 hover:bg-[#D4AF37]/50 group-hover/dot:scale-125'
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
