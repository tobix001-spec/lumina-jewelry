/**
 * components/RingVisualizer.tsx
 * React-Three-Fiber 3D ring visualization component.
 *
 * Rendering pipeline:
 *   1. Canvas with a transparent background renders into the parent container
 *   2. Environment (HDRI) provides realistic lighting—studio preset by default
 *   3. DiamondMesh uses MeshRefractionMaterial for accurate caustics + sparkle
 *   4. BandMesh represents the metal setting with PBR material
 *   5. OrbitControls (optional) allow 360° user interaction
 *
 * Performance notes:
 *   - Model geometries are defined procedurally (no GLTF load on first render)
 *   - Suspense boundary wraps the Canvas to handle async env texture loading
 *   - Component is lazy-imported at the page level to keep bundle split clean
 */

"use client";

import React, { useRef, useMemo, Suspense, Component, type ReactNode, type ErrorInfo } from "react";
import { Canvas, useFrame, type MeshProps } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  MeshRefractionMaterial,
  ContactShadows,
  Float,
  PerspectiveCamera,
} from "@react-three/drei";

// ─── Environment Error Boundary ───────────────────────────────────────────────

class EnvironmentErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  componentDidCatch(_: Error, __: ErrorInfo) { this.setState({ failed: true }); }
  render() { return this.state.failed ? null : this.props.children; }
}
import * as THREE from "three";
import type { RingVisualizerProps, Diamond, Setting, MetalType } from "@/types";

// ─── Metal Color Map ──────────────────────────────────────────────────────────

const METAL_COLORS: Record<string, string> = {
  EIGHTEEN_K_YELLOW_GOLD: "#D4AF37",
  EIGHTEEN_K_WHITE_GOLD: "#E8E8E8",
  FOURTEEN_K_YELLOW_GOLD: "#C5A028",
  FOURTEEN_K_WHITE_GOLD: "#D8D8D8",
  ROSE_GOLD: "#B76E79",
  PLATINUM: "#E5E4E2",
  TUNGSTEN: "#808080",
  TANTALUM: "#6B7280",
  METEORITE: "#4B5563",
};

const METAL_ROUGHNESS: Record<string, number> = {
  PLATINUM: 0.05,
  EIGHTEEN_K_YELLOW_GOLD: 0.08,
  EIGHTEEN_K_WHITE_GOLD: 0.08,
  FOURTEEN_K_YELLOW_GOLD: 0.1,
  FOURTEEN_K_WHITE_GOLD: 0.1,
  ROSE_GOLD: 0.08,
  TUNGSTEN: 0.2,
  TANTALUM: 0.15,
  METEORITE: 0.35,
};

// ─── Diamond Mesh ─────────────────────────────────────────────────────────────

function DiamondMesh({ carat }: { carat: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Scale diamond geometry proportionally to carat weight
  const scale = useMemo(() => {
    // Approximate: 1ct round ≈ 6.5mm diameter → scale 0.65 in scene units
    return 0.55 + carat * 0.08;
  }, [carat]);

  // Gentle idle rotation
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.25;
    }
  });

  // Octahedron approximates a brilliant-cut diamond silhouette
  const geometry = useMemo(() => {
    const geo = new THREE.OctahedronGeometry(scale, 0);
    // Scale Y to approximate table/pavilion proportions
    geo.applyMatrix4(new THREE.Matrix4().makeScale(1, 0.65, 1));
    return geo;
  }, [scale]);

  return (
    <mesh ref={meshRef} geometry={geometry} position={[0, 0.25, 0]} castShadow>
      {/* MeshRefractionMaterial requires an HDRI env texture to work correctly */}
      <MeshRefractionMaterial
        color="#ffffff"
        bounces={3}
        aberrationStrength={0.01}
        ior={2.42}              // Diamond index of refraction
        fresnel={1}
        fastChroma
        toneMapped={false}
      />
    </mesh>
  );
}

// ─── Band / Setting Mesh ──────────────────────────────────────────────────────

function BandMesh({ metalType }: { metalType: MetalType | undefined }) {
  const color = METAL_COLORS[metalType as string] ?? METAL_COLORS.PLATINUM;
  const roughness = METAL_ROUGHNESS[metalType as string] ?? 0.1;

  // TorusGeometry = ring band
  const geometry = useMemo(
    () => new THREE.TorusGeometry(0.6, 0.12, 16, 64),
    []
  );

  return (
    <mesh geometry={geometry} receiveShadow castShadow>
      <meshStandardMaterial
        color={color}
        metalness={0.95}
        roughness={roughness}
        envMapIntensity={1.5}
      />
    </mesh>
  );
}

// ─── Prong / Setting Detail ───────────────────────────────────────────────────

function ProngsMesh({ metalType, count = 4 }: { metalType: MetalType | undefined; count?: number }) {
  const color = METAL_COLORS[metalType as string] ?? METAL_COLORS.PLATINUM;
  const roughness = METAL_ROUGHNESS[metalType as string] ?? 0.1;

  const prongs = useMemo(() => {
    const items: { position: [number, number, number]; rotation: [number, number, number] }[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      items.push({
        position: [Math.cos(angle) * 0.38, 0.28, Math.sin(angle) * 0.38],
        rotation: [Math.PI / 4, angle, 0],
      });
    }
    return items;
  }, [count]);

  return (
    <>
      {prongs.map((prong, i) => (
        <mesh
          key={i}
          position={prong.position}
          rotation={prong.rotation}
          castShadow
        >
          <cylinderGeometry args={[0.025, 0.035, 0.2, 8]} />
          <meshStandardMaterial
            color={color}
            metalness={0.95}
            roughness={roughness}
            envMapIntensity={1.5}
          />
        </mesh>
      ))}
    </>
  );
}

// ─── Ring Scene (inner, rendered inside Canvas) ───────────────────────────────

function RingScene({
  diamond,
  setting,
  environment = "studio",
  interactive = true,
}: {
  diamond: Diamond | null;
  setting: Setting | null;
  environment: RingVisualizerProps["environment"];
  interactive: boolean;
}) {
  const carat = diamond?.caratWeight ?? 1.0;
  const metalType = setting?.metalType;

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1.2, 2.5]} fov={40} />

      {/* Realistic HDRI lighting — wrapped in error boundary in case HDR fetch fails */}
      <EnvironmentErrorBoundary>
        <Suspense fallback={null}>
          <Environment preset={environment} />
        </Suspense>
      </EnvironmentErrorBoundary>

      {/* Ambient fill for shadow areas */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[2, 4, 2]} intensity={0.8} castShadow />

      {/* Float adds a subtle breathing animation when not interacted with */}
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.05}>
        <group>
          <BandMesh metalType={metalType} />
          <ProngsMesh metalType={metalType} count={setting?.style === "BEZEL" ? 0 : 4} />
          {diamond && <DiamondMesh carat={carat} />}
        </group>
      </Float>

      {/* Soft ground shadow */}
      <ContactShadows
        position={[0, -0.8, 0]}
        opacity={0.35}
        scale={3}
        blur={2}
        far={1.5}
      />

      {interactive && (
        <OrbitControls
          enablePan={false}
          minDistance={1.5}
          maxDistance={5}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 1.8}
          autoRotate={!diamond && !setting} // auto-rotate only on empty state
          autoRotateSpeed={0.8}
        />
      )}
    </>
  );
}

// ─── Placeholder shown while 3D loads ─────────────────────────────────────────

function VisualizerPlaceholder() {
  return (
    <div className="flex items-center justify-center h-full bg-stone-50 rounded-xl">
      <div className="text-center text-stone-400 space-y-2">
        <div className="w-16 h-16 mx-auto rounded-full border-4 border-stone-200 border-t-stone-400 animate-spin" />
        <p className="text-sm font-medium tracking-wide">Loading 3D Preview</p>
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyVisualizerState() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="text-center text-stone-500 bg-white/70 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-sm">
        <p className="text-sm font-semibold tracking-widest uppercase">Select a diamond & setting</p>
        <p className="text-xs mt-1 text-stone-400">to preview your ring in 3D</p>
      </div>
    </div>
  );
}

// ─── Public Component ─────────────────────────────────────────────────────────

/**
 * RingVisualizer
 *
 * Drop-in 3D ring preview. Renders a procedural ring model using React-Three-Fiber.
 * Diamond geometry and band material update reactively when props change.
 *
 * @example
 * <RingVisualizer
 *   diamond={selectedDiamond}
 *   setting={selectedSetting}
 *   environment="studio"
 *   interactive
 *   className="h-96 rounded-2xl shadow-lg"
 * />
 */
export function RingVisualizer({
  diamond,
  setting,
  environment = "studio",
  interactive = true,
  className = "",
  style,
}: RingVisualizerProps) {
  const isEmpty = !diamond && !setting;

  return (
    <div className={`relative bg-gradient-to-b from-cream to-cream-dark overflow-hidden ${className}`} style={style}>
      <Suspense fallback={<VisualizerPlaceholder />}>
        <Canvas
          shadows
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
          style={{ width: "100%", height: "100%" }}
          dpr={[1, 2]} // Cap at 2x DPR for performance
        >
          <RingScene
            diamond={diamond}
            setting={setting}
            environment={environment}
            interactive={interactive}
          />
        </Canvas>
      </Suspense>

      {isEmpty && <EmptyVisualizerState />}

      {/* Interaction hint badge */}
      {interactive && !isEmpty && (
        <div className="absolute bottom-3 right-3 bg-black/40 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm pointer-events-none">
          Drag to rotate
        </div>
      )}
    </div>
  );
}
