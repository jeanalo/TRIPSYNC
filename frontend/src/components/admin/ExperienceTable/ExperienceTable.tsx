import { Edit2, Trash2, Eye, Star } from 'lucide-react';
import type { AdminExperience } from '@/types/admin.types';

interface ExperienceTableProps {
  experiences: AdminExperience[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

export default function ExperienceTable({
  experiences,
  onEdit,
  onDelete,
  onView,
}: ExperienceTableProps) {
  if (experiences.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-[#e0e0e0]">
        <div className="h-16 w-16 rounded-full bg-[#f5f7fa] flex items-center justify-center mb-4">
          <Star size={32} className="text-[#ccc]" />
        </div>
        <p className="text-[16px] font-semibold text-[#333]">No experiences found</p>
        <p className="text-[14px] text-[#999] mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#e0e0e0] overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f5f7fa] border-bottom border-[#e0e0e0]">
              <th className="px-6 py-4 text-[13px] font-bold text-[#0066D2] uppercase tracking-wider">Experience</th>
              <th className="px-6 py-4 text-[13px] font-bold text-[#0066D2] uppercase tracking-wider">City</th>
              <th className="px-6 py-4 text-[13px] font-bold text-[#0066D2] uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-[13px] font-bold text-[#0066D2] uppercase tracking-wider">Price</th>
              <th className="px-6 py-4 text-[13px] font-bold text-[#0066D2] uppercase tracking-wider">Rating</th>
              <th className="px-6 py-4 text-[13px] font-bold text-[#0066D2] uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-[13px] font-bold text-[#0066D2] uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e0e0e0]">
            {experiences.map((exp) => (
              <tr key={exp.id} className="hover:bg-[#fcfcfc] transition-colors duration-150 group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg overflow-hidden bg-[#eee] flex-shrink-0">
                      <img src={exp.imageUrl} alt={exp.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[14px] font-bold text-[#333] truncate">{exp.name}</span>
                      <span className="text-[11px] text-[#999]">{exp.id}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[14px] text-[#666]">{exp.city}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-full bg-[#f0f7f6] text-[#1CA698] text-[12px] font-medium border border-[#1CA698]/10">
                    {exp.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[14px] font-bold text-[#333]">
                    {exp.price === 0 ? 'Free' : `$${exp.price}`}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="fill-[#F5A623] text-[#F5A623]" />
                    <span className="text-[14px] font-medium text-[#333]">{exp.rating}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[12px] font-medium border ${
                    exp.status === 'active' 
                      ? 'bg-[#eafaf1] text-[#27ae60] border-[#27ae60]/10' 
                      : 'bg-[#fff9e6] text-[#f1c40f] border-[#f1c40f]/10'
                  }`}>
                    {exp.status.charAt(0).toUpperCase() + exp.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => onView(exp.id)}
                      className="p-1.5 text-[#0066D2] hover:bg-[#0066D2]/5 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => onEdit(exp.id)}
                      className="p-1.5 text-[#1CA698] hover:bg-[#1CA698]/5 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(exp.id)}
                      className="p-1.5 text-[#e74c3c] hover:bg-[#e74c3c]/5 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
