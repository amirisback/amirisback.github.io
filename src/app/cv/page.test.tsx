import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CvPage, { generateMetadata } from "./page";

vi.mock("@/lib/i18n-server", () => ({
  getCurrentDictionary: async () => ({
    locale: "en",
    dict: {
      cv: {
        title: "Curriculum Vitae",
        backToHome: "Back to Home",
        printCv: "Print / Save as PDF",
        downloadPdf: "Download PDF",
      },
    },
  }),
}));

vi.mock("./cv-view", () => ({
  CvView: ({ initialLocale }: { initialLocale: string }) => (
    <div data-testid="mock-cv-view">CvView Component: {initialLocale}</div>
  ),
}));

describe("CvPage Server Component", () => {
  it("renders CvView with locale from getCurrentDictionary", async () => {
    const PageElement = await CvPage();
    render(PageElement);

    expect(screen.getByTestId("mock-cv-view")).toBeInTheDocument();
    expect(screen.getByText("CvView Component: en")).toBeInTheDocument();
  });

  it("generates metadata with correct title and description", async () => {
    const metadata = await generateMetadata();

    expect(metadata.title).toContain("Muhammad Faisal Amir");
    expect(metadata.description).toBeDefined();
    expect(metadata.openGraph?.type).toBe("profile");
  });
});
