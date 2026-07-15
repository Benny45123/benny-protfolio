import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Mail,
  Phone,
  ExternalLink,
  Terminal,
  Award,
  Trophy,
  Medal,
  GraduationCap,
  Menu,
  X,
  Copy,
  Check,
  Send,
} from "lucide-react";

/* lucide-react 1.0 dropped brand/logo icons (GitHub, Twitter, etc.) —
   using a small inline SVG instead so we don't need an extra dependency. */
function Github({ size = 16, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M12 .5C5.73.5.98 5.24.98 11.52c0 5.01 3.29 9.26 7.86 10.76.57.1.78-.25.78-.55v-1.94c-3.2.7-3.87-1.36-3.87-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.72 1.27 3.39.97.1-.75.4-1.27.73-1.56-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.27 5.69.41.36.78 1.08.78 2.17v3.22c0 .3.21.66.79.55 4.56-1.51 7.85-5.75 7.85-10.76C23.02 5.24 18.27.5 12 .5Z" />
    </svg>
  );
}

function Linkedin({ size = 16, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  );
}

/* ============================================================
   DATA — sourced from Benny's resume / project history
   ============================================================ */

const PROFILE = {
  name: "Bennyhinn Bezawada",
  handle: "benny45123",
  role: "Full-Stack & AI Systems Engineer",
  focus: "IoT · Cybersecurity · Blockchain · Agentic AI",
  email: "sunnyashish41@gmail.com",
  phone: "+91 6300659698",
  linkedin: "https://linkedin.com/in/benny-hinn-bezawada-58411331a",
  github: "https://github.com/Benny45123",
  location: "Guntur, India",
  bio: "B.Tech Computer Science student specializing in IoT, Cybersecurity & Blockchain, building end-to-end AI systems — from multi-agent LLM pipelines and RAG architectures to production-grade full-stack platforms. I like taking a system apart, understanding every layer, and rebuilding it faster, safer, and smarter.",
};

const EDUCATION = {
  school: "Vasireddy Venkatadri Institute of Technology",
  degree: "B.Tech in CSE — IoT, Cybersecurity & Blockchain",
  cgpa: "8.14 / 10",
  period: "Sep 2023 — Present",
  location: "Guntur, India",
};

const SKILLS = [
  {
    label: "ai_and_llms",
    items: [
      "RAG",
      "LangGraph",
      "LangChain",
      "Multi-Agent Systems",
      "MCP",
      "Prompt Engineering",
      "Pinecone",
      "Cohere Rerank",
      "LiteLLM",
      "Semantic ANN Search",
    ],
  },
  {
    label: "languages",
    items: ["Python", "Java", "JavaScript", "TypeScript", "C", "SQL"],
  },
  {
    label: "backend_and_frameworks",
    items: [
      "FastAPI",
      "Node.js",
      "Express.js",
      "Next.js",
      "Spring Boot",
      "REST APIs",
      "Microservices",
    ],
  },
  {
    label: "databases",
    items: ["PostgreSQL", "MongoDB", "Redis", "Supabase", "Vector DBs"],
  },
  {
    label: "cloud_and_devops",
    items: ["AWS (EC2, S3, IAM)", "Docker", "Git", "GitHub Actions", "Jenkins"],
  },
  {
    label: "core_cs",
    items: [
      "Data Structures & Algorithms",
      "OOP",
      "DBMS",
      "Operating Systems",
      "Computer Networks",
      "System Design",
    ],
  },
];

const PROJECTS = [
  {
    id: "gov-rag",
    name: "Gov-Transparency-RAG",
    tagline: "Full-stack RAG system over 2,000+ federal court records",
    stack: ["Python", "FastAPI", "LangChain", "Pinecone", "Redis", "Supabase"],
    points: [
      "Indexed 2,000+ federal court records using Gemini embeddings + Pinecone, with BeautifulSoup and PyMuPDF for structured extraction.",
      "Designed a multi-stage retrieval pipeline combining semantic ANN search with Cohere reranking for high-precision, neutral legal-document retrieval.",
      "Cut API cost and query latency by 40%+ with a Redis caching layer, async Supabase logging, and a custom batching pipeline.",
    ],
    links: [
      { label: "frontend", url: "https://github.com/Benny45123/gov-transparency-rag-frontend" },
      { label: "backend", url: "https://github.com/Benny45123/gov-transparency-rag-backend" },
    ],
    accent: "cyan",
  },
  {
    id: "careerforge",
    name: "CareerForgeAI",
    tagline: "AI career platform — resumes, cover letters, mock interviews",
    stack: ["Next.js", "Node.js", "LangChain", "Pinecone", "MongoDB", "Gemini"],
    points: [
      "Built ATS resume analysis, context-aware cover letter generation, and real-time mock interviews via a segmented Pinecone RAG pipeline.",
      "Ran dual-model evaluation for interview feedback scoring across multiple LLM providers.",
      "Automated job matching by aggregating live openings against AI-analyzed resume profiles, cutting manual search time by 70%+.",
    ],
    links: [
      { label: "frontend", url: "https://github.com/Benny45123/careerforge-ai-next" },
      { label: "backend", url: "https://github.com/Benny45123/career-forge-ai-backend" },
    ],
    accent: "magenta",
  },
  {
    id: "video-pipeline",
    name: "Agentic AI Video Content Pipeline",
    tagline: "Multi-agent system turning stories into short-form video",
    stack: ["FastAPI", "LangGraph", "Supabase", "MCP", "FFmpeg"],
    points: [
      "Orchestrated Story, Script, Prompt, QA, Assembly and Delivery agents with LangGraph to autonomously produce short-form video from raw text.",
      "Self-hosted Wan2.2 TI2V-5B on Kaggle T4 GPUs with a cascading fallback across external video-gen providers.",
      "Added Supabase checkpointing, conditional routing and human-in-the-loop approval, cutting end-to-end latency by 75%+ via parallel execution.",
    ],
    links: [
      { label: "github", url: "https://github.com/Benny45123/agentic-ai-video-content-pipeline" },
    ],
    accent: "green",
  },
  {
    id: "campusconnect",
    name: "CampusConnect",
    tagline: "Full-stack content-sharing platform for campus communities",
    stack: ["Node.js", "Express.js", "Redis", "Docker", "AWS EC2", "GitHub Actions"],
    points: [
      "Built secure authentication, article publishing and personalized user features end to end.",
      "Optimized performance with Redis caching and rate limiting under real traffic patterns.",
      "Shipped scalable services through containerized CI/CD pipelines on AWS EC2.",
    ],
    links: [
      { label: "frontend", url: "https://github.com/Benny45123/campus-connect" },
      { label: "backend", url: "https://github.com/Benny45123/campus-connect-backend" },
    ],
    accent: "cyan",
  },
];

const ACHIEVEMENTS = [
  { icon: "trophy", title: "Gold Medal — CodeVerse", meta: "Spaardha ACM · Oct 2025" },
  { icon: "medal", title: "Silver Medal — CodeSwap", meta: "IEEE · Oct 2025" },
  { icon: "award", title: "Cash Prize — Nexora Full-Stack Expo", meta: "IEEE · Mar 2026" },
];

const CERTIFICATIONS = [
  { title: "AI Agents Certification", meta: "Hugging Face · 2026" },
  { title: "AWS AI Practitioner Challenge", meta: "Udacity (AWS) · 2026" },
  { title: "Networking Virtual Internship", meta: "Palo Alto Networks · 2025" },
];

const NAV = [
  { id: "home", label: "~/home" },
  { id: "about", label: "./about" },
  { id: "skills", label: "./skills" },
  { id: "projects", label: "./projects" },
  { id: "achievements", label: "./achievements" },
  { id: "contact", label: "./contact" },
];

/* ============================================================
   STYLES
   ============================================================ */

const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

.bp-root {
  --bg-void: #05070a;
  --bg-panel: #0a0f16;
  --bg-panel-2: #0e151f;
  --border: rgba(45,212,255,0.16);
  --border-strong: rgba(45,212,255,0.5);
  --cyan: #2dd4ff;
  --cyan-dim: rgba(45,212,255,0.55);
  --magenta: #ff2db8;
  --green: #39ff88;
  --text: #dcf3ff;
  --muted: #6d8299;
  --mono: 'JetBrains Mono', ui-monospace, monospace;
  --sans: 'Inter', system-ui, sans-serif;

  background: var(--bg-void);
  color: var(--text);
  font-family: var(--sans);
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
  isolation: isolate;
}

.bp-root * { box-sizing: border-box; }
.bp-root ::selection { background: rgba(45,212,255,0.3); color: #fff; }

.bp-canvas {
  position: fixed;
  inset: 0;
  z-index: 0;
  opacity: 0.55;
  pointer-events: none;
}

.bp-grain {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background-image: radial-gradient(circle at 20% 20%, rgba(45,212,255,0.05), transparent 40%),
                     radial-gradient(circle at 80% 70%, rgba(255,45,184,0.04), transparent 45%);
}

.bp-content { position: relative; z-index: 2; }

/* ---------- Nav ---------- */
.bp-nav {
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(14px);
  background: rgba(5,7,10,0.72);
  border-bottom: 1px solid var(--border);
}
.bp-nav-inner {
  max-width: 1120px;
  margin: 0 auto;
  padding: 14px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.bp-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--mono);
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--text);
  text-decoration: none;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
}
.bp-logo-badge {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: 1px solid var(--border-strong);
  background: linear-gradient(145deg, rgba(45,212,255,0.15), rgba(255,45,184,0.08));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: var(--cyan);
  box-shadow: 0 0 18px rgba(45,212,255,0.25);
}
.bp-navlinks { display: flex; gap: 4px; }
.bp-navlink {
  font-family: var(--mono);
  font-size: 12.5px;
  color: var(--muted);
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: color 0.2s ease, background 0.2s ease;
  position: relative;
}
.bp-navlink:hover { color: var(--text); background: rgba(45,212,255,0.06); }
.bp-navlink.active { color: var(--cyan); }
.bp-navlink.active::after {
  content: '';
  position: absolute;
  left: 12px; right: 12px; bottom: 2px;
  height: 1px;
  background: var(--cyan);
  box-shadow: 0 0 8px var(--cyan);
}
.bp-navcta {
  font-family: var(--mono);
  font-size: 12px;
  color: var(--bg-void);
  background: var(--cyan);
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 700;
  box-shadow: 0 0 20px rgba(45,212,255,0.35);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.bp-navcta:hover { transform: translateY(-1px); box-shadow: 0 0 28px rgba(45,212,255,0.55); }

.bp-burger {
  display: none;
  background: none; border: 1px solid var(--border); border-radius: 6px;
  color: var(--text); padding: 8px; cursor: pointer;
}
.bp-mobilemenu {
  display: none;
  flex-direction: column;
  padding: 8px 24px 18px;
  border-bottom: 1px solid var(--border);
  background: rgba(5,7,10,0.95);
}
.bp-mobilemenu .bp-navlink { text-align: left; }

/* ---------- Hero ---------- */
.bp-hero {
  max-width: 1120px;
  margin: 0 auto;
  padding: 96px 24px 80px;
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 56px;
  align-items: center;
}
.bp-eyebrow {
  font-family: var(--mono);
  font-size: 12.5px;
  color: var(--green);
  display: flex; align-items: center; gap: 8px;
  margin-bottom: 18px;
}
.bp-eyebrow .dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--green);
  box-shadow: 0 0 8px var(--green);
  animation: bp-pulse 1.8s ease-in-out infinite;
}
.bp-title {
  font-family: var(--mono);
  font-weight: 800;
  font-size: clamp(2.1rem, 4.6vw, 3.4rem);
  line-height: 1.08;
  letter-spacing: -0.01em;
  margin: 0 0 16px;
}
.bp-title .grad {
  background: linear-gradient(90deg, var(--cyan), #7ef3ff 40%, var(--magenta));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 0 40px rgba(45,212,255,0.25);
}
.bp-sub {
  font-family: var(--sans);
  font-size: 16.5px;
  color: var(--muted);
  line-height: 1.65;
  max-width: 46ch;
  margin-bottom: 28px;
}
.bp-herobtns { display: flex; gap: 14px; flex-wrap: wrap; }
.bp-btn {
  font-family: var(--mono);
  font-size: 13px;
  font-weight: 700;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  transition: transform 0.15s ease, box-shadow 0.2s ease, background 0.2s ease;
}
.bp-btn-primary {
  background: var(--cyan);
  color: var(--bg-void);
  border: 1px solid var(--cyan);
  box-shadow: 0 0 24px rgba(45,212,255,0.35);
}
.bp-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 0 34px rgba(45,212,255,0.55); }
.bp-btn-ghost {
  background: transparent;
  color: var(--text);
  border: 1px solid var(--border-strong);
}
.bp-btn-ghost:hover { background: rgba(45,212,255,0.08); transform: translateY(-2px); }

/* Terminal window */
.bp-term {
  background: var(--bg-panel);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 0 0 1px rgba(45,212,255,0.03), 0 30px 60px -20px rgba(0,0,0,0.7), 0 0 60px -15px rgba(45,212,255,0.15);
  position: relative;
}
.bp-term::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(45,212,255,0.03) 50%, transparent 100%);
  background-size: 100% 6px;
  animation: bp-scan 6s linear infinite;
  pointer-events: none;
}
.bp-term-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-panel-2);
}
.bp-term-dot { width: 10px; height: 10px; border-radius: 50%; }
.bp-term-path {
  margin-left: 10px;
  font-family: var(--mono);
  font-size: 11.5px;
  color: var(--muted);
}
.bp-term-body {
  padding: 22px 20px 26px;
  font-family: var(--mono);
  font-size: 13.5px;
  line-height: 1.9;
  min-height: 230px;
}
.bp-term-line { display: flex; gap: 8px; flex-wrap: wrap; }
.bp-prompt { color: var(--green); }
.bp-cmd { color: var(--text); }
.bp-out { color: var(--cyan); padding-left: 18px; }
.bp-cursor {
  display: inline-block;
  width: 8px; height: 15px;
  background: var(--cyan);
  margin-left: 3px;
  animation: bp-blink 1s step-end infinite;
  vertical-align: text-bottom;
  box-shadow: 0 0 8px var(--cyan);
}

/* ---------- Sections ---------- */
.bp-section { max-width: 1120px; margin: 0 auto; padding: 90px 24px; }
.bp-section-tight { padding-top: 0; }
.bp-kicker {
  font-family: var(--mono);
  font-size: 12.5px;
  color: var(--cyan);
  margin-bottom: 10px;
  display: flex; align-items: center; gap: 8px;
}
.bp-kicker::before { content: '//'; color: var(--muted); }
.bp-h2 {
  font-family: var(--mono);
  font-weight: 800;
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  margin: 0 0 36px;
  letter-spacing: -0.01em;
}

.bp-reveal { opacity: 0; transform: translateY(22px); transition: opacity 0.7s ease, transform 0.7s ease; }
.bp-reveal.in { opacity: 1; transform: translateY(0); }

/* About */
.bp-about-grid { display: grid; grid-template-columns: 1.3fr 1fr; gap: 40px; align-items: start; }
.bp-bio { font-size: 16px; line-height: 1.85; color: #b9d3e2; }
.bp-edu-card {
  background: var(--bg-panel);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 22px;
}
.bp-edu-head { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; color: var(--cyan); }
.bp-edu-head span { font-family: var(--mono); font-size: 12px; letter-spacing: 0.05em; text-transform: uppercase; }
.bp-edu-school { font-weight: 700; font-size: 15px; margin-bottom: 4px; }
.bp-edu-degree { color: var(--muted); font-size: 13.5px; margin-bottom: 14px; }
.bp-edu-row { display: flex; justify-content: space-between; font-family: var(--mono); font-size: 12px; color: var(--muted); border-top: 1px dashed var(--border); padding-top: 10px; margin-top: 10px;}
.bp-edu-row b { color: var(--text); }

/* Skills */
.bp-skills-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; }
.bp-skill-card {
  background: var(--bg-panel);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 18px 20px;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}
.bp-skill-card:hover { border-color: var(--border-strong); box-shadow: 0 0 26px -8px rgba(45,212,255,0.35); }
.bp-skill-label {
  font-family: var(--mono);
  font-size: 12px;
  color: var(--green);
  margin-bottom: 12px;
}
.bp-skill-label::before { content: '$ grep -r '; color: var(--muted); }
.bp-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.bp-tag {
  font-family: var(--mono);
  font-size: 11.5px;
  padding: 5px 10px;
  border-radius: 5px;
  border: 1px solid var(--border);
  color: #a9c8db;
  background: rgba(45,212,255,0.04);
}

/* Projects */
.bp-projects-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 22px; }
.bp-card {
  background: var(--bg-panel);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  display: flex;
  flex-direction: column;
}
.bp-card:hover { transform: translateY(-4px); }
.bp-card[data-accent="cyan"]:hover { border-color: rgba(45,212,255,0.55); box-shadow: 0 20px 50px -20px rgba(45,212,255,0.35); }
.bp-card[data-accent="magenta"]:hover { border-color: rgba(255,45,184,0.55); box-shadow: 0 20px 50px -20px rgba(255,45,184,0.35); }
.bp-card[data-accent="green"]:hover { border-color: rgba(57,255,136,0.5); box-shadow: 0 20px 50px -20px rgba(57,255,136,0.3); }
.bp-card-bar {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 14px;
  background: var(--bg-panel-2);
  border-bottom: 1px solid var(--border);
}
.bp-card-body { padding: 20px; flex: 1; display: flex; flex-direction: column; }
.bp-card-name { font-family: var(--mono); font-weight: 700; font-size: 16.5px; margin-bottom: 4px; }
.bp-card-tagline { font-size: 13.5px; color: var(--muted); margin-bottom: 16px; line-height: 1.5; }
.bp-card-points { list-style: none; margin: 0 0 18px; padding: 0; display: flex; flex-direction: column; gap: 9px; }
.bp-card-points li { font-size: 13px; line-height: 1.6; color: #b9d3e2; padding-left: 16px; position: relative; }
.bp-card-points li::before { content: '▸'; position: absolute; left: 0; color: var(--cyan); }
.bp-card-stack { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 18px; }
.bp-chip {
  font-family: var(--mono); font-size: 10.5px; color: var(--muted);
  border: 1px solid var(--border); border-radius: 4px; padding: 3px 7px;
}
.bp-card-links { display: flex; gap: 14px; margin-top: auto; }
.bp-card-link {
  font-family: var(--mono); font-size: 12px; color: var(--cyan);
  display: flex; align-items: center; gap: 5px; text-decoration: none;
}
.bp-card-link:hover { text-decoration: underline; }

/* Achievements */
.bp-ach-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 40px; }
.bp-ach-card {
  background: var(--bg-panel); border: 1px solid var(--border); border-radius: 10px;
  padding: 18px; display: flex; gap: 12px; align-items: flex-start;
}
.bp-ach-icon {
  width: 36px; height: 36px; border-radius: 8px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  background: rgba(45,212,255,0.08); color: var(--cyan); border: 1px solid var(--border);
}
.bp-ach-title { font-size: 13.5px; font-weight: 600; margin-bottom: 3px; }
.bp-ach-meta { font-family: var(--mono); font-size: 11px; color: var(--muted); }

.bp-cert-row { display: flex; flex-direction: column; gap: 10px; }
.bp-cert-item {
  display: flex; justify-content: space-between; align-items: center;
  padding: 14px 18px; border: 1px solid var(--border); border-radius: 8px;
  background: var(--bg-panel);
}
.bp-cert-title { font-size: 13.5px; font-weight: 600; }
.bp-cert-meta { font-family: var(--mono); font-size: 11.5px; color: var(--muted); }

/* Contact */
.bp-contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
.bp-contact-list { display: flex; flex-direction: column; gap: 12px; }
.bp-contact-row {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 16px; border: 1px solid var(--border); border-radius: 9px;
  background: var(--bg-panel); text-decoration: none; color: var(--text);
  transition: border-color 0.2s ease, background 0.2s ease;
  cursor: pointer;
}
.bp-contact-row:hover { border-color: var(--border-strong); background: rgba(45,212,255,0.05); }
.bp-contact-icon {
  width: 34px; height: 34px; border-radius: 7px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(45,212,255,0.08); color: var(--cyan);
}
.bp-contact-label { font-family: var(--mono); font-size: 10.5px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; }
.bp-contact-value { font-size: 13.5px; font-weight: 500; }

.bp-form {
  background: var(--bg-panel); border: 1px solid var(--border); border-radius: 12px; padding: 22px;
  display: flex; flex-direction: column; gap: 14px;
}
.bp-field label {
  font-family: var(--mono); font-size: 11px; color: var(--muted); display: block; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em;
}
.bp-field input, .bp-field textarea {
  width: 100%; background: var(--bg-void); border: 1px solid var(--border); border-radius: 7px;
  padding: 11px 12px; color: var(--text); font-family: var(--sans); font-size: 13.5px; outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.bp-field input:focus, .bp-field textarea:focus { border-color: var(--cyan); box-shadow: 0 0 0 3px rgba(45,212,255,0.12); }
.bp-field textarea { resize: vertical; min-height: 100px; }
.bp-form-submit {
  align-self: flex-start;
}

/* Footer */
.bp-footer {
  border-top: 1px solid var(--border);
  padding: 28px 24px;
  text-align: center;
  font-family: var(--mono);
  font-size: 11.5px;
  color: var(--muted);
}
.bp-footer span { color: var(--cyan); }

/* Animations */
@keyframes bp-blink { 50% { opacity: 0; } }
@keyframes bp-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
@keyframes bp-scan { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }

@media (max-width: 880px) {
  .bp-hero { grid-template-columns: 1fr; padding-top: 60px; }
  .bp-about-grid, .bp-skills-grid, .bp-projects-grid, .bp-ach-grid, .bp-contact-grid { grid-template-columns: 1fr; }
  .bp-navlinks { display: none; }
  .bp-burger { display: inline-flex; }
  .bp-mobilemenu.open { display: flex; }
}

@media (prefers-reduced-motion: reduce) {
  .bp-cursor, .bp-eyebrow .dot, .bp-term::after { animation: none; }
  .bp-reveal { transition: none; opacity: 1; transform: none; }
}
`;

/* ============================================================
   ANIMATED NODE-NETWORK BACKGROUND (canvas)
   ============================================================ */

function NodeNetwork() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    let width, height;
    let nodes = [];

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const setup = () => {
      width = canvas.width = canvas.offsetWidth * devicePixelRatio;
      height = canvas.height = canvas.offsetHeight * devicePixelRatio;
      const count = Math.min(60, Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 26000));
      nodes = Array.from({ length: count }).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25 * devicePixelRatio,
        vy: (Math.random() - 0.5) * 0.25 * devicePixelRatio,
        r: (Math.random() * 1.3 + 0.6) * devicePixelRatio,
      }));
    };

    const step = () => {
      ctx.clearRect(0, 0, width, height);
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      }
      const linkDist = 130 * devicePixelRatio;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < linkDist) {
            const alpha = (1 - dist / linkDist) * 0.22;
            ctx.strokeStyle = `rgba(45,212,255,${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(45,212,255,0.7)";
        ctx.shadowColor = "rgba(45,212,255,0.9)";
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      if (!reduceMotion) raf = requestAnimationFrame(step);
    };

    setup();
    step();
    const onResize = () => setup();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="bp-canvas" />;
}

/* ============================================================
   REVEAL-ON-SCROLL WRAPPER
   ============================================================ */

function Reveal({ children, className = "" }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className={`bp-reveal ${inView ? "in" : ""} ${className}`}>
      {children}
    </div>
  );
}

/* ============================================================
   TERMINAL HERO TYPEWRITER
   ============================================================ */

const BOOT_LINES = [
  { type: "cmd", text: "whoami" },
  { type: "out", text: "bennyhinn_bezawada" },
  { type: "cmd", text: "cat role.txt" },
  { type: "out", text: PROFILE.role },
  { type: "cmd", text: "cat focus.txt" },
  { type: "out", text: PROFILE.focus },
  { type: "cmd", text: "status --check" },
  { type: "out", text: "open to internships & full-time roles ✓" },
];

function TerminalHero() {
  const [visibleLines, setVisibleLines] = useState([]);
  const [charIndex, setCharIndex] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (lineIndex >= BOOT_LINES.length) {
      setDone(true);
      return;
    }
    const current = BOOT_LINES[lineIndex];
    if (charIndex <= current.text.length) {
      const speed = current.type === "cmd" ? 42 : 14;
      const t = setTimeout(() => setCharIndex((c) => c + 1), speed);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setVisibleLines((v) => [...v, current]);
        setLineIndex((i) => i + 1);
        setCharIndex(0);
      }, current.type === "cmd" ? 160 : 260);
      return () => clearTimeout(t);
    }
  }, [charIndex, lineIndex]);

  const current = BOOT_LINES[lineIndex];
  const currentText = current ? current.text.slice(0, charIndex) : "";

  return (
    <div className="bp-term">
      <div className="bp-term-bar">
        <span className="bp-term-dot" style={{ background: "#ff5f57" }} />
        <span className="bp-term-dot" style={{ background: "#febc2e" }} />
        <span className="bp-term-dot" style={{ background: "#28c840" }} />
        <span className="bp-term-path">benny@vvit: ~/portfolio</span>
      </div>
      <div className="bp-term-body">
        {visibleLines.map((l, i) =>
          l.type === "cmd" ? (
            <div className="bp-term-line" key={i}>
              <span className="bp-prompt">$</span>
              <span className="bp-cmd">{l.text}</span>
            </div>
          ) : (
            <div className="bp-term-line" key={i}>
              <span className="bp-out">{l.text}</span>
            </div>
          )
        )}
        {!done && current && (
          <div className="bp-term-line">
            {current.type === "cmd" ? (
              <>
                <span className="bp-prompt">$</span>
                <span className="bp-cmd">{currentText}</span>
              </>
            ) : (
              <span className="bp-out">{currentText}</span>
            )}
            <span className="bp-cursor" />
          </div>
        )}
        {done && (
          <div className="bp-term-line">
            <span className="bp-prompt">$</span>
            <span className="bp-cursor" />
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */

export default function BennyPortfolio() {
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    const sections = NAV.map((n) => document.getElementById(n.id)).filter(Boolean);
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const scrollTo = useCallback((id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const copyEmail = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(PROFILE.email).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio contact from ${form.name || "a visitor"}`);
    const body = encodeURIComponent(
      `${form.message}\n\n— ${form.name || "Anonymous"} (${form.email || "no email given"})`
    );
    window.location.href = `mailto:${PROFILE.email}?subject=${subject}&body=${body}`;
  };

  const iconFor = (name) => {
    if (name === "trophy") return <Trophy size={17} />;
    if (name === "medal") return <Medal size={17} />;
    return <Award size={17} />;
  };

  return (
    <div className="bp-root">
      <style>{GLOBAL_CSS}</style>
      <NodeNetwork />
      <div className="bp-grain" />

      <div className="bp-content">
        {/* NAV */}
        <nav className="bp-nav">
          <div className="bp-nav-inner">
            <button className="bp-logo" onClick={() => scrollTo("home")}>
              <span className="bp-logo-badge">BB</span>
              bennyhinn
            </button>
            <div className="bp-navlinks">
              {NAV.map((n) => (
                <button
                  key={n.id}
                  className={`bp-navlink ${active === n.id ? "active" : ""}`}
                  onClick={() => scrollTo(n.id)}
                >
                  {n.label}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button className="bp-navcta" onClick={() => scrollTo("contact")}>
                say_hello()
              </button>
              <button className="bp-burger" onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle menu">
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
          <div className={`bp-mobilemenu ${menuOpen ? "open" : ""}`}>
            {NAV.map((n) => (
              <button
                key={n.id}
                className={`bp-navlink ${active === n.id ? "active" : ""}`}
                onClick={() => scrollTo(n.id)}
              >
                {n.label}
              </button>
            ))}
          </div>
        </nav>

        {/* HERO */}
        <section id="home" className="bp-hero">
          <div>
            <div className="bp-eyebrow">
              <span className="dot" />
              AVAILABLE FOR INTERNSHIPS &amp; FULL-TIME ROLES
            </div>
            <h1 className="bp-title">
              Building <span className="grad">secure, intelligent</span> systems — one agent at a time.
            </h1>
            <p className="bp-sub">{PROFILE.bio}</p>
            <div className="bp-herobtns">
              <button className="bp-btn bp-btn-primary" onClick={() => scrollTo("projects")}>
                <Terminal size={15} /> View Projects
              </button>
              <button className="bp-btn bp-btn-ghost" onClick={() => scrollTo("contact")}>
                <Mail size={15} /> Get In Touch
              </button>
              <a
                className="bp-btn bp-btn-ghost"
                href={PROFILE.github}
                target="_blank"
                rel="noreferrer"
              >
                <Github size={15} /> GitHub
              </a>
            </div>
          </div>
          <TerminalHero />
        </section>

        {/* ABOUT */}
        <section id="about" className="bp-section">
          <Reveal>
            <div className="bp-kicker">about</div>
            <h2 className="bp-h2">Who's behind the keyboard</h2>
          </Reveal>
          <div className="bp-about-grid">
            <Reveal>
              <p className="bp-bio">{PROFILE.bio}</p>
              <p className="bp-bio" style={{ marginTop: 16 }}>
                My work spans two lanes that keep circling back to each other: agentic AI
                systems that reason, retrieve and act, and the backend infrastructure —
                databases, caching, queues, auth — that keeps them fast and trustworthy in
                production. Cybersecurity and blockchain coursework shapes how I think about
                threat surfaces even in ordinary CRUD apps.
              </p>
            </Reveal>
            <Reveal>
              <div className="bp-edu-card">
                <div className="bp-edu-head">
                  <GraduationCap size={18} />
                  <span>Education</span>
                </div>
                <div className="bp-edu-school">{EDUCATION.school}</div>
                <div className="bp-edu-degree">{EDUCATION.degree}</div>
                <div className="bp-edu-row">
                  <span>CGPA</span>
                  <b>{EDUCATION.cgpa}</b>
                </div>
                <div className="bp-edu-row">
                  <span>Period</span>
                  <b>{EDUCATION.period}</b>
                </div>
                <div className="bp-edu-row">
                  <span>Location</span>
                  <b>{EDUCATION.location}</b>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills" className="bp-section">
          <Reveal>
            <div className="bp-kicker">skills</div>
            <h2 className="bp-h2">Toolbox</h2>
          </Reveal>
          <div className="bp-skills-grid">
            {SKILLS.map((s) => (
              <Reveal key={s.label}>
                <div className="bp-skill-card">
                  <div className="bp-skill-label">{s.label}</div>
                  <div className="bp-tags">
                    {s.items.map((it) => (
                      <span className="bp-tag" key={it}>
                        {it}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" className="bp-section">
          <Reveal>
            <div className="bp-kicker">projects</div>
            <h2 className="bp-h2">Things I've shipped</h2>
          </Reveal>
          <div className="bp-projects-grid">
            {PROJECTS.map((p) => (
              <Reveal key={p.id}>
                <div className="bp-card" data-accent={p.accent}>
                  <div className="bp-card-bar">
                    <span className="bp-term-dot" style={{ background: "#ff5f57" }} />
                    <span className="bp-term-dot" style={{ background: "#febc2e" }} />
                    <span className="bp-term-dot" style={{ background: "#28c840" }} />
                    <span className="bp-term-path">{p.id}.tsx</span>
                  </div>
                  <div className="bp-card-body">
                    <div className="bp-card-name">{p.name}</div>
                    <div className="bp-card-tagline">{p.tagline}</div>
                    <ul className="bp-card-points">
                      {p.points.map((pt, i) => (
                        <li key={i}>{pt}</li>
                      ))}
                    </ul>
                    <div className="bp-card-stack">
                      {p.stack.map((t) => (
                        <span className="bp-chip" key={t}>
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="bp-card-links">
                      {p.links.map((l) => (
                        <a
                          key={l.label}
                          className="bp-card-link"
                          href={l.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {l.label} <ExternalLink size={12} />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ACHIEVEMENTS */}
        <section id="achievements" className="bp-section">
          <Reveal>
            <div className="bp-kicker">achievements</div>
            <h2 className="bp-h2">Wins &amp; certifications</h2>
          </Reveal>
          <div className="bp-ach-grid">
            {ACHIEVEMENTS.map((a) => (
              <Reveal key={a.title}>
                <div className="bp-ach-card">
                  <div className="bp-ach-icon">{iconFor(a.icon)}</div>
                  <div>
                    <div className="bp-ach-title">{a.title}</div>
                    <div className="bp-ach-meta">{a.meta}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="bp-cert-row">
              {CERTIFICATIONS.map((c) => (
                <div className="bp-cert-item" key={c.title}>
                  <span className="bp-cert-title">{c.title}</span>
                  <span className="bp-cert-meta">{c.meta}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* CONTACT */}
        <section id="contact" className="bp-section">
          <Reveal>
            <div className="bp-kicker">contact</div>
            <h2 className="bp-h2">Let's build something</h2>
          </Reveal>
          <div className="bp-contact-grid">
            <Reveal>
              <div className="bp-contact-list">
                <div className="bp-contact-row" onClick={copyEmail}>
                  <div className="bp-contact-icon">{copied ? <Check size={16} /> : <Mail size={16} />}</div>
                  <div>
                    <div className="bp-contact-label">Email {copied ? "— copied" : ""}</div>
                    <div className="bp-contact-value">{PROFILE.email}</div>
                  </div>
                  <Copy size={14} style={{ marginLeft: "auto", color: "var(--muted)" }} />
                </div>
                <a className="bp-contact-row" href={`tel:${PROFILE.phone}`}>
                  <div className="bp-contact-icon">
                    <Phone size={16} />
                  </div>
                  <div>
                    <div className="bp-contact-label">Phone</div>
                    <div className="bp-contact-value">{PROFILE.phone}</div>
                  </div>
                </a>
                <a className="bp-contact-row" href={PROFILE.linkedin} target="_blank" rel="noreferrer">
                  <div className="bp-contact-icon">
                    <Linkedin size={16} />
                  </div>
                  <div>
                    <div className="bp-contact-label">LinkedIn</div>
                    <div className="bp-contact-value">benny-hinn-bezawada</div>
                  </div>
                </a>
                <a className="bp-contact-row" href={PROFILE.github} target="_blank" rel="noreferrer">
                  <div className="bp-contact-icon">
                    <Github size={16} />
                  </div>
                  <div>
                    <div className="bp-contact-label">GitHub</div>
                    <div className="bp-contact-value">{PROFILE.handle}</div>
                  </div>
                </a>
              </div>
            </Reveal>
            <Reveal>
              <form className="bp-form" onSubmit={handleSubmit}>
                <div className="bp-field">
                  <label>Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                  />
                </div>
                <div className="bp-field">
                  <label>Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                  />
                </div>
                <div className="bp-field">
                  <label>Message</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="What are you building?"
                  />
                </div>
                <button type="submit" className="bp-btn bp-btn-primary bp-form-submit">
                  <Send size={14} /> Send message
                </button>
              </form>
            </Reveal>
          </div>
        </section>

        <footer className="bp-footer">
          <span>~/portfolio</span> — built by {PROFILE.name} · © {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}