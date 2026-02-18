"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

export default function GoldSparks() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) {
      return; // Don't run animation for users who prefer reduced motion
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Reduce particle count on mobile for performance
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 25 : 60;

    const colors = [
      "#d4af37", // Gold
      "#f4d03f", // Light gold
      "#b8960c", // Dark gold
      "#cd7f32", // Bronze
      "#ffd700", // Bright gold
      "#10b981", // Emerald (occasional)
    ];

    const createParticle = (): Particle => {
      const startFromSide = Math.random() > 0.5;
      return {
        x: startFromSide
          ? Math.random() > 0.5
            ? 0
            : canvas.width
          : Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.7,
        vx: (Math.random() - 0.5) * 1.5,
        vy: Math.random() * 0.5 + 0.2,
        life: 0,
        maxLife: Math.random() * 150 + 100,
        size: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    };

    // Initialize particles (fewer on mobile)
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push(createParticle());
    }

    const animate = () => {
      if (!isAnimatingRef.current) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle, index) => {
        particle.life++;

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Add slight wave motion
        particle.x += Math.sin(particle.life * 0.02) * 0.3;

        // Calculate opacity based on life
        const lifeRatio = particle.life / particle.maxLife;
        const opacity =
          lifeRatio < 0.1
            ? lifeRatio * 10
            : lifeRatio > 0.7
              ? (1 - lifeRatio) * 3.33
              : 1;

        // Draw spark with glow
        ctx.save();
        ctx.globalAlpha = opacity * 0.8;

        // Outer glow
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size * 3,
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(0.5, particle.color + "40");
        gradient.addColorStop(1, "transparent");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Inner bright core
        ctx.globalAlpha = opacity;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Brightest center
        ctx.fillStyle = "#ffffff";
        ctx.globalAlpha = opacity * 0.5;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 0.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // Reset particle if dead or out of bounds
        if (
          particle.life >= particle.maxLife ||
          particle.y > canvas.height ||
          particle.x < -50 ||
          particle.x > canvas.width + 50
        ) {
          particlesRef.current[index] = createParticle();
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    isAnimatingRef.current = true;
    animate();

    // Page visibility handler - pause when tab is hidden
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isAnimatingRef.current = false;
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      } else {
        isAnimatingRef.current = true;
        animate();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Reduced motion media query listener
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        isAnimatingRef.current = false;
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else {
        isAnimatingRef.current = true;
        animate();
      }
    };
    motionQuery.addEventListener("change", handleMotionChange);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      motionQuery.removeEventListener("change", handleMotionChange);
      isAnimatingRef.current = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-10"
      style={{ mixBlendMode: "screen" }}
      aria-hidden="true"
    />
  );
}
