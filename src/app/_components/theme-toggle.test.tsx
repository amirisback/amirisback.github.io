import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeToggle } from "./theme-toggle";

// Mock the useTheme hook
const mockToggleTheme = vi.fn();
let mockTheme = "system";

vi.mock("@/app/_hooks/use-theme", () => ({
  useTheme: () => ({
    theme: mockTheme,
    resolvedTheme: mockTheme === "dark" ? "dark" : "light",
    setTheme: vi.fn(),
    toggleTheme: mockToggleTheme,
  }),
}));

describe("ThemeToggle", () => {
  beforeEach(() => {
    mockTheme = "system";
    mockToggleTheme.mockClear();
  });

  it("should render the toggle button", () => {
    render(<ThemeToggle />);

    const button = screen.getByTestId("theme-toggle");
    expect(button).toBeInTheDocument();
  });

  it("should display the correct aria-label for system theme", () => {
    mockTheme = "system";
    render(<ThemeToggle />);

    const button = screen.getByTestId("theme-toggle");
    expect(button).toHaveAttribute(
      "aria-label",
      "Current theme: System. Click to switch.",
    );
  });

  it("should display the correct aria-label for light theme", () => {
    mockTheme = "light";
    render(<ThemeToggle />);

    const button = screen.getByTestId("theme-toggle");
    expect(button).toHaveAttribute(
      "aria-label",
      "Current theme: Light. Click to switch.",
    );
  });

  it("should display the correct aria-label for dark theme", () => {
    mockTheme = "dark";
    render(<ThemeToggle />);

    const button = screen.getByTestId("theme-toggle");
    expect(button).toHaveAttribute(
      "aria-label",
      "Current theme: Dark. Click to switch.",
    );
  });

  it("should call toggleTheme when clicked", () => {
    render(<ThemeToggle />);

    const button = screen.getByTestId("theme-toggle");
    fireEvent.click(button);

    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it("should apply additional className when provided", () => {
    render(<ThemeToggle className="extra-class" />);

    const button = screen.getByTestId("theme-toggle");
    expect(button.className).toContain("extra-class");
  });

  it("should render an SVG icon", () => {
    render(<ThemeToggle />);

    const button = screen.getByTestId("theme-toggle");
    const svg = button.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});
