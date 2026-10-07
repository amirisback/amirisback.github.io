import Image from "next/image";
import { ScrollReveal } from "./scroll-reveal";
import { TiltCard3D } from "./tilt-card-3d";
import { AboutBackground3D } from "./about-background-3d";

interface Skill {
  name: string;
  percentage: number;
}

interface MetricItem {
  value: string;
  label: string;
}

interface PillarItem {
  title: string;
  desc: string;
}

interface AboutProps {
  data: {
    image: string;
    description: string;
    skills?: Skill[];
  };
  dict: {
    about: {
      sectionLabel: string;
      sectionTitle: string;
      description?: string;
      badges?: {
        experience?: string;
        openSource?: string;
        architecture?: string;
      };
      metrics?: {
        expYears?: MetricItem;
        openSource?: MetricItem;
        enterpriseTier?: MetricItem;
        modernStack?: MetricItem;
      };
      pillarsTitle?: string;
      pillarsSubtitle?: string;
      pillars?: {
        android?: PillarItem;
        web?: PillarItem;
        modular?: PillarItem;
      };
    };
  };
}

export function About({ data, dict }: AboutProps) {
  const descriptionText = dict.about.description || data.description;

  // Safe fallbacks for holographic badges
  const badgeExp = dict.about.badges?.experience || "6+ Years Experience";
  const badgeOpenSource = dict.about.badges?.openSource || "Frogo Open Source";
  const badgeArchitecture = dict.about.badges?.architecture || "Clean Architecture";

  // Safe fallbacks for verified metrics
  const metricExp = dict.about.metrics?.expYears || { value: "6+", label: "Years Experience" };
  const metricOS = dict.about.metrics?.openSource || { value: "30+", label: "Open Source Repos" };
  const metricTier = dict.about.metrics?.enterpriseTier || { value: "Enterprise", label: "Fintech & Health" };
  const metricStack = dict.about.metrics?.modernStack || { value: "100%", label: "Clean Architecture" };

  const metricsList = [metricExp, metricOS, metricTier, metricStack];

  // Engineering pillars data
  const pillarAndroid = dict.about.pillars?.android || {
    title: "Native Android & Mobile Architecture",
    desc: "High-performance native engineering with Kotlin, Jetpack Compose, CameraX, Coroutines, modular systems, and Google Play Store compliance.",
  };
  const pillarWeb = dict.about.pillars?.web || {
    title: "Modern Web & Full-Stack Systems",
    desc: "High-speed reactive web engineering with Next.js App Router, React 19, TypeScript, Tailwind CSS v4, PWA, and SEO optimization.",
  };
  const pillarModular = dict.about.pillars?.modular || {
    title: "Modular Systems & Open Source Impact",
    desc: "Modular library authoring, layered Clean Architecture patterns, AES-256 authenticated cryptographic security, and the Frogo open-source ecosystem.",
  };

  const pillarsData = [
    {
      ...pillarAndroid,
      icon: "fas fa-mobile-screen-button",
      accent: "from-cyan-400 to-blue-500",
      tagColor: "border-cyan-400/30 text-cyan-700 dark:text-cyan-300 bg-cyan-400/10",
      tags: ["Kotlin", "Jetpack Compose", "CameraX", "Coroutines"],
    },
    {
      ...pillarWeb,
      icon: "fas fa-globe",
      accent: "from-indigo-400 to-violet-500",
      tagColor: "border-indigo-400/30 text-indigo-700 dark:text-indigo-300 bg-indigo-400/10",
      tags: ["Next.js 16", "React 19", "TypeScript", "Tailwind v4"],
    },
    {
      ...pillarModular,
      icon: "fas fa-cubes",
      accent: "from-amber-400 to-orange-500",
      tagColor: "border-amber-400/30 text-amber-700 dark:text-amber-300 bg-amber-400/10",
      tags: ["Frogo Ecosystem", "Clean Architecture", "AES-256", "Modularity"],
    },
  ];

  return (
    <section
      id="about"
      className="relative py-24 sm:py-32 bg-white dark:bg-zinc-950 overflow-hidden text-zinc-900 dark:text-white"
      data-testid="about"
    >
      {/* 3D Kinetic Geometric Mesh & Particle Canvas */}
      <AboutBackground3D />

      {/* Decorative ambient lighting depth */}
      <div
        className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-cyan-500/10 dark:bg-cyan-500/5 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 -right-20 w-96 h-96 rounded-full bg-amber-500/10 dark:bg-amber-500/5 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 z-10">
        {/* Top Profile & Spatial Stage Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: 3D Holographic Spatial Avatar Stage (Cols: 5) */}
          <div className="lg:col-span-5 flex justify-center">
            <ScrollReveal direction="left" className="w-full max-w-md">
              <TiltCard3D
                maxTilt={12}
                scale={1.03}
                perspective={1200}
                glare={true}
                glareMaxOpacity={0.25}
                prismatic={true}
                className="relative mx-auto w-72 h-96 sm:w-80 sm:h-[420px] rounded-3xl"
                data-testid="about-avatar-tilt"
              >
                {/* Floating 3D Holographic Badge 1: Experience (Z: +45px) */}
                <div
                  data-testid="about-badge-experience"
                  className="absolute -top-3 -left-4 z-40 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 dark:bg-zinc-900/95 backdrop-blur-md border border-amber-400/40 text-amber-300 shadow-[0_8px_25px_rgba(251,191,36,0.3)] text-xs font-semibold [transform:translateZ(45px)] pointer-events-auto"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <i className="fas fa-award text-xs text-amber-400" />
                  <span>{badgeExp}</span>
                </div>

                {/* Floating 3D Holographic Badge 2: Open Source (Z: +50px) */}
                <div
                  data-testid="about-badge-opensource"
                  className="absolute -bottom-3 -right-4 z-40 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 dark:bg-zinc-900/95 backdrop-blur-md border border-cyan-400/40 text-cyan-300 shadow-[0_8px_25px_rgba(34,211,238,0.3)] text-xs font-semibold [transform:translateZ(50px)] pointer-events-auto"
                >
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <i className="fas fa-code-branch text-xs text-cyan-400" />
                  <span>{badgeOpenSource}</span>
                </div>

                {/* Floating 3D Holographic Badge 3: Architecture (Z: +40px) */}
                <div
                  data-testid="about-badge-architecture"
                  className="absolute top-1/2 -right-5 -translate-y-1/2 z-40 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/90 dark:bg-zinc-900/95 backdrop-blur-md border border-indigo-400/40 text-indigo-300 shadow-[0_8px_25px_rgba(99,102,241,0.3)] text-[11px] font-semibold [transform:translateZ(40px)] pointer-events-auto"
                >
                  <i className="fas fa-layer-group text-xs text-indigo-400" />
                  <span>{badgeArchitecture}</span>
                </div>

                {/* 3D Gyroscopic Orbital Ring 1 (Cyan) */}
                <div
                  data-testid="about-orbit-ring-1"
                  className="pointer-events-none absolute -inset-6 rounded-full border border-cyan-400/25 [transform:rotateX(65deg)_rotateY(-20deg)_translateZ(20px)]"
                  style={{ animation: "spin 24s linear infinite" }}
                  aria-hidden="true"
                >
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee]" />
                </div>

                {/* 3D Gyroscopic Orbital Ring 2 (Amber) */}
                <div
                  data-testid="about-orbit-ring-2"
                  className="pointer-events-none absolute -inset-10 rounded-full border border-amber-400/20 [transform:rotateX(-55deg)_rotateY(25deg)_translateZ(15px)]"
                  style={{ animation: "spin 30s linear infinite reverse" }}
                  aria-hidden="true"
                >
                  <span className="absolute bottom-0 right-1/4 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_12px_#fbbf24]" />
                </div>

                {/* Luxury Beveled Border & Image Container */}
                <div
                  className="relative w-full h-full rounded-3xl p-1.5 [transform:translateZ(5px)]"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(251,191,36,0.8), rgba(34,211,238,0.8), rgba(99,102,241,0.8))",
                  }}
                >
                  <div className="relative w-full h-full rounded-[22px] overflow-hidden bg-zinc-950 shadow-2xl">
                    <Image
                      src={`/${data.image}`}
                      alt="Muhammad Faisal Amir"
                      fill
                      className="object-cover transition-transform duration-700 hover:scale-105"
                      sizes="(max-width: 1024px) 320px, 420px"
                    />
                    {/* Subtle gradient vignette at bottom */}
                    <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent pointer-events-none" />
                  </div>
                </div>

                {/* Ambient glow directly behind portrait */}
                <div
                  className="absolute inset-0 rounded-3xl opacity-35 blur-2xl -z-10"
                  style={{
                    background: "radial-gradient(circle, rgba(34,211,238,0.4) 0%, rgba(251,191,36,0.3) 100%)",
                  }}
                  aria-hidden="true"
                />
              </TiltCard3D>
            </ScrollReveal>
          </div>

          {/* Right Column: Bio Content & Verified Metrics (Cols: 7) */}
          <div className="lg:col-span-7 flex flex-col space-y-8">
            <ScrollReveal direction="right" className="flex flex-col space-y-4">
              {/* Custom Section Header with Metallic Line */}
              <div className="flex items-center space-x-3">
                <span className="section-accent-line" />
                <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
                  {dict.about.sectionLabel}
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight">
                {dict.about.sectionTitle}
              </h2>

              {/* Bio Paragraphs */}
              <div className="space-y-4 text-zinc-600 dark:text-zinc-300 leading-relaxed text-base sm:text-lg pt-2">
                {descriptionText.split("\n\n").map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </ScrollReveal>

            {/* 4 Verified Metric Pods */}
            <ScrollReveal direction="up" className="pt-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {metricsList.map((m, idx) => (
                  <div
                    key={idx}
                    className="group relative p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/10 hover:border-cyan-400/50 transition-all duration-300 shadow-sm hover:shadow-[0_8px_30px_rgba(34,211,238,0.15)] hover:-translate-y-1"
                  >
                    <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-indigo-600 dark:from-cyan-400 dark:to-indigo-300 font-mono">
                      {m.value}
                    </div>
                    <div className="mt-1 text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-400 leading-snug">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            {/* Quick Interactive Credentials Links */}
            <ScrollReveal direction="up" className="flex flex-wrap gap-4 pt-2">
              <a
                href="#service"
                className="px-6 py-3 rounded-full text-xs sm:text-sm font-semibold tracking-wide bg-gradient-to-r from-cyan-500 via-indigo-500 to-violet-600 text-white shadow-lg hover:shadow-[0_0_25px_rgba(34,211,238,0.35)] hover:scale-[1.02] transition-all duration-300"
              >
                <i className="fas fa-layer-group mr-2 text-xs" />
                <span>Explore Featured Projects</span>
              </a>
              <a
                href="#experience"
                className="px-6 py-3 rounded-full text-xs sm:text-sm font-semibold tracking-wide bg-zinc-100 dark:bg-white/10 text-zinc-800 dark:text-white border border-zinc-200 dark:border-white/20 hover:bg-zinc-200 dark:hover:bg-white/20 transition-all duration-300"
              >
                <i className="fas fa-timeline mr-2 text-xs" />
                <span>Career Timeline</span>
              </a>
            </ScrollReveal>
          </div>
        </div>

        {/* Bottom Section: 3 Interactive 3D Engineering Pillar Cards */}
        <div className="mt-24 pt-12 border-t border-zinc-200/60 dark:border-white/10">
          <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              {dict.about.pillarsTitle || "Pilar Rekayasa & Keahlian Utama"}
            </h3>
            <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
              {dict.about.pillarsSubtitle ||
                "Spesialisasi komprehensif mulai dari rekayasa mobile native hingga arsitektur web modern skala enterprise."}
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillarsData.map((pillar, idx) => (
              <ScrollReveal key={idx} direction="up" delay={`${(idx * 0.15).toFixed(2)}s`}>
                <TiltCard3D
                  maxTilt={10}
                  scale={1.02}
                  perspective={1000}
                  glare={true}
                  glareMaxOpacity={0.15}
                  prismatic={true}
                  className="h-full rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200/80 dark:border-white/10 p-6 sm:p-8 flex flex-col justify-between hover:border-cyan-400/50 transition-all duration-300 shadow-lg"
                  data-testid={`about-pillar-card-${idx}`}
                >
                  <div className="space-y-4">
                    {/* Pillar Icon with Gradient Background */}
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-tr ${pillar.accent} shadow-md`}
                    >
                      <i className={`${pillar.icon} text-lg`} />
                    </div>

                    <h4 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
                      {pillar.title}
                    </h4>

                    <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-2 pt-6 mt-4 border-t border-zinc-200/60 dark:border-white/5">
                    {pillar.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${pillar.tagColor}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </TiltCard3D>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
