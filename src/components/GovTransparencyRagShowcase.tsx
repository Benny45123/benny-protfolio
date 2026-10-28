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
  Database,
  Search,
  ShieldCheck,
  Terminal,
  CheckCircle2,
  ZoomIn,
  X,
  ChevronLeft,
  ChevronRight,
  Scan,
  Sliders,
} from "lucide-react";

export interface GovTransparencyRagShowcaseProps {
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
    id: "ingestion",
    index: "01",
    title: "INGESTION ENGINE",
    subtitle: "Court Records to Vector Primitives",
    description:
      "DOJ disclosures, court exhibits and parquet mail dumps are scraped with curl_cffi under a Chrome-120 TLS fingerprint, extracted natively with PyMuPDF — Tesseract OCR at 300 DPI fires only when a page yields <50 characters — then normalized and batch-flushed into Pinecone-ready vectors.",
    badge: "BATCH INGEST PLANE",
    icon: Database,
    accentColor: "#3b82f6",
    telemetry: {
      label: "INGEST",
      value: "PyMuPDF + Tesseract · SHA-256 Resume",
      subtext: "Crash-safe disk cache — zero redundant re-OCR",
      metricLabel: "API CALL REDUCTION",
      metricValue: "85%+ via Accumulator",
    },
    highlights: [
      "ChunkAccumulator flushes batches of 20–30 chunks across docs",
      "10-key GeminiKeyPool round-robins gemini-embedding-001 (3072-dim)",
      "Automatic 65-second cooldown on any HTTP 429 RESOURCE_EXHAUSTED",
      "Strict 200 requests/day budget — ~6,000–8,000 chunks/day ceiling",
    ],
    technologies: ["curl_cffi", "PyMuPDF", "Tesseract 300 DPI", "ChunkAccumulator"],
  },
  {
    id: "retrieval",
    index: "02",
    title: "HYBRID RETRIEVAL",
    subtitle: "Two-Stage Search, One Relevance Floor",
    description:
      "FastAPI gatekeeps Supabase JWT roles while regex intent short-circuits chitchat at 0 tokens. Redis Cloud answers SHA-256-scoped hits in <10ms; on miss, the rewriter resolves pronouns before dual ANN retrieval hands 10 candidates to the Cohere v3.5 / BM25 reranker.",
    badge: "VERIFICATION GAUNTLET",
    icon: Search,
    accentColor: "#8b5cf6",
    telemetry: {
      label: "RETRIEVAL",
      value: "ANN top-10 → Rerank top-5",
      subtext: "Chunks below the judge floor are discarded",
      metricLabel: "RELEVANCE FLOOR",
      metricValue: "≥ 0.45 LLM Judge",
    },
    highlights: [
      "Domain synonym expansion: child → minor, victim → abused",
      "Cohere rerank-v3.5 with length-normalized BM25 fallback (k₁=1.5, b=0.75)",
      "DuckDuckGo HTML fallback fires when document coverage is empty",
      "50% prompt-token savings: 10 retrieved, 5 injected per request",
    ],
    technologies: ["Pinecone 3072-dim", "Cohere v3.5", "BM25 TF-IDF", "Redis <10ms"],
  },
  {
    id: "forensic",
    index: "03",
    title: "FORENSIC GENERATOR",
    subtitle: "Clinical Neutrality, Verified Citations",
    description:
      "Groq Llama-3.3-70B streams verified answers through a Clinical Redaction & Neutrality Protocol engineered to speak past safety guardrails on legal terms. Every claim carries [Source N: URL] citations — source_url, filename and chunk_index ride in vector metadata from ingest time.",
    badge: "GUARDED STREAMING",
    icon: ShieldCheck,
    accentColor: "#10b981",
    telemetry: {
      label: "GENERATION",
      value: "NDJSON / SSE Token Streaming",
      subtext: "temp=0.0 · 1024 max tokens · 3-attempt backoff",
      metricLabel: "SOURCE LINEAGE",
      metricValue: "100% Citations Verified",
    },
    highlights: [
      "Streaming output moves first tokens while the answer continues",
      "Clinical Redaction & Neutrality Protocol prevents safety refusals",
      "Exponential backoff retries errant LLM calls — 3 attempts",
      "Redis cache set (TTL 3600s) books answers for instant reuse",
    ],
    technologies: ["Groq Llama-3.3-70B", "NDJSON / SSE", "Citations", "Backoff ×3"],
  },
  {
    id: "audit",
    index: "04",
    title: "PERSISTENCE & TRACE",
    subtitle: "Async Writes, Span-Level Telemetry",
    description:
      "Supabase writes run on a background daemon thread — deduplicated query_answers plus foreign-key history — so users never wait on I/O. DuckDB runs columnar OLAP over 40.8MB of parsed email parquet while a context-managed tracer records per-span latencies for every request.",
    badge: "OBSERVABILITY PLANE",
    icon: Terminal,
    accentColor: "#38bdf8",
    telemetry: {
      label: "PERSISTENCE",
      value: "Supabase · DuckDB · Tracer",
      subtext: "Writes live off the hot loop — the user path stays wait-free",
      metricLabel: "DB WRITE LATENCY",
      metricValue: "0ms User-Facing",
    },
    highlights: [
      "Background daemon saves 50–150ms of user wait per request",
      "Span tracer: retrieve · rerank · judge · generate · total_ms",
      "DuckDB OLAP over 40.8MB emails-slim.parquet",
      "Normalized deduplication + foreign-key history logging",
    ],
    technologies: ["Supabase RLS", "DuckDB", "Redis TTL 3600s", "JSON Tracer"],
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

export default function GovTransparencyRagShowcase({
  photoSrc,
  infographicSrc = "/assets/character/gov-transparency-rag-architecture.png",
  className = "",
}: GovTransparencyRagShowcaseProps) {
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
  // NOTE: this is the final world — no successor plane covers it, so the staged
  // journey maps across the full pin and no runway/exit machinery applies.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80px", "end end"],
  });

  const rawXNum = useTransform(
    scrollYProgress,
    [0, 0.12, 0.36, 0.44, 0.68, 0.76, 0.94, 1.0],
    [0, 0, -25, -25, -50, -50, -75, -75]
  );
  const smoothXNum = useSpring(rawXNum, { stiffness: 220, damping: 28, mass: 0.5 });
  const horizontalX = useTransform(smoothXNum, (val) => `${val}%`);

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

  return (
    <div
      ref={containerRef}
      id="gov-transparency-rag"
      className={`relative z-20 w-full mt-16 sm:mt-20 lg:-mt-[calc(100vh-5.5rem)] pt-10 sm:pt-12 lg:pt-0 border-t border-white/[0.08] lg:border-t-0 bg-black lg:min-h-[260vh] ${className}`}
    >
      {/* =====================================================================
          DESKTOP STICKY COVER PLANE
          - Root overlaps the previous world by exactly one pinned viewport
            (lg:-mt-[calc(100vh-5.5rem)]), so while this plane rises over the
            Agentic Merchant OS, that world stays pinned at its sticky bind
            point and is fully occluded the moment this plane pins.
          - Timing contract: the Merchant OS pin maps its four-stage journey
            into the first ~63% of its progress (cover runway below), so every
            stage completes and the rail rests on 04 before this plane's edge
            arrives at ~65% — the cover never interrupts a stage hold. This
            plane itself is the final world (no successor applies over it).
          - Opaque bg + z-20 make the plane read as one solid rising sheet above
            the z-10 Merchant OS sheet; the hairline cap edge slides in as its
            leading edge.
          ===================================================================== */}
      {/* DESKTOP STICKY PINNED VIEWPORT (final world — no exit recession) */}
      <div className="relative lg:sticky lg:top-20 lg:h-[calc(100vh-5.5rem)] w-full flex flex-col justify-center py-1.5 lg:py-3">
        {/* Background Architectural Ambient Radial Lighting */}
        <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center">
          <div className="w-[600px] lg:w-[1000px] h-[350px] lg:h-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(139,92,246,0.07)_0%,_rgba(139,92,246,0.01)_50%,_transparent_72%)] blur-3xl" />
        </div>

        {/* Project Header: Project Title & Description */}
        <div className="w-full flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.08] pb-3 mb-4">
          <div className="max-w-2xl">
            <span className="text-xs font-mono text-violet-400 uppercase tracking-widest block mb-1.5 font-medium">
              Featured Architecture
            </span>
            <h3 className="font-syne text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Gov-Transparency RAG
            </h3>
            <p className="mt-1.5 text-sm sm:text-base text-zinc-300 font-sans leading-relaxed">
              From thousands of legal documents to trustworthy answers — a production-grade forensic document RAG pipeline for court records, exhibits and DOJ disclosures.
            </p>
            <p className="mt-1 text-[11px] font-mono text-zinc-500 tracking-tight">
              85%+ API Savings &middot; &lt;10ms Cache Hits &middot; ≥0.45 Relevance Floor &middot; 100% Source Lineage
            </p>
          </div>

          {/* Direct 3D Spatial Photo Interaction Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={toggleScanline}
              onMouseEnter={() => sound.hover()}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-space font-medium transition-all cursor-pointer ${
                isScanlineActive
                  ? "border-violet-400/50 bg-violet-400/15 text-violet-300 shadow-sm shadow-violet-400/20"
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
                  ? "border-violet-400 bg-violet-400 text-black font-bold shadow-md shadow-violet-400/30"
                  : "border-white/[0.1] bg-white/[0.03] text-zinc-400 hover:border-violet-400/50 hover:text-white"
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
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/[0.1] bg-white/[0.03] text-zinc-300 hover:border-violet-400/50 hover:text-violet-400 text-xs font-space font-medium transition-all cursor-pointer"
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
              className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden border border-white/[0.12] bg-[#07070a] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] hover:border-violet-400/40 transition-all duration-300"
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
                    background: `radial-gradient(circle 380px at ${cursorPos.x}% ${cursorPos.y}%, rgba(139, 92, 246, 0.14) 0%, transparent 65%)`,
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
                      alt="Gov-Transparency RAG Forensic Document Pipeline Architecture Blueprint"
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      preload
                      className="object-contain p-2 sm:p-4 filter contrast-[1.04]"
                    />

                    {/* Holographic Scanline LiDAR Sweep Beam */}
                    {isScanlineActive && (
                      <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-violet-400 to-transparent shadow-[0_0_15px_#8b5cf6] pointer-events-none animate-scanline" />
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
                        <div className="w-8 h-8 border border-violet-400/50 rounded-full flex items-center justify-center animate-pulse">
                          <span className="w-1.5 h-1.5 bg-violet-400 rounded-full" />
                        </div>
                        <div className="absolute top-5 left-5 font-mono text-[9px] text-violet-400 bg-black/85 px-1.5 py-0.5 rounded border border-violet-400/30 whitespace-nowrap">
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
                        FORENSIC RAG SPINE
                      </span>
                      <span className="text-zinc-500">|</span>
                      <span
                        className="font-mono"
                        style={{ color: activeStage.accentColor }}
                      >
                        {activeStage.title}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        sound.click();
                        setShowInfographicModal(true);
                      }}
                      className="px-2.5 py-1 rounded-lg border border-white/[0.1] bg-black/70 hover:border-violet-400/50 hover:text-violet-400 text-zinc-300 backdrop-blur-md transition-all cursor-pointer"
                      title="Zoom full resolution"
                    >
                      <span className="text-[9px] font-space uppercase tracking-wider">Zoom Fullscreen</span>
                    </button>
                  </div>

                  {/* Bottom Floating Telemetry Bar */}
                  <div className="flex items-end justify-between font-mono text-[10px] text-zinc-400 pointer-events-auto">
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/[0.08]">
                      <Terminal className="w-3 h-3 text-violet-400" />
                      <span className="text-zinc-200">{activeStage.telemetry.value}</span>
                    </div>

                    <div
                      className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/[0.08]"
                      style={{ color: activeStage.accentColor }}
                    >
                      <span className="font-bold">{activeStage.telemetry.metricValue}</span>
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
                          ? "text-black font-bold shadow-md scale-105"
                          : "border border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:text-white hover:border-white/[0.2]"
                      }`}
                      style={
                        activeStageIndex === i
                          ? { backgroundColor: stg.accentColor }
                          : undefined
                      }
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
                        : "border-white/[0.15] bg-white/[0.04] text-white hover:border-violet-400 hover:text-violet-400"
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
                        : "border-white/[0.15] bg-white/[0.04] text-white hover:border-violet-400 hover:text-violet-400"
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
                  className="h-full bg-gradient-to-r from-violet-500 via-violet-400 to-amber-300 rounded-full"
                />
              </div>
            </div>

            {/* THE HORIZONTAL SLIDING CARD CONTAINER */}
            <div className="relative w-full overflow-hidden rounded-3xl border border-white/[0.1] bg-[#07070a]/90 backdrop-blur-md shadow-2xl p-4 sm:p-5 min-h-[360px] flex flex-col justify-between">
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

                          <p className="mt-1.5 text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
                            {stage.description}
                          </p>

                          {/* Subsystem Telemetry Metric Callout */}
                          <div className="mt-3 p-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02] flex items-center justify-between">
                            <div>
                              <span className="font-space text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
                                {stage.telemetry.metricLabel}
                              </span>
                              <span
                                className="font-mono text-xs font-bold"
                                style={{ color: stage.accentColor }}
                              >
                                {stage.telemetry.metricValue}
                              </span>
                            </div>
                            <span className="font-sans text-[11px] text-zinc-400 text-right">
                              {stage.telemetry.subtext}
                            </span>
                          </div>

                          {/* Highlights Bullet List */}
                          <div className="mt-2.5 space-y-1 font-sans text-xs text-zinc-200">
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
                        <div className="mt-3.5 pt-3 border-t border-white/[0.06] flex items-center justify-between">
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
                              className="hidden sm:flex items-center gap-1 font-space text-xs text-violet-400 hover:text-violet-300 transition-colors cursor-pointer"
                            >
                              <span>Next</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => selectStage(0)}
                              className="hidden sm:flex items-center gap-1 font-space text-xs text-zinc-400 hover:text-violet-400 transition-colors cursor-pointer"
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
      </div>

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
                  <span className="w-2 h-2 rounded-full bg-violet-400" />
                  <h3 className="font-syne text-lg sm:text-xl font-bold text-white">
                    Gov-Transparency RAG // Forensic Document Intelligence
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
                <div className="relative w-full h-full aspect-[1672/955]">
                  <Image
                    src={activePhoto}
                    alt="Gov-Transparency RAG Full Forensic Document Pipeline Architecture"
                    fill
                    sizes="90vw"
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:p-5 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs text-zinc-400">
                <div>
                  Forensic Spine: DOJ Ingestion &rarr; Hybrid Retrieval &rarr; Verified Generation &rarr; Supabase Persistence &rarr; Span Tracing
                </div>
                <button
                  onClick={() => setShowInfographicModal(false)}
                  className="px-4 py-2 rounded-full bg-violet-400 hover:bg-violet-300 text-black font-space font-bold text-xs tracking-wide cursor-pointer"
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
