import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Plane, Users, Star, BarChart3, User, X } from 'lucide-react';
import { useAuth } from '../../../context/AuthProvider';

const adminNavItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/trips', label: 'Trips', icon: Plane },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/experiences', label: 'Experiences', icon: Star },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/profile', label: 'Profile', icon: User },
];

interface AdminSidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export default function AdminSidebar({ isMobileOpen, onMobileClose }: AdminSidebarProps) {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    onMobileClose();
  }, [location.pathname]);

  return (
    <>
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[240px] flex-col bg-white border-r border-[#e0e0e0] transition-transform duration-300 lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          className="lg:hidden absolute top-4 right-4 text-[#0066D2] p-2 bg-transparent border-none cursor-pointer"
          onClick={onMobileClose}
          aria-label="Close menu"
        >
          <X size={22} />
        </button>

        <div className="px-6 pt-7 pb-5">
          <Link to="/admin" className="flex items-center no-underline">
            <img src="/logo.png" alt="TripSync logo" className="h-7" />
          </Link>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-4">
          {adminNavItems.map((item) => {
            const isActive =
              item.to === '/admin'
                ? location.pathname === '/admin'
                : location.pathname.startsWith(item.to);

            const Icon = item.icon;

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-[14px] font-medium no-underline transition-all duration-200 ${
                  isActive
                    ? 'text-[#1CA698] bg-[#1CA698]/8'
                    : 'text-[#0066D2] hover:text-[#1CA698] hover:bg-[#1CA698]/5'
                }`}
              >
                <Icon size={20} strokeWidth={2} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mx-0 border-t border-[#e0e0e0]" />

        <div className="flex items-center gap-3 px-5 py-4">
          <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-[#1CA698]">
            <User size={18} className="text-white" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[13px] font-medium leading-tight truncate text-[#0066D2]">
              {user?.name || 'Admin User'}
            </span>
            <span className="text-[11px] leading-tight truncate text-[#0066D2]/60">
              {user?.email || 'admin@tripsync.com'}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
