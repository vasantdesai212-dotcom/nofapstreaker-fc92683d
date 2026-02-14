export interface UrgeLog {
  id: string;
  timestamp: string; // ISO string
  intensity: number; // 1-10
  triggers: string[];
  otherTrigger?: string;
  rounds: number; // how many timer rounds completed
  survived: boolean;
  xpEarned: number;
}

export interface UrgeStats {
  totalUrges: number;
  avgIntensity: number;
  mostCommonTrigger: string;
  mostVulnerableHour: number;
  weeklyUrges: number;
  weeklyAvgIntensity: number;
  heatmap: number[]; // 24 slots, one per hour
  triggerCounts: Record<string, number>;
  totalXP: number;
  badges: string[];
}

const URGE_STORAGE_KEY = 'nofap-urge-logs';

export const TRIGGER_OPTIONS = [
  'Boredom',
  'Stress',
  'Late night',
  'Social media',
  'Explicit content',
  'Loneliness',
] as const;

export const loadUrgeLogs = (): UrgeLog[] => {
  try {
    const raw = localStorage.getItem(URGE_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as UrgeLog[];
  } catch {
    return [];
  }
};

export const saveUrgeLog = (log: UrgeLog): void => {
  const logs = loadUrgeLogs();
  logs.push(log);
  localStorage.setItem(URGE_STORAGE_KEY, JSON.stringify(logs));
};

export const computeUrgeStats = (logs: UrgeLog[]): UrgeStats => {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const weeklyLogs = logs.filter((l) => new Date(l.timestamp) >= weekAgo);

  // Heatmap: count per hour
  const heatmap = Array(24).fill(0) as number[];
  const triggerCounts: Record<string, number> = {};

  for (const log of logs) {
    const hour = new Date(log.timestamp).getHours();
    heatmap[hour]++;
    for (const t of log.triggers) {
      triggerCounts[t] = (triggerCounts[t] || 0) + 1;
    }
  }

  const mostCommonTrigger =
    Object.entries(triggerCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

  const mostVulnerableHour = heatmap.indexOf(Math.max(...heatmap));

  const avgIntensity =
    logs.length > 0
      ? Math.round((logs.reduce((s, l) => s + l.intensity, 0) / logs.length) * 10) / 10
      : 0;

  const weeklyAvgIntensity =
    weeklyLogs.length > 0
      ? Math.round((weeklyLogs.reduce((s, l) => s + l.intensity, 0) / weeklyLogs.length) * 10) / 10
      : 0;

  const totalXP = logs.reduce((s, l) => s + l.xpEarned, 0);
  const survivedCount = logs.filter((l) => l.survived).length;
  const badges: string[] = [];
  if (survivedCount >= 1) badges.push('Overheated But Survived');
  if (survivedCount >= 5) badges.push('Engine Hardened');
  if (survivedCount >= 10) badges.push('Fireproof');
  if (totalXP >= 100) badges.push('XP Century');

  return {
    totalUrges: logs.length,
    avgIntensity,
    mostCommonTrigger,
    mostVulnerableHour,
    weeklyUrges: weeklyLogs.length,
    weeklyAvgIntensity,
    heatmap,
    triggerCounts,
    totalXP,
    badges,
  };
};

export const formatHour = (h: number): string => {
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hr = h % 12 || 12;
  return `${hr} ${ampm}`;
};
