import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getClientIp, getRouteTier, checkRateLimit } from "./lib/rate-limiter";
import { isSuspiciousPath, isMaliciousBot } from "./lib/security-guards";

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get("user-agent");

  // 1. Probe & Path Scanner Filter
  if (isSuspiciousPath(pathname)) {
    return new NextResponse(
      JSON.stringify({
        error: "Forbidden",
        message: "Suspicious request path detected and blocked.",
      }),
      {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // 2. Malicious Bot & Scanner Filter
  if (isMaliciousBot(userAgent)) {
    return new NextResponse(
      JSON.stringify({
        error: "Forbidden",
        message: "Automated vulnerability scanner blocked.",
      }),
      {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // 3. Rate Limiting Check
  const ip = getClientIp(request.headers);
  const tier = getRouteTier(pathname);
  const rateLimitIdentifier = `${ip}:${pathname.startsWith("/api") ? "api" : "web"}`;
  const rateLimitResult = checkRateLimit(
    rateLimitIdentifier,
    tier.limit,
    tier.windowMs
  );

  if (!rateLimitResult.success) {
    return new NextResponse(
      JSON.stringify({
        error: "Too Many Requests",
        message: "You have exceeded the request rate limit. Please try again later.",
        retryAfter: rateLimitResult.retryAfter,
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(rateLimitResult.retryAfter ?? 60),
          "X-RateLimit-Limit": String(rateLimitResult.limit),
          "X-RateLimit-Remaining": String(rateLimitResult.remaining),
          "X-RateLimit-Reset": String(rateLimitResult.reset),
        },
      }
    );
  }

  // 4. Pass-through with rate limit informational headers
  const response = NextResponse.next();
  response.headers.set("X-RateLimit-Limit", String(rateLimitResult.limit));
  response.headers.set("X-RateLimit-Remaining", String(rateLimitResult.remaining));
  response.headers.set("X-RateLimit-Reset", String(rateLimitResult.reset));

  return response;
}

export const config = {
  matcher: [
    // Apply security & rate limits to all routes except Next.js internals, static assets, and PWA files
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|manifest.json|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};
