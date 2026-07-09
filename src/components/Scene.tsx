import { Suspense, useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Icosahedron, MeshDistortMaterial, Float, Billboard, Text, Line } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";
import { skills } from "../data";

const LEVEL_COLOR: Record<string, string> = {
  Expert: "#4edea3",
  Advanced: "#7bd0ff",
  Pro: "#9aa7c7",
  Intermediate: "#ffd166",
};
const REST_COLOR = "#6b7aa0";
const R = 2.75; // orbit radius
const _tmp = new THREE.Vector3();

/* Even distribution of N points on a sphere (Fibonacci). */
function fibonacciSphere(n: number, radius: number) {
  const pts: THREE.Vector3[] = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    pts.push(new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r).multiplyScalar(radius));
  }
  return pts;
}

/* One stack item: line to core, glowing node, billboarded label.
   Depth (scale/opacity/blur) tracks camera-space Z so the orbit reads as 3D. */
function StackNode({
  item,
  position,
  active,
  onOver,
  onOut,
}: {
  item: { name: string; level: string; note: string };
  position: THREE.Vector3;
  active: boolean;
  onOver: () => void;
  onOut: () => void;
}) {
  const group = useRef<THREE.Group>(null);
  const node = useRef<THREE.Mesh>(null);
  const text = useRef<any>(null);
  const color = LEVEL_COLOR[item.level] ?? REST_COLOR;

  useFrame((state, delta) => {
    if (!group.current) return;
    // Depth cue from world Z: 0 = far side, 1 = near camera.
    group.current.getWorldPosition(_tmp);
    const t = THREE.MathUtils.clamp((_tmp.z + R) / (2 * R), 0, 1);
    const depthScale = THREE.MathUtils.lerp(0.68, 1.28, t);
    const depthOpacity = THREE.MathUtils.lerp(0.28, 1, t);

    const targetScale = depthScale * (active ? 1.34 : 1);
    const s = THREE.MathUtils.damp(group.current.scale.x, targetScale, 8, delta);
    group.current.scale.setScalar(s);

    if (node.current) {
      const m = node.current.material as THREE.MeshBasicMaterial;
      const pulse = active ? 1 : 0.5 + Math.sin(state.clock.elapsedTime * 2 + position.x) * 0.18;
      m.opacity = depthOpacity * pulse;
    }
    if (text.current) {
      const o = active ? 1 : depthOpacity;
      text.current.fillOpacity = o;
      text.current.outlineOpacity = o;
      text.current.outlineBlur = active ? 0 : (1 - t) * 0.006;
    }
  });

  return (
    <>
      <Line
        points={[[0, 0, 0], [position.x, position.y, position.z]]}
        color={active ? color : "#1e2842"}
        lineWidth={active ? 1.4 : 1}
        transparent
        opacity={active ? 0.7 : 0.22}
      />
      <group ref={group} position={position}>
        <mesh ref={node}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshBasicMaterial color={color} transparent toneMapped={false} />
        </mesh>
        <Billboard>
          <Text
            ref={text}
            position={[0, 0.16, 0]}
            fontSize={0.17}
            color={active ? color : REST_COLOR}
            anchorX="center"
            anchorY="bottom"
            outlineWidth={0.004}
            outlineColor="#070b16"
            onPointerOver={(e) => {
              e.stopPropagation();
              document.body.style.cursor = "pointer";
              onOver();
            }}
            onPointerOut={() => {
              document.body.style.cursor = "auto";
              onOut();
            }}
          >
            {item.name}
          </Text>
          {active && (
            <Text
              position={[0, -0.02, 0]}
              fontSize={0.085}
              color="#9aa7c7"
              anchorX="center"
              anchorY="top"
              outlineWidth={0.003}
              outlineColor="#070b16"
            >
              {item.level}
            </Text>
          )}
        </Billboard>
      </group>
    </>
  );
}

function Constellation({ reduce }: { reduce: boolean }) {
  const group = useRef<THREE.Group>(null);
  const spin = useRef(0.2);
  const [active, setActive] = useState<number | null>(null);
  const positions = useMemo(() => fibonacciSphere(skills.length, R), []);

  useFrame((state, delta) => {
    if (!group.current || reduce) return;
    const t = state.clock.elapsedTime;
    // Continuous, clearly-visible drift with organic velocity variation.
    const idle = 0.2 + Math.sin(t * 0.35) * 0.04;
    const targetSpin = active !== null ? 0.03 : idle;
    spin.current = THREE.MathUtils.damp(spin.current, targetSpin, 2.5, delta);
    group.current.rotation.y += spin.current * delta;
    // Slow multi-axis tumble so it reads as a 3D body, not a spinning disc.
    group.current.rotation.x = 0.35 + Math.sin(t * 0.15) * 0.07;
    group.current.rotation.z = 0.12 + Math.cos(t * 0.12) * 0.05;
  });

  return (
    <group ref={group} rotation={[0.35, 0, 0.12]}>
      {positions.map((p, i) => (
        <StackNode
          key={skills[i].name}
          item={skills[i]}
          position={p}
          active={active === i}
          onOver={() => setActive(i)}
          onOut={() => setActive((cur) => (cur === i ? null : cur))}
        />
      ))}
    </group>
  );
}

function Core({ reduce }: { reduce: boolean }) {
  const group = useRef<THREE.Group>(null);
  const mat = useRef<any>(null);
  const wire = useRef<THREE.MeshBasicMaterial>(null);
  const { viewport } = useThree();
  const target = useRef({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);

  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const px = (state.pointer.x * viewport.width) / 16;
    const py = (state.pointer.y * viewport.height) / 16;
    target.current.x = THREE.MathUtils.damp(target.current.x, px, 4, delta);
    target.current.y = THREE.MathUtils.damp(target.current.y, py, 4, delta);
    group.current.position.x = target.current.x;
    group.current.position.y = target.current.y;

    // Hover: smooth scale + emissive lift, eased return.
    const targetScale = hover ? 1.07 : 1;
    const cs = THREE.MathUtils.damp(group.current.scale.x, targetScale, 6, delta);
    group.current.scale.setScalar(cs);

    if (!reduce) {
      group.current.rotation.y += delta * 0.14;
      group.current.rotation.x = Math.sin(t * 0.2) * 0.18;
    }
    if (mat.current) {
      const baseDistort = reduce ? 0.32 : 0.32 + Math.sin(t * 0.6) * 0.08;
      mat.current.distort = baseDistort + (hover ? 0.06 : 0);
      mat.current.emissiveIntensity = THREE.MathUtils.damp(
        mat.current.emissiveIntensity,
        hover ? 0.95 : 0.5,
        5,
        delta
      );
    }
    if (wire.current) {
      wire.current.opacity = THREE.MathUtils.damp(wire.current.opacity, hover ? 0.34 : 0.16, 5, delta);
    }
  });

  return (
    <group ref={group}>
      <Float speed={reduce ? 0 : 1.4} rotationIntensity={0.3} floatIntensity={0.6}>
        <Icosahedron
          args={[1.35, 12]}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHover(true);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            setHover(false);
            document.body.style.cursor = "auto";
          }}
        >
          <MeshDistortMaterial
            ref={mat}
            color="#12325a"
            roughness={0.28}
            metalness={0.55}
            distort={0.32}
            speed={reduce ? 0 : 1.6}
            emissive="#0a2540"
            emissiveIntensity={0.5}
          />
        </Icosahedron>
        <Icosahedron args={[1.52, 2]} raycast={() => null}>
          <meshBasicMaterial ref={wire} color="#7bd0ff" wireframe transparent opacity={0.16} />
        </Icosahedron>
      </Float>
    </group>
  );
}

function useIsDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const on = () => setDesktop(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return desktop;
}

export default function Scene({ showLabels = true }: { showLabels?: boolean }) {
  const reduce = useReducedMotion() ?? false;
  const desktop = useIsDesktop();

  return (
    <Canvas
      dpr={[1, 1.8]}
      camera={{ position: [0, 0, 6], fov: 44 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: desktop ? "auto" : "none" }}
    >
      {/* Atmospheric depth cueing — far side of the orbit fades into the base color. */}
      <fog attach="fog" args={["#070b16", 5.5, 10]} />
      <Suspense fallback={null}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.4} color="#7bd0ff" />
        <directionalLight position={[-5, -3, 2]} intensity={0.9} color="#4edea3" />
        <pointLight position={[0, 0, 3]} intensity={1.1} color="#ffffff" />
        <Core reduce={reduce} />
        {desktop && showLabels && <Constellation reduce={reduce} />}
      </Suspense>
    </Canvas>
  );
}
