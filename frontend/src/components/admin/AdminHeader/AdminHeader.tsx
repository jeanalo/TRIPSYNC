import { Menu } from 'lucide-react';

interface AdminHeaderProps {
  onMenuToggle: () => void;
}

export default function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 lg:px-8 py-4 bg-[#F5F7FA]">
     
      <button
        className="lg:hidden p-2 bg-transparent border-none cursor-pointer text-[#0066D2]"
        onClick={onMenuToggle}
        aria-label="Toggle menu"
      >
        <Menu size={26} />
      </button>

      
      <div className="hidden lg:block" />
    </header>
  );
}