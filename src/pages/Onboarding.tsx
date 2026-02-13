import { useState } from 'react';
import { useAppState } from '@/lib/AppContext';
import porscheImg from '@/assets/porsche-911-gt3rs.jpg';
import { ChevronRight, Shield, Flame } from 'lucide-react';

const Onboarding = () => {
  const { state, setState } = useAppState();
  const [step, setStep] = useState(0);

  const complete = () => {
    setState({
      ...state,
      profile: { ...state.profile, onboardingComplete: true },
    });
  };

  const steps = [
    // Step 0: Welcome
    <div key="welcome" className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <div className="mb-8 w-full max-w-md overflow-hidden rounded-2xl">
        <img src={porscheImg} alt="Porsche 911 GT3 RS" className="w-full object-cover animate-shimmer" />
      </div>
      <h1 className="text-4xl font-black tracking-tight mb-3">
        <span className="text-gradient">NO FAP</span>
      </h1>
      <p className="text-lg text-muted-foreground mb-2 font-semibold tracking-wide">CAR STREAKER</p>
      <p className="text-secondary-foreground/70 max-w-sm mb-10 text-sm leading-relaxed">
        30 days of self-control. One legendary car. No shortcuts.
      </p>
      <p className="text-[11px] text-muted-foreground/50 mb-10">a project by — <span className="font-semibold text-muted-foreground/70">Vasant Desai</span></p>
      <button
        onClick={() => setStep(1)}
        className="flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg glow-orange transition-all hover:scale-105 active:scale-95"
      >
        Get Started <ChevronRight className="w-5 h-5" />
      </button>
    </div>,

    // Step 1: How it works
    <div key="howit" className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
        <Flame className="w-8 h-8 text-primary" />
      </div>
      <h2 className="text-2xl font-bold mb-4">How It Works</h2>
      <div className="space-y-4 text-left max-w-sm mb-10">
        {[
          ['1', 'Each day, mark Success or Fail. Be honest.'],
          ['2', 'Every successful day assembles a car part — 30 parts builds a full car.'],
          ['3', 'Fail once and the car breaks. You start over.'],
          ['4', 'Complete 30 days to save the car to your Garage forever.'],
        ].map(([num, text]) => (
          <div key={num} className="flex gap-3 items-start">
            <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-primary/20 text-primary text-sm font-bold flex items-center justify-center">
              {num}
            </span>
            <p className="text-secondary-foreground/80 text-sm leading-relaxed">{text}</p>
          </div>
        ))}
      </div>
      <button
        onClick={() => setStep(2)}
        className="flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg glow-orange transition-all hover:scale-105 active:scale-95"
      >
        Continue <ChevronRight className="w-5 h-5" />
      </button>
    </div>,

    // Step 2: Privacy
    <div key="privacy" className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-success/20 flex items-center justify-center mb-6">
        <Shield className="w-8 h-8 text-success" />
      </div>
      <h2 className="text-2xl font-bold mb-4">Your Data. Your Device.</h2>
      <p className="text-secondary-foreground/70 max-w-sm mb-4 text-sm leading-relaxed">
        Everything stays on this device. No accounts. No uploads. No one will ever know.
      </p>
      <p className="text-muted-foreground max-w-sm mb-10 text-xs">
        This app is a tool, not therapy. Pair it with real changes — block triggers, journal, seek help if needed.
      </p>
      <button
        onClick={complete}
        className="flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg glow-orange transition-all hover:scale-105 active:scale-95"
      >
        Let's Build <ChevronRight className="w-5 h-5" />
      </button>
    </div>,
  ];

  return (
    <div className="bg-background">
      {steps[step]}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all ${i === step ? 'bg-primary w-6' : 'bg-muted-foreground/30'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Onboarding;
