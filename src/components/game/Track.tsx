import { useMemo } from 'react';
import * as THREE from 'three';

/** Simple open-world demo environment: ground plane, road loop, buildings, trees */
const Track = () => {
  const roadTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, 256, 256);
    // Center line
    ctx.strokeStyle = '#ffcc00';
    ctx.lineWidth = 4;
    ctx.setLineDash([20, 15]);
    ctx.beginPath();
    ctx.moveTo(128, 0);
    ctx.lineTo(128, 256);
    ctx.stroke();
    // Edge lines
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(20, 0); ctx.lineTo(20, 256);
    ctx.moveTo(236, 0); ctx.lineTo(236, 256);
    ctx.stroke();
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 8);
    return tex;
  }, []);

  // Road segments forming a loop
  const roadSegments: { pos: [number, number, number]; rot: number; len: number }[] = [
    { pos: [0, 0.01, 0], rot: 0, len: 60 },
    { pos: [30, 0.01, -35], rot: Math.PI / 2, len: 70 },
    { pos: [0, 0.01, -70], rot: 0, len: 60 },
    { pos: [-30, 0.01, -35], rot: Math.PI / 2, len: 70 },
  ];

  // Simple buildings
  const buildings: { pos: [number, number, number]; size: [number, number, number]; color: string }[] = [
    { pos: [15, 3, 10], size: [6, 6, 6], color: '#555566' },
    { pos: [-15, 4, 10], size: [8, 8, 5], color: '#556655' },
    { pos: [20, 2.5, -80], size: [5, 5, 7], color: '#665555' },
    { pos: [-20, 5, -80], size: [7, 10, 7], color: '#555577' },
    { pos: [25, 3, -40], size: [4, 6, 4], color: '#666' },
    { pos: [-25, 4, -30], size: [6, 8, 6], color: '#556' },
    { pos: [18, 2, -55], size: [5, 4, 5], color: '#665' },
    { pos: [-22, 3.5, -60], size: [7, 7, 5], color: '#577' },
  ];

  // Trees
  const trees: [number, number, number][] = [
    [10, 0, 20], [-10, 0, 20], [35, 0, -20], [-35, 0, -15],
    [12, 0, -90], [-12, 0, -90], [38, 0, -55], [-38, 0, -50],
    [8, 0, -30], [-8, 0, -45], [28, 0, 5], [-28, 0, -75],
  ];

  return (
    <group>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, -35]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#2a5c2a" roughness={0.9} />
      </mesh>

      {/* Ocean/water on edges */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, -35]}>
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial color="#1a3a5c" roughness={0.3} metalness={0.4} />
      </mesh>

      {/* Road segments */}
      {roadSegments.map((seg, i) => (
        <mesh key={i} position={seg.pos} rotation={[-Math.PI / 2, 0, seg.rot]} receiveShadow>
          <planeGeometry args={[8, seg.len]} />
          <meshStandardMaterial map={roadTexture} roughness={0.7} />
        </mesh>
      ))}

      {/* Buildings */}
      {buildings.map((b, i) => (
        <mesh key={`b${i}`} position={b.pos} castShadow receiveShadow>
          <boxGeometry args={b.size} />
          <meshStandardMaterial color={b.color} roughness={0.8} />
        </mesh>
      ))}

      {/* Trees (simple cone + cylinder) */}
      {trees.map((pos, i) => (
        <group key={`t${i}`} position={pos}>
          <mesh position={[0, 1.2, 0]} castShadow>
            <coneGeometry args={[1.2, 2.5, 6]} />
            <meshStandardMaterial color="#1a6b1a" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.3, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.2, 0.6, 6]} />
            <meshStandardMaterial color="#5a3a1a" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Checkpoints (orange poles) */}
      {[
        [4, 0, 25] as [number, number, number],
        [-4, 0, 25] as [number, number, number],
        [4, 0, -95] as [number, number, number],
        [-4, 0, -95] as [number, number, number],
      ].map((pos, i) => (
        <mesh key={`cp${i}`} position={[pos[0], 1.5, pos[2]]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 3, 8]} />
          <meshStandardMaterial color="#ff6600" emissive="#ff4400" emissiveIntensity={0.3} />
        </mesh>
      ))}
    </group>
  );
};

export default Track;
