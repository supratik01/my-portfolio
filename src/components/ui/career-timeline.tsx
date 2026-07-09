import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { experience } from "../../data";
import { Reveal } from "./motion-primitives";

/*
 * Aceternity-style scroll timeline, adapted to this site's design system:
 * a sticky company column per entry, and a vertical beam that fills with
 * scroll progress (cyan→mint) over a faint masked track. Progress is computed
 * manually from the container rect (no framer useScroll — see ScrollProgress).
 */

const dot: Record<string, string> = {
  mint: "bg-mint shadow-[0_0_14px_rgba(78,222,163,0.55)]",
  cyan: "bg-cyan shadow-[0_0_14px_rgba(123,208,255,0.55)]",
  gold: "bg-gold shadow-[0_0_14px_rgba(255,209,102,0.55)]",
};
const label: Record<string, string> = {
  mint: "text-mint",
  cyan: "text-cyan",
  gold: "text-gold",
};

export default function CareerTimeline() {
  const wrapRef = useRef<HTMLDivElement>(null); // the timeline body we measure
  const [height, setHeight] = useState(0);

  // Measure the timeline body so the beam can span it exactly.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setHeight(el.getBoundingClientRect().height));
    ro.observe(el);
    setHeight(el.getBoundingClientRect().height);
    return () => ro.disconnect();
  }, []);

  // Manual scroll progress ≈ useScroll offset ["start 10%", "end 50%"].
  const progress = useMotionValue(0);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const compute = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.85; // beam starts when the body enters the lower viewport
      const end = vh * 0.5; // completes as its bottom crosses the middle
      const total = r.height + (start - end);
      const scrolled = start - r.top;
      progress.set(total > 0 ? Math.min(Math.max(scrolled / total, 0), 1) : 0);
    };
    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, [progress]);

  const smooth = useSpring(progress, { stiffness: 80, damping: 25, mass: 0.4 });
  const beamHeight = useTransform(smooth, [0, 1], [0, height]);
  const beamOpacity = useTransform(smooth, [0, 0.08], [0, 1]);

  return (
    <div ref={wrapRef} className="relative mt-6 pb-4">
      {experience.map((job, i) => (
        <div key={job.company} className="flex justify-start gap-4 pt-12 md:gap-10 md:pt-24">
          {/* Sticky company column (title hidden on mobile, dot always on the rail) */}
          <div className="sticky top-24 z-10 flex flex-col items-start self-start md:top-32 md:w-full md:max-w-sm md:flex-row">
            {/* Node on the rail */}
            <div className="absolute left-[-7px] top-1 grid h-9 w-9 place-items-center rounded-full bg-base md:left-[13px]">
              <span className={`h-3 w-3 rounded-full ${dot[job.accent]}`} />
            </div>
            <div className="hidden md:block md:pl-20">
              <h3 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-ink">
                {job.company}
              </h3>
              <div className={`mt-1 font-mono text-[11px] uppercase tracking-[0.16em] ${label[job.accent]}`}>
                {job.period}
              </div>
            </div>
          </div>

          {/* Entry content */}
          <div className="relative w-full pl-12 md:pl-4">
            <Reveal>
              {/* Mobile-only company header */}
              <div className="mb-4 md:hidden">
                <h3 className="font-display text-2xl font-extrabold leading-tight tracking-tight text-ink">
                  {job.company}
                </h3>
                <div className={`mt-1 font-mono text-[11px] uppercase tracking-[0.16em] ${label[job.accent]}`}>
                  {job.period}
                </div>
              </div>
              <h4 className="font-display text-lg font-bold text-ink">{job.role}</h4>
              <p className="mt-0.5 text-sm italic text-ink-faint">{job.tag}</p>
              <ul className="mt-5 space-y-2.5">
                {job.points.map((pt, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-dim">
                    <span className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${dot[job.accent]}`} />
                    {pt}
                  </li>
                ))}
              </ul>
              {i < experience.length - 1 && <div className="h-2 md:h-0" />}
            </Reveal>
          </div>
        </div>
      ))}

      {/* Track + animated beam */}
      <div
        style={{ height: height + "px" }}
        className="absolute left-[11px] top-0 w-[2px] overflow-hidden bg-gradient-to-b from-transparent via-line to-transparent [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] md:left-[31px]"
      >
        <motion.div
          style={{ height: beamHeight, opacity: beamOpacity }}
          className="absolute inset-x-0 top-0 w-[2px] rounded-full bg-gradient-to-b from-cyan via-mint to-transparent"
        />
      </div>
    </div>
  );
}
