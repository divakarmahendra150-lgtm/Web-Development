import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Zap, Coins, Sparkles, X } from 'lucide-react';

export default function QuestCompleteToast({ feedback, onDismiss }) {
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [feedback, onDismiss]);

  if (!feedback) return null;

  return (
    <AnimatePresence>
      <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="relative p-4 rounded-xl bg-gradient-to-r from-[#121826] to-[#1A2333] border-2 border-cyan-500/50 shadow-glow-xp overflow-hidden"
        >
          {/* Glowing accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-amber-400 to-purple-400" />

          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 font-bold block">
                  VICTORY ACHIEVED
                </span>
                <h4 className="text-sm font-bold text-gray-100 font-rpg">
                  QUEST COMPLETE!
                </h4>
              </div>
            </div>

            <button
              onClick={onDismiss}
              className="text-gray-400 hover:text-gray-200 p-1 rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-800 text-xs font-mono">
            <span className="flex items-center gap-1 text-cyan-400 font-bold">
              <Zap className="w-3.5 h-3.5" /> +{feedback.xp_earned} XP
            </span>
            <span className="flex items-center gap-1 text-amber-400 font-bold">
              <Coins className="w-3.5 h-3.5" /> +{feedback.gold_earned} Gold
            </span>
            {feedback.attribute_gained && (
              <span className="flex items-center gap-1 text-purple-400 capitalize font-bold">
                <Sparkles className="w-3.5 h-3.5" /> +{feedback.attribute_points} {feedback.attribute_gained}
              </span>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
