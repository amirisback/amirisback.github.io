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
});
