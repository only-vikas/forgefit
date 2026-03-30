"use client";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * HeroAnatomicalBody.tsx  –  Interactive 3D Anatomical Body
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Low-poly procedural human figure built from Box/Cylinder/Sphere geometry:
 *   • Individual muscle-group meshes (chest, back, quads, delts, biceps, etc.)
 *   • Hover → highlight in #C8FF00 with emissive glow
 *   • Scroll-driven camera orbit via external scroll progress [0→1]
 *   • Subtle idle breathing + ambient rotation
 *   • Dark cinematic lighting with neon rim + soft key
 *   • Full cleanup / dispose on unmount
 *   • Mobile fallback: shows a static silhouette
 *
 * Props:
 *   scrollProgress: number (0–1)  from parent Lenis scroll
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";

/* ── Accent colours ── */
const LIME = 0xc8ff00;
const SKIN_BASE = 0x222222;
const BG = 0x080808;

/* ── Muscle group definition ── */
interface MuscleGroupDef {
  name: string;
  geometry: () => THREE.BufferGeometry;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

/**
 * Build the body blueprint – each entry produces one selectable mesh.
 * Using simple parametric geometry keeps the bundle tiny and avoids
 * external model loading.
 */
function buildBodyBlueprint(): MuscleGroupDef[] {
  return [
    /* ── Torso ── */
    {
      name: "Chest",
      geometry: () => new THREE.BoxGeometry(0.9, 0.55, 0.45),
      position: [0, 1.25, 0.05],
    },
    {
      name: "Core",
      geometry: () => new THREE.BoxGeometry(0.7, 0.5, 0.38),
      position: [0, 0.72, 0.02],
    },
    {
      name: "Upper Back",
      geometry: () => new THREE.BoxGeometry(0.92, 0.55, 0.35),
      position: [0, 1.25, -0.18],
    },
    {
      name: "Lower Back",
      geometry: () => new THREE.BoxGeometry(0.65, 0.45, 0.3),
      position: [0, 0.73, -0.15],
    },

    /* ── Shoulders / Delts ── */
    {
      name: "L Delt",
      geometry: () => new THREE.SphereGeometry(0.17, 12, 10),
      position: [-0.58, 1.52, 0],
    },
    {
      name: "R Delt",
      geometry: () => new THREE.SphereGeometry(0.17, 12, 10),
      position: [0.58, 1.52, 0],
    },

    /* ── Arms ── */
    {
      name: "L Bicep",
      geometry: () => new THREE.CylinderGeometry(0.1, 0.09, 0.42, 10),
      position: [-0.62, 1.18, 0.04],
      rotation: [0, 0, 0.08],
    },
    {
      name: "R Bicep",
      geometry: () => new THREE.CylinderGeometry(0.1, 0.09, 0.42, 10),
      position: [0.62, 1.18, 0.04],
      rotation: [0, 0, -0.08],
    },
    {
      name: "L Forearm",
      geometry: () => new THREE.CylinderGeometry(0.08, 0.06, 0.4, 10),
      position: [-0.65, 0.78, 0.05],
      rotation: [0, 0, 0.05],
    },
    {
      name: "R Forearm",
      geometry: () => new THREE.CylinderGeometry(0.08, 0.06, 0.4, 10),
      position: [0.65, 0.78, 0.05],
      rotation: [0, 0, -0.05],
    },

    /* ── Legs ── */
    {
      name: "L Quad",
      geometry: () => new THREE.CylinderGeometry(0.16, 0.12, 0.6, 10),
      position: [-0.22, 0.15, 0.03],
    },
    {
      name: "R Quad",
      geometry: () => new THREE.CylinderGeometry(0.16, 0.12, 0.6, 10),
      position: [0.22, 0.15, 0.03],
    },
    {
      name: "L Hamstring",
      geometry: () => new THREE.CylinderGeometry(0.14, 0.11, 0.58, 10),
      position: [-0.22, 0.15, -0.08],
    },
    {
      name: "R Hamstring",
      geometry: () => new THREE.CylinderGeometry(0.14, 0.11, 0.58, 10),
      position: [0.22, 0.15, -0.08],
    },
    {
      name: "L Calf",
      geometry: () => new THREE.CylinderGeometry(0.1, 0.07, 0.5, 10),
      position: [-0.22, -0.42, 0],
    },
    {
      name: "R Calf",
      geometry: () => new THREE.CylinderGeometry(0.1, 0.07, 0.5, 10),
      position: [0.22, -0.42, 0],
    },

    /* ── Glutes ── */
    {
      name: "L Glute",
      geometry: () => new THREE.SphereGeometry(0.16, 10, 8),
      position: [-0.18, 0.42, -0.12],
      scale: [1, 0.8, 0.9],
    },
    {
      name: "R Glute",
      geometry: () => new THREE.SphereGeometry(0.16, 10, 8),
      position: [0.18, 0.42, -0.12],
      scale: [1, 0.8, 0.9],
    },

    /* ── Head (non-interactive, just for silhouette) ── */
    {
      name: "Head",
      geometry: () => new THREE.SphereGeometry(0.18, 14, 12),
      position: [0, 1.88, 0],
    },
    {
      name: "Neck",
      geometry: () => new THREE.CylinderGeometry(0.08, 0.1, 0.15, 10),
      position: [0, 1.68, 0],
    },

    /* ── Traps ── */
    {
      name: "Traps",
      geometry: () => new THREE.BoxGeometry(0.55, 0.2, 0.25),
      position: [0, 1.56, -0.06],
    },
  ];
}

interface Props {
  scrollProgress: number;
}

export default function HeroAnatomicalBody({ scrollProgress }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(0);
  const hoveredRef = useRef<THREE.Mesh | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(true);

  /* Keep scroll in sync via ref (no re-render) */
  scrollRef.current = scrollProgress;

  const cleanupRef = useRef<(() => void) | null>(null);

  /* Detect mobile via width (more reliable than pointer query for headless/test browsers) */
  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isDesktop) return;

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     * SCENE
     * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    const w = container.clientWidth;
    const h = container.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(BG, 0.18);

    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 50);
    camera.position.set(0, 1.0, 4.5);
    camera.lookAt(0, 0.9, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    container.appendChild(renderer.domElement);

    /* ── Lighting ── */
    scene.add(new THREE.AmbientLight(0xffffff, 0.2));

    const keyLight = new THREE.DirectionalLight(0xffffff, 0.5);
    keyLight.position.set(2, 3, 4);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(LIME, 2.0, 10);
    rimLight.position.set(-2, 2, 3);
    scene.add(rimLight);

    const backLight = new THREE.PointLight(0x3366ff, 1.2, 10);
    backLight.position.set(1, 0, -3);
    scene.add(backLight);

    /* ── Build body ── */
    const bodyGroup = new THREE.Group();
    scene.add(bodyGroup);

    const blueprint = buildBodyBlueprint();
    const muscleMeshes: THREE.Mesh[] = [];

    blueprint.forEach((def) => {
      const geo = def.geometry();
      const mat = new THREE.MeshStandardMaterial({
        color: SKIN_BASE,
        metalness: 0.4,
        roughness: 0.55,
        emissive: 0x000000,
        emissiveIntensity: 0,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...def.position);
      if (def.rotation) mesh.rotation.set(...def.rotation);
      if (def.scale) mesh.scale.set(...def.scale);
      mesh.userData.muscleName = def.name;
      bodyGroup.add(mesh);
      muscleMeshes.push(mesh);
    });

    /* ── Raycaster for hover ── */
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2(9999, 9999); // offscreen initially

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      /* Update tooltip position */
      if (tooltipRef.current) {
        tooltipRef.current.style.left = `${e.clientX - rect.left + 16}px`;
        tooltipRef.current.style.top = `${e.clientY - rect.top - 10}px`;
      }
    };
    container.addEventListener("mousemove", onMove, { passive: true });

    const onLeaveContainer = () => {
      pointer.set(9999, 9999);
      if (tooltipRef.current) tooltipRef.current.style.opacity = "0";
    };
    container.addEventListener("mouseleave", onLeaveContainer);

    /* ── Animate ── */
    const clock = new THREE.Clock();
    let rafId: number;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const sp = scrollRef.current;

      /* Scroll-driven camera orbit */
      const angle = sp * Math.PI * 0.6 - Math.PI * 0.15;
      camera.position.x = Math.sin(angle) * 4.5;
      camera.position.z = Math.cos(angle) * 4.5;
      camera.position.y = 1.0 + sp * 0.5;
      camera.lookAt(0, 0.9, 0);

      /* Breathing (subtle scale oscillation on torso) */
      const breath = 1 + Math.sin(t * 1.5) * 0.008;
      bodyGroup.scale.set(breath, breath, breath);

      /* Gentle idle rotation */
      bodyGroup.rotation.y = Math.sin(t * 0.3) * 0.06;

      /* Raycaster hover detection */
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(muscleMeshes, false);

      if (hits.length > 0) {
        const hit = hits[0].object as THREE.Mesh;
        if (hoveredRef.current !== hit) {
          /* Un-hover previous */
          if (hoveredRef.current) {
            const prevMat = hoveredRef.current.material as THREE.MeshStandardMaterial;
            gsap.to(prevMat, { emissiveIntensity: 0, duration: 0.3 });
            gsap.to(prevMat.color, {
              r: SKIN_BASE >> 16 & 0xff, g: SKIN_BASE >> 8 & 0xff, b: SKIN_BASE & 0xff,
              duration: 0.3,
            });
            prevMat.color.set(SKIN_BASE);
          }
          /* Hover new */
          hoveredRef.current = hit;
          const mat = hit.material as THREE.MeshStandardMaterial;
          mat.emissive.set(LIME);
          gsap.to(mat, { emissiveIntensity: 0.7, duration: 0.3 });
          gsap.to(mat.color, { r: 0.78, g: 1.0, b: 0.0, duration: 0.3 });

          /* Show tooltip */
          if (tooltipRef.current) {
            tooltipRef.current.textContent = hit.userData.muscleName;
            tooltipRef.current.style.opacity = "1";
          }
        }
      } else {
        /* Un-hover */
        if (hoveredRef.current) {
          const mat = hoveredRef.current.material as THREE.MeshStandardMaterial;
          gsap.to(mat, { emissiveIntensity: 0, duration: 0.3 });
          mat.color.set(SKIN_BASE);
          hoveredRef.current = null;
        }
        if (tooltipRef.current) {
          tooltipRef.current.style.opacity = "0";
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    /* ── Resize ── */
    const onResize = () => {
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", onResize);

    /* ── Cleanup ── */
    cleanupRef.current = () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      container.removeEventListener("mousemove", onMove);
      container.removeEventListener("mouseleave", onLeaveContainer);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      /* Dispose all geometries & materials */
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
      renderer.dispose();
    };

    return () => {
      cleanupRef.current?.();
    };
  }, [isDesktop]);

  /* ── Mobile fallback ── */
  if (!isDesktop) {
    return (
      <div className="flex items-center justify-center h-full" style={{ minHeight: 500 }}>
        <div className="text-center">
          <div
            className="w-40 h-72 mx-auto rounded-2xl"
            style={{
              background: "linear-gradient(180deg, rgba(200,255,0,0.1) 0%, rgba(200,255,0,0.02) 100%)",
              border: "1px solid rgba(200,255,0,0.15)",
            }}
          />
          <p className="text-[10px] text-white/30 mt-4 tracking-widest uppercase">
            Interactive body · Desktop only
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative"
      data-cursor-hover
      style={{ minHeight: 500 }}
    >
      {/* ── Hover Tooltip ── */}
      <div
        ref={tooltipRef}
        className="pointer-events-none absolute z-20 px-3 py-1.5 rounded-md text-[11px] font-bold tracking-widest uppercase transition-opacity duration-200"
        style={{
          background: "rgba(200,255,0,0.12)",
          color: "#C8FF00",
          border: "1px solid rgba(200,255,0,0.25)",
          backdropFilter: "blur(6px)",
          opacity: 0,
        }}
      />
    </div>
  );
}
