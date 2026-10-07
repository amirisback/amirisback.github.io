"use client";

import { useState } from "react";
import Image from "next/image";

export interface ProjectThumbnailProps {
  title: string;
  thumbnail?: string;
  icon: string;
  badge?: string;
  url?: string;
  variant?: "standard" | "featured";
}

export function ProjectThumbnail({
  title,
  thumbnail,
  icon,
  badge,
  url,
  variant = "standard",
}: ProjectThumbnailProps) {
  const [hasError, setHasError] = useState(false);

  const showImage = Boolean(thumbnail && !hasError);
  const isFeatured = variant === "featured";

  const cleanUrl = url ? url.replace(/^https?:\/\//, "").replace(/\/$/, "") : "";

  return (
    <div
      className={`relative w-full aspect-video rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800/80 border transition-all duration-300 flex flex-col justify-between ${
        isFeatured
          ? "mb-6 border-zinc-200/90 dark:border-zinc-700/80 shadow-md group-hover:border-cyan-500/60 dark:group-hover:border-cyan-400/50 group-hover:shadow-xl group-hover:shadow-cyan-500/10"
          : "mb-5 border-zinc-200/60 dark:border-zinc-700/50 group-hover:border-cyan-500/40"
      }`}
      data-testid="project-thumbnail"
    >
      {/* Browser Chrome Header */}
      <div
        className={`${
          isFeatured ? "h-8 px-3.5 bg-zinc-150/90 dark:bg-zinc-850/90" : "h-6 px-3 bg-zinc-100/90 dark:bg-zinc-800/90"
        } border-b border-zinc-200/60 dark:border-zinc-700/60 flex items-center justify-between shrink-0 select-none`}
      >
        <div className="flex items-center space-x-1.5" aria-hidden="true">
          <span className={`${isFeatured ? "w-2.5 h-2.5" : "w-2 h-2"} rounded-full bg-red-400/80`} />
          <span className={`${isFeatured ? "w-2.5 h-2.5" : "w-2 h-2"} rounded-full bg-amber-400/80`} />
          <span className={`${isFeatured ? "w-2.5 h-2.5" : "w-2 h-2"} rounded-full bg-emerald-400/80`} />
        </div>

        {/* Faux URL pill for featured variant */}
        {isFeatured && cleanUrl && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-zinc-200/50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-700/50 text-[11px] text-zinc-600 dark:text-zinc-400 font-mono max-w-[240px] truncate">
            <i className="fas fa-lock text-[9px] text-emerald-500 dark:text-emerald-400" />
            <span className="truncate">{cleanUrl}</span>
          </div>
        )}

        {badge && (
          <span
            className={`font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 ${
              isFeatured ? "text-[11px]" : "text-[10px]"
            }`}
          >
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
            sizes={isFeatured ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-zinc-100/70 via-white to-zinc-100/70 dark:from-zinc-900/80 dark:via-zinc-800/40 dark:to-zinc-900/80">
          <div
            className={`rounded-2xl bg-cyan-500/10 dark:bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shadow-xs ${
              isFeatured ? "w-16 h-16" : "w-11 h-11"
            }`}
          >
            <i className={`${icon} ${isFeatured ? "text-2xl" : "text-lg"}`} />
          </div>
          {isFeatured && (
            <p className="mt-3 text-xs font-medium text-zinc-500 dark:text-zinc-400 tracking-wide">
              {title}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
