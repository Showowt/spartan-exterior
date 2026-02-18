import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Spartan Exterior Services - Las Vegas Window Cleaning";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        background:
          "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* Gold border accent */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          right: 20,
          bottom: 20,
          border: "3px solid #d4af37",
          display: "flex",
        }}
      />

      {/* Corner accents */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          width: 60,
          height: 60,
          borderTop: "6px solid #d4af37",
          borderLeft: "6px solid #d4af37",
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          width: 60,
          height: 60,
          borderTop: "6px solid #d4af37",
          borderRight: "6px solid #d4af37",
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: 20,
          width: 60,
          height: 60,
          borderBottom: "6px solid #d4af37",
          borderLeft: "6px solid #d4af37",
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          width: 60,
          height: 60,
          borderBottom: "6px solid #d4af37",
          borderRight: "6px solid #d4af37",
          display: "flex",
        }}
      />

      {/* Shield icon */}
      <div
        style={{
          fontSize: 120,
          marginBottom: 20,
          display: "flex",
        }}
      >
        🛡️
      </div>

      {/* Main title */}
      <div
        style={{
          fontSize: 72,
          fontWeight: 900,
          background:
            "linear-gradient(135deg, #f4d03f 0%, #d4af37 50%, #cd7f32 100%)",
          backgroundClip: "text",
          color: "transparent",
          letterSpacing: "0.1em",
          textAlign: "center",
          display: "flex",
        }}
      >
        SPARTAN
      </div>

      {/* Subtitle */}
      <div
        style={{
          fontSize: 36,
          color: "#f5f5dc",
          letterSpacing: "0.3em",
          marginTop: 10,
          display: "flex",
        }}
      >
        EXTERIOR SERVICES
      </div>

      {/* Tagline */}
      <div
        style={{
          fontSize: 28,
          color: "#d4af37",
          marginTop: 30,
          display: "flex",
        }}
      >
        Clear Views • Cleaner Living
      </div>

      {/* Location */}
      <div
        style={{
          fontSize: 22,
          color: "#f5f5dc",
          opacity: 0.7,
          marginTop: 20,
          display: "flex",
        }}
      >
        Las Vegas Window Cleaning & Exterior Specialists
      </div>

      {/* Phone */}
      <div
        style={{
          position: "absolute",
          bottom: 50,
          fontSize: 28,
          color: "#10b981",
          fontWeight: 700,
          display: "flex",
        }}
      >
        (702) 509-3854
      </div>
    </div>,
    {
      ...size,
    },
  );
}
