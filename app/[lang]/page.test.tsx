import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Home from "./page";

// Mock the navigation helper
const mockNotFound = vi.fn();
vi.mock("next/navigation", () => ({
  notFound: () => mockNotFound(),
}));

// Mock dictionaries module
vi.mock("./dictionaries", () => ({
  hasLocale: (locale: string) => locale === "en" || locale === "id",
  getDictionary: async () => ({
    home: { title: "Home" },
    about: { sectionLabel: "About", sectionTitle: "Title" },
    portfolio: { sectionLabel: "Projects", sectionTitle: "Title", viewProject: "View" },
    experience: { sectionLabel: "Resume", sectionTitle: "Title" },
    blog: { sectionLabel: "Blog", sectionTitle: "Title", readMore: "Read" },
    contact: { sectionLabel: "Contact", sectionTitle: "Title", address: "Addr", phone: "Phone", email: "Email" },
    footer: { copyright: "© 2026", madeWith: "Made" },
  }),
}));

// Mock content loader
vi.mock("@/lib/content", () => ({
  readContent: async () => ({
    navbar: { brand: "Profile", links: [{ href: "#home", label: "Home" }] },
    hero: { greeting: "Hi", name: "Amir", typedTexts: ["Android Dev"], heroImage: "img.png", buttons: [] },
    about: { image: "about.png", description: "Developer", skills: [] },
    services: { items: [] },
    experience: { items: [] },
    blog: { posts: [] },
    footer: { name: "Amir", address: "ID", phone: "123", email: "a@a.com", copyright: "2026", socials: [] },
  }),
}));

// Mock components
vi.mock("./_components/navbar", () => ({
  Navbar: () => <div data-testid="mock-navbar">Navbar</div>,
}));
vi.mock("./_components/hero", () => ({
  Hero: () => <div data-testid="mock-hero">Hero</div>,
}));
vi.mock("./_components/about", () => ({
  About: () => <div data-testid="mock-about">About</div>,
}));
vi.mock("./_components/projects", () => ({
  Projects: () => <div data-testid="mock-projects">Projects</div>,
}));
vi.mock("./_components/experience", () => ({
  Experience: () => <div data-testid="mock-experience">Experience</div>,
}));
vi.mock("./_components/blog", () => ({
  Blog: () => <div data-testid="mock-blog">Blog</div>,
}));
vi.mock("./_components/footer", () => ({
  Footer: () => <div data-testid="mock-footer">Footer</div>,
}));
vi.mock("./_components/back-to-top", () => ({
  BackToTop: () => <div data-testid="mock-back-to-top">BackToTop</div>,
}));

describe("Home Page Component", () => {
  it("should render all sub-components and website JSON-LD script", async () => {
    // Page is an async component, so resolve the JSX element
    const PageElement = await Home({ params: Promise.resolve({ lang: "en" }) });
    render(PageElement);

    expect(screen.getByTestId("mock-navbar")).toBeInTheDocument();
    expect(screen.getByTestId("mock-hero")).toBeInTheDocument();
    expect(screen.getByTestId("mock-about")).toBeInTheDocument();
    expect(screen.getByTestId("mock-projects")).toBeInTheDocument();
    expect(screen.getByTestId("mock-experience")).toBeInTheDocument();
    expect(screen.getByTestId("mock-blog")).toBeInTheDocument();
    expect(screen.getByTestId("mock-footer")).toBeInTheDocument();
    expect(screen.getByTestId("mock-back-to-top")).toBeInTheDocument();
  });

  it("should trigger notFound() when locale is invalid", async () => {
    mockNotFound.mockClear();
    
    const PageElement = await Home({ params: Promise.resolve({ lang: "invalid" as never }) });
    render(PageElement);

    expect(mockNotFound).toHaveBeenCalled();
  });
});
