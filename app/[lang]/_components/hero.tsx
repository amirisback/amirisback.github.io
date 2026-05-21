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
      className="relative w-full overflow-hidden bg-[#2e3d48] text-white min-h-screen flex items-center pt-20"
      data-testid="hero"
    >
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
          <div className="absolute inset-0 bg-[#2e3d48]/75 z-10" />
        </>
      )}

      {/* Main Content Container */}
      <div className="relative max-w-7xl mx-auto px-6 md:px-12 w-full z-20 py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Hero Left Column (Content) */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-6">
            <p className="text-xl md:text-2xl font-semibold tracking-wide text-zinc-300">
              {data.greeting}
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-none text-white">
              {data.name}
            </h1>
            <div className="h-10 sm:h-12 flex items-center text-xl sm:text-2xl lg:text-3xl font-medium text-zinc-100">
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
                  className={`px-8 py-3.5 text-sm font-semibold tracking-wider rounded-sm transition-all duration-300 text-center cursor-pointer ${
                    idx === 0
                      ? "bg-white text-[#2e3d48] border-2 border-white hover:bg-transparent hover:text-white"
                      : "bg-transparent text-white border-2 border-white hover:bg-white hover:text-[#2e3d48]"
                  }`}
                >
                  {btn.label}
                </a>
              ))}
            </div>
          </div>

          {/* Hero Right Column (Image) - Hidden on Mobile */}
          <div className="hidden md:flex justify-end pr-8">
            <div className="relative w-80 h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-white/20 bg-white/5 backdrop-blur-sm shadow-2xl">
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
        </div>
      </div>
    </section>
  );
}
