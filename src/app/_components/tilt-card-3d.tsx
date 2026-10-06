"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";

export interface TiltCard3DProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  perspective?: number;
  maxTilt?: number;
  scale?: number;
  glare?: boolean;
  glareMaxOpacity?: number;
  disabled?: boolean;
  className?: string;
  role?: string;
  "data-testid"?: string;
}

export function TiltCard3D({
  children,
  perspective = 1000,
  maxTilt = 10,
  scale = 1.02,
  glare = true,
  glareMaxOpacity = 0.15,
  disabled = false,
  className = "",
  style,
  ...restProps
}: TiltCard3DProps): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tiltStyle, setTiltStyle] = useState<{
    transform: string;
    transition: string;
  }>({
    transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
    transition: "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
  });

  const [glarePosition, setGlarePosition] = useState<{
    x: number;
    y: number;
    opacity: number;
  }>({
    x: 50,
    y: 50,
    opacity: 0,
  });

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener?.("change", handleChange);
    return () => {
      mediaQuery.removeEventListener?.("change", handleChange);
    };
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (disabled || prefersReducedMotion || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      if (width === 0 || height === 0) return;

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const xPct = (mouseX / width) * 100;
      const yPct = (mouseY / height) * 100;

      // Normalization from -1 to 1
      const normalizedX = (mouseX / width - 0.5) * 2;
      const normalizedY = (mouseY / height - 0.5) * 2;

      // Calculate tilt angles (rotateX is driven by Y coordinate, rotateY by X coordinate)
      const rotateX = -normalizedY * maxTilt;
      const rotateY = normalizedX * maxTilt;

      setTiltStyle({
        transform: `perspective(${perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`,
        transition: "transform 0.1s ease-out",
      });

      if (glare) {
        setGlarePosition({
          x: xPct,
          y: yPct,
          opacity: glareMaxOpacity,
        });
      }
    },
    [disabled, prefersReducedMotion, maxTilt, perspective, scale, glare, glareMaxOpacity]
  );

  const handlePointerLeave = useCallback(() => {
    if (disabled || prefersReducedMotion) return;

    setTiltStyle({
      transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
      transition: "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
    });

    if (glare) {
      setGlarePosition((prev) => ({
        ...prev,
        opacity: 0,
      }));
    }
  }, [disabled, prefersReducedMotion, perspective, glare]);

  const isMotionDisabled = disabled || prefersReducedMotion;

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`relative [transform-style:preserve-3d] ${className}`}
      style={{
        ...(isMotionDisabled ? {} : { transform: tiltStyle.transform, transition: tiltStyle.transition }),
        ...style,
      }}
      data-testid={restProps["data-testid"] || "tilt-card-3d"}
      {...restProps}
    >
      {children}

      {glare && !isMotionDisabled && (
        <div
          data-testid="tilt-glare"
          className="pointer-events-none absolute inset-0 z-30 rounded-[inherit] overflow-hidden transition-opacity duration-300"
          style={{
            opacity: glarePosition.opacity,
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.35) 0%, rgba(34, 211, 238, 0.15) 30%, transparent 70%)`,
          }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
