# Benny Portfolio Engineering & Design Standards

## 1. Visual & Creative Direction
- **No generic cyberpunk tropes:** Absolutely NO neon purple/cyan gradients, matrix rain, random particle clouds, glowing skill spheres, or CRT scanlines.
- **Aesthetic:** Precision Industrial / High-End Digital Product (Teenage Engineering, Linear, Stripe Press, Apple Pro hardware).
- **Palette:** Zinc/slate/graphite monochrome canvas (`#09090b`, `#121215`, `#18181b`) with focused amber/orange (`#F59E0B`) functional telemetry accents.
- **Typography:** Technical precision pairing (`Geist Sans` / `Geist Mono` or `Inter` / `JetBrains Mono`).

## 2. The 4 Primary Systems (Non-Negotiable)
Every showcase section must tell a technical story around these systems:
1. **Agentic Merchant OS:** Autonomous commerce orchestration (inventory balancing, dynamic pricing, supplier negotiation, automated ledger settlement).
2. **Agentic AI Video Pipeline:** Multi-stage autonomous media generation (scripting -> prompt expansion -> diffusion frames -> voice synthesis -> temporal stitching).
3. **Gov-Transparency-RAG:** Deterministic, hallucination-resistant retrieval engine for legislative and public expenditure records.
4. **CareerForge AI:** Multi-agent career intelligence, semantic resume parsing, and deterministic ATS evaluation.

## 3. Strict Verification Loop
Never consider any component or section finished simply because the code compiles.
Every iteration must follow:
`DESIGN → IMPLEMENT → RUN → BROWSER INSPECT (DevTools MCP) → VISUAL CHECK (Playwright MCP) → RESPONSIVE TEST → PERFORMANCE CHECK → FIX → REPEAT`

## 4. Performance Budget (60+ FPS Guarantee)
- Isolated client canvas boundaries (`dynamic(() => import(...), { ssr: false })`).
- `InstancedMesh` for repeated nodes to keep draw calls < 30.
- `frameloop="demand"` when idle; only loop on active interaction or animation.
- Adaptive DPR clamped to `[1, 1.5]` to protect 4K/retina displays.
- All body text and documentation must live in accessible DOM (HTML/CSS), never rendered as blurry 3D textures.
