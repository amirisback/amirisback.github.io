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
    <footer id="contact" className="bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900 py-16" data-testid="footer">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* Left Column: Contact Details */}
          <ScrollReveal direction="left" className="space-y-6">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-3">
                <span className="h-[2px] w-8 bg-[#2e3d48] dark:bg-cyan-400" />
                <span className="text-sm font-bold uppercase tracking-wider text-[#2e3d48] dark:text-cyan-400">
                  {dict.contact.sectionLabel}
                </span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-800 dark:text-white">
                {dict.contact.sectionTitle}
              </h2>
            </div>

            <div className="space-y-4 text-zinc-600 dark:text-zinc-400">
              <div className="flex items-start space-x-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 text-[#2e3d48] dark:text-cyan-400 mt-1 shrink-0">
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
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 text-[#2e3d48] dark:text-cyan-400 mt-1 shrink-0">
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
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 text-[#2e3d48] dark:text-cyan-400 mt-1 shrink-0">
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
                  className="flex items-center justify-center w-12 h-12 rounded-full border border-zinc-300 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-[#2e3d48] hover:text-white dark:hover:bg-cyan-500 dark:hover:text-zinc-950 transition-all duration-300 transform hover:-translate-y-1 shadow-sm hover:shadow-md"
                  aria-label={`Social link ${idx + 1}`}
                >
                  <i className={social.icon} />
                </a>
              ))}
            </div>
          </ScrollReveal>
        </div>

        {/* Bottom copyright section */}
        <div className="border-t border-zinc-200 dark:border-zinc-900 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-zinc-500 dark:text-zinc-500 gap-4">
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
