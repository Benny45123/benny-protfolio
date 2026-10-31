"use client";

import React, { useState, useRef, useEffect, useCallback, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
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
  Upload,
  Brain,
  Target,
  Trophy,
  CheckCircle2,
  ZoomIn,
  X,
  Terminal,
  ChevronLeft,
  ChevronRight,
  Scan,
  Sliders,
} from "lucide-react";

export interface CareerForgeShowcaseProps {
  photoSrc?: string;
  infographicSrc?: string;
  className?: string;
}

interface ForgeStage {
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

// Content sourced from the real CareerForge AI stack:
// Backend: Express :3120 · JWT HTTP-only cookies · Nodemailer OTP · Multer + pdf-parse ·
// LangChain (700/50 splitter) · Gemini embeddings/generation · Gemma quiz grading ·
// Pinecone ephemeral namespaces · SerpApi job recon · MongoDB Atlas persistence.
// Frontend: Next.js 16 App Router · React 19 · Tailwind 4 · html-to-image + jsPDF templates.
// This system is the starting pillar where frontend, backend, database, REST APIs and
// LLM calls first came together for Benny.
const STAGES: ForgeStage[] = [
  {
    id: "ingress",
    index: "01",
    title: "FORGE INGRESS",
    subtitle: "JWT Sessions, OTP Gates, PDF Intake",
    description:
      "The frontend–backend–database triangle where every pillar first clicked: a Next.js 16 · React 19 client calls Express on :3120 through BackendHandler with credentials: \"include\" — Nodemailer OTP verifies humans, bcrypt + an HTTP-only JWT cookie keeps sessions alive, and Multer's in-memory buffer hands upload PDFs straight to pdf-parse.",
    badge: "FULL-STACK PILLAR",
    icon: Upload,
    accentColor: "#22d3ee",
    telemetry: {
      label: "AUTH PIPELINE",
      value: "OTP → bcrypt → HTTP-only JWT",
      subtext: "OTP expires in 6 min · sessions in 2 h",
      metricLabel: "API SURFACE",
      metricValue: "10 REST Endpoints",
    },
    highlights: [
      "Next.js 16 + React 19 glass dashboard — decoupled client, backend-only DB",
      "register → verify-otp → login flow · 6-digit OTP mailers expire in 6 min",
      "HTTP-only token cookie (2 h expiry) — bearer never touches localStorage",
      "Multipart PDFs land in Multer memory and parse via pdf-parse",
    ],
    technologies: ["Next.js 16", "React 19", "Express :3120", "JWT Cookie"],
  },
  {
    id: "retrieval",
    index: "02",
    title: "RETRIEVAL CORE",
    subtitle: "LangChain Chunks → Gemini Vectors → Pinecone",
    description:
      "The RAG pillar: RecursiveCharacterTextSplitter cuts each resume into 700-char chunks with 50 overlap, Gemini document embeddings upsert into an ephemeral Pinecone namespace user-<id>-<uuid>, and multi-query semantic retrieval with dedup assembles the exact context Gemini generates from — never the whole document.",
    badge: "RAG PILLAR",
    icon: Brain,
    accentColor: "#a78bfa",
    telemetry: {
      label: "RAG PIPELINE",
      value: "Chunk 700/50 → Embed → Retrieve",
      subtext: "Strict-JSON prompting with fallback guards",
      metricLabel: "VECTOR NAMESPACE",
      metricValue: "user-<id>-<uuid>",
    },
    highlights: [
      "RecursiveCharacterTextSplitter — 700-char chunks, 50 overlap",
      "Gemini embeddings upserted into ephemeral Pinecone namespaces",
      "Multi-query semantic retrieval + dedup feed every generation call",
      "finally{} purges the temp namespace even when LLM calls fail",
    ],
    technologies: ["LangChain", "Gemini Embeddings", "Pinecone", "JSON Guards"],
  },
  {
    id: "verdict",
    index: "03",
    title: "ATS VERDICT",
    subtitle: "Deterministic Scoring on LLM Evidence",
    description:
      "POST /api/resume/analyze-resume returns atsScore, matched_keywords, missing_keywords, resume_sections and responseConfidence — a ceiling-at-95 formula: 60% keyword coverage, 40% section integrity, minus gap penalties. The same plane drafts 300–400-word, first-person cover letters exported through six jsPDF designs.",
    badge: "SCORING ENGINE",
    icon: Target,
    accentColor: "#10b981",
    telemetry: {
      label: "VERDICT",
      value: "60% Keywords + 40% Sections",
      subtext: "Ceiling 95 — no inflated 99/100 promises",
      metricLabel: "COVER LETTER",
      metricValue: "6 Design Templates",
    },
    highlights: [
      "Multipart analyze-resume: resume + jobDescription → strict JSON verdict",
      "Matched / missing keywords + per-section integrity feedback",
      "300–400-word first-person letters aware of recruiter & designation",
      "html-to-image + jsPDF render Design1–Design6 template PDFs",
    ],
    technologies: ["ATS 60/40", "Gemini JSON", "html-to-image", "jsPDF"],
  },
  {
    id: "copilot",
    index: "04",
    title: "COACH & MATCH",
    subtitle: "Gemma-Graded Quizzes · SerpApi Recon",
    description:
      "The copilot surface: POST /api/quiz/generate-quiz deals a 10-question gauntlet (3 tech · 4 project · 3 behavioral; 3 easy · 4 medium · 3 hard), Gemma grades free-text answers into score, feedback, strengths and improvements — model answers stay server-side. /api/jobs/recommend-jobs fans out SerpApi across LinkedIn, Unstop and Wellfound, then ranks roles by Pinecone cosine similarity.",
    badge: "CAREER COPILOT",
    icon: Trophy,
    accentColor: "#f59e0b",
    telemetry: {
      label: "COACHING",
      value: "Gemini Quiz → Gemma Verdict",
      subtext: "Model answers never cross the wire",
      metricLabel: "JOB RECON",
      metricValue: "3 Boards · 1 req/IP/24h",
    },
    highlights: [
      "10-question interview simulator — 3 tech · 4 project · 3 behavioral",
      "Gemma grades free-text runs: score, feedback, strengths, verdict",
      "SerpApi recon across LinkedIn · Unstop · Wellfound boards",
      "Cosine-similarity ranking of live roles vs the resume profile",
    ],
    technologies: ["Gemma Grading", "SerpApi", "Cosine Rank", "Rate Guard"],
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

export default function CareerForgeShowcase({
  photoSrc,
  infographicSrc = "/assets/character/careerforge-ai-copilot-architecture.png",
  className = "",
}: CareerForgeShowcaseProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const mounted = useSyncExternalStore(subscribeEmpty, getMountedSnapshot, getMountedServerSnapshot);
  const isDesktop = useSyncExternalStore(subscribeResize, getDesktopSnapshot, getDesktopServerSnapshot);
  const prefersReducedMotion = useReducedMotion();

  // Active Stage & Lightbox State
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [showInfographicModal, setShowInfographicModal] = useState<boolean>(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Prevent background scroll and support ESC key while modal is open
  useEffect(() => {
    if (!showInfographicModal) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowInfographicModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showInfographicModal]);

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
      id="careerforge-ai"
      className={`relative z-30 w-full mt-16 sm:mt-20 lg:-mt-[calc(100vh-5.5rem)] pt-10 sm:pt-12 lg:pt-0 border-t border-white/[0.08] lg:border-t-0 bg-black lg:min-h-[260vh] ${className}`}
    >
      {/* =====================================================================
          DESKTOP STICKY COVER PLANE
          - Root overlaps the previous world by exactly one pinned viewport
            (lg:-mt-[calc(100vh-5.5rem)]), so while this plane rises over the
            Gov-Transparency RAG world, that world stays pinned at its sticky
            bind point and is fully occluded the moment this plane pins.
          - Timing contract: the Gov-Transparency pin maps its four-stage
            journey into the first ~63% of its progress (cover runway in that
            component), so every stage completes and the rail rests on 04
            before this plane's edge arrives at ~65% — the cover never
            interrupts a stage hold. This plane itself is the final world
            (no successor applies over it).
          - Opaque bg + z-30 make the plane read as one solid rising sheet above
            the z-20 Gov-Transparency sheet; the hairline cap edge slides in as
            its leading edge.
          ===================================================================== */}
      {/* DESKTOP STICKY PINNED VIEWPORT (final world — no exit recession) */}
      <div className="relative lg:sticky lg:top-20 lg:h-[calc(100vh-5.5rem)] w-full flex flex-col justify-center py-1.5 lg:py-3">
        {/* Background Architectural Ambient Radial Lighting */}
        <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center">
          <div className="w-[600px] lg:w-[1000px] h-[350px] lg:h-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(217,70,239,0.07)_0%,_rgba(217,70,239,0.01)_50%,_transparent_72%)] blur-3xl" />
        </div>

        {/* Project Header: Project Title & Description */}
        <div className="w-full flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.08] pb-3 mb-4">
          <div className="max-w-3xl">
            <h3 className="font-syne text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-[-0.03em] leading-tight">
              CareerForge AI
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
              The starting pillar of my stack — an AI career copilot where the frontend, backend, database, REST APIs and LLM calls first clicked together as one production system: Gemini RAG analysis, ATS verdicts, cover letters and job recon behind JWT-secured Express routes.
            </p>
            <p className="mt-1 text-[10px] sm:text-[11px] font-mono text-zinc-500 tracking-tight">
              Express :3120 &middot; Gemini + Gemma &middot; Pinecone RAG &middot; JWT &middot; SerpApi
            </p>
          </div>

          {/* Direct 3D Spatial Photo Interaction Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={toggleScanline}
              onMouseEnter={() => sound.hover()}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-space font-medium transition-all cursor-pointer backdrop-blur-md active:scale-95 ${
                isScanlineActive
                  ? "border-fuchsia-400/50 bg-fuchsia-400/15 text-fuchsia-300 shadow-[0_0_12px_rgba(217,70,239,0.25)]"
                  : "border-white/[0.1] bg-white/[0.03] text-zinc-400 hover:text-white hover:border-white/[0.2]"
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
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-space font-medium transition-all cursor-pointer backdrop-blur-md active:scale-95 ${
                isExploded
                  ? "border-fuchsia-400 bg-fuchsia-400 text-black font-bold shadow-[0_0_16px_rgba(217,70,239,0.35)]"
                  : "border-white/[0.1] bg-white/[0.03] text-zinc-400 hover:border-fuchsia-400/50 hover:text-white"
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
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.06] text-zinc-300 hover:border-fuchsia-400/50 hover:text-fuchsia-400 text-xs font-space font-medium transition-all cursor-pointer backdrop-blur-md active:scale-95"
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
              className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden border border-white/[0.12] bg-[#07070a] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] hover:border-fuchsia-400/40 transition-all duration-300"
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
                    background: `radial-gradient(circle 380px at ${cursorPos.x}% ${cursorPos.y}%, rgba(217, 70, 239, 0.14) 0%, transparent 65%)`,
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
                      alt="CareerForge AI Complete Career Copilot Architecture Blueprint"
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      preload
                      className="object-contain p-2 sm:p-4 filter contrast-[1.04]"
                    />

                    {/* Holographic Scanline LiDAR Sweep Beam */}
                    {isScanlineActive && (
                      <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-fuchsia-400 to-transparent shadow-[0_0_15px_#d946ef] pointer-events-none animate-scanline" />
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
                        <div className="w-8 h-8 border border-fuchsia-400/50 rounded-full flex items-center justify-center animate-pulse">
                          <span className="w-1.5 h-1.5 bg-fuchsia-400 rounded-full" />
                        </div>
                        <div className="absolute top-5 left-5 font-mono text-[9px] text-fuchsia-400 bg-black/85 px-1.5 py-0.5 rounded border border-fuchsia-400/30 whitespace-nowrap">
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
                        CAREER SPINE
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
                      className="px-2.5 py-1 rounded-lg border border-white/[0.1] bg-black/70 hover:border-fuchsia-400/50 hover:text-fuchsia-400 text-zinc-300 backdrop-blur-md transition-all cursor-pointer"
                      title="Zoom full resolution"
                    >
                      <span className="text-[9px] font-space uppercase tracking-wider">Zoom Fullscreen</span>
                    </button>
                  </div>

                  {/* Bottom Floating Telemetry Bar */}
                  <div className="flex items-end justify-between font-mono text-[10px] text-zinc-400 pointer-events-auto">
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/[0.08]">
                      <Terminal className="w-3 h-3 text-fuchsia-400" />
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

                {/* Precision Aerospace Corner Brackets */}
                <div className="absolute top-3 left-3 w-3.5 h-3.5 border-t border-l border-white/40 pointer-events-none" />
                <div className="absolute top-3 right-3 w-3.5 h-3.5 border-t border-r border-white/40 pointer-events-none" />
                <div className="absolute bottom-3 left-3 w-3.5 h-3.5 border-b border-l border-white/40 pointer-events-none" />
                <div className="absolute bottom-3 right-3 w-3.5 h-3.5 border-b border-r border-white/40 pointer-events-none" />
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
                          ? "text-black font-bold shadow-[0_0_16px_rgba(217,70,239,0.4)] scale-105"
                          : "border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] text-zinc-400 hover:text-white hover:border-white/[0.2]"
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
                        : "border-white/[0.15] bg-white/[0.04] hover:bg-white/[0.08] text-white hover:border-fuchsia-400 hover:text-fuchsia-400 active:scale-95"
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
                        : "border-white/[0.15] bg-white/[0.04] hover:bg-white/[0.08] text-white hover:border-fuchsia-400 hover:text-fuchsia-400 active:scale-95"
                    }`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Glowing Horizontal Rail Track Bar */}
              <div className="relative w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden p-[1px]">
                <motion.div
                  style={{ width: trackRailWidth }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="h-full bg-gradient-to-r from-fuchsia-500 via-violet-400 to-amber-200 rounded-full shadow-[0_0_8px_rgba(217,70,239,0.5)]"
                />
              </div>
            </div>

            {/* THE HORIZONTAL SLIDING CARD CONTAINER */}
            <div className="relative w-full overflow-hidden rounded-3xl border border-white/[0.1] bg-gradient-to-b from-[#0c0c12]/95 via-[#08080c]/95 to-[#050508]/95 backdrop-blur-xl shadow-2xl p-4 sm:p-5 min-h-[360px] flex flex-col justify-between before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:pointer-events-none">
              {/* Dynamic Accent Corner Flare */}
              <div
                className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl pointer-events-none transition-colors duration-500"
                style={{ backgroundColor: `${activeStage.accentColor}18` }}
              />
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
                          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                            <div className="flex items-center gap-2">
                              <span
                                className="p-1 sm:p-1.5 rounded-lg border"
                                style={{
                                  backgroundColor: `${stage.accentColor}15`,
                                  borderColor: `${stage.accentColor}40`,
                                  color: stage.accentColor,
                                }}
                              >
                                <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              </span>
                              <span
                                className="font-space text-xs font-bold uppercase tracking-widest"
                                style={{ color: stage.accentColor }}
                              >
                                {stage.index} &mdash; {stage.title}
                              </span>
                            </div>

                            <span className="font-mono text-2xl sm:text-3xl xl:text-4xl font-black bg-gradient-to-b from-white/[0.16] to-white/[0.02] bg-clip-text text-transparent select-none leading-none">
                              {stage.index}
                            </span>
                          </div>

                          <h4 className="font-syne text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
                            {stage.subtitle}
                          </h4>

                          <p className="mt-1.5 text-xs sm:text-[13px] text-zinc-300 font-sans leading-normal sm:leading-relaxed">
                            {stage.description}
                          </p>

                          {/* Subsystem Telemetry Metric Callout */}
                          <div className="mt-2.5 p-2 sm:p-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <span className="font-space text-[9px] sm:text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block truncate">
                                {stage.telemetry.metricLabel}
                              </span>
                              <span
                                className="font-mono text-xs font-bold truncate block"
                                style={{ color: stage.accentColor }}
                              >
                                {stage.telemetry.metricValue}
                              </span>
                            </div>
                            <span className="font-sans text-[10px] sm:text-[11px] text-zinc-400 text-right shrink-0">
                              {stage.telemetry.subtext}
                            </span>
                          </div>

                          {/* Highlights Bullet List (2-column responsive layout for 4 items) */}
                          <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1.5 font-sans text-xs text-zinc-200">
                            {stage.highlights.map((highlight, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <CheckCircle2
                                  className="w-3.5 h-3.5 mt-0.5 shrink-0"
                                  style={{ color: stage.accentColor }}
                                />
                                <span className="text-[11px] sm:text-xs leading-snug">{highlight}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Technologies Strip & Stage Action Footer */}
                        <div className="mt-3 pt-2.5 sm:pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
                          <div className="flex flex-wrap gap-1.5">
                            {stage.technologies.slice(0, 4).map((tech) => (
                              <span
                                key={tech}
                                className="px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-[10px] sm:text-[11px] font-space text-zinc-300 hover:border-white/20 hover:text-white transition-colors"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>

                          {i < STAGES.length - 1 ? (
                            <button
                              onClick={nextStage}
                              className="hidden sm:flex items-center gap-1 font-space text-xs text-fuchsia-400 hover:text-fuchsia-300 transition-colors cursor-pointer shrink-0"
                            >
                              <span>Next</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => selectStage(0)}
                              className="hidden sm:flex items-center gap-1 font-space text-xs text-zinc-400 hover:text-fuchsia-400 transition-colors cursor-pointer shrink-0"
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
          Portal to document.body ensures modal attaches to browser viewport directly
          ======================================================================= */}
      {mounted && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {showInfographicModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex flex-col p-2 sm:p-4 md:p-6 bg-black/95 backdrop-blur-xl"
              onClick={() => setShowInfographicModal(false)}
            >
              <motion.div
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.96, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full h-full max-w-7xl mx-auto flex flex-col rounded-2xl border border-white/[0.12] bg-[#08080c] shadow-2xl overflow-hidden min-h-0"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-white/[0.08] shrink-0">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-fuchsia-400" />
                    <h3 className="font-syne text-base sm:text-lg font-bold text-white tracking-tight">
                      CareerForge AI
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="hidden sm:inline-block font-mono text-[10px] text-zinc-500 uppercase tracking-wider px-2 py-0.5 rounded border border-white/[0.08]">
                      ESC to close
                    </span>
                    <button
                      onClick={() => {
                        sound.click();
                        setShowInfographicModal(false);
                      }}
                      className="p-1.5 rounded-full hover:bg-white/[0.1] text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      aria-label="Close modal"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Modal Image Canvas - Unconstrained aspect ratio, 100% object-contain, no cuts */}
                <div className="relative flex-1 min-h-0 w-full p-2 sm:p-4 md:p-6 flex items-center justify-center bg-black/40">
                  <div className="relative w-full h-full">
                    <Image
                      src={activePhoto}
                      alt="CareerForge AI Architecture"
                      fill
                      sizes="95vw"
                      priority
                      className="object-contain"
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
