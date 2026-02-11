import { useAppState } from '@/lib/AppContext';
import { getActiveCycle } from '@/lib/storage';
import { getCarTemplate, CATEGORY_LABELS } from '@/lib/cars';
import type { PartCategory } from '@/lib/types';
import { Check, Lock, Wrench } from 'lucide-react';

import porscheImg from '@/assets/porsche-911-gt3rs.jpg';
import bmwImg from '@/assets/bmw-m5-cs.jpg';
import lamboImg from '@/assets/lamborghini-huracan-sto.jpg';

const carImages: Record<string, string> = {
  'porsche-911-gt3rs': porscheImg,
  'bmw-m5-cs': bmwImg,
  'lamborghini-huracan-sto': lamboImg,
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
  const completionPercent = (assembledCount / 30) * 100;
  const img = carImages[car.id];
  const isComplete = assembledCount === 30;

  // Get only the parts that have been assembled
  const assembledParts = car.parts.filter((_, i) => partsAssembled[i]);
  const nextPart = car.parts.find((_, i) => !partsAssembled[i]);

  // Generate reveal strips — 6 columns x 5 rows = 30 cells
  const COLS = 6;
  const ROWS = 5;

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
            <p className="text-3xl font-black text-gradient">{assembledCount}<span className="text-base text-muted-foreground font-medium">/30</span></p>
            <p className="text-xs text-muted-foreground">parts assembled</p>
          </div>
        </div>

        {/* Car reveal grid */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-6 bg-card border border-border/50">
          {/* Base: fully dark silhouette */}
          <div className="absolute inset-0 bg-background z-0" />

          {/* The car image, only visible through revealed cells */}
          <div className="absolute inset-0 z-10">
            <div
              className="relative w-full h-full"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${COLS}, 1fr)`,
                gridTemplateRows: `repeat(${ROWS}, 1fr)`,
              }}
            >
              {Array.from({ length: 30 }).map((_, i) => {
                const revealed = partsAssembled[i];
                const col = i % COLS;
                const row = Math.floor(i / COLS);

                return (
                  <div
                    key={i}
                    className="relative overflow-hidden"
                    style={{
                      transition: 'opacity 0.6s ease, filter 0.6s ease',
                      opacity: revealed ? 1 : 0,
                    }}
                  >
                    {/* Each cell shows its portion of the full car image */}
                    <div
                      className="absolute"
                      style={{
                        width: `${COLS * 100}%`,
                        height: `${ROWS * 100}%`,
                        left: `${-col * 100}%`,
                        top: `${-row * 100}%`,
                      }}
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Grid lines overlay for style */}
          <div
            className="absolute inset-0 z-20 pointer-events-none"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${COLS}, 1fr)`,
              gridTemplateRows: `repeat(${ROWS}, 1fr)`,
            }}
          >
            {Array.from({ length: 30 }).map((_, i) => {
              const revealed = partsAssembled[i];
              return (
                <div
                  key={i}
                  className={`border transition-all duration-500 ${
                    revealed
                      ? 'border-primary/10'
                      : 'border-border/20 bg-background/80'
                  }`}
                >
                  {!revealed && (
                    <div className="w-full h-full flex items-center justify-center">
                      <Lock className="w-3 h-3 text-muted-foreground/20" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Complete overlay */}
          {isComplete && (
            <div className="absolute inset-0 z-30 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
              <p className="relative text-2xl font-black text-gradient animate-count-up tracking-wide">BUILD COMPLETE</p>
            </div>
          )}
        </div>

        {/* Next part teaser */}
        {nextPart && !isComplete && (
          <div className="glass-panel rounded-2xl p-4 mb-6 flex items-center gap-4 border-primary/20">
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
              <Wrench className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Next Part — Day {assembledCount + 1}</p>
              <p className="font-bold">{nextPart.name}</p>
              <p className="text-xs text-primary capitalize">{nextPart.category}</p>
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
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/5 border border-primary/10 animate-assemble"
              >
                <Check className="w-4 h-4 text-primary flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{part.name}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{CATEGORY_LABELS[part.category]}</p>
                </div>
                <span className="text-xs text-muted-foreground">Day {part.id}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CarProgress;
