import { useState } from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import AdminSidebar from '../AdminSidebar/AdminSidebar';
import { useAuth } from '../../../context/AuthProvider';

export default function AdminLayout() {
  const { user, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (loading) return null;
  if (!user) return <Navigate to="/admin/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-white">
      <div className="flex lg:hidden items-center justify-between p-4 bg-white border-b border-[#e0e0e0] sticky top-0 z-30">
        <button onClick={() => setIsMobileMenuOpen(true)}>
          <Menu size={28} className="text-[#0066D2]" />
        </button>
        <Link to="/admin" className="flex items-center no-underline">
          <img src="/logo.png" alt="TripSync logo" className="h-8" />
        </Link>
      </div>

      <AdminSidebar
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      <main className="lg:ml-[280px] flex-1 p-0 flex flex-col min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
