import { useState, useEffect, useCallback, useRef } from 'react';
import { X, Flame, Wind, Droplets, Dumbbell, MessageCircle, Trash2, Shield, ChevronRight } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { saveUrgeLog, TRIGGER_OPTIONS } from '@/lib/urgeStorage';
import type { UrgeLog } from '@/lib/urgeStorage';

type Step = 'timer' | 'logging' | 'decision';

interface Props {
  onClose: (survived: boolean, xp: number) => void;
}

const ACTIONS = [
  { label: '5-10 Pushups', icon: Dumbbell },
  { label: 'Cold Water Splash', icon: Droplets },
  { label: 'Delete a Trigger', icon: Trash2 },
  { label: 'Text a Friend', icon: MessageCircle },
] as const;

const ColdEngineMode = ({ onClose }: Props) => {
  const [step, setStep] = useState<Step>('timer');
  const [seconds, setSeconds] = useState(60);
  const [round, setRound] = useState(1);
  const [actionTapped, setActionTapped] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathTimer, setBreathTimer] = useState(4);

  // Logging state
  const [intensity, setIntensity] = useState(5);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [otherTrigger, setOtherTrigger] = useState('');

  const logRef = useRef<Partial<UrgeLog>>({ rounds: 1 });

  // Vibrate on mount
  useEffect(() => {
    if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]);
  }, []);

  // Main countdown
  useEffect(() => {
    if (step !== 'timer') return;
    if (seconds <= 0) {
      if (!actionTapped) return; // wait for action
      setStep('logging');
      return;
    }
    const id = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [step, seconds, actionTapped]);

  // Breathing guide
  useEffect(() => {
    if (step !== 'timer') return;
    const cycle = () => {
      setBreathPhase('inhale');
      setBreathTimer(4);
      const inhaleId = setTimeout(() => {
        setBreathPhase('hold');
        setBreathTimer(4);
        const holdId = setTimeout(() => {
          setBreathPhase('exhale');
          setBreathTimer(6);
          const exhaleId = setTimeout(cycle, 6000);
          return () => clearTimeout(exhaleId);
        }, 4000);
        return () => clearTimeout(holdId);
      }, 4000);
      return () => clearTimeout(inhaleId);
    };
    const cancel = cycle();
    return () => { if (typeof cancel === 'function') cancel(); };
  }, [step, round]);

  const handleAction = useCallback((label: string) => {
    setActionTapped(true);
    if (navigator.vibrate) navigator.vibrate(50);
  }, []);

  const handleSubmitLog = () => {
    const triggers = [...selectedTriggers];
    if (otherTrigger.trim()) triggers.push(otherTrigger.trim());

    logRef.current = {
      ...logRef.current,
      intensity,
      triggers,
      otherTrigger: otherTrigger.trim() || undefined,
    };
    setStep('decision');
  };

  const handleStillFeeling = (yes: boolean) => {
    if (yes) {
      // Another round
      setRound((r) => r + 1);
      logRef.current.rounds = (logRef.current.rounds || 1) + 1;
      setSeconds(90);
      setActionTapped(false);
      setStep('timer');
    } else {
      // Survived
      const xp = 5;
      const log: UrgeLog = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        intensity: logRef.current.intensity || 5,
        triggers: logRef.current.triggers || [],
        otherTrigger: logRef.current.otherTrigger,
        rounds: logRef.current.rounds || 1,
        survived: true,
        xpEarned: xp,
      };
      saveUrgeLog(log);
      onClose(true, xp);
    }
  };

  const handleExit = () => {
    // User exits without completing — still log but no XP
    const log: UrgeLog = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      intensity: logRef.current.intensity || 5,
      triggers: logRef.current.triggers || [],
      otherTrigger: logRef.current.otherTrigger,
      rounds: logRef.current.rounds || 1,
      survived: false,
      xpEarned: 0,
    };
    saveUrgeLog(log);
    onClose(false, 0);
  };

  const toggleTrigger = (t: string) => {
    setSelectedTriggers((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-[100] cold-engine-overlay flex flex-col">
      {/* Background */}
      <div className="absolute inset-0 bg-background/95 backdrop-blur-md cold-engine-bg" />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-2">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-destructive animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-destructive">
              Cold Engine Mode {round > 1 ? `— Round ${round}` : ''}
            </span>
          </div>
          <button onClick={handleExit} className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Step 1: Timer */}
        {step === 'timer' && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 pb-10">
            <h1 className="text-3xl font-black text-destructive mb-2 animate-count-up">
              Cold Engine Activated
            </h1>
            <p className="text-sm text-muted-foreground mb-8">Stay here. Breathe. Act.</p>

            {/* Countdown */}
            <div className="relative w-40 h-40 mb-8">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="44" fill="none" stroke="hsl(var(--muted))" strokeWidth="4" />
                <circle
                  cx="50" cy="50" r="44" fill="none"
                  stroke="hsl(var(--destructive))"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 44}
                  strokeDashoffset={2 * Math.PI * 44 * (1 - seconds / (round > 1 ? 90 : 60))}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-black text-foreground font-mono">{formatTime(seconds)}</span>
              </div>
            </div>

            {/* Breathing guide */}
            <div className="mb-8 text-center">
              <div className={`w-16 h-16 mx-auto rounded-full border-2 transition-all duration-1000 flex items-center justify-center ${
                breathPhase === 'inhale' ? 'scale-125 border-primary bg-primary/10' :
                breathPhase === 'hold' ? 'scale-125 border-accent bg-accent/10' :
                'scale-75 border-muted-foreground bg-muted/20'
              }`}>
                <Wind className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-semibold mt-3 capitalize text-foreground">{breathPhase}</p>
              <p className="text-xs text-muted-foreground">
                {breathPhase === 'inhale' ? 'Breathe in — 4s' : breathPhase === 'hold' ? 'Hold — 4s' : 'Breathe out — 6s'}
              </p>
            </div>

            {/* Rapid action buttons */}
            <div className="w-full max-w-sm">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3 text-center">
                {actionTapped ? '✓ Action taken' : 'Tap at least one action'}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {ACTIONS.map(({ label, icon: Icon }) => (
                  <button
                    key={label}
                    onClick={() => handleAction(label)}
                    className={`flex items-center gap-2 px-3 py-3 rounded-xl border text-sm font-medium transition-all active:scale-95 ${
                      actionTapped
                        ? 'border-success/40 bg-success/10 text-success'
                        : 'border-destructive/30 bg-destructive/5 text-foreground hover:bg-destructive/10'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="text-xs">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {seconds <= 0 && !actionTapped && (
              <p className="mt-4 text-xs text-destructive font-semibold animate-pulse">
                Tap an action to continue.
              </p>
            )}
          </div>
        )}

        {/* Step 2: Logging */}
        {step === 'logging' && (
          <div className="flex-1 flex flex-col px-6 pt-4 pb-10">
            <h2 className="text-xl font-black mb-1">Log This Urge</h2>
            <p className="text-sm text-muted-foreground mb-6">Be honest. This data stays on your device.</p>

            {/* Intensity slider */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-semibold">Urge Intensity</p>
                <span className="text-2xl font-black text-destructive">{intensity}</span>
              </div>
              <Slider
                value={[intensity]}
                onValueChange={(v) => setIntensity(v[0])}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>Mild</span>
                <span>Extreme</span>
              </div>
            </div>

            {/* Trigger type */}
            <div className="mb-6">
              <p className="text-sm font-semibold mb-3">What triggered it?</p>
              <div className="flex flex-wrap gap-2">
                {TRIGGER_OPTIONS.map((t) => (
                  <button
                    key={t}
                    onClick={() => toggleTrigger(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      selectedTriggers.includes(t)
                        ? 'border-primary bg-primary/20 text-primary'
                        : 'border-border bg-muted/50 text-muted-foreground hover:border-primary/30'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="Other..."
                value={otherTrigger}
                onChange={(e) => setOtherTrigger(e.target.value)}
                className="mt-3 w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />
            </div>

            <button
              onClick={handleSubmitLog}
              disabled={selectedTriggers.length === 0 && !otherTrigger.trim()}
              className="w-full py-4 rounded-xl bg-destructive text-destructive-foreground font-bold text-sm transition-all hover:bg-destructive/90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Log & Continue <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 3: Decision */}
        {step === 'decision' && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 pb-10 text-center">
            <Shield className="w-14 h-14 text-destructive mb-4" />
            <h2 className="text-2xl font-black mb-2">Still feeling it?</h2>
            <p className="text-sm text-muted-foreground mb-8 max-w-xs">
              Be honest. Another round with stronger breathing, or are you stable?
            </p>
            <div className="flex gap-3 w-full max-w-sm">
              <button
                onClick={() => handleStillFeeling(true)}
                className="flex-1 py-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive font-bold text-sm transition-all hover:bg-destructive/20 active:scale-95"
              >
                Yes — Another Round
              </button>
              <button
                onClick={() => handleStillFeeling(false)}
                className="flex-1 py-4 rounded-xl bg-success/10 border border-success/30 text-success font-bold text-sm transition-all hover:bg-success/20 active:scale-95"
              >
                No — I'm Stable
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColdEngineMode;
