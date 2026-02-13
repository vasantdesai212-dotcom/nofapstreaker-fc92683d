import { useAppState } from '@/lib/AppContext';
import { getCarTemplate } from '@/lib/cars';
import { getActiveCycle } from '@/lib/storage';
import { Settings as SettingsIcon, Car, Info } from 'lucide-react';

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

const Settings = () => {
  const { state } = useAppState();
  const cycle = getActiveCycle(state);
  const activeCar = cycle ? getCarTemplate(cycle.carTemplateId) : null;

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

        {/* Current car (read-only) */}
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
          <Car className="w-4 h-4" /> Current Cycle Car
        </h2>
        {activeCar ? (
          <div className="glass-panel rounded-2xl overflow-hidden mb-8">
            <div className="flex items-center gap-4 p-3">
              <img
                src={carImages[activeCar.id]}
                alt={activeCar.name}
                className="w-24 h-14 object-cover rounded-lg"
              />
              <div>
                <p className="text-xs text-muted-foreground">{activeCar.manufacturer}</p>
                <p className="font-bold">{activeCar.name}</p>
              </div>
              <span className="ml-auto text-xs text-primary font-semibold px-3 py-1 rounded-full bg-primary/10">
                Active
              </span>
            </div>
          </div>
        ) : (
          <div className="glass-panel rounded-2xl p-4 mb-8 text-center">
            <p className="text-sm text-muted-foreground">No active cycle. Start one from the Home page.</p>
          </div>
        )}

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
