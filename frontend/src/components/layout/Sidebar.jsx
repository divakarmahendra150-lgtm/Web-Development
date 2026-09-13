import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Swords,
  User,
  ShoppingBag,
  Package,
  History,
  Shield,
  Award
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/quests', label: 'Quests', icon: Swords },
  { to: '/character', label: 'Character', icon: User },
  { to: '/rewards', label: 'Rewards Shop', icon: ShoppingBag },
  { to: '/inventory', label: 'Inventory', icon: Package },
  { to: '/history', label: 'Chronicles', icon: History },
  { to: '/profile', label: 'Profile', icon: Award },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#0B0F19] border-r border-[#2A364F]/80 p-5 sticky top-0 h-screen z-40">
      {/* Brand */}
      <div className="flex items-center gap-3 px-3 py-2 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-glow-gold">
          <Shield className="w-5 h-5 text-gray-950 font-black" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300 font-rpg tracking-wider">
            LIFE RPG
          </h1>
          <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase block">
            Level Up Reality
          </span>
        </div>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 space-y-1.5" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-glow-gold/20'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="pt-4 border-t border-[#2A364F]/60 px-3 text-[11px] text-gray-400">
        <p className="font-semibold text-gray-300">IIT Bhubaneswar</p>
        <p>Tech Zephyr 4.0 Hackathon</p>
      </div>
    </aside>
  );
}
