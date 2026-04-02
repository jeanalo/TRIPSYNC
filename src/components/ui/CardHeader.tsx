import type { ReactNode } from 'react';

interface CardHeaderProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
}

export default function CardHeader({ icon, title, subtitle }: CardHeaderProps) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <div className="flex h-[50px] w-[50px] items-center justify-center rounded-[12px] bg-[#0066D2]">
        <span className="text-white">{icon}</span>
      </div>
      <div>
        <h2 className="text-[22px] font-bold leading-[28px] text-[#0066D2]">
          {title}
        </h2>
        {subtitle && (
          <p className="text-[14px] leading-[20px] text-[#0066D2]/70">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
