import React, { useState, useEffect } from 'react';
import { X, Sparkles, Zap, Coins } from 'lucide-react';
import { CATEGORIES, DIFFICULTIES } from '../../utils/constants';

export default function QuestModal({ isOpen, onClose, onSubmit, initialQuest = null }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('coding');
  const [difficulty, setDifficulty] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialQuest) {
      setTitle(initialQuest.title || '');
      setDescription(initialQuest.description || '');
      setCategory(initialQuest.category || 'coding');
      setDifficulty(initialQuest.difficulty || 'medium');
      setDueDate(initialQuest.due_date || '');
    } else {
      setTitle('');
      setDescription('');
      setCategory('coding');
      setDifficulty('medium');
      setDueDate('');
    }
    setError('');
  }, [initialQuest, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Quest title is required.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        category,
        difficulty,
        due_date: dueDate || null,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save quest.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedDiff = DIFFICULTIES.find((d) => d.id === difficulty) || DIFFICULTIES[1];
  const selectedCat = CATEGORIES.find((c) => c.id === category) || CATEGORIES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#121826] border border-[#2A364F] rounded-2xl p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#2A364F]">
          <div>
            <span className="text-xs uppercase font-mono tracking-widest text-amber-400 font-bold">
              Guild Bulletin Board
            </span>
            <h2 className="text-xl font-bold text-gray-100 font-rpg">
              {initialQuest ? 'Edit Quest' : 'Forge New Quest'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Quest Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Master Binary Search Trees in Python"
              className="w-full px-4 py-2.5 rounded-xl bg-[#0B0F19] border border-[#2A364F] text-gray-100 text-sm focus:border-amber-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Description / Objectives (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Detail the lore and criteria for victory..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#0B0F19] border border-[#2A364F] text-gray-100 text-sm focus:border-amber-500 transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0B0F19] border border-[#2A364F] text-gray-100 text-sm focus:border-amber-500 transition-colors"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label} ({cat.attribute})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0B0F19] border border-[#2A364F] text-gray-100 text-sm focus:border-amber-500 transition-colors"
              >
                {DIFFICULTIES.map((diff) => (
                  <option key={diff.id} value={diff.id}>
                    {diff.label} ({diff.xp} XP)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Due Date (Optional)
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0B0F19] border border-[#2A364F] text-gray-100 text-sm focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Reward preview pill */}
          <div className="p-3 rounded-xl bg-black/40 border border-[#2A364F] flex items-center justify-between text-xs font-mono">
            <span className="text-gray-400">Projected Spoils:</span>
            <div className="flex items-center gap-3">
              <span className="text-cyan-400 flex items-center gap-1 font-bold">
                <Zap className="w-3.5 h-3.5" /> +{selectedDiff.xp} XP
              </span>
              <span className="text-amber-400 flex items-center gap-1 font-bold">
                <Coins className="w-3.5 h-3.5" /> +{selectedDiff.gold} Gold
              </span>
              <span className="text-purple-400 flex items-center gap-1 font-bold">
                <Sparkles className="w-3.5 h-3.5" /> +{selectedCat.attribute}
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#2A364F]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-gray-950 font-bold text-sm shadow-glow-gold transition-all duration-200 cursor-pointer font-rpg disabled:opacity-50"
            >
              {submitting ? 'Forging...' : initialQuest ? 'Update Quest' : 'Post Quest'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
