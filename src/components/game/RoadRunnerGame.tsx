import { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowLeft, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Freedom Drive — pseudo-3D endless driving game.
 * Rendered with HTML5 Canvas using classic projection (Lou's Pseudo-3D approach).
 * The car is drawn from a true third-person rear view; the world rushes toward the camera.
 */

interface Segment {
  index: number;
  curve: number;
  worldY: number; // ground y (kept 0 for flat road)
  color: { road: string; grass: string; rumble: string; lane: string };
  cars: TrafficCar[];
  // projected (filled per-frame)
  p1?: Projected;
  p2?: Projected;
  clip?: number;
}

interface Projected {
  x: number; y: number; z: number; // camera space
  screenX: number; screenY: number; screenW: number; screenScale: number;
}

interface TrafficCar {
  offset: number; // -1..1 across road
  z: number; // world z position (in segments)
  speed: number; // segments per second (~world units)
  color: string;
  kind: 'sedan' | 'truck' | 'van';
  alive: boolean;
}

const SEG_LENGTH = 200;
const RUMBLE_LENGTH = 3;
const ROAD_WIDTH = 2000;
const LANES = 3;
const DRAW_DISTANCE = 220;
const FIELD_OF_VIEW = 100;
const CAMERA_HEIGHT = 1000;
const FOG_DENSITY = 5;
const MAX_SPEED = SEG_LENGTH * 60; // top speed
const ACCEL = MAX_SPEED / 8;
const OFF_ROAD_DECEL = -MAX_SPEED / 2;
const CENTRIFUGAL = 0.3;

const COLORS = {
  SKY_TOP: '#0b1d3a',
  SKY_BOT: '#ffb37a',
  MOUNTAIN: '#2a3b5c',
  MOUNTAIN_FAR: '#3d4f73',
  HILL: '#2d6a3f',
  LIGHT: {
    road: '#5a5a62',
    grass: '#2f8a3f',
    rumble: '#ffffff',
    lane: '#ffffff',
  },
  DARK: {
    road: '#525258',
    grass: '#2a7d39',
    rumble: '#bb2727',
    lane: '#525258',
  },
  START: { road: '#fff', grass: '#fff', rumble: '#fff', lane: '#fff' },
  FINISH: { road: '#000', grass: '#000', rumble: '#000', lane: '#000' },
};

interface RoadRunnerGameProps {
  onExit: () => void;
  streakDays?: number;
}

const RoadRunnerGame = ({ onExit, streakDays = 0 }: RoadRunnerGameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const keysRef = useRef<Record<string, boolean>>({});

  // Game state (refs so the loop doesn't re-create)
  const segmentsRef = useRef<Segment[]>([]);
  const positionRef = useRef(0); // car z-position along track
  const playerXRef = useRef(0); // -1..1 across road
  const speedRef = useRef(0);
  const skyOffsetRef = useRef(0);
  const mountainOffsetRef = useRef(0);
  const hillOffsetRef = useRef(0);
  const livesRef = useRef(3);
  const distanceRef = useRef(0);
  const wheelSpinRef = useRef(0);
  const shakeRef = useRef(0);
  const invulnRef = useRef(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const engineNodesRef = useRef<{ osc: OscillatorNode; gain: GainNode } | null>(null);

  const [phase, setPhase] = useState<'start' | 'playing' | 'gameover'>('start');
  const [hud, setHud] = useState({ distance: 0, speed: 0, lives: 3 });

  // ── Build track ──
  const buildTrack = useCallback(() => {
    const segs: Segment[] = [];
    const addSegment = (curve: number) => {
      const n = segs.length;
      segs.push({
        index: n,
        curve,
        worldY: 0,
        color: Math.floor(n / RUMBLE_LENGTH) % 2 ? COLORS.DARK : COLORS.LIGHT,
        cars: [],
      });
    };
    const addRoad = (enter: number, hold: number, leave: number, curve: number) => {
      const easeIn = (a: number, b: number, p: number) => a + (b - a) * (p * p);
      const easeInOut = (a: number, b: number, p: number) =>
        a + (b - a) * (-Math.cos(p * Math.PI) / 2 + 0.5);
      const easeOut = (a: number, b: number, p: number) => a + (b - a) * (1 - (1 - p) * (1 - p));
      for (let i = 0; i < enter; i++) addSegment(easeIn(0, curve, i / enter));
      for (let i = 0; i < hold; i++) addSegment(curve);
      for (let i = 0; i < leave; i++) addSegment(easeInOut(curve, 0, i / leave));
    };

    // Mix of straights and curves
    addRoad(50, 50, 50, 0);
    for (let i = 0; i < 30; i++) {
      const curve = (Math.random() - 0.5) * 6;
      addRoad(30, 50, 30, curve);
      addRoad(20, 20, 20, 0);
    }

    segmentsRef.current = segs;
  }, []);

  // ── Spawn traffic ──
  const spawnTraffic = useCallback(() => {
    const segs = segmentsRef.current;
    const colors = ['#1e88e5', '#fbc02d', '#43a047', '#8e24aa', '#e53935', '#fb8c00'];
    const kinds: TrafficCar['kind'][] = ['sedan', 'sedan', 'truck', 'van'];
    for (let i = 0; i < 80; i++) {
      const segIndex = 100 + Math.floor(Math.random() * (segs.length - 200));
      const seg = segs[segIndex];
      if (!seg) continue;
      const offset = (Math.floor(Math.random() * LANES) - 1) * 0.6;
      const kind = kinds[Math.floor(Math.random() * kinds.length)];
      seg.cars.push({
        offset,
        z: segIndex * SEG_LENGTH + Math.random() * SEG_LENGTH,
        speed: SEG_LENGTH * (10 + Math.random() * 15),
        color: colors[Math.floor(Math.random() * colors.length)],
        kind,
        alive: true,
      });
    }
  }, []);

  // ── Audio (engine hum) ──
  const startEngine = useCallback(() => {
    try {
      if (engineNodesRef.current) return;
      const ctx = audioCtxRef.current ?? new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.value = 60;
      const gain = ctx.createGain();
      gain.gain.value = 0.02;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 400;
      osc.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
      osc.start();
      engineNodesRef.current = { osc, gain };
    } catch {/* audio optional */}
  }, []);

  const stopEngine = useCallback(() => {
    try {
      engineNodesRef.current?.osc.stop();
      engineNodesRef.current?.osc.disconnect();
      engineNodesRef.current = null;
    } catch {/* */}
  }, []);

  const playCrash = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.4);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.15, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.connect(g); g.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.4);
  }, []);

  // ── Game start / reset ──
  const startGame = useCallback(() => {
    buildTrack();
    spawnTraffic();
    positionRef.current = 0;
    playerXRef.current = 0;
    speedRef.current = 0;
    livesRef.current = 3;
    distanceRef.current = 0;
    shakeRef.current = 0;
    invulnRef.current = 0;
    setHud({ distance: 0, speed: 0, lives: 3 });
    setPhase('playing');
    startEngine();
  }, [buildTrack, spawnTraffic, startEngine]);

  // ── Input ──
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = true;
      if (phase === 'start' && (e.key === ' ' || e.key === 'Enter')) startGame();
    };
    const up = (e: KeyboardEvent) => { keysRef.current[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [phase, startGame]);

  // ── Touch controls (exposed on the JSX) ──
  const setTouch = (key: string, pressed: boolean) => {
    keysRef.current[key] = pressed;
  };

  // ── Resize canvas ──
  useEffect(() => {
    const handleResize = () => {
      const c = canvasRef.current;
      if (!c) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = c.clientWidth * dpr;
      c.height = c.clientHeight * dpr;
      const ctx = c.getContext('2d');
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ── Main render loop ──
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;

    const project = (
      p: { x: number; y: number; z: number; camera: { x: number; y: number; z: number } },
      width: number,
      height: number,
      cameraDepth: number,
      roadWidth: number,
    ): Projected => {
      const camX = p.x - p.camera.x;
      const camY = p.y - p.camera.y;
      const camZ = p.z - p.camera.z;
      const scale = cameraDepth / Math.max(camZ, 1);
      const screenX = Math.round(width / 2 + (scale * camX * width) / 2);
      const screenY = Math.round(height / 2 - (scale * camY * height) / 2);
      const screenW = Math.round((scale * roadWidth * width) / 2);
      return { x: camX, y: camY, z: camZ, screenX, screenY, screenW, screenScale: scale };
    };

    const drawPolygon = (
      x1: number, y1: number, x2: number, y2: number,
      x3: number, y3: number, x4: number, y4: number, color: string,
    ) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x3, y3); ctx.lineTo(x4, y4);
      ctx.closePath(); ctx.fill();
    };

    const drawSegment = (
      width: number,
      lanes: number,
      x1: number, y1: number, w1: number,
      x2: number, y2: number, w2: number,
      color: Segment['color'],
    ) => {
      const r1 = w1 / Math.max(6, 2 * lanes);
      const r2 = w2 / Math.max(6, 2 * lanes);
      const l1 = w1 / Math.max(32, 8 * lanes);
      const l2 = w2 / Math.max(32, 8 * lanes);
      // Grass
      ctx.fillStyle = color.grass;
      ctx.fillRect(0, y2, width, y1 - y2);
      // Road
      drawPolygon(x1 - w1, y1, x1 + w1, y1, x2 + w2, y2, x2 - w2, y2, color.road);
      // Rumble strips
      drawPolygon(x1 - w1 - r1, y1, x1 - w1, y1, x2 - w2, y2, x2 - w2 - r2, y2, color.rumble);
      drawPolygon(x1 + w1 + r1, y1, x1 + w1, y1, x2 + w2, y2, x2 + w2 + r2, y2, color.rumble);
      // Lane lines
      if (color.lane !== color.road) {
        const lanew1 = (w1 * 2) / lanes;
        const lanew2 = (w2 * 2) / lanes;
        let lx1 = x1 - w1 + lanew1;
        let lx2 = x2 - w2 + lanew2;
        for (let i = 1; i < lanes; i++) {
          drawPolygon(lx1 - l1 / 2, y1, lx1 + l1 / 2, y1, lx2 + l2 / 2, y2, lx2 - l2 / 2, y2, color.lane);
          lx1 += lanew1; lx2 += lanew2;
        }
      }
    };

    const drawSky = (width: number, height: number) => {
      const horizon = height * 0.55;
      const grad = ctx.createLinearGradient(0, 0, 0, horizon);
      // Smooth navy → indigo → warm peach/amber
      grad.addColorStop(0, '#06122b');
      grad.addColorStop(0.25, '#1a2a55');
      grad.addColorStop(0.55, '#6b4a7a');
      grad.addColorStop(0.8, '#e89466');
      grad.addColorStop(1, '#ffc28a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, horizon);
      // Sun
      ctx.fillStyle = 'rgba(255, 230, 180, 0.9)';
      ctx.beginPath();
      ctx.arc(width * 0.7, horizon - 20, 35, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 200, 140, 0.25)';
      ctx.beginPath();
      ctx.arc(width * 0.7, horizon - 20, 70, 0, Math.PI * 2);
      ctx.fill();
      // Clouds
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      const cloudOff = (skyOffsetRef.current * 8) % width;
      for (let i = 0; i < 4; i++) {
        const cx = ((i * width) / 4 - cloudOff + width) % width;
        const cy = horizon - 70 - i * 12;
        ctx.beginPath();
        ctx.arc(cx, cy, 14, 0, Math.PI * 2);
        ctx.arc(cx + 16, cy + 4, 18, 0, Math.PI * 2);
        ctx.arc(cx + 36, cy, 14, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawMountains = (width: number, height: number) => {
      const horizon = height * 0.55;
      // far mountains
      ctx.fillStyle = COLORS.MOUNTAIN_FAR;
      ctx.beginPath();
      ctx.moveTo(0, horizon);
      const off1 = mountainOffsetRef.current * 0.5;
      for (let x = 0; x <= width; x += 40) {
        const y = horizon - 40 - Math.abs(Math.sin((x + off1) * 0.01)) * 50;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, horizon); ctx.closePath(); ctx.fill();
      // near mountains
      ctx.fillStyle = COLORS.MOUNTAIN;
      ctx.beginPath();
      ctx.moveTo(0, horizon);
      const off2 = mountainOffsetRef.current * 1.2;
      for (let x = 0; x <= width; x += 30) {
        const y = horizon - 25 - Math.abs(Math.sin((x + off2) * 0.015)) * 30;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, horizon); ctx.closePath(); ctx.fill();
      // hills
      ctx.fillStyle = COLORS.HILL;
      ctx.beginPath();
      ctx.moveTo(0, horizon);
      const off3 = hillOffsetRef.current * 2.5;
      for (let x = 0; x <= width; x += 25) {
        const y = horizon - 12 - Math.abs(Math.sin((x + off3) * 0.02)) * 18;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, horizon); ctx.closePath(); ctx.fill();
    };

    const drawSprite = (
      car: TrafficCar,
      seg: Segment,
      width: number,
      cameraDepth: number,
      roadWidth: number,
    ) => {
      if (!seg.p1 || !seg.p2) return;
      const spriteScale = seg.p1.screenScale;
      const sx = seg.p1.screenX + spriteScale * car.offset * roadWidth * width / 2;
      const sy = seg.p1.screenY;
      const w = Math.max(20, spriteScale * 400 * width);
      const h = w * (car.kind === 'truck' ? 1.1 : car.kind === 'van' ? 0.9 : 0.7);
      drawCarSprite(ctx, sx, sy, w, h, car.color, car.kind, 0);
    };

    const loop = (t: number) => {
      const c2 = canvasRef.current;
      if (!c2) return;
      const dt = Math.min(0.05, (t - lastTimeRef.current) / 1000 || 0.016);
      lastTimeRef.current = t;
      const width = c2.clientWidth;
      const height = c2.clientHeight;

      // Update
      if (phase === 'playing') {
        const k = keysRef.current;
        const segs = segmentsRef.current;
        const trackLength = segs.length * SEG_LENGTH;
        const posSeg = segs[Math.floor(positionRef.current / SEG_LENGTH) % segs.length];
        const speedPercent = speedRef.current / MAX_SPEED;
        const dx = dt * 2 * speedPercent;

        // Always accelerate (endless runner)
        speedRef.current = Math.min(MAX_SPEED, speedRef.current + ACCEL * dt);

        // Steering
        if (k['arrowleft'] || k['a']) playerXRef.current -= dx;
        if (k['arrowright'] || k['d']) playerXRef.current += dx;
        // Centrifugal force on curves
        playerXRef.current -= dx * speedPercent * (posSeg?.curve ?? 0) * CENTRIFUGAL;

        // Off-road penalty
        if ((playerXRef.current < -1 || playerXRef.current > 1) && speedRef.current > MAX_SPEED / 4) {
          speedRef.current = Math.max(MAX_SPEED / 4, speedRef.current + OFF_ROAD_DECEL * dt);
        }
        playerXRef.current = Math.max(-2, Math.min(2, playerXRef.current));

        // Advance
        positionRef.current = (positionRef.current + speedRef.current * dt) % trackLength;
        distanceRef.current += (speedRef.current * dt) / 1000; // arbitrary km scale
        wheelSpinRef.current += speedRef.current * dt * 0.001;
        skyOffsetRef.current += dt * speedPercent;
        mountainOffsetRef.current += dt * speedPercent * (posSeg?.curve ?? 0);
        hillOffsetRef.current += dt * speedPercent * (posSeg?.curve ?? 0) * 2;
        if (shakeRef.current > 0) shakeRef.current = Math.max(0, shakeRef.current - dt * 4);
        if (invulnRef.current > 0) invulnRef.current = Math.max(0, invulnRef.current - dt);

        // Engine pitch
        if (engineNodesRef.current) {
          const tgt = 60 + speedPercent * 200;
          engineNodesRef.current.osc.frequency.setTargetAtTime(tgt, audioCtxRef.current!.currentTime, 0.05);
        }

        // Collision detection (only nearby segments)
        if (invulnRef.current <= 0) {
          const playerSegIdx = Math.floor(positionRef.current / SEG_LENGTH) % segs.length;
          for (let i = 0; i < 5; i++) {
            const idx = (playerSegIdx + i) % segs.length;
            const seg = segs[idx];
            for (const car of seg.cars) {
              if (!car.alive) continue;
              const carZ = car.z;
              const dz = carZ - positionRef.current;
              if (dz > -SEG_LENGTH * 0.5 && dz < SEG_LENGTH * 2) {
                if (Math.abs(playerXRef.current - car.offset) < 0.5 && Math.abs(dz) < SEG_LENGTH) {
                  livesRef.current -= 1;
                  speedRef.current = MAX_SPEED * 0.25;
                  shakeRef.current = 0.5;
                  invulnRef.current = 1.5;
                  playCrash();
                  if (livesRef.current <= 0) {
                    setPhase('gameover');
                    stopEngine();
                  }
                  break;
                }
              }
            }
          }
        }

        setHud({
          distance: distanceRef.current,
          speed: Math.round(speedPercent * 240),
          lives: livesRef.current,
        });
      }

      // Render
      ctx.clearRect(0, 0, width, height);
      drawSky(width, height);
      drawMountains(width, height);

      if (phase !== 'start') {
        const segs = segmentsRef.current;
        const trackLength = segs.length * SEG_LENGTH;
        const cameraDepth = 1 / Math.tan(((FIELD_OF_VIEW / 2) * Math.PI) / 180);
        const baseSegIdx = Math.floor(positionRef.current / SEG_LENGTH) % segs.length;
        const baseSeg = segs[baseSegIdx];
        const baseSegPercent = (positionRef.current % SEG_LENGTH) / SEG_LENGTH;

        let maxY = height;
        let x = 0;
        let dx = -(baseSeg.curve * baseSegPercent);

        const cameraX = playerXRef.current * ROAD_WIDTH;
        const cameraY = CAMERA_HEIGHT;
        const cameraZ = positionRef.current - SEG_LENGTH;

        const shakeX = shakeRef.current ? (Math.random() - 0.5) * 12 * shakeRef.current : 0;
        const shakeY = shakeRef.current ? (Math.random() - 0.5) * 12 * shakeRef.current : 0;
        ctx.save();
        ctx.translate(shakeX, shakeY);

        for (let n = 0; n < DRAW_DISTANCE; n++) {
          const segIdx = (baseSegIdx + n) % segs.length;
          const seg = segs[segIdx];
          const looped = segIdx < baseSegIdx;
          // Project two endpoints
          seg.p1 = project(
            { x: x - cameraX, y: 0, z: seg.index * SEG_LENGTH - (looped ? trackLength : 0) - cameraZ, camera: { x: 0, y: 0, z: 0 } },
            width, height, cameraDepth, ROAD_WIDTH,
          );
          seg.p2 = project(
            { x: x + dx - cameraX, y: 0, z: (seg.index + 1) * SEG_LENGTH - (looped ? trackLength : 0) - cameraZ, camera: { x: 0, y: 0, z: 0 } },
            width, height, cameraDepth, ROAD_WIDTH,
          );
          x += dx;
          dx += seg.curve;

          if (seg.p1.z <= cameraDepth || seg.p2.screenY >= maxY) continue;
          drawSegment(
            width, LANES,
            seg.p1.screenX, seg.p1.screenY, seg.p1.screenW,
            seg.p2.screenX, seg.p2.screenY, seg.p2.screenW,
            seg.color,
          );
          maxY = seg.p2.screenY;
        }

        // Fog overlay near horizon
        const horizon = height * 0.55;
        const fogGrad = ctx.createLinearGradient(0, horizon, 0, horizon + 80);
        fogGrad.addColorStop(0, 'rgba(255,179,122,0.7)');
        fogGrad.addColorStop(1, 'rgba(255,179,122,0)');
        ctx.fillStyle = fogGrad;
        ctx.fillRect(0, horizon, width, 80);

        // Roadside trees & objects (drawn per-segment from far to near)
        for (let n = DRAW_DISTANCE - 1; n >= 0; n--) {
          const segIdx = (baseSegIdx + n) % segs.length;
          const seg = segs[segIdx];
          if (!seg.p1) continue;
          if (seg.p1.screenScale <= 0) continue;
          // Deterministic per-segment props
          const r = ((seg.index * 9301 + 49297) % 233280) / 233280;
          if (r < 0.35) {
            drawTree(ctx, seg.p1.screenX - seg.p1.screenW - 30 - seg.p1.screenScale * 1500 * (r * 3), seg.p1.screenY, seg.p1.screenScale, r < 0.18 ? 'pine' : 'leafy');
          }
          if (r > 0.6) {
            drawTree(ctx, seg.p1.screenX + seg.p1.screenW + 30 + seg.p1.screenScale * 1500 * ((1 - r) * 3), seg.p1.screenY, seg.p1.screenScale, r > 0.85 ? 'pine' : 'leafy');
          }
          // Occasional billboards / signs
          if (seg.index % 80 === 0) {
            drawSign(ctx, seg.p1.screenX + seg.p1.screenW + 60 + seg.p1.screenScale * 500, seg.p1.screenY, seg.p1.screenScale);
          }
          // Traffic cars on this segment
          for (const car of seg.cars) {
            if (!car.alive) continue;
            drawSprite(car, seg, width, cameraDepth, ROAD_WIDTH);
          }
        }

        // Player car (third-person, fixed near bottom)
        const carCx = width / 2;
        const carCy = height * 0.82;
        const carW = Math.min(width * 0.28, 260);
        const carH = carW * 0.62;
        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.beginPath();
        ctx.ellipse(carCx, carCy + carH * 0.45, carW * 0.45, carH * 0.12, 0, 0, Math.PI * 2);
        ctx.fill();
        // Speed lines
        if (speedRef.current > MAX_SPEED * 0.4) {
          ctx.strokeStyle = `rgba(255,255,255,${Math.min(0.5, (speedRef.current / MAX_SPEED) * 0.5)})`;
          ctx.lineWidth = 2;
          for (let i = 0; i < 14; i++) {
            const lx = (Math.random() * width);
            const ly = horizon + Math.random() * (height - horizon);
            ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx, ly + 30); ctx.stroke();
          }
        }
        const flicker = invulnRef.current > 0 && Math.floor(t / 80) % 2 === 0 ? 0.4 : 1;
        ctx.globalAlpha = flicker;
        drawPlayerCar(ctx, carCx, carCy, carW, carH, wheelSpinRef.current);
        ctx.globalAlpha = 1;

        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [phase, playCrash, stopEngine]);

  // Cleanup audio on unmount
  useEffect(() => () => { stopEngine(); audioCtxRef.current?.close().catch(() => {}); }, [stopEngine]);

  return (
    <div className="fixed inset-0 bg-black z-50 select-none">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* HUD */}
      {phase === 'playing' && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="flex items-start justify-between p-3">
            <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur text-white font-mono text-sm font-bold border border-white/10">
              {hud.distance.toFixed(2)} km
            </div>
            <div className="px-4 py-1.5 rounded-full bg-black/60 backdrop-blur text-white font-mono font-bold border border-white/10">
              <span className="text-2xl">{hud.speed}</span>
              <span className="text-xs text-white/60 ml-1">KM/H</span>
            </div>
            <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur flex items-center gap-1.5 border border-white/10">
              {[0, 1, 2].map((i) => (
                <Heart key={i} className={`w-4 h-4 ${i < hud.lives ? 'text-red-500 fill-red-500' : 'text-white/20'}`} />
              ))}
            </div>
          </div>
          <button
            onClick={() => { stopEngine(); onExit(); }}
            className="pointer-events-auto absolute top-3 left-1/2 -translate-x-1/2 mt-12 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur text-white text-xs flex items-center gap-1 border border-white/10"
          >
            <ArrowLeft className="w-3 h-3" /> Exit
          </button>

          {/* Mobile touch controls */}
          <div className="md:hidden absolute bottom-6 left-0 right-0 flex justify-between px-6 pointer-events-auto">
            <button
              onTouchStart={(e) => { e.preventDefault(); setTouch('arrowleft', true); }}
              onTouchEnd={() => setTouch('arrowleft', false)}
              onMouseDown={() => setTouch('arrowleft', true)}
              onMouseUp={() => setTouch('arrowleft', false)}
              className="w-20 h-20 rounded-full bg-white/15 backdrop-blur border border-white/20 text-white text-3xl font-bold flex items-center justify-center active:bg-white/30"
            >←</button>
            <button
              onTouchStart={(e) => { e.preventDefault(); setTouch('arrowright', true); }}
              onTouchEnd={() => setTouch('arrowright', false)}
              onMouseDown={() => setTouch('arrowright', true)}
              onMouseUp={() => setTouch('arrowright', false)}
              className="w-20 h-20 rounded-full bg-white/15 backdrop-blur border border-white/20 text-white text-3xl font-bold flex items-center justify-center active:bg-white/30"
            >→</button>
          </div>
        </div>
      )}

      {/* Start screen */}
      {phase === 'start' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
          <div className="text-center space-y-6 max-w-md">
            <div className="text-6xl">🏁</div>
            <h1 className="text-5xl font-black tracking-tight" style={{ fontFamily: 'Orbitron, ui-monospace, monospace' }}>
              Freedom Drive
            </h1>
            <p className="text-white/70 text-sm">
              Steer with <span className="text-white font-bold">←/→</span> or <span className="text-white font-bold">A/D</span>. Avoid traffic. Go as far as you can.
            </p>
            <button
              onClick={startGame}
              className="px-8 py-3 rounded-full bg-white text-black font-black text-lg shadow-2xl hover:scale-105 transition-transform"
            >
              Tap to Start
            </button>
            <button onClick={onExit} className="block mx-auto text-xs text-white/50 hover:text-white">
              ← Back to Garage
            </button>
          </div>
        </div>
      )}

      {/* Game Over */}
      {phase === 'gameover' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur text-white p-6">
          <div className="text-center space-y-5 max-w-sm">
            <div className="text-5xl">💥</div>
            <h2 className="text-3xl font-black">Game Over</h2>
            <p className="text-white/70">You drove</p>
            <div className="text-5xl font-black font-mono" style={{ fontFamily: 'Orbitron, ui-monospace, monospace' }}>
              {hud.distance.toFixed(2)} <span className="text-xl text-white/60">km</span>
            </div>
            <div className="flex gap-3 justify-center">
              <button onClick={startGame} className="px-6 py-3 rounded-full bg-white text-black font-bold">
                Play Again
              </button>
              <button onClick={onExit} className="px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white font-bold">
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Sprite drawing helpers ──
function drawPlayerCar(ctx: CanvasRenderingContext2D, cx: number, cy: number, w: number, h: number, spin: number) {
  // Rear-view sleek sports car (electric blue)
  const bodyColor = '#1e6fff';
  const bodyDark = '#0e44b0';
  const glass = '#0a1530';

  // Lower body (wide rear)
  ctx.fillStyle = bodyDark;
  roundRect(ctx, cx - w / 2, cy - h * 0.05, w, h * 0.55, h * 0.12);
  ctx.fill();

  // Wheels (rear)
  ctx.fillStyle = '#111';
  roundRect(ctx, cx - w / 2 - w * 0.04, cy + h * 0.15, w * 0.13, h * 0.4, 6); ctx.fill();
  roundRect(ctx, cx + w / 2 - w * 0.09, cy + h * 0.15, w * 0.13, h * 0.4, 6); ctx.fill();
  // Wheel rims spinning
  ctx.save();
  ctx.translate(cx - w / 2 + w * 0.025, cy + h * 0.35); ctx.rotate(spin);
  ctx.fillStyle = '#888';
  ctx.fillRect(-w * 0.04, -1, w * 0.08, 2);
  ctx.fillRect(-1, -w * 0.04, 2, w * 0.08);
  ctx.restore();
  ctx.save();
  ctx.translate(cx + w / 2 - w * 0.025, cy + h * 0.35); ctx.rotate(spin);
  ctx.fillStyle = '#888';
  ctx.fillRect(-w * 0.04, -1, w * 0.08, 2);
  ctx.fillRect(-1, -w * 0.04, 2, w * 0.08);
  ctx.restore();

  // Upper body / roof (narrower, trapezoid for perspective)
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.moveTo(cx - w * 0.42, cy + h * 0.05);
  ctx.lineTo(cx - w * 0.32, cy - h * 0.45);
  ctx.lineTo(cx + w * 0.32, cy - h * 0.45);
  ctx.lineTo(cx + w * 0.42, cy + h * 0.05);
  ctx.closePath();
  ctx.fill();

  // Roof highlight (shine)
  const grad = ctx.createLinearGradient(cx, cy - h * 0.45, cx, cy + h * 0.05);
  grad.addColorStop(0, 'rgba(255,255,255,0.55)');
  grad.addColorStop(0.5, 'rgba(255,255,255,0.1)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(cx - w * 0.3, cy - h * 0.4);
  ctx.lineTo(cx + w * 0.3, cy - h * 0.4);
  ctx.lineTo(cx + w * 0.36, cy - h * 0.05);
  ctx.lineTo(cx - w * 0.36, cy - h * 0.05);
  ctx.closePath();
  ctx.fill();

  // Rear windshield (trapezoid)
  ctx.fillStyle = glass;
  ctx.beginPath();
  ctx.moveTo(cx - w * 0.26, cy - h * 0.4);
  ctx.lineTo(cx + w * 0.26, cy - h * 0.4);
  ctx.lineTo(cx + w * 0.3, cy - h * 0.1);
  ctx.lineTo(cx - w * 0.3, cy - h * 0.1);
  ctx.closePath();
  ctx.fill();

  // Tail lights
  ctx.fillStyle = '#ff2a2a';
  roundRect(ctx, cx - w * 0.38, cy + h * 0.18, w * 0.14, h * 0.08, 3); ctx.fill();
  roundRect(ctx, cx + w * 0.24, cy + h * 0.18, w * 0.14, h * 0.08, 3); ctx.fill();
  ctx.fillStyle = 'rgba(255,80,80,0.5)';
  roundRect(ctx, cx - w * 0.4, cy + h * 0.16, w * 0.18, h * 0.12, 4); ctx.fill();
  roundRect(ctx, cx + w * 0.22, cy + h * 0.16, w * 0.18, h * 0.12, 4); ctx.fill();

  // License plate
  ctx.fillStyle = '#fff';
  roundRect(ctx, cx - w * 0.1, cy + h * 0.22, w * 0.2, h * 0.08, 2); ctx.fill();
  ctx.fillStyle = '#000';
  ctx.font = `bold ${Math.round(h * 0.07)}px ui-monospace, monospace`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('FREE-1', cx, cy + h * 0.26);

  // Spoiler
  ctx.fillStyle = '#0a2570';
  roundRect(ctx, cx - w * 0.45, cy - h * 0.08, w * 0.9, h * 0.05, 3); ctx.fill();
}

function drawCarSprite(
  ctx: CanvasRenderingContext2D, cx: number, cy: number, w: number, h: number,
  color: string, kind: TrafficCar['kind'], _spin: number,
) {
  const dark = shade(color, -0.3);
  ctx.fillStyle = '#000'; // shadow
  ctx.globalAlpha = 0.3;
  ctx.beginPath();
  ctx.ellipse(cx, cy + h * 0.5, w * 0.45, h * 0.1, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
  // body
  ctx.fillStyle = dark;
  roundRect(ctx, cx - w / 2, cy, w, h * 0.6, 4); ctx.fill();
  // cabin
  ctx.fillStyle = color;
  if (kind === 'truck') {
    roundRect(ctx, cx - w * 0.45, cy - h * 0.5, w * 0.5, h * 0.55, 3); ctx.fill();
    // trailer
    ctx.fillStyle = '#ddd';
    roundRect(ctx, cx - w * 0.05, cy - h * 0.4, w * 0.5, h * 0.45, 3); ctx.fill();
  } else if (kind === 'van') {
    roundRect(ctx, cx - w * 0.42, cy - h * 0.45, w * 0.84, h * 0.5, 4); ctx.fill();
    ctx.fillStyle = '#152040';
    roundRect(ctx, cx - w * 0.38, cy - h * 0.4, w * 0.76, h * 0.18, 2); ctx.fill();
  } else {
    roundRect(ctx, cx - w * 0.32, cy - h * 0.4, w * 0.64, h * 0.45, 3); ctx.fill();
    ctx.fillStyle = '#152040';
    roundRect(ctx, cx - w * 0.28, cy - h * 0.35, w * 0.56, h * 0.18, 2); ctx.fill();
  }
  // wheels hint
  ctx.fillStyle = '#000';
  roundRect(ctx, cx - w / 2 - 1, cy + h * 0.25, w * 0.1, h * 0.3, 2); ctx.fill();
  roundRect(ctx, cx + w / 2 - w * 0.1 + 1, cy + h * 0.25, w * 0.1, h * 0.3, 2); ctx.fill();
  // tail lights (red)
  ctx.fillStyle = '#ff3333';
  roundRect(ctx, cx - w * 0.4, cy + h * 0.15, w * 0.1, h * 0.06, 1); ctx.fill();
  roundRect(ctx, cx + w * 0.3, cy + h * 0.15, w * 0.1, h * 0.06, 1); ctx.fill();
}

function drawTree(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number, kind: 'pine' | 'leafy') {
  const h = Math.max(20, scale * 5000);
  const w = h * 0.5;
  // trunk
  ctx.fillStyle = '#5a3a1a';
  ctx.fillRect(x - w * 0.08, y - h * 0.2, w * 0.16, h * 0.25);
  if (kind === 'pine') {
    ctx.fillStyle = '#1f6b2a';
    ctx.beginPath();
    ctx.moveTo(x, y - h);
    ctx.lineTo(x + w * 0.5, y - h * 0.15);
    ctx.lineTo(x - w * 0.5, y - h * 0.15);
    ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x, y - h * 0.75);
    ctx.lineTo(x + w * 0.4, y - h * 0.1);
    ctx.lineTo(x - w * 0.4, y - h * 0.1);
    ctx.closePath(); ctx.fill();
  } else {
    ctx.fillStyle = '#2a8a3a';
    ctx.beginPath();
    ctx.arc(x, y - h * 0.55, w * 0.55, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#1f6b2a';
    ctx.beginPath();
    ctx.arc(x - w * 0.25, y - h * 0.4, w * 0.4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath();
    ctx.arc(x + w * 0.25, y - h * 0.45, w * 0.42, 0, Math.PI * 2); ctx.fill();
  }
}

function drawSign(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number) {
  const h = Math.max(15, scale * 3000);
  const w = h * 0.8;
  ctx.fillStyle = '#3a2a1a';
  ctx.fillRect(x - w * 0.05, y - h * 0.3, w * 0.1, h * 0.4);
  ctx.fillStyle = '#fff';
  ctx.fillRect(x - w * 0.5, y - h, w, h * 0.6);
  ctx.fillStyle = '#d22';
  ctx.font = `bold ${Math.round(h * 0.3)}px ui-monospace`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('80', x, y - h * 0.7);
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function shade(hex: string, pct: number): string {
  const n = hex.replace('#', '');
  const r = parseInt(n.substring(0, 2), 16);
  const g = parseInt(n.substring(2, 4), 16);
  const b = parseInt(n.substring(4, 6), 16);
  const apply = (c: number) => Math.max(0, Math.min(255, Math.round(c + 255 * pct)));
  return `rgb(${apply(r)}, ${apply(g)}, ${apply(b)})`;
}

export default RoadRunnerGame;
