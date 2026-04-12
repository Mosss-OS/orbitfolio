import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Sphere, Line, Html } from "@react-three/drei";
import * as THREE from "three";

// Generate points on a sphere surface
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

// Generate connections between nearby points
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

// Protocol nodes floating inside/around the globe
const PROTOCOL_NODES = [
  { name: "Uniswap", color: "#FF007A", pos: [0.8, 1.2, 0.5] },
  { name: "Aave", color: "#B6509E", pos: [-1.0, 0.8, -0.6] },
  { name: "Lido", color: "#00A3FF", pos: [0.3, -1.0, 1.1] },
  { name: "Compound", color: "#00D395", pos: [-0.7, -0.5, -1.2] },
  { name: "Curve", color: "#FF6B6B", pos: [1.2, -0.3, -0.8] },
  { name: "MakerDAO", color: "#1AAB9B", pos: [-1.1, 0.2, 0.9] },
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
      {/* Glow ring */}
      <mesh position={position}>
        <ringGeometry args={[0.1, 0.14, 32]} />
        <meshBasicMaterial color={color} transparent opacity={hovered ? 0.6 : 0.2} side={THREE.DoubleSide} />
      </mesh>
      {hovered && (
        <Html position={position} center distanceFactor={5}>
          <div className="bg-card/90 backdrop-blur-sm border border-border px-3 py-1.5 rounded-lg whitespace-nowrap">
            <span className="text-xs font-medium text-foreground">{name}</span>
          </div>
        </Html>
      )}
    </group>
  );
}

function GlobeWireframe() {
  const groupRef = useRef<THREE.Group>(null);

  const { points, connections } = useMemo(() => {
    const pts = generateSpherePoints(80, 1.6);
    const conns = generateConnections(pts, 0.8);
    return { points: pts, connections: conns };
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Wireframe sphere */}
      <Sphere args={[1.58, 32, 32]}>
        <meshBasicMaterial color="#0ea5e9" wireframe transparent opacity={0.06} />
      </Sphere>

      {/* Inner glow sphere */}
      <Sphere args={[1.5, 32, 32]}>
        <meshStandardMaterial
          color="#050a14"
          emissive="#0ea5e9"
          emissiveIntensity={0.05}
          transparent
          opacity={0.3}
        />
      </Sphere>

      {/* Network points */}
      {points.map((point, i) => (
        <mesh key={i} position={point}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshBasicMaterial color="#0ea5e9" transparent opacity={0.5} />
        </mesh>
      ))}

      {/* Network connections */}
      {connections.map((conn, i) => (
        <Line
          key={i}
          points={[conn[0], conn[1]]}
          color="#0ea5e9"
          transparent
          opacity={0.12}
          lineWidth={0.5}
        />
      ))}

      {/* Protocol nodes */}
      {PROTOCOL_NODES.map((node) => (
        <ProtocolNode
          key={node.name}
          position={node.pos as [number, number, number]}
          color={node.color}
          name={node.name}
        />
      ))}

      {/* Center wallet node */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={1.2}
        />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <ringGeometry args={[0.16, 0.2, 32]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Stars() {
  const starsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return pos;
  }, []);

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={2000}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#ffffff" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

function CameraController() {
  const { camera } = useThree();
  useFrame(() => {
    // Subtle auto-movement
  });
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
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={0.8} color="#0ea5e9" />
        <pointLight position={[-5, -3, 3]} intensity={0.4} color="#8b5cf6" />

        <Stars />
        <GlobeWireframe />
        <CameraController />
      </Canvas>
    </div>
  );
}
