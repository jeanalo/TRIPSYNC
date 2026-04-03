import type { ReactNode } from 'react';

interface IconBadgeProps {
  children: ReactNode;
  color?: 'blue' | 'teal';
  size?: 'md' | 'lg';
  className?: string;
}

const colorMap = {
  blue: 'bg-[#0066D2]',
  teal: 'bg-[#6CD9CE]',
};

const sizeMap = {
  md: 'h-[45px] w-[45px]',
  lg: 'h-[55px] w-[55px]',
};

export default function IconBadge({
  children,
  color = 'blue',
  size = 'lg',
  className = '',
}: IconBadgeProps) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-[15px] ${colorMap[color]} ${sizeMap[size]} ${className}`}
    >
      <span className="text-white">{children}</span>
    </div>
  );
}
