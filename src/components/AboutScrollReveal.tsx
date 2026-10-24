"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { sound } from "@/components/SoundEffects";
import { ArrowDownToLine, ArrowUpRight } from "lucide-react";

function GithubIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedinIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

// Static paragraph words definitions to avoid reallocations
const P1_WORDS = [
  { text: "Motivated", isBold: false, isAccent: false },
  { text: "Autonomous", isBold: true, isAccent: false },
  { text: "AI", isBold: true, isAccent: false },
  { text: "Systems", isBold: true, isAccent: false },
  { text: "Architect", isBold: true, isAccent: false },
  { text: "and", isBold: false, isAccent: false },
  { text: "Backend", isBold: true, isAccent: false },
  { text: "Engineer", isBold: true, isAccent: false },
  { text: "skilled", isBold: false, isAccent: false },
  { text: "in", isBold: false, isAccent: false },
  { text: "designing", isBold: false, isAccent: false },
  { text: "deterministic", isBold: true, isAccent: false },
  { text: "multi-agent", isBold: true, isAccent: true },
  { text: "swarms,", isBold: true, isAccent: true },
  { text: "high-concurrency", isBold: false, isAccent: false },
  { text: "Python", isBold: false, isAccent: false },
  { text: "infrastructure,", isBold: false, isAccent: false },
  { text: "and", isBold: false, isAccent: false },
  { text: "real-time", isBold: false, isAccent: false },
  { text: "voice", isBold: false, isAccent: false },
  { text: "pipelines.", isBold: false, isAccent: false },
];

const P2_WORDS = [
  { text: "Hands-on", isBold: false, isAccent: false },
  { text: "experience", isBold: false, isAccent: false },
  { text: "developing", isBold: false, isAccent: false },
  { text: "production", isBold: false, isAccent: false },
  { text: "automation", isBold: false, isAccent: false },
  { text: "at", isBold: false, isAccent: false },
  { text: "Modelsuite.ai,", isBold: true, isAccent: false },
  { text: "orchestrating", isBold: false, isAccent: false },
  { text: "LangGraph", isBold: true, isAccent: true },
  { text: "workflows,", isBold: true, isAccent: true },
  { text: "and", isBold: false, isAccent: false },
  { text: "enforcing", isBold: false, isAccent: false },
  { text: "strict", isBold: false, isAccent: false },
  { text: "financial", isBold: false, isAccent: false },
  { text: "&", isBold: false, isAccent: false },
  { text: "state", isBold: false, isAccent: false },
  { text: "invariants", isBold: false, isAccent: false },
  { text: "across", isBold: false, isAccent: false },
  { text: "distributed", isBold: false, isAccent: false },
  { text: "vector", isBold: false, isAccent: false },
  { text: "architectures.", isBold: false, isAccent: false },
];

interface RevealWordProps {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
  isBold?: boolean;
  isAccent?: boolean;
  isMuted?: boolean;
}

function RevealWord({
  word,
  progress,
  range,
  isBold = false,
  isAccent = false,
  isMuted = false,
}: RevealWordProps) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  const x = useTransform(progress, range, [-6, 0]);

  return (
    <motion.span
      style={{ opacity, x }}
      className={`inline-block mr-[0.28em] transition-colors duration-150 ${
        isAccent
          ? "text-amber-400 font-bold"
          : isBold
          ? isMuted
            ? "text-zinc-200 font-medium"
            : "text-white font-semibold"
          : isMuted
          ? "text-zinc-400"
          : "text-zinc-300"
      }`}
    >
      {word}
    </motion.span>
  );
}

export default function AboutScrollReveal() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Bind scroll progress cleanly across the About entry section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.9", "center 0.45"],
  });

  // Stage 0: Index line & label (0.00 -> 0.14)
  const lineScaleX = useTransform(scrollYProgress, [0.0, 0.14], [0, 1]);
  const labelOpacity = useTransform(scrollYProgress, [0.0, 0.14], [0.2, 1]);
  const labelX = useTransform(scrollYProgress, [0.0, 0.14], [-10, 0]);

  // Stage 1: Headline words (0.10 -> 0.32)
  const hiOpacity = useTransform(scrollYProgress, [0.10, 0.20], [0.2, 1]);
  const hiX = useTransform(scrollYProgress, [0.10, 0.20], [-8, 0]);

  const imOpacity = useTransform(scrollYProgress, [0.16, 0.26], [0.2, 1]);
  const imX = useTransform(scrollYProgress, [0.16, 0.26], [-8, 0]);

  const bennyOpacity = useTransform(scrollYProgress, [0.22, 0.34], [0.2, 1]);
  const bennyX = useTransform(scrollYProgress, [0.22, 0.34], [-8, 0]);

  // Stage 4: Action Buttons glide in (0.84 -> 0.98)
  const buttonsOpacity = useTransform(scrollYProgress, [0.84, 0.98], [0.25, 1]);
  const buttonsX = useTransform(scrollYProgress, [0.84, 0.98], [-12, 0]);

  // Word step calculations
  const p1Start = 0.30;
  const p1End = 0.60;
  const p1Step = (p1End - p1Start) / P1_WORDS.length;

  const p2Start = 0.58;
  const p2End = 0.88;
  const p2Step = (p2End - p2Start) / P2_WORDS.length;

  return (
    <div ref={containerRef} className="lg:col-span-5 flex flex-col justify-between">
      <div>
        {/* Index & Section Label with Left-to-Right Draw & Slide */}
        <div className="flex items-center gap-3 font-mono text-xs font-bold text-amber-400 uppercase tracking-widest mb-4">
          <motion.span
            style={{ scaleX: lineScaleX, originX: 0 }}
            className="w-6 h-[2px] bg-amber-400 inline-block"
          />
          <motion.span style={{ opacity: labelOpacity, x: labelX }}>
            01 &mdash; ABOUT
          </motion.span>
        </div>

        {/* Headline with Clean Left-to-Right Word Reveal */}
        <h2 className="font-syne text-3xl sm:text-4xl xl:text-5xl font-extrabold tracking-tight leading-[1.14]">
          <motion.span
            style={{ opacity: hiOpacity, x: hiX }}
            className="inline-block mr-[0.25em] text-white"
          >
            Hi,
          </motion.span>
          <motion.span
            style={{ opacity: imOpacity, x: imX }}
            className="inline-block mr-[0.25em] text-white"
          >
            I&apos;m
          </motion.span>
          <motion.span
            style={{ opacity: bennyOpacity, x: bennyX }}
            className="inline-block text-amber-400"
          >
            Bennyhinn.
          </motion.span>
        </h2>

        {/* Paragraph 1: Word-by-Word Scroll Reveal */}
        <p className="mt-5 text-sm sm:text-base leading-relaxed font-sans">
          {P1_WORDS.map((item, index) => {
            const start = p1Start + index * p1Step;
            const end = Math.min(start + p1Step * 1.5, 1.0);
            return (
              <RevealWord
                key={index}
                word={item.text}
                progress={scrollYProgress}
                range={[start, end]}
                isBold={item.isBold}
                isAccent={item.isAccent}
                isMuted={false}
              />
            );
          })}
        </p>

        {/* Paragraph 2: Word-by-Word Scroll Reveal */}
        <p className="mt-3.5 text-xs sm:text-sm leading-relaxed font-sans">
          {P2_WORDS.map((item, index) => {
            const start = p2Start + index * p2Step;
            const end = Math.min(start + p2Step * 1.5, 1.0);
            return (
              <RevealWord
                key={index}
                word={item.text}
                progress={scrollYProgress}
                range={[start, end]}
                isBold={item.isBold}
                isAccent={item.isAccent}
                isMuted={true}
              />
            );
          })}
        </p>
      </div>

      {/* Action Buttons: Smooth Reveal */}
      <motion.div
        style={{ opacity: buttonsOpacity, x: buttonsX }}
        className="mt-8 flex flex-wrap items-center gap-3"
      >
        <a
          href="/resumes/Benny_resume_general.pdf"
          download="Bennyhinn_Bezawada_Resume.pdf"
          onClick={() => sound.click()}
          onMouseEnter={() => sound.hover()}
          className="px-5 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-space font-bold text-xs tracking-wide shadow-lg shadow-amber-400/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
        >
          <span>R&eacute;sum&eacute;</span>
          <ArrowDownToLine className="w-3.5 h-3.5 stroke-[2.5]" />
        </a>

        <a
          href="https://github.com/Benny45123"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => sound.click()}
          onMouseEnter={() => sound.hover()}
          className="px-4 py-2.5 rounded-full border border-white/[0.15] bg-white/[0.04] hover:bg-white/[0.1] text-white font-space text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer group"
        >
          <GithubIcon className="w-3.5 h-3.5 text-zinc-300" />
          <span>GitHub</span>
          <ArrowUpRight className="w-3 h-3 text-zinc-400 group-hover:text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </a>

        <a
          href="https://linkedin.com/in/benny-hinn-bezawada-58411331a"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => sound.click()}
          onMouseEnter={() => sound.hover()}
          className="px-4 py-2.5 rounded-full border border-white/[0.15] bg-white/[0.04] hover:bg-white/[0.1] text-white font-space text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer group"
        >
          <LinkedinIcon className="w-3.5 h-3.5 text-blue-400" />
          <span>LinkedIn</span>
          <ArrowUpRight className="w-3 h-3 text-zinc-400 group-hover:text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </a>
      </motion.div>
    </div>
  );
}
