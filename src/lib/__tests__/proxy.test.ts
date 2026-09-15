import { describe, it, expect, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "../../proxy";
import { resetRateLimitStore } from "../rate-limiter";

describe("Next.js Proxy Handler", () => {
  beforeEach(() => {
    resetRateLimitStore();
  });

  it("should return 403 on suspicious probe path", () => {
    const req = new NextRequest("http://localhost:3000/.env", {
      headers: { "x-forwarded-for": "10.0.0.1" },
    });
    const res = proxy(req);
    expect(res.status).toBe(403);
  });

  it("should return 403 on malicious scanner user-agent", () => {
    const req = new NextRequest("http://localhost:3000/about", {
      headers: {
        "x-forwarded-for": "10.0.0.1",
        "user-agent": "sqlmap/1.4",
      },
    });
    const res = proxy(req);
    expect(res.status).toBe(403);
  });

  it("should attach rate limit headers for valid requests", () => {
    const req = new NextRequest("http://localhost:3000/about", {
      headers: {
        "x-forwarded-for": "10.0.0.2",
        "user-agent": "Mozilla/5.0",
      },
    });
    const res = proxy(req);
    expect(res.status).toBe(200);
    expect(res.headers.get("X-RateLimit-Limit")).toBe("120");
    expect(res.headers.get("X-RateLimit-Remaining")).toBe("119");
  });

  it("should return 429 when rate limit exceeded on rapid requests", () => {
    const ip = "10.0.0.99";
    // Send 11 requests to a route with limit 10 (/auth/login)
    let lastRes;
    for (let i = 0; i < 11; i++) {
      const req = new NextRequest("http://localhost:3000/auth/login", {
        headers: {
          "x-forwarded-for": ip,
          "user-agent": "Mozilla/5.0",
        },
      });
      lastRes = proxy(req);
    }
    expect(lastRes?.status).toBe(429);
    expect(lastRes?.headers.get("Retry-After")).toBeDefined();
  });
});
