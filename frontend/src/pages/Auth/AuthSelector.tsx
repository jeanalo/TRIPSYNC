import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Plane, Shield, ArrowRight, Map, MapPin, Compass } from 'lucide-react';

export default function AuthSelector() {
  return (
    <div className="flex h-screen w-screen bg-[#f5f7fa]">
      
      <div className="hidden md:flex w-1/2 h-full bg-[#0066D2] flex-col justify-center px-16 relative overflow-hidden">
        
        
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-white opacity-5 rounded-full blur-3xl mix-blend-overlay"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#1CA698] opacity-20 rounded-full blur-3xl mix-blend-overlay"></div>
          
          
          <svg className="absolute w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
            <motion.path
              d="M -10,80 Q 30,20 60,60 T 110,10"
              fill="transparent"
              stroke="#ffffff"
              strokeWidth="0.5"
              strokeDasharray="4 4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
            />
          </svg>

          
          <motion.div
            className="absolute top-[20%] right-[25%] opacity-30 text-white"
            animate={{ y: [-10, 10, -10], rotate: [-5, 5, -5] }}
            transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
          >
            <Plane size={32} />
          </motion.div>

          <motion.div
            className="absolute bottom-[30%] left-[20%] opacity-20 text-white"
            animate={{ y: [10, -10, 10], rotate: [5, -5, 5] }}
            transition={{ duration: 7, ease: "easeInOut", repeat: Infinity, delay: 1 }}
          >
            <Map size={40} />
          </motion.div>

          <motion.div
            className="absolute top-[45%] right-[15%] opacity-25 text-white"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, delay: 0.5 }}
          >
            <MapPin size={24} />
          </motion.div>

          <motion.div
            className="absolute bottom-[15%] right-[35%] opacity-20 text-white"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, ease: "linear", repeat: Infinity }}
          >
            <Compass size={48} />
          </motion.div>
        </div>

        
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-start"
        >
          
          <div className="mb-14 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg">
             <img src="/logo-white-text.svg" alt="TripSync" className="h-12 object-contain" />
          </div>

          <h1 className="text-[52px] font-extrabold text-white leading-[1.1] mb-4 tracking-tight">
            Welcome to TripSync
          </h1>
          
          <h2 className="text-[24px] font-semibold text-white mb-6 tracking-wide">
            Your travel journey starts here.
          </h2>

          <p className="text-[18px] text-white/90 leading-relaxed max-w-[420px] font-light">
            Plan trips, discover experiences, manage budgets and access everything you need in one place.
          </p>
        </motion.div>
      </div>

      
      <div className="flex w-full md:w-1/2 items-center justify-center px-6">
        <motion.div
          className="w-full max-w-[480px] bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#f0f2f5]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="mb-10 text-center">
            <h2 className="text-[32px] font-bold text-[#333] mb-3">
              How would you like to continue?
            </h2>
            <p className="text-[16px] text-[#666]">
              Select your access type to enter TripSync.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            
            <Link to="/login" className="no-underline group outline-none">
              <motion.div 
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-5 p-6 rounded-2xl border-2 border-[#e0e0e0] bg-white transition-all duration-300 group-hover:border-[#0066D2] group-hover:shadow-[0_12px_24px_-8px_rgba(0,102,210,0.25)] group-focus-visible:border-[#0066D2] group-focus-visible:ring-4 group-focus-visible:ring-[#0066D2]/20"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#ebf5ff] transition-colors duration-300 group-hover:bg-[#0066D2]">
                  <Plane size={28} className="text-[#0066D2] transition-colors duration-300 group-hover:text-white" />
                </div>
                <div className="flex flex-col flex-1">
                  <h3 className="text-[18px] font-bold text-[#333] mb-1 transition-colors duration-300 group-hover:text-[#0066D2]">
                    Traveler Access
                  </h3>
                  <p className="text-[14px] text-[#666] leading-relaxed">
                    Explore destinations, organize trips and manage your travel experience.
                  </p>
                </div>
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[#f5f7fa] transition-colors duration-300 group-hover:bg-[#0066D2]">
                  <ArrowRight size={18} className="text-[#999] transition-colors duration-300 group-hover:text-white" />
                </div>
              </motion.div>
            </Link>

            
            <Link to="/admin/login" className="no-underline group outline-none">
              <motion.div 
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-5 p-6 rounded-2xl border-2 border-[#e0e0e0] bg-white transition-all duration-300 group-hover:border-[#1CA698] group-hover:shadow-[0_12px_24px_-8px_rgba(28,166,152,0.25)] group-focus-visible:border-[#1CA698] group-focus-visible:ring-4 group-focus-visible:ring-[#1CA698]/20"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#eafaf1] transition-colors duration-300 group-hover:bg-[#1CA698]">
                  <Shield size={28} className="text-[#1CA698] transition-colors duration-300 group-hover:text-white" />
                </div>
                <div className="flex flex-col flex-1">
                  <h3 className="text-[18px] font-bold text-[#333] mb-1 transition-colors duration-300 group-hover:text-[#1CA698]">
                    Administrator Access
                  </h3>
                  <p className="text-[14px] text-[#666] leading-relaxed">
                    Manage users, experiences, analytics and platform operations.
                  </p>
                </div>
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[#f5f7fa] transition-colors duration-300 group-hover:bg-[#1CA698]">
                  <ArrowRight size={18} className="text-[#999] transition-colors duration-300 group-hover:text-white" />
                </div>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
