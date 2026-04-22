'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Tag, Edit, Trash2, ArrowLeftRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Task, TaskStatus, STATUS_LABELS, PRIORITY_LABELS } from '@/types';

interface ListViewProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, status: TaskStatus) => void;
}

export default function ListView({ tasks, onEdit, onDelete, onMove }: ListViewProps) {
  const priorityColors = {
    low: 'text-zinc-400 bg-zinc-50',
    medium: 'text-blue-500 bg-blue-50',
    high: 'text-red-500 bg-red-50',
  };

  const statusColors = {
    ideas: 'bg-amber-400',
    drafts: 'bg-orange-400',
    scheduled: 'bg-blue-400',
    published: 'bg-emerald-400',
    archived: 'bg-zinc-400',
  };

  return (
    <div className="bg-white border border-[#EAE8E4] rounded-sm overflow-x-auto no-scrollbar">
      <table className="w-full text-right border-collapse min-w-[700px]">
        <thead>
          <tr className="bg-[#F9F8F6] border-b border-[#EAE8E4]">
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">الحالة</th>
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">العنوان</th>
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">الأولوية</th>
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">الفئة</th>
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">التاريخ</th>
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-center">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <motion.tr 
              key={task.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${statusColors[task.status]}`} />
                  <span className="text-[11px] font-bold text-zinc-600">{STATUS_LABELS[task.status]}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div>
                  <div className="text-xs font-bold text-[#121212]">{task.title}</div>
                  {task.subtasks && task.subtasks.length > 0 && (
                    <div className="mt-1 w-32">
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                          <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">
                            {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}
                          </span>
                        </div>
                        <span className="text-[9px] text-zinc-400 font-bold">
                          {Math.round((task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100)}%
                        </span>
                      </div>
                      <div className="h-0.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100}%` }}
                          className="h-full bg-emerald-500" 
                        />
                      </div>
                    </div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${priorityColors[task.priority]}`}>
                  {PRIORITY_LABELS[task.priority]}
                </span>
              </td>
              <td className="px-6 py-4 text-[11px] text-zinc-500 font-medium">
                {task.category}
              </td>
              <td className="px-6 py-4 text-[11px] text-zinc-500 font-medium font-mono">
                {task.date}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-center gap-3">
                  <button onClick={() => onEdit(task)} className="text-zinc-400 hover:text-[#121212] transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDelete(task.id)} className="text-zinc-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
          {tasks.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-zinc-400 text-sm italic">
                لا يوجد محتوى لعرضه
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
