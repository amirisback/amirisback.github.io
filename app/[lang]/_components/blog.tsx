import Image from "next/image";
import { ScrollReveal } from "./scroll-reveal";

interface BlogPost {
  image: string;
  title: string;
  author: string;
  category: string;
  date: string;
  comments: number;
  excerpt: string;
  url: string;
  delay: string;
}

interface BlogProps {
  data: {
    posts: BlogPost[];
  };
  dict: {
    blog: {
      sectionLabel: string;
      sectionTitle: string;
      readMore: string;
    };
  };
}

export function Blog({ data, dict }: BlogProps) {
  return (
    <section id="blog" className="py-20 bg-zinc-50 dark:bg-zinc-900" data-testid="blog">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col items-center">
          <div className="flex items-center space-x-3 mb-2">
            <span className="h-[2px] w-8 bg-[#2e3d48] dark:bg-cyan-400" />
            <span className="text-sm font-bold uppercase tracking-wider text-[#2e3d48] dark:text-cyan-400">
              {dict.blog.sectionLabel}
            </span>
            <span className="h-[2px] w-8 bg-[#2e3d48] dark:bg-cyan-400" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-800 dark:text-white leading-tight">
            {dict.blog.sectionTitle}
          </h2>
        </div>

        {/* Blog Post List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {data.posts.map((post, idx) => (
            <ScrollReveal
              key={idx}
              delay={post.delay}
              direction="up"
              className="h-full"
            >
              <div className="h-full flex flex-col md:flex-row bg-white dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm hover:shadow-lg transition-shadow duration-300 rounded-lg overflow-hidden group">
                {/* Image Section */}
                <div className="relative w-full md:w-48 h-48 md:h-auto shrink-0 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 192px"
                  />
                </div>

                {/* Content Section */}
                <div className="p-6 md:p-8 flex flex-col justify-between flex-1">
                  <div className="space-y-3">
                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                      <span className="flex items-center">
                        <i className="far fa-user mr-1 text-[#2e3d48] dark:text-cyan-400" />
                        {post.author}
                      </span>
                      <span className="flex items-center">
                        <i className="far fa-list-alt mr-1 text-[#2e3d48] dark:text-cyan-400" />
                        {post.category}
                      </span>
                      <span className="flex items-center">
                        <i className="far fa-calendar-alt mr-1 text-[#2e3d48] dark:text-cyan-400" />
                        {post.date}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg md:text-xl font-bold text-zinc-800 dark:text-white leading-snug group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Read More Button */}
                  <div className="pt-6">
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-semibold text-[#2e3d48] dark:text-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors cursor-pointer group/btn"
                    >
                      <span>{dict.blog.readMore}</span>
                      <i className="fas fa-angle-right ml-2 text-xs transition-transform group-hover/btn:translate-x-1" />
                    </a>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
