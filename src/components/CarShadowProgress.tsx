import { useMemo, useEffect, useRef } from 'react';
import { getPercentage } from '@/lib/calcProgress';
import { getCarSilhouette } from '@/lib/carSilhouettes';
import { useIsMobile } from '@/hooks/use-mobile';
import { playEngineRev } from '@/lib/engineRevSound';
import { Star } from 'lucide-react';

interface CarShadowProgressProps {
  selectedCarId: string;
  unlockedDays: number;
  goalDays?: number;
  carName?: string;
}

const CarShadowProgress = ({
  selectedCarId,
  unlockedDays,
  goalDays = 30,
  carName = 'Car',
}: CarShadowProgressProps) => {
  const isMobile = useIsMobile();
  const isNarrow = isMobile; // fill bottom-to-top on mobile
  const percentage = useMemo(() => getPercentage(unlockedDays, goalDays), [unlockedDays, goalDays]);
  const isComplete = percentage >= 100;
  const prevCompleteRef = useRef(false);

  // Play engine rev sound when progress first reaches 100%
  useEffect(() => {
    if (isComplete && !prevCompleteRef.current) {
      playEngineRev();
    }
    prevCompleteRef.current = isComplete;
  }, [isComplete]);
  const silhouette = getCarSilhouette(selectedCarId);
  const clipId = `clip-${selectedCarId}`;

  // Parse viewBox to compute absolute fill dimensions (percentages on SVG rect are unreliable)
  const [vbX, vbY, vbW, vbH] = silhouette.viewBox.split(' ').map(Number);
  const fillW = (percentage / 100) * vbW;
  const fillH = (percentage / 100) * vbH;
  const fillY = vbH - fillH;

  const ariaLabel = isComplete
    ? `Car progress: Fully unlocked, ${unlockedDays} of ${goalDays} days`
    : `Car progress: ${percentage} percent unlocked, ${unlockedDays} of ${goalDays} days`;

  return (
    <div
      className="w-full max-w-[600px] mx-auto mb-6"
      role="img"
      aria-label={ariaLabel}
    >
      <div className={`flex ${isNarrow ? 'flex-col items-center' : 'items-center'} gap-4`}>
        {/* SVG silhouette with clip-path fill */}
        <div className={`relative ${isNarrow ? 'w-full' : 'flex-1'}`}>
          <svg
            viewBox={silhouette.viewBox}
            className="w-full h-auto"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <clipPath id={clipId}>
                <path d={silhouette.path} />
              </clipPath>
            </defs>

            {/* Base shadow layer */}
            <path
              d={silhouette.path}
              className="fill-muted-foreground/10"
            />

            {/* Animated fill layer */}
            <g clipPath={`url(#${clipId})`}>
              {isNarrow ? (
                <rect
                  x={vbX}
                  y={fillY}
                  width={vbW}
                  height={fillH}
                  className={isComplete ? 'fill-primary' : 'fill-primary/70'}
                  style={{
                    transition: 'y 400ms ease-out, height 400ms ease-out',
                  }}
                />
              ) : (
                <rect
                  x={vbX}
                  y={vbY}
                  width={fillW}
                  height={vbH}
                  className={isComplete ? 'fill-primary' : 'fill-primary/70'}
                  style={{
                    transition: 'width 400ms ease-out',
                  }}
                />
              )}
            </g>

            {/* Subtle edge glow when complete */}
            {isComplete && (
              <path
                d={silhouette.path}
                fill="none"
                className="stroke-primary"
                strokeWidth="2"
                style={{
                  filter: 'drop-shadow(0 0 6px hsl(var(--primary)))',
                  animation: 'pulse 2s ease-in-out infinite',
                }}
              />
            )}
          </svg>

          {/* Confetti-style sparkles at 100% */}
          {isComplete && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-primary animate-ping"
                  style={{
                    left: `${15 + i * 14}%`,
                    top: `${20 + (i % 3) * 20}%`,
                    animationDelay: `${i * 200}ms`,
                    animationDuration: '1.5s',
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Numeric badge */}
        <div className={`flex-shrink-0 ${isNarrow ? 'text-center' : 'text-right'}`}>
          {isComplete ? (
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-primary fill-primary animate-pulse" />
              <div>
                <p className="text-lg font-black text-gradient">Fully Unlocked</p>
                <p className="text-xs text-muted-foreground">
                  {unlockedDays} / {goalDays} days
                </p>
              </div>
            </div>
          ) : unlockedDays > 0 ? (
            <div>
              <p className="text-2xl font-black text-gradient">{percentage}%</p>
              <p className="text-xs text-muted-foreground font-medium">unlocked</p>
              <p className="text-[10px] text-muted-foreground/70 mt-0.5">
                {unlockedDays} / {goalDays} days
              </p>
            </div>
          ) : (
            <div>
              <p className="text-lg font-bold text-muted-foreground/50">0%</p>
              <p className="text-[10px] text-muted-foreground/40">No progress yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarShadowProgress;
