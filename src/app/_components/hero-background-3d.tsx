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

export interface HeroBackground3DProps {
  className?: string;
  particleCount?: number;
  focalLength?: number;
  maxDistance?: number;
  showPolyhedron?: boolean;
}

export function HeroBackground3D({
  className = "",
  particleCount,
  focalLength = 350,
  maxDistance = 110,
  showPolyhedron = true,
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
    const count = particleCount ?? (isMobile ? 36 : 72);

    // Initialize 3D points
    const points: Point3D[] = [];
    const colors = ["#22d3ee", "#818cf8", "#c084fc", "#38bdf8"];
    const radiusRange = isMobile ? 240 : 360;

    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
      const r = radiusRange * (0.55 + 0.45 * Math.random());

      points.push({
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta) * 0.75,
        z: r * Math.cos(phi),
        baseRadius: Math.random() * 1.5 + 1.2,
        color: colors[i % colors.length],
        vx: 0,
        vy: 0,
        offsetX: 0,
        offsetY: 0,
      });
    }

    // Initialize 3D Icosahedron Vertices & Edges (Golden ratio phi)
    const phiVal = (1 + Math.sqrt(5)) / 2;
    const rawVertices = [
      [-1, phiVal, 0], [1, phiVal, 0], [-1, -phiVal, 0], [1, -phiVal, 0],
      [0, -1, phiVal], [0, 1, phiVal], [0, -1, -phiVal], [0, 1, -phiVal],
      [phiVal, 0, -1], [phiVal, 0, 1], [-phiVal, 0, -1], [-phiVal, 0, 1],
    ];

    // Normalize and scale vertices
    const polyRadius = isMobile ? 120 : 180;
    const normFactor = Math.sqrt(1 + phiVal * phiVal);
    const polyVertices = rawVertices.map(([vx, vy, vz]) => ({
      x: (vx / normFactor) * polyRadius,
      y: (vy / normFactor) * polyRadius,
      z: (vz / normFactor) * polyRadius,
    }));

    // Find edges (pairs where 3D distance is approximately edge length)
    const polyEdges: [number, number][] = [];
    const expectedEdgeDist = (2 / normFactor) * polyRadius;
    const tolerance = 15;

    for (let i = 0; i < polyVertices.length; i++) {
      for (let j = i + 1; j < polyVertices.length; j++) {
        const dx = polyVertices[i].x - polyVertices[j].x;
        const dy = polyVertices[i].y - polyVertices[j].y;
        const dz = polyVertices[i].z - polyVertices[j].z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (Math.abs(dist - expectedEdgeDist) < tolerance) {
          polyEdges.push([i, j]);
        }
      }
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
    let polyRotY = 0;
    let polyRotX = 0;
    let polyRotZ = 0;

    const render = () => {
      if (!ctx || width === 0 || height === 0) return;

      ctx.clearRect(0, 0, width, height);

      // Smooth mouse easing (lerp)
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      if (!prefersReducedMotion) {
        rotY += 0.0016 + currentMouseX * 0.001;
        rotX += 0.0008 + currentMouseY * 0.0008;

        polyRotY += 0.003 + currentMouseX * 0.002;
        polyRotX += 0.002 + currentMouseY * 0.0015;
        polyRotZ += 0.001;
      }

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const centerX = width / 2;
      const centerY = height / 2;

      // Polyhedron center offset: right side behind hero portrait on desktop, center on mobile
      const polyCenterX = isMobile ? width * 0.5 : width * 0.72;
      const polyCenterY = height * 0.48;

      // Project and draw 3D Polyhedron Lattice if enabled
      if (showPolyhedron) {
        const pCosY = Math.cos(polyRotY);
        const pSinY = Math.sin(polyRotY);
        const pCosX = Math.cos(polyRotX);
        const pSinX = Math.sin(polyRotX);
        const pCosZ = Math.cos(polyRotZ);
        const pSinZ = Math.sin(polyRotZ);

        interface ProjectedPolyVertex {
          screenX: number;
          screenY: number;
          scale: number;
          z: number;
        }

        const projPoly: ProjectedPolyVertex[] = [];

        for (let i = 0; i < polyVertices.length; i++) {
          const v = polyVertices[i];

          // 3D rotations: Yaw, Pitch, Roll
          // Rot Z
          const xz = v.x * pCosZ - v.y * pSinZ;
          const yz = v.x * pSinZ + v.y * pCosZ;
          const zz = v.z;

          // Rot Y
          const x1 = xz * pCosY + zz * pSinY;
          const z1 = -xz * pSinY + zz * pCosY;

          // Rot X
          const y2 = yz * pCosX - z1 * pSinX;
          const z2 = yz * pSinX + z1 * pCosX;

          const scale = focalLength / (focalLength + z2 + 300);
          const screenX = polyCenterX + x1 * scale;
          const screenY = polyCenterY + y2 * scale;

          projPoly.push({ screenX, screenY, scale, z: z2 });
        }

        // Draw Polyhedron Wireframe Edges
        ctx.lineWidth = 1.2;
        for (let i = 0; i < polyEdges.length; i++) {
          const [idxA, idxB] = polyEdges[i];
          const ptA = projPoly[idxA];
          const ptB = projPoly[idxB];

          const avgZ = (ptA.z + ptB.z) / 2;
          const depthAlpha = Math.min(Math.max((avgZ + polyRadius) / (polyRadius * 2), 0.1), 0.7) * 0.4;

          ctx.strokeStyle = `rgba(34, 211, 238, ${depthAlpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(ptA.screenX, ptA.screenY);
          ctx.lineTo(ptB.screenX, ptB.screenY);
          ctx.stroke();
        }

        // Draw Polyhedron Vertices (Luminous cyber nodes)
        for (let i = 0; i < projPoly.length; i++) {
          const pt = projPoly[i];
          const nodeAlpha = Math.min(Math.max(pt.scale * 0.8, 0.2), 0.85);

          // Node core
          ctx.fillStyle = "#22d3ee";
          ctx.globalAlpha = nodeAlpha;
          ctx.beginPath();
          ctx.arc(pt.screenX, pt.screenY, Math.max(pt.scale * 2.8, 1.2), 0, Math.PI * 2);
          ctx.fill();

          // Outer halo
          ctx.fillStyle = "#818cf8";
          ctx.globalAlpha = nodeAlpha * 0.35;
          ctx.beginPath();
          ctx.arc(pt.screenX, pt.screenY, Math.max(pt.scale * 5.5, 2.5), 0, Math.PI * 2);
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
          // Current estimated 2D position for proximity check
          const approxScreenX = centerX + p.x + p.offsetX;
          const approxScreenY = centerY + p.y + p.offsetY;
          const dx = approxScreenX - mousePixelX;
          const dy = approxScreenY - mousePixelY;
          const distSq = dx * dx + dy * dy;
          const radiusSq = 160 * 160;

          if (distSq < radiusSq && distSq > 4) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / 160) * 1.8;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        // Spring restitution towards original orbit
        p.offsetX = (p.offsetX + p.vx) * 0.92;
        p.offsetY = (p.offsetY + p.vy) * 0.92;
        p.vx *= 0.86;
        p.vy *= 0.86;

        // Rotate around Y-axis
        const xRot = (p.x + p.offsetX);
        const yRot = (p.y + p.offsetY);
        const zRot = p.z;

        const x1 = xRot * cosY + zRot * sinY;
        const z1 = -xRot * sinY + zRot * cosY;

        // Rotate around X-axis
        const y2 = yRot * cosX - z1 * sinX;
        const z2 = yRot * sinX + z1 * cosX;

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

      // Draw connecting constellation lines
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
            const alpha = (1 - dist3D / maxDistance) * 0.16 * Math.min(p1.scale, p2.scale);
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
        const alpha = Math.min(Math.max((p.scale - 0.2) * 0.85, 0.15), 0.75);

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
      data-testid="hero-background-3d"
      aria-hidden="true"
    />
  );
}
