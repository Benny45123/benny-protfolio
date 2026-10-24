"use client";

import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { sound } from "@/components/SoundEffects";
import {
  ShieldCheck,
  Cpu,
  Terminal,
  Workflow,
  Sparkles,
  Bot,
} from "lucide-react";

export default function AboutIdCard() {
  const [isFlipped, setIsFlipped] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.92", "center 0.45"],
  });

  // Physical badge settling: gravity drop, subtle pendulum angle, perspective tilt
  const cardY = useTransform(scrollYProgress, [0.0, 0.75], [38, 0]);
  const cardRotateX = useTransform(scrollYProgress, [0.0, 0.75], [8, 0]);
  const cardRotateZ = useTransform(scrollYProgress, [0.0, 0.75], [-2.5, 0]);
  const cardScale = useTransform(scrollYProgress, [0.0, 0.75], [0.94, 1.0]);
  const cardOpacity = useTransform(scrollYProgress, [0.0, 0.35], [0.4, 1.0]);

  // Lanyard clip subtle drop & stretch
  const lanyardY = useTransform(scrollYProgress, [0.0, 0.5], [-10, 0]);
  const lanyardScaleY = useTransform(scrollYProgress, [0.0, 0.5], [0.75, 1.0]);

  // Specular sheen sweep: diagonal light reflection sweeping across the polycarbonate badge
  const sheenX = useTransform(scrollYProgress, [0.15, 0.85], ["-130%", "230%"]);

  const handleCardClick = () => {
    sound.click();
    setIsFlipped((prev) => !prev);
  };

  const handleMouseEnter = () => {
    sound.hover();
    setIsFlipped(true);
  };

  const handleMouseLeave = () => {
    setIsFlipped(false);
  };

  return (
    <div ref={containerRef} className="relative flex flex-col items-center select-none py-2">
      {/* =========================================================================
          LANYARD STRAP & METALLIC CARABINER CLIP
          ========================================================================= */}
      <motion.div
        style={{ y: lanyardY, scaleY: lanyardScaleY, originY: 0 }}
        className="flex flex-col items-center -mb-3 z-30 pointer-events-none"
      >
        {/* Lanyard Fabric Ribbon */}
        <div className="w-6 h-12 bg-gradient-to-b from-[#181a22] to-[#252836] border-x border-amber-400/30 shadow-md relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,#000,#000_2px,transparent_2px,transparent_4px)]" />
          <div className="w-[2px] h-full bg-amber-400/40" />
        </div>

        {/* Metallic Clip Buckle */}
        <div className="w-8 h-4 bg-gradient-to-b from-zinc-300 via-zinc-100 to-zinc-400 rounded-sm shadow-md border border-white/40 flex items-center justify-center">
          <div className="w-4 h-1 bg-zinc-600 rounded-full" />
        </div>

        {/* Silver Swivel Ring Loop Passing Through ID Slot */}
        <div className="w-5 h-5 -mt-1 border-2 border-zinc-300 rounded-full shadow-inner bg-transparent" />
      </motion.div>

      {/* =========================================================================
          3D PERSPECTIVE FLIP CONTAINER WITH SCROLL-DRIVEN MOTION
          ========================================================================= */}
      <motion.div
        style={{
          y: cardY,
          rotateX: cardRotateX,
          rotateZ: cardRotateZ,
          scale: cardScale,
          opacity: cardOpacity,
        }}
        className="relative [perspective:1200px] cursor-pointer group"
        onClick={handleCardClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="relative w-[300px] sm:w-[320px] h-[480px] sm:h-[500px] transition-transform duration-700 ease-out"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* =====================================================================
              CARD FRONT: PROFESSIONAL AI ARCHITECT BADGE
              ===================================================================== */}
          <div
            className={`absolute inset-0 w-full h-full rounded-2xl border border-white/[0.14] bg-[#090a10] shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-5 flex flex-col justify-between overflow-hidden transition-opacity duration-300 ${
              isFlipped ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(0deg)",
              visibility: isFlipped ? "hidden" : "visible",
              transition: isFlipped ? "visibility 0s 0.22s, opacity 0.22s ease" : "visibility 0s 0.22s, opacity 0.22s ease",
            }}
          >
            {/* Specular Polycarbonate Light Sheen Sweep on Scroll */}
            <motion.div
              style={{ x: sheenX }}
              className="absolute inset-y-0 w-3/4 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.12] to-transparent pointer-events-none z-20"
            />

            {/* Ambient Gold & Cyan Edge Sheen */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-[radial-gradient(circle_at_top_right,_rgba(245,158,11,0.18)_0%,_transparent_70%)] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-[radial-gradient(circle_at_bottom_left,_rgba(56,189,248,0.1)_0%,_transparent_70%)] pointer-events-none" />
            <div className="absolute inset-0 subtle-grid opacity-10 pointer-events-none" />

            {/* Top Bar with Lanyard Punch Hole & Monogram */}
            <div className="flex flex-col items-center">
              {/* Oblong Lanyard Punch Hole Cutout */}
              <div className="w-12 h-2.5 rounded-full bg-black/90 border border-white/[0.18] shadow-inner mb-3" />

              <div className="w-full flex items-center justify-between pb-2 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-amber-400/20 border border-amber-400/50 flex items-center justify-center">
                    <span className="font-syne font-black text-[10px] text-amber-400">BB</span>
                  </div>
                  <span className="font-mono text-[10px] tracking-widest text-zinc-300 font-semibold uppercase">
                    DEVELOPER ID
                  </span>
                </div>
                <span className="font-mono text-[10px] text-zinc-400 tracking-wider">
                  PORTFOLIO &bull; 2026
                </span>
              </div>
            </div>

            {/* Center: Framed Studio ID Portrait (Headturn pitch/0001 frame with black background) */}
            <div className="flex flex-col items-center my-auto">
              <div className="relative w-36 h-40 sm:w-40 sm:h-44 rounded-xl overflow-hidden border-2 border-white/[0.18] bg-black shadow-xl group-hover:border-amber-400/50 transition-colors">
                <picture>
                  <source srcSet="/headturn/frames/t1920/pitch/0001.avif" type="image/avif" />
                  <source srcSet="/headturn/frames/t1920/pitch/0001.webp" type="image/webp" />
                  <img
                    src="/headturn/frames/t1920/pitch/0001.avif"
                    alt="Bennyhinn Bezawada ID Portrait"
                    className="w-full h-full object-cover object-top"
                    loading="eager"
                  />
                </picture>
                {/* Subtle glass reflection gradient */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent pointer-events-none" />
              </div>

              {/* Identity Name & Position */}
              <div className="mt-3.5 text-center">
                <h3 className="font-syne text-lg sm:text-xl font-black text-white tracking-wide">
                  BENNYHINN BEZAWADA
                </h3>
                <p className="font-space text-xs text-amber-400 font-semibold tracking-wide mt-0.5">
                  Autonomous AI Systems Architect
                </p>
              </div>
            </div>

            {/* Bottom Meta & Barcode Section */}
            <div className="pt-2 border-t border-white/[0.08]">
              {/* Meta Grid */}
              <div className="grid grid-cols-3 gap-2 text-center pb-2.5">
                <div>
                  <div className="font-mono text-[9px] text-zinc-400 uppercase tracking-wider">ID NO</div>
                  <div className="font-mono text-[11px] font-bold text-zinc-200">BB-234703</div>
                </div>
                <div>
                  <div className="font-mono text-[9px] text-zinc-400 uppercase tracking-wider">DEPT</div>
                  <div className="font-mono text-[11px] font-bold text-zinc-200">AI / Systems</div>
                </div>
                <div>
                  <div className="font-mono text-[9px] text-zinc-400 uppercase tracking-wider">BATCH</div>
                  <div className="font-mono text-[11px] font-bold text-emerald-400">2027</div>
                </div>
              </div>

              {/* Barcode & Hologram Security Seal */}
              <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                {/* Vector Barcode */}
                <div className="flex flex-col items-start gap-1">
                  <div className="flex items-center gap-[2.5px] h-6">
                    <span className="w-[2px] h-full bg-white/80" />
                    <span className="w-[1px] h-full bg-white/80" />
                    <span className="w-[3px] h-full bg-white/80" />
                    <span className="w-[1px] h-full bg-white/80" />
                    <span className="w-[4px] h-full bg-white/80" />
                    <span className="w-[2px] h-full bg-white/80" />
                    <span className="w-[1px] h-full bg-white/80" />
                    <span className="w-[3px] h-full bg-white/80" />
                    <span className="w-[2px] h-full bg-white/80" />
                    <span className="w-[4px] h-full bg-white/80" />
                    <span className="w-[1px] h-full bg-white/80" />
                    <span className="w-[2px] h-full bg-white/80" />
                    <span className="w-[3px] h-full bg-white/80" />
                    <span className="w-[1px] h-full bg-white/80" />
                    <span className="w-[2px] h-full bg-white/80" />
                    <span className="w-[4px] h-full bg-white/80" />
                    <span className="w-[2px] h-full bg-white/80" />
                    <span className="w-[1px] h-full bg-white/80" />
                    <span className="w-[3px] h-full bg-white/80" />
                    <span className="w-[1px] h-full bg-white/80" />
                    <span className="w-[2px] h-full bg-white/80" />
                  </div>
                  <span className="font-mono text-[8px] text-zinc-400 tracking-[0.2em]">
                    * BB-2026-ARCHITECT *
                  </span>
                </div>

                {/* Hologram Iridescent Chip Seal */}
                <div className="relative w-7 h-7 rounded-md bg-gradient-to-tr from-amber-400/40 via-cyan-400/40 to-emerald-400/40 border border-white/30 flex items-center justify-center shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================================
              CARD BACK: "WHAT I AM" / ROLES & ENGINEERING ROLES (FLIPPED 180 DEG)
              ===================================================================== */}
          <div
            className={`absolute inset-0 w-full h-full rounded-2xl border border-white/[0.14] bg-[#090a10] shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-5 flex flex-col justify-between overflow-hidden transition-opacity duration-300 ${
              isFlipped ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              visibility: isFlipped ? "visible" : "hidden",
              transition: isFlipped ? "visibility 0s 0.22s, opacity 0.22s ease" : "visibility 0s 0.22s, opacity 0.22s ease",
            }}
          >
            {/* Specular Polycarbonate Light Sheen Sweep on Scroll */}
            <motion.div
              style={{ x: sheenX }}
              className="absolute inset-y-0 w-3/4 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.12] to-transparent pointer-events-none z-20"
            />

            {/* Ambient Sheen */}
            <div className="absolute top-0 left-0 w-44 h-44 bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.15)_0%,_transparent_70%)] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-44 h-44 bg-[radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.12)_0%,_transparent_70%)] pointer-events-none" />

            {/* Top Lanyard Slot & Header */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-2.5 rounded-full bg-black/90 border border-white/[0.18] shadow-inner mb-3" />

              <div className="w-full flex items-center justify-between pb-2 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-amber-400/20 border border-amber-400/40 flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                  </div>
                  <span className="font-mono text-[10px] tracking-widest text-zinc-300 font-bold uppercase">
                    WHAT I AM
                  </span>
                </div>
                <span className="font-mono text-[9px] text-amber-400 tracking-wider">
                  VERIFIED CLEARANCE
                </span>
              </div>
            </div>

            {/* Middle: 5 Verified Roles with Badges */}
            <div className="space-y-2.5 my-auto">
              {/* Role 1 */}
              <div className="p-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div>
                  <div className="font-space text-xs font-bold text-white">
                    Autonomous AI Systems Architect
                  </div>
                  <div className="font-mono text-[9px] text-zinc-400">
                    LangGraph Swarms &amp; MCP Toolkits
                  </div>
                </div>
              </div>

              {/* Role 2 */}
              <div className="p-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center shrink-0">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div>
                  <div className="font-space text-xs font-bold text-white">
                    High-Concurrency Backend Engineer
                  </div>
                  <div className="font-mono text-[9px] text-zinc-400">
                    FastAPI, AsyncIO &amp; Distributed Queues
                  </div>
                </div>
              </div>

              {/* Role 3 */}
              <div className="p-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-purple-400/10 border border-purple-400/30 flex items-center justify-center shrink-0">
                  <Workflow className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <div>
                  <div className="font-space text-xs font-bold text-white">
                    Real-time Voice Pipeline Engineer
                  </div>
                  <div className="font-mono text-[9px] text-zinc-400">
                    LiveKit, Twilio &amp; Sub-500ms Latency
                  </div>
                </div>
              </div>

              {/* Role 4 */}
              <div className="p-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-blue-400/10 border border-blue-400/30 flex items-center justify-center shrink-0">
                  <Terminal className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div>
                  <div className="font-space text-xs font-bold text-white">
                    Vector &amp; Hybrid Search Architect
                  </div>
                  <div className="font-mono text-[9px] text-zinc-400">
                    Qdrant, BM25 &amp; Cross-Encoder Reranking
                  </div>
                </div>
              </div>

              {/* Role 5 */}
              <div className="p-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div>
                  <div className="font-space text-xs font-bold text-white">
                    Deterministic System Guardian
                  </div>
                  <div className="font-mono text-[9px] text-zinc-400">
                    AP2 Mandates &amp; Merkle Audit Receipts
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Signature & Verification Seal */}
            <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
              <div>
                <div className="font-mono text-[8px] text-zinc-400 uppercase tracking-widest">
                  AUTHORIZED SIGNATURE
                </div>
                <div className="font-syne italic font-bold text-sm text-amber-400 mt-0.5 tracking-wider">
                  Bennyhinn Bezawada
                </div>
              </div>

              <div className="text-right font-mono text-[8px] text-zinc-400">
                <div className="text-emerald-400 font-semibold">&bull; SECURITY ACTIVE</div>
                <div>LEVEL-01 CLEARANCE</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
