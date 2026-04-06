import type { ReactNode } from 'react';
import IconBadge from '../IconBadge/IconBadge';

interface CardHeaderProps {
  icon: ReactNode;
  title: string;
  subtitle?: ReactNode;
  layout?: 'horizontal' | 'vertical';
  size?: 'default' | 'sm';
  colorScheme?: 'blue' | 'white';
  iconColor?: 'blue' | 'teal';
}

const sizeStyles = {
  default: {
    title: 'text-[22px] font-bold leading-[28px]',
    subtitle: 'text-[14px] leading-[20px]',
  },
  sm: {
    title: 'text-[20px] font-bold leading-[24px]',
    subtitle: 'text-[16px] leading-[24px]',
  },
};

const colorStyles = {
  blue: 'text-[#0066D2]',
  white: 'text-[#F5F5F5]',
};

export default function CardHeader({
  icon,
  title,
  subtitle,
  layout = 'horizontal',
  size = 'default',
  colorScheme = 'blue',
  iconColor = 'blue',
}: CardHeaderProps) {
  const isVertical = layout === 'vertical';
  const styles = sizeStyles[size];
  const textColor = colorStyles[colorScheme];

  return (
    <div
      className={`flex ${isVertical ? 'flex-col items-start gap-6' : 'items-center gap-5'}`}
    >
      <IconBadge color={iconColor}>{icon}</IconBadge>
      <div>
        <h2 className={`${styles.title} ${textColor}`}>
          {title}
        </h2>
        {subtitle && (
          <div className={`${styles.subtitle} ${textColor}`}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}

