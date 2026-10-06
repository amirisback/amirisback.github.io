"use client";

import { useState } from "react";
import Image from "next/image";

export interface ProjectThumbnailProps {
  title: string;
  thumbnail?: string;
  icon: string;
  badge?: string;
}

export function ProjectThumbnail({
  title,
  thumbnail,
  icon,
  badge,
}: ProjectThumbnailProps) {
  const [hasError, setHasError] = useState(false);

  const showImage = Boolean(thumbnail && !hasError);

  return (
    <div
      className="relative w-full aspect-video rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/60 dark:border-zinc-700/50 mb-5 flex flex-col justify-between group-hover:border-cyan-500/40 transition-colors"
      data-testid="project-thumbnail"
    >
      {/* Browser Chrome Header */}
      <div className="h-6 px-3 bg-zinc-100/90 dark:bg-zinc-800/90 border-b border-zinc-200/50 dark:border-zinc-700/50 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-1.5" aria-hidden="true">
          <span className="w-2 h-2 rounded-full bg-red-400/80" />
          <span className="w-2 h-2 rounded-full bg-amber-400/80" />
          <span className="w-2 h-2 rounded-full bg-emerald-400/80" />
        </div>
        {badge && (
          <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
            {badge}
          </span>
        )}
      </div>

      {/* Content Canvas */}
      {showImage && thumbnail ? (
        <div className="relative w-full flex-1 overflow-hidden bg-zinc-200/40 dark:bg-zinc-900/60">
          <Image
            src={thumbnail}
            alt={`Preview ${title}`}
            fill
            unoptimized
            onError={() => setHasError(true)}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-zinc-100/70 via-white to-zinc-100/70 dark:from-zinc-900/80 dark:via-zinc-800/40 dark:to-zinc-900/80">
          <div className="w-11 h-11 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shadow-xs">
            <i className={`${icon} text-lg`} />
          </div>
        </div>
      )}
    </div>
  );
}
