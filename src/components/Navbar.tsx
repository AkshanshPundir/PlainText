import React from 'react';
import { Activity, ShieldCheck, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="relative z-30 w-full border-b border-white/10 bg-black/40 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-inner">
            <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <span className="font-heading italic text-2xl tracking-wide text-white block leading-none">
              Smart Campus
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/50 block font-body">
              Operations Assistant
            </span>
          </div>
        </div>

        {/* Center Pill: Live Event Status */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full liquid-glass-strong text-xs text-white/80 border border-white/10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-mono text-emerald-400 font-semibold text-[11px] tracking-wider">LIVE</span>
          <span className="text-white/40">|</span>
          <span className="font-body text-white/80">Day 2 Operational State</span>
          <span className="text-white/40">|</span>
          <span className="text-white/60 text-[11px]">4-Day Hackathon</span>
        </div>

        {/* Quick Nav Anchors */}
        <nav className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm font-body text-white/70">
          <a
            href="#roster-section"
            className="hover:text-white transition-colors px-2 py-1 rounded-md hover:bg-white/5"
          >
            Roster
          </a>
          <a
            href="#ai-section"
            className="hover:text-white transition-colors px-2 py-1 rounded-md hover:bg-white/5 flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            AI Query
          </a>
          <a
            href="#tasks-section"
            className="hover:text-white transition-colors px-2 py-1 rounded-md hover:bg-white/5"
          >
            Volunteers
          </a>
          <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-white/10 text-xs text-emerald-400 font-mono">
            <ShieldCheck className="w-4 h-4" />
            <span>Active</span>
          </div>
        </nav>
      </div>
    </header>
  );
};
