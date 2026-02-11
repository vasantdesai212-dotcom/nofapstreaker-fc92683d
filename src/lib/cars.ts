import type { CarTemplate, CarPart, PartCategory } from './types';

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
  {
    id: 'porsche-911-gt3rs',
    name: '911 GT3 RS',
    manufacturer: 'Porsche',
    image: 'porsche-911-gt3rs',
    parts: makeParts(STANDARD_PARTS),
  },
  {
    id: 'bmw-m5-cs',
    name: 'M5 CS',
    manufacturer: 'BMW',
    image: 'bmw-m5-cs',
    parts: makeParts(STANDARD_PARTS),
  },
  {
    id: 'lamborghini-huracan-sto',
    name: 'Huracán STO',
    manufacturer: 'Lamborghini',
    image: 'lamborghini-huracan-sto',
    parts: makeParts(STANDARD_PARTS),
  },
];

export const getCarTemplate = (id: string): CarTemplate | undefined =>
  CAR_TEMPLATES.find((c) => c.id === id);

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
