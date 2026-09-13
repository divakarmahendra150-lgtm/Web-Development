import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Zap,
  Coins,
  Flame,
  Award,
  Swords,
  Brain,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex flex-col">
      {/* Public Navbar */}
      <header className="w-full border-b border-[#2A364F]/60 bg-[#0B0F19]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-glow-gold">
              <Shield className="w-5 h-5 text-gray-950 font-black" />
            </div>
            <span className="font-bold text-xl font-rpg text-amber-400 tracking-wider">
              LIFE RPG
            </span>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-gray-950 font-bold text-sm shadow-glow-gold transition-all duration-200 font-rpg"
              >
                ENTER REALM
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-gray-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-gray-950 font-bold text-sm shadow-glow-gold transition-all duration-200 font-rpg"
                >
                  START JOURNEY
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-28 px-4 sm:px-8 flex-1 flex items-center">
        {/* Background Glowing Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-semibold mb-6 animate-pulse-slow">
            <Sparkles className="w-3.5 h-3.5" /> OFFICIAL SUBMISSION — TECH ZEPHYR 4.0 (IIT BHUBANESWAR)
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-100 to-gray-400 font-rpg mb-6 leading-tight">
            TURN YOUR REAL LIFE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">
              INTO AN RPG.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Traditional to-do lists feel like boring chores. Life RPG turns your habits,
            workouts, code sessions, and studies into high-stakes quests with instant XP,
            Gold, non-linear leveling, and legendary rewards.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-gray-950 font-bold text-base shadow-glow-gold hover:brightness-110 transition-all cursor-pointer font-rpg tracking-wider flex items-center justify-center gap-2"
            >
              START YOUR JOURNEY <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-[#2A364F] text-gray-200 font-bold text-base transition-colors"
            >
              Resume Quest
            </Link>
          </div>

          {/* Quick Pillars */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 text-left">
            <div className="rpg-card rounded-xl p-4 border border-[#2A364F]">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 w-fit mb-2">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-gray-200">Instant XP</h3>
              <p className="text-xs text-gray-400 mt-1">Non-linear exponential level curves</p>
            </div>

            <div className="rpg-card rounded-xl p-4 border border-[#2A364F]">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 w-fit mb-2">
                <Coins className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-gray-200">Gold Economy</h3>
              <p className="text-xs text-gray-400 mt-1">Spend loot on shop rewards & themes</p>
            </div>

            <div className="rpg-card rounded-xl p-4 border border-[#2A364F]">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 w-fit mb-2">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-gray-200">5 RPG Attributes</h3>
              <p className="text-xs text-gray-400 mt-1">Intellect, Strength, Discipline & more</p>
            </div>

            <div className="rpg-card rounded-xl p-4 border border-[#2A364F]">
              <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400 w-fit mb-2">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-gray-200">Streak System</h3>
              <p className="text-xs text-gray-400 mt-1">Daily consistency multiplier</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section className="py-20 bg-[#0B0F19]/60 border-t border-[#2A364F]/60 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
              The Architecture of Progression
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-100 font-rpg mt-2">
              Why Traditional To-Do Apps Fail
            </h2>
            <p className="text-sm text-gray-400 mt-3">
              Standard task apps treat life like a chore checklist with delayed gratification.
              Life RPG bridges psychological reward cycles with genuine game mechanics.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="rpg-card rounded-2xl p-6 border border-[#2A364F]">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 w-fit mb-4">
                <Swords className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-100 mb-2 font-rpg">Active Quest Log</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Organize quests into Coding, Fitness, Study, Health, and Personal realms.
                Ranked by Easy, Medium, Hard, and Epic difficulty tiers.
              </p>
            </div>

            <div className="rpg-card rounded-2xl p-6 border border-[#2A364F]">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 w-fit mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-100 mb-2 font-rpg">Legendary Badges</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Unlock achievements for completing 10 quests, maintaining a 30-day streak,
                or mastering Coding quests. Show off your titles.
              </p>
            </div>

            <div className="rpg-card rounded-2xl p-6 border border-[#2A364F]">
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 w-fit mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-100 mb-2 font-rpg">PostgreSQL Source of Truth</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                All XP, Gold, Level transitions, and stats are computed server-side with
                Django REST transactions and persistent PostgreSQL storage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-[#2A364F]/60 bg-[#070A11] px-4 sm:px-8 text-center text-xs text-gray-400">
        <p className="font-semibold text-gray-300">
          Life RPG — Web Hackathon Submission for Tech Zephyr 4.0
        </p>
        <p className="mt-1">Indian Institute of Technology (IIT) Bhubaneswar</p>
      </footer>
    </div>
  );
}
