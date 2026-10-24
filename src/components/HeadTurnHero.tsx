'use client';

import React, { useEffect, useRef } from 'react';
import { createHeadTurn, HeadTurnInstance, HeadTurnState, HeadTurnOptions } from '@/lib/headturn';

export type HeadTurnAPI = HeadTurnInstance;
export type { HeadTurnState, HeadTurnOptions };

export interface HeadTurnHeroProps {
  src?: string;
  area?: 'window' | 'container';
  fit?: 'contain' | 'cover';
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
  options?: Partial<HeadTurnOptions>;
  onReady?: (api: HeadTurnAPI) => void;
  onError?: (error: unknown) => void;
  onProgress?: (ratio: number) => void;
  onTier?: (tier: number) => void;
  children?: React.ReactNode;
}

export default function HeadTurnHero({
  src = '/headturn',
  area = 'window',
  fit = 'contain',
  className = '',
  style,
  alt = 'Benny Bezawada - Interactive 3D portrait that turns and smiles with your cursor',
  options,
  onReady,
  onError,
  onProgress,
  onTier,
  children,
}: HeadTurnHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cb = useRef({ onReady, onError, onProgress, onTier });

  useEffect(() => {
    cb.current = { onReady, onError, onProgress, onTier };
  });

  useEffect(() => {
    let inst: HeadTurnAPI | null = null;
    let dead = false;

    if (!containerRef.current) return;

    createHeadTurn(containerRef.current, {
      configUrl: `${src}/config.json`,
      area,
      fit,
      onProgress: (p: number) => cb.current.onProgress?.(p),
      onTier: (t: number) => cb.current.onTier?.(t),
      ...options,
    })
      .then((i: HeadTurnAPI) => {
        if (dead) {
          i.destroy();
        } else {
          inst = i;
          cb.current.onReady?.(i);
        }
      })
      .catch((e: unknown) => {
        if (!dead) {
          (cb.current.onError ?? console.error)(e);
        }
      });

    return () => {
      dead = true;
      inst?.destroy();
    };
  }, [src, area, fit]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      style={{ position: 'relative', width: '100%', height: '100%', ...style }}
      className={`overflow-hidden select-none ${className}`}
    >
      <div
        ref={containerRef}
        aria-label={alt}
        style={{ position: 'absolute', inset: 0 }}
      />
      {children ? (
        <div style={{ position: 'relative', zIndex: 1, pointerEvents: 'none', height: '100%' }}>
          {children}
        </div>
      ) : null}
    </div>
  );
}
