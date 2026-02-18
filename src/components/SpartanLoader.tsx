"use client";

import { useEffect, useState } from "react";

interface SpartanLoaderProps {
  onComplete: () => void;
  skipForReturningUsers?: boolean;
}

export default function SpartanLoader({
  onComplete,
  skipForReturningUsers = true,
}: SpartanLoaderProps) {
  const [phase, setPhase] = useState<"shield" | "text" | "shatter" | "done">(
    "shield",
  );
  const [textRevealed, setTextRevealed] = useState(0);
  const text = "SPARTAN";

  useEffect(() => {
    // Check for reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onComplete();
      return;
    }

    // Skip for returning users
    if (skipForReturningUsers) {
      const hasVisited = localStorage.getItem("spartan-visited");
      if (hasVisited) {
        onComplete();
        return;
      }
      localStorage.setItem("spartan-visited", "true");
    }

    // Phase 1: Shield draws (1.2s)
    const shieldTimer = setTimeout(() => {
      setPhase("text");
    }, 1200);

    // Phase 2: Text reveals (0.8s)
    const textTimer = setTimeout(() => {
      const interval = setInterval(() => {
        setTextRevealed((prev) => {
          if (prev >= text.length) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 100);
    }, 1200);

    // Phase 3: Shatter (0.6s)
    const shatterTimer = setTimeout(() => {
      setPhase("shatter");
    }, 2200);

    // Complete
    const completeTimer = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 2800);

    return () => {
      clearTimeout(shieldTimer);
      clearTimeout(textTimer);
      clearTimeout(shatterTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete, skipForReturningUsers]);

  if (phase === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-[10000] bg-spartan-black flex items-center justify-center transition-opacity duration-500 ${
        phase === "shatter" ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="relative">
        {/* Shield SVG with draw animation */}
        <svg
          width="200"
          height="240"
          viewBox="0 0 200 240"
          className="text-spartan-gold"
        >
          {/* Shield shape */}
          <path
            d="M100 10 L180 50 L180 120 C180 180 100 230 100 230 C100 230 20 180 20 120 L20 50 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="shield-path"
            style={{
              strokeDasharray: 600,
              strokeDashoffset: phase === "shield" ? 0 : 600,
              transition: "stroke-dashoffset 1.2s ease-out",
            }}
          />

          {/* Inner details */}
          <path
            d="M100 30 L160 60 L160 115 C160 165 100 205 100 205 C100 205 40 165 40 115 L40 60 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.5"
            className="shield-inner"
            style={{
              strokeDasharray: 500,
              strokeDashoffset: phase === "shield" ? 0 : 500,
              transition: "stroke-dashoffset 1s ease-out 0.2s",
            }}
          />

          {/* Spartan Lambda (Λ) */}
          <path
            d="M100 70 L130 160 L120 160 L100 100 L80 160 L70 160 Z"
            fill="currentColor"
            className={`transition-opacity duration-500 ${
              phase === "shield" ? "opacity-0" : "opacity-100"
            }`}
            style={{ transitionDelay: "0.8s" }}
          />
        </svg>

        {/* Text reveal */}
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex gap-1">
          {text.split("").map((char, i) => (
            <span
              key={i}
              className="text-4xl font-cinzel font-bold tracking-[0.3em] transition-all duration-300"
              style={{
                color: i < textRevealed ? "#d4af37" : "transparent",
                textShadow:
                  i < textRevealed
                    ? "0 0 20px rgba(212, 175, 55, 0.5)"
                    : "none",
                transform:
                  i < textRevealed ? "translateY(0)" : "translateY(10px)",
              }}
            >
              {char}
            </span>
          ))}
        </div>

        {/* Gold particles */}
        {phase !== "shield" && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-spartan-gold rounded-full"
                style={{
                  left: `${50 + Math.cos((i / 12) * Math.PI * 2) * 80}%`,
                  top: `${50 + Math.sin((i / 12) * Math.PI * 2) * 80}%`,
                  animation: `particle-float ${1 + Math.random()}s ease-in-out infinite`,
                  animationDelay: `${i * 0.1}s`,
                  opacity: 0.6,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Skip button for impatient warriors */}
      <button
        onClick={onComplete}
        className="absolute bottom-8 right-8 text-spartan-cream/50 text-sm font-inter hover:text-spartan-gold transition-colors"
      >
        Skip
      </button>

      <style jsx>{`
        @keyframes particle-float {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translate(
                ${Math.random() * 20 - 10}px,
                ${Math.random() * 20 - 10}px
              )
              scale(1.2);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
