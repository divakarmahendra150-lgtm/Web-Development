import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Swords,
  User,
  ShoppingBag,
  Package,
  History,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { to: '/quests', label: 'Quests', icon: Swords },
  { to: '/character', label: 'Hero', icon: User },
  { to: '/rewards', label: 'Shop', icon: ShoppingBag },
  { to: '/inventory', label: 'Bag', icon: Package },
  { to: '/history', label: 'Logs', icon: History },
];

export default function MobileNav() {
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B0F19]/95 backdrop-blur-lg border-t border-[#2A364F] px-2 py-1.5 flex items-center justify-around"
      aria-label="Mobile bottom navigation"
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all ${
                isActive ? 'text-amber-400 font-bold' : 'text-gray-400 hover:text-gray-200'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] mt-1">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
