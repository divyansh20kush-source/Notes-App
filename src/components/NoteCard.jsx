import React from 'react';
import { 
  Pin, 
  Star, 
  Archive, 
  Trash2, 
  RotateCcw,
  Copy,
  Calendar,
  CheckSquare,
  Square
} from 'lucide-react';

const COLOR_THEMES = {
  slate: {
    card: 'border-slate-500/20 hover:border-slate-500/40 bg-gradient-to-br from-slate-900/50 to-slate-950/70 shadow-slate-950/20 hover:shadow-slate-500/5',
    accent: 'text-slate-400',
    dot: 'bg-slate-400',
    pill: 'bg-slate-500/10 text-slate-300 border-slate-500/10',
    glow: 'group-hover:shadow-[0_0_15px_rgba(100,116,139,0.08)]'
  },
  purple: {
    card: 'border-purple-500/20 hover:border-purple-500/40 bg-gradient-to-br from-purple-950/25 to-slate-950/70 shadow-purple-950/20 hover:shadow-purple-500/5',
    accent: 'text-purple-400',
    dot: 'bg-purple-400',
    pill: 'bg-purple-500/10 text-purple-300 border-purple-500/10',
    glow: 'group-hover:shadow-[0_0_15px_rgba(168,85,247,0.08)]'
  },
  blue: {
    card: 'border-blue-500/20 hover:border-blue-500/40 bg-gradient-to-br from-blue-950/25 to-slate-950/70 shadow-blue-950/20 hover:shadow-blue-500/5',
    accent: 'text-blue-400',
    dot: 'bg-blue-400',
    pill: 'bg-blue-500/10 text-blue-300 border-blue-500/10',
    glow: 'group-hover:shadow-[0_0_15px_rgba(59,130,246,0.08)]'
  },
  emerald: {
    card: 'border-emerald-500/20 hover:border-emerald-500/40 bg-gradient-to-br from-emerald-950/25 to-slate-950/70 shadow-emerald-950/20 hover:shadow-emerald-500/5',
    accent: 'text-emerald-400',
    dot: 'bg-emerald-400',
    pill: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/10',
    glow: 'group-hover:shadow-[0_0_15px_rgba(16,185,129,0.08)]'
  },
  rose: {
    card: 'border-rose-500/20 hover:border-rose-500/40 bg-gradient-to-br from-rose-950/25 to-slate-950/70 shadow-rose-950/20 hover:shadow-rose-500/5',
    accent: 'text-rose-400',
    dot: 'bg-rose-400',
    pill: 'bg-rose-500/10 text-rose-300 border-rose-500/10',
    glow: 'group-hover:shadow-[0_0_15px_rgba(244,63,94,0.08)]'
  },
  amber: {
    card: 'border-amber-500/20 hover:border-amber-500/40 bg-gradient-to-br from-amber-950/25 to-slate-950/70 shadow-amber-950/20 hover:shadow-amber-500/5',
    accent: 'text-amber-400',
    dot: 'bg-amber-400',
    pill: 'bg-amber-500/10 text-amber-300 border-amber-500/10',
    glow: 'group-hover:shadow-[0_0_15px_rgba(245,158,11,0.08)]'
  }
};

export default function NoteCard({
  note,
  onSelect,
  updateNote,
  deleteNote,
  restoreNote,
  permanentDeleteNote,
  duplicateNote
}) {
  const theme = COLOR_THEMES[note.color] || COLOR_THEMES.slate;

  // Format date nicely
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Toggle individual todo item complete status
  const handleToggleTodo = (todoId, e) => {
    e.stopPropagation(); // Prevent opening the note editor
    const updatedTodos = note.todoList.map(todo => 
      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
    );
    updateNote(note.id, { todoList: updatedTodos });
  };

  // Compute todo progress percentages
  const completedCount = note.todoList.filter(t => t.completed).length;
  const totalCount = note.todoList.length;
  const progressPercent = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div
      onClick={() => onSelect(note)}
      className={`group flex flex-col justify-between p-5 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden h-[240px] shadow-lg ${theme.card} ${theme.glow}`}
    >
      {/* Decorative ambient color glow */}
      <div className={`absolute -right-16 -top-16 w-32 h-32 rounded-full blur-3xl opacity-10 transition-opacity duration-300 group-hover:opacity-20 ${theme.dot}`} />

      {/* Card Body */}
      <div className="space-y-3 flex-1 overflow-hidden">
        {/* Title and Pin actions */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-white tracking-wide truncate flex-1 group-hover:text-purple-300 transition-colors">
            {note.title || 'Untitled Note'}
          </h3>
          
          {!note.isDeleted && (
            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateNote(note.id, { isPinned: !note.isPinned });
                }}
                className={`p-1.5 rounded-lg hover:bg-white/5 transition-colors ${
                  note.isPinned ? 'text-purple-400 bg-purple-500/10' : 'text-slate-400 hover:text-white'
                }`}
                title={note.isPinned ? 'Unpin' : 'Pin'}
              >
                <Pin className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateNote(note.id, { isFavorite: !note.isFavorite });
                }}
                className={`p-1.5 rounded-lg hover:bg-white/5 transition-colors ${
                  note.isFavorite ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400 hover:text-white'
                }`}
                title={note.isFavorite ? 'Remove Favorite' : 'Favorite'}
              >
                <Star className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Note Content Preview */}
        <div className="text-slate-350 text-xs leading-relaxed overflow-hidden max-h-[110px] break-words">
          {note.type === 'todo' ? (
            <div className="space-y-1.5">
              {/* Progress bar */}
              {totalCount > 0 && (
                <div className="space-y-1 mb-2">
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                    <span>Task progress</span>
                    <span>{completedCount}/{totalCount} ({progressPercent}%)</span>
                  </div>
                  <div className="w-full bg-black/35 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${theme.dot}`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}
              {/* Preview first 3 todo items */}
              {note.todoList.slice(0, 3).map((todo) => (
                <div 
                  key={todo.id} 
                  onClick={(e) => handleToggleTodo(todo.id, e)}
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors py-0.5"
                >
                  {todo.completed ? (
                    <CheckSquare className={`w-3.5 h-3.5 shrink-0 ${theme.accent}`} />
                  ) : (
                    <Square className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  )}
                  <span className={`truncate text-xs ${todo.completed ? 'line-through text-slate-500' : ''}`}>
                    {todo.text}
                  </span>
                </div>
              ))}
              {note.todoList.length > 3 && (
                <div className="text-[10px] text-slate-500 italic mt-1">
                  + {note.todoList.length - 3} more items...
                </div>
              )}
              {note.todoList.length === 0 && (
                <p className="text-slate-500 italic">No tasks in checklist.</p>
              )}
            </div>
          ) : (
            <p className="whitespace-pre-line line-clamp-5">
              {note.content || <span className="text-slate-500 italic">No additional content.</span>}
            </p>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="pt-4 mt-auto border-t border-white/6 flex items-center justify-between">
        {/* Date and Tags */}
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-1 text-[10px] text-slate-500">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(note.updatedAt || note.createdAt)}</span>
          </div>
          {note.tags.length > 0 && (
            <div className="flex gap-1 overflow-hidden truncate max-w-[150px]">
              {note.tags.slice(0, 2).map(tag => (
                <span 
                  key={tag} 
                  className={`text-[9px] font-medium px-1.5 py-0.5 rounded border uppercase tracking-wider shrink-0 ${theme.pill}`}
                >
                  {tag}
                </span>
              ))}
              {note.tags.length > 2 && (
                <span className="text-[9px] text-slate-500 font-bold shrink-0 self-center">
                  +{note.tags.length - 2}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Quick Toolbar Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {note.isDeleted ? (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  restoreNote(note.id);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all duration-200"
                title="Restore"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  permanentDeleteNote(note.id);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                title="Delete Permanently"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  duplicateNote(note.id);
                }}
                className="p-1.5 rounded-lg text-slate-450 hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-200"
                title="Duplicate"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateNote(note.id, { isArchived: !note.isArchived });
                }}
                className="p-1.5 rounded-lg text-slate-450 hover:text-amber-400 hover:bg-amber-500/10 transition-all duration-200"
                title={note.isArchived ? 'Unarchive' : 'Archive'}
              >
                <Archive className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNote(note.id);
                }}
                className="p-1.5 rounded-lg text-slate-455 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                title="Send to Trash"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
