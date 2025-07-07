import React from 'react';
import { NavLink } from 'react-router-dom';
import { PenTool, TrendingUp, Calendar, Settings } from 'lucide-react';

export function Navigation() {
  const navItems = [
    { to: '/', label: 'Write Thoughts', icon: PenTool },
    { to: '/themes', label: 'Themes & Insights', icon: TrendingUp },
  ];

  return (
    <nav className="glass-card border-b border-white/20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex space-x-8">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `nav-link flex items-center space-x-2 py-4 px-2 ${
                  isActive ? 'active' : ''
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}