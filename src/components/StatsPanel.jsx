import React from 'react';
import { 
  BarChart3, 
  FileText, 
  Pin, 
  Star, 
  CheckSquare, 
  TrendingUp, 
  Tag, 
  Palette 
} from 'lucide-react';

const COLOR_THEMES = {
  slate: 'bg-slate-400',
  purple: 'bg-purple-400',
  blue: 'bg-blue-400',
  emerald: 'bg-emerald-400',
  rose: 'bg-rose-400',
  amber: 'bg-amber-400'
};

export default function StatsPanel({ stats }) {
  // Convert tagDistribution to an array for easier rendering
  const tagsData = Object.entries(stats.tagDistribution || {}).sort((a, b) => b[1] - a[1]);
  const colorsData = Object.entries(stats.colorDistribution || {}).sort((a, b) => b[1] - a[1]);

  return (
    <div className="w-full glass rounded-3xl border border-white/8 p-6 space-y-6 glow-purple transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">Workspace Analytics</h2>
            <p className="text-[10px] text-slate-400 font-medium">Real-time statistics & notes insight</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[10px] bg-white/5 border border-white/8 px-2.5 py-1 rounded-full text-slate-350">
          <TrendingUp className="w-3 h-3 text-emerald-400" />
          <span>Productivity Metrics</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="glass-card p-4 rounded-2xl flex items-center gap-3.5 border border-white/5">
          <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-semibold text-slate-450 uppercase tracking-wider block">Total Notes</span>
            <span className="text-xl font-bold text-white">{stats.total}</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="glass-card p-4 rounded-2xl flex items-center gap-3.5 border border-white/5">
          <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-400">
            <Pin className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-semibold text-slate-455 uppercase tracking-wider block">Pinned</span>
            <span className="text-xl font-bold text-white">{stats.pinned}</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="glass-card p-4 rounded-2xl flex items-center gap-3.5 border border-white/5">
          <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-400">
            <Star className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-semibold text-slate-450 uppercase tracking-wider block">Favorites</span>
            <span className="text-xl font-bold text-white">{stats.favorites}</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="glass-card p-4 rounded-2xl flex items-center gap-3.5 border border-white/5">
          <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-semibold text-slate-455 uppercase tracking-wider block">Task Completion</span>
            <span className="text-xl font-bold text-white">{stats.todos.completionRate}%</span>
          </div>
        </div>
      </div>

      {/* Grid for distributions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Tag Distribution chart */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 px-1">
            <Tag className="w-3.5 h-3.5 text-purple-400" />
            Notes by tag
          </h3>

          <div className="glass-card p-5 rounded-2xl border border-white/5 space-y-4 max-h-56 overflow-y-auto">
            {tagsData.map(([tag, count]) => {
              const percentage = stats.total ? Math.round((count / stats.total) * 100) : 0;
              return (
                <div key={tag} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-300">{tag}</span>
                    <span className="text-slate-400">{count} notes ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {tagsData.length === 0 && (
              <p className="text-xs text-slate-550 text-center py-6 italic">No tags associated with active notes.</p>
            )}
          </div>
        </div>

        {/* Color Distribution & Task Details */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 px-1">
            <Palette className="w-3.5 h-3.5 text-purple-400" />
            Color themes & Checklist
          </h3>

          <div className="glass-card p-5 rounded-2xl border border-white/5 space-y-5 h-[224px] flex flex-col justify-between">
            {/* Color circles distribution */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3">Color Distribution</span>
              <div className="flex items-center gap-5">
                {colorsData.slice(0, 5).map(([color, count]) => (
                  <div key={color} className="flex flex-col items-center gap-1">
                    <div className={`w-6 h-6 rounded-full ${COLOR_THEMES[color] || 'bg-slate-400'} flex items-center justify-center text-[10px] font-bold text-black`}>
                      {count}
                    </div>
                    <span className="text-[9px] text-slate-500 uppercase font-medium">{color}</span>
                  </div>
                ))}
                {colorsData.length === 0 && (
                  <p className="text-xs text-slate-550 italic py-1">No custom note colors selected.</p>
                )}
              </div>
            </div>

            {/* Checklist details */}
            <div className="border-t border-white/6 pt-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Checklist Summary</span>
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Completed Tasks: <strong>{stats.todos.completed}</strong>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                  Remaining: <strong>{stats.todos.total - stats.todos.completed}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
