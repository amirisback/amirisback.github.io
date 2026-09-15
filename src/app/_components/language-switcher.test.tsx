import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { LanguageSwitcher } from "./language-switcher";
import { setLocaleAction } from "@/lib/i18n-actions";

const refreshMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: refreshMock,
  }),
}));

vi.mock("@/lib/i18n-actions", () => ({
  setLocaleAction: vi.fn(() => Promise.resolve()),
}));

describe("LanguageSwitcher Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render ID and EN buttons", () => {
    render(<LanguageSwitcher currentLocale="id" />);

    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("EN")).toBeInTheDocument();
  });

  it("should call setLocaleAction when different locale is clicked", async () => {
    render(<LanguageSwitcher currentLocale="id" />);

    const enButton = screen.getByText("EN");
    await act(async () => {
      fireEvent.click(enButton);
    });

    expect(setLocaleAction).toHaveBeenCalledWith("en");
  });

  it("should not call setLocaleAction when current locale is clicked", async () => {
    render(<LanguageSwitcher currentLocale="id" />);

    const idButton = screen.getByText("ID");
    await act(async () => {
      fireEvent.click(idButton);
    });

    expect(setLocaleAction).not.toHaveBeenCalled();
  });
});
