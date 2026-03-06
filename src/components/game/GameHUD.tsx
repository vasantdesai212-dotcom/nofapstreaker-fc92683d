import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GameHUDProps {
  speed: number;
  time: number;
  onReset: () => void;
}

const formatTime = (s: number) => {
  const mins = Math.floor(s / 60);
  const secs = Math.floor(s % 60);
  const ms = Math.floor((s % 1) * 100);
  return `${mins}:${String(secs).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
};

const GameHUD = ({ speed, time, onReset }: GameHUDProps) => {
  const navigate = useNavigate();
  const displaySpeed = Math.abs(Math.round(speed * 50)); // scale to ~km/h feel

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Top bar */}
      <div className="flex items-center justify-between p-3 pointer-events-auto">
        <button
          onClick={() => navigate('/garage')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-background/80 backdrop-blur-sm border border-border/50 text-foreground text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Exit
        </button>

        <div className="px-4 py-2 rounded-xl bg-background/80 backdrop-blur-sm border border-border/50">
          <span className="text-xs text-muted-foreground font-medium">TIME </span>
          <span className="text-sm font-mono font-bold text-foreground">{formatTime(time)}</span>
        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-background/80 backdrop-blur-sm border border-border/50 text-foreground text-sm font-medium"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      {/* Bottom — speedometer & controls hint */}
      <div className="absolute bottom-4 left-0 right-0 flex items-end justify-between px-4">
        {/* Speedometer */}
        <div className="px-4 py-3 rounded-2xl bg-background/80 backdrop-blur-sm border border-border/50 pointer-events-auto">
          <div className="text-3xl font-black text-primary font-mono leading-none">{displaySpeed}</div>
          <div className="text-[10px] text-muted-foreground font-medium mt-0.5">KM/H</div>
        </div>

        {/* Controls legend */}
        <div className="px-3 py-2 rounded-xl bg-background/80 backdrop-blur-sm border border-border/50 text-[10px] text-muted-foreground space-y-0.5 pointer-events-auto">
          <div><span className="text-foreground font-bold">W/↑</span> Accelerate</div>
          <div><span className="text-foreground font-bold">S/↓</span> Brake</div>
          <div><span className="text-foreground font-bold">A/D ←/→</span> Steer</div>
          <div><span className="text-foreground font-bold">Space</span> Handbrake</div>
        </div>
      </div>

      {/* Mobile touch controls */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-between px-4 md:hidden pointer-events-auto">
        {/* Left side — steering */}
        <div className="flex gap-2">
          <button
            data-control="left"
            className="w-14 h-14 rounded-full bg-background/60 backdrop-blur border border-border/50 flex items-center justify-center text-foreground text-lg font-bold active:bg-primary/30"
            onTouchStart={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('game-control', { detail: { key: 'left', pressed: true } })); }}
            onTouchEnd={() => window.dispatchEvent(new CustomEvent('game-control', { detail: { key: 'left', pressed: false } }))}
          >
            ←
          </button>
          <button
            data-control="right"
            className="w-14 h-14 rounded-full bg-background/60 backdrop-blur border border-border/50 flex items-center justify-center text-foreground text-lg font-bold active:bg-primary/30"
            onTouchStart={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('game-control', { detail: { key: 'right', pressed: true } })); }}
            onTouchEnd={() => window.dispatchEvent(new CustomEvent('game-control', { detail: { key: 'right', pressed: false } }))}
          >
            →
          </button>
        </div>
        {/* Right side — throttle/brake */}
        <div className="flex gap-2">
          <button
            data-control="brake"
            className="w-14 h-14 rounded-full bg-destructive/40 backdrop-blur border border-destructive/50 flex items-center justify-center text-foreground text-xs font-bold active:bg-destructive/60"
            onTouchStart={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('game-control', { detail: { key: 'brake', pressed: true } })); }}
            onTouchEnd={() => window.dispatchEvent(new CustomEvent('game-control', { detail: { key: 'brake', pressed: false } }))}
          >
            BRK
          </button>
          <button
            data-control="gas"
            className="w-14 h-14 rounded-full bg-primary/40 backdrop-blur border border-primary/50 flex items-center justify-center text-foreground text-xs font-bold active:bg-primary/60"
            onTouchStart={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('game-control', { detail: { key: 'gas', pressed: true } })); }}
            onTouchEnd={() => window.dispatchEvent(new CustomEvent('game-control', { detail: { key: 'gas', pressed: false } }))}
          >
            GAS
          </button>
        </div>
      </div>

      {/* Car name badge */}
      <div className="absolute top-14 left-1/2 -translate-x-1/2">
        <div className="px-3 py-1 rounded-lg bg-primary/20 border border-primary/30 backdrop-blur-sm">
          <span className="text-xs font-bold text-primary">PORSCHE 911 GT3 RS</span>
        </div>
      </div>
    </div>
  );
};

export default GameHUD;
