import React, { useState } from 'react';
import { CheckCircle, Clock, Calendar, Zap, Coins, MoreVertical, Edit2, Trash2, Shield } from 'lucide-react';
import { CATEGORIES, DIFFICULTIES } from '../../utils/constants';
import { formatDate } from '../../utils/format';

export default function QuestCard({ quest, onComplete, onEdit, onDelete }) {
  const [completing, setCompleting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const category = CATEGORIES.find((c) => c.id === quest.category) || CATEGORIES[7];
  const difficulty = DIFFICULTIES.find((d) => d.id === quest.difficulty) || DIFFICULTIES[1];
  const isCompleted = quest.status === 'completed';

  const handleComplete = async (e) => {
    e.stopPropagation();
    if (isCompleted || completing) return;
    setCompleting(true);
    try {
      await onComplete(quest.id);
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div
      className={`rpg-card rounded-2xl p-5 border transition-all duration-300 relative group ${
        isCompleted
          ? 'opacity-65 border-emerald-500/20 bg-emerald-950/10'
          : 'border-[#2A364F] hover:border-amber-500/40 hover:shadow-glow-gold'
      }`}
    >
      {/* Top row: category & difficulty badges & menu */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${category.bg} ${category.border} ${category.color}`}
          >
            {category.label}
          </span>
          <span
            className={`text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-md border ${difficulty.badge}`}
          >
            {difficulty.label}
          </span>
          {category.attribute && (
            <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
              +{category.attribute}
            </span>
          )}
        </div>

        {/* Action dropdown for active quests */}
        {!isCompleted && (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-400 hover:text-gray-200 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Quest options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 top-8 z-30 w-36 py-1.5 rounded-xl bg-[#1A2333] border border-[#2A364F] shadow-xl text-xs">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit(quest);
                    }}
                    className="w-full px-3 py-2 text-left flex items-center gap-2 text-gray-300 hover:bg-white/5 hover:text-white"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit Quest
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete(quest.id);
                    }}
                    className="w-full px-3 py-2 text-left flex items-center gap-2 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Abandon Quest
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Quest Title & Description */}
      <h3
        className={`text-base font-bold mb-1.5 line-clamp-2 ${
          isCompleted ? 'line-through text-gray-400' : 'text-gray-100 group-hover:text-amber-300'
        }`}
      >
        {quest.title}
      </h3>
      {quest.description && (
        <p className="text-xs text-gray-400 mb-4 line-clamp-2">{quest.description}</p>
      )}

      {/* Quest Rewards & Footer */}
      <div className="flex items-center justify-between pt-3 mt-2 border-t border-[#2A364F]/60">
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1 text-cyan-400 font-semibold" title="XP Reward">
            <Zap className="w-3.5 h-3.5" /> +{quest.xp_reward || difficulty.xp} XP
          </span>
          <span className="flex items-center gap-1 text-amber-400 font-semibold" title="Gold Reward">
            <Coins className="w-3.5 h-3.5" /> +{quest.gold_reward || difficulty.gold} G
          </span>
        </div>

        {/* Due date or completed date */}
        {quest.due_date && !isCompleted && (
          <div className="flex items-center gap-1 text-[11px] text-gray-400">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(quest.due_date)}</span>
          </div>
        )}
      </div>

      {/* Complete Quest Button */}
      <div className="mt-4">
        {isCompleted ? (
          <div className="w-full py-2 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4" /> Completed
          </div>
        ) : (
          <button
            onClick={handleComplete}
            disabled={completing}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-gray-950 font-bold text-xs shadow-md hover:shadow-glow-gold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer font-rpg disabled:opacity-50"
          >
            {completing ? (
              <span className="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle className="w-4 h-4" /> COMPLETE QUEST
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
