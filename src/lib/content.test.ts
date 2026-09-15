import { describe, it, expect, vi, beforeEach } from "vitest";
import fs from "fs/promises";
import { readContent, writeContent } from "./content";
import type { PortfolioData } from "./content";

vi.mock("fs/promises", () => ({
  default: {
    readFile: vi.fn(),
    writeFile: vi.fn(),
  },
}));

const mockData: PortfolioData = {
  meta: {
    title: "Muhammad Faisal Amir",
    keywords: "Muhammad Faisal Amir",
    description: "Muhammad Faisal Amir",
    favicon: "https://avatars.githubusercontent.com/u/24654871?v=4",
  },
  navbar: {
    brand: "Profile",
    links: [{ href: "#home", label: "Home" }],
  },
  hero: {
    greeting: "I'm",
    name: "Muhammad Faisal Amir",
    typedTexts: ["Android Programmer"],
    heroImage: "img/hero.png",
    buttons: [{ label: "View CV", href: "#" }],
  },
  about: {
    sectionLabel: "Learn About Me",
    sectionTitle: "Information",
    image: "img/about.png",
    description: "Test bio",
    skills: [{ name: "Android Development", percentage: 90 }],
  },
  services: {
    sectionLabel: "What have I been doing?",
    sectionTitle: "Projects",
    items: [
      {
        icon: "fab fa-android",
        title: "Android Library",
        description: "Library desc",
        delay: "0.6s",
      },
    ],
  },
  experience: {
    sectionLabel: "My Resume",
    sectionTitle: "Working Experience",
    items: [
      {
        date: "September 2023 - Now",
        title: "Android Dev",
        company: "Qomunal",
        location: "Jakarta",
        side: "left",
      },
    ],
  },
  blog: {
    sectionLabel: "From Blog",
    sectionTitle: "Latest Articles",
    posts: [
      {
        image: "img/blog.jpg",
        title: "Consumable Code",
        author: "Faisal Amir",
        category: "Android Development",
        date: "17-Mar-2020",
        comments: 0,
        excerpt: "Hallo teman teman",
        url: "https://medium.com",
        delay: "0.1s",
      },
    ],
  },
  footer: {
    name: "Muhammad Faisal Amir",
    address: "Probolinggo",
    phone: "+62813",
    email: "faisalamircs@gmail.com",
    copyright: "Muhammad Faisal Amir, All Right Reserved 2026",
    socials: [{ icon: "fab fa-twitter", url: "https://twitter.com" }],
  },
};

describe("Content Loader Utility", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should read content data successfully", async () => {
    vi.mocked(fs.readFile).mockResolvedValueOnce(JSON.stringify(mockData));

    const result = await readContent();

    expect(fs.readFile).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockData);
  });

  it("should write content data successfully", async () => {
    vi.mocked(fs.writeFile).mockResolvedValueOnce(undefined);

    await writeContent(mockData);

    expect(fs.writeFile).toHaveBeenCalledTimes(1);
    expect(fs.writeFile).toHaveBeenCalledWith(
      expect.any(String),
      JSON.stringify(mockData, null, 2) + "\n",
      "utf8"
    );
  });
});
