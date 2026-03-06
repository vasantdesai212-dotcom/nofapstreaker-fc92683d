import { Lock, Car, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface GameLockedProps {
  streakDays: number;
  hasPorsche: boolean;
}

const GameLocked = ({ streakDays, hasPorsche }: GameLockedProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="w-full max-w-sm space-y-8 text-center">
        {/* Lock icon with glow */}
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse" />
          <Lock className="w-12 h-12 text-primary" />
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl font-black text-foreground">Game Locked</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Complete a <span className="text-primary font-bold">30-day streak</span> with the{' '}
            <span className="text-foreground font-semibold">Porsche 911 GT3 RS</span> to unlock the driving experience.
          </p>
        </div>

        {/* Requirements */}
        <div className="space-y-3">
          <div className={`flex items-center gap-3 p-3 rounded-xl border ${hasPorsche ? 'border-green-500/30 bg-green-500/5' : 'border-border bg-card'}`}>
            <Trophy className={`w-5 h-5 ${hasPorsche ? 'text-green-500' : 'text-muted-foreground'}`} />
            <div className="text-left flex-1">
              <p className="text-sm font-medium text-foreground">Complete 30-Day Streak</p>
              <p className="text-xs text-muted-foreground">
                {hasPorsche ? 'Completed ✓' : `Current: ${streakDays} / 30 days`}
              </p>
            </div>
          </div>

          <div className={`flex items-center gap-3 p-3 rounded-xl border ${hasPorsche ? 'border-green-500/30 bg-green-500/5' : 'border-border bg-card'}`}>
            <Car className={`w-5 h-5 ${hasPorsche ? 'text-green-500' : 'text-muted-foreground'}`} />
            <div className="text-left flex-1">
              <p className="text-sm font-medium text-foreground">Unlock Porsche 911 GT3 RS</p>
              <p className="text-xs text-muted-foreground">
                {hasPorsche ? 'In garage ✓' : 'Not yet unlocked'}
              </p>
            </div>
          </div>
        </div>

        <Button onClick={() => navigate('/')} className="w-full" size="lg">
          Continue Your Streak
        </Button>
      </div>
    </div>
  );
};

export default GameLocked;
