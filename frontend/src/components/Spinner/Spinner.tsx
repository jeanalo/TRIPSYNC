interface SpinnerProps {
  size?: 'sm' | 'md';
}

const sizeMap = {
  sm: 'h-8 w-8 border-3',
  md: 'h-10 w-10 border-4',
};

export default function Spinner({ size = 'md' }: SpinnerProps) {
  return (
    <div
      className={`animate-spin rounded-full border-[#0066D2] border-t-transparent ${sizeMap[size]}`}
    />
  );
}
