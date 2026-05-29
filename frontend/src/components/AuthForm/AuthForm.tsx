import React from 'react';

interface AuthFormProps {
  id?: string;
  heading: string;
  headingId?: string;
  subtitle?: string;
  badge?: React.ReactNode;
  footer?: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  error?: string;
  children: React.ReactNode;
}

export default function AuthForm({
  id,
  heading,
  headingId,
  subtitle,
  badge,
  footer,
  onSubmit,
  error,
  children,
}: AuthFormProps) {
  return (
    <div className="flex h-screen w-screen" id={id}>
      <div className="hidden md:block w-1/2 h-full">
        <img
          src="/banner-tripsync.svg"
          alt="TripSync Banner"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex w-full md:w-1/2 items-center justify-center bg-white px-6 overflow-y-auto">
        <div className="w-full max-w-[400px] py-8">
          {badge && <div className="flex justify-center mb-6">{badge}</div>}

          <h2
            className={`text-center text-[36px] md:text-[48px] font-bold text-[#0066D2] ${subtitle ? 'mb-2' : 'mb-8'}`}
            id={headingId}
          >
            {heading}
          </h2>
          {subtitle && (
            <p className="text-center text-[16px] text-[#666] mb-8">{subtitle}</p>
          )}

          <form onSubmit={onSubmit} className="flex flex-col gap-5">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-[14px] text-center font-medium">
                {error}
              </div>
            )}
            {children}
          </form>

          {footer && (
            <p className="mt-6 text-center text-[16px] text-[#171717]">{footer}</p>
          )}
        </div>
      </div>
    </div>
  );
}
