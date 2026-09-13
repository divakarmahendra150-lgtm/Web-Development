import React from 'react';
import { Flame, Brain, Shield, Heart, Sparkles } from 'lucide-react';

const ICON_MAP = {
  strength: Flame,
  intellect: Brain,
  discipline: Shield,
  vitality: Heart,
  charisma: Sparkles,
};

export default function StatCard({
  name,
  value = 1,
  color = 'text-blue-400',
  bg = 'bg-blue-500/10',
  border = 'border-blue-500/30',
  desc = '',
}) {
  const Icon = ICON_MAP[name.toLowerCase()] || Sparkles;

  return (
    <div className={`p-4 rounded-xl border ${border} ${bg} flex items-center justify-between transition-all hover:scale-[1.02]`}>
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-lg bg-black/40 border border-white/5 ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-semibold capitalize text-gray-200">{name}</h4>
          {desc && <p className="text-[11px] text-gray-400">{desc}</p>}
        </div>
      </div>
      <div className="text-right">
        <span className={`text-2xl font-bold font-mono ${color}`}>{value}</span>
        <span className="text-[10px] text-gray-500 block uppercase tracking-wider">Points</span>
      </div>
    </div>
  );
}
