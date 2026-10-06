"use client";

import { useState } from "react";
import { ScrollReveal } from "./scroll-reveal";

interface Social {
  icon: string;
  url: string;
}

export interface ContactData {
  name: string;
  address: string;
  phone: string;
  email: string;
  copyright?: string;
  socials: Social[];
}

export interface ContactProps {
  data: ContactData;
  dict: {
    contact: {
      sectionLabel?: string;
      sectionTitle?: string;
      sectionSubtitle?: string;
      subtitle?: string;
      statusAvailable?: string;
      statusDotLabel?: string;
      availability?: string;
      timezoneLabel?: string;
      location?: string;
      timezone?: string;
      profileTitle?: string;
      profileSubtitle?: string;
      address?: string;
      phone?: string;
      email?: string;
      whatsappTitle?: string;
      whatsappDesc?: string;
      whatsappAction?: string;
      whatsappGreeting?: string;
      emailTitle?: string;
      emailDesc?: string;
      emailCopy?: string;
      emailCopyAction?: string;
      emailCopied?: string;
      emailOpenClient?: string;
      emailOpenAction?: string;
      socialTitle?: string;
      formTitle?: string;
      formDesc?: string;
      topicLabel?: string;
      topics?: {
        project?: string;
        career?: string;
        role?: string;
        advisory?: string;
        chat?: string;
      };
      fields?: {
        nameLabel?: string;
        namePlaceholder?: string;
        emailLabel?: string;
        emailPlaceholder?: string;
        subjectLabel?: string;
        subjectPlaceholder?: string;
        messageLabel?: string;
        messagePlaceholder?: string;
      };
      fieldName?: string;
      placeholderName?: string;
      fieldEmail?: string;
      placeholderEmail?: string;
      fieldSubject?: string;
      placeholderSubject?: string;
      fieldMessage?: string;
      placeholderMessage?: string;
      submitButton?: string;
      submittingButton?: string;
      submittedNotice?: string;
      successTitle?: string;
      successDesc?: string;
      resetForm?: string;
      errorRequired?: string;
      errorEmailInvalid?: string;
    };
    [key: string]: unknown;
  };
}

export function Contact({ data, dict }: ContactProps) {
  const contactDict = dict.contact || {};

  // Interactive Form State
  const [selectedTopic, setSelectedTopic] = useState<"project" | "career" | "advisory" | "chat">("project");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  // Validation & Submission States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Copy Email Feedback State
  const [copied, setCopied] = useState(false);

  // Topic Labels Helper
  const topicLabels = {
    project: contactDict.topics?.project || "Project Collaboration",
    career: contactDict.topics?.career || contactDict.topics?.role || "Engineering Role",
    advisory: contactDict.topics?.advisory || "Tech Advisory",
    chat: contactDict.topics?.chat || "Casual Chat",
  };

  const topicKeys: Array<"project" | "career" | "advisory" | "chat"> = [
    "project",
    "career",
    "advisory",
    "chat",
  ];

  // Handle Topic Selection
  const handleSelectTopic = (topicKey: "project" | "career" | "advisory" | "chat") => {
    setSelectedTopic(topicKey);
    // If subject is empty or equals previous topic label, update to new topic template
    if (!subject || Object.values(topicLabels).some((label) => subject.includes(label))) {
      setSubject(`[${topicLabels[topicKey]}] Inquiry`);
    }
  };

  // Safe Email Copy Helper
  const handleCopyEmail = async () => {
    const targetEmail = data.email || "faisalamircs@gmail.com";
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(targetEmail);
      } else {
        // Fallback for restricted permissions or older browsers
        const textarea = document.createElement("textarea");
        textarea.value = targetEmail;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        textarea.style.top = "-9999px";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Graceful fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  // Form Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const requiredMsg = contactDict.errorRequired || "This field is required.";
    const emailInvalidMsg = contactDict.errorEmailInvalid || "Please enter a valid email address.";

    if (!name.trim()) {
      newErrors.name = requiredMsg;
    }

    if (!email.trim()) {
      newErrors.email = requiredMsg;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        newErrors.email = emailInvalidMsg;
      }
    }

    if (!subject.trim()) {
      newErrors.subject = requiredMsg;
    }

    if (!message.trim()) {
      newErrors.message = requiredMsg;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const activeTopicLabel = topicLabels[selectedTopic];
    const emailBody = [
      `Name: ${name.trim()}`,
      `Email: ${email.trim()}`,
      `Topic: ${activeTopicLabel}`,
      "",
      "Message:",
      message.trim(),
    ].join("\n");

    const mailtoUrl = `mailto:${encodeURIComponent(data.email || "faisalamircs@gmail.com")}?subject=${encodeURIComponent(
      subject.trim()
    )}&body=${encodeURIComponent(emailBody)}`;

    // Trigger user mail client safely
    if (typeof window !== "undefined") {
      window.location.href = mailtoUrl;
    }

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  // Handle Form Reset
  const handleReset = () => {
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setErrors({});
    setIsSubmitted(false);
  };

  // Social Network Name Helper for Clean ARIA Labels
  const getSocialAriaLabel = (icon: string, index: number): string => {
    if (icon.includes("linkedin")) return "Connect on LinkedIn";
    if (icon.includes("github")) return "View GitHub Profile";
    if (icon.includes("twitter")) return "Follow on Twitter";
    if (icon.includes("instagram")) return "Connect on Instagram";
    if (icon.includes("youtube")) return "Visit YouTube Channel";
    if (icon.includes("facebook")) return "Visit Facebook Profile";
    return `Social link ${index + 1}`;
  };

  const whatsappPhone = data.phone?.replace(/[^0-9]/g, "") || "6281357108568";
  const formattedPhone = data.phone || "+62 813-5710-8568";
  const whatsappGreeting =
    contactDict.whatsappGreeting || "Hi Amir, I would like to discuss an engineering collaboration.";
  const whatsappLink = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(whatsappGreeting)}`;

  return (
    <section
      id="contact"
      className="relative py-20 lg:py-28 overflow-hidden bg-white dark:bg-zinc-950 scroll-mt-24 transition-colors"
      aria-labelledby="contact-heading"
      data-testid="contact-section"
    >
      {/* Subtle ambient lighting glows */}
      <div
        className="pointer-events-none absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-cyan-500/10 dark:bg-cyan-500/5 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 blur-3xl"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <ScrollReveal direction="up" className="mb-14 sm:mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            {/* Eyebrow */}
            <div className="flex items-center gap-3">
              <span className="w-8 h-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500" aria-hidden="true" />
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
                {contactDict.sectionLabel || "Contact Me"}
              </span>
            </div>

            {/* Live Availability Status Pill */}
            <div
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold self-start sm:self-auto shadow-xs"
              data-testid="availability-pill"
            >
              <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span>
                {contactDict.statusAvailable || contactDict.availability || "Available for Projects & Tech Collaborations"}
              </span>
            </div>
          </div>

          <h2
            id="contact-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white"
          >
            {contactDict.sectionTitle || "Let's Build Something High-Impact"}
          </h2>

          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed mt-3">
            {contactDict.sectionSubtitle ||
              contactDict.subtitle ||
              "Have an engineering project, mobile architecture challenge, or technical advisory inquiry? Reach out directly or drop a message below."}
          </p>
        </ScrollReveal>

        {/* Two-Column Grid: Executive Connect Hub (Left) & Message Composer (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT COLUMN: Executive Connect Hub (5 Cols) */}
          <ScrollReveal direction="left" className="lg:col-span-5 space-y-5">
            {/* Card 1: Profile & Operating Timezone */}
            <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-900/60 p-6 backdrop-blur-sm transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-md shadow-cyan-500/20 shrink-0"
                  aria-hidden="true"
                >
                  FA
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-zinc-900 dark:text-white">
                    {data.name || "Muhammad Faisal Amir"}
                  </h3>
                  <p className="text-xs sm:text-sm text-cyan-600 dark:text-cyan-400 font-medium">
                    {contactDict.profileTitle || "Senior Software Engineer & Open Source Architect"}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-start gap-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5">
                  <i className="fas fa-clock" aria-hidden="true" />
                </span>
                <div>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200 block text-xs">
                    {contactDict.timezoneLabel || "Operating Timezone"}
                  </span>
                  <p className="mt-0.5 font-medium">
                    {contactDict.location || contactDict.timezone || data.address || "WIB / UTC+7 • Probolinggo, East Java, Indonesia"}
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Direct WhatsApp Card */}
            <div className="group relative rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 p-5 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div
                    className="w-11 h-11 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl shrink-0"
                    aria-hidden="true"
                  >
                    <i className="fab fa-whatsapp" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                      {contactDict.whatsappTitle || "WhatsApp Direct"}
                    </span>
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-zinc-900 dark:text-white text-base hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors inline-block mt-0.5"
                    >
                      {formattedPhone}
                    </a>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      {contactDict.whatsappDesc || "Instant messaging for quick sync and project inquiries."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors py-1 group/btn"
                >
                  <span>{contactDict.whatsappAction || "Chat on WhatsApp"}</span>
                  <i className="fas fa-arrow-up-right-from-square text-[10px] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>

            {/* Card 3: One-Click Copy Email Card */}
            <div className="group relative rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 p-5 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/5 transition-all duration-300">
              <div className="flex items-start gap-3.5">
                <div
                  className="w-11 h-11 rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center text-xl shrink-0"
                  aria-hidden="true"
                >
                  <i className="fas fa-envelope" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 block">
                    {contactDict.emailTitle || "Direct Email"}
                  </span>
                  <span className="font-mono font-bold text-zinc-900 dark:text-white text-sm sm:text-base break-all block mt-0.5">
                    {data.email || "faisalamircs@gmail.com"}
                  </span>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    {contactDict.emailDesc || "Preferred for structured proposals, RFPs, and job opportunities."}
                  </p>
                </div>
              </div>

              {/* Action Buttons: One-Click Copy & Open Client */}
              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/60 flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-200 ${
                    copied
                      ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/30"
                      : "bg-zinc-100 hover:bg-cyan-50 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700"
                  }`}
                  aria-label="Copy email to clipboard"
                  data-testid="copy-email-btn"
                >
                  <i className={copied ? "fas fa-check text-white" : "far fa-copy"} aria-hidden="true" />
                  <span>
                    {copied
                      ? contactDict.emailCopied || "Copied to Clipboard!"
                      : contactDict.emailCopyAction || contactDict.emailCopy || "Copy Email"}
                  </span>
                </button>

                <a
                  href={`mailto:${data.email || "faisalamircs@gmail.com"}`}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <span>{contactDict.emailOpenAction || contactDict.emailOpenClient || "Open in Mail Client"}</span>
                  <i className="fas fa-arrow-up-right-from-square text-[10px]" aria-hidden="true" />
                </a>

                {/* Screen reader notification for copy status */}
                <div className="sr-only" aria-live="polite">
                  {copied ? `${data.email || "Email"} copied to clipboard` : ""}
                </div>
              </div>
            </div>

            {/* Card 4: Quick Social Connect Strip */}
            <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-900/60 p-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-3">
                {contactDict.socialTitle || "Professional Networks"}
              </h4>
              <div className="flex flex-wrap gap-2.5">
                {data.socials?.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-11 h-11 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-500/40 hover:-translate-y-0.5 hover:shadow-md hover:shadow-cyan-500/10 transition-all duration-200"
                    aria-label={getSocialAriaLabel(social.icon, idx)}
                  >
                    <i className={`${social.icon} text-base`} />
                  </a>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* RIGHT COLUMN: Interactive Message Composer (7 Cols) */}
          <ScrollReveal direction="right" className="lg:col-span-7">
            <div className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-900/70 backdrop-blur-xl p-6 sm:p-8 lg:p-10 shadow-xl shadow-zinc-200/30 dark:shadow-black/40">
              <div className="mb-6">
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                  {contactDict.formTitle || "Send a Message"}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  {contactDict.formDesc ||
                    "Fill in your inquiry details to generate a structured email draft."}
                </p>
              </div>

              {/* Success Notification Banner */}
              {isSubmitted ? (
                <div
                  className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-6 text-center space-y-4"
                  role="status"
                  data-testid="success-banner"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-xl">
                    <i className="fas fa-check" aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-emerald-800 dark:text-emerald-200">
                      {contactDict.successTitle || "Draft Prepared in Mail Client!"}
                    </h4>
                    <p className="text-xs sm:text-sm text-emerald-700 dark:text-emerald-300 mt-1.5 max-w-md mx-auto leading-relaxed">
                      {contactDict.successDesc ||
                        contactDict.submittedNotice ||
                        "Your message has been formatted and opened in your email application. If it didn't open automatically, send directly to faisalamircs@gmail.com."}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-sm shadow-emerald-600/30"
                  >
                    <i className="fas fa-rotate-left text-xs" aria-hidden="true" />
                    <span>{contactDict.resetForm || "Write Another Message"}</span>
                  </button>
                </div>
              ) : (
                <form noValidate onSubmit={handleSubmit} className="space-y-5" data-testid="contact-form">
                  {/* Topic Selector Chips */}
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-2 block">
                      {contactDict.topicLabel || "Inquiry Topic"}
                    </label>
                    <div className="flex flex-wrap gap-2" role="group" aria-label="Inquiry Topic Selection">
                      {topicKeys.map((key) => {
                        const isSelected = selectedTopic === key;
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => handleSelectTopic(key)}
                            aria-pressed={isSelected}
                            className={`px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-200 ${
                              isSelected
                                ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/20 border border-cyan-400"
                                : "bg-zinc-100 hover:bg-zinc-200/80 dark:bg-zinc-800/70 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-700/60"
                            }`}
                          >
                            {topicLabels[key]}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sender Identity Grid (Name & Email) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name Field */}
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5 block"
                      >
                        {contactDict.fields?.nameLabel || contactDict.fieldName || "Your Name"}
                        <span className="text-rose-500 ml-1">*</span>
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        required
                        data-testid="contact-name-input"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (errors.name) {
                            setErrors((prev) => {
                              const updated = { ...prev };
                              delete updated.name;
                              return updated;
                            });
                          }
                        }}
                        placeholder={contactDict.fields?.namePlaceholder || contactDict.placeholderName || "Your Full Name"}
                        className={`w-full px-4 py-3 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-950/80 border text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 transition-all outline-hidden ${
                          errors.name
                            ? "border-rose-500/80 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                            : "border-zinc-200 dark:border-zinc-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:bg-white dark:focus:bg-zinc-950"
                        }`}
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? "contact-name-error" : undefined}
                      />
                      {errors.name && (
                        <p id="contact-name-error" className="text-xs text-rose-500 font-medium mt-1.5" role="alert">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5 block"
                      >
                        {contactDict.fields?.emailLabel || contactDict.fieldEmail || "Email Address"}
                        <span className="text-rose-500 ml-1">*</span>
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        required
                        data-testid="contact-email-input"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) {
                            setErrors((prev) => {
                              const updated = { ...prev };
                              delete updated.email;
                              return updated;
                            });
                          }
                        }}
                        placeholder={contactDict.fields?.emailPlaceholder || contactDict.placeholderEmail || "name@organization.com"}
                        className={`w-full px-4 py-3 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-950/80 border text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 transition-all outline-hidden ${
                          errors.email
                            ? "border-rose-500/80 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                            : "border-zinc-200 dark:border-zinc-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:bg-white dark:focus:bg-zinc-950"
                        }`}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? "contact-email-error" : undefined}
                      />
                      {errors.email && (
                        <p id="contact-email-error" className="text-xs text-rose-500 font-medium mt-1.5" role="alert">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Subject Field */}
                  <div>
                    <label
                      htmlFor="contact-subject"
                      className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5 block"
                    >
                      {contactDict.fields?.subjectLabel || contactDict.fieldSubject || "Subject"}
                      <span className="text-rose-500 ml-1">*</span>
                    </label>
                    <input
                      id="contact-subject"
                      name="subject"
                      type="text"
                      required
                      data-testid="contact-subject-input"
                      value={subject}
                      onChange={(e) => {
                        setSubject(e.target.value);
                        if (errors.subject) {
                          setErrors((prev) => {
                            const updated = { ...prev };
                            delete updated.subject;
                            return updated;
                          });
                        }
                      }}
                      placeholder={
                        contactDict.fields?.subjectPlaceholder ||
                        contactDict.placeholderSubject ||
                        "e.g. Project Inquiry - Mobile App Architecture"
                      }
                      className={`w-full px-4 py-3 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-950/80 border text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 transition-all outline-hidden ${
                        errors.subject
                          ? "border-rose-500/80 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                          : "border-zinc-200 dark:border-zinc-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:bg-white dark:focus:bg-zinc-950"
                      }`}
                      aria-invalid={Boolean(errors.subject)}
                      aria-describedby={errors.subject ? "contact-subject-error" : undefined}
                    />
                    {errors.subject && (
                      <p id="contact-subject-error" className="text-xs text-rose-500 font-medium mt-1.5" role="alert">
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  {/* Message Field */}
                  <div>
                    <label
                      htmlFor="contact-message"
                      className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5 block"
                    >
                      {contactDict.fields?.messageLabel || contactDict.fieldMessage || "Message"}
                      <span className="text-rose-500 ml-1">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={4}
                      required
                      data-testid="contact-message-input"
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        if (errors.message) {
                          setErrors((prev) => {
                            const updated = { ...prev };
                            delete updated.message;
                            return updated;
                          });
                        }
                      }}
                      placeholder={
                        contactDict.fields?.messagePlaceholder ||
                        contactDict.placeholderMessage ||
                        "Tell me about your project scope, timeline, or engineering challenges..."
                      }
                      className={`w-full px-4 py-3 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-950/80 border text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 transition-all outline-hidden resize-y ${
                        errors.message
                          ? "border-rose-500/80 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                          : "border-zinc-200 dark:border-zinc-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:bg-white dark:focus:bg-zinc-950"
                      }`}
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={errors.message ? "contact-message-error" : undefined}
                    />
                    {errors.message && (
                      <p id="contact-message-error" className="text-xs text-rose-500 font-medium mt-1.5" role="alert">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      data-testid="contact-submit-btn"
                      className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide text-white bg-gradient-to-r from-cyan-600 via-indigo-600 to-cyan-600 bg-[length:200%_auto] hover:bg-right transition-all duration-500 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 active:scale-[0.98] flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      <i className="fas fa-paper-plane text-xs" aria-hidden="true" />
                      <span>
                        {isSubmitting
                          ? contactDict.submittingButton || "Launching Mail Client..."
                          : contactDict.submitButton || "Send Message via Mail Client"}
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
