import type { PartContent } from '@/lib/partsContent';
import type { PartCategory } from '@/lib/types';
import { CATEGORY_LABELS } from '@/lib/cars';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Info, Target, Wrench, Zap } from 'lucide-react';

import chassisImg from '@/assets/parts/chassis.jpg';
import engineImg from '@/assets/parts/engine.jpg';
import transmissionImg from '@/assets/parts/transmission.jpg';
import suspensionImg from '@/assets/parts/suspension.jpg';
import wheelsImg from '@/assets/parts/wheels.jpg';
import bodyImg from '@/assets/parts/body.jpg';
import aeroImg from '@/assets/parts/aero.jpg';
import finishImg from '@/assets/parts/finish.jpg';

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

interface Props {
  content: PartContent | null;
  category: PartCategory | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PartDetailSheet = ({ content, category, open, onOpenChange }: Props) => {
  if (!content || !category) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[85vh] overflow-y-auto pb-8">
        <SheetHeader className="text-left pb-2">
          <SheetTitle className="text-lg font-black">{content.ui_hint}</SheetTitle>
        </SheetHeader>

        {/* Hero image */}
        <div className="w-full h-32 rounded-xl overflow-hidden mb-4 border border-border/30">
          <img
            src={partImages[category]}
            alt={content.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Day & Category badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold uppercase tracking-widest bg-primary/10 text-primary px-2.5 py-1 rounded-full">
            Day {content.day_index}
          </span>
          <span className="text-xs font-medium uppercase tracking-widest bg-muted px-2.5 py-1 rounded-full text-muted-foreground">
            {CATEGORY_LABELS[category]}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-foreground/90 leading-relaxed mb-4">
          {content.description}
        </p>

        {/* Technical Summary */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Wrench className="w-3.5 h-3.5 text-muted-foreground" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Technical</h3>
          </div>
          <ul className="space-y-1.5">
            {content.technical_summary.map((bullet, i) => (
              <li key={i} className="text-xs text-muted-foreground flex gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Motivation */}
        <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 mb-4">
          <div className="flex items-center gap-1.5 mb-1">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-primary">Motivation</h3>
          </div>
          <p className="text-sm font-semibold text-foreground">{content.motivation}</p>
        </div>

        {/* Micro Task */}
        <div className="bg-muted/50 border border-border/30 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Target className="w-3.5 h-3.5 text-muted-foreground" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Micro Task</h3>
          </div>
          <p className="text-sm font-medium text-foreground">{content.micro_task}</p>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PartDetailSheet;
