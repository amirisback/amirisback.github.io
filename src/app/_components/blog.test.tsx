import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Blog } from "./blog";

vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: { src: string; alt?: string; [key: string]: unknown }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt || ""} {...props} />;
  },
}));

vi.mock("./scroll-reveal", () => ({
  ScrollReveal: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("Blog Component", () => {
  const mockBlogData = {
    posts: [
      {
        image: "https://miro.medium.com/cover.jpg",
        title: "Test Blog Post",
        author: "Amir",
        category: "Tech",
        date: "21-May-2026",
        comments: 5,
        excerpt: "This is a test post.",
        url: "https://medium.com/test",
        delay: "0.1s",
      },
    ],
  };

  const mockDict = {
    blog: {
      sectionLabel: "From Blog",
      sectionTitle: "Latest Posts",
      readMore: "Read details",
    },
  };

  it("should render blog entries and links correctly", () => {
    render(<Blog data={mockBlogData} dict={mockDict} />);

    expect(screen.getByText("From Blog")).toBeInTheDocument();
    expect(screen.getByText("Latest Posts")).toBeInTheDocument();

    expect(screen.getByText("Test Blog Post")).toBeInTheDocument();
    expect(screen.getByText("Amir")).toBeInTheDocument();
    expect(screen.getByText("Tech")).toBeInTheDocument();
    expect(screen.getByText("21-May-2026")).toBeInTheDocument();
    expect(screen.getByText("This is a test post.")).toBeInTheDocument();
    expect(screen.getByText("Read details")).toBeInTheDocument();

    const readMoreLink = screen.getByText("Read details").closest("a");
    expect(readMoreLink).toHaveAttribute("href", "https://medium.com/test");
  });
});
