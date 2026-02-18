"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { create } from "zustand";
import Image from "next/image";

// ═══════════════════════════════════════════════════════════════
// LEONIDAS — The Spartan Estimator Bot
// Intelligent pricing based on panes, stories, services
// ═══════════════════════════════════════════════════════════════

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
}

interface EstimateState {
  service: string | null;
  stories: number | null;
  windowType: "exterior" | "interior" | "both" | null;
  paneCount: number | null;
  solarPanels: number | null;
  solarScreens: number | null;
  pressureWashSides: number | null;
  softWashSides: number | null;
  permanentLighting: boolean;
  hardWaterSpots: boolean;
  name: string | null;
  phone: string | null;
  address: string | null;
  step: number;
}

interface ChatStore {
  isOpen: boolean;
  messages: Message[];
  estimate: EstimateState;
  isTyping: boolean;
  isSubmitting: boolean;
  toggleChat: () => void;
  addMessage: (role: "user" | "bot", content: string) => void;
  updateEstimate: (updates: Partial<EstimateState>) => void;
  setTyping: (typing: boolean) => void;
  setSubmitting: (submitting: boolean) => void;
  reset: () => void;
}

const initialEstimate: EstimateState = {
  service: null,
  stories: null,
  windowType: null,
  paneCount: null,
  solarPanels: null,
  solarScreens: null,
  pressureWashSides: null,
  softWashSides: null,
  permanentLighting: false,
  hardWaterSpots: false,
  name: null,
  phone: null,
  address: null,
  step: 0,
};

const useChatStore = create<ChatStore>((set) => ({
  isOpen: false,
  messages: [],
  estimate: initialEstimate,
  isTyping: false,
  isSubmitting: false,
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  addMessage: (role, content) =>
    set((state) => ({
      messages: [
        ...state.messages,
        { id: crypto.randomUUID(), role, content, timestamp: new Date() },
      ],
    })),
  updateEstimate: (updates) =>
    set((state) => ({
      estimate: { ...state.estimate, ...updates },
    })),
  setTyping: (typing) => set({ isTyping: typing }),
  setSubmitting: (submitting) => set({ isSubmitting: submitting }),
  reset: () => set({ messages: [], estimate: initialEstimate }),
}));

// Pricing logic
const calculateEstimate = (
  estimate: EstimateState,
): { min: number; max: number; breakdown: string[] } => {
  const breakdown: string[] = [];
  let min = 0;
  let max = 0;

  // Window cleaning pricing
  if (estimate.paneCount && estimate.paneCount > 0) {
    const paneMin = estimate.paneCount * 8;
    const paneMax = estimate.paneCount * 10;
    min += paneMin;
    max += paneMax;
    breakdown.push(
      `Window Panes (${estimate.paneCount}): $${paneMin} - $${paneMax}`,
    );
  }

  // Story-based flat rates (if no pane count given)
  if (!estimate.paneCount && estimate.stories && estimate.windowType) {
    const storyPricing: Record<string, Record<number, number>> = {
      exterior: { 1: 200, 2: 300, 3: 400 },
      interior: { 1: 150, 2: 200, 3: 250 },
      both: { 1: 250, 2: 350, 3: 450 },
    };
    const price = storyPricing[estimate.windowType]?.[estimate.stories] || 0;
    if (price > 0) {
      min += price * 0.9;
      max += price;
      breakdown.push(
        `${estimate.stories}-Story ${estimate.windowType === "both" ? "Full" : estimate.windowType.charAt(0).toUpperCase() + estimate.windowType.slice(1)} Clean: $${Math.round(price * 0.9)} - $${price}`,
      );
    }
  }

  // Solar panel cleaning
  if (estimate.solarPanels && estimate.solarPanels > 0) {
    const solarPrice = estimate.solarPanels * 10;
    min += solarPrice;
    max += solarPrice;
    breakdown.push(`Solar Panels (${estimate.solarPanels}): $${solarPrice}`);
  }

  // Solar screens
  if (estimate.solarScreens && estimate.solarScreens > 0) {
    const screenPrice = estimate.solarScreens * 10;
    min += screenPrice;
    max += screenPrice;
    breakdown.push(`Solar Screens (${estimate.solarScreens}): $${screenPrice}`);
  }

  // Pressure washing
  if (estimate.pressureWashSides && estimate.pressureWashSides > 0) {
    const pwPrice = 150 + (estimate.pressureWashSides - 1) * 50;
    min += pwPrice;
    max += pwPrice;
    breakdown.push(
      `Pressure Washing (${estimate.pressureWashSides} sides): $${pwPrice}`,
    );
  }

  // Soft wash
  if (estimate.softWashSides && estimate.softWashSides > 0) {
    const swPrice = estimate.softWashSides * 200;
    min += swPrice;
    max += swPrice;
    breakdown.push(`Soft Wash (${estimate.softWashSides} sides): $${swPrice}`);
  }

  // Permanent lighting
  if (estimate.permanentLighting) {
    min += 1300;
    max += 2500;
    breakdown.push(`Permanent Lighting: $1,300 - $2,500+`);
  }

  // Hard water spot removal (adds 30-50% to window cleaning)
  if (estimate.hardWaterSpots && (estimate.paneCount || estimate.stories)) {
    const hwMin = Math.round(min * 0.3);
    const hwMax = Math.round(max * 0.5);
    min += hwMin;
    max += hwMax;
    breakdown.push(`Hard Water Spot Treatment: +$${hwMin} - $${hwMax}`);
  }

  return { min, max, breakdown };
};

const generateEstimateSummary = (estimate: EstimateState): string => {
  const { min, max, breakdown } = calculateEstimate(estimate);

  if (breakdown.length === 0) {
    return `We'll provide a detailed estimate on-site.`;
  }

  let summary = `**SPARTAN ESTIMATE BREAKDOWN:**\n\n`;
  breakdown.forEach((item) => {
    summary += `• ${item}\n`;
  });
  summary += `\n**TOTAL ESTIMATE: $${min.toLocaleString()} - $${max.toLocaleString()}**\n\n`;
  summary += `*Final price confirmed after free on-site assessment.*`;

  return summary;
};

// Submit lead to API
async function submitLead(
  estimate: EstimateState,
): Promise<{ success: boolean; message: string }> {
  try {
    const { min, max } = calculateEstimate(estimate);

    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: estimate.name,
        phone: estimate.phone,
        address: estimate.address,
        estimate: {
          service: estimate.service,
          stories: estimate.stories,
          windowType: estimate.windowType,
          paneCount: estimate.paneCount,
          solarPanels: estimate.solarPanels,
          solarScreens: estimate.solarScreens,
          pressureWashSides: estimate.pressureWashSides,
          softWashSides: estimate.softWashSides,
          permanentLighting: estimate.permanentLighting,
          hardWaterSpots: estimate.hardWaterSpots,
        },
        estimatedTotal: { min, max },
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      return { success: false, message: data.error || "Failed to submit" };
    }

    return { success: true, message: "Lead submitted successfully" };
  } catch {
    return { success: false, message: "Network error. Please try again." };
  }
}

// Bot response logic
const getBotResponse = (
  userMessage: string,
  estimate: EstimateState,
  updateEstimate: (updates: Partial<EstimateState>) => void,
  onSubmitLead?: () => Promise<void>,
): string => {
  const msg = userMessage.toLowerCase();

  // Initial greeting
  if (estimate.step === 0) {
    updateEstimate({ step: 1 });
    return `**LEONIDAS here, warrior.**

I'm the Spartan Estimator — I'll help you get a battle-ready quote for your property.

What service are you interested in today?

1. **Window Cleaning** (Interior/Exterior)
2. **Solar Panel Cleaning**
3. **Pressure Washing**
4. **Soft Wash**
5. **Permanent Lighting**
6. **Multiple Services**

Just type the number or tell me what you need.`;
  }

  // Service selection
  if (estimate.step === 1) {
    if (msg.includes("window") || msg.includes("1")) {
      updateEstimate({ service: "window", step: 2 });
      return `**Window cleaning — excellent choice, soldier.**

Let's assess your fortress. How many stories is your home?

1. **1-Story**
2. **2-Story**
3. **3-Story**`;
    }
    if (msg.includes("solar panel") || msg.includes("2")) {
      updateEstimate({ service: "solar", step: 10 });
      return `**Solar panel cleaning — keep that energy flowing!**

How many solar panels does your property have? (Just give me a number)`;
    }
    if (msg.includes("pressure") || msg.includes("3")) {
      updateEstimate({ service: "pressure", step: 12 });
      return `**Pressure washing — we'll blast away the enemy dirt.**

How many sides of your property need pressure washing? (Front, back, left, right = 4 sides max)`;
    }
    if (msg.includes("soft") || msg.includes("4")) {
      updateEstimate({ service: "soft", step: 14 });
      return `**Soft wash — the gentle warrior's approach.**

Perfect for stucco, painted surfaces, and roofs. How many sides need soft washing?

(Each side is $200)`;
    }
    if (
      msg.includes("light") ||
      msg.includes("permanent") ||
      msg.includes("5")
    ) {
      updateEstimate({
        service: "lighting",
        permanentLighting: true,
        step: 16,
      });
      return `**Permanent lighting — illuminate your castle year-round!**

Our permanent lighting installations start at **$1,300** and vary based on:
- Linear footage of your roofline
- Number of peaks/valleys
- Controller features

Would you like to schedule a **free on-site estimate**? I'll need your contact info.

What's your name, warrior?`;
    }
    if (
      msg.includes("multiple") ||
      msg.includes("6") ||
      msg.includes("bundle")
    ) {
      updateEstimate({ service: "multiple", step: 2 });
      return `**A full battle plan — I respect that.**

Let's start with windows, then add the other services.

How many stories is your home?
1. **1-Story**
2. **2-Story**
3. **3-Story**`;
    }

    return `I didn't catch that, soldier. Please choose a service:

1. **Window Cleaning**
2. **Solar Panel Cleaning**
3. **Pressure Washing**
4. **Soft Wash**
5. **Permanent Lighting**
6. **Multiple Services**`;
  }

  // Story selection for windows
  if (estimate.step === 2) {
    const stories = msg.includes("1")
      ? 1
      : msg.includes("2")
        ? 2
        : msg.includes("3")
          ? 3
          : null;
    if (stories) {
      updateEstimate({ stories, step: 3 });
      return `**${stories}-story home — noted.**

Do you need:
1. **Exterior only** cleaning
2. **Interior only** cleaning
3. **Both interior AND exterior** (Full service)`;
    }
    return `Please select the number of stories: **1**, **2**, or **3**`;
  }

  // Window type selection
  if (estimate.step === 3) {
    let windowType: "exterior" | "interior" | "both" | null = null;
    if (msg.includes("both") || msg.includes("3") || msg.includes("full")) {
      windowType = "both";
    } else if (
      msg.includes("exterior") ||
      msg.includes("1") ||
      msg.includes("outside")
    ) {
      windowType = "exterior";
    } else if (
      msg.includes("interior") ||
      msg.includes("2") ||
      msg.includes("inside")
    ) {
      windowType = "interior";
    }

    if (windowType) {
      updateEstimate({ windowType, step: 4 });
      return `**${windowType === "both" ? "Full service" : windowType.charAt(0).toUpperCase() + windowType.slice(1)} cleaning — roger that.**

Now, here's where precision matters. Do you know approximately how many **window panes** your home has?

*A pane is each individual piece of glass. For example, a double-hung window has 2 panes. A large picture window is 1 pane.*

If you're not sure, just say "**not sure**" and I'll estimate based on your home's stories.`;
    }
    return `Please select: **1** (Exterior), **2** (Interior), or **3** (Both)`;
  }

  // Pane count
  if (estimate.step === 4) {
    if (
      msg.includes("not sure") ||
      msg.includes("don't know") ||
      msg.includes("unsure") ||
      msg.includes("idk")
    ) {
      updateEstimate({ step: 5 });
      return `**No problem — we'll assess on-site.**

Do you have **hard water spots** on your windows? (Mineral deposits from sprinklers, often white/cloudy stains)

This requires special treatment and affects pricing.

**Yes** or **No**?`;
    }

    const paneMatch = msg.match(/\d+/);
    if (paneMatch) {
      const paneCount = parseInt(paneMatch[0]);
      if (paneCount > 0 && paneCount < 500) {
        updateEstimate({ paneCount, step: 5 });
        return `**${paneCount} panes — got it.**

Each pane is **$8 - $10** depending on accessibility and condition.

Do you have **hard water spots** on your windows? (Mineral deposits from sprinklers)

**Yes** or **No**?`;
      }
    }
    return `Please enter a number of panes, or say "**not sure**" if you'd like an on-site assessment.`;
  }

  // Hard water spots
  if (estimate.step === 5) {
    const hasHardWater =
      msg.includes("yes") || msg.includes("yeah") || msg.includes("yep");
    const updatedEst = { ...estimate, hardWaterSpots: hasHardWater };
    updateEstimate({ hardWaterSpots: hasHardWater, step: 6 });

    if (estimate.service === "multiple") {
      return `${hasHardWater ? "**Hard water treatment added — we'll restore that glass to crystal clarity.**" : "**No hard water — your glass is in good shape.**"}

Now, any **solar panels** that need cleaning? If yes, how many? If not, just say "**no**".`;
    }

    return `${hasHardWater ? "**Hard water treatment added — we'll restore that glass to crystal clarity.**" : "**No hard water — your glass is in good shape.**"}

Almost done, warrior. Let me calculate your estimate...

${generateEstimateSummary(updatedEst)}

Would you like to **schedule a free on-site estimate**? I'll need your name and phone number to have our team reach out.`;
  }

  // Multiple services - solar panels
  if (estimate.step === 6) {
    if (msg.includes("no") || msg.includes("none") || msg.includes("0")) {
      updateEstimate({ step: 7 });
      return `**No solar panels — moving on.**

Any **pressure washing** needed? (Driveways, patios, walkways, walls)

If yes, how many sides of your home? If not, say "**no**".`;
    }
    const panelMatch = msg.match(/\d+/);
    if (panelMatch) {
      const solarPanels = parseInt(panelMatch[0]);
      updateEstimate({ solarPanels, step: 7 });
      return `**${solarPanels} solar panels — added at $10 per panel.**

Any **pressure washing** needed? (Driveways, patios, walkways, walls)

How many sides of your home? Or say "**no**".`;
    }
    return `Please enter the number of solar panels, or say "**no**".`;
  }

  // Multiple services - pressure washing
  if (estimate.step === 7) {
    if (msg.includes("no") || msg.includes("none") || msg.includes("0")) {
      updateEstimate({ step: 8 });
      return `**No pressure washing — got it.**

How about **soft wash**? Great for stucco, painted surfaces, and delicate materials.

How many sides? Or say "**no**".`;
    }
    const sidesMatch = msg.match(/\d+/);
    if (sidesMatch) {
      const sides = Math.min(parseInt(sidesMatch[0]), 4);
      updateEstimate({ pressureWashSides: sides, step: 8 });
      return `**${sides} sides for pressure washing — locked in.**

How about **soft wash**? How many sides? Or say "**no**".`;
    }
    return `Please enter the number of sides (1-4), or say "**no**".`;
  }

  // Multiple services - soft wash
  if (estimate.step === 8) {
    if (msg.includes("no") || msg.includes("none") || msg.includes("0")) {
      updateEstimate({ step: 9 });
      return `**No soft wash.**

Last one: Interested in **permanent lighting** installation? (Starts at $1,300)

**Yes** or **No**?`;
    }
    const sidesMatch = msg.match(/\d+/);
    if (sidesMatch) {
      const sides = Math.min(parseInt(sidesMatch[0]), 4);
      updateEstimate({ softWashSides: sides, step: 9 });
      return `**${sides} sides for soft wash at $200/side — added.**

Last one: Interested in **permanent lighting**? (Starts at $1,300)

**Yes** or **No**?`;
    }
    return `Please enter the number of sides, or say "**no**".`;
  }

  // Multiple services - permanent lighting
  if (estimate.step === 9) {
    const wantsLighting =
      msg.includes("yes") || msg.includes("yeah") || msg.includes("yep");
    const updatedEstimate = { ...estimate, permanentLighting: wantsLighting };
    updateEstimate({ permanentLighting: wantsLighting, step: 16 });

    return `${wantsLighting ? "**Permanent lighting — your fortress will shine!**" : "**No lighting — all good.**"}

Here's your complete battle estimate:

${generateEstimateSummary(updatedEstimate)}

Ready to **schedule your free on-site estimate**? What's your name, warrior?`;
  }

  // Solar panel count (direct service)
  if (estimate.step === 10) {
    const panelMatch = msg.match(/\d+/);
    if (panelMatch) {
      const solarPanels = parseInt(panelMatch[0]);
      updateEstimate({ solarPanels, step: 11 });
      const total = solarPanels * 10;
      return `**${solarPanels} solar panels at $10 each = $${total}**

Do you also have **solar screens** that need cleaning? If yes, how many? If not, say "**no**".`;
    }
    return `Please enter the number of solar panels.`;
  }

  // Solar screens
  if (estimate.step === 11) {
    if (msg.includes("no") || msg.includes("none")) {
      updateEstimate({ step: 16 });
      return `${generateEstimateSummary(estimate)}

Ready to schedule? What's your name?`;
    }
    const screenMatch = msg.match(/\d+/);
    if (screenMatch) {
      const solarScreens = parseInt(screenMatch[0]);
      const updatedEst = { ...estimate, solarScreens };
      updateEstimate({ solarScreens, step: 16 });
      return `**${solarScreens} solar screens at $10 each — added!**

${generateEstimateSummary(updatedEst)}

Ready to schedule? What's your name?`;
    }
    return `Please enter the number of solar screens, or say "**no**".`;
  }

  // Pressure washing sides
  if (estimate.step === 12) {
    const sidesMatch = msg.match(/\d+/);
    if (sidesMatch) {
      const sides = Math.min(parseInt(sidesMatch[0]), 4);
      const price = 150 + (sides - 1) * 50;
      const updatedEst = { ...estimate, pressureWashSides: sides };
      updateEstimate({ pressureWashSides: sides, step: 16 });
      return `**${sides} sides for pressure washing — $${price}**

${generateEstimateSummary(updatedEst)}

Ready to schedule? What's your name?`;
    }
    return `How many sides need pressure washing? (1-4)`;
  }

  // Soft wash sides
  if (estimate.step === 14) {
    const sidesMatch = msg.match(/\d+/);
    if (sidesMatch) {
      const sides = Math.min(parseInt(sidesMatch[0]), 4);
      const price = sides * 200;
      const updatedEst = { ...estimate, softWashSides: sides };
      updateEstimate({ softWashSides: sides, step: 16 });
      return `**${sides} sides for soft wash — $${price}**

${generateEstimateSummary(updatedEst)}

Ready to schedule? What's your name?`;
    }
    return `How many sides need soft washing? (1-4)`;
  }

  // Contact info collection - name
  if (estimate.step === 16) {
    if (msg.length > 1 && !msg.match(/^\d+$/)) {
      updateEstimate({ name: userMessage, step: 17 });
      return `**Welcome to the Spartan family, ${userMessage}!**

What's the best phone number to reach you?`;
    }
    return `Please provide your name so we can personalize your service.`;
  }

  // Phone number
  if (estimate.step === 17) {
    const phoneMatch = msg.replace(/\D/g, "");
    if (phoneMatch.length >= 10) {
      updateEstimate({ phone: phoneMatch, step: 18 });
      return `**Phone number saved.**

Last thing — what's the address for service? (Street, City, State)`;
    }
    return `Please provide a valid phone number (10 digits).`;
  }

  // Address - trigger lead submission
  if (estimate.step === 18) {
    if (msg.length > 5) {
      updateEstimate({ address: userMessage, step: 19 });

      // Trigger async lead submission
      if (onSubmitLead) {
        onSubmitLead();
      }

      return `**SUBMITTING YOUR REQUEST...**

Please wait while we log your information.`;
    }
    return `Please provide your service address.`;
  }

  // Final step - any additional questions
  if (estimate.step === 19) {
    if (
      msg.includes("start over") ||
      msg.includes("new") ||
      msg.includes("reset")
    ) {
      updateEstimate(initialEstimate);
      return `**Fresh start, soldier!**

What service are you interested in?

1. **Window Cleaning**
2. **Solar Panel Cleaning**
3. **Pressure Washing**
4. **Soft Wash**
5. **Permanent Lighting**
6. **Multiple Services**`;
    }
    return `Your estimate request has been submitted! Call **(702) 509-3854** for immediate assistance.

Type "**start over**" to get a new estimate.`;
  }

  return `I'm not sure how to respond to that. Type "**start over**" to begin a new estimate, or call **(702) 509-3854**.`;
};

// Chat Component
export default function LeonidasChat() {
  const {
    isOpen,
    messages,
    isTyping,
    isSubmitting,
    toggleChat,
    addMessage,
    estimate,
    updateEstimate,
    setTyping,
    setSubmitting,
  } = useChatStore();

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const initializedRef = useRef(false);
  const lastSendTimeRef = useRef(0);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle lead submission
  const handleLeadSubmit = useCallback(async () => {
    setSubmitting(true);
    const result = await submitLead(estimate);
    setSubmitting(false);

    if (result.success) {
      addMessage(
        "bot",
        `**MISSION COMPLETE!**

Your information has been logged:
- **Name:** ${estimate.name}
- **Phone:** ${estimate.phone}
- **Address:** ${estimate.address}

**A Spartan warrior will contact you within 24 hours** to confirm your free on-site estimate.

For immediate assistance, call us directly at **(702) 509-3854**.

*"Clear Views, Cleaner Living"*

Anything else I can help you with?`,
      );
    } else {
      addMessage(
        "bot",
        `**We encountered an issue saving your information.**

Don't worry — please call us directly at **(702) 509-3854** and we'll get you scheduled right away.

Your estimated quote:
${generateEstimateSummary(estimate)}`,
      );
    }
  }, [estimate, addMessage, setSubmitting]);

  // Send initial message when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0 && !initializedRef.current) {
      initializedRef.current = true;
      setTyping(true);
      const timeoutId = setTimeout(() => {
        addMessage("bot", getBotResponse("", estimate, updateEstimate));
        setTyping(false);
      }, 800);

      return () => clearTimeout(timeoutId);
    }
  }, [
    isOpen,
    messages.length,
    estimate,
    updateEstimate,
    setTyping,
    addMessage,
  ]);

  const handleSend = useCallback(() => {
    // Prevent sends while typing or submitting
    if (isTyping || isSubmitting) return;

    // Rate limiting - 300ms between sends
    const now = Date.now();
    if (now - lastSendTimeRef.current < 300) return;
    lastSendTimeRef.current = now;

    // Input validation
    const trimmedInput = input.trim();
    if (!trimmedInput) return;
    if (trimmedInput.length > 500) {
      addMessage(
        "bot",
        "**Message too long.** Please keep your response under 500 characters.",
      );
      return;
    }

    // Max message count check
    if (messages.length > 100) {
      addMessage(
        "bot",
        "**Session limit reached.** Please call **(702) 509-3854** to continue.",
      );
      return;
    }

    setInput("");
    addMessage("user", trimmedInput);

    // Simulate typing delay
    setTyping(true);
    setTimeout(
      () => {
        const response = getBotResponse(
          trimmedInput,
          estimate,
          updateEstimate,
          handleLeadSubmit,
        );
        addMessage("bot", response);
        setTyping(false);
      },
      800 + Math.random() * 400,
    );
  }, [
    input,
    isTyping,
    isSubmitting,
    messages.length,
    estimate,
    updateEstimate,
    addMessage,
    setTyping,
    handleLeadSubmit,
  ]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Format message with markdown-like bold
  const formatMessage = (content: string) => {
    return content.split("\n").map((line, lineIndex) => (
      <span key={`line-${lineIndex}-${line.slice(0, 10)}`} className="block">
        {line.split(/(\*\*.*?\*\*)/).map((part, partIndex) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong
                key={`part-${lineIndex}-${partIndex}`}
                className="text-spartan-gold font-semibold"
              >
                {part.slice(2, -2)}
              </strong>
            );
          }
          if (
            part.startsWith("*") &&
            part.endsWith("*") &&
            !part.startsWith("**")
          ) {
            return (
              <em
                key={`part-${lineIndex}-${partIndex}`}
                className="text-spartan-cream/70"
              >
                {part.slice(1, -1)}
              </em>
            );
          }
          return part;
        })}
      </span>
    ));
  };

  // Show attention-grabbing tooltip after delay
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipDismissed, setTooltipDismissed] = useState(false);

  useEffect(() => {
    if (isOpen || tooltipDismissed) return;

    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 4000); // Show after 4 seconds

    return () => clearTimeout(timer);
  }, [isOpen, tooltipDismissed]);

  useEffect(() => {
    if (isOpen) {
      setShowTooltip(false);
      setTooltipDismissed(true);
    }
  }, [isOpen]);

  return (
    <>
      {/* LEONIDAS Chat Toggle - Dramatic Spartan Button */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${
          isOpen
            ? "scale-0 opacity-0 pointer-events-none"
            : "scale-100 opacity-100"
        }`}
      >
        {/* Attention-grabbing tooltip */}
        {showTooltip && !isOpen && (
          <div className="absolute bottom-full right-0 mb-4 animate-fade-in-up">
            <div className="relative bg-spartan-gold text-spartan-black px-4 py-3 font-display font-semibold text-sm tracking-wide whitespace-nowrap">
              <span className="mr-2">⚔️</span>
              Need a FREE estimate, warrior?
              <button
                onClick={() => setTooltipDismissed(true)}
                className="ml-3 text-spartan-black/60 hover:text-spartan-black"
                aria-label="Dismiss"
              >
                ✕
              </button>
              {/* Arrow pointing down */}
              <div className="absolute top-full right-8 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-spartan-gold" />
            </div>
          </div>
        )}

        {/* Pulsing glow rings */}
        <div className="absolute inset-0 -m-2">
          <div
            className="absolute inset-0 bg-spartan-gold/20 rounded-full animate-ping"
            style={{ animationDuration: "2s" }}
          />
          <div
            className="absolute inset-0 bg-spartan-gold/10 rounded-full animate-ping"
            style={{ animationDuration: "2s", animationDelay: "0.5s" }}
          />
        </div>

        {/* Main button with Spartan logo */}
        <button
          onClick={toggleChat}
          className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-gradient-to-br from-spartan-gold via-spartan-gold to-spartan-gold-dark border-2 border-spartan-gold-light hover:scale-110 transition-transform duration-300 group"
          aria-label="Chat with Leonidas for a free estimate"
          aria-expanded={isOpen}
          style={{
            boxShadow:
              "0 0 30px rgba(212, 175, 55, 0.5), 0 0 60px rgba(212, 175, 55, 0.3), inset 0 2px 0 rgba(255,255,255,0.2)",
          }}
        >
          {/* Spartan Logo */}
          <div className="relative w-10 h-10 sm:w-14 sm:h-14">
            <Image
              src="/spartan-logo.png"
              alt="Chat with Leonidas"
              fill
              className="object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
              sizes="(max-width: 640px) 40px, 56px"
            />
          </div>

          {/* Online indicator */}
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-spartan-emerald rounded-full border-2 border-spartan-gold flex items-center justify-center">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          </span>

          {/* Chat badge */}
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-spartan-black text-spartan-gold text-[10px] font-display font-bold px-2 py-0.5 border border-spartan-gold tracking-wider">
            CHAT
          </span>
        </button>
      </div>

      {/* Chat Window */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="leonidas-title"
        className={`fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-50 w-full sm:w-[400px] h-[100dvh] sm:h-[600px] sm:max-h-[80vh] flex flex-col bg-[#0a0a0a] border border-spartan-gold/30 sm:rounded-none overflow-hidden transition-all duration-300 ${
          isOpen
            ? "translate-y-0 opacity-100"
            : "translate-y-full sm:translate-y-8 opacity-0 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-spartan-gold/30 bg-gradient-to-r from-[#0a0a0a] to-[#1a1a1a]">
          <div className="relative w-12 h-12 flex items-center justify-center bg-spartan-gold/20 border border-spartan-gold/50">
            <Image
              src="/spartan-logo.png"
              alt=""
              width={40}
              height={40}
              className="object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
            <span
              className="absolute -bottom-1 -right-1 w-3 h-3 bg-spartan-emerald rounded-full border-2 border-[#0a0a0a]"
              aria-hidden="true"
            />
          </div>
          <div className="flex-1">
            <h3
              id="leonidas-title"
              className="text-spartan-gold font-display font-semibold tracking-wide"
            >
              LEONIDAS
            </h3>
            <p className="text-xs text-spartan-cream/60">
              Spartan Estimator Bot
            </p>
          </div>
          <button
            onClick={toggleChat}
            className="w-10 h-10 flex items-center justify-center text-spartan-cream/60 hover:text-spartan-gold transition-colors"
            aria-label="Close chat"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {/* Spartan Avatar for bot messages */}
              {message.role === "bot" && (
                <div className="flex-shrink-0 w-8 h-8 relative">
                  <Image
                    src="/spartan-logo.png"
                    alt=""
                    fill
                    className="object-contain"
                    sizes="32px"
                  />
                </div>
              )}
              <div
                className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed ${
                  message.role === "user"
                    ? "chat-bubble-user"
                    : "chat-bubble-bot"
                }`}
              >
                {formatMessage(message.content)}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-2 justify-start">
              <div className="flex-shrink-0 w-8 h-8 relative">
                <Image
                  src="/spartan-logo.png"
                  alt=""
                  fill
                  className="object-contain animate-pulse"
                  sizes="32px"
                />
              </div>
              <div
                className="chat-bubble-bot px-4 py-3 flex items-center gap-1"
                aria-live="polite"
                aria-label="Leonidas is typing"
              >
                <span className="typing-dot w-2 h-2 bg-spartan-gold rounded-full" />
                <span className="typing-dot w-2 h-2 bg-spartan-gold rounded-full" />
                <span className="typing-dot w-2 h-2 bg-spartan-gold rounded-full" />
              </div>
            </div>
          )}

          {/* Submitting indicator */}
          {isSubmitting && (
            <div className="flex gap-2 justify-start">
              <div className="flex-shrink-0 w-8 h-8 relative">
                <Image
                  src="/spartan-logo.png"
                  alt=""
                  fill
                  className="object-contain"
                  sizes="32px"
                />
              </div>
              <div
                className="chat-bubble-bot px-4 py-3 text-sm"
                aria-live="polite"
              >
                <span className="text-spartan-gold animate-pulse">
                  ⚔️ Preparing your estimate...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-spartan-gold/30 bg-[#0a0a0a]">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              aria-label="Message to Leonidas estimator"
              className="flex-1 input-spartan px-4 py-3 text-sm"
              maxLength={500}
              disabled={isSubmitting}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping || isSubmitting}
              className="w-12 h-12 flex items-center justify-center btn-spartan disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </button>
          </div>
          <p className="text-center text-xs text-spartan-cream/40 mt-2">
            Call{" "}
            <a
              href="tel:7025093854"
              className="text-spartan-gold hover:underline"
            >
              (702) 509-3854
            </a>{" "}
            for immediate assistance
          </p>
        </div>
      </div>
    </>
  );
}
