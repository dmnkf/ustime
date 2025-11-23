import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { DurationCategory } from '../types';
import { CATEGORIES } from '../constants';
import { Button } from './Button';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, category: DurationCategory) => void;
}

export const ActivityModal: React.FC<ActivityModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DurationCategory>(DurationCategory.SHORT);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title, category);
    setTitle('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#1C1917]/60 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, rotateX: 10 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.95, rotateX: 10 }}
            className="fixed inset-0 m-auto w-full max-w-md h-fit max-h-[90vh] z-50 p-4"
          >
            <div className="bg-white rounded-2xl p-6 md:p-8 relative border-2 border-black hard-shadow">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-stone-100 border-2 border-transparent hover:border-black transition-all"
              >
                <X size={20} />
              </button>

              <h2 className="text-3xl font-bold text-black mb-1 tracking-tight">New Activity</h2>
              <p className="text-stone-500 text-sm font-medium mb-6">Fill the jar with fun stuff.</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Custom Category Selector */}
                <div className="flex gap-2">
                  {Object.values(CATEGORIES).map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setCategory(cat.id);
                      }}
                      className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all border-2 ${category === cat.id
                        ? `${cat.bgClass} border-black hard-shadow-sm -translate-y-1`
                        : 'bg-white border-stone-200 text-stone-400 hover:border-stone-400'
                        }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div>
                  <textarea
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Build a blanket fort..."
                    className="w-full p-4 text-lg rounded-xl bg-stone-50 border-2 border-black focus:bg-white focus:shadow-[4px_4px_0px_0px_#000] focus:outline-none transition-all resize-none placeholder:text-stone-400 font-medium text-black"
                    rows={3}
                  />
                </div>

                <div className="flex gap-3">
                  <Button type="submit" className="flex-1" disabled={!title.trim()}>
                    Add to Jar
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};