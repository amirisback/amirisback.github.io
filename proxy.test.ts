import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock next/server before importing proxy
vi.mock("next/server", () => ({
  NextResponse: {
    redirect: vi.fn((url: URL) => ({ type: "redirect", url: url.toString() })),
  },
}));

import { proxy } from "./proxy";

// ============================================================
// Helper to create mock NextRequest
// ============================================================
function createMockRequest(
  pathname: string,
  acceptLanguage?: string
): Parameters<typeof proxy>[0] {
  const url = new URL(`http://localhost:3000${pathname}`);
  return {
    headers: {
      get: (name: string) => {
        if (name === "accept-language") return acceptLanguage ?? null;
        return null;
      },
    },
    nextUrl: {
      pathname,
      set pathname(v: string) {
        this._pathname = v;
      },
      get pathname() {
        return this._pathname ?? pathname;
      },
      _pathname: undefined as string | undefined,
      toString: () => url.toString(),
    },
  } as unknown as Parameters<typeof proxy>[0];
}

// ============================================================
// proxy function
// ============================================================
describe("proxy", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return undefined when pathname already has a valid locale prefix", () => {
    const request = createMockRequest("/id/about");
    const result = proxy(request);
    expect(result).toBeUndefined();
  });

  it("should return undefined for exact locale path", () => {
    const request = createMockRequest("/en");
    const result = proxy(request);
    expect(result).toBeUndefined();
  });

  it("should skip _next internal paths", () => {
    const request = createMockRequest("/_next/static/chunk.js");
    const result = proxy(request);
    expect(result).toBeUndefined();
  });

  it("should skip /api paths", () => {
    const request = createMockRequest("/api/data");
    const result = proxy(request);
    expect(result).toBeUndefined();
  });

  it("should skip /sw.js path", () => {
    const request = createMockRequest("/sw.js");
    const result = proxy(request);
    expect(result).toBeUndefined();
  });

  it("should skip /manifest path", () => {
    const request = createMockRequest("/manifest.webmanifest");
    const result = proxy(request);
    expect(result).toBeUndefined();
  });

  it("should skip paths with file extensions", () => {
    const request = createMockRequest("/favicon.ico");
    const result = proxy(request);
    expect(result).toBeUndefined();
  });

  it("should redirect root path to default locale", () => {
    const request = createMockRequest("/");
    const result = proxy(request);
    expect(result).toBeDefined();
  });

  it("should redirect unlocalized path to locale-prefixed path", () => {
    const request = createMockRequest("/about");
    const result = proxy(request);
    expect(result).toBeDefined();
  });

  it("should detect 'en' locale from Accept-Language header", () => {
    const request = createMockRequest("/about", "en-US,en;q=0.9");
    proxy(request);
    // The pathname should be updated to /en/about
    expect(request.nextUrl.pathname).toBe("/en/about");
  });

  it("should detect 'id' locale from Accept-Language header", () => {
    const request = createMockRequest("/about", "id-ID,id;q=0.9");
    proxy(request);
    expect(request.nextUrl.pathname).toBe("/id/about");
  });

  it("should fallback to default locale when Accept-Language has no match", () => {
    const request = createMockRequest("/about", "fr-FR,fr;q=0.9");
    proxy(request);
    expect(request.nextUrl.pathname).toBe("/id/about");
  });

  it("should fallback to default locale when no Accept-Language header", () => {
    const request = createMockRequest("/about");
    proxy(request);
    expect(request.nextUrl.pathname).toBe("/id/about");
  });

  it("should prioritize higher quality locale in Accept-Language", () => {
    const request = createMockRequest("/about", "en;q=0.5,id;q=0.9");
    proxy(request);
    expect(request.nextUrl.pathname).toBe("/id/about");
  });
});
