import { useAppState } from '@/lib/AppContext';
import { getActiveCycle } from '@/lib/storage';
import { getCarTemplate, CATEGORY_LABELS } from '@/lib/cars';
import type { PartCategory } from '@/lib/types';
import { Check, Lock } from 'lucide-react';

import porscheImg from '@/assets/porsche-911-gt3rs.jpg';
import bmwImg from '@/assets/bmw-m5-cs.jpg';
import lamboImg from '@/assets/lamborghini-huracan-sto.jpg';

const carImages: Record<string, string> = {
  'porsche-911-gt3rs': porscheImg,
  'bmw-m5-cs': bmwImg,
  'lamborghini-huracan-sto': lamboImg,
};

const categoryOrder: PartCategory[] = ['chassis', 'engine', 'transmission', 'suspension', 'wheels', 'body', 'aero', 'finish'];

const CarProgress = () => {
  const { state } = useAppState();
  const cycle = getActiveCycle(state);
  const car = cycle
    ? getCarTemplate(cycle.carTemplateId)
    : getCarTemplate(state.profile.selectedCarTemplateId);

  if (!car) return null;

  const partsAssembled = cycle?.partsAssembled ?? Array(30).fill(false);
  const completionPercent = Math.round((partsAssembled.filter(Boolean).length / 30) * 100);
  const img = carImages[car.id];

  // Group parts by category
  const grouped = categoryOrder.map((cat) => ({
    category: cat,
    label: CATEGORY_LABELS[cat],
    parts: car.parts.filter((p) => p.category === cat),
  })).filter((g) => g.parts.length > 0);

  return (
    <div className="px-6 pt-6 pb-28">
      {/* Car image with overlay */}
      <div className="relative w-full max-w-lg mx-auto mb-8 rounded-2xl overflow-hidden">
        <img
          src={img}
          alt={`${car.manufacturer} ${car.name}`}
          className="w-full object-cover"
          style={{
            filter: `grayscale(${100 - completionPercent}%) brightness(${0.4 + completionPercent * 0.006})`,
            transition: 'filter 0.8s ease',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4">
          <p className="text-xs text-muted-foreground uppercase tracking-widest">{car.manufacturer}</p>
          <h2 className="text-2xl font-black">{car.name}</h2>
        </div>
        <div className="absolute bottom-4 right-4 text-right">
          <p className="text-3xl font-black text-gradient">{completionPercent}%</p>
        </div>
      </div>

      {/* Parts grid by category */}
      <div className="space-y-6 max-w-lg mx-auto">
        {grouped.map(({ category, label, parts }) => (
          <div key={category}>
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">{label}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {parts.map((part) => {
                const assembled = partsAssembled[part.id - 1];
                return (
                  <div
                    key={part.id}
                    className={`relative flex items-center gap-2 px-3 py-3 rounded-xl border transition-all duration-300 ${
                      assembled
                        ? 'bg-primary/10 border-primary/30 animate-assemble'
                        : 'bg-muted/30 border-border/30'
                    }`}
                  >
                    {assembled ? (
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    ) : (
                      <Lock className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
                    )}
                    <span className={`text-xs font-medium ${assembled ? 'text-foreground' : 'text-muted-foreground/60'}`}>
                      {part.name}
                    </span>
                    <span className="absolute top-1 right-2 text-[10px] text-muted-foreground/30">
                      D{part.id}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarProgress;
