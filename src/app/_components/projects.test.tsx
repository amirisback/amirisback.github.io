import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Projects } from "./projects";

vi.mock("./scroll-reveal", () => ({
  ScrollReveal: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("Projects Component", () => {
  const mockProjectsData = {
    items: [
      {
        icon: "fas fa-cash-register",
        title: "KulaPOS",
        description: "A cool POS system.",
        delay: "0.1s",
        url: "https://kasir-web-seven.vercel.app/",
        thumbnail: "https://example.com/kulapos.png",
        badge: "Web POS",
      },
      {
        icon: "fab fa-android",
        title: "Test Android App",
        description: "A cool android app.",
        delay: "0.2s",
        url: "https://play.google.com",
      },
      {
        icon: "fas fa-code",
        title: "Test Website",
        description: "A cool website.",
        delay: "0.3s",
      },
    ],
  };

  const mockDict = {
    portfolio: {
      sectionLabel: "My Portfolio",
      sectionTitle: "My Work",
      viewProject: "View details",
      flagshipBadge: "Flagship Showcase",
      flagshipSubtitle: "4 flagship web applications.",
      allProjectsTitle: "More Projects & Open Source",
      allProjectsSubtitle: "Explore additional projects.",
      liveDemo: "Live Demo",
      visitApp: "Visit Website",
    },
  };

  it("should render sections and project items correctly with thumbnails and badges", () => {
    render(<Projects data={mockProjectsData} dict={mockDict} />);

    expect(screen.getByText("My Portfolio")).toBeInTheDocument();
    expect(screen.getByText("My Work")).toBeInTheDocument();

    // With thumbnail and badge
    expect(screen.getByText("KulaPOS")).toBeInTheDocument();
    expect(screen.getByText("A cool POS system.")).toBeInTheDocument();
    expect(screen.getByText("Web POS")).toBeInTheDocument();
    const thumbImg = screen.getByAltText("Preview KulaPOS");
    expect(thumbImg).toBeInTheDocument();
    expect(thumbImg).toHaveAttribute("src", "https://example.com/kulapos.png");

    // Standard items
    expect(screen.getByText("Test Android App")).toBeInTheDocument();
    expect(screen.getByText("A cool android app.")).toBeInTheDocument();
    expect(screen.getAllByText("View details").length).toBeGreaterThan(0);

    expect(screen.getByText("Test Website")).toBeInTheDocument();
    expect(screen.getByText("A cool website.")).toBeInTheDocument();

    const tiltCards = screen.getAllByTestId("project-card-tilt");
    expect(tiltCards).toHaveLength(mockProjectsData.items.length);
  });

  it("should render Dual-Tier layout with Flagship Showcase when featured items are present", () => {
    const mockWithFeatured = {
      items: [
        {
          icon: "fas fa-calculator",
          title: "Life Calculator Financial",
          description: "Financial calculator in English.",
          description_id: "Kalkulator finansial dalam bahasa Indonesia.",
          delay: "0.2s",
          url: "https://financial-math-amir.vercel.app/",
          thumbnail: "https://example.com/calc.png",
          badge: "Financial Engine",
          featured: true,
          tags: ["Next.js", "Financial Math", "Compound Engine"],
        },
        {
          icon: "fas fa-magic",
          title: "Magic Clipper AI",
          description: "AI video trimmer tool.",
          delay: "0.3s",
          url: "https://clipper-magic.vercel.app/",
          thumbnail: "https://example.com/clipper.png",
          badge: "AI Video Tool",
          featured: true,
          tags: ["Next.js", "AI Video Processing"],
        },
        {
          icon: "fas fa-box",
          title: "Regular Archive Project",
          description: "Archive description.",
          delay: "0.4s",
          url: "https://example.com/archive",
          badge: "Open Source",
        },
      ],
    };

    render(<Projects data={mockWithFeatured} dict={mockDict} currentLang="en" />);

    // Header and Subtitle
    expect(screen.getByText("4 flagship web applications.")).toBeInTheDocument();

    // Featured items in Tier 1
    expect(screen.getByText("Life Calculator Financial")).toBeInTheDocument();
    expect(screen.getByText("Magic Clipper AI")).toBeInTheDocument();
    expect(screen.getByText("Financial Math")).toBeInTheDocument();
    expect(screen.getByText("AI Video Processing")).toBeInTheDocument();
    expect(screen.getAllByText("Live Demo").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Visit Website").length).toBeGreaterThan(0);

    // Tier 2 Catalog divider and regular items
    expect(screen.getByText("More Projects & Open Source")).toBeInTheDocument();
    expect(screen.getByText("Explore additional projects.")).toBeInTheDocument();
    expect(screen.getByText("Regular Archive Project")).toBeInTheDocument();

    const allTiltCards = screen.getAllByTestId("project-card-tilt");
    expect(allTiltCards).toHaveLength(mockWithFeatured.items.length);
  });
});
