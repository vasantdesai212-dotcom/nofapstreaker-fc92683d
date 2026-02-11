import { useAppState } from '@/lib/AppContext';
import { getActiveCycle } from '@/lib/storage';
import { getCarTemplate, CATEGORY_LABELS } from '@/lib/cars';
import type { PartCategory } from '@/lib/types';
import { Check, Lock, Wrench } from 'lucide-react';

import porscheImg from '@/assets/porsche-911-gt3rs.jpg';
import bmwImg from '@/assets/bmw-m5-cs.jpg';
import lamboImg from '@/assets/lamborghini-huracan-sto.jpg';

import chassisImg from '@/assets/parts/chassis.jpg';
import engineImg from '@/assets/parts/engine.jpg';
import transmissionImg from '@/assets/parts/transmission.jpg';
import suspensionImg from '@/assets/parts/suspension.jpg';
import wheelsImg from '@/assets/parts/wheels.jpg';
import bodyImg from '@/assets/parts/body.jpg';
import aeroImg from '@/assets/parts/aero.jpg';
import finishImg from '@/assets/parts/finish.jpg';

const carImages: Record<string, string> = {
  'porsche-911-gt3rs': porscheImg,
  'bmw-m5-cs': bmwImg,
  'lamborghini-huracan-sto': lamboImg,
};

const partImages: Record<PartCategory, string> = {
  chassis: chassisImg,
  engine: engineImg,
  transmission: transmissionImg,
  suspension: suspensionImg,
  wheels: wheelsImg,
  body: bodyImg,
  aero: aeroImg,
  finish: finishImg,
};

const CarProgress = () => {
  const { state } = useAppState();
  const cycle = getActiveCycle(state);
  const car = cycle
    ? getCarTemplate(cycle.carTemplateId)
    : getCarTemplate(state.profile.selectedCarTemplateId);

  if (!car) return null;

  const partsAssembled = cycle?.partsAssembled ?? Array(30).fill(false);
  const assembledCount = partsAssembled.filter(Boolean).length;
  const isComplete = assembledCount === 30;
  const img = carImages[car.id];

  const assembledParts = car.parts.filter((_, i) => partsAssembled[i]);
  const nextPart = car.parts.find((_, i) => !partsAssembled[i]);

  return (
    <div className="px-6 pt-6 pb-28">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">{car.manufacturer}</p>
            <h1 className="text-2xl font-black">{car.name}</h1>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black text-gradient">
              {assembledCount}<span className="text-base text-muted-foreground font-medium">/30</span>
            </p>
            <p className="text-xs text-muted-foreground">parts assembled</p>
          </div>
        </div>

        {/* Full car reveal - only shown when complete */}
        {isComplete && (
          <div className="relative w-full rounded-2xl overflow-hidden mb-6 border border-primary/30 glow-orange">
            <img src={img} alt={`${car.manufacturer} ${car.name}`} className="w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent flex items-end justify-center pb-4">
              <p className="text-2xl font-black text-gradient animate-count-up tracking-wide">BUILD COMPLETE</p>
            </div>
          </div>
        )}

        {/* Parts grid — each cell shows the part category image when assembled */}
        {!isComplete && (
          <div
            className="grid grid-cols-5 sm:grid-cols-6 gap-1.5 mb-6"
          >
            {car.parts.map((part, i) => {
              const assembled = partsAssembled[i];
              const categoryImg = partImages[part.category];

              return (
                <div
                  key={part.id}
                  className={`relative aspect-square rounded-xl overflow-hidden border transition-all duration-500 ${
                    assembled
                      ? 'border-primary/40 glow-orange'
                      : 'border-border/30 bg-card'
                  }`}
                >
                  {assembled ? (
                    <div className="w-full h-full animate-assemble">
                      <img
                        src={categoryImg}
                        alt={part.name}
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent" />
                      <div className="absolute bottom-0.5 left-0 right-0 text-center">
                        <p className="text-[8px] sm:text-[9px] font-bold text-foreground leading-tight px-0.5 truncate">
                          {part.name}
                        </p>
                      </div>
                      <div className="absolute top-0.5 right-0.5">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-1 bg-muted/20">
                      <Lock className="w-3.5 h-3.5 text-muted-foreground/25" />
                      <p className="text-[8px] text-muted-foreground/30 font-medium">D{part.id}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Progress bar */}
        <div className="w-full mb-6">
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
              style={{ width: `${(assembledCount / 30) * 100}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            {Math.round((assembledCount / 30) * 100)}% complete
          </p>
        </div>

        {/* Next part teaser */}
        {nextPart && !isComplete && (
          <div className="glass-panel rounded-2xl p-4 mb-6 flex items-center gap-4 border-primary/20">
            <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-primary/20">
              <img
                src={partImages[nextPart.category]}
                alt={nextPart.name}
                className="w-full h-full object-cover opacity-50"
              />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Next Part — Day {assembledCount + 1}</p>
              <p className="font-bold">{nextPart.name}</p>
              <p className="text-xs text-primary capitalize">{CATEGORY_LABELS[nextPart.category]}</p>
            </div>
          </div>
        )}

        {/* Assembled parts log */}
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
          Assembled Parts
        </h2>

        {assembledParts.length === 0 ? (
          <p className="text-muted-foreground text-sm py-4">No parts assembled yet. Hit Success on the Today screen to start building.</p>
        ) : (
          <div className="space-y-2">
            {assembledParts.map((part) => (
              <div
                key={part.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-primary/5 border border-primary/10"
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={partImages[part.category]} alt={part.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{part.name}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{CATEGORY_LABELS[part.category]}</p>
                </div>
                <span className="text-xs text-muted-foreground flex-shrink-0">Day {part.id}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CarProgress;
