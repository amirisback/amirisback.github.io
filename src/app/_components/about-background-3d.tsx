"use client";

import React, { useRef, useEffect } from "react";

interface Point3D {
  x: number;
  y: number;
  z: number;
  baseRadius: number;
  color: string;
  vx: number;
  vy: number;
  offsetX: number;
  offsetY: number;
}

export interface AboutBackground3DProps {
  className?: string;
  particleCount?: number;
  focalLength?: number;
  maxDistance?: number;
  showPolyhedron?: boolean;
}

export function AboutBackground3D({
  className = "",
  particleCount,
  focalLength = 380,
  maxDistance = 120,
  showPolyhedron = true,
}: AboutBackground3DProps): React.JSX.Element {
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
    let mousePixelX = -9999;
    let mousePixelY = -9999;

    const handlePointerMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      targetMouseX = (e.clientX / innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / innerHeight - 0.5) * 2;

      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        mousePixelX = e.clientX - rect.left;
        mousePixelY = e.clientY - rect.top;
      }
    };

    const handlePointerLeave = () => {
      mousePixelX = -9999;
      mousePixelY = -9999;
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("mouseleave", handlePointerLeave, { passive: true });

    // Responsive particle count & settings
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const count = particleCount ?? (isMobile ? 32 : 64);

    // Initialize 3D points (Luxury platinum amber + cyan palette)
    const points: Point3D[] = [];
    const colors = ["#22d3ee", "#fbbf24", "#818cf8", "#38bdf8", "#f59e0b"];
    const radiusRange = isMobile ? 220 : 340;

    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
      const r = radiusRange * (0.55 + 0.45 * Math.random());

      points.push({
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta) * 0.8,
        z: r * Math.cos(phi),
        baseRadius: Math.random() * 1.6 + 1.1,
        color: colors[i % colors.length],
        vx: 0,
        vy: 0,
        offsetX: 0,
        offsetY: 0,
      });
    }

    // 3D Octahedron / Stella Octangula Vertices & Edges (Geometric spatial lattice)
    const octRadius = isMobile ? 110 : 160;
    const rawOctVertices = [
      [octRadius, 0, 0],
      [-octRadius, 0, 0],
      [0, octRadius, 0],
      [0, -octRadius, 0],
      [0, 0, octRadius],
      [0, 0, -octRadius],
    ];

    const octEdges: [number, number][] = [
      [0, 2], [0, 3], [0, 4], [0, 5],
      [1, 2], [1, 3], [1, 4], [1, 5],
      [2, 4], [4, 3], [3, 5], [5, 2],
    ];

    // Inner nested octahedron for luxury multi-tier lattice
    const innerRadius = octRadius * 0.55;
    const innerVertices = [
      [innerRadius, 0, 0],
      [-innerRadius, 0, 0],
      [0, innerRadius, 0],
      [0, -innerRadius, 0],
      [0, 0, innerRadius],
      [0, 0, -innerRadius],
    ];

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
    let polyRotY = 0;
    let polyRotX = 0;
    let polyRotZ = 0;

    const render = () => {
      if (!ctx || width === 0 || height === 0) return;

      ctx.clearRect(0, 0, width, height);

      // Smooth mouse easing (lerp)
      currentMouseX += (targetMouseX - currentMouseX) * 0.04;
      currentMouseY += (targetMouseY - currentMouseY) * 0.04;

      if (!prefersReducedMotion) {
        rotY += 0.0014 + currentMouseX * 0.001;
        rotX += 0.0006 + currentMouseY * 0.0006;

        polyRotY += 0.0028 + currentMouseX * 0.002;
        polyRotX += 0.0018 + currentMouseY * 0.0012;
        polyRotZ += 0.0012;
      }

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const centerX = width / 2;
      const centerY = height / 2;

      // Position geometric polyhedron behind portrait area on desktop, center on mobile
      const polyCenterX = isMobile ? width * 0.5 : width * 0.22;
      const polyCenterY = isMobile ? height * 0.22 : height * 0.42;

      // Project and draw 3D Polyhedron Lattice if enabled
      if (showPolyhedron) {
        const pCosY = Math.cos(polyRotY);
        const pSinY = Math.sin(polyRotY);
        const pCosX = Math.cos(polyRotX);
        const pSinX = Math.sin(polyRotX);
        const pCosZ = Math.cos(polyRotZ);
        const pSinZ = Math.sin(polyRotZ);

        interface ProjectedNode {
          screenX: number;
          screenY: number;
          scale: number;
          z: number;
        }

        const projectCoords = (vertices: number[][]): ProjectedNode[] => {
          const res: ProjectedNode[] = [];
          for (let i = 0; i < vertices.length; i++) {
            const [vx, vy, vz] = vertices[i];

            // 3D rotations: Yaw, Pitch, Roll
            const xz = vx * pCosZ - vy * pSinZ;
            const yz = vx * pSinZ + vy * pCosZ;
            const zz = vz;

            const x1 = xz * pCosY + zz * pSinY;
            const z1 = -xz * pSinY + zz * pCosY;

            const y2 = yz * pCosX - z1 * pSinX;
            const z2 = yz * pSinX + z1 * pCosX;

            const scale = focalLength / (focalLength + z2 + 320);
            const screenX = polyCenterX + x1 * scale;
            const screenY = polyCenterY + y2 * scale;

            res.push({ screenX, screenY, scale, z: z2 });
          }
          return res;
        };

        const projOuter = projectCoords(rawOctVertices);
        const projInner = projectCoords(innerVertices);

        // Draw Outer Octahedron Edges (Gold/Cyan hybrid)
        ctx.lineWidth = 1.2;
        for (let i = 0; i < octEdges.length; i++) {
          const [idxA, idxB] = octEdges[i];
          const ptA = projOuter[idxA];
          const ptB = projOuter[idxB];

          const avgZ = (ptA.z + ptB.z) / 2;
          const depthAlpha = Math.min(Math.max((avgZ + octRadius) / (octRadius * 2), 0.1), 0.7) * 0.35;

          ctx.strokeStyle = `rgba(251, 191, 36, ${depthAlpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(ptA.screenX, ptA.screenY);
          ctx.lineTo(ptB.screenX, ptB.screenY);
          ctx.stroke();
        }

        // Draw Inner Octahedron Edges (Cyan)
        ctx.lineWidth = 0.9;
        for (let i = 0; i < octEdges.length; i++) {
          const [idxA, idxB] = octEdges[i];
          const ptA = projInner[idxA];
          const ptB = projInner[idxB];

          const avgZ = (ptA.z + ptB.z) / 2;
          const depthAlpha = Math.min(Math.max((avgZ + innerRadius) / (innerRadius * 2), 0.08), 0.6) * 0.28;

          ctx.strokeStyle = `rgba(34, 211, 238, ${depthAlpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(ptA.screenX, ptA.screenY);
          ctx.lineTo(ptB.screenX, ptB.screenY);
          ctx.stroke();
        }

        // Connect outer to inner vertices for hyper-dimensional architectural lattice
        ctx.lineWidth = 0.6;
        for (let i = 0; i < projOuter.length; i++) {
          const ptA = projOuter[i];
          const ptB = projInner[i];
          ctx.strokeStyle = "rgba(129, 140, 248, 0.15)";
          ctx.beginPath();
          ctx.moveTo(ptA.screenX, ptA.screenY);
          ctx.lineTo(ptB.screenX, ptB.screenY);
          ctx.stroke();
        }

        // Draw Polyhedron Vertices
        for (let i = 0; i < projOuter.length; i++) {
          const pt = projOuter[i];
          const nodeAlpha = Math.min(Math.max(pt.scale * 0.75, 0.2), 0.8);

          ctx.fillStyle = "#fbbf24";
          ctx.globalAlpha = nodeAlpha;
          ctx.beginPath();
          ctx.arc(pt.screenX, pt.screenY, Math.max(pt.scale * 2.4, 1.2), 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#22d3ee";
          ctx.globalAlpha = nodeAlpha * 0.3;
          ctx.beginPath();
          ctx.arc(pt.screenX, pt.screenY, Math.max(pt.scale * 5, 2.2), 0, Math.PI * 2);
          ctx.fill();
        }
      }

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

        // Magnetic mouse ripple physics
        if (!prefersReducedMotion && mousePixelX > -9000) {
          const approxScreenX = centerX + p.x + p.offsetX;
          const approxScreenY = centerY + p.y + p.offsetY;
          const dx = approxScreenX - mousePixelX;
          const dy = approxScreenY - mousePixelY;
          const distSq = dx * dx + dy * dy;
          const radiusSq = 150 * 150;

          if (distSq < radiusSq && distSq > 4) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / 150) * 1.5;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        p.offsetX = (p.offsetX + p.vx) * 0.92;
        p.offsetY = (p.offsetY + p.vy) * 0.92;
        p.vx *= 0.86;
        p.vy *= 0.86;

        // Rotate points in 3D
        const xRot = p.x + p.offsetX;
        const yRot = p.y + p.offsetY;
        const zRot = p.z;

        const x1 = xRot * cosY + zRot * sinY;
        const z1 = -xRot * sinY + zRot * cosY;

        const y2 = yRot * cosX - z1 * sinX;
        const z2 = yRot * sinX + z1 * cosX;

        const scale = focalLength / (focalLength + z2 + 360);
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

      // Draw constellation connecting lines
      ctx.lineWidth = 0.9;
      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        for (let j = i + 1; j < projected.length; j++) {
          const p2 = projected[j];

          const dx = p1.orig.x - p2.orig.x;
          const dy = p1.orig.y - p2.orig.y;
          const dz = p1.orig.z - p2.orig.z;
          const dist3D = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist3D < maxDistance) {
            const alpha = (1 - dist3D / maxDistance) * 0.14 * Math.min(p1.scale, p2.scale);
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

      // Draw particle dots
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        const alpha = Math.min(Math.max((p.scale - 0.2) * 0.8, 0.12), 0.7);

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
      window.removeEventListener("mouseleave", handlePointerLeave);
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener("resize", updateSize);
      }
    };
  }, [particleCount, focalLength, maxDistance, showPolyhedron]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 w-full h-full ${className}`}
      data-testid="about-background-3d"
      aria-hidden="true"
    />
  );
}
