export const CATEGORIES = [
  { id: 'coding', label: 'Coding', attribute: 'Intellect', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  { id: 'study', label: 'Study', attribute: 'Intellect', color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/30' },
  { id: 'fitness', label: 'Fitness', attribute: 'Strength', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  { id: 'health', label: 'Health', attribute: 'Vitality', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  { id: 'reading', label: 'Reading', attribute: 'Intellect', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
  { id: 'work', label: 'Work', attribute: 'Discipline', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  { id: 'personal', label: 'Personal', attribute: 'Discipline', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  { id: 'other', label: 'Other', attribute: 'Charisma', color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/30' },
];

export const DIFFICULTIES = [
  { id: 'easy', label: 'Easy', xp: 50, gold: 25, color: 'text-emerald-400', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
  { id: 'medium', label: 'Medium', xp: 100, gold: 50, color: 'text-amber-400', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
  { id: 'hard', label: 'Hard', xp: 200, gold: 100, color: 'text-red-400', badge: 'bg-red-500/20 text-red-300 border-red-500/40' },
  { id: 'epic', label: 'Epic', xp: 400, gold: 200, color: 'text-purple-400', badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40' },
];

export const ATTRIBUTES = [
  { id: 'strength', label: 'Strength', icon: 'Flame', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', desc: 'Physical power & workout discipline' },
  { id: 'intellect', label: 'Intellect', icon: 'Brain', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', desc: 'Coding, studying & deep reading' },
  { id: 'discipline', label: 'Discipline', icon: 'Shield', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30', desc: 'Habits, work ethics & focus' },
  { id: 'vitality', label: 'Vitality', icon: 'Heart', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', desc: 'Health, sleep & daily nutrition' },
  { id: 'charisma', label: 'Charisma', icon: 'Sparkles', color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/30', desc: 'Social engagement & personal life' },
];

export const RARITIES = {
  common: { label: 'Common', border: 'border-gray-600', text: 'text-gray-300', bg: 'bg-gray-800/50' },
  rare: { label: 'Rare', border: 'border-blue-500/50', text: 'text-blue-400', bg: 'bg-blue-950/40' },
  epic: { label: 'Epic', border: 'border-purple-500/50', text: 'text-purple-400', bg: 'bg-purple-950/40' },
  legendary: { label: 'Legendary', border: 'border-amber-500/60', text: 'text-amber-400', bg: 'bg-amber-950/40' },
};
