import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Mock server-only in Vitest test environment
vi.mock("server-only", () => ({}));
