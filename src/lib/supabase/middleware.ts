import { type NextRequest, NextResponse } from "next/server";

/**
 * Placeholder middleware for Supabase session handling
 * Currently passes through all requests - enable when Supabase auth is configured
 */
export async function updateSession(request: NextRequest) {
  // Pass through all requests for now
  // When Supabase is configured, this will refresh the auth session
  return NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
}
