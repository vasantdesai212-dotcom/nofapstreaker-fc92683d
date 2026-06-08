import { Lock, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface GameLockedProps {
  streakDays: number;
  requiredDays?: number;
}

const GameLocked = ({ streakDays, requiredDays = 15 }: GameLockedProps) => {
  const navigate = useNavigate();
  const progress = Math.min(100, Math.round((streakDays / requiredDays) * 100));

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse" />
          <Lock className="w-12 h-12 text-primary" />
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl font-black text-foreground">Freedom Drive Locked</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Complete <span className="text-primary font-bold">{requiredDays} days</span> to unlock the driving experience.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card">
            <Flame className="w-5 h-5 text-primary" />
            <div className="text-left flex-1">
              <p className="text-sm font-medium text-foreground">Complete {requiredDays}-Day Streak</p>
              <p className="text-xs text-muted-foreground">
                Current: {streakDays} / {requiredDays} days
              </p>
              <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
              </div>
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
