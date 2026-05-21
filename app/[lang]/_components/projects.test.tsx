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
        icon: "fab fa-android",
        title: "Test Android App",
        description: "A cool android app.",
        delay: "0.1s",
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

  it("should render sections and project items correctly", () => {
    render(<Projects data={mockProjectsData} dict={mockDict} />);

    expect(screen.getByText("My Portfolio")).toBeInTheDocument();
    expect(screen.getByText("My Work")).toBeInTheDocument();

    expect(screen.getByText("Test Android App")).toBeInTheDocument();
    expect(screen.getByText("A cool android app.")).toBeInTheDocument();
    expect(screen.getByText("View details")).toBeInTheDocument();

    expect(screen.getByText("Test Website")).toBeInTheDocument();
    expect(screen.getByText("A cool website.")).toBeInTheDocument();
  });
});
