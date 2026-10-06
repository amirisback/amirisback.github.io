import { ScrollReveal } from "./scroll-reveal";
import { TiltCard3D } from "./tilt-card-3d";

interface ExperienceItem {
  date: string;
  title: string;
  company: string;
  location: string;
  side: "left" | "right" | string;
  type?: string;
  type_id?: string;
  description?: string;
  description_id?: string;
  highlights?: string[];
  highlights_id?: string[];
  skills?: string[];
}

interface ExperienceProps {
  data: {
    items: ExperienceItem[];
  };
  dict: {
    experience: {
      sectionLabel: string;
      sectionTitle: string;
      present?: string;
      keyAchievements?: string;
      technologies?: string;
    };
  };
  currentLang?: string;
}

function formatExperienceDate(dateStr: string, dictPresent?: string, lang?: string): string {
  let result = dateStr;
  if (dictPresent) {
    result = result.replace(/\bNow\b/i, dictPresent).replace(/\bSekarang\b/i, dictPresent);
  }
  if (lang === "en") {
    result = result.replace(/\bDes\b/g, "Dec").replace(/\bMei\b/g, "May");
  } else if (lang === "id") {
    result = result.replace(/\bDec\b/g, "Des").replace(/\bMay\b/g, "Mei");
  }
  return result;
}

function formatExperienceLocation(locStr: string, lang?: string): string {
  let loc = locStr.replace("IndonesiaBandung", "Indonesia");
  if (lang === "en") {
    loc = loc.replace("Jawa Barat", "West Java");
  } else if (lang === "id") {
    loc = loc.replace("West Java", "Jawa Barat");
  }
  return loc;
}

export function Experience({ data, dict, currentLang }: ExperienceProps) {
  return (
    <section id="experience" className="relative py-24 bg-white dark:bg-zinc-950 overflow-hidden" data-testid="experience">
      {/* Background ambient lighting for 3D depth */}
      <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-cyan-400/5 dark:bg-cyan-400/3 blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 rounded-full bg-violet-500/5 dark:bg-violet-500/3 blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col items-center">
          <div className="flex items-center space-x-3 mb-2">
            <span className="section-accent-line" />
            <span className="text-sm font-bold uppercase tracking-wider section-label">
              {dict.experience.sectionLabel}
            </span>
            <span className="section-accent-line" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-800 dark:text-white leading-tight">
            {dict.experience.sectionTitle}
          </h2>
        </div>

        {/* Timeline Container */}
        <div className="relative w-full">
          {/* Vertical Center Spine with Laser Glow */}
          <div
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[3px] -translate-x-1/2 rounded-full shadow-[0_0_12px_rgba(34,211,238,0.35)]"
            style={{ background: 'linear-gradient(to bottom, var(--accent-from), var(--accent-via), var(--accent-to))' }}
            aria-hidden="true"
          />

          {/* Timeline Items */}
          <div className="space-y-12">
            {data.items.map((item, idx) => {
              const isLeft = item.side === "left";
              const revealDirection = isLeft ? "left" : "right";
              const formattedDate = formatExperienceDate(item.date, dict.experience?.present, currentLang);
              const formattedLocation = formatExperienceLocation(item.location, currentLang);

              const employmentType = currentLang === "id" && item.type_id ? item.type_id : (item.type || "");
              const description = currentLang === "id" && item.description_id ? item.description_id : (item.description || "");
              const highlights = currentLang === "id" && item.highlights_id && item.highlights_id.length > 0 ? item.highlights_id : (item.highlights || []);
              const skills = item.skills || [];

              return (
                <div
                  key={idx}
                  className={`relative flex flex-col md:flex-row items-start ${
                    isLeft ? "md:justify-start" : "md:justify-end"
                  } w-full pl-12 md:pl-0`}
                >
                  {/* Kinetic 3D Milestone Node Sphere on Center Spine */}
                  <div
                    className="absolute left-4 md:left-1/2 top-6 md:top-8 -translate-x-1/2 z-20 flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-zinc-950 border-2 border-cyan-400 dark:border-cyan-500 shadow-[0_0_16px_rgba(34,211,238,0.5)] transition-transform duration-300 hover:scale-125"
                    aria-hidden="true"
                  >
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, var(--accent-from), var(--accent-to))',
                        animation: 'dot-pulse 2.5s ease-in-out infinite',
                      }}
                    >
                      <i className="fas fa-briefcase text-[8px] text-white" />
                    </div>
                  </div>

                  {/* Milestone Date Badge - Floats on the opposite side of the center line on desktop, anchored above card on mobile */}
                  <div
                    className={`absolute left-12 top-0 md:top-8 text-xs md:text-sm font-bold uppercase tracking-wider section-label z-10 flex items-center gap-1.5 ${
                      isLeft
                        ? "md:left-[calc(50%+36px)] md:right-auto md:text-left"
                        : "md:right-[calc(50%+36px)] md:left-auto md:text-right md:justify-end"
                    } -translate-y-7 md:translate-y-0`}
                  >
                    <i className="far fa-calendar-alt text-xs text-cyan-500" aria-hidden="true" />
                    <span>{formattedDate}</span>
                  </div>

                  {/* 3D Tilt Card Block */}
                  <ScrollReveal
                    direction={revealDirection}
                    className={`w-full md:w-[calc(50%-48px)] ${
                      isLeft ? "md:mr-auto" : "md:ml-auto"
                    }`}
                  >
                    <TiltCard3D
                      data-testid="experience-card-tilt"
                      prismatic={true}
                      maxTilt={8}
                      scale={1.02}
                      perspective={1000}
                      glare={true}
                      glareMaxOpacity={0.16}
                      className="w-full rounded-2xl group transition-all duration-300"
                    >
                      <div className="relative p-6 sm:p-7 bg-white/90 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-cyan-500/10 dark:hover:shadow-cyan-500/5 hover:border-cyan-500/40 dark:hover:border-cyan-400/30 transition-all duration-300 [transform-style:preserve-3d]">
                        {/* Title & Organization Header (Layer 4 & 2) */}
                        <div className="space-y-1.5 mb-3 [transform:translateZ(24px)]">
                          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-300">
                            {item.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm [transform:translateZ(14px)]">
                            <span className="font-semibold text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
                              <i className="fas fa-building text-xs text-cyan-500" aria-hidden="true" />
                              <span>{item.company}</span>
                            </span>
                            {employmentType && (
                              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/10 dark:bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                                {employmentType}
                              </span>
                            )}
                            <span className="text-zinc-400 dark:text-zinc-500">|</span>
                            <span className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                              <i className="fas fa-map-marker-alt text-[11px] text-zinc-400" aria-hidden="true" />
                              <span>{formattedLocation}</span>
                            </span>
                          </div>
                        </div>

                        {/* Overview Description (Layer 1) */}
                        {description && (
                          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 font-normal mb-4 [transform:translateZ(10px)]">
                            {description}
                          </p>
                        )}

                        {/* Key Contributions & Achievements (Layer 3) */}
                        {highlights.length > 0 && (
                          <div className="mb-4 space-y-2 [transform:translateZ(16px)]">
                            {dict.experience?.keyAchievements && (
                              <div className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5 flex items-center gap-1.5">
                                <i className="fas fa-bullseye text-[10px] text-cyan-500" aria-hidden="true" />
                                <span>{dict.experience.keyAchievements}</span>
                              </div>
                            )}
                            <ul className="space-y-1.5 list-none pl-0">
                              {highlights.map((highlight, hIdx) => (
                                <li key={hIdx} className="flex items-start text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                                  <i className="fas fa-check-circle text-xs text-cyan-500 dark:text-cyan-400 mr-2 mt-0.5 shrink-0" aria-hidden="true" />
                                  <span>{highlight}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Core Technologies & Skills Badges (Layer 5) */}
                        {skills.length > 0 && (
                          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 [transform:translateZ(28px)]">
                            {dict.experience?.technologies && (
                              <div className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2 flex items-center gap-1.5">
                                <i className="fas fa-layer-group text-[10px] text-cyan-500" aria-hidden="true" />
                                <span>{dict.experience.technologies}</span>
                              </div>
                            )}
                            <div className="flex flex-wrap gap-1.5">
                              {skills.map((skill, sIdx) => (
                                <span
                                  key={sIdx}
                                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-zinc-100/90 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-700/60 shadow-xs hover:border-cyan-400/50 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </TiltCard3D>
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
