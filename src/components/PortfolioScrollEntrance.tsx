"use client";

import React, { useRef, useSyncExternalStore } from "react";
import { sound } from "@/components/SoundEffects";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";

const subscribeEmpty = () => () => {};
const getMountedSnapshot = () => true;
const getMountedServerSnapshot = () => false;

interface PortfolioScrollEntranceProps {
  children: React.ReactNode;
}

export default function PortfolioScrollEntrance({
  children,
}: PortfolioScrollEntranceProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mounted = useSyncExternalStore(subscribeEmpty, getMountedSnapshot, getMountedServerSnapshot);
  const prefersReducedMotion = useReducedMotion();

  // Scroll offset tracking: triggers when section approaches the lower viewport
  // and smoothly settles as it moves into the focal zone.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.96", "start 0.32"],
  });

  // Spring physics for authentic physical momentum and weighted glide
  const springProgress = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 28,
    mass: 0.5,
  });

  // =========================================================================
  // HEADER KINETIC TRANSFORMS (Swipe-Up on scroll down, Swipe-Down on scroll up)
  // =========================================================================

  // Title "PORTFOLIO": 3D perspective pitch settling, vertical lift, and tracking compression
  const titleY = useTransform(springProgress, [0.08, 0.72], [48, 0]);
  const titleRotateX = useTransform(springProgress, [0.08, 0.72], [10, 0]);
  const titleOpacity = useTransform(springProgress, [0.08, 0.5], [0.25, 1]);
  const titleTracking = useTransform(springProgress, [0.08, 0.72], ["0.05em", "-0.03em"]);

  // Description: staggered upward glide
  const descY = useTransform(springProgress, [0.18, 0.8], [32, 0]);
  const descOpacity = useTransform(springProgress, [0.18, 0.6], [0.2, 1]);

  // Accent divider line: expands horizontally across the section
  const borderScaleX = useTransform(springProgress, [0.15, 0.9], [0, 1]);
  // Comet glow traversing the border line
  const cometX = useTransform(springProgress, [0.15, 0.95], ["-30%", "100%"]);

  // =========================================================================
  // SHOWCASE 3D STAGE ELEVATOR TRANSFORMS (Physical elevator rise & settle)
  // =========================================================================
  const stageY = useTransform(springProgress, [0.25, 1.0], [54, 0]);
  const stageScale = useTransform(springProgress, [0.25, 1.0], [0.965, 1.0]);
  const stageRotateX = useTransform(springProgress, [0.25, 1.0], [5, 0]);
  const stageOpacity = useTransform(springProgress, [0.2, 0.75], [0.35, 1]);

  const useMotion = mounted && !prefersReducedMotion;

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{
        perspective: "1400px",
      }}
    >
      {/* =====================================================================
          HEADER CONTAINER WITH BIDIRECTIONAL SWIPE-UP / SWIPE-DOWN
          ===================================================================== */}
      <div className="relative w-full mb-10 sm:mb-14 select-none">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6">
          <div>
            <motion.h2
              style={{
                y: useMotion ? titleY : 0,
                rotateX: useMotion ? titleRotateX : 0,
                opacity: useMotion ? titleOpacity : 1,
                letterSpacing: useMotion ? titleTracking : "-0.03em",
                transformOrigin: "center bottom",
              }}
              className="font-space text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase leading-[0.95] bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent"
            >
              Portfolio
            </motion.h2>
          </div>

          {/* Editorial Subtext */}
          <motion.div
            style={{
              y: useMotion ? descY : 0,
              opacity: useMotion ? descOpacity : 1,
            }}
            className="max-w-md pb-1"
          >
            <p className="text-sm sm:text-base text-zinc-300 font-sans leading-relaxed">
              Production architectures, agentic pipelines, and distributed media systems engineered for scale.
            </p>
          </motion.div>
        </div>

        {/* Expanding Accent Divider with traversing comet beam */}
        <div className="relative w-full h-[1px] bg-white/[0.08] overflow-hidden">
          <motion.div
            style={{
              scaleX: useMotion ? borderScaleX : 1,
              originX: 0,
            }}
            className="absolute inset-0 h-full bg-gradient-to-r from-amber-400/90 via-amber-300/40 to-white/10"
          />
          {useMotion && (
            <motion.div
              style={{
                x: cometX,
              }}
              className="absolute top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-amber-300 to-transparent blur-[1px] opacity-80 pointer-events-none"
            />
          )}
        </div>

        {/* Subsections Quick Navigator HUD */}
        <div className="mt-6 flex flex-wrap items-center gap-2.5 sm:gap-3 font-mono text-xs">
          <span className="text-[11px] uppercase tracking-wider text-zinc-500 mr-1 hidden sm:inline-block">
            Subsections:
          </span>
          <a
            href="#projects"
            onClick={() => sound.click()}
            onMouseEnter={() => sound.hover()}
            className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] hover:border-amber-400/40 hover:bg-amber-400/10 text-zinc-300 hover:text-amber-300 transition-all cursor-pointer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="font-bold">01</span>
            <span className="text-zinc-600 group-hover:text-amber-400/60">/</span>
            <span>Projects</span>
          </a>

          <a
            href="#skills"
            onClick={() => sound.click()}
            onMouseEnter={() => sound.hover()}
            className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] hover:border-cyan-400/40 hover:bg-cyan-400/10 text-zinc-300 hover:text-cyan-300 transition-all cursor-pointer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="font-bold">02</span>
            <span className="text-zinc-600 group-hover:text-cyan-400/60">/</span>
            <span>Skills</span>
          </a>

          <a
            href="#certifications"
            onClick={() => sound.click()}
            onMouseEnter={() => sound.hover()}
            className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] hover:border-purple-400/40 hover:bg-purple-400/10 text-zinc-300 hover:text-purple-300 transition-all cursor-pointer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span className="font-bold">03</span>
            <span className="text-zinc-600 group-hover:text-purple-400/60">/</span>
            <span>Certifications</span>
          </a>
        </div>
      </div>

      {/* =====================================================================
          FLAGSHIP SHOWCASE STAGE ELEVATOR (Smooth 3D rise & settle)
          ===================================================================== */}
      <motion.div
        style={{
          y: useMotion ? stageY : 0,
          scale: useMotion ? stageScale : 1,
          rotateX: useMotion ? stageRotateX : 0,
          opacity: useMotion ? stageOpacity : 1,
          transformOrigin: "center top",
        }}
        className="mb-20"
      >
        {children}
      </motion.div>
    </div>
  );
}
