"use client";

import React, { useState, useRef, useEffect, useCallback, useSyncExternalStore } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { sound } from "@/components/SoundEffects";
import {
  Workflow,
  Cpu,
  Film,
  Layers,
  CheckCircle2,
  ZoomIn,
  X,
  Terminal,
  ChevronLeft,
  ChevronRight,
  Scan,
  Sliders,
} from "lucide-react";

export interface AgenticVideoPipelineShowcaseProps {
  photoSrc?: string;
  infographicSrc?: string;
  className?: string;
}

interface PipelineStage {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  telemetry: {
    label: string;
    value: string;
    subtext: string;
    metricLabel: string;
    metricValue: string;
  };
  highlights: string[];
  technologies: string[];
}

const STAGES: PipelineStage[] = [
  {
    id: "orchestration",
    index: "01",
    title: "ORCHESTRATION",
    subtitle: "Multi-Agent Workflow Coordination",
    description:
      "LangGraph coordinates the multi-stage production workflow, managing stateful graph transitions, quality checks, and prompt preparation. FastAPI handles high-throughput asynchronous backend coordination.",
    badge: "WORKFLOW ENGINE",
    icon: Workflow,
    accentColor: "#f59e0b",
    telemetry: {
      label: "ORCHESTRATOR",
      value: "LangGraph StateGraph, FastAPI",
      subtext: "Supabase State Checkpoints",
      metricLabel: "STATE INTEGRITY",
      metricValue: "Automated Checkpoints",
    },
    highlights: [
      "Story development and script breakdown",
      "Deterministic prompt preparation and validation",
      "Stateful checkpointing and retry mechanisms",
    ],
    technologies: ["Python", "FastAPI", "LangGraph", "Supabase", "MCP", "LiteLLM"],
  },
  {
    id: "inference",
    index: "02",
    title: "VIDEO INFERENCE",
    subtitle: "Headless Diffusion Execution",
    description:
      "ComfyUI executes the Wan 2.2 video generation workflow within a remote GPU runtime environment. Graph inputs are delivered programmatically, with automated model routing and fallback handling.",
    badge: "GPU WORKFLOW",
    icon: Cpu,
    accentColor: "#06b6d4",
    telemetry: {
      label: "DIFFUSION MODEL",
      value: "Wan 2.2 on ComfyUI Headless",
      subtext: "Remote GPU Runtime Environment",
      metricLabel: "INFERENCE VRAM",
      metricValue: "24GB FP8 Optimized",
    },
    highlights: [
      "Wan 2.2 diffusion video generation",
      "Headless ComfyUI node graph execution",
      "Model-provider fallback routing",
    ],
    technologies: ["Wan 2.2", "ComfyUI", "Kaggle GPU", "Python AsyncIO"],
  },
  {
    id: "assembly",
    index: "03",
    title: "ASSEMBLY & DELIVERY",
    subtitle: "Automated Video Mastering",
    description:
      "Generated video segments (multiple ~10-second clips) are automatically combined and mastered using FFmpeg recipes into an assembled ~60-second narrative sequence ready for final distribution.",
    badge: "MEDIA PIPELINE",
    icon: Film,
    accentColor: "#10b981",
    telemetry: {
      label: "ASSEMBLY",
      value: "FFmpeg Multi-Clip Concatenation",
      subtext: "Automated Pipeline Delivery Hooks",
      metricLabel: "STREAM OUTPUT",
      metricValue: "H.264 AAC Master",
    },
    highlights: [
      "Automated multi-clip concatenation",
      "Streamable H.264 and AAC mastering",
      "Automated delivery verification hooks",
    ],
    technologies: ["FFmpeg", "H.264 / MP4", "Stream Packaging", "Delivery Webhooks"],
  },
  {
    id: "blueprint",
    index: "04",
    title: "ARCHITECTURE BLUEPRINT",
    subtitle: "End-to-End Pipeline Schematic",
    description:
      "Complete visual architecture map connecting user story prompts, LangGraph planning nodes, ComfyUI Wan 2.2 generation, automated QA gates, FFmpeg stitching, and cloud delivery.",
    badge: "SYSTEM SCHEMATIC",
    icon: Layers,
    accentColor: "#f59e0b",
    telemetry: {
      label: "BLUEPRINT",
      value: "Full Pipeline Visual Architecture",
      subtext: "Inspect High-Resolution Schematic",
      metricLabel: "SWARM TOPOLOGY",
      metricValue: "4 Core Subsystem Nodes",
    },
    highlights: [
      "Complete node graph visualization",
      "State preservation & error recovery",
      "Interactive high-resolution inspection",
    ],
    technologies: ["FastAPI", "LangGraph", "ComfyUI", "Wan 2.2", "FFmpeg"],
  },
];

const subscribeResize = (callback: () => void) => {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
};
const getDesktopSnapshot = () => window.innerWidth >= 1024;
const getDesktopServerSnapshot = () => false;

const subscribeEmpty = () => () => {};
const getMountedSnapshot = () => true;
const getMountedServerSnapshot = () => false;

export default function AgenticVideoPipelineShowcase({
  photoSrc,
  infographicSrc = "/assets/character/AI Video Pipeline Infographic.png",
  className = "",
}: AgenticVideoPipelineShowcaseProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const mounted = useSyncExternalStore(subscribeEmpty, getMountedSnapshot, getMountedServerSnapshot);
  const isDesktop = useSyncExternalStore(subscribeResize, getDesktopSnapshot, getDesktopServerSnapshot);
  const prefersReducedMotion = useReducedMotion();

  // Active Stage & Lightbox State
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [showInfographicModal, setShowInfographicModal] = useState<boolean>(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // 3D Spatial Interactive States
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isExploded, setIsExploded] = useState<boolean>(false);
  const [isScanlineActive, setIsScanlineActive] = useState<boolean>(true);

  // SCROLL-DRIVEN HORIZONTAL STAGE TRANSLATION
  // COVER RUNWAY: the pin (lg:min-h-[350vh]) reserves its first window for the
  // staged horizontal journey and its lower third as the cover runway. Every
  // journey mapping below reads `journeyProgress` — the pin progress normalized
  // to [0.04, 0.63] — so all four stages complete and the world rests on 04
  // BEFORE the Agentic Merchant OS plane's leading edge arrives (~65% of the
  // same progress). The plane then glides across the remaining runway and pins
  // over this world, while coverProgress (below) recedes this one for depth.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80px", "end end"],
  });
  const journeyProgress = useTransform(scrollYProgress, [0.04, 0.63], [0, 1]);

  const rawXNum = useTransform(
    journeyProgress,
    [0, 0.12, 0.36, 0.44, 0.68, 0.76, 0.94, 1.0],
    [0, 0, -25, -25, -50, -50, -75, -75]
  );
  const smoothXNum = useSpring(rawXNum, { stiffness: 220, damping: 28, mass: 0.5 });
  const horizontalX = useTransform(smoothXNum, (val) => `${val}%`);

  const rawRail = useTransform(journeyProgress, [0.05, 0.95], [0, 100]);
  const smoothRail = useSpring(rawRail, { stiffness: 220, damping: 28 });
  const railWidth = useTransform(smoothRail, (val) => `${Math.min(100, Math.max(0, val))}%`);

  // WORLD COVERAGE EXIT: as the AMOS plane (next sibling, z-10, opaque, overlapping
  // this root by one pinned viewport) rises over this pinned world, the outgoing
  // stage recedes for depth — scale down, drift up and dim, ending fully occluded.
  const { scrollYProgress: coverProgress } = useScroll({
    target: containerRef,
    // Span the recession across EXACTLY the cover glide. ["end 200vh"] = the
    // moment the AMOS plane's edge arrives (its peek sits at 200vh - 88px);
    // ["end 100vh"] = full occlusion as that plane pins over this one
    // (occlusion completes at 100vh - 8px, so this clamps just 8px late).
    // NOTE: framer's offset parser accepts only px/%/vw/vh — no calc().
    offset: ["end 200vh", "end 100vh"],
  });
  const coverScale = useTransform(coverProgress, [0, 1], [1, 0.965]);
  const coverY = useTransform(coverProgress, [0, 1], [0, -24]);
  const coverOpacity = useTransform(coverProgress, [0, 1], [1, 0.55]);
  const useCoverExit = mounted && !prefersReducedMotion;
  const coverExitStyle = useCoverExit
    ? { y: coverY, scale: coverScale, opacity: coverOpacity }
    : undefined;

  // Dynamic active stage synchronization driven by vertical page scroll
  useEffect(() => {
    if (!isDesktop) return;
    const unsubscribe = journeyProgress.on("change", (latest) => {
      let idx = 0;
      if (latest < 0.24) {
        idx = 0;
      } else if (latest < 0.56) {
        idx = 1;
      } else if (latest < 0.85) {
        idx = 2;
      } else {
        idx = 3;
      }
      setActiveStageIndex(idx);
    });
    return () => unsubscribe();
  }, [journeyProgress, isDesktop]);

  const activeStage = STAGES[activeStageIndex];
  // Displays user-configured photoSrc or the architecture blueprint by default
  const activePhoto = photoSrc || infographicSrc;

  // 3D Tilt calculation based on mouse position relative to the spatial viewport card
  const handleMouseMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normX = Math.max(0, Math.min(1, x / rect.width));
    const normY = Math.max(0, Math.min(1, y / rect.height));

    const tiltMultiplier = isExploded ? 14 : 9;
    const tiltX = (normY - 0.5) * -tiltMultiplier;
    const tiltY = (normX - 0.5) * tiltMultiplier;

    setTilt({ x: tiltX, y: tiltY });
    setCursorPos({ x: normX * 100, y: normY * 100 });
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    setCursorPos({ x: 50, y: 50 });
  };

  // Stage Selector: Smoothly scrolls viewport when clicking stage button on desktop
  const selectStage = useCallback(
    (index: number) => {
      sound.click();
      setActiveStageIndex(index);

      if (typeof window !== "undefined" && containerRef.current && window.innerWidth >= 1024) {
        const rect = containerRef.current.getBoundingClientRect();
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const containerTop = rect.top + scrollTop;
        const containerHeight = containerRef.current.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrollTravel = containerHeight - windowHeight;

        if (scrollTravel > 0) {
          // Fractions are taken in journey space ([0.04, 0.63] of the pin), so
          // each click lands exactly on a stage hold before the cover runway.
          const stageFractions = [0.076, 0.273, 0.458, 0.603];
          const targetScroll = containerTop - 80 + scrollTravel * stageFractions[index];
          window.scrollTo({
            top: Math.max(0, targetScroll),
            behavior: "smooth",
          });
        }
      }
    },
    []
  );

  const nextStage = useCallback(() => {
    if (activeStageIndex < STAGES.length - 1) {
      selectStage(activeStageIndex + 1);
    }
  }, [activeStageIndex, selectStage]);

  const prevStage = useCallback(() => {
    if (activeStageIndex > 0) {
      selectStage(activeStageIndex - 1);
    }
  }, [activeStageIndex, selectStage]);

  // Keyboard navigation for stages (scoped to while this showcase is in view)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }
      // Only respond while this pinned world occupies the viewport — sibling
      // showcases register identical window listeners, so scope prevents
      // double-triggering stage scrolls across consecutive project worlds.
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const inView = rect.top < window.innerHeight * 0.5 && rect.bottom > window.innerHeight * 0.5;
        if (!inView) return;
      }
      if (e.key === "ArrowRight") {
        nextStage();
      } else if (e.key === "ArrowLeft") {
        prevStage();
      } else if (e.key === "Escape" && showInfographicModal) {
        setShowInfographicModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextStage, prevStage, showInfographicModal]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 40) {
      nextStage();
    } else if (diff < -40) {
      prevStage();
    }
    setTouchStartX(null);
  };

  const toggleExploded = () => {
    sound.wake();
    setIsExploded(!isExploded);
  };

  const toggleScanline = () => {
    sound.click();
    setIsScanlineActive(!isScanlineActive);
  };

  // Determine whether motion.div uses continuous scroll-driven horizontalX or mobile tab offset
  const useContinuousScroll = mounted && isDesktop && !prefersReducedMotion;
  const trackX = useContinuousScroll ? horizontalX : `-${(activeStageIndex * 100) / STAGES.length}%`;
  const stageRailPercent = ((activeStageIndex + 1) / STAGES.length) * 100;
  const trackRailWidth = useContinuousScroll ? railWidth : `${stageRailPercent}%`;

  // Pin: the staged journey fills the first window; the lower third is the cover
  // runway the Agentic Merchant OS plane glides across after stage 04 completes.
  return (
    <div
      ref={containerRef}
      id="agentic-pipeline"
      className={`relative w-full lg:min-h-[350vh] ${className}`}
    >
      {/* DESKTOP STICKY PINNED VIEWPORT (world-exit recession applied while the next project plane covers this world) */}
      <motion.div
        style={coverExitStyle}
        className="relative lg:sticky lg:top-20 lg:h-[calc(100vh-5.5rem)] w-full flex flex-col justify-center py-2 lg:py-4"
      >
        {/* Background Architectural Ambient Radial Lighting */}
        <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center">
          <div className="w-[600px] lg:w-[1000px] h-[350px] lg:h-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(245,158,11,0.07)_0%,_rgba(245,158,11,0.01)_50%,_transparent_72%)] blur-3xl" />
        </div>

        {/* Project Header: Project Title & Description */}
        <div className="w-full flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.08] pb-4 mb-5">
          <div className="max-w-2xl">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block mb-1.5 font-medium">
              Featured Architecture
            </span>
            <h3 className="font-syne text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Agentic AI Video Pipeline
            </h3>
            <p className="mt-1.5 text-sm sm:text-base text-zinc-300 font-sans leading-relaxed">
              Automated multi-agent generation coordinating LangGraph planning, headless ComfyUI video diffusion, and FFmpeg assembly.
            </p>
          </div>

          {/* Direct 3D Spatial Photo Interaction Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={toggleScanline}
              onMouseEnter={() => sound.hover()}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-space font-medium transition-all cursor-pointer ${
                isScanlineActive
                  ? "border-amber-400/50 bg-amber-400/15 text-amber-300 shadow-sm shadow-amber-400/20"
                  : "border-white/[0.1] bg-white/[0.03] text-zinc-400 hover:text-white"
              }`}
              title="Toggle Holographic Scanline"
              aria-label="Toggle Holographic Scanline"
            >
              <Scan className="w-3.5 h-3.5" />
              <span>Scanline</span>
            </button>

            <button
              onClick={toggleExploded}
              onMouseEnter={() => sound.hover()}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-space font-medium transition-all cursor-pointer ${
                isExploded
                  ? "border-amber-400 bg-amber-400 text-black font-bold shadow-md shadow-amber-400/30"
                  : "border-white/[0.1] bg-white/[0.03] text-zinc-400 hover:border-amber-400/50 hover:text-white"
              }`}
              title="Explode 3D depth planes"
              aria-label="Toggle 3D layer explosion"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{isExploded ? "Collapse 3D" : "3D Explode"}</span>
            </button>

            <button
              onClick={() => {
                sound.click();
                setShowInfographicModal(true);
              }}
              onMouseEnter={() => sound.hover()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/[0.1] bg-white/[0.03] text-zinc-300 hover:border-amber-400/50 hover:text-amber-400 text-xs font-space font-medium transition-all cursor-pointer"
              title="Inspect Full-Resolution Blueprint"
              aria-label="Inspect Full-Resolution Blueprint"
            >
              <ZoomIn className="w-3.5 h-3.5" />
              <span>Inspect</span>
            </button>
          </div>
        </div>

        {/* Main Two-Column Architectural Engineering Stage */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* =======================================================================
              LEFT COLUMN: SINGLE 3D SPATIAL PHOTO VIEWPORT (58% Desktop Width)
              - Interactive 3D Perspective Gyro Tilt on Pointer Move
              - Multi-depth Z-axis Layer Explosion Mode
              - Holographic Scanline LiDAR Beam
              - Precision Crosshairs & Real-Time Cursor Coordinates
              ======================================================================= */}
          <div className="w-full lg:col-span-7 flex flex-col justify-center">
            <div
              ref={cardRef}
              onPointerMove={handleMouseMove}
              onPointerEnter={handlePointerEnter}
              onPointerLeave={handlePointerLeave}
              className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden border border-white/[0.12] bg-[#07070a] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] hover:border-amber-400/40 transition-all duration-300"
              style={{
                perspective: "1200px",
                transformStyle: "preserve-3d",
              }}
            >
              {/* 3D TILT CHASSIS CONTAINER */}
              <div
                className="relative w-full h-full transition-transform duration-150 ease-out flex items-center justify-center select-none"
                style={{
                  transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(${isHovered ? 1.01 : 1}, ${isHovered ? 1.01 : 1}, 1)`,
                  transformStyle: "preserve-3d",
                }}
              >
                {/* LAYER 0: CNC AEROSPACE CHASSIS & BLUEPRINT BACKPLANE (Z: -25px) */}
                <div
                  className="absolute inset-0 subtle-grid opacity-30 pointer-events-none transition-transform duration-500"
                  style={{
                    transform: isExploded ? "translateZ(-35px) scale(0.96)" : "translateZ(0px)",
                  }}
                />

                {/* Dynamic Mouse Glare Sheen Spotlight */}
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle 380px at ${cursorPos.x}% ${cursorPos.y}%, rgba(245, 158, 11, 0.14) 0%, transparent 65%)`,
                    opacity: isHovered ? 1 : 0.35,
                  }}
                />

                {/* LAYER 1: 3D SPATIAL PHOTO (BLUEPRINT / FEATURED IMAGE) */}
                <div
                  className="relative w-full h-full flex items-center justify-center overflow-hidden transition-all duration-500"
                  style={{
                    transform: isExploded ? "translateZ(40px) scale(1.02)" : "translateZ(15px)",
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div className="relative w-full h-full bg-black flex items-center justify-center group/photo">
                    <Image
                      src={activePhoto}
                      alt="Featured Engineering Architecture Blueprint"
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      priority
                      className="object-contain p-2 sm:p-4 filter contrast-[1.04]"
                    />

                    {/* Holographic Scanline LiDAR Sweep Beam */}
                    {isScanlineActive && (
                      <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_#f59e0b] pointer-events-none animate-scanline" />
                    )}

                    {/* Interactive Reticle Crosshairs at Cursor Location */}
                    {isHovered && (
                      <div
                        className="absolute pointer-events-none transition-all duration-75 flex items-center justify-center"
                        style={{
                          left: `${cursorPos.x}%`,
                          top: `${cursorPos.y}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        <div className="w-8 h-8 border border-amber-400/50 rounded-full flex items-center justify-center animate-pulse">
                          <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                        </div>
                        <div className="absolute top-5 left-5 font-mono text-[9px] text-amber-400 bg-black/85 px-1.5 py-0.5 rounded border border-amber-400/30 whitespace-nowrap">
                          X: {(cursorPos.x / 100).toFixed(3)} | Y: {(cursorPos.y / 100).toFixed(3)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* LAYER 2: FLOATING SPATIAL HUD & TELEMETRY (Z: +55px or +85px in Explode) */}
                <div
                  className="absolute inset-0 pointer-events-none p-3.5 sm:p-5 flex flex-col justify-between transition-transform duration-500"
                  style={{
                    transform: isExploded ? "translateZ(85px)" : "translateZ(40px)",
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Top Floating HUD Ribbon */}
                  <div className="flex items-center justify-between font-mono text-[10px] text-zinc-300 pointer-events-auto">
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/[0.12] shadow-xl">
                      <span
                        className="w-1.5 h-1.5 rounded-full animate-pulse"
                        style={{ backgroundColor: activeStage.accentColor }}
                      />
                      <span className="font-bold text-white tracking-wider">
                        PIPELINE SCHEMATIC
                      </span>
                      <span className="text-zinc-500">|</span>
                      <span className="text-amber-400 font-mono">
                        {activeStage.title}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        sound.click();
                        setShowInfographicModal(true);
                      }}
                      className="px-2.5 py-1 rounded-lg border border-white/[0.1] bg-black/70 hover:border-amber-400/50 hover:text-amber-400 text-zinc-300 backdrop-blur-md transition-all cursor-pointer"
                      title="Zoom full resolution"
                    >
                      <span className="text-[9px] font-space uppercase tracking-wider">Zoom Fullscreen</span>
                    </button>
                  </div>

                  {/* Bottom Floating Telemetry Bar */}
                  <div className="flex items-end justify-between font-mono text-[10px] text-zinc-400 pointer-events-auto">
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/[0.08]">
                      <Terminal className="w-3 h-3 text-amber-400" />
                      <span className="text-zinc-200">{activeStage.telemetry.value}</span>
                    </div>

                    <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/[0.08]">
                      <span className="text-amber-400 font-bold">{activeStage.telemetry.metricValue}</span>
                    </div>
                  </div>
                </div>

                {/* Corner Architectural Crop Brackets */}
                <div className="absolute top-2 left-2 text-white/30 font-mono text-xs pointer-events-none">
                  ┌
                </div>
                <div className="absolute top-2 right-2 text-white/30 font-mono text-xs pointer-events-none">
                  ┐
                </div>
                <div className="absolute bottom-2 left-2 text-white/30 font-mono text-xs pointer-events-none">
                  └
                </div>
                <div className="absolute bottom-2 right-2 text-white/30 font-mono text-xs pointer-events-none">
                  ┘
                </div>
              </div>
            </div>
          </div>

          {/* =======================================================================
              RIGHT COLUMN: TRUE HORIZONTAL SLIDING STAGE RAIL (42% Desktop Width)
              - Horizontal translation along X-axis driven by vertical page scroll
              ======================================================================= */}
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="w-full lg:col-span-5 flex flex-col justify-between"
          >
            {/* Top Stage Control Header: Tabs + Prev/Next Buttons */}
            <div className="flex flex-col gap-2.5 mb-3">
              <div className="flex items-center justify-between gap-2">
                {/* Stage Step Number Buttons */}
                <div className="flex items-center gap-1 sm:gap-2">
                  {STAGES.map((stg, i) => (
                    <button
                      key={stg.id}
                      onClick={() => selectStage(i)}
                      onMouseEnter={() => sound.hover()}
                      aria-label={`Jump to stage ${stg.index}: ${stg.title}`}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-xs transition-all cursor-pointer ${
                        activeStageIndex === i
                          ? "bg-amber-400 text-black font-bold shadow-md shadow-amber-400/25 scale-105"
                          : "border border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:text-white hover:border-white/[0.2]"
                      }`}
                    >
                      <span>{stg.index}</span>
                      <span className="hidden xl:inline text-[11px] font-space font-medium">
                        {stg.title.split(" ")[0]}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Prev & Next Chevrons */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={prevStage}
                    disabled={activeStageIndex === 0}
                    onMouseEnter={() => sound.hover()}
                    aria-label="Previous stage"
                    className={`p-1.5 rounded-full border transition-all cursor-pointer ${
                      activeStageIndex === 0
                        ? "border-white/[0.05] text-zinc-600 cursor-not-allowed"
                        : "border-white/[0.15] bg-white/[0.04] text-white hover:border-amber-400 hover:text-amber-400"
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={nextStage}
                    disabled={activeStageIndex === STAGES.length - 1}
                    onMouseEnter={() => sound.hover()}
                    aria-label="Next stage"
                    className={`p-1.5 rounded-full border transition-all cursor-pointer ${
                      activeStageIndex === STAGES.length - 1
                        ? "border-white/[0.05] text-zinc-600 cursor-not-allowed"
                        : "border-white/[0.15] bg-white/[0.04] text-white hover:border-amber-400 hover:text-amber-400"
                    }`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Glowing Horizontal Rail Track Bar */}
              <div className="relative w-full h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                <motion.div
                  style={{ width: trackRailWidth }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 rounded-full"
                />
              </div>
            </div>

            {/* THE HORIZONTAL SLIDING CARD CONTAINER */}
            <div className="relative w-full overflow-hidden rounded-3xl border border-white/[0.1] bg-[#07070a]/90 backdrop-blur-md shadow-2xl p-5 sm:p-6 min-h-[360px] flex flex-col justify-between">
              {/* The Translating Strip */}
              <div className="overflow-hidden w-full flex-1 flex flex-col justify-between">
                <motion.div
                  style={{
                    x: trackX,
                    width: `${STAGES.length * 100}%`,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="flex flex-row items-stretch h-full"
                >
                  {STAGES.map((stage, i) => {
                    const IconComponent = stage.icon;
                    const isStageActive = i === activeStageIndex;

                    return (
                      <div
                        key={stage.id}
                        style={{ width: `${100 / STAGES.length}%` }}
                        className={`shrink-0 flex flex-col justify-between pr-3 transition-opacity duration-300 ${
                          isStageActive ? "opacity-100" : "opacity-30"
                        }`}
                      >
                        <div>
                          {/* Stage Header Badge & Watermark */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span
                                className="p-1.5 rounded-lg border"
                                style={{
                                  backgroundColor: `${stage.accentColor}15`,
                                  borderColor: `${stage.accentColor}40`,
                                  color: stage.accentColor,
                                }}
                              >
                                <IconComponent className="w-4 h-4" />
                              </span>
                              <span
                                className="font-space text-xs font-bold uppercase tracking-widest"
                                style={{ color: stage.accentColor }}
                              >
                                {stage.index} &mdash; {stage.title}
                              </span>
                            </div>

                            <span className="font-mono text-3xl sm:text-4xl font-black text-white/[0.08] select-none">
                              {stage.index}
                            </span>
                          </div>

                          <h4 className="font-syne text-xl sm:text-2xl font-bold text-white tracking-tight">
                            {stage.subtitle}
                          </h4>

                          <p className="mt-2 text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
                            {stage.description}
                          </p>

                          {/* Subsystem Telemetry Metric Callout */}
                          <div className="mt-3.5 p-3 rounded-xl border border-white/[0.08] bg-white/[0.02] flex items-center justify-between">
                            <div>
                              <span className="font-space text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
                                {stage.telemetry.metricLabel}
                              </span>
                              <span className="font-mono text-xs font-bold text-amber-400">
                                {stage.telemetry.metricValue}
                              </span>
                            </div>
                            <span className="font-sans text-[11px] text-zinc-400 text-right">
                              {stage.telemetry.subtext}
                            </span>
                          </div>

                          {/* Highlights Bullet List */}
                          <div className="mt-3 space-y-1.5 font-sans text-xs text-zinc-200">
                            {stage.highlights.map((highlight, idx) => (
                              <div key={idx} className="flex items-start gap-2.5">
                                <CheckCircle2
                                  className="w-3.5 h-3.5 mt-0.5 shrink-0"
                                  style={{ color: stage.accentColor }}
                                />
                                <span>{highlight}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Technologies Strip & Stage Action Footer */}
                        <div className="mt-5 pt-3.5 border-t border-white/[0.06] flex items-center justify-between">
                          <div className="flex flex-wrap gap-1.5">
                            {stage.technologies.slice(0, 4).map((tech) => (
                              <span
                                key={tech}
                                className="px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-[11px] font-space text-zinc-300"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>

                          {i < STAGES.length - 1 ? (
                            <button
                              onClick={nextStage}
                              className="hidden sm:flex items-center gap-1 font-space text-xs text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                            >
                              <span>Next</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => selectStage(0)}
                              className="hidden sm:flex items-center gap-1 font-space text-xs text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer"
                            >
                              <span>Restart</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* =======================================================================
          FULL-RESOLUTION ARCHITECTURE BLUEPRINT MODAL LIGHTBOX
          ======================================================================= */}
      <AnimatePresence>
        {showInfographicModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-md"
            onClick={() => setShowInfographicModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-6xl max-h-[92vh] flex flex-col rounded-3xl border border-white/[0.12] bg-[#08080c] shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/[0.08]">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <h3 className="font-syne text-lg sm:text-xl font-bold text-white">
                    Agentic AI Video Pipeline // Architecture Blueprint
                  </h3>
                </div>

                <button
                  onClick={() => {
                    sound.click();
                    setShowInfographicModal(false);
                  }}
                  className="p-2 rounded-full hover:bg-white/[0.1] text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Image Body */}
              <div className="relative flex-1 min-h-[50vh] sm:min-h-[70vh] w-full p-4 bg-black flex items-center justify-center overflow-auto">
                <div className="relative w-full h-full aspect-[1672/941]">
                  <Image
                    src={activePhoto}
                    alt="Agentic AI Video Pipeline Full Architecture"
                    fill
                    sizes="90vw"
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:p-5 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs text-zinc-400">
                <div>
                  Pipeline Architecture: LangGraph (Orchestration) &rarr; ComfyUI + Wan 2.2 (GPU Inference) &rarr; FFmpeg (Assembly)
                </div>
                <button
                  onClick={() => setShowInfographicModal(false)}
                  className="px-4 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-space font-bold text-xs tracking-wide cursor-pointer"
                >
                  Close Blueprint
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
