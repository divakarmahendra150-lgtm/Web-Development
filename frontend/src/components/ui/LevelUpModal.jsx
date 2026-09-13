import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Sparkles, ArrowRight, Zap, Coins } from 'lucide-react';
import { formatNumber } from '../../utils/format';

export default function LevelUpModal({ data, onClose }) {
  if (!data) return null;

  const { level_before, level_after, total_xp, gold, attribute_gained } = data;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        {/* Glow backdrop effects */}
        <div className="absolute w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
        <div className="absolute w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none -translate-x-20 translate-y-20" />

        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="relative w-full max-w-md bg-gradient-to-b from-[#1A2333] to-[#0B0F19] border-2 border-amber-500/50 rounded-2xl p-6 sm:p-8 shadow-2xl text-center overflow-hidden"
        >
          {/* Top light beam */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

          {/* Animated Crown Icon */}
          <motion.div
            initial={{ rotate: -15, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-glow-gold flex items-center justify-center"
          >
            <div className="w-full h-full bg-[#0B0F19] rounded-[14px] flex items-center justify-center">
              <Crown className="w-10 h-10 text-amber-400 animate-float" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-xs uppercase tracking-[0.3em] font-semibold text-amber-400">
              Rank Promotion
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 mt-1 font-rpg">
              LEVEL UP!
            </h2>
          </motion.div>

          {/* Level Transition Pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="my-6 p-4 rounded-xl bg-black/40 border border-amber-500/30 flex items-center justify-center gap-4"
          >
            <div className="text-center">
              <span className="text-xs text-gray-400 block font-mono">Previous</span>
              <span className="text-2xl font-bold text-gray-400 font-mono">Lv {level_before}</span>
            </div>
            <ArrowRight className="w-6 h-6 text-amber-400 animate-pulse" />
            <div className="text-center">
              <span className="text-xs text-amber-300 block font-mono">New Rank</span>
              <span className="text-3xl font-black text-amber-400 font-mono">Lv {level_after}</span>
            </div>
          </motion.div>

          {/* Stats Improvements */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 gap-3 mb-6 text-left"
          >
            <div className="p-3 rounded-lg bg-white/5 border border-white/5 flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="text-[11px] text-gray-400 block">Total XP</span>
                <span className="text-sm font-bold text-cyan-300 font-mono">{formatNumber(total_xp)}</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/5 flex items-center gap-2.5">
              <Coins className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-[11px] text-gray-400 block">Total Gold</span>
                <span className="text-sm font-bold text-amber-300 font-mono">{formatNumber(gold)}</span>
              </div>
            </div>
          </motion.div>

          {attribute_gained && (
            <p className="text-xs text-emerald-400 mb-6 flex items-center justify-center gap-1.5 font-medium">
              <Sparkles className="w-4 h-4" />
              Attribute points gained in <span className="capitalize font-bold">{attribute_gained}</span>!
            </p>
          )}

          {/* Action button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-gray-950 font-bold text-base shadow-glow-gold hover:brightness-110 transition-all cursor-pointer font-rpg tracking-wider"
          >
            CONTINUE ADVENTURE
          </motion.button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
