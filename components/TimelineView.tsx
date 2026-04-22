'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Tag, Clock, ChevronLeft } from 'lucide-react';
import { Task, STATUS_LABELS } from '@/types';
import TaskCard from './TaskCard';

interface TimelineViewProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, status: any) => void;
}

export default function TimelineView({ tasks, onEdit, onDelete, onMove }: TimelineViewProps) {
  // Sort tasks by date
  const sortedTasks = [...tasks].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Group by date
  const groups = sortedTasks.reduce((acc, task) => {
    const date = task.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const dates = Object.keys(groups).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  return (
    <div className="relative pb-20">
      {/* Vertical Line */}
      <div className="absolute right-[11px] top-0 bottom-0 w-0.5 bg-zinc-100 hidden lg:block" />

      <div className="space-y-12">
        {dates.map((date) => (
          <div key={date} className="relative">
            <div className="flex items-center gap-4 mb-6 sticky top-0 bg-[#FDFCFB]/80 backdrop-blur-sm z-10 py-2">
              <div className="w-6 h-6 rounded-full bg-[#121212] border-4 border-white shadow-sm flex-shrink-0 hidden lg:block" />
              <div className="px-4 py-1.5 bg-white border border-[#EAE8E4] rounded-full shadow-sm">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#121212]">
                  {new Date(date).toLocaleDateString('ar-SA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:mr-10">
              {groups[date].map((task) => (
                <div key={task.id} className="relative">
                  <TaskCard 
                    task={task} 
                    onEdit={onEdit} 
                    onDelete={onDelete} 
                    onMove={onMove} 
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="text-center py-20 bg-white border border-dashed border-[#EAE8E4] rounded-2xl">
            <Clock className="w-10 h-10 text-zinc-200 mx-auto mb-4" />
            <p className="text-sm text-zinc-400">لا يوجد مهام مجدولة حالياً</p>
          </div>
        )}
      </div>
    </div>
  );
}
