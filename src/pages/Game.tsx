import { lazy, Suspense, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '@/lib/AppContext';
import { getActiveCycle } from '@/lib/storage';
import GameLocked from '@/components/game/GameLocked';

const RoadRunnerGame = lazy(() => import('@/components/game/RoadRunnerGame'));

const UNLOCK_DAYS = 15;

const Game = () => {
  const { state } = useAppState();
  const navigate = useNavigate();

  const { isUnlocked, streakDays } = useMemo(() => {
    const activeCycle = getActiveCycle(state);
    const currentStreak = activeCycle ? activeCycle.dayIndex - 1 : 0;
    const bestStreak = state.profile.bestStreak;
    const days = Math.max(currentStreak, bestStreak);
    return { isUnlocked: days >= UNLOCK_DAYS, streakDays: days };
  }, [state]);

  if (!isUnlocked) {
    return <GameLocked streakDays={streakDays} requiredDays={UNLOCK_DAYS} />;
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground font-medium">Loading Freedom Drive...</p>
        </div>
      }
    >
      <RoadRunnerGame onExit={() => navigate('/garage')} streakDays={streakDays} />
    </Suspense>
  );
};

export default Game;
