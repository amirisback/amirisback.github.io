import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { HeroBackground3D } from "./hero-background-3d";

describe("HeroBackground3D Component", () => {
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    vi.clearAllMocks();
    originalMatchMedia = window.matchMedia;

    // Mock HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
      clearRect: vi.fn(),
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      scale: vi.fn(),
      setTransform: vi.fn(),
      lineWidth: 1,
      strokeStyle: "",
      fillStyle: "",
      globalAlpha: 1,
    } as unknown as CanvasRenderingContext2D);

    // Mock getBoundingClientRect for canvas
    HTMLCanvasElement.prototype.getBoundingClientRect = vi.fn().mockReturnValue({
      width: 800,
      height: 600,
      left: 0,
      top: 0,
      right: 800,
      bottom: 600,
      x: 0,
      y: 0,
      toJSON: () => {},
    });
  });

  afterEach(() => {
    cleanup();
    window.matchMedia = originalMatchMedia;
  });

  it("should render the canvas element with proper accessibility attributes", () => {
    render(<HeroBackground3D />);

    const canvas = screen.getByTestId("hero-background-3d");
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveAttribute("aria-hidden", "true");
  });

  it("should accept custom props and render cleanly", () => {
    render(<HeroBackground3D particleCount={20} focalLength={400} maxDistance={90} />);

    const canvas = screen.getByTestId("hero-background-3d");
    expect(canvas).toBeInTheDocument();
  });

  it("should cleanup animation frame and event listeners on unmount", () => {
    const cancelAnimationFrameSpy = vi.spyOn(window, "cancelAnimationFrame");
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = render(<HeroBackground3D />);
    unmount();

    expect(cancelAnimationFrameSpy).toHaveBeenCalled();
    expect(removeEventListenerSpy).toHaveBeenCalledWith("mousemove", expect.any(Function));
  });

  it("should respect prefers-reduced-motion", () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const requestAnimationFrameSpy = vi.spyOn(window, "requestAnimationFrame");

    render(<HeroBackground3D />);

    const canvas = screen.getByTestId("hero-background-3d");
    expect(canvas).toBeInTheDocument();
    // In reduced motion, loop does not queue continuous requestAnimationFrame
    expect(requestAnimationFrameSpy).not.toHaveBeenCalled();
  });

  it("should handle showPolyhedron toggle and window mouse events", () => {
    const { unmount } = render(<HeroBackground3D showPolyhedron={false} />);

    // Simulate mouse movements
    window.dispatchEvent(new MouseEvent("mousemove", { clientX: 300, clientY: 200 }));
    window.dispatchEvent(new MouseEvent("mouseleave"));

    const canvas = screen.getByTestId("hero-background-3d");
    expect(canvas).toBeInTheDocument();

    unmount();
  });
});
