import React, { useState, useEffect } from 'react';
import {
  History as HistoryIcon,
  Zap,
  Coins,
  Award,
  Crown,
  CheckCircle,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import { questService } from '../services/questService';
import { formatNumber, formatDateTime } from '../utils/format';

export default function History() {
  const [tab, setTab] = useState('all'); // all, xp, gold
  const [entries, setEntries] = useState([]);
  const [xpHistory, setXpHistory] = useState([]);
  const [goldHistory, setGoldHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistoryData();
  }, []);

  const fetchHistoryData = async () => {
    try {
      setLoading(true);
      const [hist, xp, gold] = await Promise.all([
        questService.getHistory(50),
        questService.getXpHistory(),
        questService.getGoldHistory(),
      ]);
      setEntries(hist);
      setXpHistory(xp);
      setGoldHistory(gold);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  const getEntryIcon = (type) => {
    switch (type) {
      case 'quest_complete':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'level_up':
        return <Crown className="w-5 h-5 text-amber-400" />;
      case 'badge_unlock':
        return <Award className="w-5 h-5 text-purple-400" />;
      case 'reward_purchase':
        return <Coins className="w-5 h-5 text-amber-500" />;
      default:
        return <HistoryIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <HistoryIcon className="w-6 h-6 text-amber-400" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 font-rpg">
            Adventurer Chronicles
          </h1>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Historical chronicle of every completed quest, level advancement, XP harvest, and gold transaction.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center p-1 bg-[#121826] rounded-xl border border-[#2A364F] w-fit">
        <button
          onClick={() => setTab('all')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            tab === 'all'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          All Activity ({entries.length})
        </button>
        <button
          onClick={() => setTab('xp')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            tab === 'xp'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-bold'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          XP Ledger ({xpHistory.length})
        </button>
        <button
          onClick={() => setTab('gold')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            tab === 'gold'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Gold Ledger ({goldHistory.length})
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-mono text-gray-400">Loading Chronicles...</p>
        </div>
      ) : tab === 'all' ? (
        entries.length === 0 ? (
          <div className="rpg-card rounded-2xl p-12 border border-dashed border-[#2A364F] text-center">
            <HistoryIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-300 font-rpg">No Chronicles Yet</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1">
              Your adventures are just beginning. Complete your first quest to generate history!
            </p>
          </div>
        ) : (
          <div className="rpg-card rounded-2xl border border-[#2A364F] divide-y divide-[#2A364F]/60 overflow-hidden">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 shrink-0">
                    {getEntryIcon(entry.entry_type)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-gray-200 truncate">{entry.title}</h4>
                    <p className="text-xs text-gray-400 truncate">{entry.description}</p>
                    <span className="text-[11px] text-gray-500 font-mono mt-1 block">
                      {formatDateTime(entry.created_at)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 text-xs font-mono">
                  {entry.xp > 0 && (
                    <span className="text-cyan-400 font-bold flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5" /> +{formatNumber(entry.xp)} XP
                    </span>
                  )}
                  {entry.gold !== 0 && (
                    <span
                      className={`font-bold flex items-center gap-1 ${
                        entry.gold > 0 ? 'text-amber-400' : 'text-red-400'
                      }`}
                    >
                      <Coins className="w-3.5 h-3.5" />
                      {entry.gold > 0 ? `+${formatNumber(entry.gold)}` : formatNumber(entry.gold)} G
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      ) : tab === 'xp' ? (
        xpHistory.length === 0 ? (
          <div className="rpg-card rounded-2xl p-12 border border-dashed border-[#2A364F] text-center">
            <Zap className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-300 font-rpg">No XP Transactions</h3>
          </div>
        ) : (
          <div className="rpg-card rounded-2xl border border-[#2A364F] divide-y divide-[#2A364F]/60 overflow-hidden">
            {xpHistory.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-white/[0.02]"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-200">{item.source}</h4>
                    <span className="text-[11px] text-gray-500 font-mono">
                      {formatDateTime(item.created_at)}
                    </span>
                  </div>
                </div>
                <span className="text-sm font-bold text-cyan-400 font-mono">
                  +{formatNumber(item.amount)} XP
                </span>
              </div>
            ))}
          </div>
        )
      ) : goldHistory.length === 0 ? (
        <div className="rpg-card rounded-2xl p-12 border border-dashed border-[#2A364F] text-center">
          <Coins className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-300 font-rpg">No Gold Transactions</h3>
        </div>
      ) : (
        <div className="rpg-card rounded-2xl border border-[#2A364F] divide-y divide-[#2A364F]/60 overflow-hidden">
          {goldHistory.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-white/[0.02]"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg border ${
                    item.amount > 0
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}
                >
                  {item.amount > 0 ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownLeft className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-200">{item.source}</h4>
                  <span className="text-[11px] text-gray-500 font-mono">
                    {formatDateTime(item.created_at)}
                  </span>
                </div>
              </div>
              <span
                className={`text-sm font-bold font-mono ${
                  item.amount > 0 ? 'text-amber-400' : 'text-red-400'
                }`}
              >
                {item.amount > 0 ? `+${formatNumber(item.amount)}` : formatNumber(item.amount)} G
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
