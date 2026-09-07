"use client";

import { useEffect, useRef } from "react";

export function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;

    // Floating shapes
    const shapes: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
    }> = [];

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      if (canvas) {
        canvas.width = width;
        canvas.height = height;
      }
      initShapes();
    }

    function initShapes() {
      shapes.length = 0;
      const count = Math.floor((width * height) / 150000); // Density based on screen size
      for (let i = 0; i < count; i++) {
        shapes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 150 + 50,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.03 + 0.01, // Very subtle
        });
      }
    }

    const FRAME_INTERVAL = 1000 / 24; // subtle motion — no need for 60fps
    let lastTime = 0;

    function animate(now: number) {
      animationRef.current = requestAnimationFrame(animate);
      if (now - lastTime < FRAME_INTERVAL) return;
      lastTime = now;

      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // Brand color from CSS (primary: oklch(0.596 0.145 163.2))
      // Using a soft approximation for canvas
      shapes.forEach((shape) => {
        // Update position
        shape.x += shape.speedX;
        shape.y += shape.speedY;

        // Wrap around edges
        if (shape.x < -shape.size) shape.x = width + shape.size;
        if (shape.x > width + shape.size) shape.x = -shape.size;
        if (shape.y < -shape.size) shape.y = height + shape.size;
        if (shape.y > height + shape.size) shape.y = -shape.size;

        // Draw shape as a soft gradient circle
        const gradient = ctx.createRadialGradient(
          shape.x,
          shape.y,
          0,
          shape.x,
          shape.y,
          shape.size
        );
        gradient.addColorStop(0, `rgba(16, 185, 129, ${shape.opacity})`); // Emerald-ish
        gradient.addColorStop(1, "rgba(16, 185, 129, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(shape.x, shape.y, shape.size, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    function start() {
      if (animationRef.current) return;
      animationRef.current = requestAnimationFrame(animate);
    }

    function stop() {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      }
    }

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    resize();
    if (!prefersReducedMotion) {
      start();
    }

    function onVisibilityChange() {
      if (document.hidden) {
        stop();
      } else if (!prefersReducedMotion) {
        lastTime = 0;
        start();
      }
    }

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      stop();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10"
      aria-hidden
    />
  );
}
