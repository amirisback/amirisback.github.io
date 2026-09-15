import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Hero } from "./hero";

vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: { src: string; alt?: string; [key: string]: unknown }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt || ""} {...props} />;
  },
}));

// Mock TypingText since it is tested separately
vi.mock("./typing-text", () => ({
  TypingText: ({ texts }: { texts: string[] }) => (
    <span data-testid="mock-typing">{texts.join(", ")}</span>
  ),
}));

describe("Hero Component", () => {
  const mockHeroData = {
    greeting: "Hello, I am",
    name: "Muhammad Faisal Amir",
    typedTexts: ["Android Developer", "Kotlin Enthusiast"],
    heroImage: "img/hero.png",
    videoBackground: "1eeqZNn-k0Y",
    buttons: [
      { label: "CV", href: "/docs/cv.pdf" },
      { label: "GitHub", href: "https://github.com" },
    ],
  };

  it("should render greeting and name correctly", () => {
    render(<Hero data={mockHeroData} />);

    expect(screen.getByText("Hello, I am")).toBeInTheDocument();
    expect(screen.getByText("Muhammad Faisal Amir")).toBeInTheDocument();
    expect(screen.getByTestId("mock-typing").textContent).toBe(
      "Android Developer, Kotlin Enthusiast"
    );
  });

  it("should render action buttons with correct href", () => {
    render(<Hero data={mockHeroData} />);

    const cvBtn = screen.getByText("CV");
    const githubBtn = screen.getByText("GitHub");

    expect(cvBtn).toHaveAttribute("href", "/docs/cv.pdf");
    expect(githubBtn).toHaveAttribute("href", "https://github.com");
  });

  it("should render video background iframe when videoBackground is provided", () => {
    render(<Hero data={mockHeroData} />);

    const iframe = document.getElementById("hero-youtube-video");
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute(
      "src",
      expect.stringContaining("https://www.youtube.com/embed/1eeqZNn-k0Y")
    );
  });

  it("should not render iframe when videoBackground is empty", () => {
    const dataWithoutVideo = { ...mockHeroData, videoBackground: undefined };
    render(<Hero data={dataWithoutVideo} />);

    const iframe = document.getElementById("hero-youtube-video");
    expect(iframe).not.toBeInTheDocument();
  });
});
