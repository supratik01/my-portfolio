import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function ScrollProgress() {
  // Manual document-scroll progress — avoids framer's useScroll container
  // measurement warning under the pinned/sticky hero layout.
  const progress = useMotionValue(0);
  useEffect(() => {
    const compute = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.set(h > 0 ? Math.min(Math.max(window.scrollY / h, 0), 1) : 0);
    };
    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, [progress]);

  const scaleX = useSpring(progress, { stiffness: 120, damping: 30, mass: 0.4 });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-cyan to-mint"
    />
  );
}
