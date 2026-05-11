import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AdminSidebar from '../AdminSidebar/AdminSidebar';
import AdminHeader from '../AdminHeader/AdminHeader';
import { useAuth } from '../../../providers/AuthProvider';

export default function AdminLayout() {
  const { user, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (loading) return null;
  if (!user) return <Navigate to="/admin/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-[#F5F7FA]">
      <AdminSidebar
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="lg:ml-[240px] flex-1 flex flex-col min-w-0">
        <AdminHeader onMenuToggle={() => setIsMobileMenuOpen(true)} />

        <main className="flex-1 px-4 lg:px-8 pb-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
