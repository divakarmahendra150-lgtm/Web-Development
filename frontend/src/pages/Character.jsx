import React, { useState, useEffect } from 'react';
import {
  Shield,
  Zap,
  Coins,
  Flame,
  Award,
  Crown,
  TrendingUp,
  Sparkles,
  Lock,
  CheckCircle2,
} from 'lucide-react';
import { useGame } from '../hooks/useGame';
import { useAuth } from '../hooks/useAuth';
import ProgressBar from '../components/ui/ProgressBar';
import StatCard from '../components/ui/StatCard';
import BadgeCard from '../components/ui/BadgeCard';
import { ATTRIBUTES } from '../utils/constants';
import { formatNumber, formatDate } from '../../src/utils/format';
import { questService } from '../services/questService';

export default function Character() {
  const { user } = useAuth();
  const { character, progression } = useGame();

  const [allBadges, setAllBadges] = useState([]);
  const [loadingBadges, setLoadingBadges] = useState(true);

  useEffect(() => {
    questService.getBadges().then((data) => {
      setAllBadges(data);
      setLoadingBadges(false);
    }).catch((err) => {
      console.error('Failed to load badges:', err);
      setLoadingBadges(false);
    });
  }, []);

  if (!character) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const unlockedCount = allBadges.filter((b) => b.unlocked).length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-amber-400" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 font-rpg">
            Character Sheet
          </h1>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Review your hero's attributes, streak record, leveling trajectory, and honors.
        </p>
      </div>

      {/* Hero Dossier Card */}
      <div className="rpg-card rounded-3xl p-6 sm:p-8 border border-amber-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          {/* Avatar & Title */}
          <div className="flex items-center gap-5">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 p-1 shadow-glow-gold">
              <div className="w-full h-full bg-[#0B0F19] rounded-[22px] flex items-center justify-center">
                <Crown className="w-12 h-12 text-amber-400 animate-float" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 font-rpg">
                  {user?.username}
                </h2>
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  Level {character.level}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {user?.title || 'Fledgling Adventurer'} &bull; Joined {formatDate(user?.created_at)}
              </p>
              {user?.bio && (
                <p className="text-xs text-gray-300 italic mt-2 max-w-md">"{user.bio}"</p>
              )}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-center">
              <span className="text-[10px] text-gray-400 uppercase font-mono block">Total XP</span>
              <span className="text-lg font-bold font-mono text-cyan-400">{formatNumber(character.total_xp)}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-center">
              <span className="text-[10px] text-gray-400 uppercase font-mono block">Gold Loot</span>
              <span className="text-lg font-bold font-mono text-amber-400">{formatNumber(character.gold)} G</span>
            </div>
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-center">
              <span className="text-[10px] text-gray-400 uppercase font-mono block">Current Streak</span>
              <span className="text-lg font-bold font-mono text-orange-400">{character.current_streak} d</span>
            </div>
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-center">
              <span className="text-[10px] text-gray-400 uppercase font-mono block">Longest Streak</span>
              <span className="text-lg font-bold font-mono text-emerald-400">{character.longest_streak} d</span>
            </div>
          </div>
        </div>

        {/* Level Progression Bar */}
        <div className="mt-8 pt-6 border-t border-[#2A364F]">
          <div className="flex justify-between items-center text-xs font-mono mb-2">
            <span className="text-cyan-400 font-bold flex items-center gap-1.5">
              <Zap className="w-4 h-4" /> Level {character.level} &rarr; Level {character.level + 1} Progression
            </span>
            <span className="text-gray-300">
              {formatNumber(character.xp_in_level)} / {formatNumber(character.xp_needed)} XP ({character.xp_progress_percent}%)
            </span>
          </div>
          <ProgressBar
            value={character.xp_in_level}
            max={character.xp_needed}
            color="cyan"
            size="lg"
            showPercent={false}
          />
        </div>
      </div>

      {/* 5 RPG Attributes */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold text-gray-100 font-rpg">Attribute Profile</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {ATTRIBUTES.map((attr) => (
            <StatCard
              key={attr.id}
              name={attr.label}
              value={character[attr.id] || 1}
              color={attr.color}
              bg={attr.bg}
              border={attr.border}
              desc={attr.desc}
            />
          ))}
        </div>
      </div>

      {/* Non-Linear Level Milestones */}
      {progression?.milestones && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-gray-100 font-rpg">
              Non-Linear Level Curve (100 &times; Level^{1.8})
            </h2>
          </div>

          <div className="rpg-card rounded-2xl p-6 border border-[#2A364F] overflow-x-auto">
            <div className="flex items-center justify-between min-w-[600px] gap-4">
              {progression.milestones.map((m) => (
                <div
                  key={m.level}
                  className={`flex-1 p-4 rounded-xl border text-center transition-all ${
                    m.reached
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-glow-gold/10'
                      : 'bg-black/30 border-gray-800 text-gray-500'
                  }`}
                >
                  <span className="text-xs font-mono uppercase block text-gray-400">Rank</span>
                  <span className="text-xl font-black font-rpg block mt-1">
                    Level {m.level}
                  </span>
                  <span className="text-xs font-mono block mt-2 text-cyan-400 font-semibold">
                    {formatNumber(m.xp_required)} XP
                  </span>
                  <div className="mt-3">
                    {m.reached ? (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono font-bold">
                        <CheckCircle2 className="w-3 h-3" /> Unlocked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] text-gray-500 font-mono">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Badges / Honors Showcase */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-gray-100 font-rpg">
              Badges & Honors ({unlockedCount} / {allBadges.length} Unlocked)
            </h2>
          </div>
        </div>

        {loadingBadges ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allBadges.map((badge) => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                unlocked={badge.unlocked}
                unlockedAt={badge.unlocked_at}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
