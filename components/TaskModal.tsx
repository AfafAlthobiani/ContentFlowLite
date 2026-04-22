'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, X, Calendar, Tag, FileText, ChevronDown, Plus, Trash2, CheckCircle2, Circle, Bell, Sparkles, Share2 } from 'lucide-react';
import { Task, TaskStatus, TaskPriority, SubTask, STATUS_LABELS, PRIORITY_LABELS, CATEGORIES, BrandSettings } from '@/types';
import { GoogleGenAI } from "@google/genai";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  brand?: BrandSettings;
  initialTask?: Task | null;
  defaultStatus?: TaskStatus;
}

export default function TaskModal({
  isOpen,
  onClose,
  onSave,
  brand,
  initialTask,
  defaultStatus = 'ideas',
}: TaskModalProps) {
  const [formData, setFormData] = useState<Partial<Task>>({
    title: initialTask?.title || '',
    status: initialTask?.status || defaultStatus,
    priority: initialTask?.priority || 'medium',
    platform: initialTask?.platform || 'Instagram',
    category: initialTask?.category || CATEGORIES[0],
    date: initialTask?.date || new Date().toISOString().split('T')[0],
    notes: initialTask?.notes || '',
    reminder: initialTask?.reminder || '',
    subtasks: initialTask?.subtasks || [],
    performance: initialTask?.performance || { views: 0, likes: 0, shares: 0 }
  });

  const [hasRestoredDraft, setHasRestoredDraft] = useState(false);

  // Load draft once on mount or when opening
  useEffect(() => {
    if (isOpen && !hasRestoredDraft) {
      const draftKey = initialTask ? `cf_draft_${initialTask.id}` : `cf_draft_new_${defaultStatus}`;
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft) {
        try {
          const parsedDraft = JSON.parse(savedDraft);
          setFormData(prev => ({ ...prev, ...parsedDraft, status: prev.status || parsedDraft.status }));
          setHasRestoredDraft(true);
        } catch (e) {
          console.error('Failed to load draft', e);
        }
      } else {
        // If no draft, ensure initial task data is synced if editingTask changed
        if (initialTask) {
          setFormData({
            title: initialTask.title,
            status: initialTask.status,
            priority: initialTask.priority,
            platform: initialTask.platform,
            category: initialTask.category,
            date: initialTask.date,
            notes: initialTask.notes,
            reminder: initialTask.reminder,
            subtasks: initialTask.subtasks,
            performance: initialTask.performance
          });
        }
      }
    }
    if (!isOpen) {
      setHasRestoredDraft(false);
    }
  }, [isOpen, initialTask, defaultStatus, hasRestoredDraft]);

  // Auto-save logic - only for saving
  useEffect(() => {
    if (isOpen) {
      const draftKey = initialTask ? `cf_draft_${initialTask.id}` : `cf_draft_new_${defaultStatus}`;
      localStorage.setItem(draftKey, JSON.stringify(formData));
    }
  }, [formData, isOpen, initialTask, defaultStatus]);

  const [aiLoading, setAiLoading] = useState(false);

  const generateAIContent = async () => {
    if (!formData.title) return alert('يرجى كتابة عنوان أولاً');
    setAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
      const prompt = `أنت مساعد خبير في صناعة المحتوى على ${formData.platform}. 
      العنوان الحالي: ${formData.title}. 
      نبرة صوت العلامة: ${brand?.tone || 'عامة'}.
      وصف العلامة: ${brand?.description || 'لا يوجد'}.
      الكلمات المفتاحية: ${brand?.keywords?.join(', ') || 'لا توجد'}.
      قم بتوليد ملاحظات محتوى (Caption) تتضمن:
      1. نص جذاب للمنشور.
      2. قائمة بـ 5 وسوم (Hashtags) مناسبة.
      3. نصيحة سريعة لزيادة التفاعل.
      اجعل الرد باللغة العربية بأسلوب احترافي ومختصر.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      setFormData({ ...formData, notes: response.text });
    } catch (error) {
      console.error(error);
      alert('فشل الاتصال بالذكاء الاصطناعي');
    } finally {
      setAiLoading(false);
    }
  };

  const [newSubtask, setNewSubtask] = useState('');

  const addSubtask = () => {
    if (!newSubtask.trim()) return;
    const subtask: SubTask = {
      id: Math.random().toString(36).substr(2, 9),
      title: newSubtask,
      completed: false,
    };
    setFormData({ ...formData, subtasks: [...(formData.subtasks || []), subtask] });
    setNewSubtask('');
  };

  const removeSubtask = (id: string) => {
    setFormData({ ...formData, subtasks: (formData.subtasks || []).filter(s => s.id !== id) });
  };

  const toggleSubtask = (id: string) => {
    setFormData({
      ...formData,
      subtasks: (formData.subtasks || []).map(s => s.id === id ? { ...s, completed: !s.completed } : s)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;
    
    // Clear draft on successful save
    const draftKey = initialTask ? `cf_draft_${initialTask.id}` : `cf_draft_new_${defaultStatus}`;
    localStorage.removeItem(draftKey);
    
    onSave(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="flex justify-between items-center p-6 border-b border-zinc-100">
              <div>
                <h2 className="text-xl font-serif font-bold text-[#121212]">
                  {initialTask ? 'تعديل المهمة' : 'مهمة جديدة'}
                </h2>
                {hasRestoredDraft && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">تم استعادة المسودة تلقائياً</span>
                    <button 
                      type="button" 
                      onClick={() => {
                        const draftKey = initialTask ? `cf_draft_${initialTask.id}` : `cf_draft_new_${defaultStatus}`;
                        localStorage.removeItem(draftKey);
                        setFormData({
                          title: initialTask?.title || '',
                          status: initialTask?.status || defaultStatus,
                          priority: initialTask?.priority || 'medium',
                          platform: initialTask?.platform || 'Instagram',
                          category: initialTask?.category || CATEGORIES[0],
                          date: initialTask?.date || new Date().toISOString().split('T')[0],
                          notes: initialTask?.notes || '',
                          reminder: initialTask?.reminder || '',
                          subtasks: initialTask?.subtasks || [],
                          performance: initialTask?.performance || { views: 0, likes: 0, shares: 0 }
                        });
                        setHasRestoredDraft(false);
                      }}
                      className="text-[9px] text-zinc-400 hover:text-red-500 underline underline-offset-2 ml-2"
                    >
                      حذف المسودة
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block">
                  عنوان المحتوى
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: فيديو ترويجي لإطلاق المنتج الجديد"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full text-lg bg-zinc-50 border-none rounded-xl py-3 px-4 focus:ring-1 focus:ring-[#121212] focus:bg-white transition-all outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block">
                    الحالة
                  </label>
                  <div className="relative">
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                      className="w-full bg-zinc-50 border-none rounded-xl py-3 pr-4 pl-10 appearance-none focus:ring-1 focus:ring-[#121212] focus:bg-white transition-all outline-none text-sm font-medium"
                    >
                      {Object.entries(STATUS_LABELS).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block">
                    الأولوية
                  </label>
                  <div className="relative">
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                      className="w-full bg-zinc-50 border-none rounded-xl py-3 pr-4 pl-10 appearance-none focus:ring-1 focus:ring-[#121212] focus:bg-white transition-all outline-none text-sm font-medium"
                    >
                      {Object.entries(PRIORITY_LABELS).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </select>
                    <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block">
                    المنصة
                  </label>
                  <div className="relative">
                    <select
                      value={formData.platform}
                      onChange={(e) => setFormData({ ...formData, platform: e.target.value as any })}
                      className="w-full bg-zinc-50 border-none rounded-xl py-3 pr-4 pl-10 appearance-none focus:ring-1 focus:ring-[#121212] focus:bg-white transition-all outline-none text-sm font-medium"
                    >
                      {['Instagram', 'TikTok', 'X', 'YouTube', 'Facebook', 'LinkedIn'].map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                    <Share2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  </div>
                  {/* Platform Quick Tip */}
                  <p className="text-[9px] text-zinc-400 italic px-1">
                    {formData.platform === 'Instagram' && '💡 نصيحة: استخدم Reels لانتشار أوسع حالياً.'}
                    {formData.platform === 'TikTok' && '💡 نصيحة: أول 3 ثواني هي الأهم لجذب الانتباه.'}
                    {formData.platform === 'YouTube' && '💡 نصيحة: العنوان والصورة المصغرة هما مفتاح النقر.'}
                    {formData.platform === 'LinkedIn' && '💡 نصيحة: المحتوى المهني والتعليمي يحقق أفضل تفاعل.'}
                    {formData.platform === 'X' && '💡 نصيحة: الاختصار والترندات الحالية تزيد من الوصول.'}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block">
                    الفئة
                  </label>
                  <div className="relative">
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-zinc-50 border-none rounded-xl py-3 pr-4 pl-10 appearance-none focus:ring-1 focus:ring-[#121212] focus:bg-white transition-all outline-none text-sm font-medium"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  </div>
                </div>
              </div>

              {initialTask && formData.status === 'published' && (
                <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                  <label className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-3 block">إحصائيات الأداء</label>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] text-zinc-400 block">مشاهدات</span>
                      <input 
                        type="number" 
                        value={formData.performance?.views}
                        onChange={e => setFormData({...formData, performance: {...formData.performance, views: parseInt(e.target.value)}})}
                        className="w-full bg-white rounded-lg px-2 py-1.5 text-xs outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-zinc-400 block">إعجابات</span>
                      <input 
                        type="number" 
                        value={formData.performance?.likes}
                        onChange={e => setFormData({...formData, performance: {...formData.performance, likes: parseInt(e.target.value)}})}
                        className="w-full bg-white rounded-lg px-2 py-1.5 text-xs outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-zinc-400 block">مشاركة</span>
                      <input 
                        type="number" 
                        value={formData.performance?.shares}
                        onChange={e => setFormData({...formData, performance: {...formData.performance, shares: parseInt(e.target.value)}})}
                        className="w-full bg-white rounded-lg px-2 py-1.5 text-xs outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block">
                    التاريخ
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full bg-zinc-50 border-none rounded-xl py-3 pr-10 pl-4 focus:ring-1 focus:ring-[#121212] focus:bg-white transition-all outline-none text-sm"
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block">
                    تذكير
                  </label>
                  <div className="relative">
                    <input
                      type="datetime-local"
                      value={formData.reminder}
                      onChange={(e) => setFormData({ ...formData, reminder: e.target.value })}
                      className="w-full bg-zinc-50 border-none rounded-xl py-3 pr-10 pl-4 focus:ring-1 focus:ring-[#121212] focus:bg-white transition-all outline-none text-[10px]"
                    />
                    <Bell className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block">
                    ملاحظات المحتوى
                  </label>
                  <button
                    type="button"
                    onClick={generateAIContent}
                    disabled={aiLoading}
                    className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700 disabled:opacity-50"
                  >
                    <Sparkles className={`w-3 h-3 ${aiLoading ? 'animate-spin' : ''}`} />
                    {aiLoading ? 'جاري التوليد...' : 'كتابة بالذكاء الاصطناعي'}
                  </button>
                </div>
                <div className="relative">
                  <textarea
                    placeholder="أضف تفاصيل المحتوى هنا..."
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-zinc-50 border-none rounded-xl py-3 px-4 focus:ring-1 focus:ring-[#121212] focus:bg-white transition-all outline-none text-sm resize-none min-h-[120px]"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block">
                  المهام الفرعية
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    placeholder="أضف مهمة فرعية..."
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
                    className="flex-1 bg-zinc-50 border-none rounded-xl py-2 px-4 focus:ring-1 focus:ring-[#121212] focus:bg-white transition-all outline-none text-sm"
                  />
                  <button
                    type="button"
                    onClick={addSubtask}
                    className="bg-[#121212] text-white p-2 rounded-xl"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-1 max-h-40 overflow-y-auto no-scrollbar">
                  {(formData.subtasks || []).map((st) => (
                    <div key={st.id} className="flex items-center gap-2 bg-zinc-50 p-2 rounded-lg group">
                      <button
                        type="button"
                        onClick={() => toggleSubtask(st.id)}
                        className="text-zinc-400 hover:text-[#121212]"
                      >
                        {st.completed ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Circle className="w-5 h-5" />}
                      </button>
                      <span className={`text-sm flex-1 ${st.completed ? 'text-zinc-400 line-through' : 'text-zinc-700'}`}>
                        {st.title}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeSubtask(st.id)}
                        className="text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-3">
                <div className="flex justify-between items-center px-1">
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-emerald-500 rounded-full" />
                    <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">تم الحفظ تلقائياً في السحابة المحلية</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-[#121212] text-white py-4 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-200"
                  >
                    {initialTask ? 'حفظ التغييرات' : 'إضافة المهمة'}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 bg-zinc-100 text-zinc-600 py-4 rounded-xl text-sm font-bold hover:bg-zinc-200 transition-colors"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
