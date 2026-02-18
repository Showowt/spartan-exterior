"use client";

import { useEffect, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface TextRevealProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  staggerMs?: number;
  gradient?: boolean;
}

export default function TextReveal({
  text,
  className = "",
  as: Component = "span",
  staggerMs = 30,
  gradient = false,
}: TextRevealProps) {
  const [ref, isVisible] = useScrollReveal<HTMLElement>({ threshold: 0.3 });
  const [revealedCount, setRevealedCount] = useState(0);
  const characters = text.split("");

  useEffect(() => {
    if (!isVisible) {
      setRevealedCount(0);
      return;
    }

    // Check for reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealedCount(characters.length);
      return;
    }

    let count = 0;
    const interval = setInterval(() => {
      count++;
      setRevealedCount(count);
      if (count >= characters.length) {
        clearInterval(interval);
      }
    }, staggerMs);

    return () => clearInterval(interval);
  }, [isVisible, characters.length, staggerMs]);

  const baseClass = gradient
    ? "bg-gradient-to-r from-spartan-gold-light via-spartan-gold to-spartan-bronze bg-clip-text text-transparent"
    : "";

  return (
    <Component
      ref={ref as React.RefObject<HTMLHeadingElement>}
      className={`${baseClass} ${className}`}
      aria-label={text}
    >
      {characters.map((char, index) => (
        <span
          key={index}
          className="inline-block transition-all duration-300"
          style={{
            opacity: index < revealedCount ? 1 : 0,
            transform:
              index < revealedCount
                ? "translateY(0) rotateX(0deg)"
                : "translateY(20px) rotateX(-45deg)",
            transitionDelay: `${index * 10}ms`,
          }}
          aria-hidden="true"
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </Component>
  );
}
