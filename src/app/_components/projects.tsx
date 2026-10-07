import { ScrollReveal } from "./scroll-reveal";
import { ProjectThumbnail } from "./project-thumbnail";
import { TiltCard3D } from "./tilt-card-3d";

export interface ProjectItem {
  icon: string;
  title: string;
  description: string;
  description_id?: string;
  delay: string;
  url?: string;
  thumbnail?: string;
  badge?: string;
  featured?: boolean;
  tags?: string[];
}

export interface ProjectsProps {
  data: {
    items: ProjectItem[];
  };
  dict: {
    portfolio: {
      sectionLabel: string;
      sectionTitle: string;
      viewProject: string;
      flagshipBadge?: string;
      flagshipSubtitle?: string;
      allProjectsTitle?: string;
      allProjectsSubtitle?: string;
      liveDemo?: string;
      visitApp?: string;
    };
  };
  currentLang?: string;
}

export function Projects({ data, dict, currentLang }: ProjectsProps) {
  const featuredItems = data.items.filter((item) => item.featured === true);
  const regularItems = data.items.filter((item) => !item.featured);
  const hasFeatured = featuredItems.length > 0;

  // Render a single project card
  const renderCard = (item: ProjectItem, isFeatured: boolean = false) => {
    const cardContent = (
      <TiltCard3D
        maxTilt={isFeatured ? 8 : 10}
        scale={isFeatured ? 1.02 : 1.03}
        perspective={isFeatured ? 1200 : 1000}
        glare={true}
        glareMaxOpacity={isFeatured ? 0.16 : 0.18}
        prismatic={true}
        className={`h-full ${isFeatured ? "rounded-3xl" : "rounded-2xl"}`}
        data-testid="project-card-tilt"
      >
        <div
          className={`relative h-full flex flex-col justify-between transition-all duration-300 group [transform-style:preserve-3d] ${
            isFeatured
              ? "p-6 sm:p-8 bg-white/95 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200/90 dark:border-zinc-800/90 rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-cyan-500/10 dark:hover:shadow-cyan-500/5 hover:border-cyan-500/50 dark:hover:border-cyan-400/40"
              : "p-6 bg-white/90 dark:bg-zinc-900/60 backdrop-blur-xs border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl shadow-xs hover:shadow-2xl hover:shadow-cyan-500/10 dark:hover:shadow-cyan-500/5 hover:border-cyan-500/40 dark:hover:border-cyan-400/30"
          }`}
        >
          <div>
            {/* Top header row for featured items */}
            {isFeatured && (
              <div className="flex items-center justify-between gap-3 mb-4 [transform:translateZ(26px)]">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 shrink-0 shadow-2xs">
                    <i className={`${item.icon} text-base`} />
                  </div>
                  {item.badge && (
                    <span className="text-2xs sm:text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                      {item.badge}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-2xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{dict.portfolio.liveDemo || "Live Demo"}</span>
                </div>
              </div>
            )}

            {/* Thumbnail / Mockup Preview */}
            <div className={`[transform:translateZ(${isFeatured ? "22px" : "18px"})]`}>
              <ProjectThumbnail
                title={item.title}
                thumbnail={item.thumbnail}
                icon={item.icon}
                badge={isFeatured ? undefined : item.badge}
                url={item.url}
                variant={isFeatured ? "featured" : "standard"}
              />
            </div>

            {/* Title & Description */}
            <div className={`space-y-2.5 [transform:translateZ(${isFeatured ? "30px" : "25px"})]`}>
              <div className="flex items-center gap-2.5">
                {!isFeatured && (
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/10 dark:bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 shrink-0 shadow-sm">
                    <i className={`${item.icon} text-sm`} />
                  </div>
                )}
                <h3
                  className={`font-bold tracking-tight text-zinc-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-300 ${
                    isFeatured ? "text-xl sm:text-2xl" : "text-lg line-clamp-1"
                  }`}
                >
                  {item.title}
                </h3>
              </div>

              <p
                className={`text-zinc-600 dark:text-zinc-300 leading-relaxed ${
                  isFeatured ? "text-sm sm:text-base line-clamp-3" : "text-xs sm:text-sm dark:text-zinc-400 line-clamp-3"
                }`}
              >
                {currentLang === "id" && item.description_id ? item.description_id : item.description}
              </p>

              {/* Tech Stack Chips for Featured Items */}
              {isFeatured && item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2 [transform:translateZ(28px)]">
                  {item.tags.map((tag, tagIdx) => (
                    <span
                      key={tagIdx}
                      className="text-xs px-2.5 py-0.5 rounded-lg font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700/60 shadow-2xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Project Link Action */}
          {item.url && (
            <div
              className={`pt-5 mt-5 border-t border-zinc-100 dark:border-zinc-800/70 flex items-center justify-between font-semibold [transform:translateZ(${
                isFeatured ? "34px" : "15px"
              })]`}
            >
              {isFeatured ? (
                <>
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 group-hover:from-cyan-500 group-hover:to-blue-500 text-white shadow-sm shadow-cyan-600/20 group-hover:shadow-md group-hover:shadow-cyan-500/25 transition-all duration-300">
                    <span>{dict.portfolio.visitApp || dict.portfolio.viewProject}</span>
                    <i className="fas fa-chevron-right text-[10px] transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    <span className="hidden sm:inline">{dict.portfolio.viewProject}</span>
                    <i className="fas fa-external-link-alt text-xs" />
                  </span>
                </>
              ) : (
                <>
                  <span className="flex items-center gap-1.5 text-xs text-cyan-600 dark:text-cyan-400 group-hover:gap-2 transition-all duration-300">
                    <span>{dict.portfolio.viewProject}</span>
                    <i className="fas fa-chevron-right text-[10px] transition-transform group-hover:translate-x-1" />
                  </span>
                  <i className="fas fa-external-link-alt text-[10px] text-zinc-400 dark:text-zinc-500" />
                </>
              )}
            </div>
          )}
        </div>
      </TiltCard3D>
    );

    return item.url ? (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`block h-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
          isFeatured ? "rounded-3xl" : "rounded-2xl"
        }`}
      >
        {cardContent}
      </a>
    ) : (
      cardContent
    );
  };

  return (
    <section id="service" className="relative py-24 bg-slate-50 dark:bg-zinc-950/50 overflow-hidden" data-testid="projects">
      {/* Background subtle accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-cyan-400/5 dark:bg-cyan-400/3 blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-violet-500/5 dark:bg-violet-500/3 blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col items-center">
          <div className="flex items-center space-x-3 mb-2">
            <span className="section-accent-line" />
            <span className="text-sm font-bold uppercase tracking-wider section-label">
              {dict.portfolio.sectionLabel}
            </span>
            <span className="section-accent-line" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-800 dark:text-white leading-tight">
            {dict.portfolio.sectionTitle}
          </h2>
          {hasFeatured && dict.portfolio.flagshipSubtitle && (
            <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-xl">
              {dict.portfolio.flagshipSubtitle}
            </p>
          )}
        </div>

        {/* Tier 1: Flagship Featured Showcase */}
        {hasFeatured && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 mb-16">
            {featuredItems.map((item, idx) => (
              <ScrollReveal
                key={`featured-${idx}`}
                delay={item.delay || "0.2s"}
                direction="up"
                className="h-full"
              >
                {renderCard(item, true)}
              </ScrollReveal>
            ))}
          </div>
        )}

        {/* Tier 2: Catalog Divider & Sub-Header (if featured items exist) */}
        {hasFeatured && regularItems.length > 0 && (
          <div className="pt-16 mt-8 border-t border-zinc-200/70 dark:border-zinc-800/70 text-center max-w-2xl mx-auto mb-12 flex flex-col items-center">
            <div className="flex items-center space-x-3 mb-2">
              <span className="section-accent-line" />
              <span className="text-xs font-bold uppercase tracking-wider section-label">
                Catalog & Archive
              </span>
              <span className="section-accent-line" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-800 dark:text-white leading-tight">
              {dict.portfolio.allProjectsTitle || "Pustaka Proyek & Karya Lainnya"}
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-lg">
              {dict.portfolio.allProjectsSubtitle || "Eksplorasi aplikasi web, pustaka Android, dan kontribusi open source lainnya."}
            </p>
          </div>
        )}

        {/* Regular Project Grid (or all items if none flagged featured) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(hasFeatured ? regularItems : data.items).map((item, idx) => (
            <ScrollReveal
              key={`regular-${idx}`}
              delay={item.delay}
              direction="up"
              className="h-full"
            >
              {renderCard(item, false)}
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
