import { useEffect, useRef, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";

/*
 * Scroll-driven perspective card (adapted from the Aceternity ContainerScroll):
 * the panel starts tilted back in 3D and straightens to flat as it crosses the
 * viewport, while the title above it gently lifts away. Progress is computed
 * manually from the container rect (house convention — avoids framer's
 * useScroll container warnings under sticky/overflow layouts).
 */
export function ContainerScroll({ title, children }: { title: ReactNode; children: ReactNode }) {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement>(null);

  // 0 → container top touches viewport bottom; 1 → container bottom leaves viewport top.
  const progress = useMotionValue(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const compute = () => {
      const r = el.getBoundingClientRect();
      const total = r.height + window.innerHeight;
      const p = total > 0 ? Math.min(Math.max((window.innerHeight - r.top) / total, 0), 1) : 0;
      progress.set(p);
    };
    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, [progress]);

  // Driven directly from scroll progress, like the source component — scroll is
  // already smooth, and the extra spring layer proved unreliable here.
  // Flat by the time the card reaches centre-screen (short container ≠ demo's 80rem runway).
  const rotateX = useTransform(progress, [0.05, 0.5], reduce ? [0, 0] : [22, 0]);
  const scale = useTransform(progress, [0.05, 0.5], reduce ? [1, 1] : [1.04, 1]);
  const titleY = useTransform(progress, [0.05, 0.6], reduce ? [0, 0] : [0, -70]);

  return (
    <div ref={ref} className="relative py-6 md:py-10" style={{ perspective: "1100px" }}>
      <motion.div style={{ y: titleY }} className="mx-auto mb-10 max-w-3xl text-center md:mb-14">
        {title}
      </motion.div>
      <motion.div
        style={{
          rotateX,
          scale,
          transformStyle: "preserve-3d",
          boxShadow:
            "0 9px 20px rgba(0,0,0,0.3), 0 37px 37px rgba(0,0,0,0.26), 0 84px 50px rgba(0,0,0,0.15), 0 149px 60px rgba(0,0,0,0.04)",
        }}
        className="mx-auto w-full max-w-5xl rounded-[26px] border border-line-bright bg-surface-2 p-2 md:p-3"
      >
        <div className="h-full w-full overflow-hidden rounded-2xl border border-line bg-surface">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
