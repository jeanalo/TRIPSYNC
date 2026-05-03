import type { ElementType } from 'react';
import { FileText, Trash2 } from 'lucide-react';
import CardHeader from '../CardHeader/CardHeader';

interface TransactionItemProps {
  icon?: ElementType;
  category: string;
  description: string;
  amount: number;
  showDivider?: boolean;
  onDelete?: () => void;
}

export default function TransactionItem({
  icon: Icon = FileText,
  category,
  description,
  amount,
  showDivider = false,
  onDelete,
}: TransactionItemProps) {
  return (
    <div>
      {showDivider && <div className="mb-5 h-[1px] bg-[#0066D2]/15" />}
      <div className="flex items-center justify-between">
        <CardHeader
          icon={<Icon size={24} />}
          title={category}
          subtitle={description}
          size="sm"
        />
        <div className="flex items-center gap-3">
          <span className="text-[20px] font-bold text-[#E53935]">
            -${amount.toFixed(2)}
          </span>
          {onDelete && (
            <button
              onClick={onDelete}
              className="flex items-center justify-center rounded-full p-1.5 text-[#E53935]/50 hover:text-[#E53935] hover:bg-[#E53935]/10 transition-colors border-none bg-transparent cursor-pointer"
              title="Delete expense"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
