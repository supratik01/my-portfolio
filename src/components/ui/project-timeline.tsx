import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  LayoutTemplate,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { projects } from "../../data";

/*
 * Scroll-active timeline: only the project centered in the viewport is "open".
 * As you scroll, the active card expands (grid-rows 0fr→1fr) to reveal its
 * highlights, stack, and link; the others stay collapsed. Adapted from the
 * release-timeline pattern to this site's dark design system.
 *
 * Media per project: a framer-motion image carousel (auto-advancing while the
 * card is the active/focused one) or a video that autoplays on focus.
 */

type Accent = "mint" | "cyan";

const ICONS: Record<string, LucideIcon> = {
  "Photo Product Builder": LayoutTemplate,
  "JS Execution Visualizer": Workflow,
};

const accentText: Record<Accent, string> = { mint: "text-mint", cyan: "text-cyan" };
const accentDot: Record<Accent, string> = { mint: "bg-mint", cyan: "bg-cyan" };
const accentSolid: Record<Accent, string> = {
  mint: "bg-mint text-base",
  cyan: "bg-cyan text-base",
};
const accentGrad: Record<Accent, string> = {
  mint: "from-mint/25 via-mint/5",
  cyan: "from-cyan/25 via-cyan/5",
};

const MEDIA_BOX = "relative mb-5 h-56 w-full overflow-hidden rounded-xl border border-line md:h-80";

/* Branded fallback panel when no media (or it failed to load) is available. */
function BrandedPanel({
  accent,
  index,
  label,
  Icon,
}: {
  accent: Accent;
  index: string;
  label: string;
  Icon: LucideIcon;
}) {
  return (
    <div
      className={`grid h-full w-full place-items-center bg-gradient-to-br ${accentGrad[accent]} to-transparent`}
    >
      <div className="grid-lines absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute -right-6 -top-10 font-display text-[10rem] font-extrabold leading-none text-ink/[0.04]">
        {index}
      </div>
      <div className="relative flex flex-col items-center gap-3">
        <span className={`grid h-14 w-14 place-items-center rounded-2xl ${accentSolid[accent]}`}>
          <Icon className="h-6 w-6" strokeWidth={1.75} />
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
          {label}
        </span>
      </div>
    </div>
  );
}

/* Framer-motion image carousel — slide + crossfade, auto-advances while focused. */
function ProjectCarousel({
  images,
  alt,
  accent,
  index,
  Icon,
  isActive,
}: {
  images: string[];
  alt: string;
  accent: Accent;
  index: string;
  Icon: LucideIcon;
  isActive: boolean;
}) {
  const reduce = useReducedMotion() ?? false;
  const [[page, dir], setPage] = useState<[number, number]>([0, 0]);
  const [hovering, setHovering] = useState(false);
  const [failed, setFailed] = useState<Record<number, boolean>>({});
  const current = ((page % images.length) + images.length) % images.length;

  const paginate = (d: number) => setPage(([p]) => [p + d, d]);

  // Auto-advance only while the card is focused (active) and not being hovered.
  useEffect(() => {
    if (reduce || !isActive || hovering || images.length < 2) return;
    const id = window.setInterval(() => setPage(([p]) => [p + 1, 1]), 3800);
    return () => window.clearInterval(id);
  }, [reduce, isActive, hovering, images.length]);

  const variants = {
    enter: (d: number) => ({ x: reduce ? 0 : `${d * 100}%`, opacity: 0 }),
    center: { x: "0%", opacity: 1 },
    exit: (d: number) => ({ x: reduce ? 0 : `${d * -100}%`, opacity: 0 }),
  };

  return (
    <div
      className={MEDIA_BOX}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <AnimatePresence initial={false} custom={dir} mode="popLayout">
        {failed[current] ? (
          <motion.div
            key={`fallback-${current}`}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <BrandedPanel accent={accent} index={index} label={alt} Icon={Icon} />
          </motion.div>
        ) : (
          <motion.img
            key={current}
            src={images[current]}
            alt={`${alt} — view ${current + 1}`}
            loading="lazy"
            onError={() => setFailed((f) => ({ ...f, [current]: true }))}
            className="absolute inset-0 h-full w-full object-cover object-top"
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { duration: 0.55, ease: [0.42, 0, 0.58, 1] },
              opacity: { duration: 0.35 },
            }}
          />
        )}
      </AnimatePresence>

      {/* Prev / next controls */}
      <button
        type="button"
        aria-label="Previous image"
        onClick={() => paginate(-1)}
        className="group/nav absolute left-2 top-1/2 z-10 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full border border-line-bright bg-base/60 text-ink-dim backdrop-blur-sm transition-all hover:bg-base/80 hover:text-ink"
      >
        <ChevronLeft size={16} className="transition-transform group-hover/nav:-translate-x-0.5" />
      </button>
      <button
        type="button"
        aria-label="Next image"
        onClick={() => paginate(1)}
        className="group/nav absolute right-2 top-1/2 z-10 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full border border-line-bright bg-base/60 text-ink-dim backdrop-blur-sm transition-all hover:bg-base/80 hover:text-ink"
      >
        <ChevronRight size={16} className="transition-transform group-hover/nav:translate-x-0.5" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to image ${i + 1}`}
            aria-current={i === current}
            onClick={() => setPage([i, i > current ? 1 : -1])}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? `w-5 ${accentDot[accent]}` : "w-1.5 bg-ink/30 hover:bg-ink/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* Video that autoplays (muted, looped) when the card is focused/active. */
function ProjectVideo({
  src,
  alt,
  accent,
  index,
  Icon,
  isActive,
}: {
  src: string;
  alt: string;
  accent: Accent;
  index: string;
  Icon: LucideIcon;
  isActive: boolean;
}) {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLVideoElement>(null);
  const [hovering, setHovering] = useState(false);
  const [failed, setFailed] = useState(false);

  const shouldPlay = !reduce && (isActive || hovering);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (shouldPlay) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [shouldPlay]);

  if (failed) {
    return (
      <div className={MEDIA_BOX}>
        <BrandedPanel accent={accent} index={index} label={alt} Icon={Icon} />
      </div>
    );
  }

  return (
    <div
      className={MEDIA_BOX}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <video
        ref={ref}
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
        controls={reduce}
        onError={() => setFailed(true)}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Subtle focus ring + label so the autoplay reads as intentional */}
      <div
        className={`pointer-events-none absolute bottom-3 left-3 z-10 flex items-center gap-1.5 rounded-full border border-line-bright bg-base/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] backdrop-blur-sm transition-opacity duration-300 ${
          shouldPlay ? "opacity-100" : "opacity-0"
        } ${accentText[accent]}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${accentDot[accent]} animate-pulse`} />
        Live demo
      </div>
    </div>
  );
}

function ProjectMedia({
  media,
  accent,
  index,
  Icon,
  isActive,
}: {
  media: { title: string; image?: string; images?: string[]; video?: string };
  accent: Accent;
  index: string;
  Icon: LucideIcon;
  isActive: boolean;
}) {
  if (media.video) {
    return (
      <ProjectVideo src={media.video} alt={media.title} accent={accent} index={index} Icon={Icon} isActive={isActive} />
    );
  }
  if (media.images && media.images.length > 0) {
    return (
      <ProjectCarousel images={media.images} alt={media.title} accent={accent} index={index} Icon={Icon} isActive={isActive} />
    );
  }
  return (
    <div className={MEDIA_BOX}>
      <BrandedPanel accent={accent} index={index} label={media.title} Icon={Icon} />
    </div>
  );
}

export default function ProjectTimeline() {
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const sentinels = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Whichever sentinel is closest to ~40% viewport height becomes active.
    const compute = () => {
      const targetY = window.innerHeight * 0.4;
      let best = 0;
      let bestDist = Infinity;
      sentinels.current.forEach((node, i) => {
        if (!node) return;
        const r = node.getBoundingClientRect();
        const mid = r.top + r.height / 2;
        const d = Math.abs(mid - targetY);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      if (best !== activeRef.current) {
        activeRef.current = best;
        setActive(best);
      }
    };
    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, []);

  return (
    <div className="mt-14 space-y-16 md:mt-20 md:space-y-24">
      {projects.map((p, i) => {
        const isActive = i === active;
        const accent = p.accent as Accent;
        const Icon = ICONS[p.title] ?? LayoutTemplate;

        return (
          <div key={p.title} className="relative flex flex-col gap-5 md:flex-row md:gap-14">
            {/* Sticky meta column */}
            <div className="flex h-min w-full shrink-0 items-start gap-3 md:sticky md:top-28 md:w-60">
              <div
                className={`grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg transition-colors duration-300 ${
                  isActive ? accentSolid[accent] : "bg-surface-2 text-ink-faint"
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={2} />
              </div>
              <div className="flex flex-col">
                <span
                  className={`font-display text-sm font-bold transition-colors duration-300 ${
                    isActive ? "text-ink" : "text-ink-dim"
                  }`}
                >
                  {p.title}
                </span>
                <span className={`mt-0.5 font-mono text-[11px] uppercase tracking-[0.14em] ${accentText[accent]}`}>
                  {p.kicker}
                </span>
              </div>
            </div>

            {/* Sentinel for proximity measurement (near the card's visual top) */}
            <div
              ref={(el) => (sentinels.current[i] = el)}
              aria-hidden
              className="pointer-events-none absolute -top-28 left-0 h-12 w-12 opacity-0"
            />

            {/* Content card */}
            <article
              aria-current={isActive ? "true" : "false"}
              className={`flex-1 rounded-2xl border p-4 transition-all duration-300 sm:p-5 ${
                isActive
                  ? "border-line-bright bg-surface-2 shadow-[0_30px_60px_-24px_rgba(0,0,0,0.7)]"
                  : "border-line bg-surface"
              }`}
            >
              <ProjectMedia media={p} accent={accent} index={p.index} Icon={Icon} isActive={isActive} />

              <h3
                className={`font-display text-xl font-bold leading-tight tracking-tight transition-colors duration-300 md:text-2xl ${
                  isActive ? "text-ink" : "text-ink/70"
                }`}
              >
                {p.title}
              </h3>
              <p
                className={`mt-2 text-sm leading-relaxed transition-all duration-300 ${
                  isActive ? "text-ink-dim" : "line-clamp-2 text-ink-dim/80"
                }`}
              >
                {p.description}
              </p>

              {/* Expandable region */}
              <div
                aria-hidden={!isActive}
                className={`grid transition-all duration-500 ease-out-expo ${
                  isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="space-y-5 pt-5">
                    {/* Highlights */}
                    <ul className="space-y-2.5 rounded-xl border border-line bg-surface p-4">
                      {p.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-dim">
                          <span className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${accentDot[accent]}`} />
                          {h}
                        </li>
                      ))}
                    </ul>

                    {/* Stack chips */}
                    <div className="flex flex-wrap gap-1.5">
                      {p.stack.map((t) => (
                        <span
                          key={t}
                          className="rounded-md border border-line bg-surface-2 px-2.5 py-1 font-mono text-[11px] text-ink-faint"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Link */}
                    <div className="flex justify-end">
                      <a
                        href={p.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] transition-colors hover:border-line-bright ${accentText[accent]}`}
                      >
                        Visit Site
                        <ArrowUpRight
                          size={15}
                          strokeWidth={2.5}
                          className="transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
        );
      })}
    </div>
  );
}
