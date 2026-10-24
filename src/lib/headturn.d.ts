export interface HeadTurnOptions {
  configUrl?: string;
  area?: 'window' | 'container';
  fit?: 'contain' | 'cover';
  smoothing?: number | null;
  deadZone?: number | null;
  smileStart?: number;
  smileEnd?: number;
  lookDownZone?: 'bottom' | 'none';
  pitchStart?: number;
  pitchEnd?: number;
  gate?: number;
  touchSlop?: number;
  touchYawRange?: number;
  touchPitchRange?: number;
  touchAction?: string;
  concurrency?: number;
  tier?: number | null;
  maxDpr?: number;
  keyboard?: boolean;
  onReady?: ((api: HeadTurnInstance) => void) | null;
  onProgress?: ((progress: number) => void) | null;
  onTier?: ((tier: number) => void) | null;
  [key: string]: unknown;
}

export interface HeadTurnState {
  u: number;
  v: number;
  s: number;
  sy: number;
  sp: number;
  sm: number;
  tier: number;
  fmt: string;
  yawFrame: number;
  pitchFrame: number;
  smileFrame: number;
  loaded: number;
  total: number;
  state: string;
  reducedMotion: boolean;
  config: unknown;
}

export interface HeadTurnInstance {
  getState: () => HeadTurnState;
  setPose: (nu: number, nv?: number, ns?: number) => void;
  reset: () => void;
  destroy: () => void;
}

export function createHeadTurn(
  container: HTMLElement,
  userOpts?: HeadTurnOptions
): Promise<HeadTurnInstance>;

export default createHeadTurn;
