import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ScrollReveal } from "./scroll-reveal";

describe("ScrollReveal Component", () => {
  const observeMock = vi.fn();
  const disconnectMock = vi.fn();
  const unobserveMock = vi.fn();

  beforeEach(() => {
    global.IntersectionObserver = vi.fn().mockImplementation(function(callback) {
      return {
        observe: observeMock,
        disconnect: disconnectMock,
        unobserve: unobserveMock,
        trigger: callback,
      };
    }) as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render children", () => {
    render(
      <ScrollReveal>
        <div data-testid="child">Hello</div>
      </ScrollReveal>
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("should start with transition classes and fade in on intersection", () => {
    render(
      <ScrollReveal direction="up" className="custom-class">
        <div>Content</div>
      </ScrollReveal>
    );

    const revealEl = screen.getByTestId("scroll-reveal-container");
    expect(revealEl).toHaveClass("opacity-0");
    expect(revealEl).toHaveClass("translate-y-10");

    // Call the IntersectionObserver callback with isIntersecting = true
    const calls = vi.mocked(global.IntersectionObserver).mock.calls;
    const callback = calls[0][0];

    act(() => {
      callback(
        [{ isIntersecting: true, target: revealEl } as unknown as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    expect(revealEl).toHaveClass("opacity-100");
    expect(revealEl).toHaveClass("translate-y-0");
  });
});
