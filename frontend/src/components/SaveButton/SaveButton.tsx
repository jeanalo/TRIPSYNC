import { Bookmark, BookmarkCheck } from 'lucide-react';

interface SaveButtonProps {
  experienceId: number;
  savedIds: Set<number>;
  onToggle: (id: number) => void;
  variant?: 'card' | 'detail';
}

const variants = {
  card: {
    button: 'absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-white',
    iconSize: 16,
  },
  detail: {
    button: 'shrink-0 w-10 h-10 bg-[#0066D2]/10 hover:bg-[#0066D2]/20 mt-1',
    iconSize: 20,
  },
};

export default function SaveButton({
  experienceId,
  savedIds,
  onToggle,
  variant = 'card',
}: SaveButtonProps) {
  const { button, iconSize } = variants[variant];
  const isSaved = savedIds.has(experienceId);

  return (
    <button
      onClick={() => onToggle(experienceId)}
      className={`${button} rounded-full flex items-center justify-center shadow transition-colors cursor-pointer border-none`}
    >
      {isSaved ? (
        <BookmarkCheck size={iconSize} className="text-[#0066D2]" />
      ) : (
        <Bookmark size={iconSize} className="text-[#0066D2]" />
      )}
    </button>
  );
}
