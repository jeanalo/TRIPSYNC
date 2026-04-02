import type { ReactNode } from 'react';

interface CardHeaderProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
}

export default function CardHeader({ icon, title, subtitle }: CardHeaderProps) {
  return (
    <div className="flex items-center gap-5">
      <div className="flex h-[55px] w-[55px] shrink-0 items-center justify-center rounded-[15px] bg-[#0066D2]">
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
