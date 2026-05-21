import { ScrollReveal } from "./scroll-reveal";

interface ExperienceItem {
  date: string;
  title: string;
  company: string;
  location: string;
  side: "left" | "right" | string;
}

interface ExperienceProps {
  data: {
    items: ExperienceItem[];
  };
  dict: {
    experience: {
      sectionLabel: string;
      sectionTitle: string;
    };
  };
}

export function Experience({ data, dict }: ExperienceProps) {
  return (
    <section id="experience" className="py-20 bg-white dark:bg-zinc-950 overflow-hidden" data-testid="experience">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col items-center">
          <div className="flex items-center space-x-3 mb-2">
            <span className="h-[2px] w-8 bg-[#2e3d48] dark:bg-cyan-400" />
            <span className="text-sm font-bold uppercase tracking-wider text-[#2e3d48] dark:text-cyan-400">
              {dict.experience.sectionLabel}
            </span>
            <span className="h-[2px] w-8 bg-[#2e3d48] dark:bg-cyan-400" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-800 dark:text-white leading-tight">
            {dict.experience.sectionTitle}
          </h2>
        </div>

        {/* Timeline Container */}
        <div className="relative w-full">
          {/* Vertical Center Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-zinc-300 dark:bg-zinc-800 -translate-x-1/2" />

          {/* Timeline Items */}
          <div className="space-y-12">
            {data.items.map((item, idx) => {
              const isLeft = item.side === "left";
              const revealDirection = isLeft ? "left" : "right";

              return (
                <div
                  key={idx}
                  className={`relative flex flex-col md:flex-row items-start ${
                    isLeft ? "md:justify-start" : "md:justify-end"
                  } w-full pl-12 md:pl-0`}
                >
                  {/* Circle Indicator on the center line */}
                  <div className="absolute left-4 md:left-1/2 top-1.5 md:top-8 w-4 h-4 rounded-full bg-white dark:bg-zinc-950 border-4 border-[#2e3d48] dark:border-cyan-400 -translate-x-1/2 z-10" />

                  {/* Date Badge - Floats on the opposite side of the text block on desktop */}
                  <div
                    className={`absolute left-12 md:absolute md:top-7 text-xs md:text-sm font-bold uppercase tracking-wider text-[#2e3d48] dark:text-cyan-400 z-10 ${
                      isLeft
                        ? "md:left-[calc(50%+30px)] md:right-auto md:text-left"
                        : "md:right-[calc(50%+30px)] md:left-auto md:text-right"
                    } -translate-y-8 md:translate-y-0`}
                  >
                    {item.date}
                  </div>

                  {/* Card Block */}
                  <ScrollReveal
                    direction={revealDirection}
                    className={`w-full md:w-[calc(50%-40px)] ${
                      isLeft ? "md:mr-auto" : "md:ml-auto"
                    }`}
                  >
                    <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-xl font-bold text-zinc-800 dark:text-white mb-1">
                        {item.title}
                      </h3>
                      <h4 className="text-base font-medium italic text-[#2e3d48] dark:text-cyan-400 mb-2">
                        {item.company}
                      </h4>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {item.location}
                      </p>
                    </div>
                  </ScrollReveal>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
