import React, { useState } from 'react';
import { 
  FileText, 
  Star, 
  Archive, 
  Trash2, 
  Plus, 
  Tag, 
  X, 
  Folder,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  tags,
  selectedTag,
  setSelectedTag,
  stats,
  addTag,
  removeTag,
  showStats,
  setShowStats
}) {
  const [newTagName, setNewTagName] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);

  const handleAddTagSubmit = (e) => {
    e.preventDefault();
    if (newTagName.trim()) {
      if (addTag(newTagName)) {
        setNewTagName('');
        setIsAddingTag(false);
      }
    }
  };

  const navItems = [
    { id: 'all', label: 'All Notes', icon: FileText, count: stats.total },
    { id: 'favorites', label: 'Favorites', icon: Star, count: stats.favorites, color: 'text-amber-400' },
    { id: 'archived', label: 'Archive', icon: Archive, count: stats.archived },
    { id: 'trash', label: 'Trash', icon: Trash2, count: stats.deleted },
  ];

  return (
    <aside className="w-80 border-r border-white/8 glass flex flex-col h-screen sticky top-0 shrink-0 z-30">
      {/* Brand Header */}
      <div className="p-6 border-b border-white/8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center glow-purple">
            <span className="font-bold text-white text-lg tracking-tight">Z</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wider text-white">ZENOTE</h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">Zen Note Taking</p>
          </div>
        </div>
      </div>

      {/* Navigation list */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
        <div>
          <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Folders</h3>
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id && !selectedTag;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveTab(item.id);
                      setSelectedTag(null);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                      isActive 
                        ? 'bg-purple-600/15 text-white border border-purple-500/20' 
                        : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${item.color || ''}`} />
                      <span className="font-medium text-sm">{item.label}</span>
                    </div>
                    {item.count > 0 && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-purple-500/20 text-purple-300' : 'bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-slate-300'
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Dashboard / Analytics Toggle */}
        <div>
          <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Dashboard</h3>
          <button
            onClick={() => setShowStats(!showStats)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group border ${
              showStats 
                ? 'bg-emerald-600/15 text-emerald-300 border-emerald-500/20' 
                : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <TrendingUp className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span className="font-medium text-sm">Statistics & Insight</span>
            </div>
            <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${showStats ? 'rotate-90 text-emerald-400' : 'text-slate-500'}`} />
          </button>
        </div>

        {/* Tags Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-purple-400" />
              Tags
            </h3>
            <button
              onClick={() => setIsAddingTag(!isAddingTag)}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Add Tag"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* New Tag Input Form */}
          {isAddingTag && (
            <form onSubmit={handleAddTagSubmit} className="px-3 flex gap-2">
              <input
                type="text"
                placeholder="New tag..."
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                autoFocus
                className="flex-1 text-xs px-2.5 py-1.5 rounded-lg glass-input text-white focus:outline-none focus:glass-input-focus"
              />
              <button
                type="submit"
                className="px-2.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Add
              </button>
            </form>
          )}

          <ul className="space-y-1">
            {tags.map((tag) => {
              const isActive = selectedTag === tag;
              const count = stats.tagDistribution[tag] || 0;
              return (
                <li key={tag} className="group relative">
                  <button
                    onClick={() => {
                      setSelectedTag(isActive ? null : tag);
                      // Switch to 'all' tab if we are in trash or archived to ensure tag filtering works
                      if (activeTab === 'trash' || activeTab === 'archived') {
                        setActiveTab('all');
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-200 text-left border ${
                      isActive 
                        ? 'bg-purple-600/15 text-white border-purple-500/20' 
                        : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                      <span className="font-medium text-sm truncate">{tag}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {count > 0 && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isActive ? 'bg-purple-500/20 text-purple-300' : 'bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-slate-300'
                        }`}>
                          {count}
                        </span>
                      )}
                      
                      {/* Delete button, shows on hover */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTag(tag);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-0.5 rounded-md hover:bg-white/10 text-slate-500 hover:text-red-400 transition-all duration-200"
                        title="Delete Tag"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </button>
                </li>
              );
            })}

            {tags.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-4 italic">No tags created yet.</p>
            )}
          </ul>
        </div>
      </div>

      {/* Sidebar Footer with system stats */}
      <div className="p-5 border-t border-white/8 bg-black/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-xs text-purple-400 font-bold">
            U
          </div>
          <div>
            <h4 className="text-xs font-semibold text-white">Zen User</h4>
            <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Synced Local
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
