import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { TiltCard3D } from "./tilt-card-3d";

describe("TiltCard3D Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render children correctly", () => {
    render(
      <TiltCard3D>
        <div>Test Content</div>
      </TiltCard3D>
    );

    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("should update transform and glare on pointer move", () => {
    const { container } = render(
      <TiltCard3D maxTilt={15} scale={1.05} glare={true}>
        <div>Card Inner</div>
      </TiltCard3D>
    );

    const card = container.firstChild as HTMLDivElement;
    // Mock getBoundingClientRect
    vi.spyOn(card, "getBoundingClientRect").mockReturnValue({
      width: 200,
      height: 200,
      left: 0,
      top: 0,
      right: 200,
      bottom: 200,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    fireEvent.pointerMove(card, { clientX: 150, clientY: 50 });

    const glare = screen.getByTestId("tilt-glare");
    expect(glare).toBeInTheDocument();
    expect(card.style.transform).toContain("perspective(1000px)");
    expect(card.style.transform).toContain("rotateX");
    expect(card.style.transform).toContain("rotateY");
  });

  it("should reset transform on pointer leave", () => {
    const { container } = render(
      <TiltCard3D>
        <div>Card Inner</div>
      </TiltCard3D>
    );

    const card = container.firstChild as HTMLDivElement;
    vi.spyOn(card, "getBoundingClientRect").mockReturnValue({
      width: 200,
      height: 200,
      left: 0,
      top: 0,
      right: 200,
      bottom: 200,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    fireEvent.pointerMove(card, { clientX: 150, clientY: 50 });
    fireEvent.pointerLeave(card);

    expect(card.style.transform).toContain("rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  });

  it("should not apply tilt when disabled is true", () => {
    const { container } = render(
      <TiltCard3D disabled={true} glare={true}>
        <div>Disabled Card</div>
      </TiltCard3D>
    );

    const card = container.firstChild as HTMLDivElement;
    vi.spyOn(card, "getBoundingClientRect").mockReturnValue({
      width: 200,
      height: 200,
      left: 0,
      top: 0,
      right: 200,
      bottom: 200,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    fireEvent.pointerMove(card, { clientX: 150, clientY: 50 });

    // When disabled, glare should not render and transform style should not be set
    expect(screen.queryByTestId("tilt-glare")).not.toBeInTheDocument();
    expect(card.style.transform).toBe("");
  });

  it("should respect prefers-reduced-motion media query", () => {
    const matchMediaMock = vi.fn().mockImplementation((query: string) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    window.matchMedia = matchMediaMock;

    const { container } = render(
      <TiltCard3D>
        <div>Accessible Card</div>
      </TiltCard3D>
    );

    const card = container.firstChild as HTMLDivElement;
    fireEvent.pointerMove(card, { clientX: 150, clientY: 50 });

    // Glare should not be rendered when reduced motion is preferred
    expect(screen.queryByTestId("tilt-glare")).not.toBeInTheDocument();
    expect(card.style.transform).toBe("");
  });
});
