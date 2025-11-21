import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Plus } from 'lucide-react';
import { DurationCategory } from '../types';
import { CATEGORIES } from '../constants';
import { Button } from './Button';
import { generateActivityIdeas } from '../services/geminiService';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, category: DurationCategory) => void;
}

export const ActivityModal: React.FC<ActivityModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DurationCategory>(DurationCategory.SHORT);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title, category);
    setTitle('');
    setAiSuggestions([]);
    onClose();
  };

  const handleAiGenerate = async () => {
    setIsGenerating(true);
    const ideas = await generateActivityIdeas(category);
    setAiSuggestions(ideas);
    setIsGenerating(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onAdd(suggestion, category);
    setAiSuggestions(prev => prev.filter(i => i !== suggestion));
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
                          setAiSuggestions([]);
                        }}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all border-2 ${
                          category === cat.id
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
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={handleAiGenerate}
                    isLoading={isGenerating}
                    className="px-4"
                  >
                    <Sparkles className="w-5 h-5 text-purple-600" />
                  </Button>
                  <Button type="submit" className="flex-1" disabled={!title.trim()}>
                    Add to Jar
                  </Button>
                </div>
              </form>

              {/* AI Suggestions */}
              <AnimatePresence>
                {aiSuggestions.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 pt-6 border-t-2 border-dashed border-stone-200"
                  >
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">
                      AI Suggestions
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {aiSuggestions.map((idea, idx) => (
                        <motion.button
                          key={idx}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          onClick={() => handleSuggestionClick(idea)}
                          className="px-3 py-2 rounded-lg bg-[#E0E7FF] border-2 border-[#E0E7FF] hover:border-black text-black text-sm font-bold transition-all flex items-center gap-2 text-left"
                        >
                          <Plus size={14} className="opacity-50" />
                          {idea}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};