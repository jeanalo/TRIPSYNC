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

interface FormFieldProps {
  label: string;
  icon: ReactNode;
  colorScheme?: 'teal' | 'blue';
  value?: string;
  children?: ReactNode;
  error?: string;
}

export default function FormField({
  label,
  icon,
  colorScheme = 'teal',
  value,
  children,
  error,
}: FormFieldProps) {
  const colors = colorMap[colorScheme];

  return (
    <div className="flex flex-col gap-[6px]">
      <label className={`text-[20px] font-semibold leading-[36px] ${colors.label}`}>
        {label}
      </label>
      <div
        className={`flex h-[52px] items-center gap-5 rounded-[15px] border ${error ? 'border-red-400' : colors.border} bg-white pl-5 pr-6`}
      >
        <span className={`shrink-0 ${error ? 'text-red-400' : colors.icon}`}>{icon}</span>
        {value !== undefined ? (
          <span className={`text-[20px] leading-[36px] ${colors.text}`}>
            {value}
          </span>
        ) : (
          children
        )}
      </div>
      {error && <span className="pl-1 text-[13px] text-red-500">{error}</span>}
    </div>
  );
}