import type { RecentActivity } from '@/types/admin.types';

interface RecentActivityTableProps {
  activities: RecentActivity[];
}

export default function RecentActivityTable({ activities }: RecentActivityTableProps) {
  const getStatusClasses = (status: RecentActivity['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-[#eafaf1] text-[#27ae60] border-[#27ae60]/10';
      case 'active':
        return 'bg-[#ebf5ff] text-[#0066D2] border-[#0066D2]/10';
      case 'upcoming':
        return 'bg-[#fff9e6] text-[#f1c40f] border-[#f1c40f]/10';
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
              <th className="px-6 py-4 text-[13px] font-bold text-[#0066D2] uppercase tracking-wider">Traveler</th>
              <th className="px-6 py-4 text-[13px] font-bold text-[#0066D2] uppercase tracking-wider">Destination</th>
              <th className="px-6 py-4 text-[13px] font-bold text-[#0066D2] uppercase tracking-wider">Experience</th>
              <th className="px-6 py-4 text-[13px] font-bold text-[#0066D2] uppercase tracking-wider">Budget</th>
              <th className="px-6 py-4 text-[13px] font-bold text-[#0066D2] uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-[13px] font-bold text-[#0066D2] uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e0e0e0]">
            {activities.map((activity) => (
              <tr key={activity.id} className="hover:bg-[#fcfcfc] transition-colors duration-150 group">
                <td className="px-6 py-4">
                  <span className="text-[14px] font-bold text-[#333]">{activity.traveler}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[14px] text-[#666]">{activity.destination}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[14px] text-[#333] font-medium">{activity.experience}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[14px] font-bold text-[#333]">${activity.budget}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[14px] text-[#666]">{activity.date}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[12px] font-medium border ${getStatusClasses(activity.status)}`}>
                    {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
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
