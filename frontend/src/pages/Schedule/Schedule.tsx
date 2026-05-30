import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Plus,
  CalendarDays,
  MapPin,
  Tag,
  FileText,
  Trash2,
  Pencil,
  AlertTriangle,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useExpenseActivity } from '../../context/ExpenseActivityProvider';
import PageHeader from '../../components/PageHeader/PageHeader';
import ActionButton from '../../components/ActionButton/ActionButton';
import AlertModal from '../../components/AlertModal/AlertModal';
import DetailCard from '../../components/DetailCard/DetailCard';
import CardHeader from '../../components/CardHeader/CardHeader';
import EmptyState from '../../components/EmptyState/EmptyState';
import { formatDate, formatTime } from '../../utils/dateUtils';

const Schedule = () => {
  const navigate = useNavigate();
  const { activities, deleteActivity, deletingId, groupedActivities, sortedDates } =
    useExpenseActivity();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    const id = pendingDeleteId;
    setPendingDeleteId(null);
    try {
      await deleteActivity(id);
      if (selectedId === id) setSelectedId(null);
      toast.success('Activity deleted.');
    } catch {
      toast.error('Failed to delete activity. Please try again.');
    }
  };

  return (
    <div>
      <AlertModal
        isOpen={!!pendingDeleteId}
        onClose={() => setPendingDeleteId(null)}
        onConfirm={confirmDelete}
        confirmLabel="Delete"
        color="#E53935"
        bg="#FEECEB"
        icon={<AlertTriangle size={28} className="text-[#E53935]" />}
      >
        <div>
          <p className="text-xl font-bold text-[#E53935]">Delete Activity</p>
          <p className="mt-2 text-sm text-gray-600">
            Are you sure you want to delete this activity? This action cannot be undone.
          </p>
        </div>
      </AlertModal>

      <PageHeader
        title="Travel Schedule"
        subtitle="Your personalized itinerary."
        action={
          <ActionButton
            icon={<Plus size={24} />}
            onClick={() => navigate('/app/schedule/add')}
          >
            Add Activity
          </ActionButton>
        }
      />

      <div className="flex flex-col gap-[30px] px-4 lg:px-12 pb-12">
        {activities.length === 0 ? (
          <DetailCard delay={0.2}>
            <EmptyState
              icon={<CalendarDays size={48} />}
              message="No activities yet. Add your first activity!"
              action={
                <ActionButton
                  icon={<Plus size={20} />}
                  onClick={() => navigate('/app/schedule/add')}
                >
                  Add Activity
                </ActionButton>
              }
            />
          </DetailCard>
        ) : (
          sortedDates.map((date, i) => (
            <DetailCard key={date} delay={0.2 + i * 0.1}>
              <div className="flex flex-col gap-6">
                <CardHeader icon={<CalendarDays size={24} />} title={formatDate(date)} />
                <div className="flex flex-col">
                  {groupedActivities[date]
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((activity, index) => (
                      <div
                        key={activity.id}
                        className={index > 0 ? 'border-t border-[#0066D2]/15' : ''}
                      >
                        <div className="flex items-center justify-between py-5">
                          <div className="flex items-center gap-[45px]">
                            <span className="text-[22px] font-bold text-[#0066D2] min-w-[64px]">
                              {formatTime(activity.time)}
                            </span>
                            <div className="flex flex-col gap-1">
                              <span className="text-[22px] font-bold text-[#0066D2]">
                                {activity.name}
                              </span>
                              <div className="flex items-center gap-3">
                                {activity.location && (
                                  <div className="flex items-center gap-1.5">
                                    <MapPin size={20} className="text-[#0066D2]" />
                                    <span className="text-[18px] text-[#0066D2]">
                                      {activity.location}
                                    </span>
                                  </div>
                                )}
                                {activity.location && activity.category && (
                                  <div className="h-[23px] w-px bg-[#0066D2]/30" />
                                )}
                                {activity.category && (
                                  <div className="flex items-center gap-1.5">
                                    <Tag size={20} className="text-[#F2B705]" />
                                    <span className="text-[18px] text-[#0066D2]">
                                      {activity.category}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              className="flex items-center gap-2 bg-[#0066D2] text-white font-semibold text-[18px] px-5 py-3 rounded-[15px] cursor-pointer border-none hover:bg-[#005ab8] transition-colors"
                              onClick={() =>
                                navigate(`/app/schedule/edit/${activity.id}`)
                              }
                            >
                              <Pencil size={18} />
                              Edit
                            </button>
                            <button
                              type="button"
                              disabled={deletingId === activity.id}
                              className="flex items-center gap-2 bg-red-500 text-white font-semibold text-[18px] px-5 py-3 rounded-[15px] cursor-pointer border-none hover:bg-red-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                              onClick={() => setPendingDeleteId(activity.id)}
                            >
                              <Trash2 size={18} />
                              {deletingId === activity.id ? 'Deleting...' : 'Delete'}
                            </button>
                            <button
                              type="button"
                              className="bg-[#0066D2] text-white font-semibold text-[18px] px-8 py-3 rounded-[15px] cursor-pointer border-none hover:bg-[#0055b0] transition-colors"
                              onClick={() =>
                                setSelectedId(
                                  selectedId === activity.id ? null : activity.id
                                )
                              }
                            >
                              {selectedId === activity.id ? 'Close' : 'Details'}
                            </button>
                          </div>
                        </div>
                        {selectedId === activity.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="border-t border-[#0066D2]/15 pt-4 pb-5 flex flex-col gap-3 text-[14px] text-[#0066D2] overflow-hidden"
                          >
                            <span className="font-semibold text-[16px]">
                              {activity.name}
                            </span>
                            <div className="flex items-center gap-2">
                              <CalendarDays
                                size={16}
                                className="text-[#0066D2] shrink-0"
                              />
                              <span>
                                {formatDate(activity.date)} &middot;{' '}
                                {formatTime(activity.time)}
                              </span>
                            </div>
                            {activity.location && (
                              <div className="flex items-center gap-2">
                                <MapPin size={16} className="text-[#0066D2] shrink-0" />
                                <span>{activity.location}</span>
                              </div>
                            )}
                            {activity.category && (
                              <div className="flex items-center gap-2">
                                <Tag size={16} className="text-[#F2B705] shrink-0" />
                                <span>{activity.category}</span>
                              </div>
                            )}
                            {activity.notes && (
                              <div className="flex items-start gap-2">
                                <FileText
                                  size={16}
                                  className="text-[#0066D2] shrink-0 mt-0.5"
                                />
                                <span>{activity.notes}</span>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </DetailCard>
          ))
        )}
      </div>
    </div>
  );
};

export default Schedule;
