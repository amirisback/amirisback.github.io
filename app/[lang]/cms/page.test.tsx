import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CmsPage from "./page";

// Mock the navigation helper
const mockNotFound = vi.fn();
vi.mock("next/navigation", () => ({
  notFound: () => mockNotFound(),
}));

// Mock dictionaries module
vi.mock("../dictionaries", () => ({
  hasLocale: (locale: string) => locale === "en" || locale === "id",
  getDictionary: async () => ({
    common: { save: "Save" },
  }),
}));

// Mock content loader
vi.mock("@/lib/content", () => ({
  readContent: async () => ({
    navbar: { brand: "Profile", links: [] },
    hero: { greeting: "Hi", name: "Amir", typedTexts: [], heroImage: "img.png", buttons: [] },
    about: { image: "about.png", description: "Developer", skills: [] },
    services: { items: [] },
    experience: { items: [] },
    blog: { posts: [] },
    footer: { name: "Amir", address: "ID", phone: "123", email: "a@a.com", copyright: "2026", socials: [] },
  }),
}));

// Mock CmsDashboard component
vi.mock("./cms-dashboard", () => ({
  CmsDashboard: () => <div data-testid="mock-cms-dashboard">CMS Dashboard Content</div>,
}));

describe("CmsPage Server Component", () => {
  it("should render the CMS Dashboard correctly when locale is valid", async () => {
    const PageElement = await CmsPage({ params: Promise.resolve({ lang: "en" }) });
    render(PageElement);

    expect(screen.getByTestId("mock-cms-dashboard")).toBeInTheDocument();
  });

  it("should trigger notFound() when locale is invalid", async () => {
    mockNotFound.mockClear();

    const PageElement = await CmsPage({ params: Promise.resolve({ lang: "invalid" as never }) });
    render(PageElement);

    expect(mockNotFound).toHaveBeenCalled();
  });
});
