import { useRef, useState, type ReactNode, type MouseEvent } from "react";
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
  type Variants,
} from "framer-motion";

// Shared easing — ease-out expo, per ui-ux-pro-max motion guidance.
export const EXPO = [0.16, 1, 0.3, 1] as const;

/* Scroll-triggered reveal. Fades + lifts once, when it enters the viewport. */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "span";
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.7, ease: EXPO, delay }}
    >
      {children}
    </MotionTag>
  );
}

/* Container that staggers its Reveal-like children into view. */
export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EXPO } },
};

/* Word-by-word headline reveal. Triggers on mount, or on scroll with inView. */
export function AnimatedHeading({
  text,
  className,
  delay = 0,
  inView = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  inView?: boolean;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  if (reduce) return <span className={className}>{text}</span>;
  const trigger = inView
    ? { whileInView: "show", viewport: { once: true, margin: "-12% 0px" } }
    : { animate: "show" };
  return (
    <motion.span
      className={className}
      initial="hidden"
      {...trigger}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.055, delayChildren: delay } },
      }}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "108%" },
              show: { y: 0, transition: { duration: 0.75, ease: EXPO } },
            }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/* Magnetic button — pulls toward the cursor, springs back on leave. */
export function Magnetic({
  children,
  className,
  href,
  download,
  strength = 0.35,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  href: string;
  download?: boolean;
  strength?: number;
} & Record<string, unknown>) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 });

  function onMove(e: MouseEvent) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  }
  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      download={download}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      whileTap={{ scale: 0.96 }}
      className={className}
      {...rest}
    >
      {children}
    </motion.a>
  );
}

/* Section header with an animated kicker rule. */
export function SectionKicker({ children }: { children: ReactNode }) {
  return (
    <Reveal className="flex items-center gap-3">
      <span className="font-mono text-xs uppercase tracking-[0.24em] text-mint">
        {children}
      </span>
      <motion.span
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: EXPO, delay: 0.1 }}
        className="h-px w-12 origin-left bg-line-bright"
      />
    </Reveal>
  );
}

/* Card that lifts + tilts toward the cursor, with a scale pop and eased return. */
export function TiltCard({
  children,
  className,
  max = 8,
  scale = 1.02,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  scale?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState({ rx: 0, ry: 0, s: 1 });

  function onMove(e: MouseEvent) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setStyle({ rx: py * -max, ry: px * max, s: scale });
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setStyle({ rx: 0, ry: 0, s: 1 })}
      animate={{ rotateX: style.rx, rotateY: style.ry, scale: style.s }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      style={{ transformStyle: "preserve-3d", transformPerspective: 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
