"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

interface FactRowProps {
  label: string;
  value: React.ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
}

function FactRow({ label, value, progress, range }: FactRowProps) {
  const lineScaleX = useTransform(progress, range, [0, 1]);
  const opacity = useTransform(progress, range, [0.2, 1]);
  const x = useTransform(progress, range, [-6, 0]);

  return (
    <div className="relative pb-3">
      <motion.div
        style={{ opacity, x }}
        className="flex justify-between items-baseline text-xs font-space"
      >
        <span className="text-zinc-500 font-mono">{label}</span>
        {value}
      </motion.div>
      <motion.div
        style={{ scaleX: lineScaleX, originX: 0 }}
        className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/[0.07]"
      />
    </div>
  );
}

interface QuoteWordProps {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
  isAccent?: boolean;
}

function QuoteWord({ word, progress, range, isAccent = false }: QuoteWordProps) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  const x = useTransform(progress, range, [-4, 0]);

  return (
    <motion.span
      style={{ opacity, x }}
      className={`inline-block mr-[0.25em] transition-colors duration-150 ${
        isAccent ? "text-amber-400 font-semibold" : "text-zinc-300"
      }`}
    >
      {word}
    </motion.span>
  );
}

const QUOTE_WORDS = [
  { text: "“From", isAccent: false },
  { text: "autonomous", isAccent: true },
  { text: "agent", isAccent: true },
  { text: "reasoning", isAccent: false },
  { text: "to", isAccent: false },
  { text: "deterministic", isAccent: false },
  { text: "backend", isAccent: true },
  { text: "execution.”", isAccent: true },
];

export default function AboutQuickFacts() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.9", "center 0.45"],
  });

  // Header animations
  const headerOpacity = useTransform(scrollYProgress, [0.0, 0.14], [0.2, 1]);
  const headerX = useTransform(scrollYProgress, [0.0, 0.14], [-8, 0]);
  const dotScale = useTransform(scrollYProgress, [0.0, 0.12], [0, 1]);

  // Quote divider & container animation
  const quoteDividerScaleX = useTransform(scrollYProgress, [0.64, 0.76], [0, 1]);

  // Quote words step calculations
  const quoteStart = 0.70;
  const quoteEnd = 0.94;
  const quoteStep = (quoteEnd - quoteStart) / QUOTE_WORDS.length;

  return (
    <div
      ref={containerRef}
      className="lg:col-span-3 flex flex-col justify-between h-full space-y-6"
    >
      <div>
        {/* Header with animated amber indicator & glide */}
        <motion.div
          style={{ opacity: headerOpacity, x: headerX }}
          className="font-mono text-xs font-bold text-zinc-400 uppercase tracking-widest mb-6 flex items-center gap-2"
        >
          <motion.span
            style={{ scale: dotScale }}
            className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block shadow-[0_0_8px_rgba(245,158,11,0.6)]"
          />
          <span>QUICK FACTS</span>
        </motion.div>

        {/* Facts List with row-by-row scroll reveal */}
        <div className="space-y-4">
          <FactRow
            label="Based in"
            value={<span className="text-white font-semibold text-right">Guntur / AP, India</span>}
            progress={scrollYProgress}
            range={[0.10, 0.22]}
          />

          <FactRow
            label="Studying"
            value={<span className="text-white font-semibold text-right">B.Tech, CSE (IoT/Cyber)</span>}
            progress={scrollYProgress}
            range={[0.20, 0.32]}
          />

          <FactRow
            label="Batch"
            value={<span className="text-emerald-400 font-mono font-semibold text-right">2023 &ndash; 2027</span>}
            progress={scrollYProgress}
            range={[0.30, 0.42]}
          />

          <FactRow
            label="Interned at"
            value={<span className="text-white font-semibold text-right">Modelsuite.ai &bull; 2026</span>}
            progress={scrollYProgress}
            range={[0.40, 0.52]}
          />

          <FactRow
            label="Focus"
            value={<span className="text-amber-400 font-semibold text-right">Full Stack &bull; AI &bull; Web</span>}
            progress={scrollYProgress}
            range={[0.50, 0.62]}
          />
        </div>
      </div>

      {/* Signature Tagline Quote with expanding divider and word-by-word reveal */}
      <div className="relative pt-4">
        <motion.div
          style={{ scaleX: quoteDividerScaleX, originX: 0 }}
          className="absolute top-0 left-0 right-0 h-[1px] bg-white/[0.08]"
        />

        <p className="font-syne italic text-sm sm:text-base leading-snug">
          {QUOTE_WORDS.map((item, index) => {
            const start = quoteStart + index * quoteStep;
            const end = Math.min(start + quoteStep * 1.5, 1.0);
            return (
              <QuoteWord
                key={index}
                word={item.text}
                progress={scrollYProgress}
                range={[start, end]}
                isAccent={item.isAccent}
              />
            );
          })}
        </p>
      </div>
    </div>
  );
}
