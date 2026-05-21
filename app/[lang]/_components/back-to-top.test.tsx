import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BackToTop } from "./back-to-top";

describe("BackToTop Component", () => {
  it("should be hidden initially and appear after scrolling down", () => {
    render(<BackToTop />);

    const button = screen.getByTestId("back-to-top");
    expect(button).toHaveClass("opacity-0");

    // Scroll window down
    Object.defineProperty(window, "scrollY", { value: 250, writable: true });
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    expect(button).toHaveClass("opacity-100");

    // Scroll window back up
    Object.defineProperty(window, "scrollY", { value: 50, writable: true });
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    expect(button).toHaveClass("opacity-0");
  });

  it("should scroll window to top when clicked", () => {
    const scrollToMock = vi.fn();
    window.scrollTo = scrollToMock;

    render(<BackToTop />);

    const button = screen.getByTestId("back-to-top");
    fireEvent.click(button);

    expect(scrollToMock).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });
});
