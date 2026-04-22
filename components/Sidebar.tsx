'use client';

import React from 'react';
import { Layout, Clock, Archive, User, Zap, HardDrive, X, Shield, Tags } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Task, CATEGORIES } from '@/types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBrandHub: () => void;
  onSetViewMode: (mode: 'kanban' | 'list' | 'calendar' | 'timeline' | 'archive') => void;
  onSetCategory: (cat: string) => void;
  currentView: string;
  currentCategory: string;
  tasks?: Task[];
}

export default function Sidebar({ 
  isOpen, 
  onClose, 
  onOpenBrandHub, 
  onSetViewMode, 
  onSetCategory,
  currentView, 
  currentCategory,
  tasks = [] 
}: SidebarProps) {
  const usagePercentage = Math.min((tasks.length / 50) * 100, 100);
  
  return (
    <>
      {/* Background Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={`
        fixed right-0 top-0 h-screen w-64 bg-[#F9F8F6] border-l border-[#EAE8E4] flex-col p-8 z-50 transition-transform duration-300 lg:translate-x-0 lg:flex
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <button 
          onClick={onClose}
          className="lg:hidden absolute left-4 top-4 p-2 text-zinc-400 hover:text-[#121212]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-12">
          <h1 className="text-2xl font-serif font-bold tracking-tight text-[#121212]">ContentFlow</h1>
          <p className="text-[10px] text-zinc-400 font-sans uppercase tracking-widest mt-1">نسخة لايت بريميوم</p>
        </div>
      
      <nav className="space-y-8 flex-1">
        <div className="space-y-4">
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-4">الرئيسية</div>
          <button 
            onClick={() => { onSetViewMode('kanban'); onClose(); }}
            className={`group flex items-center justify-between text-sm font-medium w-full text-right transition-all px-3 py-2 rounded-xl ${currentView === 'kanban' ? 'bg-white text-[#121212] shadow-sm' : 'text-zinc-500 hover:text-[#121212] hover:bg-zinc-50'}`}
          >
            <div className="flex items-center gap-3">
              <Layout className={`w-4 h-4 ${currentView === 'kanban' ? 'text-[#121212]' : 'text-zinc-300 group-hover:text-[#121212]'}`} />
              <span>لوحة التحكم</span>
            </div>
            {currentView === 'kanban' && <motion.div layoutId="active" className="w-1 h-1 bg-[#121212] rounded-full" />}
          </button>

          <button 
            onClick={() => { onOpenBrandHub(); onClose(); }}
            className={`group flex items-center gap-3 text-sm font-medium w-full text-right transition-all px-3 py-2 rounded-xl text-zinc-500 hover:text-[#121212] hover:bg-zinc-50`}
          >
            <Shield className="w-4 h-4 text-zinc-300 group-hover:text-[#121212]" />
            <span>مركز العلامة & الملف</span>
          </button>

          <button 
            onClick={() => { onSetViewMode('timeline'); onClose(); }}
            className={`group flex items-center justify-between text-sm font-medium w-full text-right transition-all px-3 py-2 rounded-xl ${currentView === 'timeline' ? 'bg-white text-[#121212] shadow-sm' : 'text-zinc-500 hover:text-[#121212] hover:bg-zinc-50'}`}
          >
            <div className="flex items-center gap-3">
              <Clock className={`w-4 h-4 ${currentView === 'timeline' ? 'text-[#121212]' : 'text-zinc-300 group-hover:text-[#121212]'}`} />
              <span>المخطط الزمني</span>
            </div>
            {currentView === 'timeline' && <motion.div layoutId="active" className="w-1 h-1 bg-[#121212] rounded-full" />}
          </button>

          <button 
            onClick={() => { onSetViewMode('archive'); onClose(); }}
            className={`group flex items-center justify-between text-sm font-medium w-full text-right transition-all px-3 py-2 rounded-xl ${currentView === 'archive' ? 'bg-white text-[#121212] shadow-sm' : 'text-zinc-500 hover:text-[#121212] hover:bg-zinc-50'}`}
          >
            <div className="flex items-center gap-3">
              <Archive className={`w-4 h-4 ${currentView === 'archive' ? 'text-[#121212]' : 'text-zinc-300 group-hover:text-[#121212]'}`} />
              <span>الأرشيف</span>
            </div>
            {currentView === 'archive' && <motion.div layoutId="active" className="w-1 h-1 bg-[#121212] rounded-full" />}
          </button>
        </div>

        <div className="space-y-4">
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-4">التصنيفات</div>
          <button 
            onClick={() => { onSetCategory('all'); onClose(); }}
            className={`flex items-center gap-3 text-sm font-medium w-full text-right transition-all px-3 py-1.5 rounded-lg ${currentCategory === 'all' ? 'text-[#121212] bg-zinc-100' : 'text-zinc-500 hover:text-[#121212]'}`}
          >
            <Tags className="w-3.5 h-3.5" />
            <span>كل التصنيفات</span>
          </button>
          <div className="flex flex-col gap-0.5 pr-4 border-r border-zinc-100">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => { onSetCategory(cat); onClose(); }}
                className={`text-right py-1.5 px-3 rounded-lg text-xs transition-all ${currentCategory === cat ? 'bg-zinc-100 text-[#121212] font-bold' : 'text-zinc-400 hover:text-zinc-600'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-4">الإعدادات</div>
          <a href="#" className="flex items-center gap-3 text-sm text-zinc-500 hover:text-[#121212] transition-colors">
            <User className="w-4 h-4" />
            <span>الملف الشخصي</span>
          </a>
          <a href="#" className="flex items-center gap-3 text-sm text-zinc-500 hover:text-[#121212] transition-colors">
            <Zap className="w-4 h-4" />
            <span>تكامل المنصات</span>
          </a>
        </div>
      </nav>

      <div className="mt-auto">
        <div className="p-4 bg-white border border-[#EAE8E4] rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <HardDrive className="w-3 h-3 text-zinc-400" />
            <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">المساحة المستخدمة</p>
          </div>
          <div className="w-full h-1 bg-zinc-100 rounded-full mb-2">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${usagePercentage}%` }}
              className="h-full bg-[#121212] rounded-full"
            />
          </div>
          <p className="text-[10px] font-bold text-[#121212]">{tasks.length} / ٥٠ مهمة مخزنة</p>
        </div>
      </div>
    </aside>
    </>
  );
}
