import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PorscheCarProps {
  position: THREE.Vector3;
  rotation: number;
  speed: number;
  wheelAngle: number;
}

const PorscheCar = ({ position, rotation, speed, wheelAngle }: PorscheCarProps) => {
  const groupRef = useRef<THREE.Group>(null!);
  const wheelRefs = useRef<THREE.Mesh[]>([]);
  const wheelRotation = useRef(0);

  // Build car body geometry procedurally (Porsche 911 GT3 RS silhouette)
  const bodyShape = useMemo(() => {
    const shape = new THREE.Shape();
    // Side profile — low-slung sports car
    shape.moveTo(-1.1, 0.15);
    shape.lineTo(-1.0, 0.15);
    shape.lineTo(-0.85, 0.35);
    shape.lineTo(-0.4, 0.55);
    shape.lineTo(-0.15, 0.65);
    shape.lineTo(0.3, 0.68);
    shape.lineTo(0.6, 0.6);
    shape.lineTo(0.85, 0.45);
    shape.lineTo(1.0, 0.35);
    shape.lineTo(1.1, 0.2);
    shape.lineTo(1.1, 0.15);
    shape.lineTo(-1.1, 0.15);
    return shape;
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.position.copy(position);
    groupRef.current.rotation.y = rotation;

    // Spin wheels based on speed
    wheelRotation.current += speed * delta * 5;
    wheelRefs.current.forEach((w) => {
      if (w) w.rotation.x = wheelRotation.current;
    });
  });

  const wheelGeom = useMemo(() => new THREE.CylinderGeometry(0.16, 0.16, 0.12, 16), []);
  const wheelMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#1a1a1a', roughness: 0.3, metalness: 0.8 }), []);
  const rimMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#c0c0c0', roughness: 0.2, metalness: 0.9 }), []);

  const wheelPositions: [number, number, number][] = [
    [-0.7, 0.16, 0.45],
    [-0.7, 0.16, -0.45],
    [0.7, 0.16, 0.45],
    [0.7, 0.16, -0.45],
  ];

  return (
    <group ref={groupRef}>
      {/* Main body — extruded side profile */}
      <mesh position={[0, 0, 0]} castShadow>
        <extrudeGeometry args={[bodyShape, { depth: 0.85, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 3 }]} />
        <meshStandardMaterial color="#e8e8e8" roughness={0.15} metalness={0.85} />
      </mesh>

      {/* Roof scoop / air intake */}
      <mesh position={[0.3, 0.7, 0.42]} castShadow>
        <boxGeometry args={[0.15, 0.06, 0.25]} />
        <meshStandardMaterial color="#222" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Rear wing */}
      <group position={[-0.95, 0.55, 0.42]}>
        <mesh castShadow>
          <boxGeometry args={[0.06, 0.02, 0.9]} />
          <meshStandardMaterial color="#333" roughness={0.3} metalness={0.7} />
        </mesh>
        {/* Wing supports */}
        <mesh position={[0, -0.1, 0.3]}>
          <boxGeometry args={[0.03, 0.2, 0.03]} />
          <meshStandardMaterial color="#333" roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh position={[0, -0.1, -0.3]}>
          <boxGeometry args={[0.03, 0.2, 0.03]} />
          <meshStandardMaterial color="#333" roughness={0.3} metalness={0.7} />
        </mesh>
      </group>

      {/* Front splitter */}
      <mesh position={[1.05, 0.12, 0.42]} castShadow>
        <boxGeometry args={[0.12, 0.03, 0.9]} />
        <meshStandardMaterial color="#222" roughness={0.5} metalness={0.5} />
      </mesh>

      {/* Headlights */}
      <mesh position={[1.05, 0.32, 0.15]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#ffffcc" emissive="#ffffaa" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[1.05, 0.32, 0.7]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#ffffcc" emissive="#ffffaa" emissiveIntensity={0.5} />
      </mesh>

      {/* Taillights */}
      <mesh position={[-1.05, 0.28, 0.15]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshStandardMaterial color="#ff2222" emissive="#ff0000" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[-1.05, 0.28, 0.7]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshStandardMaterial color="#ff2222" emissive="#ff0000" emissiveIntensity={0.6} />
      </mesh>

      {/* Windshield */}
      <mesh position={[0.45, 0.55, 0.42]} rotation={[0, 0, 0.3]}>
        <planeGeometry args={[0.45, 0.75]} />
        <meshStandardMaterial color="#111122" transparent opacity={0.7} roughness={0.1} metalness={0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* Wheels */}
      {wheelPositions.map((pos, i) => (
        <group key={i} position={pos} rotation={[0, 0, Math.PI / 2]}>
          <group rotation={i < 2 ? [0, 0, 0] : [0, wheelAngle, 0]}>
            <mesh
              ref={(el) => { if (el) wheelRefs.current[i] = el; }}
              geometry={wheelGeom}
              material={wheelMat}
              castShadow
            />
            {/* Rim detail */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 0.13, 5]} />
              <meshStandardMaterial {...rimMat} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
};

export default PorscheCar;
