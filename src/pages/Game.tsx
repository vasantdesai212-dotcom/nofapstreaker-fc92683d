import { lazy, Suspense, useMemo } from 'react';
import { useAppState } from '@/lib/AppContext';
import { getActiveCycle } from '@/lib/storage';
import GameLocked from '@/components/game/GameLocked';

// Lazy-load the heavy 3D scene only when entitled
const GameScene = lazy(() => import('@/components/game/GameScene'));

const PORSCHE_ID = 'porsche-911-gt3rs';

const Game = () => {
  const { state } = useAppState();

  // Entitlement check: user must have completed a 30-day streak with the Porsche
  const { isUnlocked, streakDays, hasPorsche } = useMemo(() => {
    const hasPorsche = state.garage.some((g) => g.carTemplateId === PORSCHE_ID);
    const activeCycle = getActiveCycle(state);
    const currentStreak = activeCycle ? activeCycle.dayIndex - 1 : 0;
    const bestStreak = state.profile.bestStreak;
    const streakDays = Math.max(currentStreak, bestStreak);

    return {
      isUnlocked: hasPorsche,
      streakDays,
      hasPorsche,
    };
  }, [state]);

  if (!isUnlocked) {
    return <GameLocked streakDays={streakDays} hasPorsche={hasPorsche} />;
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
          <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground font-medium">Loading Porsche 911 GT3 RS...</p>
        </div>
      }
    >
      <GameScene />
    </Suspense>
  );
};

export default Game;
