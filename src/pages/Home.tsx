import { useAppState } from '@/lib/AppContext';
import { getActiveCycle, startNewCycle, markSuccess, markFail, todayAlreadyLogged } from '@/lib/storage';
import { getCarTemplate, getAvailableCars } from '@/lib/cars';
import { Check, X, AlertTriangle, Trophy, Flame } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import porscheImg from '@/assets/porsche-911-gt3rs.jpg';
import bmwImg from '@/assets/bmw-m5-cs.jpg';
import lamboImg from '@/assets/lamborghini-huracan-sto.jpg';
import mustangImg from '@/assets/ford-mustang-shelby.jpg';
import gwagonImg from '@/assets/mercedes-g-wagon.jpg';
import rollsImg from '@/assets/rolls-royce-wraith.jpg';

const carImages: Record<string, string> = {
  'porsche-911-gt3rs': porscheImg,
  'bmw-m5-cs': bmwImg,
  'lamborghini-huracan-sto': lamboImg,
  'ford-mustang-shelby': mustangImg,
  'mercedes-g-wagon': gwagonImg,
  'rolls-royce-wraith': rollsImg,
};

const Home = () => {
  const { state, setState } = useAppState();
  const navigate = useNavigate();
  const [showFailConfirm, setShowFailConfirm] = useState(false);
  const [justMarked, setJustMarked] = useState<'success' | 'fail' | null>(null);
  const [showCarPicker, setShowCarPicker] = useState(false);

  const cycle = getActiveCycle(state);
  const hasActiveCycle = !!cycle;
  const alreadyLogged = cycle ? todayAlreadyLogged(state) : false;
  const car = cycle ? getCarTemplate(cycle.carTemplateId) : getCarTemplate(state.profile.selectedCarTemplateId);
  const availableCars = getAvailableCars(state.garage);

  const handlePickCar = (carId: string) => {
    const updated = {
      ...state,
      profile: { ...state.profile, selectedCarTemplateId: carId },
    };
    setState(updated);
    const newState = startNewCycle(updated);
    setState(newState);
    setShowCarPicker(false);
  };

  const handleSuccess = () => {
    const newState = markSuccess(state);
    setState(newState);
    setJustMarked('success');

    const newCycle = getActiveCycle(newState);
    if (!newCycle && cycle && cycle.dayIndex === 30) {
      setTimeout(() => navigate('/garage'), 1500);
    }
  };

  const handleFail = () => {
    setState(markFail(state));
    setJustMarked('fail');
    setShowFailConfirm(false);
  };

  // No active cycle - show start screen
  if (!hasActiveCycle) {
    const justFailed = justMarked === 'fail';
    const justCompleted = justMarked === 'success';

    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
        {justFailed && (
          <div className="mb-8 animate-count-up">
            <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Car Destroyed.</h2>
            <p className="text-muted-foreground text-sm">No excuses. Start again.</p>
          </div>
        )}
        {justCompleted && (
          <div className="mb-8 animate-count-up">
            <Trophy className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Car Completed!</h2>
            <p className="text-muted-foreground text-sm">Saved to your Garage. Ready for the next one?</p>
          </div>
        )}
        {!justFailed && !justCompleted && (
          <div className="mb-8">
            <Flame className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Ready to Build?</h2>
            <p className="text-muted-foreground text-sm max-w-xs">
              Choose your car and start a 30-day cycle.
            </p>
          </div>
        )}
        <button
          onClick={() => setShowCarPicker(true)}
          className="px-10 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg glow-orange transition-all hover:scale-105 active:scale-95"
        >
          Start New Cycle
        </button>

        {/* Car picker modal */}
        {showCarPicker && (
          <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center p-6">
            <div className="glass-panel rounded-2xl p-6 max-w-sm w-full max-h-[80vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-1 text-center">Pick Your Car</h3>
              <p className="text-xs text-muted-foreground text-center mb-5">Which one are you building next?</p>
              <div className="space-y-3">
                {availableCars.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handlePickCar(c.id)}
                    className="w-full rounded-xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all hover:scale-[1.02] active:scale-95"
                  >
                    <div className="flex items-center gap-4 p-3">
                      <img
                        src={carImages[c.id]}
                        alt={c.name}
                        className="w-20 h-12 object-cover rounded-lg"
                      />
                      <div className="text-left">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{c.manufacturer}</p>
                        <p className="font-bold text-sm">{c.name}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowCarPicker(false)}
                className="w-full mt-4 py-3 rounded-xl bg-muted text-foreground font-semibold text-sm transition-all hover:bg-muted/80"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Active cycle
  const dayIndex = cycle!.dayIndex;
  const partsBuilt = cycle!.partsAssembled.filter(Boolean).length;
  const currentPart = car?.parts[dayIndex - 1];
  const progress = (partsBuilt / 30) * 100;

  return (
    <div className="flex flex-col items-center px-6 pt-8 pb-32">
      {/* Streak counter */}
      <div className="mb-6 text-center">
        <div className="text-7xl font-black text-gradient animate-count-up leading-none mb-1">
          {dayIndex}
        </div>
        <p className="text-muted-foreground text-sm font-medium tracking-widest uppercase">Day of 30</p>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-sm mb-8">
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>{partsBuilt}/30 parts</span>
          <span className="text-foreground font-semibold">{car?.manufacturer} {car?.name}</span>
        </div>
      </div>

      {/* Current part info */}
      {currentPart && !alreadyLogged && (
        <div className="glass-panel rounded-2xl p-6 w-full max-w-sm mb-8 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Today's Part</p>
          <p className="text-xl font-bold">{currentPart.name}</p>
          <p className="text-xs text-primary mt-1 capitalize">{currentPart.category}</p>
        </div>
      )}

      {alreadyLogged && (
        <div className="glass-panel rounded-2xl p-6 w-full max-w-sm mb-8 text-center glow-success">
          <Check className="w-8 h-8 text-success mx-auto mb-2" />
          <p className="text-success font-bold">Today logged. Come back tomorrow.</p>
        </div>
      )}

      {/* Action buttons */}
      {!alreadyLogged && (
        <div className="flex gap-4 w-full max-w-sm">
          <button
            onClick={handleSuccess}
            className="flex-1 flex flex-col items-center gap-2 py-5 rounded-2xl bg-success/10 border border-success/30 text-success font-bold transition-all hover:scale-105 hover:bg-success/20 active:scale-95"
          >
            <Check className="w-7 h-7" />
            <span className="text-sm">Success</span>
          </button>
          <button
            onClick={() => setShowFailConfirm(true)}
            className="flex-1 flex flex-col items-center gap-2 py-5 rounded-2xl bg-destructive/10 border border-destructive/30 text-destructive font-bold transition-all hover:scale-105 hover:bg-destructive/20 active:scale-95"
          >
            <X className="w-7 h-7" />
            <span className="text-sm">I Failed</span>
          </button>
        </div>
      )}

      {/* Fail confirmation modal */}
      {showFailConfirm && (
        <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="glass-panel rounded-2xl p-8 max-w-sm w-full text-center">
            <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Are you sure?</h3>
            <p className="text-muted-foreground text-sm mb-6">
              This will destroy your current car and reset to Day 1. Be honest with yourself.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowFailConfirm(false)}
                className="flex-1 py-3 rounded-xl bg-muted text-foreground font-semibold transition-all hover:bg-muted/80"
              >
                Cancel
              </button>
              <button
                onClick={handleFail}
                className="flex-1 py-3 rounded-xl bg-destructive text-destructive-foreground font-semibold transition-all hover:bg-destructive/90"
              >
                Yes, I Failed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick link to progress view */}
      <button
        onClick={() => navigate('/progress')}
        className="mt-8 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        View Car Assembly →
      </button>
    </div>
  );
};

export default Home;
