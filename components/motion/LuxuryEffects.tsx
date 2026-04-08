"use client";

import React, { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";

// ─── Cursor Glow ─────────────────────────────────────────────────────────────

function CursorGlow() {
  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);
  const [isVisible, setIsVisible] = useState(false);

  const springX = useSpring(cursorX, { stiffness: 150, damping: 20, mass: 0.5 });
  const springY = useSpring(cursorY, { stiffness: 150, damping: 20, mass: 0.5 });

  useEffect(() => {
    // Only show on devices with fine pointer (no touch)
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!mq.matches) return;

    setIsVisible(true);

    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed pointer-events-none z-[60]"
      style={{
        x: springX,
        y: springY,
        width: 220,
        height: 220,
        marginLeft: -110,
        marginTop: -110,
        background: "radial-gradient(circle, rgba(201,168,76,0.12) 0%, rgba(201,168,76,0.04) 40%, transparent 70%)",
        borderRadius: "50%",
        willChange: "transform",
      }}
      aria-hidden
    />
  );
}

// ─── Scroll Progress ─────────────────────────────────────────────────────────

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left"
      style={{
        scaleX,
        background: "linear-gradient(90deg, #C9A84C, #E8D5A3, #C9A84C)",
      }}
      aria-hidden
    />
  );
}

// ─── Combined Export ─────────────────────────────────────────────────────────

export function LuxuryEffects() {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) return null;

  return (
    <>
      <CursorGlow />
      <ScrollProgress />
    </>
  );
}
