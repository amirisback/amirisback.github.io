import Image from "next/image";
import { TypingText } from "./typing-text";

interface HeroButton {
  label: string;
  href: string;
}

interface HeroProps {
  data: {
    greeting: string;
    name: string;
    typedTexts: string[];
    heroImage: string;
    videoBackground?: string;
    buttons: HeroButton[];
  };
}

export function Hero({ data }: HeroProps) {
  const videoId = data.videoBackground;
  const videoSrc = videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&playlist=${videoId}`
    : null;

  return (
    <section
      id="home"
      className="relative w-full overflow-hidden text-white min-h-screen flex items-center pt-20"
      data-testid="hero"
    >
      {/* Animated Gradient Background */}
      <div
        className="absolute inset-0 gradient-animated z-0"
        style={{
          background: 'linear-gradient(135deg, var(--hero-from) 0%, var(--hero-via) 50%, var(--hero-to) 100%)',
        }}
      />

      {/* Gradient mesh overlay for depth */}
      <div
        className="absolute inset-0 z-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse at 20% 50%, rgba(34,211,238,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.15) 0%, transparent 50%)',
        }}
      />

      {/* Floating CSS Shapes — purely decorative */}
      <div className="absolute top-20 left-[10%] w-16 h-16 rounded-full bg-cyan-500/10 blur-sm" style={{ animation: 'float 6s ease-in-out infinite' }} aria-hidden="true" />
      <div className="absolute top-40 right-[15%] w-24 h-24 rounded-full bg-violet-500/10 blur-md" style={{ animation: 'float-delayed 8s ease-in-out infinite' }} aria-hidden="true" />
      <div className="absolute bottom-32 left-[25%] w-12 h-12 rounded-full bg-indigo-500/10 blur-sm" style={{ animation: 'float 7s ease-in-out infinite 1s' }} aria-hidden="true" />
      <div className="absolute bottom-20 right-[20%] w-20 h-20 rounded-2xl rotate-45 bg-cyan-400/5 blur-sm" style={{ animation: 'float-delayed 9s ease-in-out infinite 2s' }} aria-hidden="true" />

      {/* YouTube Video Background */}
      {videoSrc && (
        <>
          <div className="absolute top-1/2 left-1/2 w-[300%] h-[300%] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
            <iframe
              id="hero-youtube-video"
              src={videoSrc}
              className="absolute top-0 left-0 w-full h-full border-0 object-cover"
              allow="autoplay; encrypted-media"
              title="Hero Background Video"
            />
          </div>
          {/* Overlay to ensure readability */}
          <div className="absolute inset-0 bg-slate-950/70 z-10" />
        </>
      )}

      {/* Main Content Container */}
      <div className="relative max-w-7xl mx-auto px-6 md:px-12 w-full z-20 py-16 lg:py-24">
        <div className="glass-strong rounded-3xl p-8 md:p-12 lg:p-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Hero Left Column (Content) */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-6">
              <p className="text-lg md:text-xl font-medium tracking-widest uppercase text-cyan-300/80">
                {data.greeting}
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-none gradient-text">
                {data.name}
              </h1>
              <div className="h-10 sm:h-12 flex items-center text-xl sm:text-2xl lg:text-3xl font-medium text-white/90">
                <span className="mr-2">I am a</span>
                <TypingText texts={data.typedTexts} />
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
                {data.buttons.map((btn, idx) => (
                  <a
                    key={idx}
                    href={btn.href}
                    target={btn.href.startsWith("http") ? "_blank" : "_self"}
                    rel={btn.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className={`px-8 py-3.5 text-sm font-semibold tracking-wider rounded-full transition-all duration-300 text-center cursor-pointer ${
                      idx === 0
                        ? "bg-gradient-to-r from-cyan-400 via-indigo-500 to-violet-500 text-white shadow-lg hover:shadow-[0_0_25px_rgba(34,211,238,0.4),0_0_50px_rgba(139,92,246,0.3)] hover:scale-[1.03]"
                        : "bg-white/10 text-white border border-white/20 backdrop-blur-sm hover:bg-white/20 hover:border-white/40"
                    }`}
                  >
                    {btn.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Hero Right Column (Image) - Hidden on Mobile */}
            <div className="hidden md:flex justify-end pr-8">
              <div className="relative w-80 h-80 lg:w-96 lg:h-96">
                {/* Elegant gradient ring border (stationary, never rotates) */}
                <div
                  className="relative w-full h-full rounded-full p-1.5 transition-transform duration-500 hover:scale-[1.02]"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent-from), var(--accent-via), var(--accent-to))',
                  }}
                >
                  {/* Inner image container (fixed upright) */}
                  <div className="relative w-full h-full rounded-full overflow-hidden bg-slate-900 shadow-2xl">
                    <Image
                      src={`/${data.heroImage}`}
                      alt={data.name}
                      fill
                      priority
                      className="object-cover"
                      sizes="(max-width: 1024px) 320px, 384px"
                    />
                  </div>
                </div>

                {/* Glow effect directly behind avatar */}
                <div
                  className="absolute inset-0 rounded-full opacity-40 blur-2xl -z-10"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent-from), var(--accent-to))',
                    animation: 'glow-pulse 4s ease-in-out infinite',
                  }}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
