import { useAppState } from '@/lib/AppContext';
import { BarChart3, Flame, Trophy, Calendar, ShieldAlert, Clock, Zap, Award } from 'lucide-react';
import { loadUrgeLogs, computeUrgeStats, formatHour } from '@/lib/urgeStorage';
import { useMemo } from 'react';

const Insights = () => {
  const { state } = useAppState();
  const { profile, cycles, garage } = state;

  const completedCycles = cycles.filter((c) => c.status === 'completed').length;
  const failedCycles = cycles.filter((c) => c.status === 'failed').length;
  const totalCycles = cycles.length;

  const avgDayFailed = failedCycles > 0
    ? Math.round(
        cycles
          .filter((c) => c.status === 'failed')
          .reduce((sum, c) => sum + (c.dayIndex - 1), 0) / failedCycles
      )
    : 0;

  const urgeLogs = useMemo(() => loadUrgeLogs(), []);
  const urgeStats = useMemo(() => computeUrgeStats(urgeLogs), [urgeLogs]);
  const maxHeatmapVal = Math.max(...urgeStats.heatmap, 1);

  const stats = [
    { icon: Flame, label: 'Best Streak', value: `${profile.bestStreak} days`, accent: true },
    { icon: Trophy, label: 'Cars Completed', value: String(garage.length), accent: false },
    { icon: Calendar, label: 'Total Cycles', value: String(totalCycles), accent: false },
    { icon: BarChart3, label: 'Avg. Fail Day', value: avgDayFailed > 0 ? `Day ${avgDayFailed}` : '—', accent: false },
  ];

  return (
    <div className="px-6 pt-6 pb-28">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-black">Insights</h1>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {stats.map(({ icon: Icon, label, value, accent }) => (
            <div key={label} className={`glass-panel rounded-2xl p-5 ${accent ? 'border-primary/30' : ''}`}>
              <Icon className={`w-5 h-5 mb-2 ${accent ? 'text-primary' : 'text-muted-foreground'}`} />
              <p className={`text-2xl font-black ${accent ? 'text-gradient' : ''}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Urge Analytics */}
        {urgeLogs.length > 0 && (
          <>
            <h2 className="text-xs font-bold uppercase tracking-widest text-destructive mb-3 flex items-center gap-2">
              <ShieldAlert className="w-3.5 h-3.5" /> Cold Engine Analytics
            </h2>

            {/* Weekly summary cards */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="glass-panel rounded-2xl p-4 border-destructive/20">
                <p className="text-2xl font-black text-destructive">{urgeStats.weeklyUrges}</p>
                <p className="text-xs text-muted-foreground">Urges This Week</p>
              </div>
              <div className="glass-panel rounded-2xl p-4">
                <p className="text-2xl font-black">{urgeStats.weeklyAvgIntensity}</p>
                <p className="text-xs text-muted-foreground">Avg Intensity</p>
              </div>
              <div className="glass-panel rounded-2xl p-4">
                <p className="text-lg font-bold">{urgeStats.mostCommonTrigger}</p>
                <p className="text-xs text-muted-foreground">Top Trigger</p>
              </div>
              <div className="glass-panel rounded-2xl p-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <p className="text-lg font-bold">{formatHour(urgeStats.mostVulnerableHour)}</p>
                </div>
                <p className="text-xs text-muted-foreground">Most Vulnerable</p>
              </div>
            </div>

            {/* Vulnerability insight */}
            {urgeLogs.length >= 3 && (
              <div className="glass-panel rounded-xl p-4 mb-4 border-destructive/20">
                <p className="text-sm text-foreground">
                  You experience <span className="font-bold text-destructive">
                    {Math.round((urgeStats.heatmap[urgeStats.mostVulnerableHour] / urgeStats.totalUrges) * 100)}%
                  </span> of urges around <span className="font-bold">{formatHour(urgeStats.mostVulnerableHour)}</span>.
                </p>
              </div>
            )}

            {/* Urge Heatmap */}
            <div className="glass-panel rounded-2xl p-4 mb-4">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Urge Heatmap (Hour)</p>
              <div className="grid grid-cols-12 gap-1">
                {urgeStats.heatmap.map((val, h) => (
                  <div key={h} className="flex flex-col items-center gap-0.5">
                    <div
                      className="w-full rounded-sm transition-colors"
                      style={{
                        height: '20px',
                        backgroundColor: val > 0
                          ? `hsl(0 72% 51% / ${0.15 + (val / maxHeatmapVal) * 0.85})`
                          : 'hsl(var(--muted))',
                      }}
                    />
                    {h % 3 === 0 && (
                      <span className="text-[8px] text-muted-foreground">{h}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* XP & Badges */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="glass-panel rounded-2xl p-4">
                <Zap className="w-5 h-5 mb-1 text-primary" />
                <p className="text-2xl font-black text-gradient">{urgeStats.totalXP}</p>
                <p className="text-xs text-muted-foreground">Total XP</p>
              </div>
              <div className="glass-panel rounded-2xl p-4">
                <Award className="w-5 h-5 mb-1 text-primary" />
                <p className="text-lg font-bold">{urgeStats.badges.length}</p>
                <p className="text-xs text-muted-foreground">Badges</p>
              </div>
            </div>

            {urgeStats.badges.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {urgeStats.badges.map((b) => (
                  <span key={b} className="px-3 py-1 rounded-lg bg-primary/10 border border-primary/30 text-primary text-xs font-semibold">
                    {b}
                  </span>
                ))}
              </div>
            )}
          </>
        )}

        {/* Cycle history */}
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Cycle History</h2>
        {cycles.length === 0 ? (
          <p className="text-muted-foreground text-sm">No cycles yet.</p>
        ) : (
          <div className="space-y-2">
            {[...cycles].reverse().slice(0, 20).map((cycle) => (
              <div key={cycle.id} className="glass-panel rounded-xl px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    cycle.status === 'completed' ? 'bg-success' :
                    cycle.status === 'failed' ? 'bg-destructive' : 'bg-primary animate-pulse'
                  }`} />
                  <div>
                    <p className="text-sm font-medium">{cycle.startDate}</p>
                    <p className="text-xs text-muted-foreground capitalize">{cycle.status}</p>
                  </div>
                </div>
                <p className="text-sm font-semibold">
                  Day {cycle.status === 'failed' ? cycle.dayIndex - 1 : cycle.dayIndex}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Insights;
