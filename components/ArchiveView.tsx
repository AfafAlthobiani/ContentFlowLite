'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Archive, RotateCcw, Trash2, Calendar, LayoutGrid } from 'lucide-react';
import { Task, TaskStatus, STATUS_LABELS } from '@/types';

interface ArchiveViewProps {
  tasks: Task[];
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ArchiveView({ tasks, onRestore, onDelete }: ArchiveViewProps) {
  const archivedTasks = tasks.filter(t => t.status === 'archived');

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 bg-zinc-100 rounded-2xl">
          <Archive className="w-6 h-6 text-zinc-500" />
        </div>
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#121212]">الأرشيف</h2>
          <p className="text-xs text-zinc-400 mt-1">المحتوى الذي تم أرشفته مسبقاً</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {archivedTasks.map((task) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white border border-[#EAE8E4] p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-3 py-1 bg-zinc-50 rounded-full border border-zinc-100">
                  {task.category}
                </span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => onRestore(task.id)}
                    className="p-2 text-zinc-400 hover:text-emerald-500 transition-colors"
                    title="استعادة"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onDelete(task.id)}
                    className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                    title="حذف نهائي"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h4 className="text-sm font-bold text-zinc-400 line-through mb-2">{task.title}</h4>
              <p className="text-[11px] text-zinc-300 line-clamp-2 mb-4 italic">
                {task.notes || 'لا يوجد وصف'}
              </p>

              <div className="flex items-center gap-4 pt-4 border-t border-zinc-50">
                <div className="flex items-center text-[10px] text-zinc-300">
                  <Calendar className="w-3.5 h-3.5 ml-1.5" />
                  {task.date}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {archivedTasks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 bg-white border border-dashed border-[#EAE8E4] rounded-3xl">
          <Archive className="w-12 h-12 text-zinc-100 mb-4" />
          <p className="text-zinc-400 text-sm">الأرشيف فارغ حالياً</p>
        </div>
      )}
    </div>
  );
}
