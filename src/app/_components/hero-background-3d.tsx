"use client";

import React, { useRef, useEffect } from "react";

interface Point3D {
  x: number;
  y: number;
  z: number;
  baseRadius: number;
  color: string;
}

export interface HeroBackground3DProps {
  className?: string;
  particleCount?: number;
  focalLength?: number;
  maxDistance?: number;
}

export function HeroBackground3D({
  className = "",
  particleCount,
  focalLength = 350,
  maxDistance = 110,
}: HeroBackground3DProps): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Check reduced motion preference
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Mouse coordinates tracking
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      targetMouseX = (e.clientX / innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / innerHeight - 0.5) * 2;
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });

    // Responsive particle count
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const count = particleCount ?? (isMobile ? 32 : 64);

    // Initialize 3D points
    const points: Point3D[] = [];
    const colors = ["#22d3ee", "#818cf8", "#c084fc", "#38bdf8"];
    const radiusRange = isMobile ? 220 : 320;

    for (let i = 0; i < count; i++) {
      // Golden spiral distribution on sphere with depth variation
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
      const r = radiusRange * (0.6 + 0.4 * Math.random());

      points.push({
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta) * 0.7, // Slightly flattened ellipsoid
        z: r * Math.cos(phi),
        baseRadius: Math.random() * 1.5 + 1.2,
        color: colors[i % colors.length],
      });
    }

    // Resize handler
    const updateSize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    updateSize();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        updateSize();
      });
      resizeObserver.observe(canvas);
    } else {
      window.addEventListener("resize", updateSize);
    }

    let rotY = 0;
    let rotX = 0;

    const render = () => {
      if (!ctx || width === 0 || height === 0) return;

      ctx.clearRect(0, 0, width, height);

      // Smooth mouse easing (lerp)
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      if (!prefersReducedMotion) {
        rotY += 0.0015 + currentMouseX * 0.001;
        rotX += 0.0008 + currentMouseY * 0.0008;
      }

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const centerX = width / 2;
      const centerY = height / 2;

      // Project 3D points
      interface ProjectedPoint {
        screenX: number;
        screenY: number;
        scale: number;
        radius: number;
        color: string;
        z: number;
        orig: Point3D;
      }

      const projected: ProjectedPoint[] = [];

      for (let i = 0; i < points.length; i++) {
        const p = points[i];

        // Rotate around Y-axis
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;

        // Rotate around X-axis
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;

        // Perspective division
        const scale = focalLength / (focalLength + z2 + 350);
        if (scale <= 0) continue;

        const screenX = centerX + x1 * scale;
        const screenY = centerY + y2 * scale;

        projected.push({
          screenX,
          screenY,
          scale,
          radius: p.baseRadius * scale,
          color: p.color,
          z: z2,
          orig: p,
        });
      }

      // Draw connecting lines between close points
      ctx.lineWidth = 1;
      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        for (let j = i + 1; j < projected.length; j++) {
          const p2 = projected[j];

          const dx = p1.orig.x - p2.orig.x;
          const dy = p1.orig.y - p2.orig.y;
          const dz = p1.orig.z - p2.orig.z;
          const dist3D = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist3D < maxDistance) {
            const alpha = (1 - dist3D / maxDistance) * 0.15 * Math.min(p1.scale, p2.scale);
            if (alpha > 0.01) {
              ctx.strokeStyle = `rgba(34, 211, 238, ${alpha.toFixed(3)})`;
              ctx.beginPath();
              ctx.moveTo(p1.screenX, p1.screenY);
              ctx.lineTo(p2.screenX, p2.screenY);
              ctx.stroke();
            }
          }
        }
      }

      // Draw particle nodes
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        const alpha = Math.min(Math.max((p.scale - 0.2) * 0.8, 0.15), 0.7);

        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(p.screenX, p.screenY, Math.max(p.radius, 0.8), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handlePointerMove);
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener("resize", updateSize);
      }
    };
  }, [particleCount, focalLength, maxDistance]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 w-full h-full ${className}`}
      data-testid="hero-background-3d"
      aria-hidden="true"
    />
  );
}
