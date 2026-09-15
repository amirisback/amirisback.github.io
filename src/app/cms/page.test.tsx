import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CmsPage from "./page";

// Mock i18n-server
vi.mock("@/lib/i18n-server", () => ({
  getCurrentLocale: async () => "id",
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
  it("should render the CMS Dashboard correctly", async () => {
    const PageElement = await CmsPage();
    render(PageElement);

    expect(screen.getByTestId("mock-cms-dashboard")).toBeInTheDocument();
  });
});
