"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useKonami } from "@/hooks/useKonami";

interface FallingEmoji {
  id: number;
  emoji: string;
  x: number;
  delay: number;
  duration: number;
  rotation: number;
}

export default function KonamiCode() {
  const [isActivated, setIsActivated] = useState(false);
  const [emojis, setEmojis] = useState<FallingEmoji[]>([]);
  const [showFlash, setShowFlash] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const triggerEasterEgg = useCallback(() => {
    if (isActivated) return;

    setIsActivated(true);
    setShowFlash(true);

    // Log to console
    console.log(
      "%c⚔️ THIS IS SPARTA! ⚔️",
      "color: #d4af37; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);",
    );
    console.log(
      "%cYou have unlocked the Spartan secret. Call (702) 509-3854 for a 10% warrior discount.",
      "color: #10b981; font-size: 14px;",
    );

    // Create falling emojis
    const spartanEmojis = ["⚔️", "🛡️", "🗡️", "⚔️", "🛡️", "🏛️", "🦁", "👑"];
    const newEmojis: FallingEmoji[] = [];

    for (let i = 0; i < 50; i++) {
      newEmojis.push({
        id: i,
        emoji: spartanEmojis[Math.floor(Math.random() * spartanEmojis.length)],
        x: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 3 + Math.random() * 2,
        rotation: Math.random() * 720 - 360,
      });
    }

    setEmojis(newEmojis);

    // Hide flash after animation
    setTimeout(() => setShowFlash(false), 200);

    // Clear emojis after they fall
    setTimeout(() => {
      setEmojis([]);
      setIsActivated(false);
    }, 6000);
  }, [isActivated]);

  useKonami(triggerEasterEgg);

  // Gold explosion effect
  useEffect(() => {
    if (!isActivated || !containerRef.current) return;

    const container = containerRef.current;
    const particles: HTMLDivElement[] = [];

    // Create explosion particles
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement("div");
      const angle = (i / 30) * Math.PI * 2;
      const velocity = 200 + Math.random() * 100;
      const size = 4 + Math.random() * 8;

      particle.style.cssText = `
        position: fixed;
        left: 50%;
        top: 50%;
        width: ${size}px;
        height: ${size}px;
        background: linear-gradient(135deg, #d4af37, #f4d03f);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        animation: explode-${i} 1s ease-out forwards;
      `;

      // Create unique keyframes for each particle
      const style = document.createElement("style");
      style.textContent = `
        @keyframes explode-${i} {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(
              calc(-50% + ${Math.cos(angle) * velocity}px),
              calc(-50% + ${Math.sin(angle) * velocity}px)
            ) scale(0);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);

      container.appendChild(particle);
      particles.push(particle);

      // Clean up after animation
      setTimeout(() => {
        particle.remove();
        style.remove();
      }, 1000);
    }
  }, [isActivated]);

  return (
    <>
      {/* Flash overlay */}
      {showFlash && (
        <div
          className="fixed inset-0 z-[9998] bg-spartan-gold pointer-events-none"
          style={{
            animation: "flash 0.2s ease-out forwards",
          }}
        />
      )}

      {/* Explosion container */}
      <div
        ref={containerRef}
        className="fixed inset-0 pointer-events-none z-[9999]"
      />

      {/* Falling emojis */}
      {emojis.map((emoji) => (
        <div
          key={emoji.id}
          className="fixed text-3xl md:text-4xl pointer-events-none z-[9997]"
          style={{
            left: `${emoji.x}%`,
            top: "-50px",
            animation: `fall ${emoji.duration}s linear ${emoji.delay}s forwards`,
            transform: `rotate(${emoji.rotation}deg)`,
          }}
        >
          {emoji.emoji}
        </div>
      ))}

      <style jsx>{`
        @keyframes flash {
          0% {
            opacity: 0.8;
          }
          100% {
            opacity: 0;
          }
        }
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}
