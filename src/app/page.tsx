"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import HeadTurnHero, { HeadTurnAPI } from "@/components/HeadTurnHero";
import WaterRippleBackground from "@/components/WaterRippleBackground";
import InteractiveWaveText from "@/components/InteractiveWaveText";
import AboutIdCard from "@/components/AboutIdCard";
import AboutScrollReveal from "@/components/AboutScrollReveal";
import AboutQuickFacts from "@/components/AboutQuickFacts";
import AgenticVideoPipelineShowcase from "@/components/AgenticVideoPipelineShowcase";
import AgenticMerchantOSShowcase from "@/components/AgenticMerchantOSShowcase";
import GovTransparencyRagShowcase from "@/components/GovTransparencyRagShowcase";
import PortfolioScrollEntrance from "@/components/PortfolioScrollEntrance";
import { motion, useReducedMotion } from "framer-motion";
import { sound } from "@/components/SoundEffects";
import {
  ArrowUpRight,
  Box,
  Check,
  Copy,
  Mail,
  Sparkles,
  Database,
  Zap,
} from "lucide-react";

export default function Home() {
  const prefersReducedMotion = useReducedMotion();
  const [headTurnApi, setHeadTurnApi] = useState<HeadTurnAPI | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleResetPose = () => {
    if (!headTurnApi) return;
    sound.click();
    headTurnApi.reset();
  };

  const copyEmailToClipboard = () => {
    sound.click();
    navigator.clipboard.writeText("bennyhinn.bezawada@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2400);
  };

  return (
    <div className="relative min-h-screen bg-[#000000] text-[#f4f4f6] selection:bg-amber-400 selection:text-black overflow-x-clip">
      {/* Interactive Water Ripple & Curve Motion Canvas (Excludes the Face Stage) */}
      <WaterRippleBackground excludeId="hero-character-stage" />

      {/* Background Architectural Ambient Lighting */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[750px] bg-[radial-gradient(circle_at_center,_rgba(245,158,11,0.09)_0%,_rgba(0,0,0,0)_70%)] blur-3xl opacity-80" />
        <div className="absolute inset-0 subtle-grid opacity-20" />
      </div>

      <Navbar />

      {/* =========================================================================
          HERO COVER PAGE (Unobstructed Centered Face + Non-Overlapping Controls)
          ========================================================================= */}
      <section
        id="intro"
        className="relative z-10 w-full min-h-screen flex flex-col justify-between pt-24 pb-8 px-6 sm:px-12 max-w-7xl 2xl:max-w-[1500px] mx-auto overflow-hidden"
      >
        {/* =========================================================================
            CENTER STAGE: GRAND 3D FACE WITH INTERACTIVE NAME DIRECTLY BEHIND IT
            ========================================================================= */}
        <div className="relative flex-1 flex items-center justify-center my-auto min-h-[58vh] sm:min-h-[68vh] w-full">
          {/* BACKGROUND NAME & HALO: DIRECTLY CENTERING BEHIND THE 3D AVATAR */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto select-none z-0 px-4">
            {/* Ambient Spotlight Halo behind Benny's head */}
            <div className="w-[500px] sm:w-[650px] h-[500px] sm:h-[650px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(245,158,11,0.25)_0%,_rgba(245,158,11,0.06)_45%,_transparent_72%)] blur-3xl pointer-events-none" />

            {/* Interactive Wave & Magnification Typography directly behind head/shoulders */}
            <div className="relative z-0 flex items-center justify-center w-full max-w-full overflow-visible -translate-y-6 sm:-translate-y-12">
              <InteractiveWaveText
                text="BENNYHINN"
                className="text-5xl sm:text-7xl md:text-8xl lg:text-[9.5vw] xl:text-[10vw] tracking-[0.05em]"
              />
            </div>
          </div>

          {/* 3D CHARACTER STAGE IN FRONT OF THE TEXT WITH SCREEN BLEND */}
          <div
            id="hero-character-stage"
            className="relative z-10 w-full max-w-[680px] lg:max-w-[760px] aspect-[16/10] sm:aspect-[16/9] flex items-center justify-center pointer-events-auto"
            style={{
              mixBlendMode: "screen",
            }}
          >
            {/* The 3D Headturn Canvas with Natural Top & Bottom Fade */}
            <div
              className="relative w-full h-full overflow-hidden flex items-center justify-center"
              style={{
                maskImage: "linear-gradient(to bottom, transparent 0%, black 14%, black 84%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 14%, black 84%, transparent 100%)",
              }}
            >
              <HeadTurnHero
                src="/headturn"
                area="window"
                fit="contain"
                className="w-full h-full cursor-grab active:cursor-grabbing"
                onReady={(api) => setHeadTurnApi(api)}
                onError={(err) => console.error("HeadTurn initialization error:", err)}
              />
            </div>
          </div>
        </div>

        {/* =========================================================================
            UPPER-LEFT: COMPACT INTRO ("HELLO, I AM BENNYHINN") JUST LEFT OF BENNY
            ========================================================================= */}
        <div className="absolute top-28 sm:top-32 md:top-36 lg:top-40 left-4 sm:left-8 lg:left-12 xl:left-16 z-20 max-w-[270px] sm:max-w-[290px] p-4 sm:p-5 rounded-2xl border border-white/[0.08] bg-[#070709]/85 backdrop-blur-md shadow-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="font-space text-[10px] font-bold text-amber-400 uppercase tracking-widest">
              AI Architect
            </span>
          </div>

          <h2 className="font-syne text-xl sm:text-2xl font-extrabold text-white leading-tight">
            Hello, I am <br />
            <span className="text-amber-400">Bennyhinn Bezawada</span>
          </h2>

          <p className="mt-2 text-xs text-zinc-400 font-sans leading-relaxed">
            Engineering deterministic agentic AI swarms & high-throughput backends.
          </p>

          <div className="mt-3.5 flex items-center gap-2.5">
            <a
              href="#contact"
              onClick={() => sound.click()}
              onMouseEnter={() => sound.hover()}
              className="px-4 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-space font-bold text-xs tracking-wide shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              Hire Me
            </a>

            <a
              href="#portfolio"
              onClick={() => sound.click()}
              onMouseEnter={() => sound.hover()}
              className="flex items-center gap-1 px-3 py-2 rounded-full border border-white/[0.15] bg-white/[0.04] hover:bg-white/[0.1] text-white font-space text-xs font-semibold transition-all cursor-pointer group"
            >
              <span>Portfolio</span>
              <ArrowUpRight className="w-3 h-3 text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>

        {/* =========================================================================
            UPPER-RIGHT: COMPACT CAPABILITIES & METRICS JUST RIGHT OF BENNY
            ========================================================================= */}
        <div className="hidden md:flex absolute top-28 sm:top-32 md:top-36 lg:top-40 right-4 sm:right-8 lg:right-12 xl:right-16 z-20 flex-col gap-2 max-w-[240px] p-4 sm:p-5 rounded-2xl border border-white/[0.08] bg-[#070709]/85 backdrop-blur-md shadow-2xl">
          <div className="flex items-center justify-between pb-1.5 border-b border-white/[0.06]">
            <span className="font-mono text-[10px] text-zinc-500 uppercase">Core Focus</span>
            <span className="font-mono text-[10px] text-emerald-400">Open to Work</span>
          </div>

          <div className="grid grid-cols-2 gap-3 py-1">
            <div>
              <div className="font-syne text-2xl font-bold text-white">700+</div>
              <div className="font-space text-[10px] text-zinc-400">DSA Solved</div>
            </div>
            <div>
              <div className="font-syne text-2xl font-bold text-amber-400">06+</div>
              <div className="font-space text-[10px] text-zinc-400">Shipped Projects</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-white/[0.06]">
            <span className="px-2 py-0.5 rounded bg-white/[0.05] text-[9px] font-space text-zinc-300">Agentic AI</span>
            <span className="px-2 py-0.5 rounded bg-white/[0.05] text-[9px] font-space text-zinc-300">LangGraph</span>
            <span className="px-2 py-0.5 rounded bg-white/[0.05] text-[9px] font-space text-zinc-300">FastAPI</span>
          </div>
        </div>

        {/* Bottom Hero Bar */}
        <div className="pt-4 border-t border-white/[0.06] flex items-center justify-end text-xs font-mono text-zinc-500 z-20">
          <a
            href="#portfolio"
            onClick={() => sound.click()}
            onMouseEnter={() => sound.hover()}
            className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Explore Portfolio</span>
            <span>&darr;</span>
          </a>
        </div>
      </section>

      {/* =========================================================================
          SECTION: ABOUT BENNY
          ========================================================================= */}
      <section
        id="about"
        className="relative z-10 py-28 px-6 sm:px-12 max-w-7xl 2xl:max-w-[1440px] mx-auto border-t border-white/[0.08]"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-center">
          {/* ===================================================================
              LEFT COLUMN: ABOUT BIOGRAPHY & ACTION BUTTONS (SCROLL REVEAL)
              =================================================================== */}
          <AboutScrollReveal />

          {/* ===================================================================
              MIDDLE COLUMN: 3D FLIPPING JOB ID CARD WITH LANYARD CLIP
              =================================================================== */}
          <div className="lg:col-span-4 flex justify-center my-4 lg:my-0">
            <AboutIdCard />
          </div>

          {/* ===================================================================
              RIGHT COLUMN: QUICK FACTS & BIO METRICS + TAGLINE QUOTE (SCROLL REVEAL)
              =================================================================== */}
          <AboutQuickFacts />
        </div>
      </section>


      {/* =========================================================================
          SECTION: PORTFOLIO (WITH KINETIC SWIPE-UP REVEAL)
          ========================================================================= */}
      <section id="portfolio" className="relative z-10 py-24 sm:py-28 px-4 sm:px-8 lg:px-12 max-w-7xl 2xl:max-w-[1500px] mx-auto border-t border-white/[0.08]">
        <div id="work" className="absolute -top-24 pointer-events-none" />

        {/* Portfolio Section with Bidirectional Swipe-Up / Swipe-Down Scroll Motion */}
        <PortfolioScrollEntrance>
          {/* Project 01: Agentic AI Video Pipeline (Visual Centerpiece) */}
          <AgenticVideoPipelineShowcase />

          {/* Project 02: Agentic Merchant OS (Technical Centerpiece) */}
          <AgenticMerchantOSShowcase />

          {/* Project 03: Gov-Transparency RAG (Forensic Intelligence) */}
          <GovTransparencyRagShowcase />
        </PortfolioScrollEntrance>

        {/* =========================================================================
            SECTION: EXPERIENCE & CORE STACK
            ========================================================================= */}
        <div id="experience" className="pt-16 border-t border-white/[0.08] scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <span className="font-mono text-xs text-amber-400 uppercase tracking-wider block mb-1 font-medium">
                Production Background
              </span>
              <h3 className="font-syne text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Experience &amp; Stack
              </h3>
            </div>
            <p className="mt-3 sm:mt-0 font-space text-xs text-zinc-400">
              Autonomous agent architectures, distributed Python backends, and spatial systems.
            </p>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-7 rounded-2xl border border-white/[0.08] bg-[#08080b] hover:border-amber-400/40 transition-colors">
            <h3 className="font-space text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Agentic AI & Swarms
            </h3>
            <ul className="space-y-3 font-mono text-xs text-zinc-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                LangGraph State Machines
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Deterministic Tool Execution
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Multi-Agent Swarm Coordination
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Semantic Chunking & Reranking
              </li>
            </ul>
          </div>

          <div className="p-7 rounded-2xl border border-white/[0.08] bg-[#08080b] hover:border-amber-400/40 transition-colors">
            <h3 className="font-space text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Database className="w-4 h-4 text-amber-400" />
              Backend & Concurrency
            </h3>
            <ul className="space-y-3 font-mono text-xs text-zinc-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Python (FastAPI, AsyncIO)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                PostgreSQL & Redis Streams
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Distributed Vector Databases
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                WebSocket Token Streaming
              </li>
            </ul>
          </div>

          <div className="p-7 rounded-2xl border border-white/[0.08] bg-[#08080b] hover:border-cyan-400/40 transition-colors">
            <h3 className="font-space text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Spatial & Creative Tech
            </h3>
            <ul className="space-y-3 font-mono text-xs text-zinc-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                Next.js 16 (App Router)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                Three.js & WebGL Shaders
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                Head-Tracking Frame Streaming
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                Procedural Web Audio API
              </li>
            </ul>
          </div>
        </div>
      </div>
      </section>

      {/* =========================================================================
          SECTION: FEATURED ARCHITECTURES & SYSTEMS
          ========================================================================= */}
      <section id="architectures" className="relative z-10 py-28 px-6 sm:px-12 max-w-7xl mx-auto border-t border-white/[0.08]">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 font-space text-xs font-bold text-amber-400 uppercase tracking-widest mb-3">
              <span className="w-6 h-[2px] bg-amber-400" />
              <span>Architectures</span>
            </div>
            <h2 className="font-syne text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              FEATURED ARCHITECTURES
            </h2>
          </div>

          <Link
            href="/viewer"
            onClick={() => sound.click()}
            onMouseEnter={() => sound.hover()}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-space text-xs font-medium transition-all"
          >
            <Box className="w-3.5 h-3.5" />
            <span>Open 3D Mesh Inspector</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Project 1 */}
          <div className="group p-8 rounded-3xl border border-white/[0.08] bg-[#07070a] hover:border-amber-400/40 transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[11px] text-amber-400 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20">
                MULTI-AGENT SWARM
              </span>
              <span className="font-mono text-xs text-zinc-500">01 / 04</span>
            </div>
            <h3 className="font-syne text-2xl font-bold text-white group-hover:text-amber-300 transition-colors">
              NexusAgent // Autonomous Reasoning Mesh
            </h3>
            <p className="mt-3 text-sm text-zinc-400 leading-relaxed font-sans">
              Hierarchical multi-agent system utilizing LangGraph and custom state machines. Features deterministic tool-calling validation, rollback checkpoints, and sandboxed Python code interpreters.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 font-mono text-[11px] text-zinc-400">
              <span className="px-2.5 py-1 rounded-md bg-white/[0.04]">LangGraph</span>
              <span className="px-2.5 py-1 rounded-md bg-white/[0.04]">FastAPI</span>
              <span className="px-2.5 py-1 rounded-md bg-white/[0.04]">Redis Pub/Sub</span>
              <span className="px-2.5 py-1 rounded-md bg-white/[0.04]">Docker</span>
            </div>
          </div>

          {/* Project 2 */}
          <div className="group p-8 rounded-3xl border border-white/[0.08] bg-[#07070a] hover:border-amber-400/40 transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[11px] text-amber-400 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20">
                RETRIEVAL ENGINE
              </span>
              <span className="font-mono text-xs text-zinc-500">02 / 04</span>
            </div>
            <h3 className="font-syne text-2xl font-bold text-white group-hover:text-amber-300 transition-colors">
              AuraRAG // Grounded Deterministic Search
            </h3>
            <p className="mt-3 text-sm text-zinc-400 leading-relaxed font-sans">
              High-precision hybrid retrieval architecture combining dense vectors and sparse BM25 indexing with cross-encoder re-ranking. Eliminates hallucinations with strict semantic boundary gates.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 font-mono text-[11px] text-zinc-400">
              <span className="px-2.5 py-1 rounded-md bg-white/[0.04]">Qdrant / Milvus</span>
              <span className="px-2.5 py-1 rounded-md bg-white/[0.04]">ColBERT</span>
              <span className="px-2.5 py-1 rounded-md bg-white/[0.04]">Hybrid BM25</span>
              <span className="px-2.5 py-1 rounded-md bg-white/[0.04]">Python 3.12</span>
            </div>
          </div>

          {/* Project 3 */}
          <div className="group p-8 rounded-3xl border border-white/[0.08] bg-[#07070a] hover:border-amber-400/40 transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[11px] text-amber-400 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20">
                STREAMING BACKEND
              </span>
              <span className="font-mono text-xs text-zinc-500">03 / 04</span>
            </div>
            <h3 className="font-syne text-2xl font-bold text-white group-hover:text-amber-300 transition-colors">
              NeuroStream // Distributed Event Pipeline
            </h3>
            <p className="mt-3 text-sm text-zinc-400 leading-relaxed font-sans">
              Real-time WebSocket token streaming pipeline handling concurrent multi-tenant LLM responses. Delivers chunked token diffs with zero backpressure and automated client reconnections.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 font-mono text-[11px] text-zinc-400">
              <span className="px-2.5 py-1 rounded-md bg-white/[0.04]">WebSockets</span>
              <span className="px-2.5 py-1 rounded-md bg-white/[0.04]">AsyncIO</span>
              <span className="px-2.5 py-1 rounded-md bg-white/[0.04]">Redis Cluster</span>
            </div>
          </div>

          {/* Project 4 */}
          <div className="group p-8 rounded-3xl border border-white/[0.08] bg-[#07070a] hover:border-cyan-400/40 transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[11px] text-cyan-400 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20">
                SPATIAL ENGINEERING
              </span>
              <span className="font-mono text-xs text-zinc-500">04 / 04</span>
            </div>
            <h3 className="font-syne text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">
              HeadTurn & SpatialAvatar // WebGL Rig
            </h3>
            <p className="mt-3 text-sm text-zinc-400 leading-relaxed font-sans">
              Ultra-lightweight multi-tier avatar streaming system rendering smooth 60 FPS head-tracking, smiling, and pitch transitions in pure AVIF/WebP sequences with zero layout shift.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 font-mono text-[11px] text-zinc-400">
              <span className="px-2.5 py-1 rounded-md bg-white/[0.04]">Next.js 16</span>
              <span className="px-2.5 py-1 rounded-md bg-white/[0.04]">Three.js</span>
              <span className="px-2.5 py-1 rounded-md bg-white/[0.04]">Web Audio API</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION: CONTACT & COLLABORATION
          ========================================================================= */}
      <section id="contact" className="relative z-10 py-28 px-6 sm:px-12 max-w-7xl mx-auto border-t border-white/[0.08]">
        <div className="p-8 sm:p-14 rounded-3xl border border-white/[0.1] bg-gradient-to-b from-[#09090d] to-[#040406] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/[0.07] blur-3xl pointer-events-none" />

          <div className="max-w-2xl">
            <span className="font-space text-xs font-bold text-amber-400 uppercase tracking-widest mb-3 inline-block">
              Let&apos;s Connect
            </span>
            <h2 className="font-syne text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.1]">
              LET&apos;S ARCHITECT THE NEXT BREAKTHROUGH SYSTEM.
            </h2>
            <p className="mt-4 text-sm sm:text-base text-zinc-300 leading-relaxed font-sans">
              Available for autonomous AI agent architectures, high-performance distributed backends,
              and creative engineering roles.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={copyEmailToClipboard}
                onMouseEnter={() => sound.hover()}
                className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-space font-bold text-xs tracking-wider shadow-[0_10px_25px_-5px_rgba(245,158,11,0.4)] transition-all cursor-pointer"
              >
                {copiedEmail ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedEmail ? "EMAIL COPIED TO CLIPBOARD" : "COPY DIRECT EMAIL"}</span>
              </button>

              <a
                href="mailto:bennyhinn.bezawada@gmail.com"
                onClick={() => sound.click()}
                onMouseEnter={() => sound.hover()}
                className="flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/[0.15] bg-white/[0.04] hover:bg-white/[0.08] text-white font-space text-xs tracking-wider transition-all cursor-pointer"
              >
                <Mail className="w-4 h-4 text-zinc-400" />
                <span>OPEN EMAIL CLIENT</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 font-space text-xs text-zinc-500">
          <div>
            &copy; 2026 Bennyhinn Bezawada. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <a href="#intro" onClick={() => sound.click()} className="hover:text-amber-400 transition-colors">
              Back to Intro &uarr;
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
