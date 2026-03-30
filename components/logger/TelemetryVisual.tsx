"use client";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * TelemetryVisual.tsx  –  Live 3D-style Wireframe Telemetry Visualization
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Renders a subtle 3D wireframe cylinder with glowing muscle-line accents
 * (vanilla Three.js) that rotates idly and pulses on active exercise changes.
 * Falls back to a Framer Motion animated wireframe on mobile/low-power.
 *
 * Props:
 *   activeExercise: string   – name of the current exercise (drives label)
 *   isLogging: boolean       – pulsates faster when actively logging
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

const LIME = 0xc8ff00;
const BG = 0x080808;

interface Props {
  activeExercise: string;
  isLogging: boolean;
}

export default function TelemetryVisual({ activeExercise, isLogging }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
  }, []);

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   * THREE.JS WIREFRAME (desktop only)
   * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isDesktop) return;

    const w = container.clientWidth;
    const h = container.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(BG, 0.15);

    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 50);
    camera.position.set(0, 1.5, 4);
    camera.lookAt(0, 0.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    /* ── Wireframe cylinder (body core) ── */
    const cylGeo = new THREE.CylinderGeometry(0.6, 0.5, 2.5, 16, 8);
    const wireMat = new THREE.MeshBasicMaterial({
      color: LIME,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const cylinder = new THREE.Mesh(cylGeo, wireMat);
    cylinder.position.y = 0.5;
    scene.add(cylinder);

    /* ── Glowing accent rings ── */
    const ringPositions = [-0.3, 0.5, 1.3];
    const rings: THREE.Mesh[] = [];
    ringPositions.forEach((y) => {
      const ringGeo = new THREE.TorusGeometry(0.62, 0.015, 8, 48);
      const ringMat = new THREE.MeshBasicMaterial({
        color: LIME,
        transparent: true,
        opacity: 0.35,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.y = y;
      ring.rotation.x = Math.PI / 2;
      scene.add(ring);
      rings.push(ring);
    });

    /* ── Particle dots along wireframe ── */
    const particleCount = 50;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 0.5 + Math.random() * 0.15;
      positions[i * 3] = Math.cos(angle) * r;
      positions[i * 3 + 1] = (Math.random() - 0.3) * 2.5;
      positions[i * 3 + 2] = Math.sin(angle) * r;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: LIME,
      size: 0.025,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    /* ── Lighting ── */
    scene.add(new THREE.AmbientLight(0xffffff, 0.1));
    const rimLight = new THREE.PointLight(LIME, 1.5, 8);
    rimLight.position.set(-2, 2, 2);
    scene.add(rimLight);

    /* ── Render loop ── */
    let rafId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      cylinder.rotation.y = t * 0.3;
      particles.rotation.y = -t * 0.15;

      rings.forEach((ring, i) => {
        ring.rotation.z = t * (0.1 + i * 0.05);
        const mat = ring.material as THREE.MeshBasicMaterial;
        mat.opacity = 0.2 + Math.sin(t * 2 + i) * 0.15;
      });

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

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
          else obj.material.dispose();
        }
      });
      renderer.dispose();
    };
  }, [isDesktop]);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden" style={{ minHeight: 280 }}>
      {/* 3D Canvas container (desktop) */}
      {isDesktop && <div ref={containerRef} className="w-full h-full absolute inset-0" />}

      {/* Mobile fallback: animated wireframe */}
      {!isDesktop && (
        <div className="w-full h-full flex items-center justify-center">
          <motion.div
            className="w-32 h-48 rounded-xl"
            animate={{ rotate: [0, 2, -2, 0], scale: [1, 1.02, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{
              border: "1px solid rgba(200,255,0,0.15)",
              background: "linear-gradient(180deg, rgba(200,255,0,0.06) 0%, transparent 100%)",
            }}
          />
        </div>
      )}

      {/* Overlay label */}
      <div className="absolute bottom-3 left-3 right-3 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeExercise}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="px-3 py-2 rounded-lg"
            style={{
              background: "rgba(8,8,8,0.7)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(200,255,0,0.1)",
            }}
          >
            <div className="text-[9px] font-bold tracking-[0.3em] uppercase text-white/30">
              Active Target
            </div>
            <div className="text-sm font-bold text-[#C8FF00] font-space-grotesk mt-0.5">
              {activeExercise}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pulsing status dot */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full ${isLogging ? "animate-pulse" : ""}`}
          style={{
            background: isLogging ? "#C8FF00" : "rgba(255,255,255,0.2)",
            boxShadow: isLogging ? "0 0 8px #C8FF00" : "none",
          }}
        />
        <span className="text-[9px] font-mono font-bold tracking-widest uppercase text-white/30">
          {isLogging ? "LIVE" : "IDLE"}
        </span>
      </div>
    </div>
  );
}
