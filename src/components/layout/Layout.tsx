import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Moon,
  Wallet,
  CalendarDays,
  Map,
  User,
  Menu,
  X,
  Plane,
} from 'lucide-react';
import { useState } from 'react';
import { useTravel } from '../../context/TravelContext';
import { motion, AnimatePresence } from 'motion/react';

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useTravel();
  const navigate = useNavigate();

  const navItems = [
    { to: '/app', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/app/setup', icon: Plane, label: 'Trip Setup' },
    { to: '/app/jet-lag', icon: Moon, label: 'Jet Lag' },
    { to: '/app/budget', icon: Wallet, label: 'Budget' },
    { to: '/app/schedule', icon: CalendarDays, label: 'Schedule' },
    { to: '/app/experiences', icon: Map, label: 'Experiences' },
    { to: '/app/profile', icon: User, label: 'Profile' },
  ];

  const bottomNavItems = [
    { to: '/app', icon: LayoutDashboard, label: 'Home', end: true },
    { to: '/app/budget', icon: Wallet, label: 'Budget' },
    { to: '/app/schedule', icon: CalendarDays, label: 'Schedule' },
    { to: '/app/experiences', icon: Map, label: 'Explore' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex font-sans pb-20 lg:pb-0">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-background border-r border-border p-6 fixed h-full z-10">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
            <Plane className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">TripSync</h1>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-secondary text-secondary-foreground shadow-md'
                    : 'text-foreground/70 hover:bg-white/5 hover:text-foreground'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-border">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center text-card-foreground">
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name || 'Traveler'}</p>
              <p className="text-xs text-foreground/60 truncate">
                {user?.email || 'travel@example.com'}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border px-6 py-4 flex items-center justify-between z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
            <Plane className="w-4 h-4" />
          </div>
          <h1 className="text-lg font-bold text-foreground">TripSync</h1>
        </div>
        <NavLink
          to="/app/profile"
          className="w-8 h-8 rounded-full bg-card flex items-center justify-center text-card-foreground"
        >
          <User className="w-4 h-4" />
        </NavLink>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border z-40 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <nav className="flex items-center justify-around p-2">
          {bottomNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                  isActive
                    ? 'text-primary scale-110 font-bold'
                    : 'text-foreground/60 hover:text-foreground'
                }`
              }
            >
              <item.icon className="w-6 h-6" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          ))}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
              mobileMenuOpen
                ? 'text-primary scale-110 font-bold'
                : 'text-foreground/60 hover:text-foreground'
            }`}
          >
            <Menu className="w-6 h-6" />
            <span className="text-[10px] font-medium">Menu</span>
          </button>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="lg:hidden fixed inset-0 z-[60] bg-background flex flex-col"
          >
            <div className="flex flex-col h-full p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-foreground">Menu</h2>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 bg-white/5 rounded-full text-foreground hover:bg-white/10"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="space-y-2 flex-1 overflow-y-auto pb-20">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${
                        isActive
                          ? 'bg-secondary text-secondary-foreground'
                          : 'text-foreground/80 hover:bg-white/5'
                      }`
                    }
                  >
                    <item.icon className="w-6 h-6" />
                    <span className="text-lg font-medium">{item.label}</span>
                  </NavLink>
                ))}
              </nav>

              <div className="pt-6 border-t border-border mt-auto">
                <div className="flex items-center gap-4 p-4 bg-card rounded-2xl">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-card-foreground">
                      {user?.name || 'Traveler'}
                    </p>
                    <p className="text-sm text-card-foreground/60">
                      {user?.email || 'user@example.com'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 min-h-screen pt-20 lg:pt-0 p-4 lg:p-10 w-full mx-auto pb-24 lg:pb-10">
        <Outlet />
      </main>
    </div>
  );
}
