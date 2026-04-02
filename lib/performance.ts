/**
 * ─────────────────────────────────────────────────────────────────────────────
 * lib/performance.ts  –  Global Utilities for 3D/Animation Cleanup
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Implements critical cleanup macros for Three.js unmounting, GSAP timeline
 * clearing, and RequestAnimationFrame throttling, ensuring high 60fps UX.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * Three.js Memory Cleanup
 * Deep-disposes geometries, materials, and textures attached to a scene/object.
 */
export const disposeThreeMemory = (obj: any) => {
  if (!obj) return;
  if (obj.geometry) {
    obj.geometry.dispose();
  }
  if (obj.material) {
    if (Array.isArray(obj.material)) {
      obj.material.forEach((mat: any) => {
        if (mat.map) mat.map.dispose();
        mat.dispose();
      });
    } else {
      if (obj.material.map) obj.material.map.dispose();
      obj.material.dispose();
    }
  }
  if (obj.children) {
    obj.children.forEach((child: any) => disposeThreeMemory(child));
  }
};

/**
 * Throttle RAF wrapper
 * Helps cap logic updates to specific framerates if needed (e.g. 30fps fallback).
 */
export const throttleRAF = (callback: () => void, limitLimitHz: number = 60) => {
  const waitMs = 1000 / limitLimitHz;
  let lastTime = 0;
  let rafId: number;

  const loop = (time: number) => {
    if (time - lastTime >= waitMs) {
      callback();
      lastTime = time;
    }
    rafId = requestAnimationFrame(loop);
  };
  rafId = requestAnimationFrame(loop);

  return () => cancelAnimationFrame(rafId);
};

/**
 * GSAP Lag Smoothing Defaults
 * Inject somewhere globally if the timeline gets out of sync on mount.
 */
export const optimizeGSAP = (gsapConfig: any) => {
  if (typeof window !== "undefined") {
    gsapConfig.ticker.lagSmoothing(1000, 16);
  }
};
