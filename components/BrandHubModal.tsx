'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, Link as LinkIcon, Target, Palette, Sparkles, Plus, Trash2, ExternalLink, User, Camera } from 'lucide-react';
import { BrandSettings, ResourceLink, Goal } from '@/types';

interface BrandHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand: BrandSettings;
  resources: ResourceLink[];
  goals: Goal[];
  onUpdateBrand: (brand: BrandSettings) => void;
  onUpdateResources: (resources: ResourceLink[]) => void;
  onUpdateGoals: (goals: Goal[]) => void;
}

export default function BrandHubModal({
  isOpen,
  onClose,
  brand,
  resources,
  goals,
  onUpdateBrand,
  onUpdateResources,
  onUpdateGoals,
}: BrandHubModalProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'brand' | 'resources' | 'goals'>('profile');

  // Resource Form State
  const [newRes, setNewRes] = useState({ title: '', url: '', category: 'tools' as any });
  // Goal Form State
  const [newGoal, setNewGoal] = useState({ platform: 'Instagram', metric: 'متابعين', target: 0 });

  const addResource = () => {
    if (!newRes.title || !newRes.url) return;
    onUpdateResources([...resources, { ...newRes, id: Math.random().toString(36).substr(2, 9) }]);
    setNewRes({ title: '', url: '', category: 'tools' });
  };

  const addGoal = () => {
    if (newGoal.target <= 0) return;
    onUpdateGoals([...goals, { 
      ...newGoal, 
      id: Math.random().toString(36).substr(2, 9), 
      current: 0, 
      month: new Date().toLocaleString('ar-SA', { month: 'long' }) 
    }]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="flex justify-between items-center p-8 border-b border-zinc-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#121212] rounded-xl">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-[#121212]">Brand Hub | مركز العلامة</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                <X className="w-6 h-6 text-zinc-400" />
              </button>
            </div>

            <div className="flex border-b border-zinc-50 px-8 flex-wrap">
              {[
                { id: 'profile', label: 'الملف الشخصي', icon: User },
                { id: 'brand', label: 'هوية العلامة', icon: Palette },
                { id: 'resources', label: 'الموارد والروابط', icon: LinkIcon },
                { id: 'goals', label: 'الأهداف والنمو', icon: Target },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === tab.id ? 'border-[#121212] text-[#121212]' : 'border-transparent text-zinc-400 hover:text-zinc-600'}`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
              {activeTab === 'profile' && (
                <div className="space-y-10">
                  <div className="flex flex-col items-center">
                    <div className="relative group">
                      <div className="w-24 h-24 bg-zinc-100 rounded-full flex items-center justify-center border-4 border-white shadow-xl overflow-hidden">
                        {brand.avatarUrl ? (
                          <img src={brand.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-10 h-10 text-zinc-300" />
                        )}
                      </div>
                      <div className="absolute bottom-0 right-0 p-2 bg-[#121212] text-white rounded-full shadow-lg">
                        <Camera className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <h4 className="text-lg font-serif font-bold text-[#121212]">{brand.userName || 'مستخدم جديد'}</h4>
                      <p className="text-xs text-zinc-400">{brand.userRole || 'لا يوجد دور وظيفي محدد'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block">الاسم الكامل</label>
                      <input 
                        type="text"
                        value={brand.userName || ''}
                        onChange={(e) => onUpdateBrand({ ...brand, userName: e.target.value })}
                        placeholder="اسمك الكريم..."
                        className="w-full bg-zinc-50 border-none rounded-2xl py-4 px-6 focus:ring-1 focus:ring-[#121212] outline-none text-sm"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block">التخصص / الدور</label>
                      <input 
                        type="text"
                        value={brand.userRole || ''}
                        onChange={(e) => onUpdateBrand({ ...brand, userRole: e.target.value })}
                        placeholder="مثلاً: صانع محتوى تقني..."
                        className="w-full bg-zinc-50 border-none rounded-2xl py-4 px-6 focus:ring-1 focus:ring-[#121212] outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block">نبذة تعريفية (Bio)</label>
                    <textarea 
                      rows={3}
                      value={brand.userBio || ''}
                      onChange={(e) => onUpdateBrand({ ...brand, userBio: e.target.value })}
                      placeholder="تحدث عن نفسك بإيجاز..."
                      className="w-full bg-zinc-50 border-none rounded-2xl py-4 px-6 focus:ring-1 focus:ring-[#121212] outline-none text-sm resize-none"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'brand' && (
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block">نبرة الصوت (Tone of Voice)</label>
                    <input 
                      type="text"
                      value={brand.tone}
                      onChange={(e) => onUpdateBrand({ ...brand, tone: e.target.value })}
                      placeholder="مثال: ملهم، تقني مبسط، مرح..."
                      className="w-full bg-zinc-50 border-none rounded-2xl py-4 px-6 focus:ring-1 focus:ring-[#121212] outline-none text-sm"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block">وصف العلامة</label>
                    <textarea 
                      rows={3}
                      value={brand.description}
                      onChange={(e) => onUpdateBrand({ ...brand, description: e.target.value })}
                      placeholder="اشرح طبيعة محتواك للذكاء الاصطناعي..."
                      className="w-full bg-zinc-50 border-none rounded-2xl py-4 px-6 focus:ring-1 focus:ring-[#121212] outline-none text-sm resize-none"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block">الكلمات المفتاحية (Keywords)</label>
                    <input 
                      type="text"
                      value={brand.keywords.join(', ')}
                      onChange={(e) => onUpdateBrand({ ...brand, keywords: e.target.value.split(',').map(k => k.trim()) })}
                      placeholder="فصل بين الكلمات بفاصلة..."
                      className="w-full bg-zinc-50 border-none rounded-2xl py-4 px-6 focus:ring-1 focus:ring-[#121212] outline-none text-sm"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'resources' && (
                <div className="space-y-8">
                  <div className="bg-zinc-50 p-6 rounded-3xl space-y-4">
                    <h4 className="text-sm font-bold text-[#121212]">أضف مورد جديد</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <input 
                        placeholder="العنوان" 
                        value={newRes.title}
                        onChange={e => setNewRes({...newRes, title: e.target.value})}
                        className="bg-white border-none rounded-xl py-3 px-4 text-xs outline-none"
                      />
                      <input 
                        placeholder="الرابط (URL)" 
                        value={newRes.url}
                        onChange={e => setNewRes({...newRes, url: e.target.value})}
                        className="bg-white border-none rounded-xl py-3 px-4 text-xs outline-none"
                      />
                    </div>
                    <button 
                      onClick={addResource}
                      className="w-full bg-[#121212] text-white py-3 rounded-xl text-xs font-bold"
                    >إضافة</button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {resources.map(res => (
                      <div key={res.id} className="flex items-center justify-between p-4 border border-zinc-100 rounded-2xl group hover:border-[#121212] transition-all">
                        <div className="flex items-center gap-3">
                          <LinkIcon className="w-4 h-4 text-zinc-400" />
                          <div>
                            <p className="text-xs font-bold text-[#121212]">{res.title}</p>
                            <p className="text-[10px] text-zinc-400 truncate max-w-[150px]">{res.url}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <a href={res.url} target="_blank" rel="noreferrer" className="p-2 text-zinc-400 hover:text-blue-500">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <button 
                            onClick={() => onUpdateResources(resources.filter(r => r.id !== res.id))}
                            className="p-2 text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'goals' && (
                <div className="space-y-8">
                  <div className="bg-zinc-50 p-6 rounded-3xl space-y-4">
                    <h4 className="text-sm font-bold text-[#121212]">حدد هدفاً شهرياً</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <select 
                        value={newGoal.platform}
                        onChange={e => setNewGoal({...newGoal, platform: e.target.value})}
                        className="bg-white border-none rounded-xl py-3 px-4 text-xs outline-none"
                      >
                        <option>Instagram</option>
                        <option>TikTok</option>
                        <option>X</option>
                        <option>YouTube</option>
                      </select>
                      <input 
                        placeholder="المعيار (مثلاً متابعين)" 
                        value={newGoal.metric}
                        onChange={e => setNewGoal({...newGoal, metric: e.target.value})}
                        className="bg-white border-none rounded-xl py-3 px-4 text-xs outline-none" 
                      />
                      <input 
                        type="number" 
                        placeholder="الرقم المستهدف" 
                        value={newGoal.target}
                        onChange={e => setNewGoal({...newGoal, target: parseInt(e.target.value)})}
                        className="bg-white border-none rounded-xl py-3 px-4 text-xs outline-none" 
                      />
                    </div>
                    <button 
                      onClick={addGoal}
                      className="w-full bg-[#121212] text-white py-3 rounded-xl text-xs font-bold"
                    >تثبيت الهدف</button>
                  </div>

                  <div className="space-y-4">
                    {goals.map(goal => (
                      <div key={goal.id} className="p-5 border border-zinc-100 rounded-3xl space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{goal.platform} • {goal.month}</span>
                          <button onClick={() => onUpdateGoals(goals.filter(g => g.id !== goal.id))} className="text-zinc-300 hover:text-red-500">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex justify-between items-end">
                          <h5 className="text-sm font-bold text-[#121212]">{goal.metric}</h5>
                          <p className="text-xs font-mono font-bold text-zinc-400">{goal.current} / {goal.target}</p>
                        </div>
                        <div className="w-full h-1.5 bg-zinc-50 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(goal.current / goal.target) * 100}%` }}
                            className="h-full bg-emerald-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-8 bg-zinc-50 border-t border-zinc-100 flex justify-end">
              <button onClick={onClose} className="px-8 py-3 bg-[#121212] text-white rounded-2xl text-xs font-bold shadow-xl shadow-zinc-200">
                حفظ وإغلاق
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
