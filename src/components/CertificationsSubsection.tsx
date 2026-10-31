"use client";

import React, { useState } from "react";
import { sound } from "@/components/SoundEffects";
import {
  ExternalLink,
  Award,
  Trophy,
  CheckCircle2,
  Terminal,
  Cpu,
  Cloud,
  Bot,
  Sparkles,
  GitBranch,
} from "lucide-react";

interface AuthenticCredential {
  id: string;
  title: string;
  issuer: string;
  year: string;
  category: string;
  badgeLabel: string;
  verifyUrl: string;
  accentColor: string;
  glowColor: string;
  icon: React.ReactNode;
  highlights: string[];
}

const AUTHENTIC_CREDENTIALS: AuthenticCredential[] = [
  {
    id: "aws-future-ai",
    title: "AWS Future AI Nanodegree",
    issuer: "Udacity & AWS",
    year: "2026",
    category: "Generative AI & Cloud",
    badgeLabel: "Official Nanodegree",
    verifyUrl: "https://www.udacity.com/certificate/e/c7e95068-900d-11f1-a5ae-d349268c5928",
    accentColor: "#FF9900",
    glowColor: "rgba(255,153,0,0.35)",
    icon: <Cloud className="w-5 h-5 text-amber-500" />,
    highlights: ["Foundation Models", "Cloud AI Serving", "Generative Pipelines", "AWS Bedrock & SageMaker"],
  },
  {
    id: "huggingface-agents",
    title: "AI Agents Certification",
    issuer: "Hugging Face",
    year: "2026",
    category: "Autonomous Systems",
    badgeLabel: "Verified Agent Specialist",
    verifyUrl: "https://drive.google.com/file/d/1waH5wqz13PvXwMIxx1yUuMMZ92Mpz2hc/view?usp=sharing",
    accentColor: "#FFD21E",
    glowColor: "rgba(255,210,30,0.35)",
    icon: <Bot className="w-5 h-5 text-yellow-400" />,
    highlights: ["Multi-Agent Reasoning", "Tool Calling Protocols", "LangGraph & SMOLAgents", "Open-Weights Inference"],
  },
  {
    id: "aws-ai-practitioner",
    title: "AWS AI Practitioner Challenge",
    issuer: "Amazon Web Services (AWS)",
    year: "2026",
    category: "Cloud Machine Learning",
    badgeLabel: "AWS Verified",
    verifyUrl: "https://drive.google.com/file/d/19ihVcpFcXWAq1gs8zmUwqc01wY4LmnjI/view?usp=sharing",
    accentColor: "#38BDF8",
    glowColor: "rgba(56,189,248,0.35)",
    icon: <Cpu className="w-5 h-5 text-cyan-400" />,
    highlights: ["Cloud AI Architecture", "Serverless LLM Endpoints", "IAM & Model Security", "Scalable Inference"],
  },
  {
    id: "codeverse-gold",
    title: "Gold Medal Champion",
    issuer: "CodeVerse National Hackathon",
    year: "2025",
    category: "1st Place Winner",
    badgeLabel: "National Gold",
    verifyUrl: "https://drive.google.com/file/d/1tyRb81rFs89gIYD_gyNDJl7hGynK1d8Y/view?usp=sharing",
    accentColor: "#F59E0B",
    glowColor: "rgba(245,158,11,0.35)",
    icon: <Trophy className="w-5 h-5 text-amber-400" />,
    highlights: ["1st Place Gold Medal", "Autonomous Agent Architecture", "Rapid Hackathon Delivery", "Live Judging Win"],
  },
  {
    id: "nexora-winner",
    title: "Cash Prize & Winner",
    issuer: "Nexora Full-Stack Expo",
    year: "2026",
    category: "Full-Stack Engineering",
    badgeLabel: "Expo Award Winner",
    verifyUrl: "https://drive.google.com/file/d/16_VrXSJ7tcVwKQa2Yw2AiWcraAwOG_jG/view?usp=sharing",
    accentColor: "#34D399",
    glowColor: "rgba(52,211,153,0.35)",
    icon: <Award className="w-5 h-5 text-emerald-400" />,
    highlights: ["Winner Cash Prize Award", "High-Throughput Web Architecture", "Real-Time Systems", "Production Standards"],
  },
  {
    id: "synapse-top100",
    title: "Top-100 National Ranker",
    issuer: "Data & AI Challenge (Synapse Stack)",
    year: "2025",
    category: "Competitive AI Engineering",
    badgeLabel: "Top 100 / 100K Pool",
    verifyUrl: "https://github.com/Benny45123/data-and-ai-challenge-synapse-stack",
    accentColor: "#A78BFA",
    glowColor: "rgba(167,139,250,0.35)",
    icon: <GitBranch className="w-5 h-5 text-purple-400" />,
    highlights: ["Top-100 among 100,000+ candidates", "Synapse Stack Architecture", "High-Scale Data Pipelines", "Open Source Code"],
  },
];

export default function CertificationsSubsection() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div id="certifications" className="pt-24 scroll-mt-24">
      {/* =====================================================================
          SUBSECTION HEADER: 03 / CERTIFICATIONS & ACHIEVEMENTS
          ===================================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)] animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold">
              Subsection 03 &bull; Proof &amp; Accreditations
            </span>
          </div>

          <h3 className="font-space text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white leading-none">
            Certifications &amp; Honors
          </h3>
        </div>

        <div className="max-w-md">
          <p className="text-sm sm:text-base text-zinc-300 font-sans leading-relaxed">
            Verified credentials from AWS, Udacity, Hugging Face, national hackathon gold medals, and competitive problem-solving records.
          </p>
        </div>
      </div>

      {/* =====================================================================
          TOP BENTO HIGHLIGHTS: 700+ DSA & 23+ SHIPPED PROJECTS
          ===================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
        {/* Card 1: 700+ DSA Problems Solved in Java & Python */}
        <a
          href="https://leetcode.com/u/Benny6300"
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => sound.hover()}
          onClick={() => sound.click()}
          className="md:col-span-6 p-7 sm:p-8 rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#0c0d16] via-[#08080c] to-[#0c0d16] hover:border-amber-400/50 transition-all duration-300 relative overflow-hidden group cursor-pointer shadow-xl flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-60 h-60 bg-amber-500/[0.08] blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-300 font-mono text-xs font-bold">
                <Terminal className="w-3.5 h-3.5" />
                <span>LEETCODE &bull; BENNY6300</span>
              </div>
              <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 transition-colors" />
            </div>

            <div className="flex items-baseline gap-3 mb-2">
              <span className="font-space text-5xl sm:text-6xl font-extrabold text-white tracking-tight bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                700+
              </span>
              <span className="font-mono text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                Problems Solved
              </span>
            </div>

            <h4 className="font-space text-lg font-bold text-white mb-2">
              Data Structures &amp; Algorithmic Mastery
            </h4>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed mb-6">
              Advanced DSA proficiency in Java &amp; Python spanning graph state topologies, dynamic programming, and binary search trees.
            </p>
          </div>

          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between font-mono text-[11px] text-zinc-400">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Java &bull; Python
            </span>
            <span className="text-amber-400 font-semibold group-hover:underline flex items-center gap-1">
              <span>View LeetCode Profile</span>
              <ExternalLink className="w-3 h-3" />
            </span>
          </div>
        </a>

        {/* Card 2: 23+ Shipped Projects & Top 100 Ranker */}
        <a
          href="https://github.com/Benny45123"
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => sound.hover()}
          onClick={() => sound.click()}
          className="md:col-span-6 p-7 sm:p-8 rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#0c0d16] via-[#08080c] to-[#0c0d16] hover:border-cyan-400/50 transition-all duration-300 relative overflow-hidden group cursor-pointer shadow-xl flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-60 h-60 bg-cyan-500/[0.08] blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/25 text-cyan-300 font-mono text-xs font-bold">
                <GitBranch className="w-3.5 h-3.5" />
                <span>GITHUB &bull; BENNY45123</span>
              </div>
              <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-cyan-400 transition-colors" />
            </div>

            <div className="flex items-baseline gap-3 mb-2">
              <span className="font-space text-5xl sm:text-6xl font-extrabold text-white tracking-tight bg-gradient-to-r from-cyan-200 via-cyan-400 to-sky-500 bg-clip-text text-transparent">
                23+
              </span>
              <span className="font-mono text-xs text-cyan-400 font-semibold uppercase tracking-wider">
                Production Repos
              </span>
            </div>

            <h4 className="font-space text-lg font-bold text-white mb-2">
              AI &amp; Full-Stack Systems Shipped
            </h4>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed mb-6">
              Production codebases spanning multi-agent LangGraph pipelines, cryptographic commerce kernels, and WebGL interactive interfaces.
            </p>
          </div>

          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between font-mono text-[11px] text-zinc-400">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              100% Open-Source
            </span>
            <span className="text-cyan-300 font-semibold group-hover:underline flex items-center gap-1">
              <span>Inspect All Repositories</span>
              <ExternalLink className="w-3 h-3" />
            </span>
          </div>
        </a>
      </div>

      {/* =====================================================================
          6 AUTHENTIC VERIFIED CREDENTIAL CARDS (With Real Official Links)
          ===================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {AUTHENTIC_CREDENTIALS.map((cert) => {
          const isHovered = hoveredCard === cert.id;

          return (
            <a
              key={cert.id}
              href={cert.verifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => {
                sound.hover();
                setHoveredCard(cert.id);
              }}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => sound.click()}
              style={{
                borderColor: isHovered ? `${cert.accentColor}80` : "rgba(255,255,255,0.08)",
                boxShadow: isHovered ? `0 14px 34px -10px ${cert.glowColor}` : "none",
              }}
              className="group relative p-6 rounded-3xl bg-[#080910]/95 backdrop-blur-xl border transition-all duration-300 flex flex-col justify-between cursor-pointer select-none hover:-translate-y-1.5 hover:bg-[#0e0f1c]"
            >
              {/* Top Meta */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-11 h-11 rounded-2xl p-2.5 flex items-center justify-center border transition-all group-hover:scale-105 shadow-inner"
                    style={{
                      backgroundColor: `${cert.accentColor}15`,
                      borderColor: `${cert.accentColor}35`,
                    }}
                  >
                    {cert.icon}
                  </div>

                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] font-mono text-[10px] text-zinc-300">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>{cert.year}</span>
                  </div>
                </div>

                <div className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest block mb-1">
                  {cert.issuer}
                </div>

                <h4 className="font-space text-lg font-bold text-white group-hover:text-amber-300 transition-colors leading-snug mb-2">
                  {cert.title}
                </h4>

                <span
                  className="inline-block px-2.5 py-0.5 rounded text-[10px] font-mono font-medium mb-4"
                  style={{
                    backgroundColor: `${cert.accentColor}18`,
                    color: cert.accentColor,
                  }}
                >
                  {cert.category}
                </span>
              </div>

              {/* Skills Tags & Verification CTA */}
              <div className="pt-4 border-t border-white/[0.06] space-y-3">
                <div className="flex flex-wrap gap-1.5 font-mono text-[10px] text-zinc-400">
                  {cert.highlights.map((h, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.04]">
                      {h}
                    </span>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-between font-mono text-[11px]">
                  <span className="text-zinc-500 text-[10px]">{cert.badgeLabel}</span>
                  <span className="flex items-center gap-1.5 text-zinc-300 group-hover:text-amber-400 transition-colors font-semibold">
                    <span>Verify Link</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
