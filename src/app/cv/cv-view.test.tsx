import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CvView } from "./cv-view";

// Mock i18n-actions
vi.mock("@/lib/i18n-actions", () => ({
  setLocaleAction: vi.fn().mockResolvedValue(undefined),
}));

describe("CvView Component", () => {
  const mockDict = {
    cv: {
      title: "Curriculum Vitae",
      subtitle: "Professional Resume",
      backToHome: "Back to Home",
      printCv: "Print / Save as PDF",
      downloadPdf: "Download PDF",
      downloadEnPdf: "Download PDF (EN)",
      downloadIdPdf: "Download PDF (ID)",
      printTip: "Tip: Select 'Save as PDF' with Background Graphics enabled.",
      language: "Resume Language",
      summaryTitle: "Professional Summary",
      skillsTitle: "Core Competencies & Technical Skills",
      experienceTitle: "Professional Experience",
      projectsTitle: "Open-Source & Noteworthy Projects",
      educationTitle: "Education & Credentials",
      languagesTitle: "Languages",
      present: "Present",
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders candidate header, contact coordinates, and sections in English by default", () => {
    render(<CvView initialLocale="en" dict={mockDict} />);

    // Candidate Header
    expect(
      screen.getByRole("heading", { level: 1, name: /Muhammad Faisal Amir/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Senior Android Developer & Software Engineer/i)
    ).toBeInTheDocument();

    // Contact info
    expect(screen.getByText(/faisalamircs@gmail.com/i)).toBeInTheDocument();
    expect(screen.getByText("github.com/amirisback")).toBeInTheDocument();
    expect(screen.getByText(/linkedin\.com\/in\/faisalamircs/i)).toBeInTheDocument();

    // Section Headings
    expect(screen.getByText("Professional Summary")).toBeInTheDocument();
    expect(
      screen.getByText("Core Competencies & Technical Skills")
    ).toBeInTheDocument();
    expect(screen.getByText("Professional Experience")).toBeInTheDocument();
    expect(
      screen.getByText("Open-Source & Noteworthy Projects")
    ).toBeInTheDocument();
    expect(screen.getByText("Education & Credentials")).toBeInTheDocument();
    expect(screen.getByText("Languages")).toBeInTheDocument();

    // Key Experience & Open Source items
    expect(
      screen.getByRole("heading", { level: 3, name: /Qomunal/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: /KoinWorks/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: /Frogo-Recycler-View/i })
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("heading", { level: 3, name: /Telkom University/i }).length
    ).toBeGreaterThan(0);
  });

  it("triggers window.print when clicking Print / Save as PDF button", () => {
    const printSpy = vi.spyOn(window, "print").mockImplementation(() => {});
    render(<CvView initialLocale="en" dict={mockDict} />);

    const printButton = screen.getByRole("button", {
      name: /Print \/ Save as PDF/i,
    });
    fireEvent.click(printButton);

    expect(printSpy).toHaveBeenCalledTimes(1);
    printSpy.mockRestore();
  });

  it("switches language to Indonesian and back to English interactively", () => {
    render(<CvView initialLocale="en" dict={mockDict} />);

    const idButton = screen.getByRole("button", { name: "ID" });
    const enButton = screen.getByRole("button", { name: "EN" });

    // Switch to Indonesian
    fireEvent.click(idButton);
    expect(idButton).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByText(
        /Software Engineer yang berdedikasi dan berorientasi pada pencapaian/i
      )
    ).toBeInTheDocument();

    // Switch back to English
    fireEvent.click(enButton);
    expect(enButton).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByText(
        /Accomplished and growth-oriented Software Engineer/i
      )
    ).toBeInTheDocument();
  });

  it("renders download PDF link with proper download attributes", () => {
    render(<CvView initialLocale="en" dict={mockDict} />);

    const downloadLink = screen.getByTitle("Download PDF");
    expect(downloadLink).toBeInTheDocument();
    expect(downloadLink).toHaveAttribute("download");
    expect(downloadLink).toHaveAttribute(
      "href",
      "/docs/cv/cv-muhammad-faisal-amir-en.pdf"
    );
  });

  it("renders Back to Home link pointing to /", () => {
    render(<CvView initialLocale="en" dict={mockDict} />);

    const backLink = screen.getByRole("link", { name: /Back to Home/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute("href", "/");
  });
});
