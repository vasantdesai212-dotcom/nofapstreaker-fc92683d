import { useAppState } from '@/lib/AppContext';
import { BarChart3, Flame, Trophy, Calendar } from 'lucide-react';

const Insights = () => {
  const { state } = useAppState();
  const { profile, cycles, garage } = state;

  const completedCycles = cycles.filter((c) => c.status === 'completed').length;
  const failedCycles = cycles.filter((c) => c.status === 'failed').length;
  const totalCycles = cycles.length;

  // Calculate avg day reached on failed cycles
  const avgDayFailed = failedCycles > 0
    ? Math.round(
        cycles
          .filter((c) => c.status === 'failed')
          .reduce((sum, c) => sum + (c.dayIndex - 1), 0) / failedCycles
      )
    : 0;

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
