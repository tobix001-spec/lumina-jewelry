"use client";

import React, { useRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

interface ImageRevealProps {
  children: ReactNode;
  className?: string;
  direction?: "left" | "right" | "up" | "down";
  delay?: number;
  duration?: number;
}

const clipPaths = {
  left:  { hidden: "inset(0 100% 0 0)", visible: "inset(0 0% 0 0)" },
  right: { hidden: "inset(0 0 0 100%)", visible: "inset(0 0 0 0%)" },
  up:    { hidden: "inset(100% 0 0 0)", visible: "inset(0% 0 0 0)" },
  down:  { hidden: "inset(0 0 100% 0)", visible: "inset(0 0 0% 0)" },
};

/**
 * Reveals children with a clip-path wipe animation on scroll.
 * Perfect for images — creates a premium editorial reveal effect.
 */
export function ImageReveal({
  children,
  className,
  direction = "left",
  delay = 0,
  duration = 0.9,
}: ImageRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const clips = clipPaths[direction];

  return (
    <div ref={ref} className={className} style={{ overflow: "hidden" }}>
      <motion.div
        initial={{ clipPath: clips.hidden, scale: 1.1 }}
        animate={
          isInView
            ? { clipPath: clips.visible, scale: 1 }
            : { clipPath: clips.hidden, scale: 1.1 }
        }
        transition={{
          clipPath: { duration, delay, ease: [0.22, 1, 0.36, 1] },
          scale: { duration: duration + 0.3, delay, ease: [0.22, 1, 0.36, 1] },
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Number counter that animates from 0 to target value on scroll.
 */
export function CountUp({
  target,
  suffix = "",
  prefix = "",
  duration = 2,
  className,
}: {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      setCount(current);
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [isInView, target, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count}{suffix}
    </span>
  );
}
