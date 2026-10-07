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
        title: "Senior Android Engineer",
        company: "Qomunal",
        location: "Surabaya, Indonesia",
        side: "left",
        type: "Full-time",
        type_id: "Penuh Waktu",
        description: "Leading mobile core development for digital banking solutions.",
        description_id: "Memimpin pengembangan mobile core untuk solusi perbankan digital.",
        highlights: [
          "Scaled architecture to 500k+ MAU with 99.9% crash-free rate.",
          "Implemented automated CI/CD pipeline reducing build cycles by 40%.",
        ],
        highlights_id: [
          "Skalabilitas arsitektur hingga 500k+ MAU dengan tingkat bebas crash 99.9%.",
          "Menerapkan pipeline CI/CD otomatis menghemat waktu rilis 40%.",
        ],
        skills: ["Kotlin", "Jetpack Compose", "Coroutines", "Clean Architecture"],
      },
      {
        date: "2020 - 2023",
        title: "Junior Dev",
        company: "Facebook",
        location: "Menlo Park, West Java",
        side: "right",
      },
    ],
  };

  const mockDictEn = {
    experience: {
      sectionLabel: "My Resume",
      sectionTitle: "Work History",
      present: "Present",
      keyAchievements: "Key Contributions & Impact",
      technologies: "Technologies & Stack",
    },
  };

  const mockDictId = {
    experience: {
      sectionLabel: "Pengalaman Saya",
      sectionTitle: "Pengalaman Kerja",
      present: "Sekarang",
      keyAchievements: "Kontribusi & Dampak Utama",
      technologies: "Teknologi & Keahlian",
    },
  };

  it("should render experience entries and headers correctly in English", () => {
    render(<Experience data={mockExperienceData} dict={mockDictEn} currentLang="en" />);

    expect(screen.getByText("My Resume")).toBeInTheDocument();
    expect(screen.getByText("Work History")).toBeInTheDocument();

    // Headers & Organization
    expect(screen.getByText("Senior Android Engineer")).toBeInTheDocument();
    expect(screen.getByText("Qomunal")).toBeInTheDocument();
    expect(screen.getByText("Surabaya, Indonesia")).toBeInTheDocument();
    expect(screen.getByText("Full-time")).toBeInTheDocument();

    // Date badge
    expect(screen.getByText("2023 - Present")).toBeInTheDocument();

    // 3D Tilt Cards
    const tiltCards = screen.getAllByTestId("experience-card-tilt");
    expect(tiltCards).toHaveLength(2);

    // Descriptions & Highlights
    expect(
      screen.getByText("Leading mobile core development for digital banking solutions.")
    ).toBeInTheDocument();
    expect(screen.getByText("Key Contributions & Impact")).toBeInTheDocument();
    expect(
      screen.getByText("Scaled architecture to 500k+ MAU with 99.9% crash-free rate.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Implemented automated CI/CD pipeline reducing build cycles by 40%.")
    ).toBeInTheDocument();

    // Skills
    expect(screen.getByText("Technologies & Stack")).toBeInTheDocument();
    expect(screen.getByText("Kotlin")).toBeInTheDocument();
    expect(screen.getByText("Jetpack Compose")).toBeInTheDocument();
    expect(screen.getByText("Coroutines")).toBeInTheDocument();

    // Minimal item fallback check
    expect(screen.getByText("Junior Dev")).toBeInTheDocument();
    expect(screen.getByText("Facebook")).toBeInTheDocument();
    expect(screen.getByText("2020 - 2023")).toBeInTheDocument();
  });

  it("should render localized Indonesian content when currentLang is id", () => {
    render(<Experience data={mockExperienceData} dict={mockDictId} currentLang="id" />);

    expect(screen.getByText("Pengalaman Saya")).toBeInTheDocument();
    expect(screen.getByText("Pengalaman Kerja")).toBeInTheDocument();

    // Indonesian text
    expect(screen.getByText("Penuh Waktu")).toBeInTheDocument();
    expect(
      screen.getByText("Memimpin pengembangan mobile core untuk solusi perbankan digital.")
    ).toBeInTheDocument();
    expect(screen.getByText("Kontribusi & Dampak Utama")).toBeInTheDocument();
    expect(
      screen.getByText("Skalabilitas arsitektur hingga 500k+ MAU dengan tingkat bebas crash 99.9%.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Menerapkan pipeline CI/CD otomatis menghemat waktu rilis 40%.")
    ).toBeInTheDocument();
    expect(screen.getByText("Teknologi & Keahlian")).toBeInTheDocument();

    // Date translation check
    expect(screen.getByText("2023 - Sekarang")).toBeInTheDocument();

    // Location translation check (West Java -> Jawa Barat)
    expect(screen.getByText("Menlo Park, Jawa Barat")).toBeInTheDocument();
  });

  it("should render subtle architectural background pattern with proper accessibility attributes", () => {
    render(<Experience data={mockExperienceData} dict={mockDictEn} currentLang="en" />);
    const pattern = screen.getByTestId("experience-bg-pattern");
    expect(pattern).toBeInTheDocument();
    expect(pattern).toHaveAttribute("aria-hidden", "true");
    expect(pattern.className).toContain("pointer-events-none");
    expect(pattern.className).toContain("absolute");
  });
});
