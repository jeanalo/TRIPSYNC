import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Leaf,
  Clock,
  Zap,
  Star,
  CheckCircle,
  Lightbulb,
  Calendar,
} from 'lucide-react';
import { motion } from 'motion/react';
import DetailCard from '../../components/DetailCard/DetailCard';
import CardHeader from '../../components/CardHeader/CardHeader';
import { EXPERIENCES } from '../../data/experiences';

const difficultyColor: Record<string, string> = {
  Easy: 'text-[#1CA698]',
  Moderate: 'text-[#F2B705]',
  Challenging: 'text-red-500',
};

const categoryBg: Record<string, string> = {
  Chill: '#1CA698',
  Adventure: '#0066D2',
  Cultural: '#F2B705',
  'Free Tour': '#6CD9CE',
};

const ExperienceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const exp = EXPERIENCES.find((e) => e.id === Number(id));

  if (!exp) {
    return (
      <div className="px-4 lg:px-12 py-20 text-center">
        <p className="text-[18px] text-[#0066D2]/50">Experience not found.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Back button + page title */}
      <motion.div
        className="px-4 lg:px-12 pt-8 lg:pt-12 pb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#0066D2] font-semibold text-[15px] mb-5 hover:opacity-70 transition-opacity cursor-pointer bg-transparent border-none p-0"
        >
          <ArrowLeft size={18} />
          Back to Experiences
        </button>

        <div className="flex flex-col gap-2">
          <h1 className="text-[30px] font-bold leading-[36px] text-[#0066D2]">
            {exp.name}
          </h1>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              <MapPin size={16} className="text-[#0066D2]" />
              <span className="text-[16px] text-[#0066D2]">{exp.location}</span>
            </div>
            <span
              className="px-3 py-0.5 rounded-full text-[13px] font-semibold text-white"
              style={{ backgroundColor: categoryBg[exp.category] ?? '#0066D2' }}
            >
              {exp.category}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Hero image */}
      <motion.div
        className="px-4 lg:px-12 mb-6"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="w-full h-[240px] lg:h-[340px] rounded-[15px] overflow-hidden">
          <img src={exp.image} alt={exp.name} className="w-full h-full object-cover" />
        </div>
      </motion.div>
    </div>
  );
};

export default ExperienceDetail;
