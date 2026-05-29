import { Plane } from 'lucide-react';
import type { AdminTrip } from '@/types/admin.types';

interface TripsTableProps {
  trips: AdminTrip[];
}

export default function TripsTable({ trips }: TripsTableProps) {
  if (trips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border-2 border-[#0066D2]">
        <div className="h-16 w-16 rounded-full bg-[#f5f7fa] flex items-center justify-center mb-4">
          <Plane size={32} className="text-[#ccc]" />
        </div>

        <p className="text-[16px] font-semibold text-[#0066D2]">
          No trips found
        </p>

        <p className="text-[14px] text-[#0066D2]/60 mt-1">
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
                Traveler
              </th>

              <th className="px-6 py-4 text-[13px] font-bold text-white">
                Origin
              </th>

              <th className="px-6 py-4 text-[13px] font-bold text-white">
                Destination
              </th>

              <th className="px-6 py-4 text-[13px] font-bold text-white">
                Dates
              </th>

              <th className="px-6 py-4 text-[13px] font-bold text-white">
                Budget
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#0066D2]/10">
            {trips.map((trip) => (
              <tr
                key={trip.id}
                className="hover:bg-[#f0f6ff] transition-colors duration-150"
              >
                <td className="px-6 py-4">
                  <div className="flex flex-col min-w-0">
                    <span className="text-[14px] font-bold text-[#0066D2] truncate">
                      {trip.travelerName}
                    </span>

                    <span className="text-[11px] text-[#0066D2]/60 truncate">
                      {trip.id}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span className="text-[14px] text-[#0066D2]">
                    {trip.originCountry}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span className="text-[14px] font-medium text-[#0066D2]">
                    {trip.destinationCountry}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-[13px] text-[#0066D2] font-medium">
                      {trip.startDate}
                    </span>

                    <span className="text-[11px] text-[#0066D2]/60">
                      to {trip.endDate}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span className="text-[14px] font-bold text-[#0066D2]">
                    ${trip.budget.toLocaleString()}
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