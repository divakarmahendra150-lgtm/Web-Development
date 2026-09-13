import React from 'react';
import { Link } from 'react-router-dom';
import { Coins, Flame, Zap, Shield, Plus, LogOut, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useGame } from '../../hooks/useGame';
import { formatNumber } from '../../utils/format';

export default function Navbar({ onOpenNewQuest }) {
  const { user, logout } = useAuth();
  const { character } = useGame();

  return (
    <header className="sticky top-0 z-30 w-full bg-[#0B0F19]/90 backdrop-blur-md border-b border-[#2A364F]/80 px-4 sm:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Mobile Brand / App Title */}
        <div className="flex items-center gap-3 md:hidden">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-glow-gold">
              <Shield className="w-4 h-4 text-black font-black" />
            </div>
            <span className="font-bold text-base font-rpg text-amber-400">LIFE RPG</span>
          </Link>
        </div>

        {/* Global Game Stats Header: Level, XP Bar, Gold, Streak */}
        {character && (
          <div className="flex-1 flex items-center justify-end md:justify-between gap-4 sm:gap-6">
            {/* XP and Level Summary Bar (desktop) */}
            <div className="hidden md:flex items-center gap-4 flex-1 max-w-md">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-400 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30">
                  Lv {character.level}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-[11px] font-mono text-gray-400 mb-1">
                  <span className="text-cyan-400 font-semibold flex items-center gap-1">
                    <Zap className="w-3 h-3" /> XP Progress
                  </span>
                  <span>
                    {formatNumber(character.xp_in_level)} / {formatNumber(character.xp_needed)} XP
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-cyan-950/50 border border-cyan-800/30 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-glow-xp rounded-full transition-all duration-500"
                    style={{ width: `${character.xp_progress_percent || 0}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Currency & Streaks */}
            <div className="flex items-center gap-3 sm:gap-5">
              {/* Streak */}
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 font-mono text-xs font-bold"
                title="Current Daily Streak"
              >
                <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
                <span>{character.current_streak} {character.current_streak === 1 ? 'Day' : 'Days'}</span>
              </div>

              {/* Gold */}
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold"
                title="Gold Balance"
              >
                <Coins className="w-4 h-4 text-amber-400" />
                <span>{formatNumber(character.gold)} G</span>
              </div>

              {/* Quick Add Quest Button */}
              {onOpenNewQuest && (
                <button
                  onClick={onOpenNewQuest}
                  className="hidden sm:flex items-center gap-1.5 py-1.5 px-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-gray-950 font-bold text-xs shadow-glow-gold transition-all duration-200 cursor-pointer font-rpg"
                >
                  <Plus className="w-4 h-4" /> NEW QUEST
                </button>
              )}

              {/* User Dropdown / Profile link */}
              <div className="flex items-center gap-2 pl-2 border-l border-gray-800">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 p-1 rounded-lg hover:bg-white/5 transition-colors"
                  title="Profile & Settings"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white border border-white/20">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="hidden lg:inline text-xs font-semibold text-gray-200">
                    {user?.username}
                  </span>
                </Link>

                <button
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                  title="Log Out"
                  aria-label="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
