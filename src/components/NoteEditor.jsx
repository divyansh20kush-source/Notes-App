import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Pin, 
  Star, 
  Trash2, 
  Plus, 
  Square, 
  CheckSquare, 
  ListTodo, 
  FileText,
  Save,
  Tag
} from 'lucide-react';

const COLORS = [
  { name: 'slate', bgClass: 'bg-slate-500/20 border-slate-500/35', dotClass: 'bg-slate-400' },
  { name: 'purple', bgClass: 'bg-purple-500/20 border-purple-500/35', dotClass: 'bg-purple-400' },
  { name: 'blue', bgClass: 'bg-blue-500/20 border-blue-500/35', dotClass: 'bg-blue-400' },
  { name: 'emerald', bgClass: 'bg-emerald-500/20 border-emerald-500/35', dotClass: 'bg-emerald-400' },
  { name: 'rose', bgClass: 'bg-rose-500/20 border-rose-500/35', dotClass: 'bg-rose-400' },
  { name: 'amber', bgClass: 'bg-amber-500/20 border-amber-500/35', dotClass: 'bg-amber-400' }
];

export default function NoteEditor({
  note,
  allTags,
  onClose,
  onSave, // We'll save on changes or when the modal closes
  onDelete
}) {
  const [title, setTitle] = useState(note ? note.title : '');
  const [content, setContent] = useState(note ? note.content : '');
  const [type, setType] = useState(note ? note.type : 'text');
  const [todoList, setTodoList] = useState(note ? note.todoList : []);
  const [color, setColor] = useState(note ? note.color : 'slate');
  const [tags, setTags] = useState(note ? note.tags : []);
  const [isPinned, setIsPinned] = useState(note ? note.isPinned : false);
  const [isFavorite, setIsFavorite] = useState(note ? note.isFavorite : false);
  const [newTagInput, setNewTagInput] = useState('');
  const [showTagSelector, setShowTagSelector] = useState(false);

  const todoInputsRef = useRef([]);

  // Auto-save whenever note properties change
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSave();
    }, 400); // Debounce saves by 400ms

    return () => clearTimeout(timer);
  }, [title, content, type, todoList, color, tags, isPinned, isFavorite]);

  const handleSave = () => {
    const updatedNote = {
      title: title.trim() || 'Untitled Note',
      content: content,
      type: type,
      todoList: todoList,
      color: color,
      tags: tags,
      isPinned: isPinned,
      isFavorite: isFavorite
    };
    onSave(updatedNote);
  };

  // Add tag to the note
  const handleToggleTag = (tag) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  // Create tag on the fly
  const handleAddNewTag = (e) => {
    e.preventDefault();
    const cleanTag = newTagInput.trim();
    if (cleanTag) {
      if (!tags.includes(cleanTag)) {
        setTags([...tags, cleanTag]);
      }
      setNewTagInput('');
    }
  };

  // Todo checklist actions
  const handleAddTodoItem = () => {
    const newItem = {
      id: `todo-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      text: '',
      completed: false
    };
    setTodoList([...todoList, newItem]);
    
    // Focus the new input in next render tick
    setTimeout(() => {
      if (todoInputsRef.current[todoList.length]) {
        todoInputsRef.current[todoList.length].focus();
      }
    }, 50);
  };

  const handleUpdateTodoItem = (id, text) => {
    setTodoList(todoList.map(item => item.id === id ? { ...item, text } : item));
  };

  const handleToggleTodoItem = (id) => {
    setTodoList(todoList.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  const handleRemoveTodoItem = (id) => {
    setTodoList(todoList.filter(item => item.id !== id));
  };

  const handleTodoKeyDown = (index, e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTodoItem();
    } else if (e.key === 'Backspace' && !todoList[index].text && todoList.length > 1) {
      e.preventDefault();
      handleRemoveTodoItem(todoList[index].id);
      // Focus previous input
      const prevIndex = index - 1;
      setTimeout(() => {
        if (todoInputsRef.current[prevIndex]) {
          todoInputsRef.current[prevIndex].focus();
        }
      }, 50);
    }
  };

  // Apply colors to the modal wrapper for premium visual cohesion
  const selectedTheme = COLORS.find(c => c.name === color) || COLORS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      {/* Backdrop closer */}
      <div className="absolute inset-0" onClick={() => { handleSave(); onClose(); }} />

      {/* Modal Container */}
      <div 
        className={`w-full max-w-2xl glass rounded-3xl border shadow-2xl relative flex flex-col h-[85vh] overflow-hidden transition-all duration-300 ${
          color === 'slate' ? 'border-white/10' : `border-${color}-500/20 shadow-${color}-950/20`
        }`}
        style={{
          boxShadow: color !== 'slate' ? `0 25px 50px -12px rgba(var(--color-${color}), 0.25)` : ''
        }}
      >
        {/* Top Control Bar */}
        <div className="p-5 border-b border-white/8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {/* Toggle Note Type */}
            <button
              onClick={() => setType('text')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                type === 'text' 
                  ? 'bg-purple-600/20 text-purple-300 border-purple-500/30' 
                  : 'text-slate-400 hover:text-white border-transparent'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Note
            </button>
            <button
              onClick={() => {
                setType('todo');
                if (todoList.length === 0) {
                  setTodoList([{ id: 'todo-init', text: '', completed: false }]);
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                type === 'todo' 
                  ? 'bg-purple-600/20 text-purple-300 border-purple-500/30' 
                  : 'text-slate-400 hover:text-white border-transparent'
              }`}
            >
              <ListTodo className="w-3.5 h-3.5" />
              Checklist
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Pin note button */}
            <button
              onClick={() => setIsPinned(!isPinned)}
              className={`p-2 rounded-lg hover:bg-white/5 border transition-all ${
                isPinned ? 'text-purple-400 bg-purple-500/10 border-purple-500/20' : 'text-slate-400 hover:text-white border-transparent'
              }`}
              title={isPinned ? 'Unpin Note' : 'Pin Note'}
            >
              <Pin className="w-4 h-4" />
            </button>

            {/* Favorite note button */}
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-2 rounded-lg hover:bg-white/5 border transition-all ${
                isFavorite ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-slate-400 hover:text-white border-transparent'
              }`}
              title={isFavorite ? 'Remove Favorite' : 'Add Favorite'}
            >
              <Star className="w-4 h-4" />
            </button>

            {/* Delete note button */}
            {note && (
              <button
                onClick={() => {
                  onDelete(note.id);
                  onClose();
                }}
                className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                title="Send to Trash"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <div className="w-[1px] h-6 bg-white/8 mx-1" />

            {/* Close Button */}
            <button
              onClick={() => { handleSave(); onClose(); }}
              className="p-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl transition-colors"
              title="Save and Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Note Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Note Title Input */}
          <input
            type="text"
            placeholder="Note Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent border-0 text-2xl font-bold text-white placeholder-slate-600 focus:outline-none focus:ring-0 px-0"
          />

          {/* Render Text Editor or Checklist Editor */}
          {type === 'text' ? (
            <textarea
              placeholder="Start writing..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-80 bg-transparent border-0 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-0 resize-none px-0 leading-relaxed"
            />
          ) : (
            <div className="space-y-3">
              {todoList.map((item, index) => (
                <div key={item.id} className="flex items-center gap-3 group/item">
                  <button
                    onClick={() => handleToggleTodoItem(item.id)}
                    className="text-slate-500 hover:text-purple-400 transition-colors"
                  >
                    {item.completed ? (
                      <CheckSquare className="w-4 h-4 text-purple-400" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                  <input
                    type="text"
                    placeholder="List item..."
                    value={item.text}
                    onChange={(e) => handleUpdateTodoItem(item.id, e.target.value)}
                    onKeyDown={(e) => handleTodoKeyDown(index, e)}
                    ref={(el) => (todoInputsRef.current[index] = el)}
                    className={`flex-1 bg-transparent border-0 text-sm focus:outline-none focus:ring-0 py-1 px-0 ${
                      item.completed ? 'line-through text-slate-600' : 'text-slate-350'
                    }`}
                  />
                  <button
                    onClick={() => handleRemoveTodoItem(item.id)}
                    className="opacity-0 group-hover/item:opacity-100 p-1 hover:bg-white/5 rounded-lg text-slate-500 hover:text-red-400 transition-all duration-200"
                    title="Remove item"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              <button
                onClick={handleAddTodoItem}
                className="flex items-center gap-2 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors py-2 px-1"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            </div>
          )}
        </div>

        {/* Footer Meta Controls */}
        <div className="p-5 border-t border-white/8 bg-black/20 flex flex-col gap-4">
          {/* Tags Manager */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mr-2">
              <Tag className="w-3.5 h-3.5 text-purple-400" />
              Tags:
            </span>
            
            {/* Active Tags badges */}
            {tags.map(tag => (
              <span 
                key={tag}
                onClick={() => handleToggleTag(tag)}
                className="text-[10px] font-semibold px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded-full hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-300 cursor-pointer transition-all duration-200"
                title="Click to remove tag"
              >
                {tag}
              </span>
            ))}

            {/* Inline tag selector popover */}
            <div className="relative">
              <button
                onClick={() => setShowTagSelector(!showTagSelector)}
                className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                title="Add tags"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>

              {showTagSelector && (
                <div className="absolute bottom-full left-0 mb-2 w-56 glass border border-white/10 rounded-xl p-3 shadow-xl z-20 space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Tags</span>
                    <button 
                      onClick={() => setShowTagSelector(false)}
                      className="text-slate-500 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  
                  {/* List of general tags */}
                  <div className="max-h-36 overflow-y-auto space-y-1 py-1">
                    {allTags.map(tag => (
                      <label key={tag} className="flex items-center gap-2 px-1 py-0.5 hover:bg-white/5 rounded-md cursor-pointer text-xs text-slate-300">
                        <input
                          type="checkbox"
                          checked={tags.includes(tag)}
                          onChange={() => handleToggleTag(tag)}
                          className="rounded border-slate-650 bg-black text-purple-600 focus:ring-purple-500 w-3.5 h-3.5"
                        />
                        {tag}
                      </label>
                    ))}
                  </div>

                  {/* Create tag inline */}
                  <form onSubmit={handleAddNewTag} className="flex gap-1.5 pt-1.5 border-t border-white/8">
                    <input
                      type="text"
                      placeholder="Add tag..."
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      className="flex-1 text-[11px] px-2 py-1 bg-black/40 border border-white/8 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    />
                    <button
                      type="submit"
                      className="px-2 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-[10px] font-bold"
                    >
                      Add
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Color coding control & Save confirmation */}
          <div className="flex items-center justify-between gap-4">
            {/* Color Palette Selector */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-400">Card Color:</span>
              <div className="flex items-center gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setColor(c.name)}
                    className={`w-6 h-6 rounded-full transition-all duration-200 border flex items-center justify-center ${
                      color === c.name ? 'scale-125 border-white ring-2 ring-purple-600/30' : 'border-white/10 hover:scale-110'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full ${c.dotClass}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Auto-save indicator */}
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-slow" />
              <span>Auto-saved</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
