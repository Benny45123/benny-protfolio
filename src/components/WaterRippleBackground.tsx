"use client";

import React, { useEffect, useRef } from "react";

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  speed: number;
  alpha: number;
  color: string;
}

interface WavePoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  maxAge: number;
}

export default function WaterRippleBackground({
  excludeId = "hero-character-stage",
}: {
  excludeId?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ripplesRef = useRef<Ripple[]>([]);
  const trailRef = useRef<WavePoint[]>([]);
  const lastMousePos = useRef<{ x: number; y: number } | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const isInsideExcluded = (e: MouseEvent | PointerEvent) => {
      const el = document.getElementById(excludeId);
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      return (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      );
    };

    // On Click: trigger expanding fluid water ripple (if outside character)
    const handlePointerDown = (e: PointerEvent) => {
      if (isInsideExcluded(e)) return;

      const rippleCount = 3;
      for (let i = 0; i < rippleCount; i++) {
        ripplesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          radius: i * 16,
          maxRadius: 260 + i * 40,
          speed: 3.5 + i * 0.8,
          alpha: 0.65 - i * 0.15,
          color: i % 2 === 0 ? "245, 158, 11" : "251, 191, 36", // Warm amber & gold
        });
      }
      startLoop();
    };

    // On Move: leave subtle water-like wave curves along cursor trajectory
    let moveThrottle = 0;
    const handlePointerMove = (e: PointerEvent) => {
      if (isInsideExcluded(e)) {
        lastMousePos.current = null;
        return;
      }

      moveThrottle++;
      if (moveThrottle % 2 !== 0) return;

      const x = e.clientX;
      const y = e.clientY;

      if (lastMousePos.current) {
        const dx = x - lastMousePos.current.x;
        const dy = y - lastMousePos.current.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 8) {
          trailRef.current.push({
            x,
            y,
            vx: -dy * 0.08,
            vy: dx * 0.08,
            age: 0,
            maxAge: 40,
          });
          if (trailRef.current.length > 50) {
            trailRef.current.shift();
          }
          startLoop();
        }
      }
      lastMousePos.current = { x, y };
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const ripples = ripplesRef.current;
      const trail = trailRef.current;

      // 1. Draw Water Ripple Waves
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += r.speed;
        r.alpha *= 0.96;

        if (r.radius >= r.maxRadius || r.alpha <= 0.01) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${r.color}, ${r.alpha})`;
        ctx.lineWidth = Math.max(1, 2.5 * (1 - r.radius / r.maxRadius));
        ctx.stroke();

        // Secondary subtle inner shimmer wave
        if (r.radius > 30) {
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius * 0.75, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 255, 255, ${r.alpha * 0.35})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        ctx.restore();
      }

      // 2. Draw Fluid Curves along Cursor Movement
      if (trail.length > 2) {
        ctx.save();
        ctx.beginPath();
        for (let i = 0; i < trail.length; i++) {
          const pt = trail[i];
          pt.age++;
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.vx *= 0.94;
          pt.vy *= 0.94;

          if (i === 0) {
            ctx.moveTo(pt.x, pt.y);
          } else {
            const prev = trail[i - 1];
            const mx = (prev.x + pt.x) / 2;
            const my = (prev.y + pt.y) / 2;
            ctx.quadraticCurveTo(prev.x, prev.y, mx, my);
          }
        }

        const avgLife = trail.reduce((acc, p) => acc + (1 - p.age / p.maxAge), 0) / trail.length;
        ctx.strokeStyle = `rgba(245, 158, 11, ${Math.max(0, avgLife * 0.28)})`;
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
        ctx.restore();

        // Prune old trail points
        trailRef.current = trail.filter((p) => p.age < p.maxAge);
      }

      if (ripples.length > 0 || trail.length > 0) {
        animFrameRef.current = requestAnimationFrame(render);
      } else {
        animFrameRef.current = null;
      }
    };

    const startLoop = () => {
      if (!animFrameRef.current) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [excludeId]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
