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
    description: "I am a developer.",
    skills: [
      { name: "Kotlin", percentage: 90 },
      { name: "React", percentage: 70 },
    ],
  };

  const mockDict = {
    about: {
      sectionLabel: "About Me",
      sectionTitle: "My Info",
    },
  };

  it("should render correctly with title, description and skills", () => {
    render(<About data={mockAboutData} dict={mockDict} />);

    expect(screen.getByText("About Me")).toBeInTheDocument();
    expect(screen.getByText("My Info")).toBeInTheDocument();
    expect(screen.getByText("I am a developer.")).toBeInTheDocument();
    expect(screen.getByText("Kotlin")).toBeInTheDocument();
    expect(screen.getByText("90%")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("70%")).toBeInTheDocument();
  });
});
