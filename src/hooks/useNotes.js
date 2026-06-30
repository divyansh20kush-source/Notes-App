import { useState, useEffect, useMemo } from 'react';

const DEFAULT_TAGS = ['Personal', 'Work', 'Ideas', 'Important'];

const DEFAULT_NOTES = [
  {
    id: 'default-1',
    title: '✨ Welcome to Zenote!',
    content: 'Zenote is a premium, feature-rich notes application. You can write rich text notes, create checklists, tag notes, mark them as favorites, and customize colors. Click on any card to edit it or delete it.',
    type: 'text',
    todoList: [],
    isPinned: true,
    isArchived: false,
    isFavorite: true,
    isDeleted: false,
    color: 'slate',
    tags: ['Ideas'],
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'default-2',
    title: '🚀 Features Checklist',
    content: '',
    type: 'todo',
    todoList: [
      { id: 'todo-1', text: 'Create a new note with color coding', completed: true },
      { id: 'todo-2', text: 'Pin important notes to the top', completed: true },
      { id: 'todo-3', text: 'Filter by tags or search title/content', completed: false },
      { id: 'todo-4', text: 'Archive notes or send them to Trash', completed: false },
      { id: 'todo-5', text: 'Check the dashboard statistics', completed: false },
    ],
    isPinned: false,
    isArchived: false,
    isFavorite: false,
    isDeleted: false,
    color: 'purple',
    tags: ['Work', 'Important'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export function useNotes() {
  // Load notes from local storage or use defaults
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('zenote_notes');
    return saved ? JSON.parse(saved) : DEFAULT_NOTES;
  });

  // Load tags from local storage or use defaults
  const [tags, setTags] = useState(() => {
    const saved = localStorage.getItem('zenote_tags');
    return saved ? JSON.parse(saved) : DEFAULT_TAGS;
  });

  // Active view tab: 'all', 'favorites', 'archived', 'trash'
  const [activeTab, setActiveTab] = useState('all');
  
  // Filtering state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('zenote_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('zenote_tags', JSON.stringify(tags));
  }, [tags]);

  // CRUD for Tags
  const addTag = (tagName) => {
    const trimmed = tagName.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      return true;
    }
    return false;
  };

  const removeTag = (tagName) => {
    setTags(tags.filter(t => t !== tagName));
    // Remove the tag from any notes that have it
    setNotes(prevNotes => prevNotes.map(note => ({
      ...note,
      tags: note.tags.filter(t => t !== tagName)
    })));
    if (selectedTag === tagName) {
      setSelectedTag(null);
    }
  };

  // CRUD for Notes
  const addNote = (noteData = {}) => {
    const newNote = {
      id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: noteData.title?.trim() || 'Untitled Note',
      content: noteData.content || '',
      type: noteData.type || 'text',
      todoList: noteData.todoList || [],
      isPinned: noteData.isPinned || false,
      isArchived: false,
      isFavorite: false,
      isDeleted: false,
      color: noteData.color || 'slate',
      tags: noteData.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setNotes(prevNotes => [newNote, ...prevNotes]);
    return newNote;
  };

  const updateNote = (noteId, updates) => {
    setNotes(prevNotes => prevNotes.map(note => {
      if (note.id === noteId) {
        return {
          ...note,
          ...updates,
          updatedAt: new Date().toISOString()
        };
      }
      return note;
    }));
  };

  const deleteNote = (noteId) => {
    // Soft delete: Move to Trash
    setNotes(prevNotes => prevNotes.map(note => {
      if (note.id === noteId) {
        return { ...note, isDeleted: true, isPinned: false, updatedAt: new Date().toISOString() };
      }
      return note;
    }));
  };

  const restoreNote = (noteId) => {
    // Restore from Trash
    setNotes(prevNotes => prevNotes.map(note => {
      if (note.id === noteId) {
        return { ...note, isDeleted: false, updatedAt: new Date().toISOString() };
      }
      return note;
    }));
  };

  const permanentDeleteNote = (noteId) => {
    // Hard delete
    setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
  };

  const duplicateNote = (noteId) => {
    const noteToDuplicate = notes.find(n => n.id === noteId);
    if (!noteToDuplicate) return;

    const duplicated = {
      ...noteToDuplicate,
      id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: `${noteToDuplicate.title} (Copy)`,
      isPinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setNotes(prevNotes => [duplicated, ...prevNotes]);
  };

  const emptyTrash = () => {
    setNotes(prevNotes => prevNotes.filter(note => !note.isDeleted));
  };

  // Filtered Notes computation
  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      // 1. Tab/Folder filter
      if (activeTab === 'trash') {
        if (!note.isDeleted) return false;
      } else {
        if (note.isDeleted) return false;
        
        if (activeTab === 'archived' && !note.isArchived) return false;
        if (activeTab !== 'archived' && note.isArchived) return false;

        if (activeTab === 'favorites' && !note.isFavorite) return false;
      }

      // 2. Search Query filter (matches title, content, checklist items, or tags)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = note.title.toLowerCase().includes(query);
        const matchesContent = note.content.toLowerCase().includes(query);
        const matchesTags = note.tags.some(t => t.toLowerCase().includes(query));
        const matchesChecklist = note.todoList.some(todo => todo.text.toLowerCase().includes(query));

        if (!matchesTitle && !matchesContent && !matchesTags && !matchesChecklist) {
          return false;
        }
      }

      // 3. Tag filter
      if (selectedTag && !note.tags.includes(selectedTag)) {
        return false;
      }

      // 4. Color filter
      if (selectedColor && note.color !== selectedColor) {
        return false;
      }

      return true;
    });
  }, [notes, activeTab, searchQuery, selectedTag, selectedColor]);

  // Statistics dashboard data
  const stats = useMemo(() => {
    const activeNotes = notes.filter(n => !n.isDeleted && !n.isArchived);
    const total = activeNotes.length;
    const pinned = activeNotes.filter(n => n.isPinned).length;
    const favorites = activeNotes.filter(n => n.isFavorite).length;
    const archived = notes.filter(n => n.isArchived && !n.isDeleted).length;
    const deleted = notes.filter(n => n.isDeleted).length;
    
    // Tag counts
    const tagDistribution = {};
    activeNotes.forEach(note => {
      note.tags.forEach(tag => {
        tagDistribution[tag] = (tagDistribution[tag] || 0) + 1;
      });
    });

    // Color counts
    const colorDistribution = {};
    activeNotes.forEach(note => {
      colorDistribution[note.color] = (colorDistribution[note.color] || 0) + 1;
    });

    // Checklist complete vs incomplete count
    let totalTodos = 0;
    let completedTodos = 0;
    activeNotes.forEach(note => {
      if (note.type === 'todo') {
        note.todoList.forEach(todo => {
          totalTodos++;
          if (todo.completed) completedTodos++;
        });
      }
    });

    return {
      total,
      pinned,
      favorites,
      archived,
      deleted,
      tagDistribution,
      colorDistribution,
      todos: {
        total: totalTodos,
        completed: completedTodos,
        completionRate: totalTodos ? Math.round((completedTodos / totalTodos) * 100) : 0
      }
    };
  }, [notes]);

  return {
    notes: filteredNotes,
    allNotesRaw: notes,
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
  };
}
