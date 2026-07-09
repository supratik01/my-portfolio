import { useState, useEffect, useMemo, useRef } from "react";
import {
  motion,
  useSpring,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import {
  Braces,
  Triangle,
  Hexagon,
  Coffee,
  Bot,
  Cloud,
  Atom,
  Code2,
  Palette,
  Database,
  Leaf,
  LineChart,
  type LucideIcon,
} from "lucide-react";
import { skills } from "../../data";

/* Generic Lucide glyphs per skill — no brand logos (avoids incorrect marks). */
const ICONS: Record<string, LucideIcon> = {
  JavaScript: Braces,
  Angular: Triangle,
  "Node.js": Hexagon,
  "Core Java": Coffee,
  "Agentic AI": Bot,
  AWS: Cloud,
  React: Atom,
  "HTML5 / CSS3": Code2,
  SCSS: Palette,
  PostgreSQL: Database,
  MongoDB: Leaf,
  "GTM / GA": LineChart,
};

const LEVEL_COLOR: Record<string, string> = {
  Expert: "#4edea3",
  Advanced: "#7bd0ff",
  Pro: "#9aa7c7",
  Intermediate: "#ffd166",
};

type Phase = "scatter" | "line" | "circle";
interface Target {
  x: number;
  y: number;
  rotation: number;
  scale: number;
  opacity: number;
}

const CARD_W = 118;
const CARD_H = 148;
const TOTAL = skills.length;
const lerp = (a: number, b: number, t: number) => a * (1 - t) + b * t;
const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);

/* ---- One flip card ---- */
function SkillCard({ index, target, reduce }: { index: number; target: Target; reduce: boolean }) {
  const skill = skills[index];
  const Icon = ICONS[skill.name] ?? Braces;
  const accent = LEVEL_COLOR[skill.level] ?? "#9aa7c7";

  return (
    <motion.div
      animate={{
        x: target.x,
        y: target.y,
        rotate: target.rotation,
        scale: target.scale,
        opacity: target.opacity,
      }}
      transition={{ type: "spring", stiffness: 45, damping: 16 }}
      style={{
        position: "absolute",
        width: CARD_W,
        height: CARD_H,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className="group pointer-events-auto cursor-pointer"
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        whileHover={reduce ? undefined : { rotateY: 180 }}
      >
        {/* Front — icon + name + level */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border p-4 text-center"
          style={{
            backfaceVisibility: "hidden",
            background: "linear-gradient(160deg,#131c31 0%,#0d1424 100%)",
            borderColor: "#1e2842",
            boxShadow: "0 12px 30px -12px rgba(0,0,0,0.7)",
          }}
        >
          <span
            className="grid h-11 w-11 place-items-center rounded-xl"
            style={{ background: "rgba(123,208,255,0.08)", color: accent }}
          >
            <Icon size={22} strokeWidth={1.75} />
          </span>
          <span className="font-display text-sm font-bold leading-tight text-ink">{skill.name}</span>
          <span
            className="font-mono text-[9px] uppercase tracking-[0.14em]"
            style={{ color: accent }}
          >
            {skill.level}
          </span>
        </div>

        {/* Back — level + note */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border p-4 text-center"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: "linear-gradient(160deg,#0d1424 0%,#0a1120 100%)",
            borderColor: accent,
            boxShadow: `0 0 26px -8px ${accent}55`,
          }}
        >
          <span className="font-mono text-[9px] uppercase tracking-[0.18em]" style={{ color: accent }}>
            {skill.level}
          </span>
          <span className="font-body text-[11px] leading-snug text-ink-dim">{skill.note}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ---- The morphing field ---- */
export default function ScrollMorphSkills({ progress }: { progress: MotionValue<number> }) {
  const reduce = useReducedMotion() ?? false;
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [phase, setPhase] = useState<Phase>("scatter");
  const [morph, setMorph] = useState(0); // 0 circle → 1 arc
  const [shuffle, setShuffle] = useState(0); // arc rotation progress

  // Container size
  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setSize({ width: e.contentRect.width, height: e.contentRect.height });
    });
    ro.observe(el);
    setSize({ width: el.offsetWidth, height: el.offsetHeight });
    return () => ro.disconnect();
  }, []);

  // Intro sequence: scatter → line → circle (snappy)
  useEffect(() => {
    if (reduce) {
      setPhase("circle");
      return;
    }
    const t1 = setTimeout(() => setPhase("line"), 350);
    const t2 = setTimeout(() => setPhase("circle"), 1500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [reduce]);

  // Scroll → morph + shuffle (smoothed)
  const smooth = useSpring(progress, { stiffness: 45, damping: 22, mass: 0.6 });
  useMotionValueEvent(smooth, "change", (v) => {
    setMorph(clamp01((v - 0.06) / 0.46)); // circle→arc across ~6%..52% scroll
    setShuffle(clamp01((v - 0.5) / 0.45)); // shuffle after arc forms
  });

  // Subtle mouse parallax on the arc
  const mouseX = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 20 });
  const [parallax, setParallax] = useState(0);
  useMotionValueEvent(smoothMouseX, "change", setParallax);
  useEffect(() => {
    const el = containerRef.current;
    if (!el || reduce) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      mouseX.set(((e.clientX - r.left) / r.width - 0.5) * 2 * 60);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, [mouseX, reduce]);

  // Stable scatter start
  const scatter = useMemo<Target[]>(
    () =>
      skills.map(() => ({
        x: (Math.random() - 0.5) * 1400,
        y: (Math.random() - 0.5) * 900,
        rotation: (Math.random() - 0.5) * 160,
        scale: 0.6,
        opacity: 0,
      })),
    []
  );

  const isMobile = size.width < 768;
  const minDim = Math.min(size.width, size.height) || 600;

  function targetFor(i: number): Target {
    if (phase === "scatter") return scatter[i];

    if (phase === "line") {
      const spacing = isMobile ? 40 : 96;
      const x = i * spacing - ((TOTAL - 1) * spacing) / 2;
      return { x, y: 0, rotation: 0, scale: isMobile ? 0.7 : 0.85, opacity: 1 };
    }

    // circle — cards ring the centered identity + sphere
    const circleRadius = Math.min(minDim * 0.4, 300);
    const ang = (i / TOTAL) * 360 - 90;
    const rad = (ang * Math.PI) / 180;
    const circle = {
      x: Math.cos(rad) * circleRadius,
      y: Math.sin(rad) * circleRadius,
    };

    // bottom arc — a fanned deck along a shallow parabola (all cards visible).
    const nx = TOTAL === 1 ? 0 : (i / (TOTAL - 1)) * 2 - 1; // -1..1
    const spanX = Math.min(size.width * 0.92, 1220);
    const archLift = isMobile ? 58 : 104; // how much the centre rises
    const baseY = size.height * (isMobile ? 0.13 : 0.185); // ends' offset below centre
    const drift = (shuffle - 0.5) * (isMobile ? 30 : 70); // gentle post-form sway
    const arc = {
      x: nx * (spanX / 2) + parallax * 0.5 + drift,
      y: baseY + archLift * (nx * nx), // centre highest, ends lower (rainbow)
      rotation: nx * (isMobile ? 6 : 9), // fan outward, stays readable
      scale: isMobile ? 1.0 : 1.12,
    };

    return {
      x: lerp(circle.x, arc.x, morph),
      y: lerp(circle.y, arc.y, morph),
      rotation: lerp(0, arc.rotation, morph),
      scale: lerp(1, arc.scale, morph),
      opacity: 1,
    };
  }

  return (
    <div ref={containerRef} className="pointer-events-none relative h-full w-full">
      <div className="relative flex h-full w-full items-center justify-center">
        {skills.map((_, i) => (
          <SkillCard key={skills[i].name} index={i} target={targetFor(i)} reduce={reduce} />
        ))}
      </div>
    </div>
  );
}
