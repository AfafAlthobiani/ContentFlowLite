export type TaskStatus = 'ideas' | 'drafts' | 'scheduled' | 'published' | 'archived';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface PerformanceMetrics {
  views?: number;
  likes?: number;
  shares?: number;
}

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: string;
  date: string;
  notes: string;
  reminder?: string;
  subtasks: SubTask[];
  platform?: 'Instagram' | 'TikTok' | 'X' | 'YouTube' | 'Facebook' | 'LinkedIn';
  performance?: PerformanceMetrics;
}

export interface BrandSettings {
  tone: string;
  keywords: string[];
  colors: string[];
  description: string;
  userName?: string;
  userRole?: string;
  userBio?: string;
  avatarUrl?: string;
}

export interface ResourceLink {
  id: string;
  title: string;
  url: string;
  category: 'templates' | 'music' | 'tools' | 'other';
}

export interface Goal {
  id: string;
  platform: string;
  metric: string;
  target: number;
  current: number;
  month: string;
}

export const STATUS_LABELS: Record<TaskStatus, string> = {
  ideas: 'الأفكار',
  drafts: 'المسودات',
  scheduled: 'مجدول',
  published: 'منشور',
  archived: 'الأرشيف',
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'منخفضة',
  medium: 'متوسطة',
  high: 'عالية',
};

export const CATEGORIES = [
  'تسويق',
  'تعليمي',
  'ترفيهي',
  'شخصي',
  'أخرى'
];
