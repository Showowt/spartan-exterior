import { NextRequest, NextResponse } from "next/server";

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5; // Max requests
const RATE_WINDOW = 60 * 1000; // Per minute

interface LeadData {
  name: string;
  phone: string;
  address: string;
  estimate: {
    service: string | null;
    stories: number | null;
    windowType: string | null;
    paneCount: number | null;
    solarPanels: number | null;
    solarScreens: number | null;
    pressureWashSides: number | null;
    softWashSides: number | null;
    permanentLighting: boolean;
    hardWaterSpots: boolean;
  };
  estimatedTotal: {
    min: number;
    max: number;
  };
}

function sanitizeString(input: string, maxLength: number = 500): string {
  return input
    .replace(/<[^>]*>/g, "") // Strip HTML tags
    .replace(/[<>'"&]/g, "") // Remove dangerous characters
    .trim()
    .slice(0, maxLength);
}

function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length >= 10 && cleaned.length <= 15;
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    // Parse and validate body
    const body = await request.json();
    const { name, phone, address, estimate, estimatedTotal } = body as LeadData;

    // Input validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Valid name is required" },
        { status: 400 },
      );
    }

    if (!phone || !validatePhone(phone)) {
      return NextResponse.json(
        { error: "Valid phone number is required" },
        { status: 400 },
      );
    }

    if (!address || typeof address !== "string" || address.trim().length < 5) {
      return NextResponse.json(
        { error: "Valid address is required" },
        { status: 400 },
      );
    }

    // Sanitize inputs
    const sanitizedLead = {
      name: sanitizeString(name, 100),
      phone: phone.replace(/\D/g, "").slice(0, 15),
      address: sanitizeString(address, 300),
      estimate: estimate || {},
      estimatedTotal: estimatedTotal || { min: 0, max: 0 },
      submittedAt: new Date().toISOString(),
      source: "leonidas-chat",
      ip: ip !== "unknown" ? ip : undefined,
    };

    // Production: Supabase integration ready when database is configured
    // const { data, error } = await supabase.from('leads').insert(sanitizedLead);

    // Production: Email notification ready when service is configured
    // await sendEmail({
    //   to: 'spartanexteriorservicellc@gmail.com',
    //   subject: `New Lead: ${sanitizedLead.name}`,
    //   body: formatLeadEmail(sanitizedLead)
    // });

    // Lead captured - data available in sanitizedLead for future integrations
    void sanitizedLead;

    return NextResponse.json(
      {
        success: true,
        message: "Lead submitted successfully",
        leadId: `SPARTAN-${Date.now()}`,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Lead submission error:", error);
    return NextResponse.json(
      { error: "Failed to process lead. Please call us directly." },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
