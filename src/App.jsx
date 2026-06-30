import React, { useState } from 'react';
import { useNotes } from './hooks/useNotes';
import Sidebar from './components/Sidebar';
import NoteCard from './components/NoteCard';
import NoteEditor from './components/NoteEditor';
import StatsPanel from './components/StatsPanel';
import { 
  Search, 
  Plus, 
  Trash2, 
  Sparkles, 
  Filter, 
  X,
  FileText,
  ListTodo
} from 'lucide-react';

const FILTER_COLORS = ['slate', 'purple', 'blue', 'emerald', 'rose', 'amber'];

export default function App() {
  const {
    notes,
    allNotesRaw,
    tags,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    selectedTag,
    setSelectedTag,
    selectedColor,
    setSelectedColor,
    stats,
    addTag,
    removeTag,
    addNote,
    updateNote,
    deleteNote,
    restoreNote,
    permanentDeleteNote,
    duplicateNote,
    emptyTrash,
  } = useNotes();

  const [selectedNote, setSelectedNote] = useState(null);
  const [showStats, setShowStats] = useState(false);

  // Handle opening editor for new draft note
  const handleNewNoteClick = (type = 'text') => {
    setSelectedNote({
      id: 'draft',
      title: '',
      content: '',
      type,
      todoList: [],
      color: 'slate',
      tags: selectedTag ? [selectedTag] : []
    });
  };

  // Handle saving from editor
  const handleSaveNote = (updatedData) => {
    if (selectedNote.id === 'draft') {
      const created = addNote(updatedData);
      // Update selectedNote to the created note so subsequent autosaves update it instead of making new ones
      setSelectedNote(created);
    } else {
      updateNote(selectedNote.id, updatedData);
    }
  };

  // Separate notes into pinned and unpinned for better hierarchy
  const pinnedNotes = notes.filter(n => n.isPinned);
  const regularNotes = notes.filter(n => !n.isPinned);

  // Helper to determine the header title
  const getHeaderTitle = () => {
    if (selectedTag) return `Tag: ${selectedTag}`;
    switch (activeTab) {
      case 'all': return 'All Notes';
      case 'favorites': return 'Favorites';
      case 'archived': return 'Archive';
      case 'trash': return 'Trash Bin';
      default: return 'Notes';
    }
  };

  return (
    <div className="flex min-h-screen text-slate-100 bg-[#07080a] relative">
      {/* Decorative background glow elements */}
      <div className="absolute top-[10%] left-[25%] w-[45vw] h-[45vw] rounded-full bg-purple-900/10 blur-[130px] -z-10 animate-pulse-slow" />
      <div className="absolute bottom-[10%] right-[5%] w-[35vw] h-[35vw] rounded-full bg-blue-900/10 blur-[130px] -z-10 animate-pulse-slow" />

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tags={tags}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        stats={stats}
        addTag={addTag}
        removeTag={removeTag}
        showStats={showStats}
        setShowStats={setShowStats}
      />

      {/* Main Panel */}
      <main className="flex-1 flex flex-col overflow-x-hidden min-h-screen">
        {/* Top Header Controls */}
        <header className="px-8 py-5 border-b border-white/8 glass flex items-center justify-between gap-6 sticky top-0 z-20 backdrop-blur-md">
          {/* Search bar */}
          <div className="flex-1 max-w-lg relative group">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-purple-400 transition-colors" />
            <input
              type="text"
              placeholder="Search notes, tags, or tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/8 rounded-xl pl-10 pr-10 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:glass-input-focus transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="p-1 hover:bg-white/5 rounded-md text-slate-400 hover:text-white absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                title="Clear Search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            {/* Quick type creations */}
            <div className="flex items-center bg-black/40 border border-white/8 rounded-xl p-1">
              <button
                onClick={() => handleNewNoteClick('text')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                title="Create a text note"
              >
                <Plus className="w-3.5 h-3.5 text-purple-400" />
                <span>Text Note</span>
              </button>
              <button
                onClick={() => handleNewNoteClick('todo')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                title="Create a checklist"
              >
                <Plus className="w-3.5 h-3.5 text-purple-400" />
                <span>Checklist</span>
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Work Area */}
        <div className="flex-1 p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Collapsible Stats Board */}
          {showStats && (
            <div className="animate-float">
              <StatsPanel stats={stats} />
            </div>
          )}

          {/* Section Header with View Details & Color Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/6 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-wide text-white">{getHeaderTitle()}</h2>
                {selectedColor && (
                  <span className={`w-2.5 h-2.5 rounded-full bg-${selectedColor}-400 border border-white/10`} />
                )}
              </div>
              <p className="text-xs text-slate-450 mt-1">
                Showing {notes.length} note{notes.length === 1 ? '' : 's'} matching current filters
              </p>
            </div>

            {/* Filter Toolbar controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-450">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <span>Filter Color:</span>
              </div>
              <div className="flex items-center gap-1.5">
                {FILTER_COLORS.map(colorName => (
                  <button
                    key={colorName}
                    onClick={() => setSelectedColor(selectedColor === colorName ? null : colorName)}
                    className={`w-4 h-4 rounded-full transition-transform hover:scale-125 border flex items-center justify-center relative ${
                      selectedColor === colorName 
                        ? 'border-white ring-2 ring-purple-600/30 scale-110' 
                        : 'border-transparent'
                    }`}
                    style={{
                      backgroundColor: colorName === 'slate' ? '#64748b' : 
                                       colorName === 'purple' ? '#a855f7' : 
                                       colorName === 'blue' ? '#3b82f6' : 
                                       colorName === 'emerald' ? '#10b981' : 
                                       colorName === 'rose' ? '#f43f5e' : '#f59e0b'
                    }}
                    title={`Filter by ${colorName}`}
                  />
                ))}
                {selectedColor && (
                  <button
                    onClick={() => setSelectedColor(null)}
                    className="p-0.5 hover:bg-white/5 rounded text-slate-500 hover:text-white transition-colors"
                    title="Clear color filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Trash specific quick action */}
              {activeTab === 'trash' && notes.length > 0 && (
                <button
                  onClick={emptyTrash}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-650/15 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-xl text-xs font-semibold transition-all duration-200"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Empty Trash
                </button>
              )}
            </div>
          </div>

          {/* Notes Grids */}
          {notes.length > 0 ? (
            <div className="space-y-8">
              {/* Pinned section */}
              {pinnedNotes.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-widest px-1">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    Pinned Notes
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pinnedNotes.map(note => (
                      <NoteCard
                        key={note.id}
                        note={note}
                        onSelect={setSelectedNote}
                        updateNote={updateNote}
                        deleteNote={deleteNote}
                        restoreNote={restoreNote}
                        permanentDeleteNote={permanentDeleteNote}
                        duplicateNote={duplicateNote}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Regular section */}
              {regularNotes.length > 0 && (
                <div className="space-y-4">
                  {pinnedNotes.length > 0 && (
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest px-1 pt-2">
                      Other Notes
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {regularNotes.map(note => (
                      <NoteCard
                        key={note.id}
                        note={note}
                        onSelect={setSelectedNote}
                        updateNote={updateNote}
                        deleteNote={deleteNote}
                        restoreNote={restoreNote}
                        permanentDeleteNote={permanentDeleteNote}
                        duplicateNote={duplicateNote}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Empty State Container */
            <div className="flex flex-col items-center justify-center py-20 text-center glass rounded-3xl border border-white/6 p-8">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-purple-500/10 to-indigo-500/10 border border-white/8 flex items-center justify-center text-purple-400 glow-purple mb-6 animate-bounce">
                {activeTab === 'trash' ? (
                  <Trash2 className="w-8 h-8 text-red-400" />
                ) : (
                  <Sparkles className="w-8 h-8" />
                )}
              </div>
              <h3 className="text-lg font-bold text-white tracking-wide">
                {searchQuery 
                  ? 'No results found' 
                  : activeTab === 'trash' 
                  ? 'Trash is empty' 
                  : activeTab === 'favorites' 
                  ? 'No favorites yet' 
                  : activeTab === 'archived' 
                  ? 'Archive is empty' 
                  : 'Start your creative journey'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mt-2 leading-relaxed">
                {searchQuery 
                  ? `We couldn't find any note matching "${searchQuery}". Try searching for other terms.` 
                  : activeTab === 'trash' 
                  ? 'Deleted notes will appear here. You can restore them or delete them permanently.' 
                  : activeTab === 'favorites' 
                  ? 'Star important notes to group them in this view for quick reference.' 
                  : activeTab === 'archived' 
                  ? 'Archive notes you want to keep but hide from your main dashboard.' 
                  : 'Write down thoughts, draft ideas, or plan your checklist. Let\'s create your first note.'}
              </p>
              {!searchQuery && activeTab !== 'trash' && activeTab !== 'favorites' && activeTab !== 'archived' && (
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => handleNewNoteClick('text')}
                    className="flex items-center gap-1.5 px-4.5 py-2.5 bg-linear-to-tr from-purple-650 to-indigo-650 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg transition-all duration-200"
                  >
                    <FileText className="w-4 h-4" />
                    Create Note
                  </button>
                  <button
                    onClick={() => handleNewNoteClick('todo')}
                    className="flex items-center gap-1.5 px-4.5 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-white/8 transition-all duration-200"
                  >
                    <ListTodo className="w-4 h-4 text-purple-400" />
                    Create Checklist
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Note Editor Overlay Modal */}
      {selectedNote && (
        <NoteEditor
          note={selectedNote.id === 'draft' ? null : selectedNote}
          allTags={tags}
          onClose={() => setSelectedNote(null)}
          onSave={handleSaveNote}
          onDelete={deleteNote}
        />
      )}
    </div>
  );
}
