import { NavLink, useLocation } from 'react-router-dom';
import { Home, Layers, Trophy, BarChart3, Settings, Gamepad2 } from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'Today' },
  { to: '/progress', icon: Layers, label: 'Builds' },
  { to: '/garage', icon: Trophy, label: 'Garage' },
  { to: '/game', icon: Gamepad2, label: 'Drive' },
  { to: '/insights', icon: BarChart3, label: 'Stats' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card/90 backdrop-blur-xl border-t border-border/50">
      <div className="flex items-center justify-around max-w-lg mx-auto py-2 px-2">
        {navItems.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <NavLink
              key={to}
              to={to}
              className={`flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-all ${
                active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{label}</span>
              {active && <div className="w-1 h-1 rounded-full bg-primary mt-0.5" />}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
