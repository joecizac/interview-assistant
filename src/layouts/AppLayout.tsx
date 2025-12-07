import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Layers, Users, Menu } from 'lucide-react';
import { cn } from '../lib/utils';

export const AppLayout = () => {
  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Interview Assistant' },
    { to: '/platforms', icon: Layers, label: 'Manage Platforms' },
    { to: '/interviews', icon: Users, label: 'Manage Interviews' },
  ];

  return (
    <div className="flex h-screen w-full bg-slate-50">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white md:flex">
        <div className="flex h-16 items-center border-b border-slate-200 px-6">
          <span className="text-lg font-bold text-slate-900">Interviewer<span className="text-blue-600">.ai</span></span>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-slate-200 p-4">
          <p className="text-xs text-slate-500 text-center">v0.1.0 (Local)</p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="flex h-16 items-center border-b border-slate-200 bg-white px-6 md:hidden">
           <Menu className="mr-4 h-6 w-6 text-slate-500" />
           <span className="text-lg font-bold text-slate-900">Interviewer.ai</span>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
