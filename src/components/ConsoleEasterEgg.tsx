"use client";

import { useEffect } from "react";

// Extend window type for our secret methods
declare global {
  interface Window {
    SpartanExterior: {
      battleCry: () => void;
      shield: () => void;
      estimate: () => void;
      secrets: () => void;
    };
  }
}

export default function ConsoleEasterEgg() {
  useEffect(() => {
    // ASCII Art Banner
    const banner = `
%c
    ⚔️  SPARTAN EXTERIOR SERVICES  ⚔️
    ═══════════════════════════════════

         ___________
        /           \\
       /   SPARTAN   \\
      /   EXTERIOR    \\
     |    SERVICES    |
     |   ⚔️  🛡️  ⚔️   |
      \\_______________/

    "We're Here to Help."

    ═══════════════════════════════════

    🔐 Hidden Commands Available:

    SpartanExterior.battleCry()  - Hear the call to action
    SpartanExterior.shield()     - Our core values
    SpartanExterior.estimate()   - Quick pricing info
    SpartanExterior.secrets()    - List all secrets

    📞 Call (702) 509-3854 for service
    🌐 spartanexteriorservices.com

    ═══════════════════════════════════
`;

    console.log(
      banner,
      "color: #d4af37; font-family: monospace; font-size: 12px; line-height: 1.3;",
    );

    // Define window methods
    window.SpartanExterior = {
      battleCry: () => {
        console.log(
          "%c⚔️ WARRIORS! PREPARE FOR GLORY! ⚔️",
          "color: #d4af37; font-size: 20px; font-weight: bold;",
        );
        console.log(
          "%c" +
            `
    We don't just clean windows...
    We CONQUER dirt.
    We VANQUISH grime.
    We TRIUMPH over neglect.

    THIS. IS. SPARTAN!

    Ready to join the battle? Call (702) 509-3854
          `,
          "color: #f5f5dc; font-size: 14px;",
        );
        return "🛡️ For glory!";
      },

      shield: () => {
        console.log(
          "%c🛡️ THE SPARTAN SHIELD - OUR VALUES 🛡️",
          "color: #10b981; font-size: 18px; font-weight: bold;",
        );
        console.log(
          "%c" +
            `
    ╔═══════════════════════════════════════════╗
    ║                                           ║
    ║  ⚔️  PRECISION                            ║
    ║      Every pane, every detail, perfect    ║
    ║                                           ║
    ║  🛡️  RELIABILITY                          ║
    ║      We show up. On time. Every time.     ║
    ║                                           ║
    ║  🗡️  EXCELLENCE                           ║
    ║      No shortcuts. No compromises.        ║
    ║                                           ║
    ║  👑  SATISFACTION                         ║
    ║      Your home, treated like a palace     ║
    ║                                           ║
    ╚═══════════════════════════════════════════╝
          `,
          "color: #f5f5dc; font-size: 12px; font-family: monospace;",
        );
        return "🛡️ Protected by honor.";
      },

      estimate: () => {
        console.log(
          "%c💰 SPARTAN PRICING GUIDE 💰",
          "color: #d4af37; font-size: 18px; font-weight: bold;",
        );
        console.log(
          "%c" +
            `
    ┌─────────────────────────────────────────┐
    │ SERVICE                    STARTING AT │
    ├─────────────────────────────────────────┤
    │ 🪟 Window Cleaning         $8-10/pane  │
    │ ☀️ Solar Panel Cleaning    $10/panel   │
    │ 💦 Pressure Washing        $150+       │
    │ 🧼 Soft Wash               $200/side   │
    │ ✨ Permanent Lighting      $1,300+     │
    │ 🪟 Solar Screens           $10/screen  │
    └─────────────────────────────────────────┘

    📱 For a custom estimate, call (702) 509-3854
    💬 Or chat with Leonidas on our website!
          `,
          "color: #f5f5dc; font-size: 12px; font-family: monospace;",
        );
        return "💰 Fair pricing, legendary results.";
      },

      secrets: () => {
        console.log(
          "%c🔐 ALL SPARTAN SECRETS 🔐",
          "color: #cd7f32; font-size: 16px; font-weight: bold;",
        );
        console.log(
          "%c" +
            `
    Hidden features on this site:

    🎮 Konami Code (↑↑↓↓←→←→BA)
       Triggers the legendary Spartan rain!

    🖥️ Console Commands:
       SpartanExterior.battleCry()
       SpartanExterior.shield()
       SpartanExterior.estimate()

    🎯 More secrets may be hidden...
       Keep exploring, warrior!
          `,
          "color: #f5f5dc; font-size: 12px;",
        );
        return "🔐 The brave discover all.";
      },
    };

    // Cleanup
    return () => {
      // @ts-expect-error - Cleaning up global
      delete window.SpartanExterior;
    };
  }, []);

  return null;
}
