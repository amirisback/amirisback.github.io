import fs from "fs/promises";
import path from "path";

const CONTENT_PATH = path.join(process.cwd(), "data", "content.json");

export interface PortfolioData {
  meta: {
    title: string;
    keywords: string;
    description: string;
    favicon: string;
  };
  navbar: {
    brand: string;
    links: Array<{ href: string; label: string }>;
  };
  hero: {
    greeting: string;
    name: string;
    typedTexts: string[];
    heroImage: string;
    videoBackground?: string;
    buttons: Array<{ label: string; href: string }>;
  };
  about: {
    sectionLabel: string;
    sectionTitle: string;
    image: string;
    description: string;
    skills: Array<{ name: string; percentage: number }>;
  };
  services: {
    sectionLabel: string;
    sectionTitle: string;
    items: Array<{
      icon: string;
      title: string;
      description: string;
      delay: string;
      url?: string;
    }>;
  };
  experience: {
    sectionLabel: string;
    sectionTitle: string;
    items: Array<{
      date: string;
      title: string;
      company: string;
      location: string;
      side: "left" | "right" | string;
    }>;
  };
  blog: {
    sectionLabel: string;
    sectionTitle: string;
    posts: Array<{
      image: string;
      title: string;
      author: string;
      category: string;
      date: string;
      comments: number;
      excerpt: string;
      url: string;
      delay: string;
    }>;
  };
  footer: {
    name: string;
    address: string;
    phone: string;
    email: string;
    copyright: string;
    socials: Array<{ icon: string; url: string }>;
  };
}

/**
 * Reads the portfolio content from data/content.json
 */
export async function readContent(): Promise<PortfolioData> {
  const data = await fs.readFile(CONTENT_PATH, "utf8");
  return JSON.parse(data);
}

/**
 * Writes the portfolio content to data/content.json
 */
export async function writeContent(data: PortfolioData): Promise<void> {
  const content = JSON.stringify(data, null, 2) + "\n";
  await fs.writeFile(CONTENT_PATH, content, "utf8");
}
