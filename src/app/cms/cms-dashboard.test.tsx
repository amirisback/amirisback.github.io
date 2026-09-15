import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CmsDashboard } from "./cms-dashboard";

// Mock window.btoa and window.atob if they are not defined in jsdom
if (typeof window !== "undefined") {
  if (!window.btoa) {
    window.btoa = (str: string) => Buffer.from(str, "binary").toString("base64");
  }
  if (!window.atob) {
    window.atob = (str: string) => Buffer.from(str, "base64").toString("binary");
  }
  if (!window.matchMedia) {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  }
}

describe("CmsDashboard Component", () => {
  const mockInitialContent = {
    meta: {
      title: "My Portfolio",
      keywords: "portfolio",
      description: "My bio",
      favicon: "favicon.ico",
    },
    navbar: {
      brand: "Brand",
      links: [{ href: "#home", label: "Home" }],
    },
    hero: {
      greeting: "Hello",
      name: "Amir",
      typedTexts: ["Android Developer"],
      heroImage: "img/hero.png",
      videoBackground: "video-id",
      buttons: [{ label: "CV", href: "/cv" }],
    },
    about: {
      sectionLabel: "Learn About Me",
      sectionTitle: "Information",
      image: "img/about.png",
      description: "Amir bio",
      skills: [{ name: "Kotlin", percentage: 90 }],
    },
    services: {
      sectionLabel: "Projects",
      sectionTitle: "Awesome Projects",
      items: [
        {
          icon: "fab fa-android",
          title: "Android SDK",
          description: "Android library",
          delay: "0.4s",
          url: "https://github.com",
        },
      ],
    },
    experience: {
      sectionLabel: "Resume",
      sectionTitle: "Working Experience",
      items: [
        {
          date: "2023 - Now",
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
          image: "img.jpg",
          title: "First Post",
          author: "Faisal",
          category: "Tech",
          date: "17-Mar-2020",
          comments: 0,
          excerpt: "Post excerpt",
          url: "https://medium.com",
          delay: "0.1s",
        },
      ],
    },
    footer: {
      name: "Muhammad Faisal Amir",
      address: "Jawa Timur",
      phone: "+6281357108568",
      email: "faisalamircs@gmail.com",
      copyright: "Copyright 2026",
      socials: [{ icon: "fab fa-twitter", url: "https://twitter.com" }],
    },
  };

  const mockDict = {};

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    // Clear localStorage mocks
    if (typeof window !== "undefined") {
      window.localStorage.clear();
    }
  });

  it("renders correctly with form tabs and local save button", () => {
    render(<CmsDashboard initialContent={JSON.parse(JSON.stringify(mockInitialContent))} dict={mockDict} lang="en" />);

    expect(screen.getByText("CMS visual editor")).toBeInTheDocument();
    expect(screen.getByText("Save Locally")).toBeInTheDocument();
    expect(screen.getByText("Sync to GitHub")).toBeInTheDocument();

    // Default tab is meta
    expect(screen.getByText("Meta SEO & Navbar Config")).toBeInTheDocument();
    expect(screen.getByDisplayValue("My Portfolio")).toBeInTheDocument();
  });

  it("switches tabs and displays respective section configuration forms", () => {
    render(<CmsDashboard initialContent={JSON.parse(JSON.stringify(mockInitialContent))} dict={mockDict} lang="en" />);

    // Click Hero Banner Tab
    fireEvent.click(screen.getByRole("button", { name: "Hero Banner" }));
    expect(screen.getByRole("heading", { name: "Hero Section Banner" })).toBeInTheDocument();
    expect(screen.getByDisplayValue("Amir")).toBeInTheDocument();

    // Click About Tab
    fireEvent.click(screen.getByRole("button", { name: "About & Skills" }));
    expect(screen.getByRole("heading", { name: "About & Skills" })).toBeInTheDocument();
    expect(screen.getByDisplayValue("Amir bio")).toBeInTheDocument();

    // Click Projects Tab
    fireEvent.click(screen.getByRole("button", { name: "Projects List" }));
    expect(screen.getByRole("heading", { name: "Projects List" })).toBeInTheDocument();
    expect(screen.getByDisplayValue("Android SDK")).toBeInTheDocument();

    // Click Experience Tab
    fireEvent.click(screen.getByRole("button", { name: "Experience" }));
    expect(screen.getByRole("heading", { name: "Experience Timeline" })).toBeInTheDocument();
    expect(screen.getByDisplayValue("Qomunal")).toBeInTheDocument();

    // Click Medium Posts Tab
    fireEvent.click(screen.getByRole("button", { name: "Medium Posts" }));
    expect(screen.getByRole("heading", { name: "Medium Blog Articles" })).toBeInTheDocument();
    expect(screen.getByDisplayValue("First Post")).toBeInTheDocument();

    // Click Footer & Socials Tab
    fireEvent.click(screen.getByRole("button", { name: "Footer & Socials" }));
    expect(screen.getByRole("heading", { name: "Footer Contact Info" })).toBeInTheDocument();
    expect(screen.getByDisplayValue("Jawa Timur")).toBeInTheDocument();

    // Click Raw JSON Editor Tab
    fireEvent.click(screen.getByRole("button", { name: "Raw JSON Editor" }));
    expect(screen.getByRole("heading", { name: "Raw JSON Payload Editor" })).toBeInTheDocument();
  });

  it("handles form submission to /api/content for local filesystem storage", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<CmsDashboard initialContent={JSON.parse(JSON.stringify(mockInitialContent))} dict={mockDict} lang="en" />);

    const saveBtn = screen.getByText("Save Locally");
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/content", expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }));
    });

    expect(screen.getByText("Content saved successfully on the local disk!")).toBeInTheDocument();
  });

  it("handles validation in Raw JSON tab", () => {
    render(<CmsDashboard initialContent={JSON.parse(JSON.stringify(mockInitialContent))} dict={mockDict} lang="en" />);

    // Switch to Raw JSON Editor Tab
    fireEvent.click(screen.getByText("Raw JSON Editor"));

    const textarea = screen.getByPlaceholderText("Paste raw content.json configuration here...");
    
    // Put valid JSON
    fireEvent.change(textarea, { target: { value: '{"meta": { "title": "New Title" }}' } });
    expect(screen.getByText("JSON syntax is valid")).toBeInTheDocument();

    // Put invalid JSON
    fireEvent.change(textarea, { target: { value: '{"meta": { "title": "New Title" }' } }); // missing closing brace
    expect(screen.getByText("Invalid JSON Structure")).toBeInTheDocument();
    expect(screen.getByText(/Parsing Error:/)).toBeInTheDocument();
  });

  it("opens GitHub Sync modal and updates the repository payload", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ sha: "mocked-sha" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ content: {} }),
      });
    vi.stubGlobal("fetch", fetchMock);

    render(<CmsDashboard initialContent={JSON.parse(JSON.stringify(mockInitialContent))} dict={mockDict} lang="en" />);

    // Open Modal
    fireEvent.click(screen.getByText("Sync to GitHub"));
    expect(screen.getByTestId("github-sync-modal")).toBeInTheDocument();

    // Fill in GitHub Token
    const tokenInput = screen.getByPlaceholderText("ghp_xxxxxxxxxxxxxxxxxxxx");
    fireEvent.change(tokenInput, { target: { value: "test-token-123" } });

    // Submit Push
    fireEvent.click(screen.getByText("Push to GitHub"));

    await waitFor(() => {
      // 1. Check SHA call
      expect(fetchMock).toHaveBeenNthCalledWith(
        1,
        "https://api.github.com/repos/amirisback/amirisback.github.io/contents/data/content.json?ref=main",
        expect.objectContaining({
          headers: {
            Authorization: "token test-token-123",
            Accept: "application/vnd.github.v3+json",
          },
        })
      );
      
      // 2. Check PUT call
      expect(fetchMock).toHaveBeenNthCalledWith(
        2,
        "https://api.github.com/repos/amirisback/amirisback.github.io/contents/data/content.json",
        expect.objectContaining({
          method: "PUT",
          body: expect.stringContaining("mocked-sha"),
        })
      );
    });

    expect(screen.getByText("Successfully synchronized and committed to GitHub!")).toBeInTheDocument();
  });

  it("handles adding navbar links in the form list", () => {
    render(<CmsDashboard initialContent={JSON.parse(JSON.stringify(mockInitialContent))} dict={mockDict} lang="en" />);
    
    const addLinkBtn = screen.getByRole("button", { name: /Add Link/i });
    fireEvent.click(addLinkBtn);
    
    expect(screen.getByDisplayValue("New Link")).toBeInTheDocument();
  });

  it("handles deleting navbar links in the form list", () => {
    render(<CmsDashboard initialContent={JSON.parse(JSON.stringify(mockInitialContent))} dict={mockDict} lang="en" />);
    
    expect(screen.getByDisplayValue("Home")).toBeInTheDocument();
    
    const deleteButtons = screen.getAllByRole("button").filter(
      btn => btn.querySelector(".fa-trash-alt") || btn.innerHTML.includes("fa-trash-alt")
    );
    expect(deleteButtons.length).toBeGreaterThan(0);
    fireEvent.click(deleteButtons[0]);
    
    expect(screen.queryByDisplayValue("Home")).toBeNull();
  });

  it("handles moving items up and down in lists", () => {
    render(<CmsDashboard initialContent={JSON.parse(JSON.stringify(mockInitialContent))} dict={mockDict} lang="en" />);
    
    const addLinkBtn = screen.getByRole("button", { name: /Add Link/i });
    fireEvent.click(addLinkBtn); // index 1
    fireEvent.click(addLinkBtn); // index 2
    
    const inputs = screen.getAllByPlaceholderText("Label") as HTMLInputElement[];
    fireEvent.change(inputs[1], { target: { value: "Link 2" } });
    fireEvent.change(inputs[2], { target: { value: "Link 3" } });
    
    // Check initial order: Home (0), Link 2 (1), Link 3 (2)
    let currentInputs = screen.getAllByPlaceholderText("Label") as HTMLInputElement[];
    expect(currentInputs[0].value).toBe("Home");
    expect(currentInputs[1].value).toBe("Link 2");
    expect(currentInputs[2].value).toBe("Link 3");
    
    // Find move down buttons
    const moveDownButtons = screen.getAllByRole("button").filter(
      btn => btn.querySelector(".fa-arrow-down") || btn.innerHTML.includes("fa-arrow-down")
    );
    // Click move down on index 0 ("Home")
    fireEvent.click(moveDownButtons[0]);
    
    // Verify order is now: Link 2 (0), Home (1), Link 3 (2)
    currentInputs = screen.getAllByPlaceholderText("Label") as HTMLInputElement[];
    expect(currentInputs[0].value).toBe("Link 2");
    expect(currentInputs[1].value).toBe("Home");
    expect(currentInputs[2].value).toBe("Link 3");
    
    // Find move up buttons
    const moveUpButtons = screen.getAllByRole("button").filter(
      btn => btn.querySelector(".fa-arrow-up") || btn.innerHTML.includes("fa-arrow-up")
    );
    // Click move up on index 1 ("Home")
    fireEvent.click(moveUpButtons[1]);
    
    // Verify order is back to: Home (0), Link 2 (1), Link 3 (2)
    currentInputs = screen.getAllByPlaceholderText("Label") as HTMLInputElement[];
    expect(currentInputs[0].value).toBe("Home");
    expect(currentInputs[1].value).toBe("Link 2");
    expect(currentInputs[2].value).toBe("Link 3");
  });

  it("handles hero typed texts modifications (string lists)", () => {
    render(<CmsDashboard initialContent={JSON.parse(JSON.stringify(mockInitialContent))} dict={mockDict} lang="en" />);
    
    fireEvent.click(screen.getByRole("button", { name: "Hero Banner" }));
    
    const addTitleBtn = screen.getByRole("button", { name: /Add Title/i });
    fireEvent.click(addTitleBtn);
    
    expect(screen.getByDisplayValue("Mobile App Developer")).toBeInTheDocument();
    
    const inputs = screen.getAllByDisplayValue("Mobile App Developer");
    fireEvent.change(inputs[0], { target: { value: "NextJS Master" } });
    expect(screen.getByDisplayValue("NextJS Master")).toBeInTheDocument();
    
    const deleteBtn = screen.getAllByRole("button").filter(
      btn => btn.querySelector(".fa-trash-alt") || btn.innerHTML.includes("fa-trash-alt")
    )[1];
    fireEvent.click(deleteBtn);
    expect(screen.queryByDisplayValue("NextJS Master")).toBeNull();
  });

  it("shows error if github sync is triggered without token or invalid repo", async () => {
    render(<CmsDashboard initialContent={JSON.parse(JSON.stringify(mockInitialContent))} dict={mockDict} lang="en" />);
    
    // Open GitHub modal
    fireEvent.click(screen.getByText("Sync to GitHub"));
    
    // Clear token input (it might be pre-filled from localStorage mock, but we cleared localStorage)
    const tokenInput = screen.getByPlaceholderText("ghp_xxxxxxxxxxxxxxxxxxxx");
    fireEvent.change(tokenInput, { target: { value: "" } });
    
    // Click Push
    fireEvent.click(screen.getByText("Push to GitHub"));
    
    // Verify toast error is shown
    expect(screen.getByText("GitHub Access Token is required.")).toBeInTheDocument();

    // Now set token, but clear repo
    fireEvent.change(tokenInput, { target: { value: "my-token" } });
    const repoInput = screen.getByPlaceholderText("amirisback/amirisback.github.io");
    fireEvent.change(repoInput, { target: { value: "invalid-repo-format" } });
    fireEvent.click(screen.getByText("Push to GitHub"));
    
    expect(screen.getByText("Please enter repository in 'owner/repo' format.")).toBeInTheDocument();
  });

  it("handles github api error when fetching SHA", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ message: "Internal server error" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<CmsDashboard initialContent={JSON.parse(JSON.stringify(mockInitialContent))} dict={mockDict} lang="en" />);
    
    fireEvent.click(screen.getByText("Sync to GitHub"));
    
    const tokenInput = screen.getByPlaceholderText("ghp_xxxxxxxxxxxxxxxxxxxx");
    fireEvent.change(tokenInput, { target: { value: "my-token" } });
    
    fireEvent.click(screen.getByText("Push to GitHub"));
    
    await waitFor(() => {
      expect(screen.getByText("GitHub Sync Failed: Internal server error")).toBeInTheDocument();
    });
  });

  it("handles github api error when pushing commit", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ sha: "mocked-sha" }),
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: "Commit rejected" }),
      });
    vi.stubGlobal("fetch", fetchMock);

    render(<CmsDashboard initialContent={JSON.parse(JSON.stringify(mockInitialContent))} dict={mockDict} lang="en" />);
    
    fireEvent.click(screen.getByText("Sync to GitHub"));
    
    const tokenInput = screen.getByPlaceholderText("ghp_xxxxxxxxxxxxxxxxxxxx");
    fireEvent.change(tokenInput, { target: { value: "my-token" } });
    
    fireEvent.click(screen.getByText("Push to GitHub"));
    
    await waitFor(() => {
      expect(screen.getByText("GitHub Sync Failed: Commit rejected")).toBeInTheDocument();
    });
  });

  it("handles failure during local save operation", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ success: false, error: "Disk full" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<CmsDashboard initialContent={JSON.parse(JSON.stringify(mockInitialContent))} dict={mockDict} lang="en" />);
    
    const saveBtn = screen.getByText("Save Locally");
    fireEvent.click(saveBtn);
    
    await waitFor(() => {
      expect(screen.getByText("Failed to save locally: Disk full")).toBeInTheDocument();
    });
  });

  it("loads git config settings from localStorage on mount", () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("cms_git_token", "saved-token");
      window.localStorage.setItem("cms_git_repo", "saved-owner/saved-repo");
      window.localStorage.setItem("cms_git_branch", "saved-branch");
    }

    render(<CmsDashboard initialContent={JSON.parse(JSON.stringify(mockInitialContent))} dict={mockDict} lang="en" />);
    
    fireEvent.click(screen.getByText("Sync to GitHub"));
    
    const tokenInput = screen.getByPlaceholderText("ghp_xxxxxxxxxxxxxxxxxxxx") as HTMLInputElement;
    const repoInput = screen.getByPlaceholderText("amirisback/amirisback.github.io") as HTMLInputElement;
    
    expect(tokenInput.value).toBe("saved-token");
    expect(repoInput.value).toBe("saved-owner/saved-repo");
  });

  it("interacts with all other section forms and fields to ensure full functions coverage", () => {
    render(<CmsDashboard initialContent={JSON.parse(JSON.stringify(mockInitialContent))} dict={mockDict} lang="en" />);

    // 1. About Tab
    fireEvent.click(screen.getByRole("button", { name: "About & Skills" }));
    
    // Add Skill
    const addSkillBtn = screen.getByRole("button", { name: /Add Skill/i });
    fireEvent.click(addSkillBtn);
    
    // Change image, description, skill fields
    const aboutImgInput = screen.getByDisplayValue("img/about.png");
    fireEvent.change(aboutImgInput, { target: { value: "img/new-about.png" } });
    
    const bioTextarea = screen.getByDisplayValue("Amir bio");
    fireEvent.change(bioTextarea, { target: { value: "New bio summary" } });
    
    const skillNameInput = screen.getByDisplayValue("Kotlin");
    fireEvent.change(skillNameInput, { target: { value: "Java" } });
    
    const skillPercentageInput = screen.getAllByDisplayValue("90")[0];
    fireEvent.change(skillPercentageInput, { target: { value: "95" } });
    
    // Range input change
    const skillRanges = screen.getAllByRole("slider");
    expect(skillRanges.length).toBeGreaterThan(0);
    fireEvent.change(skillRanges[0], { target: { value: "80" } });
    
    // Skill delete button
    const deleteSkillButtons = screen.getAllByRole("button").filter(
      btn => btn.querySelector(".fa-trash-alt") || btn.innerHTML.includes("fa-trash-alt")
    );
    fireEvent.click(deleteSkillButtons[0]);

    // 2. Projects List Tab
    fireEvent.click(screen.getByRole("button", { name: "Projects List" }));
    
    const addProjectBtn = screen.getByRole("button", { name: /Add Project/i });
    fireEvent.click(addProjectBtn);
    
    const projectTitleInput = screen.getByDisplayValue("Android SDK");
    fireEvent.change(projectTitleInput, { target: { value: "iOS SDK" } });
    
    const projectIconInput = screen.getAllByDisplayValue("fab fa-android")[0];
    fireEvent.change(projectIconInput, { target: { value: "fab fa-apple" } });
    
    const projectUrlInput = screen.getByDisplayValue("https://github.com");
    fireEvent.change(projectUrlInput, { target: { value: "https://github.com/new" } });
    
    const projectDelayInput = screen.getAllByDisplayValue("0.4s")[0];
    fireEvent.change(projectDelayInput, { target: { value: "0.2s" } });
    
    const projectDescInput = screen.getByDisplayValue("Android library");
    fireEvent.change(projectDescInput, { target: { value: "iOS library" } });
    
    // Move project buttons
    const moveProjectDownBtn = screen.getAllByRole("button").filter(
      btn => btn.querySelector(".fa-arrow-down") || btn.innerHTML.includes("fa-arrow-down")
    )[0];
    fireEvent.click(moveProjectDownBtn);
    
    const moveProjectUpBtn = screen.getAllByRole("button").filter(
      btn => btn.querySelector(".fa-arrow-up") || btn.innerHTML.includes("fa-arrow-up")
    )[1]; // first is disabled
    fireEvent.click(moveProjectUpBtn);
    
    // Delete project
    const deleteProjectBtn = screen.getAllByRole("button").filter(
      btn => btn.querySelector(".fa-trash-alt") || btn.innerHTML.includes("fa-trash-alt")
    )[0];
    fireEvent.click(deleteProjectBtn);

    // 3. Experience Tab
    fireEvent.click(screen.getByRole("button", { name: "Experience" }));
    
    const addExpBtn = screen.getByRole("button", { name: /Add Entry/i });
    fireEvent.click(addExpBtn);
    
    const expDateInput = screen.getByDisplayValue("2023 - Now");
    fireEvent.change(expDateInput, { target: { value: "2024 - Now" } });
    
    const expPosInput = screen.getByDisplayValue("Android Dev");
    fireEvent.change(expPosInput, { target: { value: "Lead Dev" } });
    
    const expCompanyInput = screen.getByDisplayValue("Qomunal");
    fireEvent.change(expCompanyInput, { target: { value: "New Co" } });
    
    const expLocInput = screen.getByDisplayValue("Jakarta");
    fireEvent.change(expLocInput, { target: { value: "Bandung" } });
    
    const expSideSelect = screen.getAllByDisplayValue("Left Column")[0];
    fireEvent.change(expSideSelect, { target: { value: "right" } });
    
    // Move exp buttons
    const moveExpDownBtn = screen.getAllByRole("button").filter(
      btn => btn.querySelector(".fa-arrow-down") || btn.innerHTML.includes("fa-arrow-down")
    )[0];
    fireEvent.click(moveExpDownBtn);
    
    const moveExpUpBtn = screen.getAllByRole("button").filter(
      btn => btn.querySelector(".fa-arrow-up") || btn.innerHTML.includes("fa-arrow-up")
    )[1];
    fireEvent.click(moveExpUpBtn);
    
    // Delete exp
    const deleteExpBtn = screen.getAllByRole("button").filter(
      btn => btn.querySelector(".fa-trash-alt") || btn.innerHTML.includes("fa-trash-alt")
    )[0];
    fireEvent.click(deleteExpBtn);

    // 4. Medium Posts Tab
    fireEvent.click(screen.getByRole("button", { name: "Medium Posts" }));
    
    const addPostBtn = screen.getByRole("button", { name: /Add Post/i });
    fireEvent.click(addPostBtn);
    
    const postTitleInput = screen.getByDisplayValue("First Post");
    fireEvent.change(postTitleInput, { target: { value: "Second Post" } });
    
    const postCatInput = screen.getByDisplayValue("Tech");
    fireEvent.change(postCatInput, { target: { value: "Life" } });
    
    const postImgInput = screen.getByDisplayValue("img.jpg");
    fireEvent.change(postImgInput, { target: { value: "img2.jpg" } });
    
    const postUrlInput = screen.getAllByDisplayValue("https://medium.com")[0];
    fireEvent.change(postUrlInput, { target: { value: "https://medium.com/2" } });
    
    const postAuthorInput = screen.getByDisplayValue("Faisal");
    fireEvent.change(postAuthorInput, { target: { value: "Amir" } });
    
    const postDateInput = screen.getByDisplayValue("17-Mar-2020");
    fireEvent.change(postDateInput, { target: { value: "18-Mar-2020" } });
    
    const postDelayInput = screen.getAllByDisplayValue("0.1s")[0];
    fireEvent.change(postDelayInput, { target: { value: "0.2s" } });
    
    const postExcerptInput = screen.getByDisplayValue("Post excerpt");
    fireEvent.change(postExcerptInput, { target: { value: "New excerpt" } });
    
    // Move post
    const movePostDownBtn = screen.getAllByRole("button").filter(
      btn => btn.querySelector(".fa-arrow-down") || btn.innerHTML.includes("fa-arrow-down")
    )[0];
    fireEvent.click(movePostDownBtn);
    
    const movePostUpBtn = screen.getAllByRole("button").filter(
      btn => btn.querySelector(".fa-arrow-up") || btn.innerHTML.includes("fa-arrow-up")
    )[1];
    fireEvent.click(movePostUpBtn);
    
    // Delete post
    const deletePostBtn = screen.getAllByRole("button").filter(
      btn => btn.querySelector(".fa-trash-alt") || btn.innerHTML.includes("fa-trash-alt")
    )[0];
    fireEvent.click(deletePostBtn);

    // 5. Footer & Socials Tab
    fireEvent.click(screen.getByRole("button", { name: "Footer & Socials" }));
    
    const addSocialBtn = screen.getByRole("button", { name: /Add Channel/i });
    fireEvent.click(addSocialBtn);
    
    const footerNameInput = screen.getByDisplayValue("Muhammad Faisal Amir");
    fireEvent.change(footerNameInput, { target: { value: "Faisal Amir" } });
    
    const footerCopyrightInput = screen.getByDisplayValue("Copyright 2026");
    fireEvent.change(footerCopyrightInput, { target: { value: "Copyright 2027" } });
    
    const footerAddrInput = screen.getByDisplayValue("Jawa Timur");
    fireEvent.change(footerAddrInput, { target: { value: "East Java" } });
    
    const footerPhoneInput = screen.getByDisplayValue("+6281357108568");
    fireEvent.change(footerPhoneInput, { target: { value: "12345" } });
    
    const footerEmailInput = screen.getByDisplayValue("faisalamircs@gmail.com");
    fireEvent.change(footerEmailInput, { target: { value: "test@gmail.com" } });
    
    const socialIconInput = screen.getByDisplayValue("fab fa-twitter");
    fireEvent.change(socialIconInput, { target: { value: "fab fa-github" } });
    
    const socialUrlInput = screen.getByDisplayValue("https://twitter.com");
    fireEvent.change(socialUrlInput, { target: { value: "https://github.com" } });
    
    // Delete social
    const deleteSocialBtn = screen.getAllByRole("button").filter(
      btn => btn.querySelector(".fa-trash-alt") || btn.innerHTML.includes("fa-trash-alt")
    )[0];
    fireEvent.click(deleteSocialBtn);
  });
});
