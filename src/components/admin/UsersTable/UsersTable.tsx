import { Edit2, Trash2, Eye, User } from 'lucide-react';
import type { AdminUser } from '@/types/admin.types';

interface UsersTableProps {
  users: AdminUser[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

export default function UsersTable({
  users,
  onEdit,
  onDelete,
  onView,
}: UsersTableProps) {
  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-[#e0e0e0]">
        <div className="h-16 w-16 rounded-full bg-[#f5f7fa] flex items-center justify-center mb-4">
          <User size={32} className="text-[#ccc]" />
        </div>
        <p className="text-[16px] font-semibold text-[#333]">No users found</p>
        <p className="text-[14px] text-[#999] mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  const getStatusClasses = (status: AdminUser['status']) => {
    switch (status) {
      case 'active':
        return 'bg-[#eafaf1] text-[#27ae60] border-[#27ae60]/10';
      case 'premium':
        return 'bg-[#ebf5ff] text-[#0066D2] border-[#0066D2]/10';
      case 'inactive':
        return 'bg-[#f5f7fa] text-[#666] border-[#666]/10';
      default:
        return 'bg-[#f5f7fa] text-[#666] border-[#666]/10';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#e0e0e0] overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f5f7fa] border-bottom border-[#e0e0e0]">
              <th className="px-6 py-4 text-[13px] font-bold text-[#0066D2] uppercase tracking-wider">User</th>
              <th className="px-6 py-4 text-[13px] font-bold text-[#0066D2] uppercase tracking-wider">Country</th>
              <th className="px-6 py-4 text-[13px] font-bold text-[#0066D2] uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-[13px] font-bold text-[#0066D2] uppercase tracking-wider">Join Date</th>
              <th className="px-6 py-4 text-[13px] font-bold text-[#0066D2] uppercase tracking-wider">Trips</th>
              <th className="px-6 py-4 text-[13px] font-bold text-[#0066D2] uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-[13px] font-bold text-[#0066D2] uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e0e0e0]">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-[#fcfcfc] transition-colors duration-150 group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full overflow-hidden bg-[#eee] flex-shrink-0">
                      <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[14px] font-bold text-[#333] truncate">{user.name}</span>
                      <span className="text-[11px] text-[#999]">{user.id}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[14px] text-[#666]">{user.country}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[14px] text-[#333]">{user.email}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[14px] text-[#333]">{user.joinDate}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-[14px] font-bold text-[#333]">
                    {user.tripCount}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[12px] font-medium border ${getStatusClasses(user.status)}`}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => onView(user.id)}
                      className="p-1.5 text-[#0066D2] hover:bg-[#0066D2]/5 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => onEdit(user.id)}
                      className="p-1.5 text-[#1CA698] hover:bg-[#1CA698]/5 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(user.id)}
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
