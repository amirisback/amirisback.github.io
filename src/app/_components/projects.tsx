import { ScrollReveal } from "./scroll-reveal";

interface ProjectItem {
  icon: string;
  title: string;
  description: string;
  delay: string;
  url?: string;
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
}

export function Projects({ data, dict }: ProjectsProps) {
  return (
    <section id="service" className="relative py-24 bg-slate-50 dark:bg-zinc-950/50 overflow-hidden" data-testid="projects">
      {/* Background mesh accent */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-cyan-400/5 dark:bg-cyan-400/3 blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-violet-500/5 dark:bg-violet-500/3 blur-3xl" aria-hidden="true" />

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
              <div className="relative h-full flex flex-col justify-between p-8 bg-white/80 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200/60 dark:border-zinc-800/40 rounded-2xl shadow-sm hover:shadow-2xl hover:shadow-cyan-500/10 dark:hover:shadow-cyan-500/5 hover:-translate-y-2 hover:border-cyan-400/40 dark:hover:border-cyan-400/30 transition-all duration-500 group">
                <div className="space-y-4">
                  {/* Icon */}
                  <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-400/20 via-indigo-500/10 to-violet-500/20 dark:from-cyan-400/15 dark:via-indigo-500/10 dark:to-violet-500/15 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-cyan-500/20 transition-all duration-300">
                    <i className={`${item.icon} text-2xl`} />
                  </div>
                  {/* Title */}
                  <h3 className="text-xl font-bold text-zinc-800 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-500 group-hover:to-violet-500 group-hover:bg-clip-text transition-colors duration-300">
                    {item.title}
                  </h3>
                  {/* Description */}
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Optional Project Link */}
                {item.url && (
                  <div className="pt-6 flex items-center text-sm font-semibold section-label group-hover:gap-2 transition-all duration-300">
                    <span>{dict.portfolio.viewProject}</span>
                    <i className="fas fa-chevron-right ml-2 text-xs transition-transform group-hover:translate-x-1" />
                  </div>
                )}
              </div>
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
                    className="block h-full cursor-pointer"
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
