import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Footer } from "./footer";

vi.mock("./scroll-reveal", () => ({
  ScrollReveal: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("Footer Component", () => {
  const mockFooterData = {
    name: "Muhammad Faisal Amir",
    address: "Probolinggo, Indonesia",
    phone: "+6281357108568",
    email: "faisalamircs@gmail.com",
    copyright: "Muhammad Faisal Amir, All Right Reserved {year}",
    socials: [
      { icon: "fab fa-twitter", url: "https://twitter.com/faisalamircs" },
      { icon: "fab fa-github", url: "https://github.com/amirisback" },
    ],
  };

  const mockDict = {
    contact: {
      sectionLabel: "Contact Me",
      sectionTitle: "Contact Info",
      address: "Address Label",
      phone: "Phone Label",
      email: "Email Label",
    },
    footer: {
      copyright: "© {year} Muhammad Faisal Amir. All rights reserved.",
      madeWith: "Made with",
    },
  };

  it("should render correctly with contact details and socials", () => {
    render(<Footer data={mockFooterData} dict={mockDict} />);

    expect(screen.getByText("Contact Me")).toBeInTheDocument();
    expect(screen.getByText("Contact Info")).toBeInTheDocument();
    expect(screen.getByText("Address Label")).toBeInTheDocument();
    expect(screen.getByText("Probolinggo, Indonesia")).toBeInTheDocument();
    expect(screen.getByText("Phone Label")).toBeInTheDocument();
    expect(screen.getByText("+6281357108568")).toBeInTheDocument();
    expect(screen.getByText("Email Label")).toBeInTheDocument();
    expect(screen.getByText("faisalamircs@gmail.com")).toBeInTheDocument();
    expect(screen.getByText("Connect on Socials")).toBeInTheDocument();
    expect(screen.getByText(/Made with/i)).toBeInTheDocument();

    const currentYear = new Date().getFullYear().toString();
    expect(screen.getByText(`© ${currentYear} Muhammad Faisal Amir. All rights reserved.`)).toBeInTheDocument();
  });
});
