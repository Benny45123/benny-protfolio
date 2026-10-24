"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";
import { sound } from "@/components/SoundEffects";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Workflow,
  Cpu,
  Film,
  Layers,
  CheckCircle2,
  ZoomIn,
  X,
  Info,
  Terminal,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export interface AgenticVideoPipelineShowcaseProps {
  videoSrc?: string;
  fallbackVideoSrc?: string;
  posterSrc?: string;
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
  };
  highlights: string[];
  technologies: string[];
}

const STAGES: PipelineStage[] = [
  {
    id: "orchestration",
    index: "01",
    title: "ORCHESTRATION",
    subtitle: "Deterministic Multi-Agent Coordination",
    description:
      "LangGraph coordinates the multi-stage production workflow, managing stateful graph transitions, quality checks, and prompt preparation. FastAPI handles high-throughput asynchronous backend coordination.",
    badge: "WORKFLOW ENGINE",
    icon: Workflow,
    accentColor: "#f59e0b",
    telemetry: {
      label: "ORCHESTRATOR",
      value: "LangGraph StateGraph // FastAPI Async",
      subtext: "Supabase State Checkpoints",
    },
    highlights: [
      "Story development & script breakdown",
      "Deterministic prompt preparation & validation",
      "Stateful checkpointing & retry mechanisms",
    ],
    technologies: ["Python", "FastAPI", "LangGraph", "Supabase", "MCP", "LiteLLM"],
  },
  {
    id: "inference",
    index: "02",
    title: "VIDEO INFERENCE",
    subtitle: "Automated Diffusion Execution",
    description:
      "ComfyUI executes the Wan 2.2 video generation workflow within a remote GPU runtime environment. Graph inputs are delivered programmatically, with automated model routing and fallback handling.",
    badge: "GPU WORKFLOW",
    icon: Cpu,
    accentColor: "#fbbf24",
    telemetry: {
      label: "DIFFUSION MODEL",
      value: "Wan 2.2 // ComfyUI Headless Graph",
      subtext: "Remote GPU Runtime Environment",
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
    subtitle: "Automated Multi-Clip Stitching",
    description:
      "Generated video segments (multiple ~10-second clips) are automatically combined and mastered using FFmpeg recipes into an assembled ~60-second narrative sequence ready for final distribution.",
    badge: "MEDIA PIPELINE",
    icon: Film,
    accentColor: "#f59e0b",
    telemetry: {
      label: "ASSEMBLY",
      value: "FFmpeg Concat Stream // ~10s x 6 -> 60s",
      subtext: "Automated Pipeline Delivery Hooks",
    },
    highlights: [
      "Automated multi-clip concatenation",
      "Streamable H.264 / AAC mastering",
      "Automated pipeline delivery verification",
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
  videoSrc = "/videos/agentic-video-pipeline.mp4",
  fallbackVideoSrc = "/assets/character/Generated%20Video%20October%2024,%202026%20-%204_05PM.mp4",
  posterSrc = "/videos/agentic-video-pipeline-poster.png",
  infographicSrc = "/assets/character/AI Video Pipeline Infographic.png",
  className = "",
}: AgenticVideoPipelineShowcaseProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  // Client mounting & desktop viewport detection using useSyncExternalStore (React 19 compliant)
  const mounted = React.useSyncExternalStore(subscribeEmpty, getMountedSnapshot, getMountedServerSnapshot);
  const isDesktop = React.useSyncExternalStore(subscribeResize, getDesktopSnapshot, getDesktopServerSnapshot);
  const prefersReducedMotion = useReducedMotion();

  // Playback & interactive state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [videoError, setVideoError] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [showInfographicModal, setShowInfographicModal] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"video" | "blueprint">("video");
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Scroll tracking across the showcase section (pinned sticky window)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80px", "end end"],
  });

  // HORIZONTAL STAGE TRANSLATION WITH SPRING PHYSICS & RESTING ZONES:
  // Each stage occupies 25% of the 400% track.
  // Stage 01: 0% | Stage 02: -25% | Stage 03: -50% | Stage 04: -75%
  // Keyframe resting zones allow comfortable viewing before transitioning to the next stage.
  const rawXNum = useTransform(
    scrollYProgress,
    [0, 0.12, 0.36, 0.44, 0.68, 0.76, 0.94, 1.0],
    [0, 0, -25, -25, -50, -50, -75, -75]
  );
  const smoothXNum = useSpring(rawXNum, { stiffness: 220, damping: 28, mass: 0.5 });
  const horizontalX = useTransform(smoothXNum, (val) => `${val}%`);

  // Glowing rail progress line (0% to 100%)
  const rawRail = useTransform(scrollYProgress, [0.05, 0.95], [0, 100]);
  const smoothRail = useSpring(rawRail, { stiffness: 220, damping: 28 });
  const railWidth = useTransform(smoothRail, (val) => `${Math.min(100, Math.max(0, val))}%`);

  // Dynamic active stage synchronization driven by vertical page scroll
  useEffect(() => {
    if (!isDesktop) return;
    const unsubscribe = scrollYProgress.on("change", (latest) => {
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
  }, [scrollYProgress, isDesktop]);

  const activeStage = STAGES[activeStageIndex];

  // Stage selector: Smoothly glides to the target stage
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
          const stageFractions = [0.06, 0.4, 0.72, 0.97];
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

  // Keyboard navigation when user uses ArrowLeft / ArrowRight
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
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

  // Touch handlers for mobile swipe
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

  // Play / Pause handler
  const togglePlay = useCallback(() => {
    sound.click();
    if (!videoRef.current) return;

    if (videoRef.current.paused || videoRef.current.ended) {
      sound.wake();
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn("Autoplay or play prevented:", err);
        });
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  // Mute / Unmute handler
  const toggleMute = useCallback(() => {
    sound.click();
    if (!videoRef.current) return;
    const nextMuted = !videoRef.current.muted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  }, []);

  // Fullscreen toggle handler
  const toggleFullscreen = useCallback(() => {
    sound.click();
    const frame = videoRef.current?.parentElement;
    if (!frame) return;

    if (!document.fullscreenElement) {
      frame.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }, []);

  // Time update listener
  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  }, []);

  // Loaded metadata listener
  const handleLoadedMetadata = useCallback(() => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration || 0);
    setVideoError(false);
  }, []);

  // Scrubber click handler
  const handleScrubberClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !videoRef.current || !duration) return;
    sound.click();
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    videoRef.current.currentTime = percentage * duration;
    setCurrentTime(percentage * duration);
  };

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "00:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const stageRailPercent = (activeStageIndex / (STAGES.length - 1)) * 100;

  // Decide whether motion.div uses continuous scroll-driven horizontalX or mobile spring offset
  const useContinuousScroll = mounted && isDesktop && !prefersReducedMotion;
  const trackX = useContinuousScroll ? horizontalX : `-${(activeStageIndex * 100) / STAGES.length}%`;
  const trackRailWidth = useContinuousScroll ? railWidth : `${stageRailPercent}%`;

  return (
    <div
      ref={containerRef}
      id="agentic-pipeline"
      className={`relative w-full lg:min-h-[260vh] ${className}`}
    >
      {/* =========================================================================
          DESKTOP STICKY PINNED VIEWPORT / MOBILE RESPONSIVE WRAPPER
          On desktop (lg+): Stays pinned at top-20 while user scrolls through 260vh.
          Stages slide horizontally right before the user's eyes without vertical drift!
          ========================================================================= */}
      <div className="relative lg:sticky lg:top-20 lg:h-[calc(100vh-5.5rem)] w-full flex flex-col justify-center py-2 lg:py-4">
        {/* Background Architectural Ambient Glow */}
        <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center">
          <div className="w-[700px] lg:w-[1100px] h-[350px] lg:h-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(245,158,11,0.08)_0%,_rgba(245,158,11,0.015)_45%,_transparent_72%)] blur-3xl" />
        </div>

        {/* Showcase Sub-Header & View Switcher */}
        <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/[0.08] pb-3 mb-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-amber-400 uppercase tracking-widest">
              Agentic AI Video Content Pipeline
            </span>
            <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-zinc-600" />
            <span className="hidden sm:inline-block font-sans text-xs text-zinc-400">
              From prompt to film &mdash; orchestrated by AI agents.
            </span>
          </div>

          {/* View Mode Switcher: Cinematic Video vs Architecture Blueprint */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.click();
                setViewMode("video");
              }}
              onMouseEnter={() => sound.hover()}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "video"
                  ? "bg-amber-400 text-black shadow-md shadow-amber-400/20"
                  : "border border-white/[0.1] bg-white/[0.03] text-zinc-400 hover:text-white hover:border-white/[0.2]"
              }`}
              aria-label="Switch to cinematic video view"
            >
              <Film className="w-3.5 h-3.5" />
              <span>Cinematic Film</span>
            </button>

            <button
              onClick={() => {
                sound.click();
                setViewMode("blueprint");
              }}
              onMouseEnter={() => sound.hover()}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "blueprint"
                  ? "bg-amber-400 text-black shadow-md shadow-amber-400/20"
                  : "border border-white/[0.1] bg-white/[0.03] text-zinc-400 hover:text-white hover:border-white/[0.2]"
              }`}
              aria-label="Switch to architecture blueprint view"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Architecture Blueprint</span>
            </button>

            <button
              onClick={() => {
                sound.click();
                setShowInfographicModal(true);
              }}
              onMouseEnter={() => sound.hover()}
              className="p-1.5 rounded-full border border-white/[0.1] bg-white/[0.03] text-zinc-400 hover:text-amber-400 hover:border-amber-400/30 transition-all cursor-pointer"
              title="Inspect Full-Resolution Diagram"
              aria-label="Inspect Full-Resolution Diagram"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            MAIN STAGE: TWO-COLUMN CINEMATIC COMPOSITION
            Left: Large 16:9 Video Canvas (58% width)
            Right: HORIZONTAL SLIDING STAGE RAIL (42% width)
            ========================================================================= */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7 items-stretch">
          {/* ---------------------------------------------------------------------
              LEFT COLUMN: CINEMATIC 16:9 HERO VIDEO CANVAS (58% Desktop Width)
              --------------------------------------------------------------------- */}
          <div className="w-full lg:col-span-7 flex flex-col justify-between">
            {/* The Video Display Bezel Container */}
            <div className="group relative w-full aspect-video rounded-2xl overflow-hidden border border-white/[0.12] bg-[#07070a] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.9)] transition-all duration-300 hover:border-amber-400/40">
              {/* Atmospheric Glow Halo behind Bezel */}
              <div
                className={`absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-400/15 to-transparent blur-xl pointer-events-none transition-opacity duration-700 ${
                  isPlaying ? "opacity-100" : "opacity-35"
                }`}
              />

              {/* VIEW MODE 1: CINEMATIC VIDEO */}
              {viewMode === "video" && (
                <div className="relative w-full h-full flex items-center justify-center bg-black">
                  <video
                    ref={videoRef}
                    playsInline
                    muted={isMuted}
                    loop
                    preload="metadata"
                    poster={posterSrc}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onError={() => setVideoError(true)}
                    onClick={togglePlay}
                    className="w-full h-full object-contain cursor-pointer"
                  >
                    <source src={videoSrc} type="video/mp4" />
                    <source src={fallbackVideoSrc} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>

                  {/* Graceful Fallback Overlay if Video fails */}
                  {videoError && (
                    <div className="absolute inset-0 bg-[#08080b]/95 flex flex-col items-center justify-center p-6 text-center z-20">
                      <Info className="w-8 h-8 text-amber-400 mb-2" />
                      <h4 className="font-syne text-lg font-bold text-white">Video Asset Standby</h4>
                      <p className="mt-1 font-sans text-xs text-zinc-400 max-w-sm">
                        Configure your MP4 at <code className="text-amber-400 font-mono">/videos/agentic-video-pipeline.mp4</code>.
                      </p>
                    </div>
                  )}

                  {/* Prominent Play / Resume Floating Badge when paused */}
                  {!isPlaying && !videoError && (
                    <div
                      onClick={togglePlay}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all cursor-pointer z-10 group-hover:bg-black/30"
                    >
                      <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        onMouseEnter={() => sound.hover()}
                        aria-label="Play video showcase"
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-400/90 hover:bg-amber-300 text-black flex items-center justify-center shadow-[0_0_35px_rgba(245,158,11,0.5)] transition-all cursor-pointer pl-1"
                      >
                        <Play className="w-8 h-8 fill-current" />
                      </motion.button>
                    </div>
                  )}

                  {/* Top HUD Telemetry Ribbon (Synchronized to Active Stage) */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-20 font-mono text-[10px] text-zinc-300">
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/[0.08]">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${isPlaying ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`}
                      />
                      <span className="font-bold text-white tracking-wider">
                        {isPlaying ? "LIVE PLAYBACK" : "CINEMATIC HERO"}
                      </span>
                    </div>

                    <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/[0.08]">
                      <Terminal className="w-3 h-3 text-amber-400" />
                      <span className="text-zinc-300">{activeStage.telemetry.value}</span>
                    </div>
                  </div>

                  {/* Bottom HUD Media Controls Bar */}
                  <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-20 flex flex-col gap-2">
                    {/* Interactive Scrubber Bar */}
                    <div
                      ref={progressBarRef}
                      onClick={handleScrubberClick}
                      className="group/scrub relative w-full h-1.5 hover:h-2.5 bg-white/20 rounded-full cursor-pointer transition-all overflow-hidden"
                      title="Click to seek"
                      role="progressbar"
                      aria-valuenow={progressPercent}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label="Video playback progress"
                    >
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-75 relative"
                        style={{ width: `${progressPercent}%` }}
                      >
                        <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-md opacity-0 group-hover/scrub:opacity-100 transition-opacity" />
                      </div>
                    </div>

                    {/* Control Icons & Time Display */}
                    <div className="flex items-center justify-between font-mono text-xs text-zinc-300">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <button
                          onClick={togglePlay}
                          onMouseEnter={() => sound.hover()}
                          aria-label={isPlaying ? "Pause video" : "Play video"}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-white hover:text-amber-400 transition-colors cursor-pointer"
                        >
                          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                        </button>

                        <button
                          onClick={toggleMute}
                          onMouseEnter={() => sound.hover()}
                          aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-white hover:text-amber-400 transition-colors cursor-pointer"
                        >
                          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
                        </button>

                        <span className="text-[11px] text-zinc-400 tracking-wider">
                          {formatTime(currentTime)} / {formatTime(duration || 60)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-white/[0.08] text-[10px] text-zinc-400">
                          16:9 Master • Wan 2.2
                        </span>

                        <button
                          onClick={toggleFullscreen}
                          onMouseEnter={() => sound.hover()}
                          aria-label="Toggle Fullscreen"
                          className="p-1.5 rounded-lg hover:bg-white/10 text-white hover:text-amber-400 transition-colors cursor-pointer"
                        >
                          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW MODE 2: ARCHITECTURE BLUEPRINT (Infographic Snapshot) */}
              {viewMode === "blueprint" && (
                <div className="relative w-full h-full bg-[#0a0a0f] flex items-center justify-center p-2 group/blueprint">
                  <Image
                    src={infographicSrc}
                    alt="AI Video Pipeline Architecture Diagram"
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    priority
                    className="object-contain"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/blueprint:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <button
                      onClick={() => {
                        sound.click();
                        setShowInfographicModal(true);
                      }}
                      className="px-4 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-space font-bold text-xs tracking-wider flex items-center gap-2 shadow-xl cursor-pointer"
                    >
                      <ZoomIn className="w-4 h-4" />
                      <span>Inspect High-Resolution Diagram</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sub-Video Metric Banner */}
            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 px-1 text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-zinc-300">Wan 2.2 • ComfyUI • FFmpeg Concat</span>
              </div>
              <div className="text-zinc-500">
                Multiple ~10s clips assembled into ~60s master
              </div>
            </div>
          </div>

          {/* ---------------------------------------------------------------------
              RIGHT COLUMN: TRUE HORIZONTAL SLIDING STAGE RAIL (42% Width)
              - Translates horizontally along x-axis as the page is scrolled
              - Also navigable via stage tabs, chevrons, touch swipe & arrow keys
              - ZERO black gap, ZERO vertical runaway!
              --------------------------------------------------------------------- */}
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="w-full lg:col-span-5 flex flex-col justify-between"
          >
            {/* Top Stage Control Header: Tabs + Prev/Next Buttons */}
            <div className="flex flex-col gap-2.5 mb-3">
              <div className="flex items-center justify-between gap-2">
                {/* Stage Step Numbers */}
                <div className="flex items-center gap-1 sm:gap-2">
                  {STAGES.map((stg, i) => (
                    <button
                      key={stg.id}
                      onClick={() => selectStage(i)}
                      onMouseEnter={() => sound.hover()}
                      aria-label={`Jump to stage ${stg.index}: ${stg.title}`}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-xs transition-all cursor-pointer ${
                        activeStageIndex === i
                          ? "bg-amber-400 text-black font-bold shadow-md shadow-amber-400/25 scale-105"
                          : "border border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:text-white hover:border-white/[0.2]"
                      }`}
                    >
                      <span>{stg.index}</span>
                      <span className="hidden xl:inline text-[11px]">{stg.title.split(" ")[0]}</span>
                    </button>
                  ))}
                </div>

                {/* Prev & Next Floating Arrow Buttons */}
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

            {/* ===================================================================
                THE HORIZONTAL SLIDING CARD CONTAINER
                Smoothly translates along x-axis with spring animation
                =================================================================== */}
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
                          {/* Stage Badge & Watermark */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="p-1.5 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20">
                                <IconComponent className="w-4 h-4" />
                              </span>
                              <span className="font-mono text-xs font-bold text-amber-400 uppercase tracking-widest">
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

                          {/* Stage 4 Special: Interactive Thumbnail for Blueprint */}
                          {stage.id === "blueprint" ? (
                            <div className="mt-4 p-3.5 rounded-2xl border border-amber-400/30 bg-amber-400/[0.04] flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2.5">
                                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                                <span className="font-mono text-xs text-zinc-300">
                                  High-resolution architecture blueprint
                                </span>
                              </div>
                              <button
                                onClick={() => {
                                  sound.click();
                                  setShowInfographicModal(true);
                                }}
                                className="px-3.5 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-space font-bold text-xs tracking-wide shrink-0 transition-all cursor-pointer"
                              >
                                Zoom Blueprint
                              </button>
                            </div>
                          ) : (
                            /* Highlights Bullet List */
                            <div className="mt-4 space-y-2 font-mono text-xs text-zinc-300">
                              {stage.highlights.map((h, idx) => (
                                <div key={idx} className="flex items-start gap-2.5">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                                  <span>{h}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Tech Stack Strip at Bottom */}
                        <div className="mt-5 pt-3.5 border-t border-white/[0.06] flex items-center justify-between">
                          <div className="flex flex-wrap gap-1.5">
                            {stage.technologies.slice(0, 4).map((tech) => (
                              <span
                                key={tech}
                                className="px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-[11px] font-mono text-zinc-300"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>

                          {/* Next stage quick arrow button */}
                          {i < STAGES.length - 1 ? (
                            <button
                              onClick={nextStage}
                              className="hidden sm:flex items-center gap-1 font-mono text-[11px] text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                            >
                              <span>Next</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => selectStage(0)}
                              className="hidden sm:flex items-center gap-1 font-mono text-[11px] text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer"
                            >
                              <span>Restart 01</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              </div>
            </div>

            {/* Bottom Interactive Guidance Bar */}
            <div className="mt-2.5 px-1 flex items-center justify-between text-xs font-mono text-zinc-500">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="hidden sm:inline">Scroll page, swipe, or use arrows to slide stages</span>
                <span className="sm:hidden">Swipe or tap tabs to slide</span>
              </div>
              <span className="text-zinc-400">
                Stage {activeStageIndex + 1} of {STAGES.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          FULL-RESOLUTION ARCHITECTURE BLUEPRINT MODAL LIGHTBOX
          ========================================================================= */}
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
                    src={infographicSrc}
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
