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
    <section id="service" className="py-20 bg-zinc-50 dark:bg-zinc-900" data-testid="projects">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col items-center">
          <div className="flex items-center space-x-3 mb-2">
            <span className="h-[2px] w-8 bg-[#2e3d48] dark:bg-cyan-400" />
            <span className="text-sm font-bold uppercase tracking-wider text-[#2e3d48] dark:text-cyan-400">
              {dict.portfolio.sectionLabel}
            </span>
            <span className="h-[2px] w-8 bg-[#2e3d48] dark:bg-cyan-400" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-800 dark:text-white leading-tight">
            {dict.portfolio.sectionTitle}
          </h2>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.items.map((item, idx) => {
            const cardContent = (
              <div className="h-full flex flex-col justify-between p-8 bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 hover:border-cyan-500/50 dark:hover:border-cyan-500/50 shadow-md hover:shadow-xl transition-all duration-300 rounded-lg group">
                <div className="space-y-4">
                  {/* Icon */}
                  <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-[#2e3d48]/10 dark:bg-cyan-500/10 text-[#2e3d48] dark:text-cyan-400 group-hover:scale-110 transition-transform duration-300">
                    <i className={`${item.icon} text-2xl`} />
                  </div>
                  {/* Title */}
                  <h3 className="text-xl font-bold text-zinc-800 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {item.title}
                  </h3>
                  {/* Description */}
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Optional Project Link */}
                {item.url && (
                  <div className="pt-6 flex items-center text-sm font-semibold text-[#2e3d48] dark:text-cyan-400 group-hover:underline">
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
