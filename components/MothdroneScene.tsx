/*
Design philosophy reminder: Swiss International Style adapted for aerospace technical review rooms. This component must keep the 3D viewport crisp, light-mode, fog-free, vignette-free, and aligned to the horizontal Z-axis engineering stack.
*/
"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Html as DreiHtml, OrbitControls, ContactShadows } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { animated as a, useSpring } from "@react-spring/three";
import * as THREE from "three";

type MothdroneSceneProps = {
  exploded: boolean;
  attack: boolean;
};

type LabelProps = {
  position: [number, number, number];
  title: string;
  meta: string;
  accent: string;
};

const MM_TO_UNIT = 0.01;
const GAP = 100 * MM_TO_UNIT;

function Annotation({ position, title, meta, accent }: LabelProps) {
  return (
    <DreiHtml position={position} center distanceFactor={7} zIndexRange={[20, 0]}>
      <div className="annotation-card" style={{ borderTop: `3px solid ${accent}` }}>
        <span className="annotation-title">{title}</span>
        <span className="annotation-meta">{meta}</span>
      </div>
    </DreiHtml>
  );
}

function CapacitorMatrix() {
  const capacitors = useMemo(() => {
    const points: Array<[number, number]> = [];
    for (let i = 0; i < 8; i += 1) {
      const angle = (i / 8) * Math.PI * 2;
      points.push([Math.cos(angle) * 0.38, Math.sin(angle) * 0.38]);
    }
    points.push([0, 0]);
    return points;
  }, []);

  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.58, 0.58, 2.0, 48, 1, true]} />
        <meshStandardMaterial color="#1a2a3a" metalness={0.15} roughness={0.38} transparent opacity={0.12} />
      </mesh>
      {capacitors.map(([x, y], index) => (
        <mesh key={`kvi-cap-${index}`} position={[x, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.105, 0.105, 1.78, 32]} />
          <meshStandardMaterial color="#00d4d4" metalness={0.72} roughness={0.14} envMapIntensity={1.8} />
        </mesh>
      ))}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.92]}>
        <cylinderGeometry args={[0.62, 0.62, 0.08, 64]} />
        <meshStandardMaterial color="#0f1a24" metalness={0.68} roughness={0.24} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.92]}>
        <cylinderGeometry args={[0.62, 0.62, 0.08, 64]} />
        <meshStandardMaterial color="#0f1a24" metalness={0.68} roughness={0.24} />
      </mesh>
    </group>
  );
}

function CopperShield() {
  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.68, 0.68, 0.05, 96]} />
        <meshStandardMaterial color="#d4a574" metalness={1} roughness={0.08} envMapIntensity={2.6} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.52, 0.012, 12, 96]} />
        <meshStandardMaterial color="#e8d4a8" metalness={1} roughness={0.06} envMapIntensity={3.0} />
      </mesh>
    </group>
  );
}

function AmplifiersAndFins() {
  const fins = useMemo(() => Array.from({ length: 16 }, (_, i) => (i / 16) * Math.PI * 2), []);
  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 1.45, 64]} />
        <meshStandardMaterial color="#c8d0d8" metalness={0.78} roughness={0.32} envMapIntensity={1.8} />
      </mesh>
      {fins.map((angle, index) => (
        <mesh
          key={`fin-${index}`}
          position={[Math.cos(angle) * 0.52, Math.sin(angle) * 0.52, 0]}
          rotation={[0, 0, angle]}
        >
          <boxGeometry args={[0.03, 0.24, 1.26]} />
          <meshStandardMaterial color="#d4dce4" metalness={0.74} roughness={0.38} envMapIntensity={1.6} />
        </mesh>
      ))}
      {[-0.42, 0, 0.42].map((z) => (
        <mesh key={`gan-band-${z}`} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, z]}>
          <torusGeometry args={[0.44, 0.014, 10, 96]} />
          <meshStandardMaterial color="#4a5a6a" metalness={0.72} roughness={0.32} />
        </mesh>
      ))}
    </group>
  );
}

function PhasedArray({ attack }: { attack: boolean }) {
  const traceMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ffd700",
        emissive: new THREE.Color("#ffed4e"),
        emissiveIntensity: attack ? 2.8 : 0.95,
        metalness: 0.9,
        roughness: 0.16,
      }),
    [attack],
  );

  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.64, 1.5, 6, 1, false]} />
        <meshStandardMaterial color="#d8d0c4" metalness={0.42} roughness={0.28} envMapIntensity={1.9} />
      </mesh>
      {[3.7, 4.02, 4.34, 4.66].map((z, index) => {
        const radius = Math.max(0.06, 0.64 * ((5.0 - z) / 1.5));
        return (
          <mesh key={`array-trace-${index}`} position={[0, 0, z - 4.25]}>
            <torusGeometry args={[radius, 0.012, 8, 96]} />
            <primitive object={traceMaterial} attach="material" />
          </mesh>
        );
      })}
      {Array.from({ length: 6 }, (_, index) => {
        const angle = (index / 6) * Math.PI * 2;
        return (
          <mesh
            key={`radial-trace-${index}`}
            position={[Math.cos(angle) * 0.2, Math.sin(angle) * 0.2, 0.28]}
            rotation={[0, 0, angle]}
          >
            <boxGeometry args={[0.012, 0.7, 0.018]} />
            <primitive object={traceMaterial} attach="material" />
          </mesh>
        );
      })}
      <mesh position={[0, 0, 0.75]}>
        <sphereGeometry args={[0.052, 32, 16]} />
        <meshStandardMaterial color="#fff3b0" emissive="#ffc94a" emissiveIntensity={attack ? 4.4 : 1.3} metalness={0.8} roughness={0.1} />
      </mesh>
    </group>
  );
}

function EnergyRail({ attack }: { attack: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const pulse = (Math.sin(clock.elapsedTime * 5) + 1) / 2;
    ref.current.scale.setScalar(attack ? 1 + pulse * 0.08 : 1);
  });
  return (
    <mesh ref={ref} position={[0, -0.84, 2.5]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.018, 0.018, 5.0, 16]} />
      <meshStandardMaterial color="#d6a629" emissive="#d6a629" emissiveIntensity={attack ? 1.2 : 0.35} metalness={0.65} roughness={0.22} />
    </mesh>
  );
}

function Shockwaves({ active }: { active: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, index) => {
      const mesh = child as THREE.Mesh;
      const material = mesh.material as THREE.MeshStandardMaterial;
      const travel = ((clock.elapsedTime * 1.65 + index * 0.72) % 4.8) / 4.8;
      mesh.position.z = 5.08 + travel * 4.9;
      const radius = 0.44 + travel * 1.08;
      mesh.scale.set(radius, radius, radius);
      material.opacity = active ? Math.max(0, 0.54 - travel * 0.46) : 0;
      material.emissiveIntensity = active ? 2.2 - travel * 1.2 : 0;
    });
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: 7 }, (_, index) => (
        <mesh key={`shockwave-${index}`}>
          <torusGeometry args={[0.72, 0.018, 16, 128]} />
          <meshStandardMaterial
            color="#00d4d4"
            emissive="#00ffff"
            emissiveIntensity={active ? 1.8 : 0}
            transparent
            opacity={0}
            depthWrite={false}
            metalness={0.15}
            roughness={0.12}
          />
        </mesh>
      ))}
    </group>
  );
}

function TierStack({ exploded, attack }: MothdroneSceneProps) {
  const springs = useSpring({
    tier1: 1.0,
    tier2: exploded ? 2.025 + GAP : 2.025,
    tier3: exploded ? 2.775 + GAP * 2 : 2.775,
    tier4: exploded ? 4.25 + GAP * 3 : 4.25,
    config: { mass: 1.1, tension: 220, friction: 18 },
  });

  return (
    <group position={[-2.5, 0, -2.5]}>
      <a.group position={springs.tier1.to((z) => [0, 0, z])}>
        <CapacitorMatrix />
        <Annotation position={[-1.68, 1.42, 0]} title="TIER 1 · KVI-3" meta="0–200mm · Glossy teal capacitor matrix" accent="#00d4d4" />
      </a.group>
      <a.group position={springs.tier2.to((z) => [0, 0, z])}>
        <CopperShield />
        <Annotation position={[1.92, 1.28, 0]} title="TIER 2 · EMI" meta="200–205mm · polished copper shield" accent="#d4a574" />
      </a.group>
      <a.group position={springs.tier3.to((z) => [0, 0, z])}>
        <AmplifiersAndFins />
        <Annotation position={[-1.88, -1.32, 0]} title="TIER 3 · GaN" meta="205–350mm · brushed aluminum fins" accent="#c8d0d8" />
      </a.group>
      <a.group position={springs.tier4.to((z) => [0, 0, z])}>
        <PhasedArray attack={attack} />
        <Annotation position={[2.08, -1.48, 0]} title="TIER 4 · ARRAY" meta="350–500mm · emissive gold phased aperture" accent="#ffd700" />
      </a.group>
      <EnergyRail attack={attack} />
      <Shockwaves active={attack} />
      <mesh position={[0, -0.98, 2.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 5.0, 10]} />
        <meshStandardMaterial color="#1d2529" metalness={0.2} roughness={0.5} />
      </mesh>
    </group>
  );
}

function SceneContents(props: MothdroneSceneProps) {
  return (
    <>
      <color attach="background" args={["#0a0e12"]} />
      <ambientLight intensity={0.32} />
      <directionalLight position={[-4, 5, -3]} intensity={0.88} color="#ffffff" />
      <directionalLight position={[5, 3, 7]} intensity={0.52} color="#00b4e8" />
      <TierStack {...props} />
      <ContactShadows position={[0, -1.15, 0]} opacity={0.28} scale={9} blur={1.1} far={3.2} color="#0a0e12" />
      <Environment preset="warehouse" />
      <OrbitControls enableDamping makeDefault minDistance={5.2} maxDistance={13} target={[0, 0, 0.35]} autoRotate autoRotateSpeed={0.8} />
      <EffectComposer multisampling={4} enableNormalPass={false}>
        <Bloom luminanceThreshold={0.78} intensity={0.72} mipmapBlur />
      </EffectComposer>
    </>
  );
}

export default function MothdroneScene({ exploded, attack }: MothdroneSceneProps) {
  return (
    <div className="h-full w-full">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [5.2, 2.8, 8.4], fov: 32, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <SceneContents exploded={exploded} attack={attack} />
        </Suspense>
      </Canvas>
    </div>
  );
}
