import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { TypingText } from "./typing-text";

describe("TypingText Component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render null when texts array is empty", () => {
    const { container } = render(<TypingText texts={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("should start typing the first word", () => {
    render(<TypingText texts={["Hello", "World"]} typeSpeed={100} />);
    
    expect(screen.getByTestId("typing-text").textContent).toBe("");

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(screen.getByTestId("typing-text").textContent).toBe("H");

    // Advance 4 more times, 100ms each, to finish "Hello"
    for (let i = 0; i < 4; i++) {
      act(() => {
        vi.advanceTimersByTime(100);
      });
    }
    expect(screen.getByTestId("typing-text").textContent).toBe("Hello");
  });

  it("should delay and then delete the word", () => {
    render(<TypingText texts={["Hi"]} typeSpeed={100} backSpeed={50} delayBetween={1000} />);

    // Advance 2 times to type "Hi"
    for (let i = 0; i < 2; i++) {
      act(() => {
        vi.advanceTimersByTime(100);
      });
    }
    expect(screen.getByTestId("typing-text").textContent).toBe("Hi");

    // Wait for the delay (1000ms)
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Delete first letter (50ms)
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(screen.getByTestId("typing-text").textContent).toBe("H");

    // Delete second letter (50ms)
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(screen.getByTestId("typing-text").textContent).toBe("");
  });
});
