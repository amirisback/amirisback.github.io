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
    <section id="about" className="py-20 bg-white dark:bg-zinc-950 overflow-hidden" data-testid="about">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Image (hidden on smaller screens like the original layout) */}
          <ScrollReveal direction="left" className="hidden lg:block">
            <div className="relative aspect-[4/5] w-full rounded-sm overflow-hidden shadow-xl border border-zinc-200 dark:border-zinc-800">
              <Image
                src={`/${data.image}`}
                alt="About Me Image"
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </ScrollReveal>

          {/* Right Column - Content */}
          <ScrollReveal direction="right" className="flex flex-col space-y-6">
            {/* Custom Section Header */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-3">
                <span className="h-[2px] w-8 bg-[#2e3d48] dark:bg-cyan-400" />
                <span className="text-sm font-bold uppercase tracking-wider text-[#2e3d48] dark:text-cyan-400">
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
                    <span className="text-[#2e3d48] dark:text-cyan-400">{skill.percentage}%</span>
                  </div>
                  {/* Skill Progress Bar Background */}
                  <div className="h-2.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#2e3d48] dark:bg-cyan-500 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${skill.percentage}%` }}
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
