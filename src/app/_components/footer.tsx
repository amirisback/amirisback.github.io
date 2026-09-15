"use client";

import { ScrollReveal } from "./scroll-reveal";

interface Social {
  icon: string;
  url: string;
}

interface FooterData {
  name: string;
  address: string;
  phone: string;
  email: string;
  copyright: string;
  socials: Social[];
}

interface FooterProps {
  data: FooterData;
  dict: {
    contact: {
      sectionLabel: string;
      sectionTitle: string;
      address: string;
      phone: string;
      email: string;
    };
    footer: {
      copyright: string;
      madeWith: string;
    };
  };
}

export function Footer({ data, dict }: FooterProps) {
  const currentYear = new Date().getFullYear();

  // Substitute {year} in copyright dictionary
  const copyrightText = dict.footer.copyright
    ? dict.footer.copyright.replace("{year}", currentYear.toString())
    : `© ${currentYear} ${data.name}. All rights reserved.`;

  return (
    <footer id="contact" className="relative bg-white dark:bg-zinc-950 py-16 overflow-hidden" data-testid="footer">
      {/* Gradient top border accent */}
      <div className="absolute top-0 left-0 right-0 h-1 rounded-b-full" style={{ background: 'linear-gradient(90deg, var(--accent-from), var(--accent-via), var(--accent-to))' }} aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* Left Column: Contact Details */}
          <ScrollReveal direction="left" className="space-y-6">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-3">
                <span className="section-accent-line" />
                <span className="text-sm font-bold uppercase tracking-wider section-label">
                  {dict.contact.sectionLabel}
                </span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-800 dark:text-white">
                {dict.contact.sectionTitle}
              </h2>
            </div>

            <div className="space-y-4 text-zinc-600 dark:text-zinc-400">
              <div className="flex items-start space-x-3">
                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400/15 to-violet-500/15 dark:from-cyan-400/10 dark:to-violet-500/10 text-cyan-600 dark:text-cyan-400 mt-0.5 shrink-0">
                  <i className="fas fa-map-marker-alt" />
                </span>
                <div>
                  <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm">
                    {dict.contact.address}
                  </h4>
                  <p className="text-sm mt-0.5">{data.address}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400/15 to-violet-500/15 dark:from-cyan-400/10 dark:to-violet-500/10 text-cyan-600 dark:text-cyan-400 mt-0.5 shrink-0">
                  <i className="fas fa-phone-alt" />
                </span>
                <div>
                  <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm">
                    {dict.contact.phone}
                  </h4>
                  <a href={`tel:${data.phone}`} className="text-sm mt-0.5 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                    {data.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400/15 to-violet-500/15 dark:from-cyan-400/10 dark:to-violet-500/10 text-cyan-600 dark:text-cyan-400 mt-0.5 shrink-0">
                  <i className="fas fa-envelope" />
                </span>
                <div>
                  <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm">
                    {dict.contact.email}
                  </h4>
                  <a href={`mailto:${data.email}`} className="text-sm mt-0.5 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                    {data.email}
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Column: Social Links */}
          <ScrollReveal direction="right" className="flex flex-col justify-center space-y-6">
            <h3 className="text-xl font-semibold text-zinc-800 dark:text-white">
              Connect on Socials
            </h3>
            <div className="flex flex-wrap gap-4">
              {data.socials.map((social, idx) => (
                <a
                  key={idx}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative flex items-center justify-center w-12 h-12 rounded-xl border border-zinc-200/60 dark:border-zinc-800/50 text-zinc-500 dark:text-zinc-400 hover:text-white hover:border-transparent hover:-translate-y-2 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-500 group/social overflow-hidden"
                  aria-label={`Social link ${idx + 1}`}
                >
                  {/* Hover gradient bg */}
                  <span className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-indigo-500 to-violet-500 opacity-0 group-hover/social:opacity-100 transition-opacity duration-300 rounded-xl" />
                  <i className={`${social.icon} relative z-10`} />
                </a>
              ))}
            </div>
          </ScrollReveal>
        </div>

        {/* Bottom copyright section */}
        <div className="border-t border-zinc-200/60 dark:border-zinc-800/40 pt-8 mt-4 flex flex-col sm:flex-row justify-between items-center text-sm text-zinc-400 dark:text-zinc-500 gap-4">
          <p>{copyrightText}</p>
          <p className="flex items-center gap-1.5">
            {dict.footer.madeWith}{" "}
            <span className="text-red-500 animate-pulse">❤️</span> in Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
