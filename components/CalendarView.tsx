'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Task, STATUS_LABELS } from '@/types';

interface CalendarViewProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
}

export default function CalendarView({ tasks, onEdit }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
  ];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const days = [];
  const totalDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  // Fill in blanks for the previous month
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }

  // Fill in actual days
  for (let d = 1; d <= totalDays; d++) {
    days.push(new Date(year, month, d));
  }

  const getTasksForDay = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return tasks.filter(t => t.date === dateStr);
  };

  const statusColors = {
    ideas: 'bg-amber-400',
    drafts: 'bg-orange-400',
    scheduled: 'bg-blue-400',
    published: 'bg-emerald-400',
    archived: 'bg-zinc-400',
  };

  return (
    <div className="bg-white border border-[#EAE8E4] rounded-sm overflow-hidden flex flex-col h-[700px]">
      <div className="flex items-center justify-between p-6 border-b border-[#EAE8E4]">
        <h3 className="text-xl font-serif font-bold text-[#121212]">
          {monthNames[month]} {year}
        </h3>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-zinc-100 rounded-lg transition-colors">
            <ChevronRight className="w-5 h-5 text-zinc-500" />
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-zinc-100 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5 text-zinc-500" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 bg-[#F9F8F6] border-b border-[#EAE8E4]">
        {['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'].map(day => (
          <div key={day} className="px-2 py-3 text-center text-[10px] font-black uppercase tracking-widest text-zinc-400">
            {day}
          </div>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-7 auto-rows-fr overflow-y-auto">
        {days.map((date, idx) => (
          <div 
            key={idx} 
            className={`min-h-[100px] p-2 border-l border-b border-[#EAE8E4] last:border-l-0 ${date ? 'bg-white' : 'bg-zinc-50/50'}`}
          >
            {date && (
              <>
                <div className="text-[11px] font-bold text-zinc-400 mb-2 font-mono">
                  {date.getDate()}
                </div>
                <div className="space-y-1">
                  {getTasksForDay(date).map(task => (
                    <button
                      key={task.id}
                      onClick={() => onEdit(task)}
                      className="w-full text-right p-1.5 rounded-md hover:bg-zinc-50 border border-zinc-100 transition-all flex items-center gap-2"
                    >
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusColors[task.status]}`} />
                      <span className="text-[10px] font-bold text-[#121212] truncate flex-1">{task.title}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
