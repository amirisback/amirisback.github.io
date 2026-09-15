import { describe, it, expect, beforeEach } from "vitest";
import {
  checkRateLimit,
  getClientIp,
  getRouteTier,
  resetRateLimitStore,
} from "../rate-limiter";

describe("Rate Limiter Utility", () => {
  beforeEach(() => {
    resetRateLimitStore();
  });

  describe("getClientIp", () => {
    it("should prioritize cf-connecting-ip", () => {
      const headers = new Headers({
        "cf-connecting-ip": "1.1.1.1",
        "x-forwarded-for": "2.2.2.2, 3.3.3.3",
        "x-real-ip": "4.4.4.4",
      });
      expect(getClientIp(headers)).toBe("1.1.1.1");
    });

    it("should extract first IP from x-forwarded-for if cf-connecting-ip is missing", () => {
      const headers = new Headers({
        "x-forwarded-for": "203.0.113.195, 70.41.3.18",
        "x-real-ip": "70.41.3.18",
      });
      expect(getClientIp(headers)).toBe("203.0.113.195");
    });

    it("should fallback to x-real-ip if previous headers are missing", () => {
      const headers = new Headers({
        "x-real-ip": "198.51.100.22",
      });
      expect(getClientIp(headers)).toBe("198.51.100.22");
    });

    it("should fallback to 127.0.0.1 if no IP headers are present", () => {
      const headers = new Headers();
      expect(getClientIp(headers)).toBe("127.0.0.1");
    });
  });

  describe("getRouteTier", () => {
    it("should return strict tier for auth/sensitive endpoints", () => {
      const tier = getRouteTier("/auth/login");
      expect(tier.limit).toBe(10);
      expect(tier.windowMs).toBe(60000);
    });

    it("should return moderate tier for API endpoints", () => {
      const tier = getRouteTier("/api/users");
      expect(tier.limit).toBe(30);
      expect(tier.windowMs).toBe(60000);
    });

    it("should return standard tier for general UI routes", () => {
      const tier = getRouteTier("/about");
      expect(tier.limit).toBe(120);
      expect(tier.windowMs).toBe(60000);
    });
  });

  describe("checkRateLimit", () => {
    it("should allow requests under the limit and decrement remaining", () => {
      const ip = "192.168.1.10";
      const limit = 3;
      const windowMs = 5000;

      const res1 = checkRateLimit(ip, limit, windowMs);
      expect(res1.success).toBe(true);
      expect(res1.limit).toBe(3);
      expect(res1.remaining).toBe(2);

      const res2 = checkRateLimit(ip, limit, windowMs);
      expect(res2.success).toBe(true);
      expect(res2.remaining).toBe(1);

      const res3 = checkRateLimit(ip, limit, windowMs);
      expect(res3.success).toBe(true);
      expect(res3.remaining).toBe(0);

      // 4th request exceeds limit
      const res4 = checkRateLimit(ip, limit, windowMs);
      expect(res4.success).toBe(false);
      expect(res4.remaining).toBe(0);
      expect(res4.retryAfter).toBeGreaterThanOrEqual(1);
    });

    it("should track different identifiers independently", () => {
      const limit = 2;
      const windowMs = 5000;

      checkRateLimit("ip-1", limit, windowMs);
      checkRateLimit("ip-1", limit, windowMs);
      const res1 = checkRateLimit("ip-1", limit, windowMs);
      expect(res1.success).toBe(false);

      const res2 = checkRateLimit("ip-2", limit, windowMs);
      expect(res2.success).toBe(true);
      expect(res2.remaining).toBe(1);
    });
  });
});
