import { ScrollReveal } from "./scroll-reveal";
import { ProjectThumbnail } from "./project-thumbnail";
import { TiltCard3D } from "./tilt-card-3d";

interface ProjectItem {
  icon: string;
  title: string;
  description: string;
  description_id?: string;
  delay: string;
  url?: string;
  thumbnail?: string;
  badge?: string;
}

interface ProjectsProps {
  data: {
    items: ProjectItem[];
  };
  dict: {
    portfolio: {
      sectionLabel: string;
      sectionTitle: string;
      viewProject: string;
    };
  };
  currentLang?: string;
}

export function Projects({ data, dict, currentLang }: ProjectsProps) {
  return (
    <section id="service" className="relative py-24 bg-slate-50 dark:bg-zinc-950/50 overflow-hidden" data-testid="projects">
      {/* Background subtle accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-cyan-400/5 dark:bg-cyan-400/3 blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-violet-500/5 dark:bg-violet-500/3 blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
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
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.items.map((item, idx) => {
            const cardContent = (
              <TiltCard3D
                maxTilt={8}
                scale={1.02}
                perspective={1000}
                glare={true}
                glareMaxOpacity={0.14}
                className="h-full rounded-2xl"
                data-testid="project-card-tilt"
              >
                <div className="relative h-full flex flex-col justify-between p-6 bg-white/90 dark:bg-zinc-900/60 backdrop-blur-xs border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl shadow-xs hover:shadow-xl hover:shadow-cyan-500/10 dark:hover:shadow-cyan-500/5 hover:border-cyan-500/40 dark:hover:border-cyan-400/30 transition-colors duration-300 group [transform-style:preserve-3d]">
                  <div>
                    {/* Thumbnail / Mockup Preview */}
                    <div className="[transform:translateZ(10px)]">
                      <ProjectThumbnail
                        title={item.title}
                        thumbnail={item.thumbnail}
                        icon={item.icon}
                        badge={item.badge}
                      />
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-2 [transform:translateZ(15px)]">
                      <div className="flex items-center gap-2.5">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/10 dark:bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 shrink-0">
                          <i className={`${item.icon} text-sm`} />
                        </div>
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-300 line-clamp-1">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed line-clamp-3">
                        {currentLang === "id" && item.description_id ? item.description_id : item.description}
                      </p>
                    </div>
                  </div>

                  {/* Project Link Action */}
                  {item.url && (
                    <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between text-xs font-semibold text-cyan-600 dark:text-cyan-400 group-hover:gap-2 transition-all duration-300 [transform:translateZ(10px)]">
                      <span className="flex items-center gap-1.5">
                        <span>{dict.portfolio.viewProject}</span>
                        <i className="fas fa-chevron-right text-[10px] transition-transform group-hover:translate-x-1" />
                      </span>
                      <i className="fas fa-external-link-alt text-[10px] text-zinc-400 dark:text-zinc-500" />
                    </div>
                  )}
                </div>
              </TiltCard3D>
            );

            return (
              <ScrollReveal
                key={idx}
                delay={item.delay}
                direction="up"
                className="h-full"
              >
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-2xl"
                  >
                    {cardContent}
                  </a>
                ) : (
                  cardContent
                )}
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
