import { Suspense, useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Billboard, Text, Html } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";
import type { IconType } from "react-icons";
import {
  SiJavascript,
  SiTypescript,
  SiReact,
  SiAngular,
  SiNodedotjs,
  SiSpringboot,
  SiPostgresql,
  SiMongodb,
  SiRedis,
  SiDocker,
  SiGit,
} from "react-icons/si";
import { FaAws } from "react-icons/fa";

/* ────────────────────────────────────────────────────────────────────────
   Code Galaxy — a slowly turning spiral made of software. Code-glyph
   particles form the arms, a luminous data-singularity sits at the core,
   and twelve frosted-glass ecosystem planets drift in wide orbit while
   light-packets route between them like requests across a distributed
   system. Palette is locked to the site theme: cyan / mint / gold on
   deep-navy space. ──────────────────────────────────────────────────── */

const CYAN = "#7bd0ff";
const MINT = "#4edea3";
const GOLD = "#ffd166";
const LABEL = "#8ea3c8";

/* ── canvas-generated sprite textures ── */
function makeCircleTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.35, "rgba(255,255,255,0.55)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}
function makeGlyphTexture(glyph: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  g.font = "700 34px 'JetBrains Mono', ui-monospace, monospace";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillStyle = "#ffffff";
  g.fillText(glyph, 32, 34);
  return new THREE.CanvasTexture(c);
}

/* ── spiral-arm particle distribution ── */
function galaxyPositions(count: number, radius: number, yFlat: number) {
  const branches = 3;
  const spin = 1.5;
  const randomness = 0.28;
  const power = 3.1;
  const positions = new Float32Array(count * 3);
  const radii = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const r = Math.random() * radius;
    const branchAngle = ((i % branches) / branches) * Math.PI * 2;
    const spinAngle = r * spin;
    const rnd = () =>
      Math.pow(Math.random(), power) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;
    positions[i * 3] = Math.cos(branchAngle + spinAngle) * r + rnd();
    positions[i * 3 + 1] = rnd() * yFlat;
    positions[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * r + rnd();
    radii[i] = r;
  }
  return { positions, radii };
}

/* ── the star field of code ── */
function GalaxyPoints({ count }: { count: number }) {
  const circle = useMemo(makeCircleTexture, []);
  const { positions, colors } = useMemo(() => {
    const { positions, radii } = galaxyPositions(count, 5.4, 0.5);
    const colors = new Float32Array(count * 3);
    // Vibrant nebula ramp: white core → pink → violet → blue → cyan, with warm sparks.
    const stops = [
      { t: 0.0, c: new THREE.Color("#ffffff") },
      { t: 0.13, c: new THREE.Color("#ff6ec7") },
      { t: 0.32, c: new THREE.Color("#a06bff") },
      { t: 0.55, c: new THREE.Color("#5b8dff") },
      { t: 0.78, c: new THREE.Color("#37d6ff") },
      { t: 1.0, c: new THREE.Color("#1f5fbf") },
    ];
    const amber = new THREE.Color("#ffb057");
    const gold = new THREE.Color("#ffd166");
    const mint = new THREE.Color("#5ef0c0");
    const c = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const t = radii[i] / 5.4;
      let s = 0;
      while (s < stops.length - 2 && t > stops[s + 1].t) s++;
      const a = stops[s];
      const b = stops[s + 1];
      const lt = THREE.MathUtils.clamp((t - a.t) / (b.t - a.t), 0, 1);
      c.copy(a.c).lerp(b.c, lt);
      const roll = Math.random();
      if (roll > 0.978) c.copy(amber);
      else if (roll > 0.958) c.copy(gold);
      else if (roll > 0.945) c.copy(mint);
      c.multiplyScalar(1.05 + Math.random() * 0.7);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, colors };
  }, [count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.058}
        map={circle}
        vertexColors
        transparent
        opacity={1}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

/* ── sparse glyph particles scattered through the arms ── */
const GLYPHS = ["{ }", "</>", "01", "()", "=>", ";"];
function GlyphClouds({ perGlyph }: { perGlyph: number }) {
  const textures = useMemo(() => GLYPHS.map(makeGlyphTexture), []);
  const clouds = useMemo(
    () =>
      GLYPHS.map(() => galaxyPositions(perGlyph, 5.0, 1.4).positions),
    [perGlyph]
  );
  return (
    <>
      {clouds.map((positions, i) => (
        <points key={i}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          </bufferGeometry>
          <pointsMaterial
            size={0.16}
            map={textures[i]}
            color={i % 3 === 0 ? MINT : CYAN}
            transparent
            opacity={0.4}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            sizeAttenuation
          />
        </points>
      ))}
    </>
  );
}

/* ── distant static stars for depth ── */
function BackgroundStars() {
  const circle = useMemo(makeCircleTexture, []);
  const positions = useMemo(() => {
    const n = 700;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const v = new THREE.Vector3()
        .randomDirection()
        .multiplyScalar(14 + Math.random() * 8);
      arr[i * 3] = v.x;
      arr[i * 3 + 1] = v.y;
      arr[i * 3 + 2] = v.z;
    }
    return arr;
  }, []);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        map={circle}
        color="#9fc2ee"
        transparent
        opacity={0.35}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

/* ── the data singularity ── */
function Core({ reduce }: { reduce: boolean }) {
  const circle = useMemo(makeCircleTexture, []);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.Sprite>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (!reduce) {
      if (ringA.current) ringA.current.rotation.z += delta * 0.35;
      if (ringB.current) ringB.current.rotation.z -= delta * 0.22;
      if (glow.current) {
        const s = 2.4 + Math.sin(t * 0.7) * 0.16;
        glow.current.scale.set(s, s, 1);
      }
    }
  });

  return (
    <group>
      {/* halo */}
      <sprite ref={glow} scale={[2.4, 2.4, 1]}>
        <spriteMaterial
          map={circle}
          color={CYAN}
          transparent
          opacity={0.42}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
      <sprite scale={[1.0, 1.0, 1]}>
        <spriteMaterial
          map={circle}
          color="#cfe8ff"
          transparent
          opacity={0.55}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
      {/* soft centre — keep it readable for the core label */}
      <mesh>
        <sphereGeometry args={[0.11, 24, 24]} />
        <meshBasicMaterial color="#e6f2ff" toneMapped={false} />
      </mesh>
      {/* accretion rings */}
      <mesh ref={ringA} rotation={[Math.PI / 2.15, 0, 0]}>
        <torusGeometry args={[0.52, 0.006, 8, 96]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.6} toneMapped={false} />
      </mesh>
      <mesh ref={ringB} rotation={[Math.PI / 1.85, 0.25, 0]}>
        <torusGeometry args={[0.74, 0.004, 8, 96]} />
        <meshBasicMaterial color={MINT} transparent opacity={0.35} toneMapped={false} />
      </mesh>
      <pointLight intensity={2.4} distance={9} color="#dfeeff" />
    </group>
  );
}

/* ── ecosystem planets ── */
type Planet = {
  name: string;
  color: string;
  icon: IconType;
  r: number;
  size: number;
  speed: number;
  phase: number;
  incl: number;
};
const PLANETS: Planet[] = [
  { name: "JavaScript", color: "#f7df1e", icon: SiJavascript, r: 2.6, size: 0.16, speed: 0.045, phase: 0.0, incl: 0.16 },
  { name: "TypeScript", color: "#3178c6", icon: SiTypescript, r: 3.4, size: 0.15, speed: 0.045, phase: 0.524, incl: -0.2 },
  { name: "React", color: "#61dafb", icon: SiReact, r: 2.6, size: 0.16, speed: 0.045, phase: 1.047, incl: 0.18 },
  { name: "Angular", color: "#dd0031", icon: SiAngular, r: 3.4, size: 0.15, speed: 0.045, phase: 1.571, incl: -0.16 },
  { name: "Node.js", color: "#83cd29", icon: SiNodedotjs, r: 2.6, size: 0.16, speed: 0.045, phase: 2.094, incl: 0.14 },
  { name: "Spring Boot", color: "#6db33f", icon: SiSpringboot, r: 3.4, size: 0.15, speed: 0.045, phase: 2.618, incl: -0.2 },
  { name: "PostgreSQL", color: "#4b8bbe", icon: SiPostgresql, r: 2.6, size: 0.15, speed: 0.045, phase: 3.142, incl: 0.12 },
  { name: "MongoDB", color: "#47a248", icon: SiMongodb, r: 3.4, size: 0.15, speed: 0.045, phase: 3.665, incl: -0.18 },
  { name: "Redis", color: "#dc382d", icon: SiRedis, r: 2.6, size: 0.14, speed: 0.045, phase: 4.189, incl: 0.16 },
  { name: "Docker", color: "#2496ed", icon: SiDocker, r: 3.4, size: 0.15, speed: 0.045, phase: 4.712, incl: -0.16 },
  { name: "AWS", color: "#ff9900", icon: FaAws, r: 2.6, size: 0.15, speed: 0.045, phase: 5.236, incl: 0.1 },
  { name: "Git", color: "#f05032", icon: SiGit, r: 3.4, size: 0.14, speed: 0.045, phase: 5.76, incl: -0.14 },
];

function planetPos(p: Planet, t: number, out: THREE.Vector3) {
  const a = p.phase + t * p.speed;
  out.set(Math.cos(a) * p.r, Math.sin(a) * p.incl * p.r, Math.sin(a) * p.r);
  return out;
}

function Planets({
  reduce,
  posRef,
}: {
  reduce: boolean;
  posRef: React.MutableRefObject<THREE.Vector3[]>;
}) {
  const groups = useRef<(THREE.Group | null)[]>([]);
  const glow = useMemo(makeCircleTexture, []);

  useFrame((state) => {
    const t = reduce ? 0 : state.clock.elapsedTime;
    PLANETS.forEach((p, i) => {
      const g = groups.current[i];
      if (!g) return;
      planetPos(p, t, g.position);
      // gentle per-planet bob so the rigid ring still breathes
      if (!reduce) g.position.y += Math.sin(t * 0.6 + i) * 0.05;
      posRef.current[i].copy(g.position);
    });
  });

  return (
    <>
      {PLANETS.map((p, i) => {
        const Icon = p.icon;
        return (
          <group key={p.name} ref={(el) => (groups.current[i] = el)}>
            {/* soft brand-coloured glow orb (blooms) */}
            <sprite scale={[p.size * 5.2, p.size * 5.2, 1]}>
              <spriteMaterial
                map={glow}
                color={p.color}
                transparent
                opacity={0.55}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </sprite>
            {/* crisp logo chip */}
            <Html center pointerEvents="none" style={{ pointerEvents: "none" }} zIndexRange={[10, 0]}>
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  background: "rgba(8,13,24,0.78)",
                  border: `1px solid ${p.color}88`,
                  boxShadow: `0 0 18px ${p.color}66, inset 0 0 10px ${p.color}22`,
                  backdropFilter: "blur(3px)",
                }}
              >
                <Icon size={24} color={p.color} style={{ display: "block" }} />
              </div>
            </Html>
            <Billboard>
              <Text
                position={[0, -0.42, 0]}
                fontSize={0.1}
                color={LABEL}
                fillOpacity={0.7}
                anchorX="center"
                anchorY="top"
                outlineWidth={0.004}
                outlineColor="#070b16"
              >
                {p.name}
              </Text>
            </Billboard>
          </group>
        );
      })}
    </>
  );
}

/* ── light packets routing between planets ── */
const PACKET_COUNT = 22;
function Packets({
  reduce,
  posRef,
}: {
  reduce: boolean;
  posRef: React.MutableRefObject<THREE.Vector3[]>;
}) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colorObj = useMemo(() => new THREE.Color(), []);
  const packets = useMemo(
    () =>
      Array.from({ length: PACKET_COUNT }, () => ({
        from: Math.floor(Math.random() * PLANETS.length),
        to: Math.floor(Math.random() * PLANETS.length),
        t: Math.random(),
        speed: 0.12 + Math.random() * 0.22,
        hue: Math.random(),
      })),
    []
  );

  useEffect(() => {
    if (!mesh.current) return;
    const palette = [CYAN, "#ffffff", MINT, GOLD];
    packets.forEach((p, i) => {
      colorObj.set(palette[Math.floor(p.hue * palette.length)]);
      mesh.current!.setColorAt(i, colorObj);
    });
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true;
  }, [packets, colorObj]);

  useFrame((_, delta) => {
    if (!mesh.current) return;
    const step = reduce ? 0 : delta;
    packets.forEach((p, i) => {
      p.t += p.speed * step;
      if (p.t >= 1) {
        p.from = p.to;
        let next = Math.floor(Math.random() * PLANETS.length);
        if (next === p.from) next = (next + 1) % PLANETS.length;
        p.to = next;
        p.t = 0;
        p.speed = 0.12 + Math.random() * 0.22;
      }
      const a = posRef.current[p.from];
      const b = posRef.current[p.to];
      const tt = p.t < 0.5 ? 2 * p.t * p.t : 1 - Math.pow(-2 * p.t + 2, 2) / 2;
      dummy.position.lerpVectors(a, b, tt);
      dummy.position.y += Math.sin(p.t * Math.PI) * 0.35;
      dummy.scale.setScalar(0.035 + 0.02 * Math.sin(p.t * Math.PI));
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, PACKET_COUNT]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
}

/* ── drifting code snippets ── */
const SNIPPETS = [
  "const", "await", "fetch()", "SELECT *", "git commit", "POST /api/users",
  "HTTP 200", "docker build", "useEffect()", "npm install", "Promise.all()", "map()",
];
function FloatingSnippet({ seed }: { seed: number }) {
  const ref = useRef<THREE.Group>(null);
  const textRef = useRef<any>(null);
  const st = useRef({ text: "", life: 0, dur: 0, x: 0, y: 0, z: 0, next: 1 + seed * 1.7 });

  useFrame((_state, delta) => {
    const s = st.current;
    s.next -= delta;
    if (s.next <= 0 && s.life <= 0) {
      s.text = SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)];
      const a = Math.random() * Math.PI * 2;
      const r = 2 + Math.random() * 3.2;
      s.x = Math.cos(a) * r;
      s.z = Math.sin(a) * r;
      s.y = (Math.random() - 0.5) * 2.4;
      s.dur = 3 + Math.random() * 2;
      s.life = s.dur;
      s.next = 4 + Math.random() * 6;
    }
    if (s.life > 0) {
      s.life -= delta;
      const p = 1 - s.life / s.dur;
      const fade = Math.sin(Math.min(p, 1) * Math.PI);
      if (ref.current) {
        ref.current.position.set(s.x, s.y + p * 0.4, s.z);
        ref.current.visible = true;
      }
      if (textRef.current) {
        textRef.current.text = s.text;
        textRef.current.fillOpacity = fade * 0.5;
        textRef.current.outlineOpacity = fade * 0.5;
      }
    } else if (ref.current) {
      ref.current.visible = false;
    }
  });

  return (
    <group ref={ref} visible={false}>
      <Billboard>
        <Text
          ref={textRef}
          fontSize={0.15}
          color={CYAN}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.004}
          outlineColor="#070b16"
        >
          {" "}
        </Text>
      </Billboard>
    </group>
  );
}

/* ── camera: slow drift + breathing + cursor bias (window-tracked) ── */
function Rig({ reduce }: { reduce: boolean }) {
  const pointer = useRef({ x: 0, y: 0 });
  const smooth = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: MouseEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduce]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    smooth.current.x = THREE.MathUtils.damp(smooth.current.x, pointer.current.x, 2, delta);
    smooth.current.y = THREE.MathUtils.damp(smooth.current.y, pointer.current.y, 2, delta);
    const drift = reduce ? 0 : 1;
    state.camera.position.x = smooth.current.x * 0.55 + Math.sin(t * 0.09) * 0.25 * drift;
    state.camera.position.y = smooth.current.y * 0.4 + Math.cos(t * 0.07) * 0.18 * drift + 0.35;
    state.camera.position.z = 7.6 + Math.sin(t * 0.11) * 0.2 * drift;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

function Galaxy({ reduce, mobile }: { reduce: boolean; mobile: boolean }) {
  const spinGroup = useRef<THREE.Group>(null);
  const posRef = useRef<THREE.Vector3[]>(PLANETS.map(() => new THREE.Vector3()));

  useFrame((_, delta) => {
    if (spinGroup.current && !reduce) spinGroup.current.rotation.y += delta * 0.028;
  });

  return (
    <group
      position={mobile ? [0.2, 1.7, 0] : [2.0, 0.1, 0]}
      rotation={[-0.5, 0, 0.1]}
      scale={mobile ? 0.6 : 0.92}
    >
      {/* spiral arms rotate; planets orbit on their own clocks */}
      <group ref={spinGroup}>
        <GalaxyPoints count={mobile ? 6500 : 16000} />
        <GlyphClouds perGlyph={mobile ? 60 : 130} />
      </group>
      <Core reduce={reduce} />
      {/* core identity label (desktop only — mobile hero already states the role) */}
      {!mobile && (
      <Html center pointerEvents="none" style={{ pointerEvents: "none" }} zIndexRange={[9, 0]}>
        <div
          style={{
            textAlign: "center",
            whiteSpace: "nowrap",
            textShadow: "0 2px 18px rgba(7,11,22,0.98), 0 0 34px rgba(7,11,22,0.95)",
            userSelect: "none",
          }}
        >
          <div style={{ fontFamily: "'JetBrains Mono', monospace", color: "#7bd0ff", fontSize: 18, letterSpacing: 2 }}>
            &lt;/&gt;
          </div>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: "#e8eefc",
              fontWeight: 500,
              fontSize: 10.5,
              letterSpacing: 3,
              lineHeight: 1.5,
              marginTop: 8,
              textTransform: "uppercase",
            }}
          >
            Full&nbsp;Stack
            <br />
            Engineer
          </div>
        </div>
      </Html>
      )}
      <Planets reduce={reduce} posRef={posRef} />
      <Packets reduce={reduce} posRef={posRef} />
      {!mobile && [0, 1, 2, 3, 4].map((i) => <FloatingSnippet key={i} seed={i} />)}
    </group>
  );
}

function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const on = () => setM(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return m;
}

export default function GalaxyScene() {
  const reduce = useReducedMotion() ?? false;
  const mobile = useIsMobile();

  return (
    <Canvas
      dpr={[1, mobile ? 1.3 : 1.7]}
      camera={{ position: [0, 0.35, 7.6], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none", width: "100%", height: "100%" }}
      resize={{ scroll: false, debounce: 0 }}
    >
      <color attach="background" args={["#070b16"]} />
      <Suspense fallback={null}>
        <ambientLight intensity={0.35} />
        <directionalLight position={[6, 4, 6]} intensity={0.6} color={CYAN} />
        <BackgroundStars />
        <Galaxy reduce={reduce} mobile={mobile} />
        <Rig reduce={reduce} />
        {!mobile && (
          <EffectComposer enableNormalPass={false}>
            <Bloom mipmapBlur luminanceThreshold={0.32} luminanceSmoothing={0.4} intensity={1.05} radius={0.8} />
            <Vignette eskil={false} offset={0.26} darkness={0.78} />
          </EffectComposer>
        )}
      </Suspense>
    </Canvas>
  );
}
