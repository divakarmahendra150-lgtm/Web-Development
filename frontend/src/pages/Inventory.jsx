import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Shield,
  Moon,
  Flame,
  Crown,
  Star,
  Zap,
  Sword,
  Sparkles,
  ShoppingBag,
  Check,
  CheckCircle2,
} from 'lucide-react';
import { rewardService } from '../services/rewardService';
import { RARITIES } from '../utils/constants';
import { formatDate } from '../utils/format';

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

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const data = await rewardService.getInventory();
      setItems(data);
    } catch (err) {
      console.error('Failed to load inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEquip = async (item) => {
    setActionLoadingId(item.id);
    try {
      if (item.is_equipped) {
        await rewardService.unequipItem(item.id);
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, is_equipped: false } : i))
        );
      } else {
        await rewardService.equipItem(item.id);
        // Unequip any existing item of same reward_type in local state
        setItems((prev) =>
          prev.map((i) => {
            if (i.id === item.id) return { ...i, is_equipped: true };
            if (i.reward.reward_type === item.reward.reward_type) {
              return { ...i, is_equipped: false };
            }
            return i;
          })
        );
      }
    } catch (err) {
      console.error('Equip action failed:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Package className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 font-rpg">
              Adventurer Satchel
            </h1>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Manage your acquired titles, cosmetics, themes, and gear.
          </p>
        </div>

        <Link
          to="/rewards"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-gray-950 font-bold text-xs shadow-glow-gold flex items-center gap-2 font-rpg cursor-pointer shrink-0"
        >
          <ShoppingBag className="w-4 h-4" /> VISIT SHOP
        </Link>
      </div>

      {/* Inventory Grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-mono text-gray-400">Opening Satchel...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="rpg-card rounded-2xl p-12 border border-dashed border-[#2A364F] text-center">
          <Package className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-300 font-rpg">Satchel is Empty</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1 mb-5">
            You have not acquired any virtual artifacts or themes yet. Spend your Gold in the bazaar!
          </p>
          <Link
            to="/rewards"
            className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-gray-950 font-bold text-xs shadow-glow-gold font-rpg inline-flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" /> BROWSE REWARDS
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => {
            const reward = item.reward;
            const Icon = ICON_MAP[reward.icon] || Package;
            const rarity = RARITIES[reward.rarity] || RARITIES.common;
            const isLoading = actionLoadingId === item.id;

            return (
              <div
                key={item.id}
                className={`rpg-card rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between ${
                  item.is_equipped
                    ? 'border-amber-500/50 bg-amber-950/15 shadow-glow-gold/20'
                    : 'border-[#2A364F]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div
                      className={`p-3 rounded-xl border ${rarity.bg} ${rarity.border} ${rarity.text}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-2">
                      {item.is_equipped && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" /> EQUIPPED
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider font-bold border ${rarity.border} ${rarity.text}`}
                      >
                        {reward.rarity}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-gray-100 font-rpg mb-1">
                    {reward.name}
                  </h3>
                  <p className="text-xs text-gray-400 mb-3">{reward.description}</p>
                </div>

                <div className="pt-4 border-t border-[#2A364F]/60 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400">
                    Acquired {formatDate(item.purchased_at)}
                  </span>

                  <button
                    onClick={() => handleToggleEquip(item)}
                    disabled={isLoading}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold font-rpg transition-all cursor-pointer ${
                      item.is_equipped
                        ? 'bg-white/10 hover:bg-white/20 text-gray-200 border border-white/20'
                        : 'bg-gradient-to-r from-amber-500 to-amber-600 text-gray-950 shadow-glow-gold hover:brightness-110'
                    }`}
                  >
                    {isLoading
                      ? 'Updating...'
                      : item.is_equipped
                      ? 'UNEQUIP'
                      : 'EQUIP'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
