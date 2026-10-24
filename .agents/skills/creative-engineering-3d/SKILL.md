---
name: creative-engineering-3d
description: Best practices, architecture patterns, and shader/WebGL performance strategies for high-end digital product 3D experiences in React Three Fiber and Three.js.
---

# Creative Engineering 3D Skill Guide

## Core Principles
1. **3D as an Explanatory Mechanism, Not Decoration:**
   Every 3D module must visualize real systems logic: state machines, DAG workflows, vector spaces, or hardware architecture.
2. **Deterministic Performance:**
   - Draw calls per frame must remain below 30.
   - Batch repeating geometries using `<instancedMesh>`.
   - Never load uncompressed textures or heavy `.gltf` without Draco compression (`useGLTF`).
   - Use procedural shaders or matcaps where possible to eliminate asset download times.
3. **Decoupled Architecture:**
   - Keep 3D Canvas in a dedicated client container (`use client`).
   - Use dynamic imports with `ssr: false` in Next.js App Router:
     ```tsx
     const SystemCanvas = dynamic(() => import("./SystemCanvas"), { ssr: false });
     ```
   - Ensure the canvas is isolated (`fixed inset-0 pointer-events-none`) with interactive elements enabled via selective raycasting.
4. **Camera & Motion Choreography:**
   - Synchronize camera rigs with scroll position via smooth interpolation (damping).
   - Never hijack user scroll behavior.
