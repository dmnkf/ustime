import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity } from '../types';
import { CATEGORIES } from '../constants';
import { Button } from './Button';
import { RefreshCw } from 'lucide-react';

import { PitchActivityModal } from './PitchActivityModal';

interface ResultRevealProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
  onReroll: () => void;
}

export const ResultReveal: React.FC<ResultRevealProps> = ({ activity, isOpen, onClose, onReroll }) => {
  const [showPitchModal, setShowPitchModal] = React.useState(false);

  if (!activity) return null;

  const config = CATEGORIES[activity.category];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotate: -5 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0, rotate: 5 }}
            transition={{ type: "spring", damping: 15, stiffness: 200 }}
            className="w-full max-w-sm bg-white rounded-2xl overflow-hidden border-2 border-black hard-shadow"
          >
            {/* Header */}
            <div className={`p-8 flex flex-col items-center text-center ${config.bgClass} border-b-2 border-black`}>
              <motion.div
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="text-7xl mb-4 filter drop-shadow-md"
              >
                {config.icon}
              </motion.div>

              <h3 className="text-xs font-black tracking-[0.3em] uppercase mb-2 bg-black text-white px-2 py-1">
                It's Time For
              </h3>

              <h2 className="text-4xl font-black leading-none tracking-tighter text-black mt-2">
                {activity.title}
              </h2>
            </div>

            {/* Actions */}
            <div className="p-6 bg-white">
              <div className="grid grid-cols-2 gap-4 mb-3">
                <Button onClick={onReroll} variant="secondary" className="w-full">
                  <RefreshCw size={18} className="mr-2" /> Reroll
                </Button>
                <Button onClick={onClose} variant="primary" className="w-full">
                  Let's Go!
                </Button>
              </div>
              <Button
                onClick={() => setShowPitchModal(true)}
                variant="secondary"
                className="w-full border-dashed text-stone-500 hover:text-black hover:border-black"
              >
                Pitch to Partner
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <PitchActivityModal
        isOpen={showPitchModal}
        onClose={() => setShowPitchModal(false)}
        activity={activity}
      />
    </AnimatePresence>
  );
};