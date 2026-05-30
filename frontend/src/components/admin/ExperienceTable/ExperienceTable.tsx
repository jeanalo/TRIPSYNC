import { Edit2, Trash2, Eye } from 'lucide-react';
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
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border-2 border-[#0066D2]">
        <p className="text-[16px] font-semibold text-[#0066D2]">No experiences found</p>
        <p className="text-[14px] text-[#0066D2]/60 mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-[#0066D2] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0066D2]">
              <th className="px-6 py-4 text-[13px] font-bold text-white uppercase tracking-wider">Experience</th>
              <th className="px-6 py-4 text-[13px] font-bold text-white uppercase tracking-wider">Location</th>
              <th className="px-6 py-4 text-[13px] font-bold text-white uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-[13px] font-bold text-white uppercase tracking-wider">Duration</th>
              <th className="px-6 py-4 text-[13px] font-bold text-white uppercase tracking-wider">Difficulty</th>
              <th className="px-6 py-4 text-[13px] font-bold text-white uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#0066D2]/10">
            {experiences.map((exp) => (
              <tr key={exp.id} className="hover:bg-[#f0f6ff] transition-colors duration-150 group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg overflow-hidden bg-[#eee] flex-shrink-0">
                      <img src={exp.image} alt={exp.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[14px] font-bold text-[#0066D2] truncate">{exp.name}</span>
                      <span className="text-[11px] text-[#0066D2]/60">{exp.country}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[14px] text-[#0066D2]">{exp.location}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-full bg-[#f0f7f6] text-[#1CA698] text-[12px] font-medium border border-[#1CA698]/10">
                    {exp.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[14px] text-[#0066D2]">{exp.duration}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[14px] text-[#0066D2]">{exp.difficulty}</span>
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
