"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { PortfolioData } from "@/lib/content";
import type { Locale } from "@/i18n/config";
import { ThemeToggle } from "@/app/[lang]/_components/theme-toggle";

interface CmsDashboardProps {
  initialContent: PortfolioData;
  lang: Locale;
}

type TabType = "meta" | "hero" | "about" | "services" | "experience" | "blog" | "footer" | "json";

export function CmsDashboard({ initialContent, lang }: CmsDashboardProps) {
  const [data, setData] = useState<PortfolioData>(initialContent);
  const [activeTab, setActiveTab] = useState<TabType>("meta");
  const [jsonText, setJsonText] = useState<string>(JSON.stringify(initialContent, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Status/Toast states
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);
  const [saving, setSaving] = useState(false);

  // GitHub Modal states
  const [isGitModalOpen, setIsGitModalOpen] = useState(false);
  const [gitToken, setGitToken] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("cms_git_token") || "";
    }
    return "";
  });
  const [gitRepo, setGitRepo] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("cms_git_repo") || "amirisback/amirisback.github.io";
    }
    return "amirisback/amirisback.github.io";
  });
  const [gitBranch, setGitBranch] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("cms_git_branch") || "main";
    }
    return "main";
  });
  const [gitCommitMsg, setGitCommitMsg] = useState("chore: update portfolio content via cms");
  const [gitSyncing, setGitSyncing] = useState(false);

  // Auto-dismiss status messages after 4 seconds
  useEffect(() => {
    if (statusMsg) {
      const timer = setTimeout(() => setStatusMsg(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [statusMsg]);

  // Sync form state changes to json text editor state
  const handleFormUpdate = (updatedData: PortfolioData) => {
    setData(updatedData);
    setJsonText(JSON.stringify(updatedData, null, 2));
    setJsonError(null);
  };

  // Sync raw JSON editor edits back to form state
  const handleJsonChange = (text: string) => {
    setJsonText(text);
    try {
      const parsed = JSON.parse(text);
      setData(parsed);
      setJsonError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setJsonError(message);
    }
  };

  // Save changes locally by posting to /api/content
  const saveLocally = async () => {
    if (jsonError) {
      setStatusMsg({ text: "Please fix JSON syntax errors before saving.", type: "error" });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setStatusMsg({ text: "Content saved successfully on the local disk!", type: "success" });
      } else {
        throw new Error(result.error || "Failed to save");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setStatusMsg({ text: `Failed to save locally: ${message}`, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  // Sync changes directly to GitHub
  const syncToGitHub = async () => {
    if (!gitToken) {
      setStatusMsg({ text: "GitHub Access Token is required.", type: "error" });
      return;
    }
    if (!gitRepo || !gitRepo.includes("/")) {
      setStatusMsg({ text: "Please enter repository in 'owner/repo' format.", type: "error" });
      return;
    }

    setGitSyncing(true);
    setStatusMsg({ text: "Syncing with GitHub...", type: "info" });

    // Save tokens in local storage
    localStorage.setItem("cms_git_token", gitToken);
    localStorage.setItem("cms_git_repo", gitRepo);
    localStorage.setItem("cms_git_branch", gitBranch);

    const filePath = "data/content.json";
    const [owner, repo] = gitRepo.split("/");

    try {
      // 1. Get current SHA of the content file
      const shaRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${gitBranch}`,
        {
          headers: {
            Authorization: `token ${gitToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      let sha = "";
      if (shaRes.ok) {
        const fileInfo = await shaRes.json();
        sha = fileInfo.sha;
      } else if (shaRes.status !== 404) {
        const errorDetail = await shaRes.json();
        throw new Error(errorDetail.message || "Failed to query file metadata from GitHub");
      }

      // 2. Put updated content to GitHub
      const updatedBody = {
        message: gitCommitMsg,
        content: btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2) + "\n"))),
        branch: gitBranch,
        ...(sha ? { sha } : {}),
      };

      const putRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
        {
          method: "PUT",
          headers: {
            Authorization: `token ${gitToken}`,
            "Content-Type": "application/json",
            Accept: "application/vnd.github.v3+json",
          },
          body: JSON.stringify(updatedBody),
        }
      );

      const putResult = await putRes.json();
      if (putRes.ok) {
        setStatusMsg({ text: "Successfully synchronized and committed to GitHub!", type: "success" });
        setIsGitModalOpen(false);
      } else {
        throw new Error(putResult.message || "Push rejected by GitHub API");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setStatusMsg({ text: `GitHub Sync Failed: ${message}`, type: "error" });
    } finally {
      setGitSyncing(false);
    }
  };

  // List manipulation helpers
  const updateListItem = (
    listName: "navbar.links" | "hero.typedTexts" | "hero.buttons" | "about.skills" | "services.items" | "experience.items" | "blog.posts" | "footer.socials",
    index: number,
    field: string | null,
    value: unknown
  ) => {
    const newData = { ...data };
    const [parentKey, childKey] = listName.split(".");
    const parent = newData[parentKey as keyof PortfolioData] as unknown as Record<string, unknown[]>;
    const list = parent[childKey];
    
    if (field === null) {
      list[index] = value;
    } else {
      list[index] = {
        ...(list[index] as Record<string, unknown>),
        [field]: value,
      };
    }
    handleFormUpdate(newData);
  };

  const addListItem = (
    listName: "navbar.links" | "hero.typedTexts" | "hero.buttons" | "about.skills" | "services.items" | "experience.items" | "blog.posts" | "footer.socials",
    defaultItem: unknown
  ) => {
    const newData = { ...data };
    const [parentKey, childKey] = listName.split(".");
    const parent = newData[parentKey as keyof PortfolioData] as unknown as Record<string, unknown[]>;
    parent[childKey] = [...parent[childKey], defaultItem];
    handleFormUpdate(newData);
  };

  const deleteListItem = (
    listName: "navbar.links" | "hero.typedTexts" | "hero.buttons" | "about.skills" | "services.items" | "experience.items" | "blog.posts" | "footer.socials",
    index: number
  ) => {
    const newData = { ...data };
    const [parentKey, childKey] = listName.split(".");
    const parent = newData[parentKey as keyof PortfolioData] as unknown as Record<string, unknown[]>;
    parent[childKey] = parent[childKey].filter((_, i) => i !== index);
    handleFormUpdate(newData);
  };

  const moveListItem = (
    listName: "navbar.links" | "hero.typedTexts" | "hero.buttons" | "about.skills" | "services.items" | "experience.items" | "blog.posts" | "footer.socials",
    index: number,
    direction: "up" | "down"
  ) => {
    const newData = { ...data };
    const [parentKey, childKey] = listName.split(".");
    const parent = newData[parentKey as keyof PortfolioData] as unknown as Record<string, unknown[]>;
    const list = [...parent[childKey]];
    
    if (direction === "up" && index > 0) {
      const temp = list[index];
      list[index] = list[index - 1];
      list[index - 1] = temp;
    } else if (direction === "down" && index < list.length - 1) {
      const temp = list[index];
      list[index] = list[index + 1];
      list[index + 1] = temp;
    }
    parent[childKey] = list;
    handleFormUpdate(newData);
  };

  return (
    <div className="cms-editor min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 font-sans flex flex-col antialiased">
      {/* Toast Alert */}
      {statusMsg && (
        <div
          data-testid="status-alert"
          className={`fixed top-6 right-6 z-50 flex items-center p-4 rounded shadow-xl border text-sm max-w-md animate-fade-in ${
            statusMsg.type === "success"
              ? "bg-white dark:bg-zinc-800 text-cyan-600 dark:text-cyan-400 border-cyan-500/30"
              : statusMsg.type === "error"
              ? "bg-white dark:bg-zinc-800 text-red-600 dark:text-red-400 border-red-500/30"
              : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700"
          }`}
        >
          <i
            className={`fas ${
              statusMsg.type === "success"
                ? "fa-check-circle mr-3 text-cyan-600 dark:text-cyan-400"
                : statusMsg.type === "error"
                ? "fa-exclamation-circle mr-3 text-red-600 dark:text-red-400"
                : "fa-info-circle mr-3 text-cyan-600 dark:text-cyan-400"
            }`}
          />
          <div>{statusMsg.text}</div>
        </div>
      )}

      {/* Header bar */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Link
            href={`/${lang}`}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-white transition-colors"
            title="Go to Homepage"
          >
            <i className="fas fa-arrow-left text-sm" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-white tracking-wide">CMS visual editor</h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-cyan-600 dark:bg-cyan-400 animate-pulse" />
              Connected to local filesystem
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <ThemeToggle isSticky className="border-zinc-200 dark:border-zinc-700/50" />

          {/* Save Locally Button */}
          <button
            onClick={saveLocally}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 rounded text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer text-zinc-800 dark:text-white"
          >
            <i className={`fas ${saving ? "fa-circle-notch fa-spin" : "fa-save"}`} />
            Save Locally
          </button>

          {/* Sync to GitHub Button */}
          <button
            onClick={() => setIsGitModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 rounded text-sm font-bold transition-colors cursor-pointer"
          >
            <i className="fab fa-github" />
            Sync to GitHub
          </button>
        </div>
      </header>

      {/* Main content grid */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 p-4 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible">
          {[
            { id: "meta", label: "Meta & Brand", icon: "fa-globe" },
            { id: "hero", label: "Hero Banner", icon: "fa-image" },
            { id: "about", label: "About & Skills", icon: "fa-user" },
            { id: "services", label: "Projects List", icon: "fa-tasks" },
            { id: "experience", label: "Experience", icon: "fa-history" },
            { id: "blog", label: "Medium Posts", icon: "fa-newspaper" },
            { id: "footer", label: "Footer & Socials", icon: "fa-address-card" },
            { id: "json", label: "Raw JSON Editor", icon: "fa-code" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-3 px-4 py-3 rounded text-sm font-semibold transition-all shrink-0 cursor-pointer text-left ${
                activeTab === tab.id
                  ? "bg-zinc-100 dark:bg-zinc-800 text-cyan-600 dark:text-cyan-400 border-l-4 border-cyan-500 pl-3"
                  : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/50 hover:text-zinc-800 dark:hover:text-white"
              }`}
            >
              <i className={`fas ${tab.icon} w-5 text-center`} />
              <span>{tab.label}</span>
            </button>
          ))}
        </aside>

        {/* Form Container */}
        <main className="flex-1 p-6 md:p-8 bg-zinc-50 dark:bg-zinc-900 max-w-4xl overflow-y-auto">
          {/* Tab 1: Meta */}
          {activeTab === "meta" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white border-b border-zinc-800 pb-3">Meta SEO & Navbar Config</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Meta Title</label>
                  <input
                    type="text"
                    value={data.meta.title}
                    onChange={(e) => handleFormUpdate({ ...data, meta: { ...data.meta, title: e.target.value } })}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-cyan-500 rounded p-2.5 outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Favicon Link</label>
                  <input
                    type="text"
                    value={data.meta.favicon}
                    onChange={(e) => handleFormUpdate({ ...data, meta: { ...data.meta, favicon: e.target.value } })}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-cyan-500 rounded p-2.5 outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Meta Keywords</label>
                  <input
                    type="text"
                    value={data.meta.keywords}
                    onChange={(e) => handleFormUpdate({ ...data, meta: { ...data.meta, keywords: e.target.value } })}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-cyan-500 rounded p-2.5 outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Meta Description</label>
                  <textarea
                    rows={3}
                    value={data.meta.description}
                    onChange={(e) => handleFormUpdate({ ...data, meta: { ...data.meta, description: e.target.value } })}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-cyan-500 rounded p-2.5 outline-none transition-colors resize-y"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-zinc-800">
                <h3 className="text-lg font-bold text-white">Navbar Brand & Links</h3>
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Brand Title</label>
                  <input
                    type="text"
                    value={data.navbar.brand}
                    onChange={(e) => handleFormUpdate({ ...data, navbar: { ...data.navbar, brand: e.target.value } })}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-cyan-500 rounded p-2.5 outline-none transition-colors"
                  />
                </div>

                <div className="space-y-3 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Navbar Menu Items</span>
                    <button
                      onClick={() => addListItem("navbar.links", { href: "#", label: "New Link" })}
                      className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold rounded cursor-pointer"
                    >
                      <i className="fas fa-plus mr-1.5" /> Add Link
                    </button>
                  </div>

                  {data.navbar.links.map((link, idx) => (
                    <div key={idx} className="flex flex-wrap items-center gap-3 p-3 bg-zinc-950 rounded border border-zinc-800/80">
                      <div className="flex-1 min-w-[150px] space-y-1">
                        <input
                          type="text"
                          placeholder="Label"
                          value={link.label}
                          onChange={(e) => updateListItem("navbar.links", idx, "label", e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 focus:border-cyan-500 rounded p-1.5 text-sm outline-none"
                        />
                      </div>
                      <div className="flex-1 min-w-[150px] space-y-1">
                        <input
                          type="text"
                          placeholder="href Anchor / URL"
                          value={link.href}
                          onChange={(e) => updateListItem("navbar.links", idx, "href", e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 focus:border-cyan-500 rounded p-1.5 text-sm outline-none"
                        />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => moveListItem("navbar.links", idx, "up")}
                          disabled={idx === 0}
                          className="w-8 h-8 flex items-center justify-center rounded bg-zinc-900 border border-zinc-800 text-xs hover:bg-zinc-800 disabled:opacity-30 cursor-pointer"
                        >
                          <i className="fas fa-arrow-up" />
                        </button>
                        <button
                          onClick={() => moveListItem("navbar.links", idx, "down")}
                          disabled={idx === data.navbar.links.length - 1}
                          className="w-8 h-8 flex items-center justify-center rounded bg-zinc-900 border border-zinc-800 text-xs hover:bg-zinc-800 disabled:opacity-30 cursor-pointer"
                        >
                          <i className="fas fa-arrow-down" />
                        </button>
                        <button
                          onClick={() => deleteListItem("navbar.links", idx)}
                          className="w-8 h-8 flex items-center justify-center rounded bg-red-950/40 border border-red-900/50 text-red-400 hover:bg-red-900/40 text-xs cursor-pointer"
                        >
                          <i className="fas fa-trash-alt" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Hero */}
          {activeTab === "hero" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white border-b border-zinc-800 pb-3">Hero Section Banner</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Greeting Prefix</label>
                  <input
                    type="text"
                    value={data.hero.greeting}
                    onChange={(e) => handleFormUpdate({ ...data, hero: { ...data.hero, greeting: e.target.value } })}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-cyan-500 rounded p-2.5 outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Full Name</label>
                  <input
                    type="text"
                    value={data.hero.name}
                    onChange={(e) => handleFormUpdate({ ...data, hero: { ...data.hero, name: e.target.value } })}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-cyan-500 rounded p-2.5 outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Hero Image Path</label>
                  <input
                    type="text"
                    value={data.hero.heroImage}
                    onChange={(e) => handleFormUpdate({ ...data, hero: { ...data.hero, heroImage: e.target.value } })}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-cyan-500 rounded p-2.5 outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">YouTube Background Video ID (Optional)</label>
                  <input
                    type="text"
                    value={data.hero.videoBackground || ""}
                    onChange={(e) => handleFormUpdate({ ...data, hero: { ...data.hero, videoBackground: e.target.value } })}
                    placeholder="e.g. 1eeqZNn-k0Y"
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-cyan-500 rounded p-2.5 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Typed Animated Titles */}
              <div className="space-y-4 pt-6 border-t border-zinc-800">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold text-white">Typed Animations Loop</h3>
                  <button
                    onClick={() => addListItem("hero.typedTexts", "Mobile App Developer")}
                    className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold rounded cursor-pointer"
                  >
                    <i className="fas fa-plus mr-1.5" /> Add Title
                  </button>
                </div>
                {data.hero.typedTexts.map((title, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => updateListItem("hero.typedTexts", idx, null, e.target.value)}
                      className="flex-1 bg-zinc-950 border border-zinc-800 focus:border-cyan-500 rounded p-2.5 outline-none transition-colors"
                    />
                    <button
                      onClick={() => deleteListItem("hero.typedTexts", idx)}
                      className="w-10 h-10 flex items-center justify-center rounded bg-red-950/40 border border-red-900/50 text-red-400 hover:bg-red-900/40 cursor-pointer"
                    >
                      <i className="fas fa-trash-alt" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Hero Call to Action Buttons */}
              <div className="space-y-4 pt-6 border-t border-zinc-800">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold text-white">CTA Action Buttons</h3>
                  <button
                    onClick={() => addListItem("hero.buttons", { label: "Follow Me", href: "https://github.com" })}
                    className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold rounded cursor-pointer"
                  >
                    <i className="fas fa-plus mr-1.5" /> Add Button
                  </button>
                </div>
                {data.hero.buttons.map((btn, idx) => (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-zinc-950 rounded border border-zinc-800/80 relative">
                    <div className="space-y-1">
                      <label className="block text-2xs text-zinc-500 uppercase tracking-wide">Label</label>
                      <input
                        type="text"
                        value={btn.label}
                        onChange={(e) => updateListItem("hero.buttons", idx, "label", e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 focus:border-cyan-500 rounded p-2 text-sm outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-2xs text-zinc-500 uppercase tracking-wide">URL/Anchor Href</label>
                      <input
                        type="text"
                        value={btn.href}
                        onChange={(e) => updateListItem("hero.buttons", idx, "href", e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 focus:border-cyan-500 rounded p-2 text-sm outline-none"
                      />
                    </div>
                    <button
                      onClick={() => deleteListItem("hero.buttons", idx)}
                      className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded bg-red-950/40 border border-red-900/50 text-red-400 hover:bg-red-900/40 cursor-pointer"
                    >
                      <i className="fas fa-times text-xs" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: About */}
          {activeTab === "about" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white border-b border-zinc-800 pb-3">About & Skills</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">About Photo Path</label>
                  <input
                    type="text"
                    value={data.about.image}
                    onChange={(e) => handleFormUpdate({ ...data, about: { ...data.about, image: e.target.value } })}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-cyan-500 rounded p-2.5 outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Bio Summary Description</label>
                  <textarea
                    rows={6}
                    value={data.about.description}
                    onChange={(e) => handleFormUpdate({ ...data, about: { ...data.about, description: e.target.value } })}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-cyan-500 rounded p-2.5 outline-none transition-colors resize-y leading-relaxed"
                  />
                </div>
              </div>

              {/* Skills Editor */}
              <div className="space-y-4 pt-6 border-t border-zinc-800">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold text-white">Skills Matrix</h3>
                  <button
                    onClick={() => addListItem("about.skills", { name: "New Skill", percentage: 50 })}
                    className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold rounded cursor-pointer"
                  >
                    <i className="fas fa-plus mr-1.5" /> Add Skill
                  </button>
                </div>

                <div className="space-y-3">
                  {data.about.skills.map((skill, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-zinc-950 rounded border border-zinc-800">
                      <div className="flex-2 space-y-1">
                        <input
                          type="text"
                          placeholder="Skill Name"
                          value={skill.name}
                          onChange={(e) => updateListItem("about.skills", idx, "name", e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 focus:border-cyan-500 rounded p-2 text-sm outline-none text-white"
                        />
                      </div>
                      <div className="flex-1 flex items-center gap-3">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={skill.percentage}
                          onChange={(e) => updateListItem("about.skills", idx, "percentage", parseInt(e.target.value) || 0)}
                          className="w-16 bg-zinc-900 border border-zinc-800 focus:border-cyan-500 rounded p-2 text-sm text-center outline-none text-white"
                        />
                        <span className="text-zinc-500 text-sm">%</span>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={skill.percentage}
                          onChange={(e) => updateListItem("about.skills", idx, "percentage", parseInt(e.target.value) || 0)}
                          className="flex-1 accent-cyan-500 cursor-pointer"
                        />
                      </div>
                      <button
                        onClick={() => deleteListItem("about.skills", idx)}
                        className="w-8 h-8 flex items-center justify-center rounded bg-red-950/40 border border-red-900/50 text-red-400 hover:bg-red-900/40 cursor-pointer"
                      >
                        <i className="fas fa-trash-alt text-sm" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Services / Projects */}
          {activeTab === "services" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                <h2 className="text-xl font-bold text-white">Projects List</h2>
                <button
                  onClick={() => addListItem("services.items", { icon: "fab fa-android", title: "My New Project", description: "Project description details.", delay: "0.4s", url: "" })}
                  className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold rounded cursor-pointer"
                >
                  <i className="fas fa-plus mr-1.5" /> Add Project
                </button>
              </div>

              <div className="space-y-4">
                {data.services.items.map((item, idx) => (
                  <div key={idx} className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg space-y-3 relative group">
                    <div className="absolute top-4 right-4 flex items-center gap-1.5">
                      <button
                        onClick={() => moveListItem("services.items", idx, "up")}
                        disabled={idx === 0}
                        className="w-7 h-7 flex items-center justify-center rounded bg-zinc-900 border border-zinc-800 text-2xs hover:bg-zinc-800 disabled:opacity-30 cursor-pointer"
                      >
                        <i className="fas fa-arrow-up" />
                      </button>
                      <button
                        onClick={() => moveListItem("services.items", idx, "down")}
                        disabled={idx === data.services.items.length - 1}
                        className="w-7 h-7 flex items-center justify-center rounded bg-zinc-900 border border-zinc-800 text-2xs hover:bg-zinc-800 disabled:opacity-30 cursor-pointer"
                      >
                        <i className="fas fa-arrow-down" />
                      </button>
                      <button
                        onClick={() => deleteListItem("services.items", idx)}
                        className="w-7 h-7 flex items-center justify-center rounded bg-red-950/40 border border-red-900/50 text-red-400 hover:bg-red-900/40 text-2xs cursor-pointer"
                      >
                        <i className="fas fa-trash-alt" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pr-24">
                      <div className="space-y-1">
                        <label className="block text-2xs text-zinc-500 uppercase tracking-wide">FontAwesome Icon</label>
                        <input
                          type="text"
                          value={item.icon}
                          onChange={(e) => updateListItem("services.items", idx, "icon", e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 focus:border-cyan-500 rounded p-1.5 text-sm outline-none"
                        />
                      </div>
                      <div className="space-y-1 sm:col-span-2">
                        <label className="block text-2xs text-zinc-500 uppercase tracking-wide">Project Title</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => updateListItem("services.items", idx, "title", e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 focus:border-cyan-500 rounded p-1.5 text-sm outline-none text-white font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-2xs text-zinc-500 uppercase tracking-wide">Project URL / Repository Link</label>
                        <input
                          type="text"
                          value={item.url || ""}
                          onChange={(e) => updateListItem("services.items", idx, "url", e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 focus:border-cyan-500 rounded p-1.5 text-sm outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-2xs text-zinc-500 uppercase tracking-wide">Reveal Delay Offset</label>
                        <input
                          type="text"
                          value={item.delay}
                          onChange={(e) => updateListItem("services.items", idx, "delay", e.target.value)}
                          placeholder="e.g. 0.4s"
                          className="w-full bg-zinc-900 border border-zinc-800 focus:border-cyan-500 rounded p-1.5 text-sm outline-none text-zinc-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-2xs text-zinc-500 uppercase tracking-wide">Brief Description</label>
                      <textarea
                        rows={2}
                        value={item.description}
                        onChange={(e) => updateListItem("services.items", idx, "description", e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 focus:border-cyan-500 rounded p-1.5 text-sm outline-none resize-none leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 5: Experience */}
          {activeTab === "experience" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                <h2 className="text-xl font-bold text-white">Experience Timeline</h2>
                <button
                  onClick={() => addListItem("experience.items", { date: "Jan 2026 - Now", title: "Senior Dev", company: "Inc Corp", location: "Jakarta, ID", side: "left" })}
                  className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold rounded cursor-pointer"
                >
                  <i className="fas fa-plus mr-1.5" /> Add Entry
                </button>
              </div>

              <div className="space-y-4">
                {data.experience.items.map((item, idx) => (
                  <div key={idx} className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg space-y-3 relative">
                    <div className="absolute top-4 right-4 flex items-center gap-1.5">
                      <button
                        onClick={() => moveListItem("experience.items", idx, "up")}
                        disabled={idx === 0}
                        className="w-7 h-7 flex items-center justify-center rounded bg-zinc-900 border border-zinc-800 text-2xs hover:bg-zinc-800 disabled:opacity-30 cursor-pointer"
                      >
                        <i className="fas fa-arrow-up" />
                      </button>
                      <button
                        onClick={() => moveListItem("experience.items", idx, "down")}
                        disabled={idx === data.experience.items.length - 1}
                        className="w-7 h-7 flex items-center justify-center rounded bg-zinc-900 border border-zinc-800 text-2xs hover:bg-zinc-800 disabled:opacity-30 cursor-pointer"
                      >
                        <i className="fas fa-arrow-down" />
                      </button>
                      <button
                        onClick={() => deleteListItem("experience.items", idx)}
                        className="w-7 h-7 flex items-center justify-center rounded bg-red-950/40 border border-red-900/50 text-red-400 hover:bg-red-900/40 text-2xs cursor-pointer"
                      >
                        <i className="fas fa-trash-alt" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pr-24">
                      <div className="space-y-1">
                        <label className="block text-2xs text-zinc-500 uppercase tracking-wide">Date range</label>
                        <input
                          type="text"
                          value={item.date}
                          onChange={(e) => updateListItem("experience.items", idx, "date", e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 focus:border-cyan-500 rounded p-1.5 text-sm outline-none text-cyan-400 font-semibold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-2xs text-zinc-500 uppercase tracking-wide">Job Position Title</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => updateListItem("experience.items", idx, "title", e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 focus:border-cyan-500 rounded p-1.5 text-sm outline-none text-white font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="block text-2xs text-zinc-500 uppercase tracking-wide">Company / Organization</label>
                        <input
                          type="text"
                          value={item.company}
                          onChange={(e) => updateListItem("experience.items", idx, "company", e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 focus:border-cyan-500 rounded p-1.5 text-sm outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-2xs text-zinc-500 uppercase tracking-wide">Office Location</label>
                        <input
                          type="text"
                          value={item.location}
                          onChange={(e) => updateListItem("experience.items", idx, "location", e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 focus:border-cyan-500 rounded p-1.5 text-sm outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-2xs text-zinc-500 uppercase tracking-wide">Timeline Column Side</label>
                        <select
                          value={item.side}
                          onChange={(e) => updateListItem("experience.items", idx, "side", e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 focus:border-cyan-500 rounded p-1.5 text-sm outline-none text-zinc-300 cursor-pointer"
                        >
                          <option value="left">Left Column</option>
                          <option value="right">Right Column</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 6: Blog */}
          {activeTab === "blog" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                <h2 className="text-xl font-bold text-white">Medium Blog Articles</h2>
                <button
                  onClick={() => addListItem("blog.posts", { image: "https://miro.medium.com/max/1400/1*BlMzaDOVhZVn_tgbh5njMw.jpeg", title: "New Article Title", author: "Faisal Amir", category: "Android", date: "17-May-2026", comments: 0, excerpt: "Short article overview", url: "https://medium.com", delay: "0.1s" })}
                  className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold rounded cursor-pointer"
                >
                  <i className="fas fa-plus mr-1.5" /> Add Post
                </button>
              </div>

              <div className="space-y-4">
                {data.blog.posts.map((post, idx) => (
                  <div key={idx} className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg space-y-3 relative">
                    <div className="absolute top-4 right-4 flex items-center gap-1.5">
                      <button
                        onClick={() => moveListItem("blog.posts", idx, "up")}
                        disabled={idx === 0}
                        className="w-7 h-7 flex items-center justify-center rounded bg-zinc-900 border border-zinc-800 text-2xs hover:bg-zinc-800 disabled:opacity-30 cursor-pointer"
                      >
                        <i className="fas fa-arrow-up" />
                      </button>
                      <button
                        onClick={() => moveListItem("blog.posts", idx, "down")}
                        disabled={idx === data.blog.posts.length - 1}
                        className="w-7 h-7 flex items-center justify-center rounded bg-zinc-900 border border-zinc-800 text-2xs hover:bg-zinc-800 disabled:opacity-30 cursor-pointer"
                      >
                        <i className="fas fa-arrow-down" />
                      </button>
                      <button
                        onClick={() => deleteListItem("blog.posts", idx)}
                        className="w-7 h-7 flex items-center justify-center rounded bg-red-950/40 border border-red-900/50 text-red-400 hover:bg-red-900/40 text-2xs cursor-pointer"
                      >
                        <i className="fas fa-trash-alt" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pr-24">
                      <div className="space-y-1 sm:col-span-2">
                        <label className="block text-2xs text-zinc-500 uppercase tracking-wide">Article Title</label>
                        <input
                          type="text"
                          value={post.title}
                          onChange={(e) => updateListItem("blog.posts", idx, "title", e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 focus:border-cyan-500 rounded p-1.5 text-sm outline-none text-white font-semibold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-2xs text-zinc-500 uppercase tracking-wide">Category / Tag</label>
                        <input
                          type="text"
                          value={post.category}
                          onChange={(e) => updateListItem("blog.posts", idx, "category", e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 focus:border-cyan-500 rounded p-1.5 text-sm outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-2xs text-zinc-500 uppercase tracking-wide">Cover Image URL</label>
                        <input
                          type="text"
                          value={post.image}
                          onChange={(e) => updateListItem("blog.posts", idx, "image", e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 focus:border-cyan-500 rounded p-1.5 text-sm outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-2xs text-zinc-500 uppercase tracking-wide">Article Href Link</label>
                        <input
                          type="text"
                          value={post.url}
                          onChange={(e) => updateListItem("blog.posts", idx, "url", e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 focus:border-cyan-500 rounded p-1.5 text-sm outline-none text-cyan-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="block text-2xs text-zinc-500 uppercase tracking-wide">Author Name</label>
                        <input
                          type="text"
                          value={post.author}
                          onChange={(e) => updateListItem("blog.posts", idx, "author", e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 focus:border-cyan-500 rounded p-1.5 text-sm outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-2xs text-zinc-500 uppercase tracking-wide">Publish Date</label>
                        <input
                          type="text"
                          value={post.date}
                          onChange={(e) => updateListItem("blog.posts", idx, "date", e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 focus:border-cyan-500 rounded p-1.5 text-sm outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-2xs text-zinc-500 uppercase tracking-wide">Reveal Delay</label>
                        <input
                          type="text"
                          value={post.delay}
                          onChange={(e) => updateListItem("blog.posts", idx, "delay", e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 focus:border-cyan-500 rounded p-1.5 text-sm outline-none text-zinc-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-2xs text-zinc-500 uppercase tracking-wide">Excerpt Summary</label>
                      <textarea
                        rows={2}
                        value={post.excerpt}
                        onChange={(e) => updateListItem("blog.posts", idx, "excerpt", e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 focus:border-cyan-500 rounded p-1.5 text-sm outline-none resize-none leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 7: Footer & Socials */}
          {activeTab === "footer" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white border-b border-zinc-800 pb-3">Footer Contact Info</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Footer Name Title</label>
                  <input
                    type="text"
                    value={data.footer.name}
                    onChange={(e) => handleFormUpdate({ ...data, footer: { ...data.footer, name: e.target.value } })}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-cyan-500 rounded p-2.5 outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Copyright label override</label>
                  <input
                    type="text"
                    value={data.footer.copyright}
                    onChange={(e) => handleFormUpdate({ ...data, footer: { ...data.footer, copyright: e.target.value } })}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-cyan-500 rounded p-2.5 outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Physical Address</label>
                  <input
                    type="text"
                    value={data.footer.address}
                    onChange={(e) => handleFormUpdate({ ...data, footer: { ...data.footer, address: e.target.value } })}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-cyan-500 rounded p-2.5 outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Contact Phone</label>
                  <input
                    type="text"
                    value={data.footer.phone}
                    onChange={(e) => handleFormUpdate({ ...data, footer: { ...data.footer, phone: e.target.value } })}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-cyan-500 rounded p-2.5 outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Contact Email</label>
                  <input
                    type="email"
                    value={data.footer.email}
                    onChange={(e) => handleFormUpdate({ ...data, footer: { ...data.footer, email: e.target.value } })}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-cyan-500 rounded p-2.5 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Social Channels mapping */}
              <div className="space-y-4 pt-6 border-t border-zinc-800">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold text-white">Social Network Channels</h3>
                  <button
                    onClick={() => addListItem("footer.socials", { icon: "fab fa-linkedin-in", url: "https://linkedin.com" })}
                    className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold rounded cursor-pointer"
                  >
                    <i className="fas fa-plus mr-1.5" /> Add Channel
                  </button>
                </div>

                <div className="space-y-3">
                  {data.footer.socials.map((social, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-zinc-950 rounded border border-zinc-800">
                      <div className="flex-1 space-y-1">
                        <input
                          type="text"
                          placeholder="Icon class (e.g. fab fa-github)"
                          value={social.icon}
                          onChange={(e) => updateListItem("footer.socials", idx, "icon", e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 focus:border-cyan-500 rounded p-2 text-sm outline-none"
                        />
                      </div>
                      <div className="flex-2 space-y-1">
                        <input
                          type="text"
                          placeholder="Profile Link URL"
                          value={social.url}
                          onChange={(e) => updateListItem("footer.socials", idx, "url", e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 focus:border-cyan-500 rounded p-2 text-sm outline-none text-cyan-400"
                        />
                      </div>
                      <button
                        onClick={() => deleteListItem("footer.socials", idx)}
                        className="w-8 h-8 flex items-center justify-center rounded bg-red-950/40 border border-red-900/50 text-red-400 hover:bg-red-900/40 cursor-pointer"
                      >
                        <i className="fas fa-trash-alt text-sm" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 8: Raw JSON */}
          {activeTab === "json" && (
            <div className="space-y-4 h-full flex flex-col">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                <h2 className="text-xl font-bold text-white">Raw JSON Payload Editor</h2>
                {jsonError ? (
                  <span className="px-2 py-0.5 bg-red-900/50 text-red-400 text-xs font-semibold rounded border border-red-700/30">
                    Invalid JSON Structure
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-green-900/50 text-green-400 text-xs font-semibold rounded border border-green-700/30">
                    JSON syntax is valid
                  </span>
                )}
              </div>

              <div className="flex-1 flex flex-col space-y-2">
                <textarea
                  rows={25}
                  value={jsonText}
                  onChange={(e) => handleJsonChange(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-cyan-500 rounded p-4 font-mono text-xs outline-none transition-colors leading-relaxed text-zinc-300 resize-y"
                  placeholder="Paste raw content.json configuration here..."
                />
                {jsonError && (
                  <div className="p-3 bg-red-950/40 border border-red-900/50 rounded text-red-400 text-xs font-mono">
                    <strong>Parsing Error:</strong> {jsonError}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* GitHub Sync Modal */}
      {isGitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in" data-testid="github-sync-modal">
          <div className="cms-editor-modal-container w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
                <i className="fab fa-github text-cyan-400 text-xl" />
                Sync and Commit to GitHub
              </h3>
              <button
                onClick={() => setIsGitModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-zinc-400 hover:text-white cursor-pointer"
              >
                <i className="fas fa-times" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                  GitHub Personal Access Token (PAT)
                </label>
                <input
                  type="password"
                  value={gitToken}
                  onChange={(e) => setGitToken(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-cyan-500 rounded p-2.5 text-sm outline-none text-white font-mono"
                />
                <p className="text-2xs text-zinc-500 leading-normal">
                  Requires fine-grained token with &quot;Contents&quot; write permissions to the repository. Cache stored safely in your browser storage.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Repository (owner/name)
                  </label>
                  <input
                    type="text"
                    value={gitRepo}
                    onChange={(e) => setGitRepo(e.target.value)}
                    placeholder="amirisback/amirisback.github.io"
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-cyan-500 rounded p-2.5 text-sm outline-none text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Branch Name
                  </label>
                  <input
                    type="text"
                    value={gitBranch}
                    onChange={(e) => setGitBranch(e.target.value)}
                    placeholder="main"
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-cyan-500 rounded p-2.5 text-sm outline-none text-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Commit Message
                </label>
                <input
                  type="text"
                  value={gitCommitMsg}
                  onChange={(e) => setGitCommitMsg(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-cyan-500 rounded p-2.5 text-sm outline-none text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
              <button
                onClick={() => setIsGitModalOpen(false)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded text-sm font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={syncToGitHub}
                disabled={gitSyncing}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 rounded text-sm font-bold transition-colors disabled:opacity-50 cursor-pointer"
              >
                <i className={`fas ${gitSyncing ? "fa-circle-notch fa-spin" : "fa-upload"}`} />
                Push to GitHub
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
