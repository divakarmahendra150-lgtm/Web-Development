import React, { useState } from 'react';
import { Award, User, Shield, CheckCircle2, AlertCircle, Save } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useGame } from '../hooks/useGame';
import { formatDate } from '../utils/format';

const AVATAR_OPTIONS = [
  { id: 'warrior', label: 'Warrior', desc: 'Frontline vanguard of strength and steel' },
  { id: 'mage', label: 'Arch-Mage', desc: 'Master of arcane intellect and wisdom' },
  { id: 'rogue', label: 'Shadow Rogue', desc: 'Agile operative of swift precision' },
  { id: 'paladin', label: 'Holy Paladin', desc: 'Bastion of unbreakable discipline' },
  { id: 'berserker', label: 'Berserker', desc: 'Unstoppable fountain of pure vitality' },
  { id: 'bard', label: 'Mystic Bard', desc: 'Charismatic speaker of high renown' },
];

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { character } = useGame();

  const [avatar, setAvatar] = useState(user?.avatar || 'warrior');
  const [title, setTitle] = useState(user?.title || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');
    try {
      await updateProfile({ avatar, title, bio });
      setMessage('Character identity updated in the archives!');
    } catch (err) {
      setError(err.message || 'Failed to update character profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Award className="w-6 h-6 text-amber-400" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 font-rpg">
            Adventurer Identity
          </h1>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Customize your hero avatar, title, and public lore record.
        </p>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Selection */}
        <div className="rpg-card rounded-2xl p-6 border border-[#2A364F]">
          <h2 className="text-base font-bold text-gray-200 font-rpg mb-4">
            Select Hero Archetype (Avatar)
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {AVATAR_OPTIONS.map((opt) => {
              const isSelected = avatar === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setAvatar(opt.id)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500/15 shadow-glow-gold/20'
                      : 'border-[#2A364F] bg-black/30 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-gray-100 font-rpg">
                      {opt.label}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400">{opt.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Character Title & Bio */}
        <div className="rpg-card rounded-2xl p-6 border border-[#2A364F] space-y-4">
          <h2 className="text-base font-bold text-gray-200 font-rpg mb-2">
            Titles and Inscriptions
          </h2>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Hero Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Conqueror of Procrastination, Code Sorcerer"
              className="w-full px-4 py-2.5 rounded-xl bg-[#0B0F19] border border-[#2A364F] text-gray-100 text-sm focus:border-amber-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Character Lore / Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Write your hero's oath or personal code of honor..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#0B0F19] border border-[#2A364F] text-gray-100 text-sm focus:border-amber-500 transition-colors resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-gray-950 font-bold text-sm shadow-glow-gold hover:brightness-110 transition-all cursor-pointer font-rpg tracking-wider inline-flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                'Saving Inscriptions...'
              ) : (
                <>
                  <Save className="w-4 h-4" /> SAVE RECORD
                </>
              )}
            </button>
          </div>
        </div>

        {/* Account Details Box */}
        <div className="rpg-card rounded-2xl p-6 border border-[#2A364F]">
          <h2 className="text-base font-bold text-gray-200 font-rpg mb-4">
            Guild Registration Details
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3 rounded-xl bg-black/40 border border-white/5">
              <span className="text-gray-400 block mb-1">Registered Adventurer Email</span>
              <span className="text-gray-200 font-bold">{user?.email}</span>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/5">
              <span className="text-gray-400 block mb-1">Guild Membership Date</span>
              <span className="text-gray-200 font-bold">{formatDate(user?.created_at)}</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
