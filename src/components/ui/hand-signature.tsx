import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/*
 * Self-drawing signature (adapted from the KokonutUI "hand-writing-text" draw).
 * The source animates an SVG <path> via framer's pathLength — that only works on
 * vector paths, and this is a raster PNG signature, so we reproduce the "being
 * written" feel with a left-to-right clip-path wipe that plays once when the mark
 * scrolls into view. Keeps the real ink; honors prefers-reduced-motion (no wipe).
 *
 * Two deliberate choices, both learned the hard way in this codebase:
 *  - In-view is detected with a manual rect check on a passive scroll listener,
 *    not IntersectionObserver/useInView: this sits inside the About ContainerScroll
 *    card (perspective + preserve-3d), where IO intersection calculations misfire —
 *    the same transform quirk that broke native loading="lazy" on the old <img>.
 *  - The wipe is a CSS transition on clip-path, not framer's animate: framer does
 *    not reliably interpolate `clip-path: inset()`, whereas the browser does.
 */
export function HandSignature({
  src,
  alt = "Signature",
  className = "",
}: {
  src: string;
  alt?: string;
  className?: string;
}) {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLImageElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    if (reduce) {
      setDrawn(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const check = () => {
      const r = el.getBoundingClientRect();
      const visible = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
      if (r.height > 0 && visible >= r.height * 0.6) {
        setDrawn(true);
        window.removeEventListener("scroll", check);
        window.removeEventListener("resize", check);
      }
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [reduce]);

  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      width={176}
      height={40}
      loading="eager"
      onError={(e) => {
        e.currentTarget.style.display = "none";
      }}
      style={{
        clipPath: reduce || drawn ? "inset(0% 0% 0% 0%)" : "inset(0% 100% 0% 0%)",
        transition: reduce ? undefined : "clip-path 1.8s cubic-bezier(0.43, 0.13, 0.23, 0.96)",
      }}
      // opacity/tint on the class so the inline style keeps the ink look.
      className={`h-9 w-auto opacity-80 mix-blend-screen [filter:invert(1)_contrast(1.5)_brightness(1.15)] sm:h-10 ${className}`}
    />
  );
}
