import Image from "next/image";
import { ScrollReveal } from "./scroll-reveal";

interface Skill {
  name: string;
  percentage: number;
}

interface AboutProps {
  data: {
    image: string;
    description: string;
    skills: Skill[];
  };
  dict: {
    about: {
      sectionLabel: string;
      sectionTitle: string;
    };
  };
}

export function About({ data, dict }: AboutProps) {
  return (
    <section id="about" className="relative py-24 bg-white dark:bg-zinc-950 overflow-hidden" data-testid="about">
      {/* Decorative accent shapes */}
      <div className="absolute top-10 right-[5%] w-64 h-64 rounded-full bg-cyan-400/5 dark:bg-cyan-400/3 blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-10 left-[5%] w-48 h-48 rounded-full bg-violet-500/5 dark:bg-violet-500/3 blur-3xl" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Image (hidden on smaller screens like the original layout) */}
          <ScrollReveal direction="left" className="hidden lg:block">
            {/* Outer gradient border */}
            <div className="relative aspect-[4/5] w-full rounded-2xl p-0.5" style={{ background: 'linear-gradient(135deg, var(--accent-from), var(--accent-via), var(--accent-to))' }}>
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-white dark:bg-zinc-950">
                <Image
                  src={`/${data.image}`}
                  alt="About Me Image"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </ScrollReveal>

          {/* Right Column - Content */}
          <ScrollReveal direction="right" className="flex flex-col space-y-6">
            {/* Custom Section Header */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-3">
                <span className="section-accent-line" />
                <span className="text-sm font-bold uppercase tracking-wider section-label">
                  {dict.about.sectionLabel}
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-800 dark:text-white leading-tight">
                {dict.about.sectionTitle}
              </h2>
            </div>

            {/* Description */}
            <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-base md:text-lg">
              {data.description}
            </p>

            {/* Skills */}
            <div className="space-y-5 pt-4">
              {data.skills.map((skill, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-center text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    <span>{skill.name}</span>
                    <span className="section-label font-bold">{skill.percentage}%</span>
                  </div>
                  {/* Skill Progress Bar Background */}
                  <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800/60 rounded-full overflow-hidden">
                    <div
                      className="relative h-full rounded-full transition-all duration-1000 ease-out overflow-hidden shimmer-overlay"
                      style={{
                        width: `${skill.percentage}%`,
                        background: 'linear-gradient(90deg, var(--accent-from), var(--accent-via), var(--accent-to))',
                      }}
                      role="progressbar"
                      aria-valuenow={skill.percentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
