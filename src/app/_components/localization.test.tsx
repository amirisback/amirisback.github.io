import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Hero } from "./hero";
import { About } from "./about";
import { Projects } from "./projects";
import { Experience } from "./experience";
import { Footer } from "./footer";
import idDict from "@/dictionaries/id.json";
import enDict from "@/dictionaries/en.json";

vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: { src: string; alt?: string; [key: string]: unknown }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt || ""} {...props} />;
  },
}));

vi.mock("./scroll-reveal", () => ({
  ScrollReveal: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("./typing-text", () => ({
  TypingText: ({ texts }: { texts: string[] }) => <span>{texts.join(", ")}</span>,
}));

vi.mock("./tilt-card-3d", () => ({
  TiltCard3D: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("./hero-background-3d", () => ({
  HeroBackground3D: () => <div data-testid="mock-bg-3d" />,
}));

describe("Comprehensive Localization & Antislop Verification", () => {
  it("Hero Component renders Indonesian translation and button labels when ID dict is provided", () => {
    const mockHero = {
      greeting: "I'm",
      name: "Muhammad Faisal Amir",
      typedTexts: ["Software Engineer"],
      heroImage: "img/hero.png",
      buttons: [
        { label: "View Amir's CV", href: "/docs/cv.pdf" },
        { label: "Follow Amir's GitHub", href: "https://github.com/amirisback" },
      ],
    };

    render(<Hero data={mockHero} dict={idDict} />);

    expect(screen.getByText("Saya")).toBeInTheDocument();
    expect(screen.getByText("Saya seorang")).toBeInTheDocument();
    expect(screen.getByText("Lihat CV Amir")).toBeInTheDocument();
    expect(screen.getByText("Ikuti GitHub Amir")).toBeInTheDocument();
  });

  it("Hero Component renders English text when EN dict is provided", () => {
    const mockHero = {
      greeting: "I'm",
      name: "Muhammad Faisal Amir",
      typedTexts: ["Software Engineer"],
      heroImage: "img/hero.png",
      buttons: [
        { label: "View Amir's CV", href: "/docs/cv.pdf" },
        { label: "Follow Amir's GitHub", href: "https://github.com/amirisback" },
      ],
    };

    render(<Hero data={mockHero} dict={enDict} />);

    expect(screen.getByText("I'm")).toBeInTheDocument();
    expect(screen.getByText("I am a")).toBeInTheDocument();
    expect(screen.getByText("View Amir's CV")).toBeInTheDocument();
    expect(screen.getByText("Follow Amir's GitHub")).toBeInTheDocument();
  });

  it("About Component renders Indonesian description when ID dict is provided", () => {
    const mockAbout = {
      image: "img/about.png",
      description: "English fallback description.",
    };

    render(<About data={mockAbout} dict={idDict} />);

    expect(screen.getByText("Pelajari Tentang Saya")).toBeInTheDocument();
    expect(screen.getByText("Informasi")).toBeInTheDocument();
    expect(screen.getByText(/Saya adalah seorang Software Engineer dengan pengalaman lebih dari 6 tahun/i)).toBeInTheDocument();
  });

  it("Projects Component renders Indonesian description when currentLang is id", () => {
    const mockProjects = {
      items: [
        {
          icon: "fas fa-cash-register",
          title: "KulaPOS",
          description: "Modern POS in English",
          description_id: "Aplikasi Point of Sale (POS) modern, cepat, dan responsif untuk UMKM kedai kopi.",
          delay: "0.1s",
          url: "https://example.com",
        },
      ],
    };

    render(<Projects data={mockProjects} dict={idDict} currentLang="id" />);

    expect(screen.getByText("Proyek Saya")).toBeInTheDocument();
    expect(screen.getByText("Proyek Pilihan")).toBeInTheDocument();
    expect(screen.getByText("Lihat Proyek")).toBeInTheDocument();
    expect(screen.getByText("Aplikasi Point of Sale (POS) modern, cepat, dan responsif untuk UMKM kedai kopi.")).toBeInTheDocument();
    expect(screen.queryByText("Modern POS in English")).not.toBeInTheDocument();
  });

  it("Projects Component renders English description when currentLang is en", () => {
    const mockProjects = {
      items: [
        {
          icon: "fas fa-cash-register",
          title: "KulaPOS",
          description: "Modern POS in English",
          description_id: "Aplikasi Point of Sale (POS) modern, cepat, dan responsif untuk UMKM kedai kopi.",
          delay: "0.1s",
          url: "https://example.com",
        },
      ],
    };

    render(<Projects data={mockProjects} dict={enDict} currentLang="en" />);

    expect(screen.getByText("My Projects")).toBeInTheDocument();
    expect(screen.getByText("Featured Projects")).toBeInTheDocument();
    expect(screen.getByText("View Project")).toBeInTheDocument();
    expect(screen.getByText("Modern POS in English")).toBeInTheDocument();
    expect(screen.queryByText("Aplikasi Point of Sale (POS) modern, cepat, dan responsif untuk UMKM kedai kopi.")).not.toBeInTheDocument();
  });

  it("Experience Component formats dates (Now -> Sekarang vs Present, Des -> Dec, Mei -> May)", () => {
    const mockExp = {
      items: [
        {
          date: "September 2023 - Now",
          title: "Software Engineer",
          company: "Qomunal",
          location: "Bandung, Jawa Barat, Indonesia",
          side: "left",
        },
        {
          date: "Jul 2020 - Dec 2020",
          title: "Software Engineer",
          company: "Chat Aja Messenger",
          location: "Bandung, West Java, Indonesia",
          side: "right",
        },
      ],
    };

    // ID Mode
    const { unmount } = render(<Experience data={mockExp} dict={idDict} currentLang="id" />);
    expect(screen.getByText("Pengalaman Saya")).toBeInTheDocument();
    expect(screen.getByText("Pengalaman Kerja")).toBeInTheDocument();
    expect(screen.getByText("September 2023 - Sekarang")).toBeInTheDocument();
    expect(screen.getByText("Jul 2020 - Des 2020")).toBeInTheDocument();
    expect(screen.getAllByText("Bandung, Jawa Barat, Indonesia").length).toBe(2);

    unmount();

    // EN Mode
    render(<Experience data={mockExp} dict={enDict} currentLang="en" />);
    expect(screen.getByText("My Experience")).toBeInTheDocument();
    expect(screen.getByText("Working Experience")).toBeInTheDocument();
    expect(screen.getByText("September 2023 - Present")).toBeInTheDocument();
    expect(screen.getByText("Jul 2020 - Dec 2020")).toBeInTheDocument();
    expect(screen.getAllByText("Bandung, West Java, Indonesia").length).toBe(2);
  });

  it("Footer Component renders 'di Indonesia' and 'Terhubung di Media Sosial' in ID mode", () => {
    const mockFooter = {
      name: "Muhammad Faisal Amir",
      address: "Probolinggo, Indonesia",
      phone: "+6281357108568",
      email: "faisalamircs@gmail.com",
      copyright: "Muhammad Faisal Amir, All Rights Reserved 2026",
      socials: [{ icon: "fab fa-github", url: "https://github.com" }],
    };

    const { unmount } = render(<Footer data={mockFooter} dict={idDict} />);
    expect(screen.getByText("Terhubung di Media Sosial")).toBeInTheDocument();
    expect(screen.getByText(/di Indonesia/)).toBeInTheDocument();

    unmount();

    render(<Footer data={mockFooter} dict={enDict} />);
    expect(screen.getByText("Connect on Socials")).toBeInTheDocument();
    expect(screen.getByText(/in Indonesia/)).toBeInTheDocument();
  });
});
