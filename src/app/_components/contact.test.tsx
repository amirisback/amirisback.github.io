import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { Contact } from "./contact";

// Mock ScrollReveal to render directly
vi.mock("./scroll-reveal", () => ({
  ScrollReveal: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("Contact Component", () => {
  const mockData = {
    name: "Muhammad Faisal Amir",
    address: "Probolinggo, East Java, Indonesia",
    phone: "+6281357108568",
    email: "faisalamircs@gmail.com",
    copyright: "Muhammad Faisal Amir, All Rights Reserved 2026",
    socials: [
      { icon: "fab fa-linkedin-in", url: "https://www.linkedin.com/in/faisalamircs/" },
      { icon: "fab fa-github", url: "https://github.com/amirisback" },
      { icon: "fab fa-twitter", url: "https://twitter.com/faisalamircs" },
      { icon: "fab fa-instagram", url: "https://www.instagram.com/faisalamircs/" },
    ],
  };

  const mockDictEn = {
    contact: {
      sectionLabel: "Contact Me",
      sectionTitle: "Let's Build Something High-Impact",
      sectionSubtitle: "Have an engineering project, mobile architecture challenge, or technical advisory inquiry? Reach out directly or drop a message below.",
      statusAvailable: "Available for Projects & Tech Collaborations",
      statusDotLabel: "Live Status",
      availability: "Available for Projects & Tech Collaborations",
      timezoneLabel: "Operating Timezone",
      location: "WIB / UTC+7 • Probolinggo, East Java, Indonesia",
      timezone: "WIB / UTC+7 • Probolinggo, East Java, Indonesia",
      profileTitle: "Senior Software Engineer & Open Source Architect",
      profileSubtitle: "Specializing in Native Android (Kotlin, Jetpack Compose) & Modern Web Systems (Next.js, TypeScript).",
      address: "Address",
      phone: "Phone",
      email: "Email",
      whatsappTitle: "WhatsApp Direct",
      whatsappDesc: "Instant messaging for quick sync and project inquiries.",
      whatsappAction: "Chat on WhatsApp",
      whatsappGreeting: "Hi Amir, I would like to discuss an engineering collaboration.",
      emailTitle: "Direct Email",
      emailDesc: "Preferred for structured proposals, RFPs, and job opportunities.",
      emailCopy: "Copy Email",
      emailCopyAction: "Copy Email",
      emailCopied: "Copied to Clipboard!",
      emailOpenClient: "Open in Mail Client",
      emailOpenAction: "Open in Mail Client",
      socialTitle: "Professional Networks",
      formTitle: "Send a Message",
      formDesc: "Fill in your inquiry details to generate a structured email draft.",
      topicLabel: "Inquiry Topic",
      topics: {
        project: "Project Collaboration",
        career: "Engineering Role",
        role: "Engineering Role",
        advisory: "Tech Advisory",
        chat: "Casual Chat",
      },
      fields: {
        nameLabel: "Your Name",
        namePlaceholder: "Your Full Name",
        emailLabel: "Email Address",
        emailPlaceholder: "name@organization.com",
        subjectLabel: "Subject",
        subjectPlaceholder: "e.g. Project Inquiry - Mobile App Architecture",
        messageLabel: "Message",
        messagePlaceholder: "Tell me about your project scope, timeline, or engineering challenges...",
      },
      fieldName: "Your Name",
      placeholderName: "Your Full Name",
      fieldEmail: "Email Address",
      placeholderEmail: "name@organization.com",
      fieldSubject: "Subject",
      placeholderSubject: "e.g. Project Inquiry - Mobile App Architecture",
      fieldMessage: "Message",
      placeholderMessage: "Tell me about your project scope, timeline, or engineering challenges...",
      submitButton: "Send Message via Mail Client",
      submittingButton: "Launching Mail Client...",
      submittedNotice: "Draft has been prepared in your email client.",
      successTitle: "Draft Prepared in Mail Client!",
      successDesc: "Your message has been formatted and opened in your email application. If it didn't open automatically, send directly to faisalamircs@gmail.com.",
      resetForm: "Write Another Message",
      errorRequired: "This field is required.",
      errorEmailInvalid: "Please enter a valid email address.",
    },
  };

  const mockDictId = {
    contact: {
      sectionLabel: "Hubungi Saya",
      sectionTitle: "Mari Bangun Solusi Berdampak Tinggi",
      sectionSubtitle: "Punya proyek rekayasa perangkat lunak, tantangan arsitektur mobile, atau butuh konsultasi teknis? Hubungi saya langsung atau kirim pesan di bawah.",
      statusAvailable: "Tersedia untuk Proyek & Kolaborasi Teknis",
      statusDotLabel: "Status Langsung",
      availability: "Tersedia untuk Proyek & Kolaborasi Teknis",
      timezoneLabel: "Zona Waktu Operasional",
      location: "WIB / UTC+7 • Probolinggo, Jawa Timur, Indonesia",
      timezone: "WIB / UTC+7 • Probolinggo, Jawa Timur, Indonesia",
      profileTitle: "Senior Software Engineer & Open Source Architect",
      profileSubtitle: "Spesialisasi dalam Native Android (Kotlin, Jetpack Compose) & Sistem Web Modern (Next.js, TypeScript).",
      address: "Alamat",
      phone: "Telepon",
      email: "Email",
      whatsappTitle: "WhatsApp Langsung",
      whatsappDesc: "Pesan instan untuk diskusi cepat dan penawaran proyek.",
      whatsappAction: "Chat via WhatsApp",
      whatsappGreeting: "Halo Amir, saya ingin mendiskusikan peluang kolaborasi teknis.",
      emailTitle: "Email Langsung",
      emailDesc: "Ideal untuk proposal terstruktur, dokumen RFP, dan tawaran karir.",
      emailCopy: "Salin Email",
      emailCopyAction: "Salin Email",
      emailCopied: "Email Tersalin!",
      emailOpenClient: "Buka di Aplikasi Email",
      emailOpenAction: "Buka di Aplikasi Email",
      socialTitle: "Jejaring Profesional",
      formTitle: "Kirim Pesan",
      formDesc: "Tuliskan kebutuhan Anda untuk langsung disiapkan ke draf email.",
      topicLabel: "Topik Kebutuhan",
      topics: {
        project: "Kolaborasi Proyek",
        career: "Peluang Karir",
        role: "Peluang Karir",
        advisory: "Konsultasi Teknis",
        chat: "Obrolan Santai",
      },
      fields: {
        nameLabel: "Nama Lengkap",
        namePlaceholder: "Nama Lengkap Anda",
        emailLabel: "Alamat Email",
        emailPlaceholder: "nama@perusahaan.com",
        subjectLabel: "Subjek",
        subjectPlaceholder: "cth. Kolaborasi Proyek - Arsitektur Mobile App",
        messageLabel: "Isi Pesan",
        messagePlaceholder: "Ceritakan tentang ruang lingkup proyek, linimasa, atau tantangan rekayasa teknis Anda...",
      },
      submitButton: "Kirim Pesan via Aplikasi Email",
      submittingButton: "Membuka Aplikasi Email...",
      submittedNotice: "Draf telah disiapkan di aplikasi email Anda.",
      successTitle: "Draf Siap di Aplikasi Email!",
      successDesc: "Pesan Anda telah diformat dan dibuka di aplikasi email default Anda. Jika tidak terbuka otomatis, kirimkan langsung ke faisalamircs@gmail.com.",
      resetForm: "Tulis Pesan Lain",
      errorRequired: "Bidang ini wajib diisi.",
      errorEmailInvalid: "Harap masukkan format alamat email yang valid."
    },
  };

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the Executive Connect Hub and header correctly with English dictionary", () => {
    render(<Contact data={mockData} dict={mockDictEn} />);

    // Section anchor and header
    const section = screen.getByTestId("contact-section");
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute("id", "contact");

    expect(screen.getByText("Contact Me")).toBeInTheDocument();
    expect(screen.getByText("Let's Build Something High-Impact")).toBeInTheDocument();
    expect(screen.getByTestId("availability-pill")).toHaveTextContent("Available for Projects & Tech Collaborations");

    // Profile Card & Timezone
    expect(screen.getByText("Muhammad Faisal Amir")).toBeInTheDocument();
    expect(screen.getByText("Senior Software Engineer & Open Source Architect")).toBeInTheDocument();
    expect(screen.getByText("Operating Timezone")).toBeInTheDocument();
    expect(screen.getByText("WIB / UTC+7 • Probolinggo, East Java, Indonesia")).toBeInTheDocument();

    // WhatsApp Card
    expect(screen.getByText("WhatsApp Direct")).toBeInTheDocument();
    expect(screen.getByText("+6281357108568")).toBeInTheDocument();
    const waLink = screen.getByText("Chat on WhatsApp").closest("a");
    expect(waLink).toHaveAttribute("href", expect.stringContaining("https://wa.me/6281357108568"));

    // Email Card
    expect(screen.getByText("Direct Email")).toBeInTheDocument();
    expect(screen.getByText("faisalamircs@gmail.com")).toBeInTheDocument();

    // Social Links
    expect(screen.getByText("Professional Networks")).toBeInTheDocument();
    expect(screen.getByLabelText("Connect on LinkedIn")).toBeInTheDocument();
    expect(screen.getByLabelText("View GitHub Profile")).toBeInTheDocument();
  });

  it("renders Indonesian dictionary properly", () => {
    render(<Contact data={mockData} dict={mockDictId} />);

    expect(screen.getByText("Hubungi Saya")).toBeInTheDocument();
    expect(screen.getByText("Mari Bangun Solusi Berdampak Tinggi")).toBeInTheDocument();
    expect(screen.getByTestId("availability-pill")).toHaveTextContent("Tersedia untuk Proyek & Kolaborasi Teknis");
    expect(screen.getByText("WhatsApp Langsung")).toBeInTheDocument();
    expect(screen.getByText("Email Langsung")).toBeInTheDocument();
    expect(screen.getByText("Jejaring Profesional")).toBeInTheDocument();
    expect(screen.getByText("Kirim Pesan")).toBeInTheDocument();
  });

  it("handles one-click email copy with clipboard API and visual feedback", async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(<Contact data={mockData} dict={mockDictEn} />);

    const copyBtn = screen.getByTestId("copy-email-btn");
    expect(screen.getByText("Copy Email")).toBeInTheDocument();

    fireEvent.click(copyBtn);

    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalledWith("faisalamircs@gmail.com");
      expect(screen.getByText("Copied to Clipboard!")).toBeInTheDocument();
    });
  });

  it("handles clipboard API rejection gracefully via fallback", async () => {
    const writeTextMock = vi.fn().mockRejectedValue(new Error("Clipboard permission denied"));
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(<Contact data={mockData} dict={mockDictEn} />);

    const copyBtn = screen.getByTestId("copy-email-btn");
    fireEvent.click(copyBtn);

    await waitFor(() => {
      expect(screen.getByText("Copied to Clipboard!")).toBeInTheDocument();
    });
  });

  it("toggles inquiry topic selector chips and updates subject template", () => {
    render(<Contact data={mockData} dict={mockDictEn} />);

    const careerChip = screen.getByRole("button", { name: "Engineering Role" });
    const advisoryChip = screen.getByRole("button", { name: "Tech Advisory" });

    // Initial default is project
    expect(screen.getByRole("button", { name: "Project Collaboration" })).toHaveAttribute("aria-pressed", "true");

    // Select career
    fireEvent.click(careerChip);
    expect(careerChip).toHaveAttribute("aria-pressed", "true");
    const subjectInput = screen.getByTestId("contact-subject-input") as HTMLInputElement;
    expect(subjectInput.value).toBe("[Engineering Role] Inquiry");

    // Select advisory
    fireEvent.click(advisoryChip);
    expect(advisoryChip).toHaveAttribute("aria-pressed", "true");
    expect(subjectInput.value).toBe("[Tech Advisory] Inquiry");
  });

  it("validates empty inputs and malformed email addresses", async () => {
    render(<Contact data={mockData} dict={mockDictEn} />);

    const submitBtn = screen.getByTestId("contact-submit-btn");

    // Submit empty form
    fireEvent.click(submitBtn);

    const requiredErrors = await screen.findAllByText("This field is required.");
    expect(requiredErrors).toHaveLength(4);

    // Enter invalid email format
    const emailInput = screen.getByTestId("contact-email-input");
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });

    fireEvent.click(submitBtn);

    expect(await screen.findByText("Please enter a valid email address.")).toBeInTheDocument();
  });

  it("clears error message when user inputs valid text", async () => {
    render(<Contact data={mockData} dict={mockDictEn} />);

    const submitBtn = screen.getByTestId("contact-submit-btn");
    fireEvent.click(submitBtn);

    const requiredErrors = await screen.findAllByText("This field is required.");
    expect(requiredErrors.length).toBeGreaterThan(0);

    const nameInput = screen.getByTestId("contact-name-input");
    fireEvent.change(nameInput, { target: { value: "Jane Doe" } });

    expect(nameInput).not.toHaveAttribute("aria-invalid", "true");
    expect(screen.queryByText("contact-name-error")).not.toBeInTheDocument();
  });

  it("submits valid form, constructs mailto scheme, and displays success banner with reset", async () => {
    let capturedHref = "";
    const originalLocation = window.location;

    Object.defineProperty(window, "location", {
      configurable: true,
      value: {
        ...originalLocation,
        get href() {
          return capturedHref;
        },
        set href(val: string) {
          capturedHref = val;
        },
      },
    });

    render(<Contact data={mockData} dict={mockDictEn} />);

    const nameInput = screen.getByTestId("contact-name-input");
    const emailInput = screen.getByTestId("contact-email-input");
    const subjectInput = screen.getByTestId("contact-subject-input");
    const messageInput = screen.getByTestId("contact-message-input");

    fireEvent.change(nameInput, { target: { value: "Tech Lead" } });
    fireEvent.change(emailInput, { target: { value: "lead@techcorp.com" } });
    fireEvent.change(subjectInput, { target: { value: "Mobile Architecture Consulting" } });
    fireEvent.change(messageInput, { target: { value: "We would like to hire you for a 3-month contract." } });

    const submitBtn = screen.getByTestId("contact-submit-btn");
    fireEvent.click(submitBtn);

    expect(capturedHref).toContain("mailto:faisalamircs%40gmail.com");
    expect(capturedHref).toContain("subject=Mobile%20Architecture%20Consulting");
    expect(capturedHref).toContain("lead%40techcorp.com");

    // Success banner is rendered
    expect(await screen.findByTestId("success-banner")).toBeInTheDocument();
    expect(screen.getByText("Draft Prepared in Mail Client!")).toBeInTheDocument();

    // Click Reset Form
    const resetBtn = screen.getByRole("button", { name: /Write Another Message/i });
    fireEvent.click(resetBtn);

    // Form is restored and inputs are empty
    expect(screen.getByTestId("contact-form")).toBeInTheDocument();
    expect((screen.getByTestId("contact-name-input") as HTMLInputElement).value).toBe("");

    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
    });
  });
});
