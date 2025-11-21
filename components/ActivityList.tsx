import React from 'react';
import { Activity } from '../types';
import { CATEGORIES } from '../constants';
import { Trash2 } from 'lucide-react';

interface ActivityListProps {
  activities: Activity[];
  onDelete: (id: string) => void;
}

export const ActivityList: React.FC<ActivityListProps> = ({ activities, onDelete }) => {
  if (activities.length === 0) {
    return (
      <div className="text-center py-20 border-2 border-dashed border-stone-300 rounded-2xl">
        <p className="text-stone-400 font-bold text-lg">The jar is empty.</p>
        <p className="text-stone-300 text-sm mt-1">Add some fun ideas!</p>
      </div>
    );
  }

  const sorted = [...activities].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="space-y-3">
      {sorted.map((activity) => {
        const cat = CATEGORIES[activity.category];
        return (
          <div 
            key={activity.id} 
            className="group flex items-center justify-between p-4 bg-white rounded-xl border-2 border-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <div className="flex items-center gap-4 overflow-hidden">
              <div className={`w-10 h-10 rounded-lg border-2 border-black ${cat.bgClass} flex items-center justify-center text-lg shrink-0 font-bold`}>
                {cat.icon}
              </div>
              <div className="flex flex-col">
                 <span className="font-bold text-black truncate text-lg leading-tight">{activity.title}</span>
                 <span className="text-xs font-bold text-stone-500 uppercase tracking-wider mt-0.5">{cat.label}</span>
              </div>
            </div>
            <button 
              onClick={() => onDelete(activity.id)}
              className="p-2 text-stone-400 hover:text-red-500 transition-all hover:bg-red-50 rounded-lg"
            >
              <Trash2 size={18} />
            </button>
          </div>
        );
      })}
    </div>
  );
};