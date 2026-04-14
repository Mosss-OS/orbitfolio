import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Line, Html } from "@react-three/drei";
import * as THREE from "three";

function generateSpherePoints(count: number, radius: number) {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i < count; i++) {
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = 2 * Math.PI * Math.random();
    points.push(
      new THREE.Vector3(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      )
    );
  }
  return points;
}

function generateConnections(points: THREE.Vector3[], maxDist: number) {
  const connections: [THREE.Vector3, THREE.Vector3][] = [];
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      if (points[i].distanceTo(points[j]) < maxDist && connections.length < 120) {
        connections.push([points[i], points[j]]);
      }
    }
  }
  return connections;
}

const PROTOCOL_NODES = [
  { name: "Uniswap", color: "#FF007A", pos: [0.8, 1.2, 0.5] as [number, number, number] },
  { name: "Aave", color: "#B6509E", pos: [-1.0, 0.8, -0.6] as [number, number, number] },
  { name: "Lido", color: "#00A3FF", pos: [0.3, -1.0, 1.1] as [number, number, number] },
  { name: "Compound", color: "#00D395", pos: [-0.7, -0.5, -1.2] as [number, number, number] },
  { name: "Curve", color: "#FF6B6B", pos: [1.2, -0.3, -0.8] as [number, number, number] },
  { name: "MakerDAO", color: "#1AAB9B", pos: [-1.1, 0.2, 0.9] as [number, number, number] },
];

// Generate connections between protocol nodes
const PROTOCOL_CONNECTIONS: [number, number][] = [
  [0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [4, 5], [0, 4], [1, 5], [2, 3],
];

function ProtocolNode({ position, color, name }: { position: [number, number, number]; color: string; name: string }) {
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y += Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.001;
    }
  });

  return (
    <group>
      <mesh
        ref={ref}
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 2 : 0.8}
        />
      </mesh>
      <mesh position={position}>
        <ringGeometry args={[0.1, 0.14, 32]} />
        <meshBasicMaterial color={color} transparent opacity={hovered ? 0.6 : 0.2} side={THREE.DoubleSide} />
      </mesh>
      {hovered && (
        <Html position={position} center distanceFactor={5}>
          <div className="bg-background border border-border px-3 py-1.5 rounded-lg whitespace-nowrap shadow-sm">
            <span className="text-xs font-medium text-foreground">{name}</span>
          </div>
        </Html>
      )}
    </group>
  );
}

function ProtocolLines() {
  return (
    <>
      {PROTOCOL_CONNECTIONS.map(([i, j], idx) => (
        <Line
          key={`proto-line-${idx}`}
          points={[
            new THREE.Vector3(...PROTOCOL_NODES[i].pos),
            new THREE.Vector3(...PROTOCOL_NODES[j].pos),
          ]}
          color={PROTOCOL_NODES[i].color}
          transparent
          opacity={0.35}
          lineWidth={1.5}
        />
      ))}
      {/* Lines from center to each protocol node */}
      {PROTOCOL_NODES.map((node, idx) => (
        <Line
          key={`center-line-${idx}`}
          points={[
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(...node.pos),
          ]}
          color="#7c5cbf"
          transparent
          opacity={0.2}
          lineWidth={1}
        />
      ))}
    </>
  );
}

function GlobeWireframe() {
  const groupRef = useRef<THREE.Group>(null);

  const { points, connections } = useMemo(() => {
    const pts = generateSpherePoints(80, 1.6);
    const conns = generateConnections(pts, 0.8);
    return { points: pts, connections: conns };
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={groupRef}>
      <Sphere args={[1.58, 32, 32]}>
        <meshBasicMaterial color="#2d9d78" wireframe transparent opacity={0.08} />
      </Sphere>

      <Sphere args={[1.5, 32, 32]}>
        <meshStandardMaterial
          color="#f0f4f0"
          emissive="#2d9d78"
          emissiveIntensity={0.03}
          transparent
          opacity={0.15}
        />
      </Sphere>

      {points.map((point, i) => (
        <mesh key={i} position={point}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshBasicMaterial color="#2d9d78" transparent opacity={0.4} />
        </mesh>
      ))}

      {connections.map((conn, i) => (
        <Line
          key={i}
          points={[conn[0], conn[1]]}
          color="#2d9d78"
          transparent
          opacity={0.1}
          lineWidth={0.5}
        />
      ))}

      {/* Protocol nodes with connecting lines */}
      <ProtocolLines />

      {PROTOCOL_NODES.map((node) => (
        <ProtocolNode
          key={node.name}
          position={node.pos}
          color={node.color}
          name={node.name}
        />
      ))}

      {/* Center node */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial
          color="#7c5cbf"
          emissive="#7c5cbf"
          emissiveIntensity={1.2}
        />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <ringGeometry args={[0.16, 0.2, 32]} />
        <meshBasicMaterial color="#7c5cbf" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function CameraController() {
  return (
    <OrbitControls
      enablePan={false}
      enableZoom={true}
      minDistance={2.5}
      maxDistance={8}
      autoRotate
      autoRotateSpeed={0.3}
      rotateSpeed={0.5}
      zoomSpeed={0.8}
    />
  );
}

export default function Globe3D() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        style={{ background: "transparent" }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={0.6} color="#2d9d78" />
        <pointLight position={[-5, -3, 3]} intensity={0.3} color="#7c5cbf" />

        <GlobeWireframe />
        <CameraController />
      </Canvas>
    </div>
  );
}
