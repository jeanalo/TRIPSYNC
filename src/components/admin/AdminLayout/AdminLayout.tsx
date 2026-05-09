import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../AdminSidebar/AdminSidebar';
import AdminHeader from '../AdminHeader/AdminHeader';

interface AdminLayoutContext {
  openCreateModal: () => void;
}

export default function AdminLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCreateModalRequested, setIsCreateModalRequested] = useState(false);

  const handleCreateExperience = () => {
    setIsCreateModalRequested(true);
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-[#F5F7FA]">
      <AdminSidebar
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
        onCreateExperience={handleCreateExperience}
      />

     
      <div className="lg:ml-[240px] flex-1 flex flex-col min-w-0">
        <AdminHeader onMenuToggle={() => setIsMobileMenuOpen(true)} />

        <main className="flex-1 px-4 lg:px-8 pb-8">
          <Outlet
            context={{
              openCreateModal: handleCreateExperience,
              isCreateModalRequested,
              resetCreateModalRequest: () => setIsCreateModalRequested(false),
            }}
          />
        </main>
      </div>
    </div>
  );
}


export type { AdminLayoutContext };
