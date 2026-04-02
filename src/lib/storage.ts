import type { AppState, Cycle, GarageItem, UserProfile } from './types';

const STORAGE_KEY = 'nofap-car-streaker';

const defaultProfile: UserProfile = {
  id: crypto.randomUUID(),
  displayName: 'Driver',
  onboardingComplete: false,
  bestStreak: 0,
  totalCompletedCars: 0,
  currentCycleId: null,
  selectedCarTemplateId: 'porsche-911-gt3rs',
  resetMode: '24h',
};

const defaultState: AppState = {
  profile: defaultProfile,
  cycles: [],
  garage: [],
};

export const loadState = (): AppState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultState, profile: { ...defaultProfile, id: crypto.randomUUID() } };
    return JSON.parse(raw) as AppState;
  } catch {
    return { ...defaultState, profile: { ...defaultProfile, id: crypto.randomUUID() } };
  }
};

export const saveState = (state: AppState): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const getToday = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const startNewCycle = (state: AppState): AppState => {
  const cycle: Cycle = {
    id: crypto.randomUUID(),
    startDate: getToday(),
    dayIndex: 1,
    carTemplateId: state.profile.selectedCarTemplateId,
    partsAssembled: Array(30).fill(false),
    status: 'active',
  };
  const newState: AppState = {
    ...state,
    cycles: [...state.cycles, cycle],
    profile: { ...state.profile, currentCycleId: cycle.id },
  };
  saveState(newState);
  return newState;
};

export const getActiveCycle = (state: AppState): Cycle | undefined =>
  state.cycles.find((c) => c.id === state.profile.currentCycleId && c.status === 'active');

export const markSuccess = (state: AppState): AppState => {
  const cycle = getActiveCycle(state);
  if (!cycle) return state;

  const newParts = [...cycle.partsAssembled];
  newParts[cycle.dayIndex - 1] = true;

  const isComplete = cycle.dayIndex >= 30;
  const newDayIndex = isComplete ? 30 : cycle.dayIndex + 1;
  const newStatus = isComplete ? 'completed' as const : 'active' as const;

  const updatedCycle: Cycle = {
    ...cycle,
    partsAssembled: newParts,
    dayIndex: newDayIndex,
    status: newStatus,
    lastSuccessAt: new Date().toISOString(),
  };

  let newGarage = state.garage;
  let newProfile = { ...state.profile };

  if (isComplete) {
    const garageItem: GarageItem = {
      id: crypto.randomUUID(),
      carTemplateId: cycle.carTemplateId,
      startDate: cycle.startDate,
      completedDate: getToday(),
      streakDays: 30,
    };
    newGarage = [...state.garage, garageItem];
    newProfile.totalCompletedCars += 1;
    newProfile.currentCycleId = null;
  }

  const bestStreak = Math.max(newProfile.bestStreak, cycle.dayIndex);
  newProfile.bestStreak = bestStreak;

  const newState: AppState = {
    ...state,
    cycles: state.cycles.map((c) => (c.id === cycle.id ? updatedCycle : c)),
    garage: newGarage,
    profile: newProfile,
  };
  saveState(newState);
  return newState;
};

export const markFail = (state: AppState): AppState => {
  const cycle = getActiveCycle(state);
  if (!cycle) return state;

  const updatedCycle: Cycle = {
    ...cycle,
    status: 'failed',
    failedDate: getToday(),
  };

  const newProfile = {
    ...state.profile,
    bestStreak: Math.max(state.profile.bestStreak, cycle.dayIndex - 1),
    currentCycleId: null,
  };

  const newState: AppState = {
    ...state,
    cycles: state.cycles.map((c) => (c.id === cycle.id ? updatedCycle : c)),
    profile: newProfile,
  };
  saveState(newState);
  return newState;
};

export const todayAlreadyLogged = (state: AppState): boolean => {
  const cycle = getActiveCycle(state);
  if (!cycle) return false;
  if (!cycle.lastSuccessAt) return false;

  const mode = state.profile.resetMode ?? '24h';

  if (mode === 'midnight') {
    const lastDate = new Date(cycle.lastSuccessAt);
    const now = new Date();
    return (
      lastDate.getFullYear() === now.getFullYear() &&
      lastDate.getMonth() === now.getMonth() &&
      lastDate.getDate() === now.getDate()
    );
  }

  const elapsed = Date.now() - new Date(cycle.lastSuccessAt).getTime();
  return elapsed < 24 * 60 * 60 * 1000;
};
