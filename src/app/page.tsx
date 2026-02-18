"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useScrollReveal, useStaggerReveal } from "@/hooks/useScrollReveal";
import { useParallax } from "@/hooks/useParallax";
import { useCardTilt } from "@/hooks/useCardTilt";

// Dynamic imports for client components with loading states
const GoldSparks = dynamic(() => import("@/components/GoldSparks"), {
  ssr: false,
  loading: () => null,
});

const LeonidasChat = dynamic(() => import("@/components/LeonidasChat"), {
  ssr: false,
  loading: () => (
    <div
      className="fixed bottom-6 right-6 z-50 w-16 h-16 btn-spartan opacity-50 flex items-center justify-center animate-pulse"
      aria-hidden="true"
    />
  ),
});

const MobileNav = dynamic(() => import("@/components/MobileNav"), {
  ssr: false,
});

// Cinematic components
const SpartanLoader = dynamic(() => import("@/components/SpartanLoader"), {
  ssr: false,
});

const ScrollProgress = dynamic(() => import("@/components/ScrollProgress"), {
  ssr: false,
});

const KonamiCode = dynamic(() => import("@/components/KonamiCode"), {
  ssr: false,
});

const ConsoleEasterEgg = dynamic(
  () => import("@/components/ConsoleEasterEgg"),
  {
    ssr: false,
  },
);

const TextReveal = dynamic(() => import("@/components/TextReveal"), {
  ssr: false,
  loading: () => <span className="opacity-0">Loading...</span>,
});

const AnimatedCounter = dynamic(() => import("@/components/AnimatedCounter"), {
  ssr: false,
});

// ═══════════════════════════════════════════════════════════════
// SPARTAN EXTERIOR SERVICES — CINEMATIC LANDING PAGE
// "We're Here to Help — Clear Views, Cleaner Living"
// ═══════════════════════════════════════════════════════════════

// Service icon component for consistency
function WindowIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
      />
    </svg>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
      />
    </svg>
  );
}

function SprayIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
      />
    </svg>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
      />
    </svg>
  );
}

function LightBulbIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
      />
    </svg>
  );
}

interface Service {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  price: string;
  packages?: string[];
  Icon: React.ComponentType<{ className?: string }>;
}

const services: Service[] = [
  {
    id: "window-cleaning",
    title: "Window Cleaning",
    subtitle: "Interior & Exterior",
    description:
      "Crystal-clear views with our full-system approach. We clean the glass, frames, tracks, seals, and screens — not just the surface.",
    price: "$8 - $10 per pane",
    packages: [
      "1-Story Exterior: $200",
      "1-Story Full Service: $250",
      "2-Story Exterior: $300",
      "2-Story Full Service: $350",
      "3-Story Exterior: $400",
      "3-Story Full Service: $450",
    ],
    Icon: WindowIcon,
  },
  {
    id: "solar-panel",
    title: "Solar Panel Cleaning",
    subtitle: "Maximize Energy Output",
    description:
      "Dirty panels lose up to 30% efficiency. Our gentle cleaning restores peak performance without damaging your investment.",
    price: "$10 per panel",
    Icon: SunIcon,
  },
  {
    id: "pressure-washing",
    title: "Pressure Washing",
    subtitle: "High-Power Clean",
    description:
      "Blast away years of dirt, grime, mold, and stains from driveways, patios, walkways, and exterior walls.",
    price: "Starting at $150",
    Icon: SprayIcon,
  },
  {
    id: "soft-wash",
    title: "Soft Wash",
    subtitle: "Gentle Power",
    description:
      "Perfect for stucco, painted surfaces, and roofs. Low-pressure cleaning with specialized solutions for delicate materials.",
    price: "$200 per side",
    Icon: SparklesIcon,
  },
  {
    id: "permanent-lighting",
    title: "Permanent Lighting",
    subtitle: "Year-Round Illumination",
    description:
      "Professional LED lighting installations that transform your home for holidays, events, or everyday elegance.",
    price: "Starting at $1,300",
    Icon: LightBulbIcon,
  },
  {
    id: "solar-screens",
    title: "Solar Screens",
    subtitle: "Screen Cleaning",
    description:
      "Restore airflow and appearance with professional solar screen cleaning. We remove dust, debris, and buildup for better visibility and energy efficiency.",
    price: "$10 per screen",
    Icon: WindowIcon,
  },
];

const trustSignals = [
  { label: "Locally Owned", icon: "🏠" },
  { label: "Free Estimates", icon: "📋" },
  { label: "5-Star Reviews", icon: "⭐" },
  { label: "Satisfaction Guarantee", icon: "✅" },
  { label: "Eco-Friendly", icon: "🌿" },
];

const serviceAreas = [
  "North Las Vegas",
  "Henderson",
  "Boulder City",
  "Las Vegas Valley",
];

// 3D Tilt Service Card Component
function ServiceCard({ service }: { service: Service }) {
  const { tiltStyle, glowStyle, handlers } = useCardTilt(8);

  return (
    <article
      className="card-spartan card-animated-border p-8 group relative overflow-hidden"
      style={tiltStyle}
      {...handlers}
    >
      {/* Glow overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-200"
        style={glowStyle}
      />

      {/* Icon */}
      <div className="w-16 h-16 flex items-center justify-center bg-spartan-gold/10 border border-spartan-gold/30 text-spartan-gold mb-6 group-hover:bg-spartan-gold group-hover:text-spartan-black transition-all duration-300 relative z-10">
        <service.Icon className="w-8 h-8" />
      </div>

      {/* Content */}
      <h3 className="font-display text-2xl font-bold text-spartan-cream mb-2 relative z-10">
        {service.title}
      </h3>
      <p className="text-spartan-gold text-sm mb-4 relative z-10">
        {service.subtitle}
      </p>
      <p className="text-spartan-cream/60 text-sm leading-relaxed mb-6 relative z-10">
        {service.description}
      </p>

      {/* Price */}
      <div className="border-t border-spartan-gold/20 pt-4 relative z-10">
        <span className="text-spartan-gold font-display font-bold text-xl">
          {service.price}
        </span>
        {service.packages && (
          <div className="mt-3 space-y-1">
            {service.packages.slice(0, 3).map((pkg) => (
              <p key={pkg} className="text-xs text-spartan-cream/50">
                {pkg}
              </p>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export default function Home() {
  const currentYear = new Date().getFullYear();
  const [isLoaded, setIsLoaded] = useState(false);
  const parallax = useParallax(600);

  // Scroll reveal refs for sections
  const [servicesRef, servicesVisible] = useScrollReveal<HTMLElement>({
    threshold: 0.1,
  });
  const [aboutRef, aboutVisible] = useScrollReveal<HTMLElement>({
    threshold: 0.15,
  });
  const [areasRef, areasVisible] = useScrollReveal<HTMLElement>({
    threshold: 0.2,
  });
  const [ctaRef, ctaVisible] = useScrollReveal<HTMLElement>({ threshold: 0.3 });

  // Staggered reveals for service cards
  const serviceCardVisible = useStaggerReveal(
    servicesVisible,
    services.length,
    100,
  );
  const areaChipVisible = useStaggerReveal(
    areasVisible,
    serviceAreas.length,
    80,
  );

  return (
    <>
      {/* Cinematic Loading Sequence */}
      {!isLoaded && <SpartanLoader onComplete={() => setIsLoaded(true)} />}

      <main
        className={`min-h-screen bg-[#050505] overflow-x-hidden transition-opacity duration-500 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Easter Eggs */}
        <KonamiCode />
        <ConsoleEasterEgg />

        {/* Scroll Progress Indicator */}
        <ScrollProgress />

        {/* Skip to Content Link - Accessibility */}
        <a href="#services" className="skip-link">
          Skip to content
        </a>

        {/* Gold Sparks Particle Effect */}
        <GoldSparks />

        {/* Navigation */}
        <nav
          className="fixed top-0 left-0 right-0 z-40 bg-[#050505]/90 backdrop-blur-md border-b border-spartan-gold/20"
          aria-label="Main navigation"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3">
                <div className="w-14 h-14 relative">
                  <Image
                    src="/spartan-logo.png"
                    alt="Spartan Exterior Services"
                    fill
                    className="object-contain"
                    sizes="56px"
                    priority
                  />
                </div>
                <div className="hidden sm:block">
                  <span className="font-display text-spartan-gold text-lg font-bold tracking-wider">
                    SPARTAN
                  </span>
                  <span className="block text-xs text-spartan-cream/60 tracking-widest">
                    EXTERIOR SERVICES
                  </span>
                </div>
              </Link>

              {/* Desktop Nav */}
              <div className="hidden md:flex items-center gap-8">
                <a
                  href="#services"
                  className="text-spartan-cream/80 hover:text-spartan-gold transition-colors text-sm tracking-wide"
                >
                  Services
                </a>
                <a
                  href="#about"
                  className="text-spartan-cream/80 hover:text-spartan-gold transition-colors text-sm tracking-wide"
                >
                  About
                </a>
                <a
                  href="#areas"
                  className="text-spartan-cream/80 hover:text-spartan-gold transition-colors text-sm tracking-wide"
                >
                  Service Areas
                </a>
                <a
                  href="tel:7025093854"
                  className="btn-spartan px-6 py-3 text-sm"
                >
                  (702) 509-3854
                </a>
              </div>

              {/* Mobile Nav */}
              <div className="md:hidden flex items-center gap-3">
                <a
                  href="tel:7025093854"
                  className="btn-spartan px-4 py-2 text-xs"
                >
                  Call Now
                </a>
                <MobileNav />
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section
          className="relative min-h-screen flex items-center justify-center pt-20"
          aria-label="Welcome to Spartan Exterior Services"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#050505] to-[#0a0a0a]">
            {/* Spartan Shield Background Pattern - Parallax Layers */}
            <div className="absolute inset-0 opacity-5" aria-hidden="true">
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border-[40px] border-spartan-gold/30 rounded-full transition-transform duration-100"
                style={{
                  transform: `translate(-50%, calc(-50% + ${parallax.layer1}px))`,
                }}
              />
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-[20px] border-spartan-gold/20 rounded-full transition-transform duration-100"
                style={{
                  transform: `translate(-50%, calc(-50% + ${parallax.layer2}px))`,
                }}
              />
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border-[10px] border-spartan-gold/10 rounded-full transition-transform duration-100"
                style={{
                  transform: `translate(-50%, calc(-50% + ${parallax.layer3}px))`,
                }}
              />
            </div>
          </div>

          <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-spartan-gold/30 bg-spartan-gold/10 mb-8 animate-fade-in-up">
              <span
                className="w-2 h-2 bg-spartan-emerald rounded-full animate-pulse"
                aria-hidden="true"
              />
              <span className="text-sm text-spartan-cream/80 tracking-wide">
                Las Vegas&apos;s Premier Exterior Cleaning Specialists
              </span>
            </div>

            {/* Main Headline with Text Reveal */}
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6">
              <TextReveal
                text="CLEAR VIEWS"
                as="span"
                className="block"
                gradient
                staggerMs={40}
              />
              <br />
              <TextReveal
                text="CLEANER LIVING"
                as="span"
                className="block text-spartan-cream"
                staggerMs={35}
              />
            </h1>

            {/* Subheadline */}
            <p className="text-xl sm:text-2xl text-spartan-cream/70 max-w-2xl mx-auto mb-10 animate-fade-in-up stagger-2">
              Dedicated to Detail. Driven by Quality.
              <br />
              <span className="text-spartan-gold">
                Professional window cleaning, solar panel cleaning, pressure
                washing & more.
              </span>
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up stagger-3">
              <a
                href="tel:7025093854"
                className="btn-spartan px-10 py-4 text-lg w-full sm:w-auto min-h-[56px] flex items-center justify-center"
              >
                GET FREE ESTIMATE
              </a>
              <a
                href="#services"
                className="btn-emerald px-10 py-4 text-lg w-full sm:w-auto min-h-[56px] flex items-center justify-center"
              >
                VIEW SERVICES
              </a>
            </div>

            {/* Trust Signals */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-12 animate-fade-in-up stagger-4">
              {trustSignals.map((signal) => (
                <div
                  key={signal.label}
                  className="flex items-center gap-2 text-spartan-cream/60"
                >
                  <span className="text-lg" aria-hidden="true">
                    {signal.icon}
                  </span>
                  <span className="text-sm">{signal.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Spear Scroll Indicator */}
          <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-spear-bounce"
            aria-hidden="true"
          >
            <svg
              width="24"
              height="64"
              viewBox="0 0 24 64"
              fill="none"
              className="text-spartan-gold"
            >
              {/* Spear shaft */}
              <rect
                x="10"
                y="16"
                width="4"
                height="48"
                fill="currentColor"
                opacity="0.6"
              />
              {/* Spearhead */}
              <path
                d="M12 0L20 16H4L12 0Z"
                fill="currentColor"
                className="drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]"
              />
              {/* Decorative bands */}
              <rect x="9" y="20" width="6" height="2" fill="currentColor" />
              <rect x="9" y="26" width="6" height="2" fill="currentColor" />
            </svg>
            <p className="text-xs text-spartan-gold/50 mt-2 tracking-widest text-center">
              SCROLL
            </p>
          </div>
        </section>

        {/* Spartan Divider */}
        <div
          className="spartan-divider w-full max-w-4xl mx-auto my-0"
          aria-hidden="true"
        />

        {/* Services Section */}
        <section
          ref={servicesRef}
          id="services"
          className="py-24 px-4 sm:px-6 lg:px-8"
          aria-label="Our Services"
        >
          <div className="max-w-7xl mx-auto">
            {/* Section Header with Shield Reveal */}
            <div
              className={`text-center mb-16 transition-all duration-700 ${
                servicesVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <span className="text-spartan-gold text-sm tracking-[0.3em] uppercase">
                Our Arsenal
              </span>
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-spartan-cream mt-4 mb-6">
                SERVICES
              </h2>
              <p className="text-spartan-cream/60 max-w-2xl mx-auto text-lg">
                From sparkling windows to gleaming solar panels, we bring
                warrior-level precision to every job.
              </p>
            </div>

            {/* Services Grid with 3D Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 perspective-1000">
              {services.map((service, index) => (
                <div
                  key={service.id}
                  className={`transition-all duration-500 ${
                    serviceCardVisible[index]
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-12"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <ServiceCard service={service} />
                </div>
              ))}
            </div>

            {/* Subscription Plans */}
            <div className="mt-16 text-center">
              <h3 className="font-display text-2xl font-bold text-spartan-cream mb-8">
                MAINTENANCE PLANS
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <div className="card-spartan p-6 text-center">
                  <span className="text-spartan-gold font-display text-3xl font-bold">
                    $85
                  </span>
                  <span className="text-spartan-cream/60">/month</span>
                  <h4 className="text-spartan-cream mt-2 font-semibold">
                    Monthly Subscription
                  </h4>
                  <p className="text-sm text-spartan-cream/50 mt-1">
                    Regular maintenance plan
                  </p>
                </div>
                <div className="card-spartan p-6 text-center border-spartan-gold/50">
                  <span className="text-spartan-gold font-display text-3xl font-bold">
                    $150
                  </span>
                  <span className="text-spartan-cream/60">/month</span>
                  <h4 className="text-spartan-cream mt-2 font-semibold">
                    Premium Subscription
                  </h4>
                  <p className="text-sm text-spartan-cream/50 mt-1">
                    Full-service maintenance
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section
          ref={aboutRef}
          id="about"
          className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0a0a0a] to-[#050505]"
          aria-label="About Spartan Exterior Services"
        >
          <div className="max-w-7xl mx-auto">
            {/* Stats Row with Animated Counters */}
            <div
              className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 transition-all duration-700 ${
                aboutVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <div className="text-center p-6 border border-spartan-gold/20">
                <div className="font-display text-4xl md:text-5xl font-bold text-spartan-gold">
                  <AnimatedCounter end={500} suffix="+" />
                </div>
                <p className="text-spartan-cream/60 text-sm mt-2">
                  Windows Cleaned
                </p>
              </div>
              <div className="text-center p-6 border border-spartan-gold/20">
                <div className="font-display text-4xl md:text-5xl font-bold text-spartan-gold">
                  <AnimatedCounter end={100} suffix="%" />
                </div>
                <p className="text-spartan-cream/60 text-sm mt-2">
                  Satisfaction
                </p>
              </div>
              <div className="text-center p-6 border border-spartan-gold/20">
                <div className="font-display text-4xl md:text-5xl font-bold text-spartan-gold">
                  <AnimatedCounter end={5} />
                </div>
                <p className="text-spartan-cream/60 text-sm mt-2">
                  Star Reviews
                </p>
              </div>
              <div className="text-center p-6 border border-spartan-gold/20">
                <div className="font-display text-4xl md:text-5xl font-bold text-spartan-gold">
                  <AnimatedCounter end={50} suffix="+" />
                </div>
                <p className="text-spartan-cream/60 text-sm mt-2">
                  Happy Clients
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Image/Logo Side */}
              <div className="relative">
                <div className="aspect-square max-w-md mx-auto relative">
                  <div
                    className="absolute inset-0 border-2 border-spartan-gold/30"
                    aria-hidden="true"
                  />
                  <div
                    className="absolute inset-4 border border-spartan-gold/20"
                    aria-hidden="true"
                  />
                  <div className="absolute inset-0 flex items-center justify-center p-12">
                    <Image
                      src="/spartan-logo.png"
                      alt="Spartan Exterior Services Logo"
                      fill
                      className="object-contain p-8"
                      sizes="(max-width: 768px) 100vw, 448px"
                    />
                  </div>
                  {/* Corner accents */}
                  <div
                    className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-spartan-gold"
                    aria-hidden="true"
                  />
                  <div
                    className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-spartan-gold"
                    aria-hidden="true"
                  />
                  <div
                    className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-spartan-gold"
                    aria-hidden="true"
                  />
                  <div
                    className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-spartan-gold"
                    aria-hidden="true"
                  />
                </div>
              </div>

              {/* Content Side */}
              <div>
                <span className="text-spartan-gold text-sm tracking-[0.3em] uppercase">
                  Our Story
                </span>
                <h2 className="font-display text-4xl sm:text-5xl font-bold text-spartan-cream mt-4 mb-6">
                  THE SPARTAN WAY
                </h2>
                <div className="space-y-4 text-spartan-cream/70 leading-relaxed">
                  <p>
                    <span className="text-spartan-gold font-semibold">
                      Spartan Exterior Services LLC
                    </span>{" "}
                    was founded on the belief that clean windows can completely
                    transform a home—both inside and out.
                  </p>
                  <p>
                    Like the legendary warriors of ancient Sparta, we bring{" "}
                    <span className="text-spartan-gold">
                      discipline, precision, and unwavering commitment
                    </span>{" "}
                    to every job. We don&apos;t just clean windows — we protect
                    and preserve your home&apos;s appearance with the same
                    dedication a Spartan brought to defending their city.
                  </p>
                  <p>
                    Our team uses professional-grade tools, eco-friendly
                    products, and trained technicians to deliver results that
                    exceed expectations. Every window we touch receives the full
                    treatment: glass, frames, tracks, seals, and screens.
                  </p>
                </div>

                {/* Values */}
                <div className="grid grid-cols-2 gap-4 mt-8">
                  {[
                    {
                      title: "Precision",
                      desc: "Professional-grade tools & solutions",
                    },
                    {
                      title: "Reliability",
                      desc: "Consistent, dependable service",
                    },
                    {
                      title: "Detail",
                      desc: "We never overlook the small things",
                    },
                    { title: "Satisfaction", desc: "Guaranteed on every job" },
                  ].map((value) => (
                    <div
                      key={value.title}
                      className="p-4 border border-spartan-gold/20"
                    >
                      <h4 className="text-spartan-gold font-display font-bold">
                        {value.title}
                      </h4>
                      <p className="text-sm text-spartan-cream/60 mt-1">
                        {value.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Service Areas */}
        <section
          ref={areasRef}
          id="areas"
          className="py-24 px-4 sm:px-6 lg:px-8"
          aria-label="Service Areas"
        >
          <div className="max-w-4xl mx-auto text-center">
            <div
              className={`transition-all duration-700 ${
                areasVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <span className="text-spartan-gold text-sm tracking-[0.3em] uppercase">
                Our Territory
              </span>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-spartan-cream mt-4 mb-6">
                SERVICE AREAS
              </h2>
              <p className="text-spartan-cream/60 mb-12">
                Serving the Las Vegas Valley and surrounding Nevada communities
              </p>
            </div>

            <ul
              className="flex flex-wrap justify-center gap-4"
              role="list"
              aria-label="Cities we serve"
            >
              {serviceAreas.map((area, index) => (
                <li
                  key={area}
                  className={`px-8 py-4 border border-spartan-gold/30 bg-spartan-gold/5 hover:bg-spartan-gold/10 hover:border-spartan-gold transition-all duration-300 ${
                    areaChipVisible[index]
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 -translate-y-8"
                  }`}
                  style={{
                    transitionDelay: `${index * 80}ms`,
                    animation: areaChipVisible[index]
                      ? "pinDrop 0.5s ease-out forwards"
                      : "none",
                  }}
                >
                  <span className="text-spartan-cream font-display font-semibold">
                    {area}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA Section */}
        <section
          ref={ctaRef}
          className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-spartan-gold/10 via-spartan-gold/5 to-spartan-gold/10 border-y border-spartan-gold/30"
          aria-label="Get a free estimate"
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2
              className={`font-display text-4xl sm:text-5xl font-bold text-spartan-cream mb-6 transition-all duration-700 ${
                ctaVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
              }`}
              style={{
                textShadow: ctaVisible
                  ? "0 0 40px rgba(212, 175, 55, 0.3)"
                  : "none",
              }}
            >
              READY TO TRANSFORM YOUR HOME?
            </h2>
            <p
              className={`text-xl text-spartan-cream/70 mb-10 transition-all duration-500 delay-200 ${
                ctaVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              Get a free, no-obligation estimate from our Spartan team.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="tel:7025093854"
                className="btn-spartan px-12 py-5 text-xl w-full sm:w-auto min-h-[64px] flex items-center justify-center gap-3"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                  />
                </svg>
                (702) 509-3854
              </a>
              <a
                href="mailto:spartanexteriorservicellc@gmail.com"
                className="btn-emerald px-12 py-5 text-xl w-full sm:w-auto min-h-[64px] flex items-center justify-center"
              >
                EMAIL US
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-16 px-4 sm:px-6 lg:px-8 bg-[#050505] border-t border-spartan-gold/20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Brand */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 relative">
                    <Image
                      src="/spartan-logo.png"
                      alt="Spartan Exterior Services"
                      fill
                      className="object-contain"
                      sizes="48px"
                    />
                  </div>
                  <div>
                    <span className="font-display text-spartan-gold font-bold tracking-wider">
                      SPARTAN
                    </span>
                    <span className="block text-xs text-spartan-cream/60 tracking-widest">
                      EXTERIOR SERVICES LLC
                    </span>
                  </div>
                </div>
                <p className="text-spartan-cream/60 text-sm leading-relaxed">
                  Clear Views, Cleaner Living. Dedicated to detail and driven by
                  quality.
                </p>
              </div>

              {/* Contact */}
              <div>
                <h4 className="font-display text-spartan-gold font-bold mb-4">
                  CONTACT
                </h4>
                <address className="space-y-3 text-spartan-cream/60 text-sm not-italic">
                  <p>
                    <a
                      href="tel:7025093854"
                      className="hover:text-spartan-gold transition-colors"
                    >
                      (702) 509-3854
                    </a>
                  </p>
                  <p>
                    <a
                      href="mailto:spartanexteriorservicellc@gmail.com"
                      className="hover:text-spartan-gold transition-colors"
                    >
                      spartanexteriorservicellc@gmail.com
                    </a>
                  </p>
                  <p>Mon–Sat: 9AM–5PM</p>
                  <p>Sun: Closed</p>
                </address>
              </div>

              {/* Social */}
              <div>
                <h4 className="font-display text-spartan-gold font-bold mb-4">
                  FOLLOW US
                </h4>
                <div className="flex gap-4">
                  <a
                    href="https://www.instagram.com/spartan_exterior_services/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow Spartan Exterior Services on Instagram"
                    className="w-10 h-10 flex items-center justify-center border border-spartan-gold/30 text-spartan-cream/60 hover:bg-spartan-gold hover:text-spartan-black transition-all duration-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.yelp.com/biz/spartan-exterior-services-las-vegas"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Review Spartan Exterior Services on Yelp"
                    className="w-10 h-10 flex items-center justify-center border border-spartan-gold/30 text-spartan-cream/60 hover:bg-spartan-gold hover:text-spartan-black transition-all duration-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M12.445 19.963l-1.86-3.251c-.098-.172-.279-.276-.476-.276h-4.609c-.397 0-.667-.405-.517-.77l1.932-4.708c.099-.241.338-.399.598-.399h4.587c.197 0 .378-.104.476-.276l1.869-3.268c.2-.35-.066-.791-.476-.791h-9.369c-.265 0-.508.153-.62.394l-3.56 7.699c-.112.241-.112.518 0 .759l3.56 7.699c.112.241.355.394.62.394h9.369c.41 0 .676-.441.476-.791v-.015zm6.555-3.689l-3.535-1.965c-.175-.097-.285-.281-.285-.481v-3.654c0-.2.11-.384.285-.481l3.535-1.965c.35-.195.8.024.8.426v7.694c0 .402-.45.621-.8.426z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-12 pt-8 border-t border-spartan-gold/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-spartan-cream/40 text-sm">
                © {currentYear} Spartan Exterior Services LLC. All rights
                reserved.
              </p>
              <p className="text-spartan-cream/40 text-sm">
                Built with precision by{" "}
                <a
                  href="https://machinemind.io"
                  className="text-spartan-gold hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  MachineMind
                </a>
              </p>
            </div>
          </div>
        </footer>

        {/* LEONIDAS Chat Bot */}
        <LeonidasChat />
      </main>
    </>
  );
}
