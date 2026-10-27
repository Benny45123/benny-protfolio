"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { sound } from "./SoundEffects";
import { Volume2, VolumeX, Box } from "lucide-react";

export default function Navbar() {
  const [soundOn, setSoundOn] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    sound.enabled = next;
    if (next) sound.click();
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#050508]/92 backdrop-blur-xl border-b border-white/[0.08] shadow-lg shadow-black/40 py-3.5"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12 flex items-center justify-between">
        {/* Brand / Logo */}
        <a
          href="#"
          onClick={() => sound.click()}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 group-hover:scale-125 transition-transform" />
          <span className="font-syne text-lg font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors">
            Benny<span className="text-amber-500">.</span>
          </span>
        </a>

        {/* Clean Menu Items: About, Portfolio, Experience, Contact */}
        <nav className="hidden md:flex items-center gap-9 text-sm font-space text-zinc-300">
          <a
            href="#about"
            onMouseEnter={() => sound.hover()}
            onClick={() => sound.click()}
            className="hover:text-white transition-colors relative py-1 hover:after:w-full after:w-0 after:h-[2px] after:bg-amber-400 after:absolute after:bottom-0 after:left-0 after:transition-all"
          >
            About
          </a>
          <a
            href="#portfolio"
            onMouseEnter={() => sound.hover()}
            onClick={() => sound.click()}
            className="hover:text-white transition-colors relative py-1 hover:after:w-full after:w-0 after:h-[2px] after:bg-amber-400 after:absolute after:bottom-0 after:left-0 after:transition-all"
          >
            Portfolio
          </a>
          <a
            href="#experience"
            onMouseEnter={() => sound.hover()}
            onClick={() => sound.click()}
            className="hover:text-white transition-colors relative py-1 hover:after:w-full after:w-0 after:h-[2px] after:bg-amber-400 after:absolute after:bottom-0 after:left-0 after:transition-all"
          >
            Experience
          </a>
          <a
            href="#contact"
            onMouseEnter={() => sound.hover()}
            onClick={() => sound.click()}
            className="hover:text-white transition-colors relative py-1 hover:after:w-full after:w-0 after:h-[2px] after:bg-amber-400 after:absolute after:bottom-0 after:left-0 after:transition-all"
          >
            Contact
          </a>
        </nav>

        {/* Action Buttons: Sound toggle, Play with 3D & Hire Me */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            onClick={toggleSound}
            aria-label="Toggle Sound"
            className="p-2 rounded-full border border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:text-white hover:border-white/[0.2] transition-colors cursor-pointer"
            title={soundOn ? "Mute audio" : "Enable tactile sound"}
          >
            {soundOn ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5 text-zinc-600" />}
          </button>

          {/* Prominent Play with 3D Button - Tailored typography & luminous styling */}
          <Link
            href="/viewer"
            onClick={() => sound.click()}
            onMouseEnter={() => sound.hover()}
            className="group relative flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full border border-amber-400/40 bg-gradient-to-r from-amber-500/10 via-amber-400/15 to-amber-500/10 hover:from-amber-400/25 hover:to-amber-500/25 text-amber-300 hover:text-white font-space font-bold text-xs tracking-wider transition-all duration-300 shadow-[0_0_15px_-3px_rgba(245,158,11,0.25)] hover:shadow-[0_0_22px_rgba(245,158,11,0.45)] hover:border-amber-400 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
            </span>
            <Box className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
            <span className="tracking-wide">Play with 3D</span>
          </Link>

          <a
            href="#contact"
            onClick={() => sound.click()}
            onMouseEnter={() => sound.hover()}
            className="hidden sm:inline-flex px-5 py-2.5 rounded-full bg-white text-black hover:bg-amber-400 hover:text-black font-space font-semibold text-xs tracking-wider transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95"
          >
            Hire Me
          </a>
        </div>
      </div>
    </header>
  );
}
