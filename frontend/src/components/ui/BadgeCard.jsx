import React from 'react';
import { Award, Shield, Trophy, Crown, Zap, Flame, Code, BookOpen, Dumbbell, Star, Lock } from 'lucide-react';
import { RARITIES } from '../../utils/constants';
import { formatDate } from '../../utils/format';

const ICON_MAP = {
  award: Award,
  shield: Shield,
  trophy: Trophy,
  crown: Crown,
  zap: Zap,
  flame: Flame,
  code: Code,
  'book-open': BookOpen,
  dumbbell: Dumbbell,
  star: Star,
};

export default function BadgeCard({ badge, unlocked = false, unlockedAt = null }) {
  const Icon = ICON_MAP[badge.icon] || Award;
  const rarity = RARITIES[badge.rarity] || RARITIES.common;

  return (
    <div
      className={`relative p-4 rounded-xl border transition-all duration-300 ${
        unlocked
          ? `${rarity.bg} ${rarity.border} hover:shadow-lg hover:-translate-y-1`
          : 'bg-gray-900/40 border-gray-800/80 opacity-60 grayscale'
      }`}
    >
      <div className="flex items-start gap-3.5">
        <div
          className={`p-3 rounded-xl border ${
            unlocked
              ? `${rarity.bg} ${rarity.border} ${rarity.text}`
              : 'bg-gray-800 border-gray-700 text-gray-500'
          }`}
        >
          {unlocked ? <Icon className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className={`text-sm font-bold truncate ${unlocked ? 'text-gray-100' : 'text-gray-400'}`}>
              {badge.name}
            </h4>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold border ${
                unlocked ? `${rarity.border} ${rarity.text}` : 'border-gray-700 text-gray-500'
              }`}
            >
              {badge.rarity}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1 line-clamp-2">{badge.description}</p>
          {unlocked && unlockedAt && (
            <p className="text-[11px] text-gray-500 mt-2">
              Unlocked on {formatDate(unlockedAt)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
