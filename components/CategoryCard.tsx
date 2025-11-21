import React from 'react';
import { CategoryConfig } from '../types';
import { motion } from 'framer-motion';

interface CategoryCardProps {
  config: CategoryConfig;
  count: number;
  onClick: () => void;
  disabled?: boolean;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ config, count, onClick, disabled }) => {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02, rotate: -1 } : {}}
      whileTap={!disabled ? { scale: 0.98, translateY: 4, translateX: 4, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)" } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`w-full relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-200 border-2 border-black ${
        disabled 
          ? 'opacity-50 cursor-not-allowed bg-stone-100' 
          : `${config.bgClass} hard-shadow`
      }`}
    >
      <div className="flex flex-row items-center justify-between relative z-10">
        <div className="flex flex-col gap-1">
            <div className="text-4xl mb-2 filter drop-shadow-sm transform -rotate-3 origin-bottom-left">
                {config.icon}
            </div>
            <h3 className={`text-3xl font-bold tracking-tight ${config.textClass} leading-none`}>
            {config.label}
            </h3>
            <p className={`text-sm font-bold opacity-80 uppercase tracking-widest ${config.textClass} mt-1`}>
            {config.durationLabel}
            </p>
        </div>

        <div className="flex flex-col items-end justify-between self-stretch">
             <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm border-2 border-white shadow-sm">
                {count}
             </div>
             {!disabled && (
                 <div className="mt-auto bg-white border-2 border-black rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider">
                    Play
                 </div>
             )}
        </div>
      </div>
      
      {/* Decorative texture/pattern opacity */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none"></div>
    </motion.button>
  );
};