import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Experience } from "./experience";

vi.mock("./scroll-reveal", () => ({
  ScrollReveal: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("Experience Component", () => {
  const mockExperienceData = {
    items: [
      {
        date: "2023 - Now",
        title: "Senior Dev",
        company: "Google",
        location: "Mountain View",
        side: "left",
      },
      {
        date: "2020 - 2023",
        title: "Junior Dev",
        company: "Facebook",
        location: "Menlo Park",
        side: "right",
      },
    ],
  };

  const mockDict = {
    experience: {
      sectionLabel: "My Resume",
      sectionTitle: "Work History",
    },
  };

  it("should render experience entries and headers correctly", () => {
    render(<Experience data={mockExperienceData} dict={mockDict} />);

    expect(screen.getByText("My Resume")).toBeInTheDocument();
    expect(screen.getByText("Work History")).toBeInTheDocument();

    expect(screen.getByText("Senior Dev")).toBeInTheDocument();
    expect(screen.getByText("Google")).toBeInTheDocument();
    expect(screen.getByText("Mountain View")).toBeInTheDocument();
    expect(screen.getByText("2023 - Now")).toBeInTheDocument();

    expect(screen.getByText("Junior Dev")).toBeInTheDocument();
    expect(screen.getByText("Facebook")).toBeInTheDocument();
    expect(screen.getByText("Menlo Park")).toBeInTheDocument();
    expect(screen.getByText("2020 - 2023")).toBeInTheDocument();
  });
});
