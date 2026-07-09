import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Check, Download } from "lucide-react";
import { profile } from "../data";
import { AnimatedHeading, EXPO, Magnetic } from "./ui/motion-primitives";

const GalaxyScene = lazy(() => import("./GalaxyScene"));

/* A floating glass panel that fades in/out on its own irregular clock. */
function DriftPanel({
  className,
  delay,
  visibleFor = 6,
  hiddenFor = 7,
  children,
}: {
  className: string;
  delay: number;
  visibleFor?: number;
  hiddenFor?: number;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (reduce) {
      setShow(true);
      return;
    }
    let alive = true;
    let timer: ReturnType<typeof setTimeout>;
    const cycle = (visible: boolean) => {
      if (!alive) return;
      setShow(visible);
      const base = visible ? visibleFor : hiddenFor;
      timer = setTimeout(() => cycle(!visible), (base + Math.random() * 4) * 1000);
    };
    timer = setTimeout(() => cycle(true), delay * 1000);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [reduce, delay, visibleFor, hiddenFor]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 14, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ duration: 1.1, ease: EXPO }}
          className={`pointer-events-none absolute z-10 hidden rounded-xl border border-line/80 bg-surface/40 px-4 py-3 font-mono text-[10px] leading-relaxed backdrop-blur-md lg:block ${className}`}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Hero() {
  const reduce = useReducedMotion();

  return (
    <section id="home" className="relative flex min-h-[100svh] items-center overflow-hidden">
      {/* the galaxy — full bleed, core sits centre-right */}
      <div className="absolute inset-0 -z-20">
        <Suspense fallback={null}>
          <GalaxyScene />
        </Suspense>
      </div>

      {/* legibility scrims — light touch, space stays visible */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-base via-base/85 to-transparent md:via-base/55 md:to-base/10" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-base to-transparent" />

      {/* drifting engineering panels — desktop only, never dominant */}
      <DriftPanel className="right-[7%] top-[16%]" delay={3}>
        <div className="mb-1 flex items-center gap-1.5 uppercase tracking-[0.16em] text-ink-faint">
          <span className="h-1.5 w-1.5 rounded-full bg-mint" /> Deploy · bytefront.dev
        </div>
        <div className="flex items-center gap-1.5 text-ink-dim">
          <Check size={11} className="text-mint" /> success <span className="text-ink-faint">· 12s</span>
        </div>
      </DriftPanel>
      <DriftPanel className="bottom-[30%] right-[4%]" delay={9}>
        <div className="mb-1 uppercase tracking-[0.16em] text-ink-faint">CI/CD</div>
        <div className="text-ink-dim">
          build <span className="text-mint">✓</span> &nbsp;test <span className="text-mint">✓</span> &nbsp;deploy{" "}
          <span className="text-mint">✓</span>
        </div>
      </DriftPanel>
      <DriftPanel className="bottom-[14%] right-[24%]" delay={15}>
        <div className="mb-1 uppercase tracking-[0.16em] text-ink-faint">System</div>
        <div className="text-ink-dim">
          p99 <span className="text-cyan">42ms</span> · uptime <span className="text-cyan">99.99%</span> ·{" "}
          <span className="text-cyan">2.4k</span> rps
        </div>
      </DriftPanel>

      {/* identity — owns the left */}
      <div className="mx-auto w-full max-w-content px-5 sm:px-8">
        <div className="max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EXPO, delay: 0.1 }}
            className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-line bg-surface/50 px-3.5 py-1.5 backdrop-blur"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
            </span>
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-dim">
              Available for opportunities
            </span>
          </motion.div>

          <h1 className="font-display text-[clamp(2.9rem,8.5vw,6rem)] font-extrabold leading-[0.94] tracking-tight">
            <AnimatedHeading text="Supratik" className="block text-ink" delay={0.2} />
            <AnimatedHeading text="Das." className="block text-cyan" delay={0.35} />
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: EXPO, delay: 0.65 }}
            className="mt-5 font-mono text-sm uppercase tracking-[0.2em] text-ink-faint"
          >
            Senior Full Stack Engineer &nbsp;/&nbsp; {profile.location}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EXPO, delay: 0.78 }}
            className="mt-7 max-w-md text-pretty text-base leading-relaxed text-ink-dim"
          >
            I architect software ecosystems — scalable production systems from resilient
            backends to high-traffic interfaces.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EXPO, delay: 0.92 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Magnetic
              href="#projects"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan to-mint px-6 py-3 text-sm font-semibold text-base"
            >
              View Work
              <ArrowUpRight
                size={16}
                strokeWidth={2.5}
                className="transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Magnetic>
            <Magnetic
              href={profile.links.cv}
              download
              strength={0.25}
              className="group inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-medium text-ink-dim transition-colors hover:border-line-bright hover:text-ink"
            >
              <Download
                size={15}
                className="transition-transform duration-300 ease-out-expo group-hover:translate-y-0.5"
              />{" "}
              Download CV
            </Magnetic>
          </motion.div>
        </div>
      </div>

      {!reduce && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-ink-faint"
          >
            <ArrowDown size={16} />
          </motion.div>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
            Scroll
          </span>
        </motion.div>
      )}
    </section>
  );
}
