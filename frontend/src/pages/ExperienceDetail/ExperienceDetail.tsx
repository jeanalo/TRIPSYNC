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
import { useExperiences } from '@/hooks/useExperience';
import { iconsMap } from '../../utils/iconsMap';

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

function resolveHighlightIcon(iconKey: string) {
  const Icon = iconsMap[iconKey as keyof typeof iconsMap];
  return Icon ? <Icon size={22} className="text-[#0066D2] shrink-0" /> : null;
}

const ExperienceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { experiences, loading } = useExperiences();

  const exp = experiences.find((e) => e.id === Number(id));

  if (loading) {
    return <p className="p-10">Loading...</p>;
  }

  if (!exp) {
    return (
      <div className="px-4 lg:px-12 py-20 text-center">
        <p className="text-[18px] text-[#0066D2]/50">Experience not found.</p>
      </div>
    );
  }

  return (
    <div>
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

      <div className="px-4 lg:px-12 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <DetailCard delay={0.2}>
              <div className="flex flex-col gap-4">
                <CardHeader icon={<Star size={22} />} title="About This Experience" />
                <p className="text-[16px] text-[#0066D2]/80 leading-relaxed">
                  {exp.description}
                </p>
              </div>
            </DetailCard>

            <DetailCard delay={0.3}>
              <div className="flex flex-col gap-5">
                <CardHeader icon={<Zap size={22} />} title="Highlights" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {exp.highlights.map((h, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 bg-[#F5F5F5] rounded-[10px]"
                    >
                      {resolveHighlightIcon(h.icon)}
                      <span className="text-[15px] font-medium text-[#0066D2]">
                        {h.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </DetailCard>

            <DetailCard delay={0.4}>
              <div className="flex flex-col gap-5">
                <CardHeader icon={<CheckCircle size={22} />} title="What's Included" />
                <ul className="flex flex-col gap-3">
                  {exp.included.map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#1CA698] flex items-center justify-center shrink-0">
                        <CheckCircle size={11} className="text-white" />
                      </div>
                      <span className="text-[15px] text-[#0066D2]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </DetailCard>
          </div>

          <div className="flex flex-col gap-6">
            <DetailCard delay={0.25} animateFrom="right">
              <div className="flex flex-col gap-5">
                <CardHeader icon={<Calendar size={22} />} title="Quick Info" />
                <div className="flex flex-col">
                  <div className="flex items-center justify-between py-3 border-b border-[#0066D2]/10">
                    <div className="flex items-center gap-2">
                      <MapPin size={15} className="text-[#0066D2]" />
                      <span className="text-[14px] text-[#0066D2]/60">Location</span>
                    </div>
                    <span className="text-[14px] font-semibold text-[#0066D2]">
                      {exp.location}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[#0066D2]/10">
                    <div className="flex items-center gap-2">
                      <Leaf size={15} className="text-[#0066D2]" />
                      <span className="text-[14px] text-[#0066D2]/60">Category</span>
                    </div>
                    <span className="text-[14px] font-semibold text-[#0066D2]">
                      {exp.category}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[#0066D2]/10">
                    <div className="flex items-center gap-2">
                      <Clock size={15} className="text-[#0066D2]" />
                      <span className="text-[14px] text-[#0066D2]/60">Duration</span>
                    </div>
                    <span className="text-[14px] font-semibold text-[#0066D2]">
                      {exp.duration}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-2">
                      <Zap size={15} className="text-[#0066D2]" />
                      <span className="text-[14px] text-[#0066D2]/60">Difficulty</span>
                    </div>
                    <span
                      className={`text-[14px] font-semibold ${difficultyColor[exp.difficulty]}`}
                    >
                      {exp.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            </DetailCard>

            <DetailCard delay={0.35} animateFrom="right">
              <div className="flex flex-col gap-3">
                <CardHeader icon={<Leaf size={22} />} title="Eco Note" iconColor="teal" />
                <p className="text-[14px] text-[#0066D2]/80 leading-relaxed">{exp.eco}</p>
              </div>
            </DetailCard>

            <DetailCard delay={0.45} animateFrom="right">
              <div className="flex flex-col gap-4">
                <CardHeader icon={<Lightbulb size={22} />} title="Traveler Tips" />
                <ul className="flex flex-col gap-3">
                  {exp.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="text-[#F2B705] font-bold text-[20px] leading-none mt-[-2px]">
                        ·
                      </span>
                      <span className="text-[14px] text-[#0066D2]/80 leading-snug">
                        {tip}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </DetailCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceDetail;
