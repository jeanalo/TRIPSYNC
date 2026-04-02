import type { ReactNode } from 'react';

const colorMap = {
  teal: {
    label: 'text-[#1CA698]',
    border: 'border-[#1CA698]',
    icon: 'text-[#1CA698]',
    text: 'text-[#1CA698]',
  },
  blue: {
    label: 'text-[#0066D2]',
    border: 'border-[#0066D2]',
    icon: 'text-[#0066D2]',
    text: 'text-[#0066D2]',
  },
} as const;

interface InfoFieldProps {
  label: string;
  value: string;
  icon: ReactNode;
  colorScheme?: 'teal' | 'blue';
}

export default function InfoField({
  label,
  value,
  icon,
  colorScheme = 'teal',
}: InfoFieldProps) {
  const colors = colorMap[colorScheme];

  return (
    <div className="flex flex-col gap-[6px]">
      <p className={`text-[20px] font-semibold leading-[36px] ${colors.label}`}>
        {label}
      </p>
      <div
        className={`flex h-[52px] items-center gap-5 rounded-[15px] border ${colors.border} bg-white pl-5 pr-6`}
      >
        <span className={`shrink-0 ${colors.icon}`}>{icon}</span>
        <span className={`text-[20px] leading-[36px] ${colors.text}`}>
          {value}
        </span>
      </div>
    </div>
  );
}
