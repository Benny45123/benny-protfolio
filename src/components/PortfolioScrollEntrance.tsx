"use client";

import React, { useRef, useSyncExternalStore } from "react";
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

  // Kicker badge: glides in from bottom-left with beacon bloom
  const kickerY = useTransform(springProgress, [0, 0.45], [24, 0]);
  const kickerX = useTransform(springProgress, [0, 0.45], [-12, 0]);
  const kickerOpacity = useTransform(springProgress, [0, 0.35], [0.2, 1]);

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
            {/* Kicker Badge */}
            <motion.div
              style={{
                y: useMotion ? kickerY : 0,
                x: useMotion ? kickerX : 0,
                opacity: useMotion ? kickerOpacity : 1,
              }}
              className="flex items-center gap-2.5 mb-2.5"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold">
                Selected Systems
              </span>
            </motion.div>

            {/* Section Masthead: Space Grotesk Bold with dynamic tracking and 3D elevation */}
            <motion.h2
              style={{
                y: useMotion ? titleY : 0,
                rotateX: useMotion ? titleRotateX : 0,
                opacity: useMotion ? titleOpacity : 1,
                letterSpacing: useMotion ? titleTracking : "-0.03em",
                transformOrigin: "center bottom",
              }}
              className="font-space text-4xl sm:text-6xl lg:text-7xl font-bold text-white uppercase leading-[0.95]"
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
