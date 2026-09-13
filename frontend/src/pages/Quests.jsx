import React, { useState } from 'react';
import { Swords, Plus, Filter, Search, CheckCircle, Clock } from 'lucide-react';
import { useGame } from '../hooks/useGame';
import QuestCard from '../components/quest/QuestCard';
import QuestModal from '../components/quest/QuestModal';
import { CATEGORIES, DIFFICULTIES } from '../utils/constants';

export default function Quests() {
  const { quests, completeQuest, createQuest, updateQuest, deleteQuest } = useGame();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [statusFilter, setStatusFilter] = useState('active'); // active, completed, all

  const [isNewQuestModalOpen, setIsNewQuestModalOpen] = useState(false);
  const [editingQuest, setEditingQuest] = useState(null);

  const filteredQuests = quests.filter((q) => {
    // Status filter
    if (statusFilter === 'active' && q.status !== 'active') return false;
    if (statusFilter === 'completed' && q.status !== 'completed') return false;

    // Category filter
    if (selectedCategory && q.category !== selectedCategory) return false;

    // Difficulty filter
    if (selectedDifficulty && q.difficulty !== selectedDifficulty) return false;

    // Search filter
    if (search.trim()) {
      const query = search.toLowerCase();
      return (
        q.title.toLowerCase().includes(query) ||
        (q.description && q.description.toLowerCase().includes(query))
      );
    }

    return true;
  });

  const activeCount = quests.filter((q) => q.status === 'active').length;
  const completedCount = quests.filter((q) => q.status === 'completed').length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Swords className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 font-rpg">
              Quest Log
            </h1>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Complete real-world trials to earn authoritative XP, Gold, and raise attributes.
          </p>
        </div>

        <button
          onClick={() => setIsNewQuestModalOpen(true)}
          className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-gray-950 font-bold text-xs shadow-glow-gold hover:brightness-110 transition-all font-rpg flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> FORGE NEW QUEST
        </button>
      </div>

      {/* Filter & Search Controls */}
      <div className="rpg-card rounded-2xl p-4 border border-[#2A364F] space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search quests by title or objective..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0B0F19] border border-[#2A364F] text-gray-100 text-xs focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Status tabs */}
          <div className="flex items-center p-1 bg-[#0B0F19] rounded-xl border border-[#2A364F]">
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'active'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Active ({activeCount})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'completed'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Completed ({completedCount})
            </button>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'all'
                  ? 'bg-white/10 text-gray-100 border border-white/20 font-bold'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              All ({quests.length})
            </button>
          </div>
        </div>

        {/* Category & Difficulty dropdown filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#2A364F]/60 text-xs">
          <span className="text-gray-400 flex items-center gap-1 font-mono">
            <Filter className="w-3.5 h-3.5" /> Filters:
          </span>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#0B0F19] border border-[#2A364F] text-gray-300 text-xs focus:border-amber-500"
          >
            <option value="">All Realms (Categories)</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label} ({c.attribute})
              </option>
            ))}
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#0B0F19] border border-[#2A364F] text-gray-300 text-xs focus:border-amber-500"
          >
            <option value="">All Tiers (Difficulties)</option>
            {DIFFICULTIES.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label} (+{d.xp} XP)
              </option>
            ))}
          </select>

          {(selectedCategory || selectedDifficulty || search) && (
            <button
              onClick={() => {
                setSelectedCategory('');
                setSelectedDifficulty('');
                setSearch('');
              }}
              className="text-amber-400 hover:underline text-xs ml-auto"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Quest Grid */}
      {filteredQuests.length === 0 ? (
        <div className="rpg-card rounded-2xl p-12 border border-dashed border-[#2A364F] text-center">
          <Swords className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-300 font-rpg">No Quests Found</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1 mb-5">
            {search || selectedCategory || selectedDifficulty
              ? 'No quests match your selected filters. Try broadening your query.'
              : statusFilter === 'completed'
              ? 'You have not completed any quests yet. Take on a quest and harvest your victory!'
              : 'Your active quest log is clear. Forge a quest to begin!'}
          </p>
          <button
            onClick={() => setIsNewQuestModalOpen(true)}
            className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-gray-950 font-bold text-xs shadow-glow-gold font-rpg inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> FORGE QUEST
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredQuests.map((quest) => (
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
