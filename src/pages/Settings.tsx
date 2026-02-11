import { useAppState } from '@/lib/AppContext';
import { CAR_TEMPLATES } from '@/lib/cars';
import { Settings as SettingsIcon, Car, Info } from 'lucide-react';

import porscheImg from '@/assets/porsche-911-gt3rs.jpg';
import bmwImg from '@/assets/bmw-m5-cs.jpg';
import lamboImg from '@/assets/lamborghini-huracan-sto.jpg';

const carImages: Record<string, string> = {
  'porsche-911-gt3rs': porscheImg,
  'bmw-m5-cs': bmwImg,
  'lamborghini-huracan-sto': lamboImg,
};

const Settings = () => {
  const { state, setState } = useAppState();

  const selectCar = (id: string) => {
    setState({
      ...state,
      profile: { ...state.profile, selectedCarTemplateId: id },
    });
  };

  const resetAll = () => {
    if (window.confirm('This will delete ALL data including your Garage. Are you absolutely sure?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="px-6 pt-6 pb-28">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <SettingsIcon className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-black">Settings</h1>
        </div>

        {/* Car selection */}
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
          <Car className="w-4 h-4" /> Next Cycle Car
        </h2>
        <div className="space-y-3 mb-8">
          {CAR_TEMPLATES.map((car) => {
            const selected = state.profile.selectedCarTemplateId === car.id;
            return (
              <button
                key={car.id}
                onClick={() => selectCar(car.id)}
                className={`w-full glass-panel rounded-2xl overflow-hidden text-left transition-all ${
                  selected ? 'border-primary/50 glow-orange' : 'hover:border-border'
                }`}
              >
                <div className="flex items-center gap-4 p-3">
                  <img
                    src={carImages[car.id]}
                    alt={car.name}
                    className="w-24 h-14 object-cover rounded-lg"
                  />
                  <div>
                    <p className="text-xs text-muted-foreground">{car.manufacturer}</p>
                    <p className="font-bold">{car.name}</p>
                  </div>
                  {selected && (
                    <span className="ml-auto text-xs text-primary font-semibold px-3 py-1 rounded-full bg-primary/10">
                      Selected
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Privacy note */}
        <div className="glass-panel rounded-2xl p-4 mb-6">
          <div className="flex gap-3 items-start">
            <Info className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold mb-1">Privacy</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                All data is stored locally on your device. Nothing is uploaded anywhere. 
                Clear your browser data to erase everything.
              </p>
            </div>
          </div>
        </div>

        {/* Danger zone */}
        <button
          onClick={resetAll}
          className="w-full py-3 rounded-xl border border-destructive/30 text-destructive text-sm font-semibold hover:bg-destructive/10 transition-all"
        >
          Reset All Data
        </button>
      </div>
    </div>
  );
};

export default Settings;
