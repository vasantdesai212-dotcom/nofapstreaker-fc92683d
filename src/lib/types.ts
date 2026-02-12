export interface CarTemplate {
  id: string;
  name: string;
  manufacturer: string;
  image: string;
  parts: CarPart[];
  tier: number;
}

export interface CarPart {
  id: number;
  name: string;
  category: PartCategory;
}

export type PartCategory =
  | 'chassis'
  | 'engine'
  | 'transmission'
  | 'suspension'
  | 'wheels'
  | 'body'
  | 'aero'
  | 'finish';

export interface Cycle {
  id: string;
  startDate: string;
  dayIndex: number;
  carTemplateId: string;
  partsAssembled: boolean[];
  status: 'active' | 'completed' | 'failed';
  failedDate?: string;
}

export interface GarageItem {
  id: string;
  carTemplateId: string;
  startDate: string;
  completedDate: string;
  streakDays: number;
}

export interface UserProfile {
  id: string;
  displayName: string;
  onboardingComplete: boolean;
  bestStreak: number;
  totalCompletedCars: number;
  currentCycleId: string | null;
  selectedCarTemplateId: string;
}

export interface AppState {
  profile: UserProfile;
  cycles: Cycle[];
  garage: GarageItem[];
}
