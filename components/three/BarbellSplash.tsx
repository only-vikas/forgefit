"use client";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BarbellSplash.tsx  –  Cinematic 3D Barbell Splash Screen
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Full-screen splash overlay that:
 *   1. Renders a vanilla Three.js scene with a 3D barbell
 *   2. Plates drop in with GSAP-driven physics (bounce)
 *   3. After 2.5s (or on click), plates shatter outward as particles
 *   4. Scene fades out and calls `onComplete` → revealing hero below
 *   5. Volumetric fog + neon rim lighting for cinematic atmosphere
 *   6. Falls back to a static overlay on mobile / low-power devices
 *
 * Props:
 *   onComplete: () => void   —  fired when animation finishes
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef, useCallback, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";

/* ── Constants ── */
const LIME = 0xc8ff00;
const BG = 0x080808;
const BAR_LENGTH = 6;
const BAR_RADIUS = 0.06;
const PLATE_RADIUS = 0.9;
const PLATE_THICKNESS = 0.12;
const PLATE_COUNT = 3; // plates per side
const PLATE_GAP = 0.18;
const SHATTER_DELAY = 2500; // ms before auto-shatter

interface Props {
  onComplete: () => void;
}

export default function BarbellSplash({ onComplete }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasShattered = useRef(false);
  const [dismissed, setDismissed] = useState(false);

  /* ── Shatter + dismiss logic ── */
  const triggerShatter = useCallback(
    (
      plates: THREE.Mesh[],
      scene: THREE.Scene,
      camera: THREE.PerspectiveCamera,
      renderer: THREE.WebGLRenderer,
      bar: THREE.Mesh,
      rimLight: THREE.PointLight
    ) => {
      if (hasShattered.current) return;
      hasShattered.current = true;

      /* ── Create particle shards from each plate ── */
      const shards: THREE.Mesh[] = [];
      const shardGeo = new THREE.BoxGeometry(0.06, 0.06, 0.06);
      const shardMat = new THREE.MeshStandardMaterial({
        color: LIME,
        emissive: LIME,
        emissiveIntensity: 0.6,
        metalness: 0.9,
        roughness: 0.3,
      });

      plates.forEach((plate) => {
        const pos = new THREE.Vector3();
        plate.getWorldPosition(pos);

        /* Generate 12 shards per plate */
        for (let i = 0; i < 12; i++) {
          const shard = new THREE.Mesh(shardGeo, shardMat);
          shard.position.copy(pos);
          /* Random slight offset */
          shard.position.x += (Math.random() - 0.5) * 0.3;
          shard.position.y += (Math.random() - 0.5) * 0.3;
          shard.position.z += (Math.random() - 0.5) * 0.3;
          scene.add(shard);
          shards.push(shard);

          /* Explode outward */
          const dir = new THREE.Vector3(
            (Math.random() - 0.5) * 6,
            Math.random() * 4 + 1,
            (Math.random() - 0.5) * 6
          );

          gsap.to(shard.position, {
            x: shard.position.x + dir.x,
            y: shard.position.y + dir.y,
            z: shard.position.z + dir.z,
            duration: 1.2,
            ease: "power2.out",
          });

          gsap.to(shard.rotation, {
            x: Math.random() * Math.PI * 4,
            y: Math.random() * Math.PI * 4,
            duration: 1.2,
            ease: "power1.out",
          });

          gsap.to(shard.scale, {
            x: 0,
            y: 0,
            z: 0,
            duration: 1.2,
            delay: 0.3,
            ease: "power2.in",
          });
        }

        /* Hide original plate */
        gsap.to(plate.scale, { x: 0, y: 0, z: 0, duration: 0.3, ease: "power2.in" });
      });

      /* Fade out bar */
      gsap.to(bar.scale, { x: 0, y: 0, z: 0, duration: 0.6, delay: 0.2, ease: "power2.in" });

      /* Flash the rim light bright then off */
      gsap.to(rimLight, {
        intensity: 8,
        duration: 0.15,
        ease: "power4.out",
        yoyo: true,
        repeat: 1,
      });

      /* Dismiss overlay after explosion settles */
      gsap.delayedCall(1.4, () => {
        setDismissed(true);
        onComplete();

        /* Cleanup Three.js */
        renderer.dispose();
        shardGeo.dispose();
        shardMat.dispose();
        scene.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            obj.geometry.dispose();
            if (Array.isArray(obj.material)) {
              obj.material.forEach((m) => m.dispose());
            } else {
              obj.material.dispose();
            }
          }
        });
      });
    },
    [onComplete]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    /* ── Touch / low-power detection ── */
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      /* Skip 3D on mobile — just show a quick overlay then dismiss */
      const t = setTimeout(() => {
        setDismissed(true);
        onComplete();
      }, 800);
      return () => clearTimeout(t);
    }

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     * THREE.JS SCENE SETUP
     * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    const w = window.innerWidth;
    const h = window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(BG);
    scene.fog = new THREE.FogExp2(BG, 0.12); // volumetric depth

    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
    camera.position.set(0, 0.6, 5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    /* ── Lighting ── */
    const ambient = new THREE.AmbientLight(0xffffff, 0.15);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 0.6);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(LIME, 2.5, 15);
    rimLight.position.set(-2, 1, 3);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0x00ccff, 1.0, 12);
    fillLight.position.set(2, -1, 2);
    scene.add(fillLight);

    /* ── Materials ── */
    const barMat = new THREE.MeshStandardMaterial({
      color: 0x888888,
      metalness: 0.95,
      roughness: 0.15,
    });

    const plateMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      metalness: 0.85,
      roughness: 0.25,
      emissive: LIME,
      emissiveIntensity: 0.05,
    });

    const collarMat = new THREE.MeshStandardMaterial({
      color: LIME,
      metalness: 0.7,
      roughness: 0.3,
      emissive: LIME,
      emissiveIntensity: 0.3,
    });

    /* ── Bar ── */
    const barGeo = new THREE.CylinderGeometry(BAR_RADIUS, BAR_RADIUS, BAR_LENGTH, 16);
    const bar = new THREE.Mesh(barGeo, barMat);
    bar.rotation.z = Math.PI / 2; // horizontal
    scene.add(bar);

    /* ── Plates (built & positioned, start above scene) ── */
    const plates: THREE.Mesh[] = [];
    const plateGeo = new THREE.CylinderGeometry(PLATE_RADIUS, PLATE_RADIUS, PLATE_THICKNESS, 32);

    for (let side = -1; side <= 1; side += 2) {
      for (let i = 0; i < PLATE_COUNT; i++) {
        const plate = new THREE.Mesh(plateGeo, plateMat.clone());
        const xOff = side * (BAR_LENGTH / 2 - 0.4 - i * (PLATE_THICKNESS + PLATE_GAP));
        plate.rotation.z = Math.PI / 2;
        plate.position.set(xOff, 5 + i * 1.2, 0); // start high → drop
        scene.add(plate);
        plates.push(plate);

        /* Small collar ring next to plate */
        if (i === 0) {
          const collarGeo = new THREE.TorusGeometry(BAR_RADIUS + 0.03, 0.02, 8, 24);
          const collar = new THREE.Mesh(collarGeo, collarMat);
          collar.position.set(xOff - side * 0.12, 0, 0);
          collar.rotation.x = Math.PI / 2;
          scene.add(collar);
        }
      }
    }

    /* ── Drop-in animation ── */
    plates.forEach((plate, idx) => {
      const side = idx < PLATE_COUNT ? -1 : 1;
      const i = idx % PLATE_COUNT;
      const xOff = side * (BAR_LENGTH / 2 - 0.4 - i * (PLATE_THICKNESS + PLATE_GAP));

      gsap.to(plate.position, {
        y: 0,
        x: xOff,
        duration: 0.7,
        delay: 0.15 * idx,
        ease: "bounce.out",
      });
    });

    /* ── Auto-shatter timer ── */
    const shatterTimer = setTimeout(() => {
      triggerShatter(plates, scene, camera, renderer, bar, rimLight);
    }, SHATTER_DELAY);

    /* ── Click to skip ── */
    const onPointerDown = () => {
      clearTimeout(shatterTimer);
      triggerShatter(plates, scene, camera, renderer, bar, rimLight);
    };
    container.addEventListener("pointerdown", onPointerDown);

    /* ── Render loop ── */
    let rafId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      /* Subtle bar rotation idle */
      bar.rotation.y = Math.sin(t * 0.4) * 0.08;
      bar.rotation.x = Math.cos(t * 0.3) * 0.03;

      /* Rim light subtle pulse */
      rimLight.intensity = 2.5 + Math.sin(t * 2) * 0.5;

      renderer.render(scene, camera);
    };
    animate();

    /* ── Resize handler ── */
    const onResize = () => {
      const nw = window.innerWidth;
      const nh = window.innerHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", onResize);

    /* ── Cleanup ── */
    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(shatterTimer);
      window.removeEventListener("resize", onResize);
      container.removeEventListener("pointerdown", onPointerDown);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [onComplete, triggerShatter]);

  /* ── Mobile fallback: simple animated overlay ── */
  if (dismissed) return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9000,
        background: "#080808",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
    >
      {/* Mobile fallback text (hidden when canvas mounts on desktop) */}
      <div
        className="md:hidden flex flex-col items-center gap-4"
        style={{ color: "#C8FF00" }}
      >
        <div className="text-4xl font-extrabold font-space-grotesk tracking-tighter">
          FORGEFIT
        </div>
        <div className="text-xs tracking-[0.5em] uppercase opacity-60">
          Loading System…
        </div>
      </div>
    </div>
  );
}
