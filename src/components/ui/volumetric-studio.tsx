import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/*
 * Volumetric studio backdrop — a dark room with three overhead fixtures whose
 * cyan light cones flicker on when the section first enters view. Adapted from
 * a 21st.dev snippet: the WebGL volumetric SpotLights are replaced with pure
 * CSS light cones (clip-path trapezoid + blurred gradient) — reliable, clearly
 * visible, cheap enough to run on every device, and tinted to the brand cyan.
 */

const METAL_NOISE =
  'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%221.5%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E")';
const GRAIN_NOISE =
  'url("data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22g%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23g)%22/%3E%3C/svg%3E")';

const LIGHT = "123,208,255"; // brand cyan
const BEAM = "185,230,255"; // lighter core so the cone reads bright
const SPOTS = [30, 50, 70];
const CONE = "polygon(43% 0%, 57% 0%, 100% 100%, 0% 100%)";

function LightCone({ pos, on, flicker }: { pos: number; on: boolean; flicker: boolean }) {
  const base = {
    position: "absolute" as const,
    left: `${pos}%`,
    top: "6%",
    transform: "translateX(-50%)",
    height: "70%",
    clipPath: CONE,
    mixBlendMode: "screen" as const,
    opacity: on ? 1 : 0,
    transition: flicker ? "none" : "opacity 650ms cubic-bezier(0.16,1,0.3,1)",
    pointerEvents: "none" as const,
  };
  return (
    <>
      {/* soft outer cone */}
      <div
        style={{
          ...base,
          width: 340,
          filter: "blur(14px)",
          background: `linear-gradient(to bottom, rgba(${LIGHT},0.4) 0%, rgba(${LIGHT},0.12) 40%, rgba(${LIGHT},0.03) 72%, transparent 100%)`,
        }}
      />
      {/* bright inner cone */}
      <div
        style={{
          ...base,
          width: 190,
          filter: "blur(7px)",
          background: `linear-gradient(to bottom, rgba(${BEAM},0.6) 0%, rgba(${LIGHT},0.16) 45%, transparent 92%)`,
        }}
      />
    </>
  );
}

function Room({ on, flicker, vignette = 0.6 }: { on: boolean; flicker: boolean; vignette?: number }) {
  const backWall = { tl: [24, 8], tr: [76, 8], br: [76, 72], bl: [24, 72] } as const;
  const { tl, tr, br, bl } = backWall;
  const poly = useMemo(
    () => (pts: readonly (readonly [number, number])[]) =>
      `polygon(${pts.map(([x, y]) => `${x}% ${y}%`).join(", ")})`,
    []
  );
  const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden bg-black">
      {/* walls */}
      <div className="absolute inset-0" style={{ clipPath: poly([tl, tr, br, bl]), background: "linear-gradient(to bottom, #12151c 0%, #050609 100%)" }} />
      <div className="absolute inset-0" style={{ clipPath: poly([[0, 0], [100, 0], tr, tl]), background: "linear-gradient(to bottom, #000000 0%, #05070c 100%)" }} />
      <div className="absolute inset-0" style={{ clipPath: poly([[0, 0], tl, bl, [0, 100]]), background: "linear-gradient(to right, #04060a 0%, #0c1018 70%, #141926 100%)" }} />
      <div className="absolute inset-0" style={{ clipPath: poly([[100, 0], tr, br, [100, 100]]), background: "linear-gradient(to left, #04060a 0%, #0c1018 70%, #141926 100%)" }} />
      <div className="absolute inset-0" style={{ clipPath: poly([[0, 100], [100, 100], br, bl]), background: "linear-gradient(to top, #0a0c12 0%, #030405 100%)" }} />

      {/* floor + vertical edge highlights */}
      <svg className="absolute inset-0 h-full w-full" style={{ zIndex: 10 }}>
        <defs>
          <linearGradient id="vs-baseGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgb(123,208,255)" stopOpacity="0" />
            <stop offset="50%" stopColor="rgb(123,208,255)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="rgb(123,208,255)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="vs-vGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="50%" stopColor="white" stopOpacity="0.12" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1={`${bl[0]}%`} y1={`${bl[1]}%`} x2={`${br[0]}%`} y2={`${br[1]}%`} stroke="rgba(123,208,255,0.25)" strokeWidth="6" style={{ filter: "blur(4px)" }} />
        <line x1={`${bl[0]}%`} y1={`${bl[1]}%`} x2={`${br[0]}%`} y2={`${br[1]}%`} stroke="url(#vs-baseGrad)" strokeWidth="1.5" />
        <line x1={`${tl[0]}%`} y1={`${tl[1]}%`} x2={`${bl[0]}%`} y2={`${bl[1]}%`} stroke="url(#vs-vGrad)" strokeWidth="1" />
        <line x1={`${tr[0]}%`} y1={`${tr[1]}%`} x2={`${br[0]}%`} y2={`${br[1]}%`} stroke="url(#vs-vGrad)" strokeWidth="1" />
      </svg>

      {/* the light cones */}
      <div className="absolute inset-0" style={{ zIndex: 16 }}>
        {SPOTS.map((p, i) => (
          <LightCone key={i} pos={p} on={on} flicker={flicker} />
        ))}
      </div>

      {/* pooled glow where the beams land */}
      <div
        className="absolute inset-0"
        style={{ zIndex: 15, opacity: on ? 1 : 0, transition: flicker ? "none" : `opacity 650ms ${EASE}`, mixBlendMode: "screen" }}
      >
        <div className="absolute inset-0" style={{ clipPath: poly([tl, tr, br, bl]), background: SPOTS.map((x) => `radial-gradient(ellipse 22% 45% at ${x}% 66%, rgba(${LIGHT},0.4) 0%, rgba(${LIGHT},0.1) 45%, transparent 72%)`).join(", ") }} />
        <div className="absolute inset-0" style={{ clipPath: poly([[0, 100], [100, 100], br, bl]), background: SPOTS.map((x) => `radial-gradient(ellipse 30% 45% at ${x}% 12%, rgba(${LIGHT},0.26) 0%, transparent 60%)`).join(", ") }} />
      </div>

      {/* physical fixtures */}
      <div className="absolute inset-0" style={{ zIndex: 31 }}>
        {SPOTS.map((pos, i) => (
          <div key={i} className="absolute flex flex-col items-center" style={{ left: `${pos}%`, top: "2%", transform: "translate(-50%, -4px)" }}>
            <div
              className="relative h-[30px] w-[13px] overflow-hidden rounded-sm border border-black shadow-[0_5px_10px_rgba(0,0,0,0.9)]"
              style={{ background: "linear-gradient(to right, #555 0%, #eee 42%, #888 62%, #222 100%)" }}
            />
            <div className="relative mt-[6px] flex h-[52px] w-[48px] justify-center">
              <div
                className="absolute inset-0 overflow-hidden rounded-b-2xl rounded-t-sm border border-black shadow-[0_18px_28px_rgba(0,0,0,0.9)]"
                style={{ background: "linear-gradient(to right, #111 0%, #3a3a3a 30%, #6a6a6a 50%, #2a2a2a 80%, #000 100%)" }}
              >
                <div className="pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-overlay" style={{ backgroundImage: METAL_NOISE }} />
              </div>
              <div
                className="absolute bottom-[-6px] z-10 flex h-[17px] w-[52px] items-center justify-center overflow-hidden rounded-[50%] border-2 border-black shadow-[0_10px_15px_rgba(0,0,0,1)]"
                style={{ background: "radial-gradient(ellipse at center, #1a1a1a, #000)" }}
              >
                <div
                  className="h-[9px] w-[32px] rounded-[50%] transition-all duration-700"
                  style={{
                    background: on ? "#eaf6ff" : "#151515",
                    boxShadow: on ? `0 0 22px 9px rgba(${LIGHT},0.95), inset 0 0 8px #fff` : "inset 0 2px 5px rgba(0,0,0,0.9)",
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ceiling track */}
      <div className="absolute inset-0" style={{ zIndex: 30, clipPath: poly([[0, 0], [100, 0], tr, tl]) }}>
        <div
          className="absolute h-[24px] w-full"
          style={{ top: "2%", left: 0, background: "linear-gradient(to bottom, #111 0%, #3a3a3a 30%, #5a5a5a 50%, #222 80%, #000 100%)", boxShadow: "inset 0 1px 1px rgba(255,255,255,0.15), 0 10px 20px -5px rgba(0,0,0,0.8)" }}
        >
          <div className="pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-overlay" style={{ backgroundImage: METAL_NOISE }} />
        </div>
      </div>

      {/* vignette + grain */}
      <div className="absolute inset-0" style={{ zIndex: 20, background: `radial-gradient(ellipse 95% 85% at 50% 45%, transparent 50%, rgba(0,0,0,${vignette}) 100%)` }} />
      <div className="absolute inset-0" style={{ zIndex: 25, opacity: 0.045, mixBlendMode: "screen", backgroundImage: GRAIN_NOISE, backgroundSize: "256px 256px" }} />
    </div>
  );
}

export function VolumetricStudio({ className = "", children }: { className?: string; children?: React.ReactNode }) {
  const reduce = useReducedMotion() ?? false;
  const rootRef = useRef<HTMLDivElement>(null);
  const [hasEntered, setHasEntered] = useState(false);
  const [on, setOn] = useState(false);
  const [flicker, setFlicker] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || hasEntered) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setHasEntered(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasEntered]);

  useEffect(() => {
    if (!hasEntered) return;
    if (reduce) {
      setOn(true);
      return;
    }
    let mounted = true;
    setFlicker(true);
    const run = async () => {
      const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
      const steps: [boolean, number][] = [
        [true, 90], [false, 260], [true, 50], [false, 180], [true, 40], [false, 60], [true, 40],
      ];
      for (const [v, ms] of steps) {
        if (!mounted) return;
        setOn(v);
        await sleep(ms);
      }
      if (!mounted) return;
      setFlicker(false);
      setOn(true);
    };
    run();
    return () => {
      mounted = false;
    };
  }, [hasEntered, reduce]);

  return (
    <div ref={rootRef} className={`overflow-hidden ${className}`}>
      <Room on={on} flicker={flicker} />
      {children != null && <div className="relative z-10 h-full w-full">{children}</div>}
    </div>
  );
}
