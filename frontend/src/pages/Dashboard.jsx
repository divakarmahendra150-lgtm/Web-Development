import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Coins,
  Flame,
  Zap,
  Swords,
  Plus,
  Trophy,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Award,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useGame } from '../hooks/useGame';
import ProgressBar from '../components/ui/ProgressBar';
import StatCard from '../components/ui/StatCard';
import QuestCard from '../components/quest/QuestCard';
import QuestModal from '../components/quest/QuestModal';
import BadgeCard from '../components/ui/BadgeCard';
import { ATTRIBUTES } from '../utils/constants';
import { formatNumber } from '../utils/format';

export default function Dashboard() {
  const { user } = useAuth();
  const {
    character,
    stats,
    quests,
    loading,
    completeQuest,
    createQuest,
    updateQuest,
    deleteQuest,
  } = useGame();

  const [isNewQuestModalOpen, setIsNewQuestModalOpen] = useState(false);
  const [editingQuest, setEditingQuest] = useState(null);

  if (loading && !character) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs font-mono text-gray-400 uppercase tracking-widest">
            Loading Hero Dossier...
          </p>
        </div>
      </div>
    );
  }

  const activeQuests = quests.filter((q) => q.status === 'active').slice(0, 4);
  const recentBadges = stats?.badges || [];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Character Card */}
      {character && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#121826] via-[#1A2333] to-[#121826] border-2 border-amber-500/30 p-6 sm:p-8 shadow-2xl">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Left: Avatar & Identity */}
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 p-1 shadow-glow-gold">
                  <div className="w-full h-full bg-[#0B0F19] rounded-[14px] flex items-center justify-center overflow-hidden">
                    <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-amber-400 animate-float" />
                  </div>
                </div>
                <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-lg bg-amber-500 text-gray-950 font-black text-xs font-mono shadow-md">
                  Lv {character.level}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 font-rpg">
                    {user?.username}
                  </h1>
                  {user?.title && (
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                      {user.title}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400">
                  Total Experience: <span className="text-cyan-400 font-mono font-bold">{formatNumber(character.total_xp)} XP</span>
                </p>

                {/* Badges & Streak pill */}
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-mono font-bold">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span>{character.current_streak} Day Streak</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold">
                    <Coins className="w-4 h-4 text-amber-400" />
                    <span>{formatNumber(character.gold)} Gold</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: XP Gauge */}
            <div className="w-full md:w-80 bg-black/40 p-4 rounded-2xl border border-white/5">
              <div className="flex justify-between items-center text-xs mb-2 font-mono">
                <span className="text-cyan-400 font-bold flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" /> Next Level Threshold
                </span>
                <span className="text-gray-400">
                  {formatNumber(character.xp_in_level)} / {formatNumber(character.xp_needed)}
                </span>
              </div>
              <ProgressBar
                value={character.xp_in_level}
                max={character.xp_needed}
                color="cyan"
                size="md"
                showPercent={true}
              />
              <p className="text-[11px] text-gray-400 mt-2 text-right font-mono">
                {formatNumber(character.xp_needed - character.xp_in_level)} XP remaining to Level {character.level + 1}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 5 RPG Attributes Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-gray-100 font-rpg">Hero Attributes</h2>
          </div>
          <Link
            to="/character"
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            Detailed Character Sheet <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {ATTRIBUTES.map((attr) => {
            const value = character ? character[attr.id] : 1;
            return (
              <StatCard
                key={attr.id}
                name={attr.label}
                value={value}
                color={attr.color}
                bg={attr.bg}
                border={attr.border}
                desc={attr.desc}
              />
            );
          })}
        </div>
      </div>

      {/* Active Quests & Quick Add Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Swords className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-gray-100 font-rpg">Today's Active Quests</h2>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/quests"
              className="text-xs font-semibold text-gray-400 hover:text-gray-200"
            >
              View Quest Log ({quests.length})
            </Link>
            <button
              onClick={() => setIsNewQuestModalOpen(true)}
              className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-gray-950 font-bold text-xs shadow-glow-gold flex items-center gap-1.5 cursor-pointer font-rpg"
            >
              <Plus className="w-3.5 h-3.5" /> ADD QUEST
            </button>
          </div>
        </div>

        {activeQuests.length === 0 ? (
          <div className="rpg-card rounded-2xl p-8 border border-dashed border-[#2A364F] text-center">
            <Swords className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-300 font-rpg">No Active Quests in Log</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1 mb-4">
              Your hero is idle. Create your first quest today to earn XP, Gold, and raise your attributes!
            </p>
            <button
              onClick={() => setIsNewQuestModalOpen(true)}
              className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-gray-950 font-bold text-xs shadow-glow-gold font-rpg inline-flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> FORGE FIRST QUEST
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {activeQuests.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onComplete={completeQuest}
                onEdit={(q) => setEditingQuest(q)}
                onDelete={deleteQuest}
              />
            ))}
          </div>
        )}
      </div>

      {/* Achievements / Badges Preview */}
      {recentBadges.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-gray-100 font-rpg">Recent Badges Unlocked</h2>
            </div>
            <Link
              to="/character"
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              View All Badges <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {recentBadges.map((ub) => (
              <BadgeCard
                key={ub.id}
                badge={ub.badge}
                unlocked={true}
                unlockedAt={ub.unlocked_at}
              />
            ))}
          </div>
        </div>
      )}

      {/* Quest Modals */}
      <QuestModal
        isOpen={isNewQuestModalOpen}
        onClose={() => setIsNewQuestModalOpen(false)}
        onSubmit={createQuest}
      />

      <QuestModal
        isOpen={!!editingQuest}
        initialQuest={editingQuest}
        onClose={() => setEditingQuest(null)}
        onSubmit={(data) => updateQuest(editingQuest.id, data)}
      />
    </div>
  );
}
