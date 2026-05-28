import { User } from 'lucide-react';
import type { AdminUser } from '@/types/admin.types';

interface UsersTableProps {
  users: AdminUser[];
}

export default function UsersTable({ users }: UsersTableProps) {
  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border-2 border-[#0066D2]">
        <div className="h-16 w-16 rounded-full bg-[#f5f7fa] flex items-center justify-center mb-4">
          <User size={32} className="text-[#ccc]" />
        </div>

        <p className="text-[16px] font-semibold text-[#333]">
          No users found
        </p>

        <p className="text-[14px] text-[#999] mt-1">
          Try adjusting your filters
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-[#0066D2] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0066D2]">
              <th className="px-6 py-4 text-[13px] font-bold text-white">
                User
              </th>

              <th className="px-6 py-4 text-[13px] font-bold text-white">
                Name
              </th>

              <th className="px-6 py-4 text-[13px] font-bold text-white">
                Email
              </th>

              <th className="px-6 py-4 text-[13px] font-bold text-white">
                Join Date
              </th>

              <th className="px-6 py-4 text-[13px] font-bold text-white text-center">
                Trips
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#0066D2]/10">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-[#f0f6ff] transition-colors duration-150"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#eee] flex items-center justify-center flex-shrink-0">
                      <User size={20} className="text-[#999]" />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span className="text-[14px] font-bold text-[#333] truncate">
                        {user.name}
                      </span>

                      <span className="text-[11px] text-[#999] truncate">
                        {user.id}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span className="text-[14px] text-[#666]">
                    {user.name}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span className="text-[14px] text-[#333]">
                    {user.email}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span className="text-[14px] text-[#333]">
                    {user.joinDate}
                  </span>
                </td>

                <td className="px-6 py-4 text-center">
                  <span className="text-[14px] font-bold text-[#333]">
                    {user.tripCount}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}