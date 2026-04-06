import type { ElementType } from 'react';
import { FileText } from 'lucide-react';
import CardHeader from '../CardHeader/CardHeader';

interface TransactionItemProps {
  icon?: ElementType;
  category: string;
  description: string;
  amount: number;
  showDivider?: boolean;
}

export default function TransactionItem({
  icon: Icon = FileText,
  category,
  description,
  amount,
  showDivider = false,
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
        <span className="text-[20px] font-bold text-[#E53935]">
          -${amount.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
