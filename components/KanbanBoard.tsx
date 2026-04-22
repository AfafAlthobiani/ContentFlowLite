'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, GripVertical } from 'lucide-react';
import { Task, TaskStatus, STATUS_LABELS, PerformanceMetrics } from '@/types';
import TaskCard from './TaskCard';

interface KanbanBoardProps {
  tasks: Task[];
  onAddTask: (status: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onMoveTask: (id: string, newStatus: TaskStatus) => void;
  onUpdateMetrics?: (id: string, metrics: PerformanceMetrics) => void;
}

export default function KanbanBoard({
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onMoveTask,
  onUpdateMetrics
}: KanbanBoardProps) {
  const columns: TaskStatus[] = ['ideas', 'drafts', 'scheduled', 'published'];

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start pb-12">
      {columns.map((status) => (
        <div key={status} className="flex flex-col min-h-[500px]">
          <div className="flex justify-between items-end border-b-2 border-[#121212] pb-3 mb-6 px-1">
            <div className="flex items-center gap-3">
              <h3 className="serif font-bold text-lg text-[#121212]">
                {STATUS_LABELS[status]}
              </h3>
              <span className="text-[10px] uppercase tracking-widest text-[#999] font-bold">
                {getTasksByStatus(status).length}
              </span>
            </div>
            <button
              onClick={() => onAddTask(status)}
              className="p-1 text-zinc-300 hover:text-[#121212] transition-all"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 space-y-4">
            <AnimatePresence mode="popLayout">
              {getTasksByStatus(status).map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                  onMove={onMoveTask}
                  onUpdateMetrics={onUpdateMetrics}
                />
              ))}
            </AnimatePresence>
            
            {getTasksByStatus(status).length === 0 && (
              <div className="h-24 flex items-center justify-center border-2 border-dashed border-zinc-100 rounded-xl">
                 <p className="text-zinc-300 text-sm font-medium">لا توجد مهام</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
