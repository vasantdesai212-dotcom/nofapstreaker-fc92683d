import { useMemo } from 'react';
import { getPercentage } from '@/lib/calcProgress';
import { getCarSilhouette } from '@/lib/carSilhouettes';
import { useIsMobile } from '@/hooks/use-mobile';
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
  const percentage = useMemo(() => getPercentage(unlockedDays, goalDays), [unlockedDays, goalDays]);
  const isComplete = percentage >= 100;
  const silhouette = getCarSilhouette(selectedCarId);

  const ariaLabel = isComplete
    ? `Car progress: Fully unlocked, ${unlockedDays} of ${goalDays} days`
    : `Car progress: ${percentage} percent unlocked, ${unlockedDays} of ${goalDays} days`;

  // Image-based rendering (preferred when silhouette has an image)
  const hasImage = !!silhouette.image;

  return (
    <div
      className="w-full max-w-[600px] mx-auto mb-6"
      role="img"
      aria-label={ariaLabel}
    >
      <div className={`flex ${isMobile ? 'flex-col items-center' : 'items-center'} gap-4`}>
        {/* Silhouette with progress fill */}
        <div className={`relative ${isMobile ? 'w-full' : 'flex-1'} overflow-hidden rounded-xl`}>
          {hasImage ? (
            /* Image-based silhouette: colored rect behind, line-art on top with mix-blend-mode */
            <div className="relative w-full">
              {/* Progress fill layer */}
              <div className="absolute inset-0 z-0">
                {isMobile ? (
                  <div
                    className={`absolute bottom-0 left-0 w-full ${isComplete ? 'bg-primary' : 'bg-primary/70'}`}
                    style={{
                      height: `${percentage}%`,
                      transition: 'height 400ms ease-out',
                    }}
                  />
                ) : (
                  <div
                    className={`absolute top-0 left-0 h-full ${isComplete ? 'bg-primary' : 'bg-primary/70'}`}
                    style={{
                      width: `${percentage}%`,
                      transition: 'width 400ms ease-out',
                    }}
                  />
                )}
              </div>

              {/* Car outline image — white bg blends away via multiply */}
              <img
                src={silhouette.image}
                alt={carName}
                className="relative z-10 w-full h-auto object-contain"
                style={{ mixBlendMode: 'multiply' }}
                draggable={false}
              />

              {/* Glow on complete */}
              {isComplete && (
                <div
                  className="absolute inset-0 z-20 pointer-events-none rounded-xl"
                  style={{
                    boxShadow: 'inset 0 0 30px hsl(var(--primary) / 0.3)',
                    animation: 'pulse 2s ease-in-out infinite',
                  }}
                />
              )}
            </div>
          ) : (
            /* SVG path fallback for cars without images */
            <svg
              viewBox={silhouette.viewBox}
              className="w-full h-auto"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <clipPath id={`clip-${selectedCarId}`}>
                  <path d={silhouette.path} />
                </clipPath>
              </defs>
              <path d={silhouette.path} className="fill-muted-foreground/10" />
              <g clipPath={`url(#clip-${selectedCarId})`}>
                {isMobile ? (
                  <rect
                    x="0"
                    y={`${100 - percentage}%`}
                    width="100%"
                    height={`${percentage}%`}
                    className={isComplete ? 'fill-primary' : 'fill-primary/70'}
                    style={{ transition: 'y 400ms ease-out, height 400ms ease-out' }}
                  />
                ) : (
                  <rect
                    x="0" y="0"
                    width={`${percentage}%`}
                    height="100%"
                    className={isComplete ? 'fill-primary' : 'fill-primary/70'}
                    style={{ transition: 'width 400ms ease-out' }}
                  />
                )}
              </g>
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
          )}

          {/* Sparkles at 100% */}
          {isComplete && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
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
        <div className={`flex-shrink-0 ${isMobile ? 'text-center' : 'text-right'}`}>
          {isComplete ? (
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-primary fill-primary animate-pulse" />
              <div>
                <p className="text-lg font-black text-gradient">Fully Unlocked</p>
                <p className="text-xs text-muted-foreground">{unlockedDays} / {goalDays} days</p>
              </div>
            </div>
          ) : unlockedDays > 0 ? (
            <div>
              <p className="text-2xl font-black text-gradient">{percentage}%</p>
              <p className="text-xs text-muted-foreground font-medium">unlocked</p>
              <p className="text-[10px] text-muted-foreground/70 mt-0.5">{unlockedDays} / {goalDays} days</p>
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
