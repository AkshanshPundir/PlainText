import React from 'react';
import { Users, UserCheck, UserX, Percent, Radio } from 'lucide-react';
import type { OperationalMetrics } from '../types';

interface HeroStatsProps {
  metrics: OperationalMetrics;
  onQuickFilter?: (filter: 'All' | 'Present' | 'Absent') => void;
}

export const HeroStats: React.FC<HeroStatsProps> = ({ metrics, onQuickFilter }) => {
  return (
    <section className="relative z-20 pt-8 pb-12 sm:pt-14 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Eyebrow badge */}
      <div className="flex items-center justify-center sm:justify-start mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full liquid-glass-strong border border-white/10 text-xs font-mono text-white/90">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="tracking-widest uppercase text-[11px] text-cyan-300">
            Autonomous Operations Matrix
          </span>
          <span className="text-white/30">/</span>
          <span className="text-white/60">Hackathon Dispatch</span>
        </div>
      </div>

      {/* Main Title & Headline */}
      <div className="max-w-4xl text-center sm:text-left mb-10 sm:mb-14">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white mb-3">
          Smart Campus & Event Operations Assistant
        </h1>
        <p className="font-heading italic text-3xl sm:text-5xl lg:text-5xl text-white/90 font-light tracking-normal leading-tight">
          Streamlining campus rosters & event coordination in real time.
        </p>
        <p className="mt-4 text-sm sm:text-base font-body text-white/60 max-w-2xl">
          Automated attendee document ingestion, instantaneous roster reconciliation, and active-state
          AI reasoning designed for fast-paced campus hackathons and live symposiums.
        </p>
      </div>

      {/* 4 Live Metric Cards in liquid-glass-strong */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Total Students */}
        <div
          onClick={() => onQuickFilter && onQuickFilter('All')}
          className="liquid-glass-strong rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-white/50 font-body font-medium">
                Total Enrolled
              </p>
              <h3 className="text-3xl sm:text-4xl font-semibold text-white mt-1 font-body">
                {metrics.totalStudents}
              </h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80 group-hover:border-white/30 group-hover:bg-white/10 transition-colors">
              <Users className="w-5 h-5 text-indigo-300" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-white/50 font-body">
            <span>Roster capacity</span>
            <span className="font-mono text-indigo-300">4 Active Sections</span>
          </div>
        </div>

        {/* Card 2: Present Count */}
        <div
          onClick={() => onQuickFilter && onQuickFilter('Present')}
          className="liquid-glass-strong rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-emerald-400/80 font-body font-medium">
                Present & Checked In
              </p>
              <h3 className="text-3xl sm:text-4xl font-semibold text-emerald-300 mt-1 font-body">
                {metrics.presentCount}
              </h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:border-emerald-500/40 transition-colors">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-body">
            <span className="text-white/50">Verified entry</span>
            <span className="font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
              On-Campus
            </span>
          </div>
        </div>

        {/* Card 3: Absent Count */}
        <div
          onClick={() => onQuickFilter && onQuickFilter('Absent')}
          className="liquid-glass-strong rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-rose-400/80 font-body font-medium">
                Absent / Pending
              </p>
              <h3 className="text-3xl sm:text-4xl font-semibold text-rose-300 mt-1 font-body">
                {metrics.absentCount}
              </h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:border-rose-500/40 transition-colors">
              <UserX className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-body">
            <span className="text-white/50">Awaiting check-in</span>
            <span className="font-mono text-rose-400">Needs Follow-up</span>
          </div>
        </div>

        {/* Card 4: Attendance Percentage */}
        <div className="liquid-glass-strong rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-cyan-400/80 font-body font-medium">
                Attendance Rate
              </p>
              <h3 className="text-3xl sm:text-4xl font-semibold text-cyan-300 mt-1 font-body">
                {metrics.attendancePercentage.toFixed(1)}%
              </h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:border-cyan-500/40 transition-colors">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          {/* Progress visual bar */}
          <div className="mt-4 pt-3 border-t border-white/5">
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${metrics.attendancePercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-white/40 mt-1.5 font-mono">
              <span>Goal: 85%</span>
              <span className="text-cyan-300 font-semibold">
                {metrics.attendancePercentage >= 85 ? 'Target Met' : 'Under Target'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
