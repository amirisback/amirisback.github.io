import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ProjectThumbnail } from "./project-thumbnail";

describe("ProjectThumbnail Component", () => {
  it("renders image preview and badge when thumbnail is provided", () => {
    render(
      <ProjectThumbnail
        title="KulaPOS"
        thumbnail="https://example.com/thumb.png"
        icon="fas fa-cash-register"
        badge="Web POS"
      />
    );

    expect(screen.getByText("Web POS")).toBeInTheDocument();
    const img = screen.getByAltText("Preview KulaPOS");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://example.com/thumb.png");
  });

  it("renders fallback icon when no thumbnail is provided", () => {
    const { container } = render(
      <ProjectThumbnail
        title="Android Library"
        icon="fab fa-android"
        badge="Android"
      />
    );

    expect(screen.getByText("Android")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    const iconEl = container.querySelector(".fa-android");
    expect(iconEl).toBeInTheDocument();
  });

  it("falls back to icon view when thumbnail image fails to load", () => {
    const { container } = render(
      <ProjectThumbnail
        title="Faulty Project"
        thumbnail="https://example.com/broken.jpg"
        icon="fas fa-code"
      />
    );

    const img = screen.getByAltText("Preview Faulty Project");
    fireEvent.error(img);

    expect(screen.queryByAltText("Preview Faulty Project")).not.toBeInTheDocument();
    const iconEl = container.querySelector(".fa-code");
    expect(iconEl).toBeInTheDocument();
  });
});
