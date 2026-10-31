"use client";

import React, { useState } from "react";
import { sound } from "@/components/SoundEffects";
import { Sparkles, Database, Search } from "lucide-react";

interface SkillItem {
  name: string;
  projectRole: string;
  accentColor: string;
  glowColor: string;
  icon: React.ReactNode;
}

// =============================================================================
// VECTOR BRAND ICONS (Crisp, High-Fidelity Official Geometry)
// =============================================================================

function PythonIcon() {
  return (
    <svg viewBox="0 0 128 128" className="w-6 h-6">
      <path
        fill="#387eb8"
        d="M63.7 3.5c-29.2 0-27.4 12.7-27.4 12.7l.1 13.1h27.9v4H25.3S3.5 30.9 3.5 63.8s19.1 32 19.1 32h11.4v-16s-.6-19.1 18.8-19.1h32.2s18.2.3 18.2-17.6V16.8S105.8 3.5 63.7 3.5zM48 13.7c3.7 0 6.6 3 6.6 6.6s-3 6.6-6.6 6.6-6.6-3-6.6-6.6 3-6.6 6.6-6.6z"
      />
      <path
        fill="#ffe052"
        d="M64.3 124.5c29.2 0 27.4-12.7 27.4-12.7l-.1-13.1H63.7v-4h39s21.8 2.4 21.8-30.5-19.1-32-19.1-32h-11.4v16s.6 19.1-18.8 19.1H43s-18.2-.3-18.2 17.6v26.3s-2.6 13.3 39.5 13.3zm15.7-10.2c-3.7 0-6.6-3-6.6-6.6s3-6.6 6.6-6.6 6.6 3 6.6 6.6-3 6.6-6.6 6.6z"
      />
    </svg>
  );
}

function LangGraphIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-6 h-6">
      <circle cx="28" cy="30" r="14" fill="#F59E0B" />
      <circle cx="72" cy="30" r="14" fill="#F59E0B" />
      <circle cx="50" cy="74" r="16" fill="#FBBF24" />
      <path d="M38 34 L62 34 M34 42 L46 64 M66 42 L54 64" stroke="#FFF" strokeWidth="4.5" strokeLinecap="round" />
      <circle cx="50" cy="74" r="6" fill="#18181B" />
    </svg>
  );
}

function PyTorchIcon() {
  return (
    <svg viewBox="0 0 128 128" className="w-6 h-6">
      <path
        fill="#EE4C2C"
        d="M74.8 15.3a4.7 4.7 0 0 0-5.7 1.3l-9.6 11.5a4.7 4.7 0 0 0 1.2 6.9 42.6 42.6 0 1 1-13.5-9.6 4.7 4.7 0 0 0 4.9-.7l7.6-6a4.7 4.7 0 0 0 .5-6.8 54 54 0 1 0 14.6 3.4zm16.9 14.2a6.9 6.9 0 1 1 6.9-6.9 6.9 6.9 0 0 1-6.9 6.9z"
      />
    </svg>
  );
}

function FastAPIIcon() {
  return (
    <svg viewBox="0 0 128 128" className="w-6 h-6">
      <circle cx="64" cy="64" r="60" fill="#05998B" />
      <path d="M69.5 22.8L35.4 68.6h25.8L51.8 105.2l40.8-51.4H65.8z" fill="#FFF" />
    </svg>
  );
}

function ComfyUIIcon() {
  return (
    <svg viewBox="0 0 128 128" className="w-6 h-6">
      <rect width="128" height="128" rx="28" fill="#18181B" stroke="#A855F7" strokeWidth="4" />
      <circle cx="44" cy="44" r="14" fill="#A855F7" />
      <circle cx="84" cy="44" r="14" fill="#38BDF8" />
      <circle cx="64" cy="84" r="14" fill="#34D399" />
      <path d="M44 44 L84 44 M44 44 L64 84 M84 44 L64 84" stroke="#FFF" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function FFmpegIcon() {
  return (
    <svg viewBox="0 0 128 128" className="w-6 h-6">
      <rect width="128" height="128" rx="28" fill="#007808" />
      <path d="M30 40 L64 24 L98 40 L98 88 L64 104 L30 88 Z" fill="none" stroke="#FFF" strokeWidth="6" />
      <polygon points="52,48 52,80 78,64" fill="#FFF" />
    </svg>
  );
}

function PineconeIcon() {
  return (
    <svg viewBox="0 0 128 128" className="w-6 h-6">
      <rect width="128" height="128" rx="28" fill="#047857" />
      <circle cx="64" cy="38" r="12" fill="#FFF" />
      <circle cx="44" cy="62" r="12" fill="#FFF" />
      <circle cx="84" cy="62" r="12" fill="#FFF" />
      <circle cx="64" cy="86" r="12" fill="#FFF" />
    </svg>
  );
}

function DuckDBIcon() {
  return (
    <svg viewBox="0 0 128 128" className="w-6 h-6">
      <circle cx="64" cy="64" r="58" fill="#FFF000" />
      <ellipse cx="64" cy="72" rx="36" ry="28" fill="#FFF" />
      <circle cx="78" cy="50" r="18" fill="#FFF000" />
      <circle cx="84" cy="46" r="4" fill="#000" />
      <polygon points="94,48 114,54 94,60" fill="#FF9900" />
    </svg>
  );
}

function SQLiteIcon() {
  return (
    <svg viewBox="0 0 128 128" className="w-6 h-6">
      <rect width="128" height="128" rx="28" fill="#003B57" />
      <path d="M32 40 C32 30 96 30 96 40 C96 50 32 50 32 40 Z" fill="#00A2D9" />
      <path d="M32 40 v48 C32 98 96 98 96 88 v-48" stroke="#00A2D9" strokeWidth="6" fill="none" />
      <path d="M32 64 C32 74 96 74 96 64" stroke="#00A2D9" strokeWidth="6" fill="none" />
    </svg>
  );
}

function SupabaseIcon() {
  return (
    <svg viewBox="0 0 128 128" className="w-6 h-6">
      <rect width="128" height="128" rx="28" fill="#1C1C1C" />
      <path d="M68 20L28 72h34l-6 36 44-54H66z" fill="#3ECF8E" />
    </svg>
  );
}

function JavaIcon() {
  return (
    <svg viewBox="0 0 128 128" className="w-6 h-6">
      <rect width="128" height="128" rx="28" fill="#5382A1" />
      <path d="M42 84c16 4 32 4 44-2-2-4-8-6-16-6-12 0-20 4-28 8zm4-16c12 2 24 2 36-2-4-4-10-6-18-6-10 0-14 4-18 8zm-8 30c24 6 52 4 64-6-6-6-18-8-32-8-18 0-26 8-32 14z" fill="#FFF" />
      <path d="M60 28c4 8-2 16-8 24 8-6 16-16 8-24zm14 4c6 8 2 16-4 24 8-6 14-16 4-24z" fill="#E76F00" />
    </svg>
  );
}

function ZustandIcon() {
  return (
    <svg viewBox="0 0 128 128" className="w-6 h-6">
      <circle cx="64" cy="64" r="58" fill="#443E38" />
      <circle cx="44" cy="36" r="14" fill="#443E38" stroke="#8E7D6B" strokeWidth="4" />
      <circle cx="84" cy="36" r="14" fill="#443E38" stroke="#8E7D6B" strokeWidth="4" />
      <ellipse cx="64" cy="72" rx="24" ry="18" fill="#ECE5D8" />
      <circle cx="54" cy="54" r="5" fill="#000" />
      <circle cx="74" cy="54" r="5" fill="#000" />
      <ellipse cx="64" cy="68" rx="6" ry="4" fill="#000" />
    </svg>
  );
}

function PlaywrightIcon() {
  return (
    <svg viewBox="0 0 128 128" className="w-6 h-6">
      <circle cx="64" cy="64" r="58" fill="#2EAD33" />
      <path d="M40 36 C40 24 88 24 88 36 C88 56 40 56 40 36 Z" fill="#FFF" opacity="0.9" />
      <circle cx="52" cy="72" r="16" fill="#E23E3E" />
      <circle cx="76" cy="72" r="16" fill="#2EAD33" stroke="#FFF" strokeWidth="4" />
    </svg>
  );
}

function MongoDBIcon() {
  return (
    <svg viewBox="0 0 128 128" className="w-6 h-6">
      <rect width="128" height="128" rx="28" fill="#001E2B" />
      <path
        fill="#00ED64"
        d="M64 18c-2 2-24 24-24 50 0 24 16 38 24 42 8-4 24-18 24-42 0-26-22-48-24-50zm-1 84V26c-1 2-18 22-18 42 0 18 12 28 18 34z"
      />
    </svg>
  );
}

function PrismaIcon() {
  return (
    <svg viewBox="0 0 128 128" className="w-6 h-6">
      <rect width="128" height="128" rx="28" fill="#2D3748" />
      <path fill="#5A67D8" d="M64 22L26 86l30 20 46-44L64 22zm-4 18l24 32-28 26-16-12 20-46z" />
    </svg>
  );
}

function DockerIcon() {
  return (
    <svg viewBox="0 0 128 128" className="w-6 h-6">
      <path
        fill="#2496ED"
        d="M123.6 57.8c-2.3-1.6-7.3-2.4-12.2-.4-1.2-5.7-5.3-9.9-10.4-11.9l-2.4-.9-.8 2.4c-2.3 6.9-1.2 12.8 1.9 17.5-3.3 1.9-8.4 2.7-14.8 2.7H5.2c-2.5 13.9 1.3 28.5 10.3 39 12.1 14.1 30.7 21.8 50.8 21.8 44.9 0 71.9-24.9 71.9-57.1-.1-4.8-1.7-9.4-4.6-13.1zM28.3 52.8h11.9v11.9H28.3V52.8zm15.8 0H56v11.9H44.1V52.8zm15.9 0h11.9v11.9H60V52.8zm-31.7-16h11.9v11.9H28.3V36.8zm15.8 0H56v11.9H44.1V36.8zm15.9 0h11.9v11.9H60V36.8zm15.8 16h11.9v11.9H75.8V52.8zm0-16h11.9v11.9H75.8V36.8zm15.9 16h11.9v11.9H91.7V52.8z"
      />
    </svg>
  );
}

function PostgreSQLIcon() {
  return (
    <svg viewBox="0 0 128 128" className="w-6 h-6">
      <circle cx="64" cy="64" r="58" fill="#336791" />
      <path
        fill="#FFF"
        d="M64 24c-19 0-33 13-33 32 0 13 6 23 15 28v18l12-8c2 1 4 1 6 1 19 0 33-13 33-32 0-20-14-39-33-39zm-1 57c-2 0-4-1-6-2l-7 5v-12c-6-4-10-11-10-20 0-14 10-23 23-23s23 9 23 23-10 29-23 29z"
      />
    </svg>
  );
}

function RedisIcon() {
  return (
    <svg viewBox="0 0 128 128" className="w-6 h-6">
      <path fill="#DC382D" d="M120.4 46.2L68.8 22.3a11.3 11.3 0 0 0-9.6 0L7.6 46.2a10.9 10.9 0 0 0 0 19.8l51.6 23.9a11.3 11.3 0 0 0 9.6 0l51.6-23.9a10.9 10.9 0 0 0 0-19.8z" />
    </svg>
  );
}

function AWSIcon() {
  return (
    <svg viewBox="0 0 128 128" className="w-6 h-6">
      <rect width="128" height="128" rx="28" fill="#232F3E" />
      <path fill="#FF9900" d="M32 72c18 14 42 16 64 2 2-1 3 1 2 3-17 12-45 15-67 1-2-1-1-4 1-6zm60-3c4 5 10 11 12 12 1 1 0 2-2 1-6-3-12-8-14-11-1-1 0-3 2-2z" />
    </svg>
  );
}

function TypeScriptIcon() {
  return (
    <svg viewBox="0 0 128 128" className="w-6 h-6">
      <rect width="128" height="128" rx="28" fill="#3178C6" />
      <path fill="#FFF" d="M38 48h30v10H58v36H46V58H38V48zm33 28c3 5 8 9 15 9s10-3 10-7c0-11-25-6-25-24 0-10 8-17 21-17 9 0 16 3 20 8l-6 8c-3-3-8-6-14-6s-9 3-9 6c0 10 25 5 25 24 0 11-9 18-22 18-11 0-19-4-23-11l9-7z" />
    </svg>
  );
}

function NextJSIcon() {
  return (
    <svg viewBox="0 0 128 128" className="w-6 h-6">
      <circle cx="64" cy="64" r="60" fill="#000" stroke="#333" strokeWidth="4" />
      <path d="M44 38v52h9V57.6l30.5 32.4h8.5V38h-9v32.4L53.5 38z" fill="#FFF" />
    </svg>
  );
}

function ReactIcon() {
  return (
    <svg viewBox="0 0 128 128" className="w-6 h-6">
      <ellipse cx="64" cy="64" rx="14" ry="48" fill="none" stroke="#61DAFB" strokeWidth="6" />
      <ellipse cx="64" cy="64" rx="14" ry="48" transform="rotate(60 64 64)" fill="none" stroke="#61DAFB" strokeWidth="6" />
      <ellipse cx="64" cy="64" rx="14" ry="48" transform="rotate(120 64 64)" fill="none" stroke="#61DAFB" strokeWidth="6" />
      <circle cx="64" cy="64" r="9" fill="#61DAFB" />
    </svg>
  );
}

function ThreeJSIcon() {
  return (
    <svg viewBox="0 0 128 128" className="w-6 h-6">
      <rect width="128" height="128" rx="28" fill="#18181B" stroke="#3F3F46" strokeWidth="4" />
      <path d="M64 24 L104 96 L24 96 Z" fill="none" stroke="#FFF" strokeWidth="6" />
      <path d="M64 24 L64 96 M24 96 L84 60 M104 96 L44 60" stroke="#38BDF8" strokeWidth="4" />
    </svg>
  );
}

function TailwindIcon() {
  return (
    <svg viewBox="0 0 128 128" className="w-6 h-6">
      <path
        fill="#06B6D4"
        d="M64 36c-16 0-26 8-30 24 6-8 13-11 21-9 5 1 8 5 12 9 6 6 13 14 27 14 16 0 26-8 30-24-6 8-13 11-21 9-5-1-8-5-12-9-6-6-13-14-27-14zm-30 28c-16 0-26 8-30 24 6-8 13-11 21-9 5 1 8 5 12 9 6 6 13 14 27 14 16 0 26-8 30-24-6 8-13 11-21 9-5-1-8-5-12-9-6-6-13-14-27-14z"
      />
    </svg>
  );
}

function LinuxIcon() {
  return (
    <svg viewBox="0 0 128 128" className="w-6 h-6">
      <circle cx="64" cy="64" r="58" fill="#FCC624" />
      <ellipse cx="64" cy="66" rx="34" ry="40" fill="#18181B" />
      <ellipse cx="64" cy="74" rx="22" ry="26" fill="#FFF" />
      <circle cx="54" cy="50" r="4" fill="#FFF" />
      <circle cx="74" cy="50" r="4" fill="#FFF" />
      <polygon points="64,58 56,66 72,66" fill="#F97316" />
    </svg>
  );
}

function GitIcon() {
  return (
    <svg viewBox="0 0 128 128" className="w-6 h-6">
      <path fill="#F05032" d="M122.8 55.7L72.3 5.2a11.8 11.8 0 0 0-16.6 0L5.2 55.7a11.8 11.8 0 0 0 0 16.6l50.5 50.5a11.8 11.8 0 0 0 16.6 0l50.5-50.5a11.8 11.8 0 0 0 0-16.6z" />
      <circle cx="48" cy="64" r="9" fill="#FFF" />
      <circle cx="78" cy="44" r="9" fill="#FFF" />
      <circle cx="78" cy="84" r="9" fill="#FFF" />
    </svg>
  );
}

function OpenAIIcon() {
  return (
    <svg viewBox="0 0 128 128" className="w-6 h-6">
      <path fill="#10A37F" d="M116.8 54.7a30.8 30.8 0 0 0-2.6-25.2 31.6 31.6 0 0 0-33-14.7 31 31 0 0 0-23.7-10.6 31.5 31.5 0 0 0-30 21.8 31 31 0 0 0-19.4 14.2 31.5 31.5 0 0 0 3.8 35.8 30.8 30.8 0 0 0 2.6 25.2 31.6 31.6 0 0 0 33 14.7 31 31 0 0 0 23.7 10.6 31.5 31.5 0 0 0 30-21.8 31 31 0 0 0 19.4-14.2 31.5 31.5 0 0 0-3.8-35.8zM64 77.2a13.2 13.2 0 1 1 13.2-13.2A13.2 13.2 0 0 1 64 77.2z" />
    </svg>
  );
}

function ClaudeIcon() {
  return (
    <svg viewBox="0 0 128 128" className="w-6 h-6">
      <circle cx="64" cy="64" r="58" fill="#D97757" />
      <path fill="#FFF" d="M86.8 50.4L74.1 57l12.7 6.6c2.8 1.5 3.9 5 2.4 7.8-1.5 2.8-5 3.9-7.8 2.4L68.7 67.2v14.4c0 3.2-2.6 5.8-5.8 5.8s-5.8-2.6-5.8-5.8V67.2L44.4 73.8c-2.8 1.5-6.3.4-7.8-2.4-1.5-2.8-.4-6.3 2.4-7.8l12.7-6.6-12.7-6.6c-2.8-1.5-3.9-5-2.4-7.8 1.5-2.8 5-3.9 7.8-2.4l12.7 6.6V32.4c0-3.2 2.6-5.8 5.8-5.8s5.8 2.6 5.8 5.8v14.4l12.7-6.6c2.8-1.5 6.3-.4 7.8 2.4 1.5 2.8.4 6.3-2.4 7.8z" />
    </svg>
  );
}

function HuggingFaceIcon() {
  return (
    <svg viewBox="0 0 128 128" className="w-6 h-6">
      <circle cx="64" cy="64" r="58" fill="#FFD21E" />
      <circle cx="44" cy="56" r="6" fill="#18181B" />
      <circle cx="84" cy="56" r="6" fill="#18181B" />
      <path d="M46 76 Q64 94 82 76" stroke="#18181B" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M22 66 Q30 50 36 62 M106 66 Q98 50 92 62" stroke="#18181B" strokeWidth="5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function GroqIcon() {
  return (
    <svg viewBox="0 0 128 128" className="w-6 h-6">
      <rect width="128" height="128" rx="28" fill="#F55036" />
      <path d="M38 72 L64 36 L90 72 Z" fill="#FFF" />
      <circle cx="64" cy="88" r="8" fill="#FFF" />
    </svg>
  );
}

function GeminiIcon() {
  return (
    <svg viewBox="0 0 128 128" className="w-6 h-6">
      <rect width="128" height="128" rx="28" fill="#1E1E2E" />
      <path d="M64 20 C64 48 80 64 108 64 C80 64 64 80 64 108 C64 80 48 64 20 64 C48 64 64 48 64 20 Z" fill="#8AB4F8" />
    </svg>
  );
}

function DeepSeekIcon() {
  return (
    <svg viewBox="0 0 128 128" className="w-6 h-6">
      <circle cx="64" cy="64" r="58" fill="#0066FF" />
      <path d="M40 70 C40 46 64 34 88 44 C88 68 64 80 40 70 Z" fill="#FFF" />
      <circle cx="64" cy="58" r="6" fill="#0066FF" />
    </svg>
  );
}

function OllamaIcon() {
  return (
    <svg viewBox="0 0 128 128" className="w-6 h-6">
      <rect width="128" height="128" rx="28" fill="#09090B" stroke="#27272A" strokeWidth="4" />
      <path d="M64 28 C48 28 36 40 36 56 C36 68 42 78 52 82 L52 98 L76 98 L76 82 C86 78 92 68 92 56 C92 40 80 28 64 28 Z" fill="#06B6D4" />
      <circle cx="54" cy="54" r="5" fill="#FFF" />
      <circle cx="74" cy="54" r="5" fill="#FFF" />
    </svg>
  );
}

function QdrantIcon() {
  return (
    <svg viewBox="0 0 128 128" className="w-6 h-6">
      <rect width="128" height="128" rx="28" fill="#DC2626" />
      <path d="M64 26 L98 46 L98 84 L64 104 L30 84 L30 46 Z" stroke="#FFF" strokeWidth="7" fill="none" />
      <circle cx="64" cy="65" r="14" fill="#FFF" />
      <path d="M64 65 L86 86" stroke="#FFF" strokeWidth="7" strokeLinecap="round" />
    </svg>
  );
}

function KubernetesIcon() {
  return (
    <svg viewBox="0 0 128 128" className="w-6 h-6">
      <rect width="128" height="128" rx="28" fill="#326CE5" />
      <circle cx="64" cy="64" r="32" fill="none" stroke="#FFF" strokeWidth="6" />
      <circle cx="64" cy="64" r="8" fill="#FFF" />
      <path d="M64 32v16M64 80v16M32 64h16M80 64h16" stroke="#FFF" strokeWidth="5" />
    </svg>
  );
}

function NodeJSIcon() {
  return (
    <svg viewBox="0 0 128 128" className="w-6 h-6">
      <path fill="#5FA04E" d="M64 12l48 28v56l-48 28-48-28V40l48-28zm0 18.5L28.8 48.7v30.6L64 97.5l35.2-18.2V48.7L64 30.5z" />
      <circle cx="64" cy="64" r="14" fill="#333" />
    </svg>
  );
}

function GraphQLIcon() {
  return (
    <svg viewBox="0 0 128 128" className="w-6 h-6">
      <path fill="#E10098" d="M64 12l45 26v52l-45 26-45-26V38l45-26zm0 14L28 47v34l36 21 36-21V47L64 26z" />
      <circle cx="64" cy="14" r="8" fill="#E10098" />
      <circle cx="109" cy="40" r="8" fill="#E10098" />
      <circle cx="109" cy="88" r="8" fill="#E10098" />
      <circle cx="64" cy="114" r="8" fill="#E10098" />
      <circle cx="19" cy="88" r="8" fill="#E10098" />
      <circle cx="19" cy="40" r="8" fill="#E10098" />
    </svg>
  );
}

function WebGLIcon() {
  return (
    <svg viewBox="0 0 128 128" className="w-6 h-6">
      <circle cx="64" cy="64" r="58" fill="#990000" />
      <path d="M30 44 L64 24 L98 44 L98 84 L64 104 L30 84 Z" fill="none" stroke="#FFF" strokeWidth="6" />
      <text x="64" y="70" fill="#FFF" fontSize="20" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
        3D
      </text>
    </svg>
  );
}

function JavaScriptIcon() {
  return (
    <svg viewBox="0 0 128 128" className="w-6 h-6">
      <rect width="128" height="128" rx="28" fill="#F7DF1E" />
      <path fill="#000" d="M37 77c3 4 7 8 13 8 7 0 11-3 11-11V38h13v36c0 15-9 22-24 22-11 0-18-4-22-10l9-9zm40 1c3 4 8 7 14 7 6 0 10-3 10-7 0-12-25-6-25-24 0-10 8-16 20-16 9 0 15 3 19 8l-6 8c-3-3-7-5-13-5s-8 3-8 6c0 10 25 5 25 24 0 11-9 18-22 18-11 0-18-4-22-10l8-9z" />
    </svg>
  );
}

function WebAudioIcon() {
  return (
    <svg viewBox="0 0 128 128" className="w-6 h-6">
      <circle cx="64" cy="64" r="58" fill="#8B5CF6" />
      <path d="M30 64h12l8-24 12 48 12-32 8 16 8-8h8" stroke="#FFF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function VercelIcon() {
  return (
    <svg viewBox="0 0 128 128" className="w-6 h-6">
      <circle cx="64" cy="64" r="58" fill="#000" stroke="#333" strokeWidth="4" />
      <polygon points="64,28 100,92 28,92" fill="#FFF" />
    </svg>
  );
}

// =============================================================================
// COMPLETE REAL SKILLS DATASETS (>50 ITEMS: 3 DENSE TRACKS OF 18 UNIQUE TECHS)
// =============================================================================

const TRACK_1_AI_AGENTS_DIFFUSION: SkillItem[] = [
  { name: "LangGraph", projectRole: "5-Agent Video Pipeline & Merchant OS", accentColor: "#F59E0B", glowColor: "rgba(245,158,11,0.35)", icon: <LangGraphIcon /> },
  { name: "Python 3.12", projectRole: "AsyncIO Automation & Modelsuite.ai", accentColor: "#387EB8", glowColor: "rgba(56,126,184,0.35)", icon: <PythonIcon /> },
  { name: "ComfyUI", projectRole: "Headless Wan 2.2 Video Diffusion", accentColor: "#A855F7", glowColor: "rgba(168,85,247,0.35)", icon: <ComfyUIIcon /> },
  { name: "PyTorch", projectRole: "Tensors & Neural Model Execution", accentColor: "#EE4C2C", glowColor: "rgba(238,76,44,0.35)", icon: <PyTorchIcon /> },
  { name: "OpenAI API", projectRole: "GPT-4o & Structured Tool Calls", accentColor: "#10A37F", glowColor: "rgba(16,163,127,0.35)", icon: <OpenAIIcon /> },
  { name: "Claude 3.7", projectRole: "Anthropic Extended Reasoning Loops", accentColor: "#D97757", glowColor: "rgba(217,119,87,0.35)", icon: <ClaudeIcon /> },
  { name: "Hugging Face", projectRole: "Open-Weights & Transformers", accentColor: "#FFD21E", glowColor: "rgba(255,210,30,0.35)", icon: <HuggingFaceIcon /> },
  { name: "Llama 3.3 70B", projectRole: "Justice.gov Grounded Answers", accentColor: "#06B6D4", glowColor: "rgba(6,182,212,0.35)", icon: <Sparkles className="w-5 h-5 text-cyan-400" /> },
  { name: "Groq", projectRole: "Ultra-Low Latency Token Ingress", accentColor: "#F55036", glowColor: "rgba(245,80,54,0.35)", icon: <GroqIcon /> },
  { name: "Gemini API", projectRole: "10-Key Embedding Pool & Cooldown", accentColor: "#8AB4F8", glowColor: "rgba(138,180,248,0.35)", icon: <GeminiIcon /> },
  { name: "DeepSeek", projectRole: "Reasoning Kernels & Code Logic", accentColor: "#0066FF", glowColor: "rgba(0,102,255,0.35)", icon: <DeepSeekIcon /> },
  { name: "Ollama", projectRole: "Local Private Model Inference", accentColor: "#06B6D4", glowColor: "rgba(6,182,212,0.35)", icon: <OllamaIcon /> },
  { name: "LangChain", projectRole: "RAG Workflows & Semantic Chunking", accentColor: "#10A37F", glowColor: "rgba(16,163,127,0.35)", icon: <LangGraphIcon /> },
  { name: "LlamaIndex", projectRole: "Data Ingestion & Index Structures", accentColor: "#8B5CF6", glowColor: "rgba(139,92,246,0.35)", icon: <Database className="w-5 h-5 text-purple-400" /> },
  { name: "vLLM", projectRole: "PagedAttention High-Throughput Serving", accentColor: "#34D399", glowColor: "rgba(52,211,153,0.35)", icon: <Sparkles className="w-5 h-5 text-emerald-400" /> },
  { name: "MCP Protocol", projectRole: "Model Context Protocol Tool Bridges", accentColor: "#F59E0B", glowColor: "rgba(245,158,11,0.35)", icon: <LangGraphIcon /> },
  { name: "FFmpeg", projectRole: "Cloud GPU Audio/Video Mastering", accentColor: "#007808", glowColor: "rgba(0,120,8,0.35)", icon: <FFmpegIcon /> },
  { name: "Fine-Tuning", projectRole: "Clinical Neutrality Protocols", accentColor: "#EC4899", glowColor: "rgba(236,72,153,0.35)", icon: <Sparkles className="w-5 h-5 text-pink-400" /> },
];

const TRACK_2_BACKEND_CLOUD_DATA: SkillItem[] = [
  { name: "FastAPI", projectRole: "Sub-50ms Merchant Guardian Kernel", accentColor: "#05998B", glowColor: "rgba(5,153,139,0.35)", icon: <FastAPIIcon /> },
  { name: "PostgreSQL", projectRole: "ACID Relational Storage & Schemas", accentColor: "#336791", glowColor: "rgba(51,103,145,0.35)", icon: <PostgreSQLIcon /> },
  { name: "Redis Streams", projectRole: "Sub-10ms Cached Hits & Pub/Sub", accentColor: "#DC382D", glowColor: "rgba(220,56,45,0.35)", icon: <RedisIcon /> },
  { name: "Pinecone", projectRole: "4-Stage Hybrid RAG Dense Spine", accentColor: "#047857", glowColor: "rgba(4,120,87,0.35)", icon: <PineconeIcon /> },
  { name: "Qdrant", projectRole: "Dense Vector Similarity Search", accentColor: "#DC2626", glowColor: "rgba(220,38,38,0.35)", icon: <QdrantIcon /> },
  { name: "DuckDB", projectRole: "40.8MB DOJ Mail OLAP Processing", accentColor: "#FFF000", glowColor: "rgba(255,240,0,0.35)", icon: <DuckDBIcon /> },
  { name: "SQLite (WAL)", projectRole: "1,000+ Reads/sec A2A Bursts", accentColor: "#00A2D9", glowColor: "rgba(0,162,217,0.35)", icon: <SQLiteIcon /> },
  { name: "Supabase", projectRole: "State Checkpoints & Approval Gates", accentColor: "#3ECF8E", glowColor: "rgba(62,207,142,0.35)", icon: <SupabaseIcon /> },
  { name: "MongoDB", projectRole: "Document Datastores & Raw JSON", accentColor: "#00ED64", glowColor: "rgba(0,237,100,0.35)", icon: <MongoDBIcon /> },
  { name: "Prisma ORM", projectRole: "Type-Safe Relational Contracts", accentColor: "#5A67D8", glowColor: "rgba(90,103,216,0.35)", icon: <PrismaIcon /> },
  { name: "Amazon AWS", projectRole: "Serverless S3, CloudFront & Lambda", accentColor: "#FF9900", glowColor: "rgba(255,153,0,0.35)", icon: <AWSIcon /> },
  { name: "Docker", projectRole: "Containerized Agent Sandboxes", accentColor: "#2496ED", glowColor: "rgba(36,150,237,0.35)", icon: <DockerIcon /> },
  { name: "Kubernetes", projectRole: "Pod Orchestration & Clustered Services", accentColor: "#326CE5", glowColor: "rgba(50,108,229,0.35)", icon: <KubernetesIcon /> },
  { name: "Cohere v3.5", projectRole: "Cross-Encoder Relevance Reranker", accentColor: "#D97757", glowColor: "rgba(217,119,87,0.35)", icon: <FastAPIIcon /> },
  { name: "BM25 Search", projectRole: "Sparse Court Document Matcher", accentColor: "#38BDF8", glowColor: "rgba(56,189,248,0.35)", icon: <Search className="w-5 h-5 text-cyan-400" /> },
  { name: "ChromaDB", projectRole: "Lightweight Embedding Storage", accentColor: "#EC4899", glowColor: "rgba(236,72,153,0.35)", icon: <Database className="w-5 h-5 text-pink-400" /> },
  { name: "Celery", projectRole: "Distributed Asynchronous Workers", accentColor: "#37814A", glowColor: "rgba(55,129,74,0.35)", icon: <FastAPIIcon /> },
  { name: "Elasticsearch", projectRole: "Distributed Full-Text Indexing", accentColor: "#FED156", glowColor: "rgba(254,209,86,0.35)", icon: <Search className="w-5 h-5 text-yellow-400" /> },
];

const TRACK_3_FRONTEND_LANGUAGES_PLATFORMS: SkillItem[] = [
  { name: "Next.js 16", projectRole: "App Router, SSR & Production Ingress", accentColor: "#FFFFFF", glowColor: "rgba(255,255,255,0.35)", icon: <NextJSIcon /> },
  { name: "React 19", projectRole: "Concurrent UI & Real-Time Streams", accentColor: "#61DAFB", glowColor: "rgba(97,218,251,0.35)", icon: <ReactIcon /> },
  { name: "TypeScript", projectRole: "Strict End-to-End Type Safety & Zod", accentColor: "#3178C6", glowColor: "rgba(49,120,198,0.35)", icon: <TypeScriptIcon /> },
  { name: "JavaScript", projectRole: "Modern ESNext Specs & Web Workers", accentColor: "#F7DF1E", glowColor: "rgba(247,223,30,0.35)", icon: <JavaScriptIcon /> },
  { name: "Three.js", projectRole: "60 FPS 3D Head-Tracking & Shaders", accentColor: "#38BDF8", glowColor: "rgba(56,189,248,0.35)", icon: <ThreeJSIcon /> },
  { name: "WebGL & GLSL", projectRole: "Hardware GPU Vertex & Fragment Passes", accentColor: "#990000", glowColor: "rgba(153,0,0,0.35)", icon: <WebGLIcon /> },
  { name: "Tailwind CSS", projectRole: "Fluid Typographic Layouts & Micro-UI", accentColor: "#06B6D4", glowColor: "rgba(6,182,212,0.35)", icon: <TailwindIcon /> },
  { name: "Zustand", projectRole: "Zero-Boilerplate Client State", accentColor: "#8E7D6B", glowColor: "rgba(142,125,107,0.35)", icon: <ZustandIcon /> },
  { name: "Framer Motion", projectRole: "Spring Physics & Kinetic Gestures", accentColor: "#F08", glowColor: "rgba(255,0,128,0.35)", icon: <Sparkles className="w-5 h-5 text-pink-500" /> },
  { name: "Node.js", projectRole: "Async V8 Event Loop & Backend Tools", accentColor: "#5FA04E", glowColor: "rgba(95,160,78,0.35)", icon: <NodeJSIcon /> },
  { name: "Express.js", projectRole: "RESTful Endpoints & Middleware", accentColor: "#94A3B8", glowColor: "rgba(148,163,184,0.35)", icon: <FastAPIIcon /> },
  { name: "Java", projectRole: "700+ LeetCode DSA Solutions & OOP", accentColor: "#E76F00", glowColor: "rgba(231,111,0,0.35)", icon: <JavaIcon /> },
  { name: "GraphQL", projectRole: "Declarative Schema Federation", accentColor: "#E10098", glowColor: "rgba(225,0,152,0.35)", icon: <GraphQLIcon /> },
  { name: "Playwright", projectRole: "11/11 E2E Commerce Scenarios", accentColor: "#2EAD33", glowColor: "rgba(46,173,51,0.35)", icon: <PlaywrightIcon /> },
  { name: "Linux / Bash", projectRole: "Debian POSIX Scripts, Crons & Daemons", accentColor: "#FCC624", glowColor: "rgba(252,198,36,0.35)", icon: <LinuxIcon /> },
  { name: "Git & GitHub", projectRole: "23+ Production Codebases Shipped", accentColor: "#F05032", glowColor: "rgba(240,80,50,0.35)", icon: <GitIcon /> },
  { name: "Web Audio API", projectRole: "Zero-Lag Procedural Sound Synthesis", accentColor: "#8B5CF6", glowColor: "rgba(139,92,246,0.35)", icon: <WebAudioIcon /> },
  { name: "Vercel", projectRole: "Edge Serverless Deployment & CI/CD", accentColor: "#FFFFFF", glowColor: "rgba(255,255,255,0.35)", icon: <VercelIcon /> },
];

// =============================================================================
// INDIVIDUAL TACTILE SKILL TILE COMPONENT
// =============================================================================

function SkillCard({ item }: { item: SkillItem }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => {
        setIsHovered(true);
        sound.hover();
      }}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => sound.click()}
      style={{
        boxShadow: isHovered ? `0 10px 30px -8px ${item.glowColor}` : "none",
        borderColor: isHovered ? `${item.accentColor}80` : "rgba(255,255,255,0.08)",
      }}
      className="group relative flex items-center gap-3.5 px-4 sm:px-5 py-3 rounded-2xl bg-[#080911]/90 backdrop-blur-md border transition-all duration-300 cursor-pointer select-none shrink-0 hover:-translate-y-1 hover:bg-[#111220]"
    >
      {/* Ambient background bloom */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"
        style={{ backgroundColor: item.accentColor }}
      />

      {/* Official Brand SVG Icon in Squircle Container */}
      <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/[0.04] p-2 flex items-center justify-center shrink-0 border border-white/[0.08] group-hover:border-white/[0.2] group-hover:scale-105 transition-all duration-300 shadow-inner">
        {item.icon}
      </div>

      {/* Skill Meta */}
      <div className="flex flex-col pr-2">
        <div className="flex items-center gap-2">
          <span className="font-space text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors tracking-tight whitespace-nowrap">
            {item.name}
          </span>
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ backgroundColor: item.accentColor }}
          />
        </div>
        <span className="font-mono text-[10px] text-zinc-400 group-hover:text-zinc-300 transition-colors whitespace-nowrap">
          {item.projectRole}
        </span>
      </div>
    </div>
  );
}

// =============================================================================
// SEAMLESS HORIZONTAL MARQUEE TRACK (GPU Accelerated Pure CSS Loop)
// =============================================================================

function MarqueeTrack({
  items,
  direction = "left",
  speedSeconds = 58,
}: {
  items: SkillItem[];
  direction?: "left" | "right";
  speedSeconds?: number;
}) {
  const loopItems = [...items, ...items, ...items];

  return (
    <div className="relative w-full overflow-hidden py-0.5">
      <div
        className="flex gap-3 sm:gap-4 w-max hover:[animation-play-state:paused]"
        style={{
          animation: `${direction === "left" ? "marquee-scroll-left" : "marquee-scroll-right"} ${speedSeconds}s linear infinite`,
          willChange: "transform",
        }}
      >
        {loopItems.map((item, idx) => (
          <SkillCard key={`${item.name}-${idx}`} item={item} />
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// MAIN EXPORT: SKILLS SECTION (>50 Rotating Technologies, Zero Row Headings)
// =============================================================================

export default function SkillsMarqueeSection() {
  return (
    <div
      id="skills"
      className="pt-24 scroll-mt-24"
    >
      {/* Inline styles for 60fps GPU compositor marquee animations */}
      <style jsx global>{`
        @keyframes marquee-scroll-left {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-33.333333%);
          }
        }
        @keyframes marquee-scroll-right {
          0% {
            transform: translateX(-33.333333%);
          }
          100% {
            transform: translateX(0%);
          }
        }
      `}</style>

      {/* =====================================================================
          SECTION HEADER WITH TYPOGRAPHY & OVERALL STATS
          ===================================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-12">
        <div>
          {/* Eyebrow Kicker */}
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)] animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold">
              Subsection 02 &bull; Production Toolkit
            </span>
          </div>

          <h3 className="font-space text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white leading-none">
            Technologies &amp; Stack
          </h3>
        </div>

        {/* Editorial Subtitle & Badge */}
        <div className="max-w-xl">
          <p className="text-sm sm:text-base text-zinc-300 font-sans leading-relaxed mb-4">
            Production toolkits spanning multi-agent reasoning meshes, high-throughput distributed backends, OLAP data engines, and 3D WebGL interfaces.
          </p>

          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 font-medium">
              <Sparkles className="w-3 h-3" />
              54 Production Technologies Active
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-zinc-300 font-medium">
              Continuous 60 FPS Hardware Acceleration
            </span>
          </div>
        </div>
      </div>

      {/* =====================================================================
          CONTINUOUS WALL OF ROTATING TECH ICONS (Zero Row Label Headings)
          ===================================================================== */}
      <div className="relative rounded-3xl border border-white/[0.08] bg-[#05060b]/70 backdrop-blur-2xl p-4 sm:p-7 shadow-2xl overflow-hidden">
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-amber-500/[0.06] blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 right-1/4 w-96 h-96 bg-cyan-500/[0.06] blur-3xl pointer-events-none" />

        {/* Horizontal Edge Gradient Mask: Fades out icons smoothly into the sides */}
        <div
          className="relative w-full space-y-3 sm:space-y-4 py-2"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)",
          }}
        >
          {/* Rail 1 (18 items, Scrolls Left) */}
          <MarqueeTrack items={TRACK_1_AI_AGENTS_DIFFUSION} direction="left" speedSeconds={56} />

          {/* Rail 2 (18 items, Scrolls Right) */}
          <MarqueeTrack items={TRACK_2_BACKEND_CLOUD_DATA} direction="right" speedSeconds={62} />

          {/* Rail 3 (18 items, Scrolls Left) */}
          <MarqueeTrack items={TRACK_3_FRONTEND_LANGUAGES_PLATFORMS} direction="left" speedSeconds={52} />
        </div>

        {/* Tactile Status Bar at Bottom of Marquee */}
        <div className="mt-6 pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="text-zinc-400">54 Technologies Rotating &bull; Verified Across Live Projects</span>
          </div>

          <div className="flex items-center gap-2 text-zinc-400 text-[11px]">
            <span>Hover over any technology to inspect implementation role</span>
          </div>
        </div>
      </div>
    </div>
  );
}
