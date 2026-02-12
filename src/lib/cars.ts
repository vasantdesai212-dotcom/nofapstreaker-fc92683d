import type { CarTemplate, CarPart, PartCategory, GarageItem } from './types';

const makeParts = (names: [string, PartCategory][]): CarPart[] =>
  names.map(([name, category], i) => ({ id: i + 1, name, category }));

const STANDARD_PARTS: [string, PartCategory][] = [
  // Day 1-3: Chassis
  ['Chassis Rails', 'chassis'],
  ['Subframe', 'chassis'],
  ['Engine Mount', 'chassis'],
  // Day 4-8: Engine
  ['Engine Block', 'engine'],
  ['Pistons', 'engine'],
  ['Crankshaft', 'engine'],
  ['Turbo / Supercharger', 'engine'],
  ['Exhaust Headers', 'engine'],
  // Day 9-13: Transmission
  ['Gearbox Housing', 'transmission'],
  ['Gear Set', 'transmission'],
  ['Clutch Assembly', 'transmission'],
  ['Driveshaft', 'transmission'],
  ['Differential', 'transmission'],
  // Day 14-18: Suspension
  ['Front Coilovers', 'suspension'],
  ['Rear Coilovers', 'suspension'],
  ['Control Arms', 'suspension'],
  ['Front Brakes', 'suspension'],
  ['Rear Brakes', 'suspension'],
  // Day 19-23: Wheels
  ['Front Left Wheel', 'wheels'],
  ['Front Right Wheel', 'wheels'],
  ['Rear Left Wheel', 'wheels'],
  ['Rear Right Wheel', 'wheels'],
  ['Tires', 'wheels'],
  // Day 24-27: Body
  ['Body Shell', 'body'],
  ['Doors', 'body'],
  ['Windshield', 'body'],
  ['Side Windows', 'body'],
  // Day 28-29: Aero
  ['Rear Spoiler', 'aero'],
  ['Front Splitter', 'aero'],
  // Day 30: Finish
  ['Final Paint & Badges', 'finish'],
];

export const CAR_TEMPLATES: CarTemplate[] = [
  // Tier 1 — available from start
  {
    id: 'porsche-911-gt3rs',
    name: '911 GT3 RS',
    manufacturer: 'Porsche',
    image: 'porsche-911-gt3rs',
    parts: makeParts(STANDARD_PARTS),
    tier: 1,
  },
  {
    id: 'bmw-m5-cs',
    name: 'M5 CS',
    manufacturer: 'BMW',
    image: 'bmw-m5-cs',
    parts: makeParts(STANDARD_PARTS),
    tier: 1,
  },
  {
    id: 'lamborghini-huracan-sto',
    name: 'Huracán STO',
    manufacturer: 'Lamborghini',
    image: 'lamborghini-huracan-sto',
    parts: makeParts(STANDARD_PARTS),
    tier: 1,
  },
  // Tier 2 — unlocked after completing all 3 tier-1 cars
  {
    id: 'ford-mustang-shelby',
    name: 'Shelby GT500',
    manufacturer: 'Ford',
    image: 'ford-mustang-shelby',
    parts: makeParts(STANDARD_PARTS),
    tier: 2,
  },
  {
    id: 'mercedes-g-wagon',
    name: 'G63 AMG',
    manufacturer: 'Mercedes',
    image: 'mercedes-g-wagon',
    parts: makeParts(STANDARD_PARTS),
    tier: 2,
  },
  {
    id: 'rolls-royce-wraith',
    name: 'Wraith',
    manufacturer: 'Rolls Royce',
    image: 'rolls-royce-wraith',
    parts: makeParts(STANDARD_PARTS),
    tier: 2,
  },
];
export const getCarTemplate = (id: string): CarTemplate | undefined =>
  CAR_TEMPLATES.find((c) => c.id === id);

/** Return the highest tier the user has fully unlocked + the next tier. */
export const getAvailableCars = (garage: GarageItem[]): CarTemplate[] => {
  const completedIds = new Set(garage.map((g) => g.carTemplateId));

  // Find the highest tier where ALL cars of that tier are completed
  const tiers = [...new Set(CAR_TEMPLATES.map((c) => c.tier))].sort((a, b) => a - b);
  let maxUnlockedTier = 1; // tier 1 always available
  for (const tier of tiers) {
    const tierCars = CAR_TEMPLATES.filter((c) => c.tier === tier);
    const allDone = tierCars.every((c) => completedIds.has(c.id));
    if (allDone && tier < tiers[tiers.length - 1]) {
      maxUnlockedTier = tier + 1;
    }
  }
  return CAR_TEMPLATES.filter((c) => c.tier <= maxUnlockedTier);
};

export const CATEGORY_COLORS: Record<PartCategory, string> = {
  chassis: 'hsl(0 0% 50%)',
  engine: 'hsl(24 100% 50%)',
  transmission: 'hsl(45 100% 50%)',
  suspension: 'hsl(200 80% 50%)',
  wheels: 'hsl(280 60% 55%)',
  body: 'hsl(142 71% 45%)',
  aero: 'hsl(340 80% 55%)',
  finish: 'hsl(24 100% 50%)',
};

export const CATEGORY_LABELS: Record<PartCategory, string> = {
  chassis: 'Chassis',
  engine: 'Power Unit',
  transmission: 'Drivetrain',
  suspension: 'Suspension & Brakes',
  wheels: 'Wheels & Tires',
  body: 'Body Panels',
  aero: 'Aerodynamics',
  finish: 'Final Paint',
};
