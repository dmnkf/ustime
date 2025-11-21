import React, { useState, useEffect } from 'react';
import { Plus, ArrowLeft, Grid2X2, History } from 'lucide-react';
import { Activity, DurationCategory } from './types';
import { INITIAL_ACTIVITIES, CATEGORIES } from './constants';
import { CategoryCard } from './components/CategoryCard';
import { ActivityModal } from './components/ActivityModal';
import { ResultReveal } from './components/ResultReveal';
import { ActivityList } from './components/ActivityList';
import { motion } from 'framer-motion';

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [view, setView] = useState<'home' | 'list'>('home');
  
  useEffect(() => {
    const saved = localStorage.getItem('us-time-activities');
    if (saved) {
      try {
        setActivities(JSON.parse(saved));
      } catch (e) {
        setActivities(INITIAL_ACTIVITIES);
      }
    } else {
      setActivities(INITIAL_ACTIVITIES);
    }
  }, []);

  useEffect(() => {
    if (activities.length > 0) {
      localStorage.setItem('us-time-activities', JSON.stringify(activities));
    }
  }, [activities]);

  const addActivity = (title: string, category: DurationCategory) => {
    const newActivity: Activity = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      title,
      category,
      createdAt: Date.now(),
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  const deleteActivity = (id: string) => {
    setActivities(prev => prev.filter(a => a.id !== id));
  };

  const pickRandomActivity = (category: DurationCategory) => {
    const pool = activities.filter(a => a.category === category);
    if (pool.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * pool.length);
    setSelectedActivity(pool[randomIndex]);
    setShowResult(true);
  };

  const counts = {
    [DurationCategory.SHORT]: activities.filter(a => a.category === DurationCategory.SHORT).length,
    [DurationCategory.MEDIUM]: activities.filter(a => a.category === DurationCategory.MEDIUM).length,
    [DurationCategory.LONG]: activities.filter(a => a.category === DurationCategory.LONG).length,
  };

  return (
    <div className="min-h-screen p-6 md:p-12 flex flex-col max-w-lg mx-auto relative">
      {/* Background decoration */}
      <div className="fixed top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black to-transparent" style={{ backgroundSize: '20px 20px' }}></div>

      {/* Brand Header */}
      <header className="relative z-10 flex items-center justify-between mb-10">
        <div onClick={() => setView('home')} className="cursor-pointer group">
          <h1 className="text-4xl font-black tracking-tight text-black group-hover:translate-x-1 transition-transform">
            UsTime<span className="text-[#FF5A5F]">.</span>
          </h1>
          <p className="text-sm font-bold text-stone-400 tracking-wide">NO MORE BORING DAYS</p>
        </div>
        
        <button 
          onClick={() => setView(view === 'home' ? 'list' : 'home')}
          className="w-12 h-12 rounded-xl border-2 border-black bg-white hard-shadow hover:bg-stone-100 flex items-center justify-center transition-transform active:translate-y-1 active:shadow-none"
        >
          {view === 'home' ? <Grid2X2 size={20} /> : <ArrowLeft size={20} />}
        </button>
      </header>

      {/* Content */}
      <main className="relative z-10 flex-1">
        {view === 'home' ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6"
          >
             <div className="grid grid-cols-1 gap-5">
               {Object.values(CATEGORIES).map((config, i) => (
                 <motion.div
                  key={config.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                 >
                   <CategoryCard
                     config={config}
                     count={counts[config.id]}
                     onClick={() => pickRandomActivity(config.id)}
                     disabled={counts[config.id] === 0}
                   />
                 </motion.div>
               ))}
             </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="text-2xl font-bold text-black">Your Collection</h2>
              <div className="bg-black text-white px-3 py-1 rounded-full text-xs font-bold">
                {activities.length} CARDS
              </div>
            </div>
            <ActivityList activities={activities} onDelete={deleteActivity} />
          </motion.div>
        )}
      </main>

      {/* Floating Action Button - Neo Style */}
      {view === 'home' && (
        <div className="fixed bottom-8 right-8 lg:right-[calc(50%-220px)] z-30">
            <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center w-16 h-16 rounded-full bg-black text-white border-2 border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] transition-all"
            >
            <Plus size={32} strokeWidth={3} />
            </motion.button>
        </div>
      )}

      <ActivityModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        onAdd={addActivity}
      />

      <ResultReveal
        activity={selectedActivity}
        isOpen={showResult}
        onClose={() => setShowResult(false)}
        onReroll={() => selectedActivity && pickRandomActivity(selectedActivity.category)}
      />
    </div>
  );
}

export default App;