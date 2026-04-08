"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";

// ─── Color Palette ──────────────────────────────────────────────────────────

const GOLD = "#C9A84C";
const GOLD_LIGHT = "#E8D5A3";

// ─── Cursor Glow ────────────────────────────────────────────────────────────

/**
 * Renders a soft gold radial gradient that follows the mouse cursor.
 * Automatically hidden on touch devices via `hover: hover` media query check.
 * Respects `prefers-reduced-motion`.
 */
export function CursorGlow() {
  const prefersReducedMotion = useReducedMotion();
  const [canHover, setCanHover] = useState(false);

  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);

  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only show on devices with a fine pointer (non-touch)
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setCanHover(mq.matches);

    const onChange = (e: MediaQueryListEvent) => setCanHover(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!canHover || prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [canHover, prefersReducedMotion, mouseX, mouseY]);

  if (prefersReducedMotion || !canHover) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 200,
        height: 200,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${GOLD} 0%, transparent 70%)`,
        opacity: 0.15,
        pointerEvents: "none",
        zIndex: 50,
        x: smoothX,
        y: smoothY,
        translateX: "-50%",
        translateY: "-50%",
        willChange: "transform",
      }}
    />
  );
}

// ─── Scroll Progress Bar ────────────────────────────────────────────────────

/**
 * A thin gold bar fixed to the top of the viewport that fills left-to-right
 * as the user scrolls down the page.
 */
export function ScrollProgressBar() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  if (prefersReducedMotion) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`,
        transformOrigin: "0%",
        scaleX,
        zIndex: 50,
        pointerEvents: "none",
        willChange: "transform",
      }}
    />
  );
}

// ─── Sparkle Effect ─────────────────────────────────────────────────────────

interface SparkleProps {
  /** Number of sparkle dots to render. */
  count?: number;
  /** Additional CSS class names for the container. */
  className?: string;
}

interface SparkleParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  offsetX: number;
  offsetY: number;
}

function generateParticles(count: number): SparkleParticle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1.5,
    delay: Math.random() * 2,
    duration: Math.random() * 1.5 + 1.5,
    offsetX: (Math.random() - 0.5) * 20,
    offsetY: (Math.random() - 0.5) * 20,
  }));
}

/**
 * Renders tiny animated sparkle dots (gold) that float and fade.
 * Intended for decorative hover-state accents. Place inside a
 * relatively-positioned parent.
 */
export function SparkleEffect({ count = 6, className }: SparkleProps) {
  const prefersReducedMotion = useReducedMotion();

  // Stable particle set — only regenerated when count changes
  const particles = useMemo(() => generateParticles(count), [count]);

  if (prefersReducedMotion) return null;

  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {particles.map((p) => (
        <motion.span
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            backgroundColor: GOLD,
            willChange: "transform, opacity",
          }}
          initial={{ opacity: 0, x: 0, y: 0 }}
          animate={{
            opacity: [0, 1, 0],
            x: [0, p.offsetX],
            y: [0, p.offsetY],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            repeatDelay: p.duration * 0.5,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
