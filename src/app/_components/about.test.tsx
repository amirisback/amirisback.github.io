import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { About } from "./about";

vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: { src: string; alt?: string; [key: string]: unknown }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt || ""} {...props} />;
  },
}));

vi.mock("./scroll-reveal", () => ({
  ScrollReveal: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("About Component", () => {
  const mockAboutData = {
    image: "img/about.png",
    description: "I am a Software Engineer.",
  };

  const mockDict = {
    about: {
      sectionLabel: "About Me",
      sectionTitle: "My Info",
    },
  };

  it("should render correctly with title and description", () => {
    render(<About data={mockAboutData} dict={mockDict} />);

    expect(screen.getByText("About Me")).toBeInTheDocument();
    expect(screen.getByText("My Info")).toBeInTheDocument();
    expect(screen.getByText("I am a Software Engineer.")).toBeInTheDocument();
  });

  it("should render multiple paragraphs when description contains double newlines", () => {
    const multiParagraphData = {
      image: "img/about.png",
      description: "First paragraph about software engineering.\n\nSecond paragraph about clean architecture.",
    };
    render(<About data={multiParagraphData} dict={mockDict} />);

    expect(screen.getByText("First paragraph about software engineering.")).toBeInTheDocument();
    expect(screen.getByText("Second paragraph about clean architecture.")).toBeInTheDocument();
  });
});
