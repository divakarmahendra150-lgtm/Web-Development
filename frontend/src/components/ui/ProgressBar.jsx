import React from 'react';
import { motion } from 'framer-motion';

export default function ProgressBar({
  value = 0,
  max = 100,
  label = '',
  sublabel = '',
  color = 'cyan', // cyan, amber, purple, red, emerald
  size = 'md',
  showPercent = true,
}) {
  const percent = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

  const colorStyles = {
    cyan: {
      bar: 'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-glow-xp',
      track: 'bg-cyan-950/40 border-cyan-800/30',
      text: 'text-cyan-400',
    },
    amber: {
      bar: 'bg-gradient-to-r from-amber-500 to-yellow-400 shadow-glow-gold',
      track: 'bg-amber-950/40 border-amber-800/30',
      text: 'text-amber-400',
    },
    purple: {
      bar: 'bg-gradient-to-r from-purple-500 to-indigo-500 shadow-glow-purple',
      track: 'bg-purple-950/40 border-purple-800/30',
      text: 'text-purple-400',
    },
    red: {
      bar: 'bg-gradient-to-r from-red-500 to-rose-500 shadow-glow-red',
      track: 'bg-red-950/40 border-red-800/30',
      text: 'text-red-400',
    },
    emerald: {
      bar: 'bg-gradient-to-r from-emerald-500 to-teal-400',
      track: 'bg-emerald-950/40 border-emerald-800/30',
      text: 'text-emerald-400',
    },
  }[color] || {
    bar: 'bg-cyan-500',
    track: 'bg-gray-800 border-gray-700',
    text: 'text-gray-300',
  };

  const heights = {
    sm: 'h-2',
    md: 'h-3.5',
    lg: 'h-5',
  };

  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1.5 text-xs font-medium">
          <span className="text-gray-300">{label}</span>
          <div className="flex items-center gap-2">
            {sublabel && <span className="text-gray-400 text-[11px]">{sublabel}</span>}
            {showPercent && (
              <span className={`font-mono font-semibold ${colorStyles.text}`}>
                {percent.toFixed(1)}%
              </span>
            )}
          </div>
        </div>
      )}
      <div
        className={`w-full ${heights[size]} rounded-full overflow-hidden border ${colorStyles.track} p-0.5`}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <motion.div
          className={`h-full rounded-full ${colorStyles.bar}`}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
