'use client';

import React from 'react';
import { Layout, PenTool, Search, Menu } from 'lucide-react';
import { motion } from 'motion/react';

interface NavbarProps {
  onSearch: (query: string) => void;
  onAddTask: () => void;
  onMenuClick: () => void;
}

export default function Navbar({ onSearch, onAddTask, onMenuClick }: NavbarProps) {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 pt-10">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 w-full md:w-auto">
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <h2 className="text-3xl font-serif text-[#121212]">لوحة التحكم</h2>
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 bg-white border border-[#EAE8E4] rounded-md text-zinc-500"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
        <div className="hidden md:block h-6 w-px bg-[#EAE8E4]"></div>
        <div className="group relative w-full md:w-auto">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-[#121212] transition-colors" />
          <input
            type="text"
            placeholder="بحث عن المهام..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full md:w-72 bg-transparent border border-[#EAE8E4] rounded-md py-2 pr-10 pl-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#121212] transition-all"
          />
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onAddTask}
        className="btn-black w-full md:w-auto bg-[#121212] text-white px-6 py-2.5 rounded-sm text-sm font-medium flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors"
      >
        <span>إضافة محتوى جديد</span>
        <span className="text-lg leading-none">+</span>
      </motion.button>
    </header>
  );
}
