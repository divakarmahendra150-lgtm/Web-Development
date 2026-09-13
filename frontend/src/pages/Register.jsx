import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, User, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password || !password2) {
      setError('Please fill in all character creation fields.');
      return;
    }
    if (password !== password2) {
      setError('Passcodes do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Passcode must be at least 8 runes long.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await register({ username, email, password, password2 });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to create adventurer account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Glow orb */}
      <div className="absolute w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -top-20 -right-20" />
      <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -bottom-20 -left-20" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-glow-gold transition-transform group-hover:scale-105">
              <Shield className="w-6 h-6 text-gray-950 font-black" />
            </div>
            <span className="font-bold text-2xl font-rpg text-amber-400 tracking-wider">
              LIFE RPG
            </span>
          </Link>
          <p className="text-xs text-gray-400 font-mono uppercase tracking-widest mt-2">
            Character Creation Gate
          </p>
        </div>

        {/* Card */}
        <div className="rpg-card rounded-2xl p-6 sm:p-8 border border-[#2A364F]">
          <h2 className="text-xl font-bold text-gray-100 font-rpg mb-1 text-center">
            Forge Your Hero
          </h2>
          <p className="text-xs text-gray-400 text-center mb-6">
            Register your name and begin your ascension from Level 1.
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Hero Name (Username)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Sir Reginald"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0B0F19] border border-[#2A364F] text-gray-100 text-sm focus:border-amber-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Adventurer Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hero@realm.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0B0F19] border border-[#2A364F] text-gray-100 text-sm focus:border-amber-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Secret Passcode (Min 8 characters)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0B0F19] border border-[#2A364F] text-gray-100 text-sm focus:border-amber-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Confirm Passcode
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0B0F19] border border-[#2A364F] text-gray-100 text-sm focus:border-amber-500 transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-gray-950 font-bold text-sm shadow-glow-gold hover:brightness-110 transition-all cursor-pointer font-rpg tracking-wider flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
            >
              {loading ? (
                <span className="inline-block w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  BEGIN ADVENTURE <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#2A364F] text-center text-xs text-gray-400">
            <span>Already have an account? </span>
            <Link to="/login" className="text-amber-400 font-semibold hover:underline">
              Enter Realm
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
