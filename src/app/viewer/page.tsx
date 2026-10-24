"use client";

import Link from "next/link";
import { ArrowLeft, Box, Sparkles } from "lucide-react";
import { sound } from "@/components/SoundEffects";

export default function ModelViewerPage() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#07080c] select-none">
      {/* Top Navigation Bar with High-End Editorial Typography */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-3">
        <Link
          href="/"
          onClick={() => sound.click()}
          onMouseEnter={() => sound.hover()}
          className="flex items-center gap-2 px-4 py-2 text-xs font-space font-semibold text-zinc-300 bg-[#0d0e15]/85 hover:bg-[#151722] border border-white/[0.12] rounded-full backdrop-blur-md transition-all shadow-xl hover:text-white hover:border-amber-400/50 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
          <span>Back to Portfolio</span>
        </Link>

        <span className="hidden sm:flex items-center gap-2 px-4 py-2 text-xs font-space font-semibold text-amber-300 bg-amber-950/30 border border-amber-500/25 rounded-full backdrop-blur-md shadow-lg">
          <Box className="w-3.5 h-3.5 text-amber-400" />
          <span>Interactive 3D Inspector</span>
        </span>
      </div>

      {/* Embedded High-Performance Three.js Viewport */}
      <iframe
        src="/viewer.html"
        title="Benny 3D Model Inspector"
        className="w-full h-full border-0"
        allow="accelerometer; gyroscope; vr"
      />
    </div>
  );
}
