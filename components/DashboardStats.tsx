'use client';

import React from 'react';
import { motion } from 'motion/react';
import { FileText, Clock, CheckCircle2, Lightbulb, Target, User } from 'lucide-react';
import { Task, Goal, BrandSettings } from '@/types';

interface DashboardStatsProps {
  tasks: Task[];
  goals?: Goal[];
  brand?: BrandSettings;
}

export default function DashboardStats({ tasks, goals = [], brand }: DashboardStatsProps) {
  const activeTasks = tasks.filter(t => t.status !== 'archived');
  const stats = [
    { label: 'إجمالي المهام', value: activeTasks.length },
    { label: 'المسودات', value: tasks.filter(t => t.status === 'drafts').length },
    { label: 'مجدول اليوم', value: tasks.filter(t => t.status === 'scheduled').length },
    { label: 'المحتوى المنشور', value: tasks.filter(t => t.status === 'published').length },
  ];

  return (
    <div className="space-y-6 mb-12">
      {brand?.userName && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden mb-10 bg-white p-8 rounded-[2.5rem] border border-[#EAE8E4] shadow-sm flex flex-col md:flex-row items-center md:items-start gap-8"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-50 rounded-full blur-3xl -translate-y-16 -translate-x-16" />
          <div className="relative group">
            <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center overflow-hidden border-4 border-[#FDFCFB] shadow-xl">
              {brand.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={brand.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-zinc-300" />
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white" />
          </div>
          <div className="relative text-center md:text-right space-y-2">
            <div className="space-y-1">
              <span className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.3em]">لوحة التحكم الرئيسية</span>
              <h2 className="text-3xl font-serif font-bold text-[#121212]">أهلاً بك مجدداً، {brand.userName}</h2>
            </div>
            <p className="text-sm text-zinc-500 max-w-md leading-relaxed">
              {brand.userBio || 'جاهز لصناعة محتوى إبداعي اليوم؟ ابدأ بتخطيط أفكارك وجدولتها للوصول لأكبر جمهور ممكن.'}
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <span className="px-3 py-1 bg-zinc-100 text-[10px] font-bold text-zinc-600 rounded-full border border-zinc-200">
                {brand.userRole || 'صانع محتوى'}
              </span>
              <span className="px-3 py-1 bg-emerald-50 text-[10px] font-bold text-emerald-600 rounded-full border border-emerald-100">
                الحساب نشط
              </span>
            </div>
          </div>
        </motion.div>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="metric-card border border-[#EAE8E4] p-4 lg:p-5 rounded-lg bg-white shadow-[0_2px_4px_rgba(0,0,0,0.02)]"
          >
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#666] mb-1">{stat.label}</p>
            <h3 className="text-2xl font-serif text-[#121212]">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {goals.length > 0 && (
        <div className="bg-[#121212] rounded-[2rem] p-8 text-white">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-5 h-5 text-emerald-400" />
            <h4 className="text-lg font-serif font-bold">تقدم الأهداف الشهرية</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {goals.map((goal) => (
              <div key={goal.id} className="space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  <span>{goal.platform}</span>
                  <span className="text-white">{goal.current} / {goal.target}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold">{goal.metric}</span>
                  <span className="text-emerald-400">{Math.round((goal.current / goal.target) * 100)}%</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(goal.current / goal.target) * 100}%` }}
                    className="h-full bg-emerald-400"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
