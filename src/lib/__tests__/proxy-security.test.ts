import { describe, it, expect } from "vitest";
import { isSuspiciousPath, isMaliciousBot } from "../security-guards";

describe("Security Guards", () => {
  describe("isSuspiciousPath", () => {
    it("should detect suspicious files and sensitive environment paths", () => {
      expect(isSuspiciousPath("/.env")).toBe(true);
      expect(isSuspiciousPath("/.env.local")).toBe(true);
      expect(isSuspiciousPath("/.git/config")).toBe(true);
      expect(isSuspiciousPath("/.aws/credentials")).toBe(true);
      expect(isSuspiciousPath("/app.bak")).toBe(true);
    });

    it("should detect CMS/Admin probes and common exploit endpoints", () => {
      expect(isSuspiciousPath("/wp-login.php")).toBe(true);
      expect(isSuspiciousPath("/wp-admin/admin-ajax.php")).toBe(true);
      expect(isSuspiciousPath("/phpmyadmin/index.php")).toBe(true);
      expect(isSuspiciousPath("/xmlrpc.php")).toBe(true);
      expect(isSuspiciousPath("/cgi-bin/test.cgi")).toBe(true);
    });

    it("should detect path traversal attempts", () => {
      expect(isSuspiciousPath("/../../etc/passwd")).toBe(true);
      expect(isSuspiciousPath("/static/%2e%2e/secret")).toBe(true);
    });

    it("should allow valid application paths", () => {
      expect(isSuspiciousPath("/")).toBe(false);
      expect(isSuspiciousPath("/about")).toBe(false);
      expect(isSuspiciousPath("/api/users")).toBe(false);
      expect(isSuspiciousPath("/dashboard/settings")).toBe(false);
    });
  });

  describe("isMaliciousBot", () => {
    it("should identify automated vulnerability scanners", () => {
      expect(isMaliciousBot("sqlmap/1.5.2#stable")).toBe(true);
      expect(isMaliciousBot("Nikto/2.1.6")).toBe(true);
      expect(isMaliciousBot("masscan/1.0")).toBe(true);
      expect(isMaliciousBot("WPScan v3.8.20")).toBe(true);
      expect(isMaliciousBot("Acunetix-Product")).toBe(true);
      expect(isMaliciousBot("Nmap Scripting Engine")).toBe(true);
      expect(isMaliciousBot("dirbuster/0.12")).toBe(true);
    });

    it("should allow standard browser user agents", () => {
      expect(
        isMaliciousBot(
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
      ).toBe(false);
      expect(
        isMaliciousBot(
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
        )
      ).toBe(false);
      expect(isMaliciousBot(null)).toBe(false);
    });
  });
});
