import type { Metadata, Viewport } from "next";
// Cinzel used instead of Playfair Display for Spartan brand aesthetic
import { Cinzel, Inter } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#d4af37",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://spartanexteriorservices.com"),
  title:
    "Spartan Exterior Services LLC | Las Vegas Window Cleaning & Exterior Specialists",
  description:
    "We're Here to Help — Clear Views, Cleaner Living. Professional window cleaning, solar panel cleaning, pressure washing, soft wash, and permanent lighting in Las Vegas, Henderson, and Boulder City. Free estimates. (702) 509-3854",
  keywords:
    "window cleaning Las Vegas, exterior cleaning Nevada, solar panel cleaning Henderson, pressure washing Boulder City, soft wash Las Vegas, permanent lighting installation",
  authors: [{ name: "Spartan Exterior Services LLC" }],
  alternates: {
    canonical: "https://spartanexteriorservices.com",
  },
  openGraph: {
    title: "Spartan Exterior Services LLC | Las Vegas Window Cleaning Experts",
    description:
      "Dedicated to Detail and Driven by Quality. Professional window cleaning, solar panel cleaning, pressure washing & more. Serving Las Vegas, Henderson, Boulder City.",
    type: "website",
    locale: "en_US",
    siteName: "Spartan Exterior Services",
    url: "https://spartanexteriorservices.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Spartan Exterior Services LLC | Las Vegas Window Cleaning",
    description:
      "Clear Views, Cleaner Living. Professional exterior cleaning services.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "add-your-verification-code",
  },
};

// JSON-LD Structured Data for Local Business
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://spartanexteriorservices.com",
  name: "Spartan Exterior Services LLC",
  image: "https://spartanexteriorservices.com/spartan-logo.png",
  description:
    "Professional window cleaning, solar panel cleaning, pressure washing, soft wash, and permanent lighting services in Las Vegas Valley.",
  telephone: "+1-702-509-3854",
  email: "spartanexteriorservicellc@gmail.com",
  url: "https://spartanexteriorservices.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Las Vegas",
    addressRegion: "NV",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 36.1699,
    longitude: -115.1398,
  },
  areaServed: [
    { "@type": "City", name: "Las Vegas" },
    { "@type": "City", name: "Henderson" },
    { "@type": "City", name: "Boulder City" },
    { "@type": "City", name: "North Las Vegas" },
  ],
  priceRange: "$$",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "09:00",
      closes: "17:00",
    },
  ],
  sameAs: [
    "https://www.instagram.com/spartan_exterior_services/",
    "https://www.yelp.com/biz/spartan-exterior-services-las-vegas",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Exterior Cleaning Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Window Cleaning",
          description:
            "Interior and exterior window cleaning with full-system approach",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Solar Panel Cleaning",
          description:
            "Professional solar panel cleaning to restore peak efficiency",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Pressure Washing",
          description:
            "High-power cleaning for driveways, patios, and exterior surfaces",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Soft Wash",
          description:
            "Gentle cleaning for stucco, painted surfaces, and roofs",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Permanent Lighting",
          description: "Year-round LED lighting installations for homes",
        },
      },
    ],
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    ratingCount: "50",
    bestRating: "5",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${cinzel.variable} ${inter.variable} antialiased bg-[#050505] text-spartan-cream`}
      >
        {children}
      </body>
    </html>
  );
}
