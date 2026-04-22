'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Tag, Edit, Trash2, ArrowLeftRight, AlertCircle, Bell, Instagram, Youtube, Facebook, Linkedin, Video, Twitter, Share2, Eye, Heart, BarChart3, Save, X as CloseIcon } from 'lucide-react';
import { Task, TaskStatus, STATUS_LABELS, PRIORITY_LABELS, PerformanceMetrics } from '@/types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, status: TaskStatus) => void;
  onUpdateMetrics?: (id: string, metrics: PerformanceMetrics) => void;
}

export default function TaskCard({ task, onEdit, onDelete, onMove, onUpdateMetrics }: TaskCardProps) {
  const [showMoveMenu, setShowMoveMenu] = useState(false);
  const [isEditingMetrics, setIsEditingMetrics] = useState(false);
  const [metricsDraft, setMetricsDraft] = useState<PerformanceMetrics>(task.performance || { views: 0, likes: 0, shares: 0 });

  const platformMeta: any = {
    Instagram: { icon: Instagram, color: 'text-pink-500 bg-pink-50 border-pink-100' },
    TikTok: { icon: Video, color: 'text-zinc-900 bg-zinc-100 border-zinc-200' },
    YouTube: { icon: Youtube, color: 'text-red-600 bg-red-50 border-red-100' },
    X: { icon: Twitter, color: 'text-zinc-900 bg-zinc-50 border-zinc-200' },
    Facebook: { icon: Facebook, color: 'text-blue-600 bg-blue-50 border-blue-100' },
    LinkedIn: { icon: Linkedin, color: 'text-blue-800 bg-blue-50 border-blue-100' },
  };

  const priorityColors = {
    low: 'text-zinc-400 bg-zinc-50 border-zinc-100',
    medium: 'text-blue-500 bg-blue-50 border-blue-100',
    high: 'text-red-500 bg-red-50 border-red-100',
  };

  const handleSaveMetrics = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUpdateMetrics) {
      onUpdateMetrics(task.id, metricsDraft);
    }
    setIsEditingMetrics(false);
  };

  const currentMetrics = task.performance || { views: 0, likes: 0, shares: 0 };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      whileHover={{ y: -2 }}
      className="group bg-white p-5 border border-[#EAE8E4] rounded-sm shadow-[0_2px_4px_rgba(0,0,0,0.02)] hover:shadow-md transition-all cursor-grab active:cursor-grabbing relative"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-wrap gap-2">
          {task.platform && (
            <span className={`inline-flex items-center px-2 py-0.5 border rounded-full text-[9px] font-black uppercase tracking-widest ${platformMeta[task.platform]?.color || 'text-zinc-500 bg-zinc-50 border-zinc-100'}`}>
              {React.createElement(platformMeta[task.platform]?.icon || Share2, { className: "w-2.5 h-2.5 ml-1" })}
              {task.platform}
            </span>
          )}
          <span className="inline-block px-2 py-0.5 border border-[#EAE8E4] rounded-full text-[9px] font-black uppercase tracking-widest text-[#666]">
            {task.category}
          </span>
          <span className={`inline-flex items-center px-2 py-0.5 border rounded-full text-[10px] font-bold uppercase tracking-widest ${priorityColors[task.priority || 'medium']}`}>
            <AlertCircle className="w-2.5 h-2.5 ml-1" />
            {PRIORITY_LABELS[task.priority || 'medium']}
          </span>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMoveMenu(!showMoveMenu);
              }}
              className="p-1 text-zinc-300 hover:text-[#121212] transition-colors"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
            </button>
            {showMoveMenu && (
              <div className="absolute left-0 mt-2 w-32 bg-white border border-[#EAE8E4] rounded-md shadow-xl z-10 overflow-hidden">
                {(Object.keys(STATUS_LABELS) as TaskStatus[]).filter(s => s !== task.status).map(s => (
                  <button
                    key={s}
                    onClick={(e) => {
                      e.stopPropagation();
                      onMove(task.id, s);
                      setShowMoveMenu(false);
                    }}
                    className="w-full text-right px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-zinc-600 hover:bg-zinc-50 transition-colors"
                  >
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className="p-1 text-zinc-300 hover:text-[#121212] transition-colors"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            className="p-1 text-zinc-300 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <h4 className="text-sm font-bold text-[#121212] mb-2 leading-tight">
        {task.title}
      </h4>

      {task.subtasks && task.subtasks.length > 0 && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">مستوى الإنجاز</span>
              <span className="text-[10px] font-bold text-zinc-500">
                {task.subtasks.filter(s => s.completed).length} / {task.subtasks.length}
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-500">
              {Math.round((task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100)}%
            </span>
          </div>
          <div className="h-1 bg-zinc-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100}%` }}
              className="h-full bg-emerald-500" 
            />
          </div>
        </div>
      )}

      {task.notes && (
        <p className="text-[12px] text-zinc-400 mb-4 line-clamp-2 leading-relaxed">
          {task.notes}
        </p>
      )}

      {task.status === 'published' && (
        <div className="mb-4 pt-3 border-t border-zinc-50">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-1.5">
              <BarChart3 className="w-3 h-3 text-zinc-400" />
              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">إحصائيات الأداء</span>
            </div>
            {!isEditingMetrics ? (
              <button 
                onClick={(e) => { e.stopPropagation(); setIsEditingMetrics(true); }}
                className="text-[9px] font-bold text-blue-500 hover:underline"
              >
                تحديث
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={handleSaveMetrics} className="text-emerald-500 p-0.5"><Save className="w-3 h-3" /></button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsEditingMetrics(false); setMetricsDraft(currentMetrics); }} 
                  className="text-red-400 p-0.5"
                >
                  <CloseIcon className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {!isEditingMetrics ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3 text-zinc-300" />
                <span className="text-[11px] font-mono font-bold text-zinc-600">{(currentMetrics.views || 0).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-3 h-3 text-zinc-300" />
                <span className="text-[11px] font-mono font-bold text-zinc-600">{(currentMetrics.likes || 0).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Share2 className="w-3 h-3 text-zinc-300" />
                <span className="text-[11px] font-mono font-bold text-zinc-600">{(currentMetrics.shares || 0).toLocaleString()}</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2" onClick={e => e.stopPropagation()}>
              <div className="space-y-1">
                <span className="text-[8px] text-zinc-400 uppercase font-bold block">مشاهدات</span>
                <input 
                  type="number" 
                  value={metricsDraft.views}
                  onChange={e => setMetricsDraft({...metricsDraft, views: parseInt(e.target.value) || 0})}
                  className="w-full bg-zinc-50 rounded border-none px-1.5 py-0.5 text-[10px] outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[8px] text-zinc-400 uppercase font-bold block">إعجابات</span>
                <input 
                  type="number" 
                  value={metricsDraft.likes}
                  onChange={e => setMetricsDraft({...metricsDraft, likes: parseInt(e.target.value) || 0})}
                  className="w-full bg-zinc-50 rounded border-none px-1.5 py-0.5 text-[10px] outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[8px] text-zinc-400 uppercase font-bold block">مشاركة</span>
                <input 
                  type="number" 
                  value={metricsDraft.shares}
                  onChange={e => setMetricsDraft({...metricsDraft, shares: parseInt(e.target.value) || 0})}
                  className="w-full bg-zinc-50 rounded border-none px-1.5 py-0.5 text-[10px] outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center text-[10px] text-zinc-400 font-medium">
            <Calendar className="w-3 h-3 ml-1" />
            <span>{task.date}</span>
          </div>
          {task.reminder && (
            <div className="flex items-center text-[10px] text-blue-500 font-bold">
              <Bell className="w-3 h-3 ml-1" />
              <span className="font-mono">
                {new Date(task.reminder).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', hour12: false })}
              </span>
            </div>
          )}
        </div>
        <div className={`w-2 h-2 rounded-full ${
          task.status === 'ideas' ? 'bg-amber-400' :
          task.status === 'drafts' ? 'bg-orange-400' :
          task.status === 'scheduled' ? 'bg-blue-400' :
          task.status === 'published' ? 'bg-emerald-400' :
          'bg-zinc-400'
        }`} />
      </div>
    </motion.div>
  );
}
