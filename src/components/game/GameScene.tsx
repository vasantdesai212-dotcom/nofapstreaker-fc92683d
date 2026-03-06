import { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sky, Environment } from '@react-three/drei';
import * as THREE from 'three';
import PorscheCar from './PorscheCar';
import Track from './Track';
import GameHUD from './GameHUD';

// ── Simple arcade car physics ──
interface CarState {
  pos: THREE.Vector3;
  rotation: number;
  speed: number;
  wheelAngle: number;
}

const INITIAL_STATE: CarState = {
  pos: new THREE.Vector3(0, 0.01, 28),
  rotation: 0,
  speed: 0,
  wheelAngle: 0,
};

const useKeyboard = () => {
  const keys = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const down = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = true; };
    const up = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);

    // Mobile touch controls
    const handleControl = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail.key === 'gas') { keys.current['w'] = detail.pressed; }
      if (detail.key === 'brake') { keys.current['s'] = detail.pressed; }
      if (detail.key === 'left') { keys.current['a'] = detail.pressed; }
      if (detail.key === 'right') { keys.current['d'] = detail.pressed; }
    };
    window.addEventListener('game-control', handleControl);

    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('game-control', handleControl);
    };
  }, []);
  return keys;
};

const CarController = ({ onUpdate }: { onUpdate: (speed: number, time: number) => void }) => {
  const keys = useKeyboard();
  const carState = useRef<CarState>({ ...INITIAL_STATE, pos: INITIAL_STATE.pos.clone() });
  const elapsed = useRef(0);
  const { camera } = useThree();

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05); // clamp for stability
    elapsed.current += dt;
    const car = carState.current;
    const k = keys.current;

    // ── Input ──
    const throttle = (k['w'] || k['arrowup']) ? 1 : 0;
    const brake = (k['s'] || k['arrowdown']) ? 1 : 0;
    const steerInput = ((k['a'] || k['arrowleft']) ? 1 : 0) - ((k['d'] || k['arrowright']) ? 1 : 0);
    const handbrake = k[' '] ? 1 : 0;

    // ── Physics ──
    const acceleration = 8;
    const brakeForce = 12;
    const drag = 2;
    const maxSpeed = 18;
    const steerSpeed = 2.5;
    const maxSteer = 0.6;

    // Acceleration
    car.speed += throttle * acceleration * dt;
    car.speed -= brake * brakeForce * dt;
    car.speed -= handbrake * brakeForce * 0.8 * dt;

    // Drag
    car.speed -= car.speed * drag * dt;

    // Clamp
    car.speed = THREE.MathUtils.clamp(car.speed, -maxSpeed * 0.3, maxSpeed);

    // Steering (only effective when moving)
    const speedFactor = Math.min(Math.abs(car.speed) / 3, 1);
    car.wheelAngle = THREE.MathUtils.lerp(car.wheelAngle, steerInput * maxSteer, steerSpeed * dt * 5);
    car.rotation += car.wheelAngle * car.speed * dt * 0.5 * speedFactor;

    // Position
    car.pos.x += Math.sin(car.rotation) * car.speed * dt;
    car.pos.z += Math.cos(car.rotation) * car.speed * dt;

    // Keep on ground
    car.pos.y = 0.01;

    // Boundary clamp
    car.pos.x = THREE.MathUtils.clamp(car.pos.x, -95, 95);
    car.pos.z = THREE.MathUtils.clamp(car.pos.z, -130, 95);

    // ── Camera follow ──
    const camDist = 6;
    const camHeight = 3;
    const idealPos = new THREE.Vector3(
      car.pos.x - Math.sin(car.rotation) * camDist,
      car.pos.y + camHeight,
      car.pos.z - Math.cos(car.rotation) * camDist,
    );
    camera.position.lerp(idealPos, 4 * dt);
    const lookTarget = new THREE.Vector3(
      car.pos.x + Math.sin(car.rotation) * 2,
      car.pos.y + 0.5,
      car.pos.z + Math.cos(car.rotation) * 2,
    );
    camera.lookAt(lookTarget);

    onUpdate(car.speed, elapsed.current);
  });

  return (
    <PorscheCar
      position={carState.current.pos}
      rotation={carState.current.rotation}
      speed={carState.current.speed}
      wheelAngle={carState.current.wheelAngle}
    />
  );
};

const GameScene = () => {
  const [speed, setSpeed] = useState(0);
  const [time, setTime] = useState(0);

  const handleUpdate = useCallback((s: number, t: number) => {
    setSpeed(s);
    setTime(t);
  }, []);

  const handleReset = useCallback(() => {
    // Reset is handled by remounting — simple approach
    window.location.hash = `#reset-${Date.now()}`;
    window.location.reload();
  }, []);

  return (
    <div className="relative w-full h-screen bg-background overflow-hidden">
      <GameHUD speed={speed} time={time} onReset={handleReset} />
      <Canvas
        shadows
        camera={{ fov: 60, near: 0.1, far: 500, position: [0, 5, 35] }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        <Sky sunPosition={[100, 50, 100]} turbidity={8} rayleigh={0.5} />
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[50, 50, 25]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={150}
          shadow-camera-left={-60}
          shadow-camera-right={60}
          shadow-camera-top={60}
          shadow-camera-bottom={-60}
        />
        <fog attach="fog" args={['#87CEEB', 80, 200]} />

        <Track />
        <CarController onUpdate={handleUpdate} />
      </Canvas>
    </div>
  );
};

export default GameScene;
