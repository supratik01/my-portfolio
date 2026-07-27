import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";

/*
 * Interactive particle text (adapted from the 21st.dev canvas particle effect).
 * The real payload is the scatter-and-return: the headline is rasterised into
 * dots that flee the cursor and spring back to their origin.
 *
 * Adapted rather than transplanted, in a few ways that matter here:
 *  - The real <h1> stays in the DOM (just visually faded once particles take
 *    over) instead of being replaced by a bare canvas. This page leans hard on
 *    SEO/structured data, and swapping the h1 for a canvas would delete its
 *    strongest signal — and its screen-reader text.
 *  - The canvas measures the live DOM lines (rect + computed font + colour)
 *    instead of hardcoding a font size and palette, so it tracks the existing
 *    responsive clamp() type scale and the ink/cyan brand colours for free.
 *  - The source sized the canvas to window.innerWidth/Height while rendering it
 *    w-full h-full; here it's sized to its own box (plus padding headroom so
 *    scattered dots aren't clipped) in device pixels.
 *  - pointer-events stay off: the pointer is tracked on window and converted,
 *    so the canvas never blocks selection or the controls around it.
 *  - The source ran a permanent rAF loop and rebuilt particles via a reduce()
 *    over every pixel; this samples on a stride and parks the loop once the
 *    dots have settled.
 *
 * Desktop + fine-pointer only (hover is the whole interaction), and disabled
 * outright under prefers-reduced-motion.
 */

const PAD = 90; // CSS px of headroom around the text so scattered dots aren't clipped
const GAP = 4; // sampling stride, CSS px
const DOT = 1.35; // dot radius, CSS px
const REPEL_RADIUS = 115; // CSS px
const REPEL_STRENGTH = 2.4;
const SPRING = 0.055;
const DAMP = 0.86;
const SETTLE = 0.015; // avg energy below which the loop parks itself

type Particle = {
  ox: number;
  oy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  fill: string;
};

export function ParticleText({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion() ?? false;
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const rafRef = useRef<number | null>(null);
  const [ready, setReady] = useState(false);
  // Hover is the entire interaction — skip touch and small screens, where the
  // hero already has a WebGL galaxy competing for the frame budget.
  const [supported] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 768px) and (hover: hover) and (pointer: fine)").matches
  );
  const enabled = supported && !reduce;

  useEffect(() => {
    if (!enabled) return;

    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let cancelled = false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    /* Rasterise the live DOM lines into particles. */
    const build = () => {
      const lines = Array.from(wrap.querySelectorAll<HTMLElement>("[data-particle-line]"));
      if (lines.length === 0) return false;

      const wrapRect = wrap.getBoundingClientRect();
      const cssW = wrapRect.width + PAD * 2;
      const cssH = wrapRect.height + PAD * 2;
      if (cssW <= 0 || cssH <= 0) return false;

      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      // No ctx.scale(): getImageData always reads raw device pixels regardless of
      // the active transform, so every coordinate below is already in device px.
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const line of lines) {
        const text = (line.textContent || "").trim();
        if (!text) continue;
        const r = line.getBoundingClientRect();
        const cs = getComputedStyle(line);
        const fs = parseFloat(cs.fontSize) * dpr;
        if (!fs) continue;

        ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${fs}px ${cs.fontFamily}`;
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = cs.color;
        const ls = parseFloat(cs.letterSpacing);
        if (!Number.isNaN(ls) && "letterSpacing" in ctx) {
          (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing =
            `${ls * dpr}px`;
        }

        // Place the baseline exactly where CSS puts it inside the line box.
        const m = ctx.measureText(text);
        const asc = m.fontBoundingBoxAscent || fs * 0.8;
        const desc = m.fontBoundingBoxDescent || fs * 0.2;
        const boxH = r.height * dpr;
        const x = (r.left - wrapRect.left + PAD) * dpr;
        const y = (r.top - wrapRect.top + PAD) * dpr + (boxH - (asc + desc)) / 2 + asc;
        ctx.fillText(text, x, y);
      }

      const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = img.data;
      const stride = Math.max(2, Math.round(GAP * dpr));
      const next: Particle[] = [];
      for (let py = 0; py < canvas.height; py += stride) {
        for (let px = 0; px < canvas.width; px += stride) {
          const i = (py * canvas.width + px) * 4;
          const a = data[i + 3];
          if (a < 90) continue;
          next.push({
            ox: px,
            oy: py,
            x: px,
            y: py,
            vx: 0,
            vy: 0,
            fill: `rgba(${data[i]}, ${data[i + 1]}, ${data[i + 2]}, ${(a / 255).toFixed(2)})`,
          });
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current = next;
      return next.length > 0;
    };

    const dotR = DOT * dpr;
    const repelR = REPEL_RADIUS * dpr;

    const draw = () => {
      const ps = particlesRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of ps) {
        ctx.fillStyle = p.fill;
        ctx.beginPath();
        ctx.arc(p.x, p.y, dotR, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = () => {
      if (cancelled) return;
      const ps = particlesRef.current;
      const ptr = pointerRef.current;
      let energy = 0;

      for (const p of ps) {
        if (ptr) {
          const dx = p.x - ptr.x;
          const dy = p.y - ptr.y;
          const d = Math.hypot(dx, dy);
          if (d < repelR && d > 0.01) {
            const force = (1 - d / repelR) * REPEL_STRENGTH * dpr;
            p.vx += (dx / d) * force;
            p.vy += (dy / d) * force;
          }
        }
        p.vx += (p.ox - p.x) * SPRING;
        p.vy += (p.oy - p.y) * SPRING;
        p.vx *= DAMP;
        p.vy *= DAMP;
        p.x += p.vx;
        p.y += p.vy;
        energy += Math.abs(p.vx) + Math.abs(p.vy);
      }

      draw();

      // Park the loop once everything has settled and the cursor has left.
      if (!ptr && ps.length > 0 && energy / ps.length < SETTLE * dpr) {
        for (const p of ps) {
          p.x = p.ox;
          p.y = p.oy;
          p.vx = 0;
          p.vy = 0;
        }
        draw();
        rafRef.current = null;
        return;
      }
      rafRef.current = requestAnimationFrame(step);
    };

    const wake = () => {
      if (rafRef.current == null && !cancelled) rafRef.current = requestAnimationFrame(step);
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0) return;
      const x = (e.clientX - rect.left) * dpr;
      const y = (e.clientY - rect.top) * dpr;
      const margin = repelR;
      if (x < -margin || y < -margin || x > canvas.width + margin || y > canvas.height + margin) {
        if (pointerRef.current) {
          pointerRef.current = null;
          wake();
        }
        return;
      }
      pointerRef.current = { x, y };
      wake();
    };

    const onPointerLeave = () => {
      pointerRef.current = null;
      wake();
    };

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (cancelled) return;
        if (build()) {
          draw();
          wake();
        }
      }, 180);
    };

    const start = async () => {
      // Metrics must come from the real brand font, not a fallback.
      try {
        await Promise.race([
          document.fonts.ready,
          new Promise((res) => setTimeout(res, 1500)),
        ]);
      } catch {
        /* proceed with whatever is loaded */
      }
      // Let the existing AnimatedHeading stagger finish before taking over.
      await new Promise((res) => setTimeout(res, 1250));
      if (cancelled) return;
      if (!build()) return;
      draw();
      setReady(true);
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.addEventListener("pointerleave", onPointerLeave);
      window.addEventListener("resize", onResize);
    };

    start();

    return () => {
      cancelled = true;
      clearTimeout(resizeTimer);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", onResize);
    };
  }, [enabled]);

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      {/* Real text: stays in the DOM for SEO + screen readers, fades once the
          particles are painted so the two never double up visually. */}
      <div style={{ opacity: ready ? 0 : 1, transition: "opacity 420ms ease" }}>{children}</div>
      {enabled && (
        <canvas
          ref={canvasRef}
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            left: -PAD,
            top: -PAD,
            opacity: ready ? 1 : 0,
            transition: "opacity 420ms ease",
          }}
        />
      )}
    </div>
  );
}
