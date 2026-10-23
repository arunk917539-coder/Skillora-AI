"use client";

import React, { useEffect, useRef } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Only enable on desktop devices with fine pointer and hover support
    if (
      typeof window === "undefined" ||
      !window.matchMedia("(pointer: fine) and (hover: hover)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let targetX = -100;
    let targetY = -100;
    let ringX = -100;
    let ringY = -100;
    let isVisible = false;
    let isHovering = false;
    let animId: number | null = null;

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
        // Initialize ring position directly on first entrance
        ringX = targetX;
        ringY = targetY;
      }

      // Check if hovering an interactive element
      const target = e.target as HTMLElement | null;
      if (
        target &&
        typeof target.closest === "function" &&
        target.closest("a, button, input, textarea, select, [role='button'], [role='tab'], label")
      ) {
        isHovering = true;
      } else {
        isHovering = false;
      }
    };

    const onMouseLeave = () => {
      isVisible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const onMouseEnter = () => {
      isVisible = true;
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };

    // Smooth animation loop using requestAnimationFrame and lerp
    const render = () => {
      if (isVisible) {
        // Dot tracks immediately
        dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;

        // Ring follows with a smooth spring/lerp (0.16)
        ringX += (targetX - ringX) * 0.16;
        ringY += (targetY - ringY) * 0.16;

        const scale = isHovering ? "scale(1.35)" : "scale(1)";
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) ${scale}`;
        
        if (isHovering) {
          ring.style.borderColor = "rgba(167, 139, 250, 0.7)";
          ring.style.backgroundColor = "rgba(139, 92, 246, 0.12)";
        } else {
          ring.style.borderColor = "rgba(139, 92, 246, 0.35)";
          ring.style.backgroundColor = "rgba(139, 92, 246, 0.04)";
        }
      }

      animId = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave, { passive: true });
    document.addEventListener("mouseenter", onMouseEnter, { passive: true });
    window.addEventListener("blur", onMouseLeave);

    animId = requestAnimationFrame(render);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      window.removeEventListener("blur", onMouseLeave);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none"
      style={{ pointerEvents: "none" }}
    >
      {/* Center dot */}
      <div
        ref={dotRef}
        className="pointer-events-none absolute top-0 left-0 h-1.5 w-1.5 rounded-full bg-violet-400 opacity-0 shadow-[0_0_8px_rgba(167,139,250,0.9)] transition-opacity duration-150 will-change-transform"
        style={{ pointerEvents: "none" }}
      />
      {/* Outer ring */}
      <div
        ref={ringRef}
        className="pointer-events-none absolute top-0 left-0 h-8 w-8 rounded-full border border-violet-500/35 bg-violet-500/[0.04] opacity-0 backdrop-blur-[0.5px] transition-[opacity,transform,background-color,border-color] duration-150 ease-out will-change-transform"
        style={{ pointerEvents: "none" }}
      />
    </div>
  );
}
