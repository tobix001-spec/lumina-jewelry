"use client";

import React, { useRef, useMemo, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import * as THREE from "three";

// ─── 3D Diamond Gem Component ────────────────────────────────────────────────

function DiamondGem({
  geometry,
  hovered,
  color = "#ffffff",
}: {
  geometry: THREE.BufferGeometry;
  hovered: boolean;
  color?: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    // Rotate faster on hover, gentle idle rotation
    const speed = hovered ? 2.5 : 0.3;
    meshRef.current.rotation.y += delta * speed;
    // Slight tilt on hover
    const targetX = hovered ? 0.15 : 0;
    meshRef.current.rotation.x += (targetX - meshRef.current.rotation.x) * 0.08;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} castShadow>
      <meshPhysicalMaterial
        color={color}
        metalness={0.0}
        roughness={0.05}
        transmission={0.95}
        thickness={1.5}
        ior={2.42}
        envMapIntensity={2.5}
        clearcoat={1}
        clearcoatRoughness={0.0}
        transparent
        opacity={0.9}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ─── Geometry Factories ──────────────────────────────────────────────────────

function useRoundGeo() {
  return useMemo(() => {
    // Brilliant round — use octahedron squished
    const geo = new THREE.OctahedronGeometry(0.7, 2);
    geo.applyMatrix4(new THREE.Matrix4().makeScale(1, 0.55, 1));
    return geo;
  }, []);
}

function useOvalGeo() {
  return useMemo(() => {
    const geo = new THREE.SphereGeometry(0.65, 16, 12);
    geo.applyMatrix4(new THREE.Matrix4().makeScale(0.75, 0.45, 1));
    return geo;
  }, []);
}

function useEmeraldGeo() {
  return useMemo(() => {
    // Step cut — beveled box
    const shape = new THREE.Shape();
    const w = 0.5, h = 0.7, c = 0.12;
    shape.moveTo(-w + c, -h);
    shape.lineTo(w - c, -h);
    shape.lineTo(w, -h + c);
    shape.lineTo(w, h - c);
    shape.lineTo(w - c, h);
    shape.lineTo(-w + c, h);
    shape.lineTo(-w, h - c);
    shape.lineTo(-w, -h + c);
    shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.35, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.06, bevelSegments: 2 });
    geo.center();
    return geo;
  }, []);
}

function useMarquiseGeo() {
  return useMemo(() => {
    const shape = new THREE.Shape();
    // Pointed ellipse
    const pts = 24;
    for (let i = 0; i <= pts; i++) {
      const t = (i / pts) * Math.PI * 2;
      const r = 0.65;
      const x = Math.cos(t) * r * 0.45;
      const y = Math.sin(t) * r;
      shape.lineTo(x, y);
    }
    shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.3, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 2 });
    geo.center();
    return geo;
  }, []);
}

function usePearGeo() {
  return useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.7);
    shape.bezierCurveTo(-0.15, 0.65, -0.5, 0.3, -0.5, -0.05);
    shape.bezierCurveTo(-0.5, -0.45, -0.3, -0.7, 0, -0.7);
    shape.bezierCurveTo(0.3, -0.7, 0.5, -0.45, 0.5, -0.05);
    shape.bezierCurveTo(0.5, 0.3, 0.15, 0.65, 0, 0.7);
    const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.3, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 2 });
    geo.center();
    return geo;
  }, []);
}

function useRadiantGeo() {
  return useMemo(() => {
    const shape = new THREE.Shape();
    const w = 0.55, h = 0.65, c = 0.1;
    shape.moveTo(-w + c, -h);
    shape.lineTo(w - c, -h);
    shape.lineTo(w, -h + c);
    shape.lineTo(w, h - c);
    shape.lineTo(w - c, h);
    shape.lineTo(-w + c, h);
    shape.lineTo(-w, h - c);
    shape.lineTo(-w, -h + c);
    shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.32, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.06, bevelSegments: 2 });
    geo.center();
    return geo;
  }, []);
}

function useCushionGeo() {
  return useMemo(() => {
    const shape = new THREE.Shape();
    const s = 0.55, r = 0.18;
    shape.moveTo(-s + r, -s);
    shape.lineTo(s - r, -s);
    shape.quadraticCurveTo(s, -s, s, -s + r);
    shape.lineTo(s, s - r);
    shape.quadraticCurveTo(s, s, s - r, s);
    shape.lineTo(-s + r, s);
    shape.quadraticCurveTo(-s, s, -s, s - r);
    shape.lineTo(-s, -s + r);
    shape.quadraticCurveTo(-s, -s, -s + r, -s);
    const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.32, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.06, bevelSegments: 2 });
    geo.center();
    return geo;
  }, []);
}

function usePrincessGeo() {
  return useMemo(() => {
    // Square pyramid top + inverted bottom
    const geo = new THREE.OctahedronGeometry(0.65, 0);
    geo.applyMatrix4(new THREE.Matrix4().makeScale(1, 0.5, 1));
    // Rotate 45° to get square alignment
    geo.applyMatrix4(new THREE.Matrix4().makeRotationY(Math.PI / 4));
    return geo;
  }, []);
}

function useAsscherGeo() {
  return useMemo(() => {
    // Octagonal step cut
    const shape = new THREE.Shape();
    const s = 0.55, c = 0.16;
    shape.moveTo(-s + c, -s);
    shape.lineTo(s - c, -s);
    shape.lineTo(s, -s + c);
    shape.lineTo(s, s - c);
    shape.lineTo(s - c, s);
    shape.lineTo(-s + c, s);
    shape.lineTo(-s, s - c);
    shape.lineTo(-s, -s + c);
    shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.35, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 2 });
    geo.center();
    return geo;
  }, []);
}

function useHeartGeo() {
  return useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.5);
    shape.bezierCurveTo(-0.05, -0.2, -0.55, -0.2, -0.55, 0.15);
    shape.bezierCurveTo(-0.55, 0.45, -0.25, 0.55, 0, 0.7);
    shape.bezierCurveTo(0.25, 0.55, 0.55, 0.45, 0.55, 0.15);
    shape.bezierCurveTo(0.55, -0.2, 0.05, -0.2, 0, -0.5);
    const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.28, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 2 });
    geo.center();
    geo.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI)); // flip
    return geo;
  }, []);
}

function useElongatedCushionGeo() {
  return useMemo(() => {
    const shape = new THREE.Shape();
    const w = 0.45, h = 0.7, r = 0.15;
    shape.moveTo(-w + r, -h);
    shape.lineTo(w - r, -h);
    shape.quadraticCurveTo(w, -h, w, -h + r);
    shape.lineTo(w, h - r);
    shape.quadraticCurveTo(w, h, w - r, h);
    shape.lineTo(-w + r, h);
    shape.quadraticCurveTo(-w, h, -w, h - r);
    shape.lineTo(-w, -h + r);
    shape.quadraticCurveTo(-w, -h, -w + r, -h);
    const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.3, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 2 });
    geo.center();
    return geo;
  }, []);
}

// ─── Shape Scene Components ──────────────────────────────────────────────────

function RoundScene({ hovered }: { hovered: boolean }) { return <DiamondGem geometry={useRoundGeo()} hovered={hovered} />; }
function OvalScene({ hovered }: { hovered: boolean }) { return <DiamondGem geometry={useOvalGeo()} hovered={hovered} />; }
function EmeraldScene({ hovered }: { hovered: boolean }) { return <DiamondGem geometry={useEmeraldGeo()} hovered={hovered} />; }
function MarquiseScene({ hovered }: { hovered: boolean }) { return <DiamondGem geometry={useMarquiseGeo()} hovered={hovered} />; }
function PearScene({ hovered }: { hovered: boolean }) { return <DiamondGem geometry={usePearGeo()} hovered={hovered} />; }
function RadiantScene({ hovered }: { hovered: boolean }) { return <DiamondGem geometry={useRadiantGeo()} hovered={hovered} />; }
function CushionScene({ hovered }: { hovered: boolean }) { return <DiamondGem geometry={useCushionGeo()} hovered={hovered} />; }
function PrincessScene({ hovered }: { hovered: boolean }) { return <DiamondGem geometry={usePrincessGeo()} hovered={hovered} />; }
function AsscherScene({ hovered }: { hovered: boolean }) { return <DiamondGem geometry={useAsscherGeo()} hovered={hovered} />; }
function HeartScene({ hovered }: { hovered: boolean }) { return <DiamondGem geometry={useHeartGeo()} hovered={hovered} />; }
function ElongatedCushionScene({ hovered }: { hovered: boolean }) { return <DiamondGem geometry={useElongatedCushionGeo()} hovered={hovered} />; }

const SCENE_MAP: Record<string, React.FC<{ hovered: boolean }>> = {
  ROUND: RoundScene,
  OVAL: OvalScene,
  EMERALD: EmeraldScene,
  MARQUISE: MarquiseScene,
  PEAR: PearScene,
  RADIANT: RadiantScene,
  CUSHION: CushionScene,
  PRINCESS: PrincessScene,
  ASSCHER: AsscherScene,
  HEART: HeartScene,
  ELONGATED_CUSHION: ElongatedCushionScene,
};

// ─── Single Diamond 3D Card ──────────────────────────────────────────────────

function Diamond3DCard({ id, label, img }: { id: string; label: string; img: string }) {
  const [hovered, setHovered] = useState(false);
  const SceneComponent = SCENE_MAP[id];

  return (
    <Link
      href={`/diamonds?shape=${id}`}
      className="flex-none snap-center flex flex-col items-center gap-2.5 group w-[90px] sm:w-[110px]"
      aria-label={`Shop ${label} diamonds`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        className="relative w-[76px] h-[76px] sm:w-[90px] sm:h-[90px]"
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
      >
        {/* 3D Canvas */}
        <Canvas
          camera={{ position: [0, 0, 2.8], fov: 35 }}
          gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
          dpr={[1, 1.5]}
          style={{ width: "100%", height: "100%", pointerEvents: "none" }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[3, 4, 5]} intensity={1.2} />
          <directionalLight position={[-2, 3, -3]} intensity={0.4} />
          <pointLight position={[0, 2, 0]} intensity={0.5} color="#E8D5A3" />

          {SceneComponent && (
            <Float speed={hovered ? 0 : 1.5} rotationIntensity={0} floatIntensity={hovered ? 0 : 0.15}>
              <SceneComponent hovered={hovered} />
            </Float>
          )}
        </Canvas>

        {/* Soft shadow underneath */}
        <div className={`absolute inset-x-3 -bottom-1 h-3 bg-charcoal/10 rounded-full blur-md transition-opacity duration-300 ${hovered ? "opacity-80" : "opacity-30"}`} />
      </motion.div>

      <span className="text-xs text-warm-gray font-medium text-center group-hover:text-charcoal transition-colors leading-tight">
        {label}
      </span>
      <div className="h-px w-0 bg-gold group-hover:w-full transition-all duration-300" />
    </Link>
  );
}

// ─── Fallback (static image) for SSR / loading ───────────────────────────────

function DiamondStaticCard({ id, label, img }: { id: string; label: string; img: string }) {
  return (
    <Link
      href={`/diamonds?shape=${id}`}
      className="flex-none snap-center flex flex-col items-center gap-2.5 group w-[90px] sm:w-[110px]"
      aria-label={`Shop ${label} diamonds`}
    >
      <div className="relative w-[76px] h-[76px] sm:w-[90px] sm:h-[90px]">
        <Image
          src={img}
          alt={`${label} cut diamond`}
          width={168}
          height={168}
          className="object-contain w-full h-full drop-shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
        />
      </div>
      <span className="text-xs text-warm-gray font-medium text-center leading-tight">{label}</span>
      <div className="h-px w-0 bg-gold transition-all duration-300" />
    </Link>
  );
}

// ─── Shape Data ──────────────────────────────────────────────────────────────

const SHAPES = [
  { id: "ROUND",             label: "Round",             img: "/shapes/round.jpg" },
  { id: "OVAL",              label: "Oval",              img: "/shapes/oval.jpg" },
  { id: "EMERALD",           label: "Emerald",           img: "/shapes/emerald.jpg" },
  { id: "MARQUISE",          label: "Marquise",          img: "/shapes/marquise.jpg" },
  { id: "PEAR",              label: "Pear",              img: "/shapes/pear.jpg" },
  { id: "RADIANT",           label: "Radiant",           img: "/shapes/radiant.jpg" },
  { id: "CUSHION",           label: "Cushion",           img: "/shapes/cushion.jpg" },
  { id: "PRINCESS",          label: "Princess",          img: "/shapes/princess.jpg" },
  { id: "ASSCHER",           label: "Asscher",           img: "/shapes/asscher.jpg" },
  { id: "HEART",             label: "Heart",             img: "/shapes/heart.png" },
  { id: "ELONGATED_CUSHION", label: "Elongated Cushion", img: "/shapes/elongated-cushion.jpg" },
];

// ─── Carousel ────────────────────────────────────────────────────────────────

export function DiamondShapesCarousel() {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) =>
    ref.current?.scrollBy({ left: dir * 300, behavior: "smooth" });

  return (
    <section className="py-16 sm:py-20 border-y border-warm-border bg-white">
      <div className="container-luxury">
        <Reveal className="text-center mb-10">
          <p className="label-caps text-gold-dark mb-3">Shop by Shape</p>
          <h2 className="font-display text-3xl sm:text-4xl text-charcoal" style={{ fontWeight: 300 }}>
            Find Your Shape
          </h2>
        </Reveal>
        <div className="relative">
          <button
            onClick={() => scroll(-1)}
            className="hidden sm:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 border border-warm-border bg-white hover:bg-cream items-center justify-center transition-all duration-200 hover:border-warm-border-dark shadow-luxury-sm"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4 text-warm-gray" />
          </button>

          <div
            ref={ref}
            className="flex gap-2 sm:gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory py-4"
            role="list"
          >
            {SHAPES.map((shape) => (
              <Suspense
                key={shape.id}
                fallback={<DiamondStaticCard {...shape} />}
              >
                <Diamond3DCard {...shape} />
              </Suspense>
            ))}
          </div>

          <button
            onClick={() => scroll(1)}
            className="hidden sm:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 border border-warm-border bg-white hover:bg-cream items-center justify-center transition-all duration-200 hover:border-warm-border-dark shadow-luxury-sm"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4 text-warm-gray" />
          </button>
        </div>
      </div>
    </section>
  );
}
