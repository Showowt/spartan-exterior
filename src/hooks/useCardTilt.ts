"use client";

import { useCallback, useRef, useState } from "react";

interface TiltState {
  rotateX: number;
  rotateY: number;
  glowX: number;
  glowY: number;
}

interface UseCardTiltReturn {
  tiltStyle: React.CSSProperties;
  glowStyle: React.CSSProperties;
  handlers: {
    onMouseMove: (e: React.MouseEvent<HTMLElement>) => void;
    onMouseLeave: () => void;
    onMouseEnter: () => void;
  };
}

export function useCardTilt(maxTilt: number = 10): UseCardTiltReturn {
  const [tilt, setTilt] = useState<TiltState>({
    rotateX: 0,
    rotateY: 0,
    glowX: 50,
    glowY: 50,
  });
  const [isHovering, setIsHovering] = useState(false);
  const rafRef = useRef<number | null>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      // Check for reduced motion
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const element = e.currentTarget;
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      // Calculate tilt (inverted for natural feel)
      const rotateX = (mouseY / (rect.height / 2)) * -maxTilt;
      const rotateY = (mouseX / (rect.width / 2)) * maxTilt;

      // Calculate glow position (0-100%)
      const glowX = ((e.clientX - rect.left) / rect.width) * 100;
      const glowY = ((e.clientY - rect.top) / rect.height) * 100;

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        setTilt({ rotateX, rotateY, glowX, glowY });
      });
    },
    [maxTilt],
  );

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    setTilt({ rotateX: 0, rotateY: 0, glowX: 50, glowY: 50 });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const tiltStyle: React.CSSProperties = {
    transform: isHovering
      ? `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(1.02, 1.02, 1.02)`
      : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
    transition: isHovering
      ? "transform 0.1s ease-out"
      : "transform 0.3s ease-out",
    transformStyle: "preserve-3d" as const,
  };

  const glowStyle: React.CSSProperties = {
    background: isHovering
      ? `radial-gradient(circle at ${tilt.glowX}% ${tilt.glowY}%, rgba(212, 175, 55, 0.3) 0%, transparent 60%)`
      : "none",
    transition: "background 0.1s ease-out",
  };

  return {
    tiltStyle,
    glowStyle,
    handlers: {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
      onMouseEnter: handleMouseEnter,
    },
  };
}
