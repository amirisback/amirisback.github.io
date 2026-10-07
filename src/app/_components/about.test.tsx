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
      badges: {
        experience: "6+ Years Experience",
        openSource: "Frogo Open Source",
        architecture: "Clean Architecture",
      },
      metrics: {
        expYears: { value: "6+", label: "Years Experience" },
        openSource: { value: "30+", label: "Open Source Repos" },
        enterpriseTier: { value: "Enterprise", label: "Fintech & Health" },
        modernStack: { value: "100%", label: "Clean Architecture" },
      },
      pillarsTitle: "Core Engineering Pillars",
      pillarsSubtitle: "Deep specialization across mobile and modern web systems.",
      pillars: {
        android: {
          title: "Native Android & Mobile Architecture",
          desc: "Kotlin and Jetpack Compose engineering.",
        },
        web: {
          title: "Modern Web & Full-Stack Systems",
          desc: "Next.js 16 and TypeScript solutions.",
        },
        modular: {
          title: "Modular Systems & Open Source Impact",
          desc: "Frogo ecosystem and layered architecture.",
        },
      },
    },
  };

  it("should render correctly with title, description, and section label", () => {
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

  it("should render 3D spatial avatar stage with orbital rings and holographic badges", () => {
    render(<About data={mockAboutData} dict={mockDict} />);

    expect(screen.getByTestId("about-avatar-tilt")).toBeInTheDocument();
    expect(screen.getByTestId("about-badge-experience")).toBeInTheDocument();
    expect(screen.getByTestId("about-badge-opensource")).toBeInTheDocument();
    expect(screen.getByTestId("about-badge-architecture")).toBeInTheDocument();
    expect(screen.getByTestId("about-orbit-ring-1")).toBeInTheDocument();
    expect(screen.getByTestId("about-orbit-ring-2")).toBeInTheDocument();
  });

  it("should render 4 verified metric highlight pods", () => {
    render(<About data={mockAboutData} dict={mockDict} />);

    expect(screen.getByText("6+")).toBeInTheDocument();
    expect(screen.getByText("30+")).toBeInTheDocument();
    expect(screen.getByText("Enterprise")).toBeInTheDocument();
    expect(screen.getByText("100%")).toBeInTheDocument();
    expect(screen.getByText("Years Experience")).toBeInTheDocument();
    expect(screen.getByText("Open Source Repos")).toBeInTheDocument();
  });

  it("should render 3 engineering pillar cards with tech tags", () => {
    render(<About data={mockAboutData} dict={mockDict} />);

    expect(screen.getByText("Core Engineering Pillars")).toBeInTheDocument();
    expect(screen.getByTestId("about-pillar-card-0")).toBeInTheDocument();
    expect(screen.getByTestId("about-pillar-card-1")).toBeInTheDocument();
    expect(screen.getByTestId("about-pillar-card-2")).toBeInTheDocument();
    expect(screen.getByText("Native Android & Mobile Architecture")).toBeInTheDocument();
    expect(screen.getByText("Modern Web & Full-Stack Systems")).toBeInTheDocument();
    expect(screen.getByText("Modular Systems & Open Source Impact")).toBeInTheDocument();
    expect(screen.getByText("Kotlin")).toBeInTheDocument();
    expect(screen.getByText("Next.js 16")).toBeInTheDocument();
    expect(screen.getByText("Frogo Ecosystem")).toBeInTheDocument();
  });

  it("should render working CTA quick action links to #service and #experience", () => {
    render(<About data={mockAboutData} dict={mockDict} />);

    const projectsLink = screen.getByRole("link", { name: /explore featured projects/i });
    expect(projectsLink).toHaveAttribute("href", "#service");

    const timelineLink = screen.getByRole("link", { name: /career timeline/i });
    expect(timelineLink).toHaveAttribute("href", "#experience");
  });

  it("should gracefully use fallbacks when dict badges, metrics, or pillars are omitted", () => {
    const minimalDict = {
      about: {
        sectionLabel: "About",
        sectionTitle: "Information",
      },
    };

    render(<About data={mockAboutData} dict={minimalDict} />);

    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Information")).toBeInTheDocument();
    expect(screen.getByTestId("about-badge-experience")).toBeInTheDocument();
    expect(screen.getByTestId("about-pillar-card-0")).toBeInTheDocument();
  });
});
