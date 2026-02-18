"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";

interface BeforeAfterProps {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt?: string;
  afterAlt?: string;
  className?: string;
}

export default function BeforeAfter({
  beforeSrc,
  afterSrc,
  beforeAlt = "Before cleaning",
  afterAlt = "After cleaning",
  className = "",
}: BeforeAfterProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsDragging(true);
      updatePosition(e.clientX);
    },
    [updatePosition],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      updatePosition(e.clientX);
    },
    [isDragging, updatePosition],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      setIsDragging(true);
      updatePosition(e.touches[0].clientX);
    },
    [updatePosition],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging) return;
      updatePosition(e.touches[0].clientX);
    },
    [isDragging, updatePosition],
  );

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-[4/3] overflow-hidden cursor-ew-resize select-none border-2 border-spartan-gold/30 ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
      role="slider"
      aria-valuenow={Math.round(sliderPosition)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Compare before and after images"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") {
          setSliderPosition((p) => Math.max(0, p - 5));
        } else if (e.key === "ArrowRight") {
          setSliderPosition((p) => Math.min(100, p + 5));
        }
      }}
    >
      {/* After image (full) */}
      <div className="absolute inset-0">
        <Image
          src={afterSrc}
          alt={afterAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        <div className="absolute bottom-4 right-4 bg-spartan-emerald/90 px-3 py-1 text-sm font-cinzel text-white tracking-wider">
          AFTER
        </div>
      </div>

      {/* Before image (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <Image
          src={beforeSrc}
          alt={beforeAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute bottom-4 left-4 bg-spartan-gold/90 px-3 py-1 text-sm font-cinzel text-spartan-black tracking-wider">
          BEFORE
        </div>
      </div>

      {/* Slider handle - Spear design */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-spartan-gold z-10 transition-shadow"
        style={{
          left: `${sliderPosition}%`,
          transform: "translateX(-50%)",
          boxShadow: isDragging ? "0 0 20px rgba(212, 175, 55, 0.8)" : "none",
        }}
      >
        {/* Spear handle grip */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 border-2 border-spartan-gold bg-spartan-black flex items-center justify-center">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="text-spartan-gold"
          >
            <path d="M6 10L2 6V14L6 10Z" fill="currentColor" />
            <path d="M14 10L18 6V14L14 10Z" fill="currentColor" />
          </svg>
        </div>
      </div>

      {/* Instruction overlay (fades out) */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500"
        style={{ opacity: isDragging ? 0 : 0.8 }}
      >
        <div className="bg-spartan-black/80 px-4 py-2 border border-spartan-gold/50 text-spartan-cream text-sm font-inter">
          Drag to compare
        </div>
      </div>
    </div>
  );
}
