import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  message: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon, message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
      {icon && (
        <div className="text-[#0066D2]/30">{icon}</div>
      )}
      <p className="text-[18px] text-[#0066D2]/50">{message}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
