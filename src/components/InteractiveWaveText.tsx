"use client";

import React, { useState, useRef, useCallback } from "react";

interface InteractiveWaveTextProps {
  text?: string;
  className?: string;
}

export default function InteractiveWaveText({
  text = "BENNYHINN",
  className = "",
}: InteractiveWaveTextProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [cursorRatio, setCursorRatio] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const letters = text.split("");

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width > 0) {
      const relX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      setCursorRatio(relX / rect.width);
      setIsHovered(true);
    }
  }, []);

  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);
    setCursorRatio(null);
  }, []);

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`relative inline-flex items-center justify-center select-none cursor-pointer z-0 ${className}`}
      style={{ perspective: 1000 }}
    >
      {letters.map((char, index) => {
        // Calculate magnification & wave lift based on cursor distance
        let scale = 1;
        let translateY = 0;
        let glow = 0;

        if (isHovered && cursorRatio !== null && letters.length > 0) {
          const letterCenterX = (index + 0.5) / letters.length;
          const dist = Math.abs(cursorRatio - letterCenterX);
          const maxDist = 0.28; // Interaction radius in normalized ratio

          if (dist < maxDist) {
            const norm = 1 - dist / maxDist;
            // Smooth cosine wave curve for fluid magnification
            const waveFactor = Math.sin((norm * Math.PI) / 2);
            scale = 1 + waveFactor * 0.38; // Up to 1.38x magnification
            translateY = -waveFactor * 24; // Up to 24px wave lift
            glow = waveFactor;
          }
        }

        return (
          <span
            key={index}
            className="inline-block transition-transform duration-150 ease-out origin-bottom font-syne font-black tracking-[0.05em]"
            style={{
              transform: `translateY(${translateY}px) scale(${scale})`,
              WebkitTextStroke: glow > 0.1 
                ? `${1.5 + glow * 1.5}px rgba(245, 158, 11, ${0.4 + glow * 0.6})`
                : "1.5px rgba(255, 255, 255, 0.22)",
              color: glow > 0.1 
                ? `rgba(251, 191, 36, ${0.15 + glow * 0.5})` 
                : "transparent",
              textShadow: glow > 0.1 
                ? `0 0 ${15 * glow}px rgba(245, 158, 11, ${glow * 0.6})` 
                : "none",
              willChange: "transform, color",
            }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
}
