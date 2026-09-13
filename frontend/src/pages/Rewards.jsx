import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Coins,
  CheckCircle,
  Shield,
  Moon,
  Flame,
  Crown,
  Star,
  Zap,
  Sword,
  Sparkles,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { useGame } from '../hooks/useGame';
import { rewardService } from '../services/rewardService';
import { RARITIES } from '../utils/constants';
import { formatNumber } from '../utils/format';

const ICON_MAP = {
  shield: Shield,
  moon: Moon,
  flame: Flame,
  crown: Crown,
  star: Star,
  zap: Zap,
  sword: Sword,
  sparkles: Sparkles,
};

export default function Rewards() {
  const { character, updateCharacterGold } = useGame();

  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasingId, setPurchasingId] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      setLoading(true);
      const data = await rewardService.getRewards();
      setRewards(data);
    } catch (err) {
      console.error('Failed to load rewards:', err);
      setError('Could not load rewards shop.');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (reward) => {
    if (reward.owned) return;
    if (character.gold < reward.gold_cost) {
      setError(`Insufficient Gold. You need ${reward.gold_cost} G, but possess ${character.gold} G.`);
      return;
    }

    setPurchasingId(reward.id);
    setError('');
    setSuccessMessage('');

    try {
      const res = await rewardService.purchaseReward(reward.id);
      updateCharacterGold(res.gold_remaining);
      setSuccessMessage(res.message || `Purchased ${reward.name}!`);
      // Update local item ownership
      setRewards((prev) =>
        prev.map((r) => (r.id === reward.id ? { ...r, owned: true } : r))
      );
    } catch (err) {
      setError(err.message || 'Purchase failed.');
    } finally {
      setPurchasingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header with Gold Wallet */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 font-rpg">
              Rewards Bazaar
            </h1>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Exchange your hard-earned Gold for cosmetics, themes, badges, and glorious titles.
          </p>
        </div>

        {character && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 font-mono text-sm font-bold shadow-glow-gold/10">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>{formatNumber(character.gold)} Gold</span>
            </div>
            <Link
              to="/inventory"
              className="px-4 py-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-[#2A364F] text-gray-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              Inventory Bag <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError('')} className="text-red-300 font-bold ml-2 text-sm">&times;</button>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage('')} className="text-emerald-300 font-bold ml-2 text-sm">&times;</button>
        </div>
      )}

      {/* Rewards Grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-mono text-gray-400">Loading Bazaar Merchandise...</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rewards.map((reward) => {
            const Icon = ICON_MAP[reward.icon] || ShoppingBag;
            const rarity = RARITIES[reward.rarity] || RARITIES.common;
            const canAfford = character ? character.gold >= reward.gold_cost : false;

            return (
              <div
                key={reward.id}
                className={`rpg-card rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between ${
                  reward.owned
                    ? 'border-emerald-500/30 bg-emerald-950/10'
                    : 'border-[#2A364F] hover:border-amber-500/40 hover:-translate-y-1'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div
                      className={`p-3 rounded-xl border ${rarity.bg} ${rarity.border} ${rarity.text}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span
                      className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full uppercase tracking-wider font-bold border ${rarity.border} ${rarity.text}`}
                    >
                      {reward.rarity}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-gray-100 font-rpg mb-1">
                    {reward.name}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2 mb-4">
                    {reward.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#2A364F]/60 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 font-mono">
                    <Coins className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-bold text-amber-300">
                      {formatNumber(reward.gold_cost)} G
                    </span>
                  </div>

                  {reward.owned ? (
                    <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                      <CheckCircle className="w-3.5 h-3.5" /> Acquired
                    </span>
                  ) : (
                    <button
                      onClick={() => handlePurchase(reward)}
                      disabled={purchasingId === reward.id || !canAfford}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold font-rpg transition-all cursor-pointer ${
                        canAfford
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-gray-950 shadow-glow-gold'
                          : 'bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed'
                      }`}
                    >
                      {purchasingId === reward.id
                        ? 'Trading...'
                        : canAfford
                        ? 'PURCHASE'
                        : 'LOCKED'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
