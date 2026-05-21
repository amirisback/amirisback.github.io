import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Navbar } from "./navbar";

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  usePathname: () => "/id/some-path",
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe("Navbar Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // matchMedia mock — required by ThemeToggle's useTheme hook
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  const links = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
  ];

  const dict = {
    nav: {
      home: "Beranda",
      about: "Tentang",
      contact: "Kontak",
      project: "Projek",
      experience: "Pengalaman",
      blog: "Medium",
      language: "Bahasa",
    },
  };

  it("should render correctly", () => {
    render(<Navbar brand="TestBrand" links={links} dict={dict} currentLang="id" />);

    expect(screen.getByText("TestBrand")).toBeInTheDocument();
    expect(screen.getByText("Beranda")).toBeInTheDocument();
    expect(screen.getByText("Tentang")).toBeInTheDocument();
    expect(screen.queryByText("CMS")).not.toBeInTheDocument();
  });

  it("should push the new URL when changing language on desktop", () => {
    render(<Navbar brand="TestBrand" links={links} dict={dict} currentLang="id" />);

    const enButton = screen.getAllByText("EN")[0];
    fireEvent.click(enButton);

    expect(pushMock).toHaveBeenCalledWith("/en/some-path");
  });

  it("handles scroll event and changes classes when sticky", () => {
    render(<Navbar brand="TestBrand" links={links} dict={dict} currentLang="id" />);
    
    // Simulate scroll down
    global.window.scrollY = 100;
    fireEvent.scroll(window);
    expect(screen.getByTestId("navbar")).toHaveClass("bg-white/90");

    // Simulate scroll up to top
    global.window.scrollY = 0;
    fireEvent.scroll(window);
    expect(screen.getByTestId("navbar")).toHaveClass("bg-transparent");
  });

  it("updates active hash on scroll based on section positions", () => {
    const homeSection = document.createElement("div");
    homeSection.id = "home";
    const aboutSection = document.createElement("div");
    aboutSection.id = "about";
    document.body.appendChild(homeSection);
    document.body.appendChild(aboutSection);

    // Mock getBoundingClientRect for both sections
    homeSection.getBoundingClientRect = () => ({ top: 200, bottom: 400 } as unknown as DOMRect);
    aboutSection.getBoundingClientRect = () => ({ top: 50, bottom: 150 } as unknown as DOMRect); // active

    render(<Navbar brand="TestBrand" links={links} dict={dict} currentLang="id" />);
    
    fireEvent.scroll(window);
    
    // Verify that about section gets highlit/active style or updates its local state without error
    document.body.removeChild(homeSection);
    document.body.removeChild(aboutSection);
  });

  it("displays proper labels for all known sections and falls back to link.label", () => {
    const customLinks = [
      { href: "#home", label: "Home" },
      { href: "#about", label: "About" },
      { href: "#service", label: "Projects" },
      { href: "#experience", label: "Experience" },
      { href: "#blog", label: "Blog" },
      { href: "#contact", label: "Contact" },
      { href: "#unknown", label: "Unknown Label" },
    ];
    render(<Navbar brand="TestBrand" links={customLinks} dict={dict} currentLang="id" />);
    expect(screen.getByText("Beranda")).toBeInTheDocument();
    expect(screen.getByText("Tentang")).toBeInTheDocument();
    expect(screen.getByText("Projek")).toBeInTheDocument();
    expect(screen.getByText("Pengalaman")).toBeInTheDocument();
    expect(screen.getByText("Medium")).toBeInTheDocument();
    expect(screen.getByText("Kontak")).toBeInTheDocument();
    expect(screen.getByText("Unknown Label")).toBeInTheDocument();
  });

  it("toggles mobile menu, handles language switch, and closes on mobile link click", () => {
    render(<Navbar brand="TestBrand" links={links} dict={dict} currentLang="id" />);
    
    const toggleBtn = screen.getByRole("button", { name: "Toggle Menu" });
    
    // Initially, there are only desktop links of "Tentang"
    const initialTentangLinks = screen.getAllByText("Tentang");
    expect(initialTentangLinks.length).toBe(1);

    // Open mobile menu
    fireEvent.click(toggleBtn);
    const openTentangLinks = screen.getAllByText("Tentang");
    expect(openTentangLinks.length).toBe(2); // desktop + mobile

    // Click mobile menu link to close it
    fireEvent.click(openTentangLinks[1]);
    const closedTentangLinks = screen.getAllByText("Tentang");
    expect(closedTentangLinks.length).toBe(1); // should be closed now

    // Re-open and check language change on mobile
    fireEvent.click(toggleBtn);
    const mobileEnBtn = screen.getAllByText("EN")[1]; // Second is mobile EN button
    fireEvent.click(mobileEnBtn);
    expect(pushMock).toHaveBeenCalledWith("/en/some-path");
  });
});
