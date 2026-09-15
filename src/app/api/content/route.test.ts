import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "./route";
import { readContent, writeContent, type PortfolioData } from "@/lib/content";

// Mock the content helper functions
vi.mock("@/lib/content", () => ({
  readContent: vi.fn(),
  writeContent: vi.fn(),
}));

describe("Content Route Handler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET", () => {
    it("should return 200 with content data on success", async () => {
      const mockData = { test: "data" };
      vi.mocked(readContent).mockResolvedValue(mockData as unknown as PortfolioData);

      const response = await GET();
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual(mockData);
      expect(readContent).toHaveBeenCalled();
    });

    it("should return 500 when reading content fails", async () => {
      vi.mocked(readContent).mockRejectedValue(new Error("Disk error"));

      const response = await GET();
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body.error).toBe("Failed to read content: Disk error");
    });
  });

  describe("POST", () => {
    it("should write contents and return 200 with success status", async () => {
      const mockPayload = { brand: "New Brand" };
      const request = new Request("http://localhost/api/content", {
        method: "POST",
        body: JSON.stringify(mockPayload),
      });

      vi.mocked(writeContent).mockResolvedValue();

      const response = await POST(request);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.message).toBe("Content saved!");
      expect(writeContent).toHaveBeenCalledWith(mockPayload);
    });

    it("should return 400 when writing content fails", async () => {
      const request = new Request("http://localhost/api/content", {
        method: "POST",
        body: "invalid-json",
      });

      const response = await POST(request);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.error).toBeDefined();
    });
  });
});
