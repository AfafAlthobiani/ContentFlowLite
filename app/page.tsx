'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutGrid, List, Calendar as CalendarIcon, Download, Upload, AlertCircle, Clock, Archive, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import DashboardStats from '@/components/DashboardStats';
import KanbanBoard from '@/components/KanbanBoard';
import ListView from '@/components/ListView';
import CalendarView from '@/components/CalendarView';
import TimelineView from '@/components/TimelineView';
import ArchiveView from '@/components/ArchiveView';
import TaskModal from '@/components/TaskModal';
import BrandHubModal from '@/components/BrandHubModal';
import Sidebar from '@/components/Sidebar';
import { Task, TaskStatus, TaskPriority, CATEGORIES, PRIORITY_LABELS, BrandSettings, ResourceLink, Goal, PerformanceMetrics } from '@/types';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'kanban' | 'list' | 'calendar' | 'timeline' | 'archive'>('kanban');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBrandHubOpen, setIsBrandHubOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Brand State
  const [brand, setBrand] = useState<BrandSettings>({
    tone: 'احترافي وتعليمي',
    description: '',
    keywords: [],
    colors: ['#121212']
  });
  const [resources, setResources] = useState<ResourceLink[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('ideas');
  const [isLoaded, setIsLoaded] = useState(false);
  const [notifiedTasks, setNotifiedTasks] = useState<string[]>([]);

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Check for due reminders
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      tasks.forEach(task => {
        if (task.reminder) {
          const reminderTime = new Date(task.reminder);
          if (reminderTime <= now && !notifiedTasks.includes(task.id) && task.status !== 'published') {
            if (Notification.permission === "granted") {
              new Notification("ContentFlow: تذكير بمهمة", {
                body: task.title,
                icon: "/favicon.ico"
              });
            } else {
              alert(`تذكير: ${task.title}`);
            }
            setNotifiedTasks(prev => [...prev, task.id]);
          }
        }
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [tasks, notifiedTasks]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [viewMode, selectedCategory, selectedPriority]);

  // Load from LocalStorage once on mount
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    const savedTasks = localStorage.getItem('contentflow_tasks');
    const savedBrand = localStorage.getItem('contentflow_brand');
    const savedResources = localStorage.getItem('contentflow_resources');
    const savedGoals = localStorage.getItem('contentflow_goals');
    const savedViewMode = localStorage.getItem('contentflow_viewmode');

    if (savedTasks) {
      try {
        const parsedTasks: Task[] = JSON.parse(savedTasks);
        setTasks(parsedTasks);
        
        const now = new Date();
        const alreadyPassed = parsedTasks
          .filter(t => t.reminder && new Date(t.reminder) <= now)
          .map(t => t.id);
        setNotifiedTasks(alreadyPassed);
      } catch (e) { console.error(e); }
    }

    if (savedBrand) setBrand(JSON.parse(savedBrand));
    if (savedResources) setResources(JSON.parse(savedResources));
    if (savedGoals) setGoals(JSON.parse(savedGoals));
    if (savedViewMode) setViewMode(savedViewMode as any);

    setIsLoaded(true);
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('contentflow_tasks', JSON.stringify(tasks));
      localStorage.setItem('contentflow_brand', JSON.stringify(brand));
      localStorage.setItem('contentflow_resources', JSON.stringify(resources));
      localStorage.setItem('contentflow_goals', JSON.stringify(goals));
      localStorage.setItem('contentflow_viewmode', viewMode);
    }
  }, [tasks, brand, resources, goals, viewMode, isLoaded]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             task.notes.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || task.category === selectedCategory;
      const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;
      return matchesSearch && matchesCategory && matchesPriority;
    });
  }, [tasks, searchQuery, selectedCategory, selectedPriority]);

  const handleAddTask = (status: TaskStatus = 'ideas') => {
    setEditingTask(null);
    setDefaultStatus(status);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = (id: string) => {
    if (confirm('هل أنت متأكد من رغبتك في حذف هذه المهمة؟')) {
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...t, ...taskData } as Task : t));
    } else {
      const newTask: Task = {
        id: Math.random().toString(36).substr(2, 9),
        title: taskData.title || '',
        status: taskData.status || 'ideas',
        priority: taskData.priority || 'medium',
        category: taskData.category || CATEGORIES[0],
        date: taskData.date || new Date().toISOString().split('T')[0],
        notes: taskData.notes || '',
        reminder: taskData.reminder || '',
        subtasks: taskData.subtasks || [],
      };
      setTasks([...tasks, newTask]);
    }
  };

  const handleMoveTask = (id: string, newStatus: TaskStatus) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const handleUpdateMetrics = (id: string, metrics: PerformanceMetrics) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, performance: metrics } : t));
  };

  const exportData = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `contentflow-backup-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedTasks = JSON.parse(event.target?.result as string);
        if (Array.isArray(importedTasks)) {
          if (confirm('سيؤدي هذا إلى دمج المهام المستوردة مع المهام الحالية. هل ترغب في المتابعة؟')) {
            setTasks([...tasks, ...importedTasks]);
          }
        }
      } catch (err) {
        alert('خطأ في قراءة الملف. تأكد من أنه ملف JSON صحيح.');
      }
    };
    reader.readAsText(file);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          className="text-3xl font-serif font-bold text-[#121212]"
        >
          ContentFlow
        </motion.div>
        <p className="mt-4 text-[10px] text-zinc-400 uppercase tracking-[0.2em] animate-pulse">جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className="flex bg-[#FDFCFB] min-h-screen">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onOpenBrandHub={() => setIsBrandHubOpen(true)}
        onSetViewMode={setViewMode}
        onSetCategory={setSelectedCategory}
        currentView={viewMode}
        currentCategory={selectedCategory}
        tasks={tasks} 
      />
      
      <main className="flex-1 lg:mr-64 relative">
        <div className="max-w-6xl mx-auto px-6 lg:px-12 pb-20">
          <Navbar 
            onSearch={setSearchQuery} 
            onAddTask={() => handleAddTask()} 
            onMenuClick={() => setIsSidebarOpen(true)}
          />

          <DashboardStats tasks={tasks} goals={goals} brand={brand} />

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              {/* Category indicator if filtered */}
              {selectedCategory !== 'all' && (
                <div className="flex items-center gap-2 bg-zinc-100 px-4 py-1.5 rounded-full border border-zinc-200">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#121212]">{selectedCategory}</span>
                  <button onClick={() => setSelectedCategory('all')} className="text-zinc-400 hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {selectedPriority !== 'all' && (
                <div className="flex items-center gap-2 bg-zinc-100 px-4 py-1.5 rounded-full border border-zinc-200">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">أولوية: {PRIORITY_LABELS[selectedPriority as TaskPriority]}</span>
                  <button onClick={() => setSelectedPriority('all')} className="text-zinc-400 hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {searchQuery && (
                <div className="flex items-center gap-2 bg-zinc-100 px-4 py-1.5 rounded-full border border-zinc-200">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">بحث: {searchQuery}</span>
                  <button onClick={() => setSearchQuery('')} className="text-zinc-400 hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
              {/* View Toggle */}
              <div className="flex bg-white rounded-lg border border-[#EAE8E4] p-1 shadow-sm">
                <button 
                  onClick={() => setViewMode('kanban')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'kanban' ? 'bg-zinc-100 text-[#121212]' : 'text-zinc-300 hover:text-zinc-500'}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-zinc-100 text-[#121212]' : 'text-zinc-300 hover:text-zinc-500'}`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode('calendar')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'calendar' ? 'bg-zinc-100 text-[#121212]' : 'text-zinc-300 hover:text-zinc-500'}`}
                >
                  <CalendarIcon className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode('timeline')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'timeline' ? 'bg-zinc-100 text-[#121212]' : 'text-zinc-300 hover:text-zinc-500'}`}
                >
                  <Clock className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode('archive')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'archive' ? 'bg-zinc-100 text-[#121212]' : 'text-zinc-300 hover:text-zinc-500'}`}
                >
                  <Archive className="w-4 h-4" />
                </button>
              </div>

              {/* Data Actions */}
              <div className="flex gap-2">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={importData} 
                  accept=".json" 
                  className="hidden" 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 border border-[#EAE8E4] rounded-lg text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:bg-zinc-50 transition-all"
                >
                  <Upload className="w-3.5 h-3.5" />
                  استيراد
                </button>
                <button 
                  onClick={exportData}
                  className="flex items-center gap-2 px-4 py-2 border border-[#EAE8E4] rounded-lg text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:bg-zinc-50 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  تصدير
                </button>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={viewMode + selectedCategory + selectedPriority}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {filteredTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white border border-dashed border-[#EAE8E4] rounded-lg">
                  <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
                    <LayoutGrid className="w-8 h-8 text-zinc-200" />
                  </div>
                  <h3 className="text-lg font-serif text-[#121212] mb-1">لا يوجد محتوى</h3>
                  <p className="text-sm text-zinc-400">حاول تغيير الفلاتر أو إضافة مهمة جديدة</p>
                </div>
              ) : viewMode === 'kanban' ? (
                <KanbanBoard 
                  tasks={filteredTasks}
                  onAddTask={handleAddTask}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                  onMoveTask={handleMoveTask}
                  onUpdateMetrics={handleUpdateMetrics}
                />
              ) : viewMode === 'list' ? (
                <ListView 
                  tasks={filteredTasks}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onMove={handleMoveTask}
                />
              ) : viewMode === 'timeline' ? (
                <TimelineView
                  tasks={filteredTasks}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onMove={handleMoveTask}
                />
              ) : viewMode === 'calendar' ? (
                <CalendarView 
                  tasks={filteredTasks}
                  onEdit={handleEditTask}
                />
              ) : (
                <ArchiveView
                  tasks={tasks} // Pass all tasks for internal filtering
                  onRestore={(id) => handleMoveTask(id, 'published')}
                  onDelete={handleDeleteTask}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Branding */}
        <footer className="mt-20 border-t border-[#EAE8E4] pt-12 pb-8 text-center max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px bg-zinc-100 flex-1 max-w-[100px]" />
            <h2 className="text-xl font-serif italic text-zinc-300">ContentFlow</h2>
            <div className="h-px bg-zinc-100 flex-1 max-w-[100px]" />
          </div>
          <p className="text-[10px] font-sans text-zinc-300 tracking-[0.3em] uppercase">Premium Social Planner • © 2026</p>
        </footer>
      </main>

      <TaskModal 
        key={editingTask?.id || `new-${defaultStatus}`}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        brand={brand}
        initialTask={editingTask}
        defaultStatus={defaultStatus}
      />

      <BrandHubModal 
        isOpen={isBrandHubOpen}
        onClose={() => setIsBrandHubOpen(false)}
        brand={brand}
        resources={resources}
        goals={goals}
        onUpdateBrand={setBrand}
        onUpdateResources={setResources}
        onUpdateGoals={setGoals}
      />
    </div>
  );
}
