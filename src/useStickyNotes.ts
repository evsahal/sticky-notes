import { useState, useEffect, useRef, useCallback } from 'react';
import type { Note, Position } from './types';
import { mockApi } from './api';

export const useStickyNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Interaction State
  const [draggedNoteId, setDraggedNoteId] = useState<string | null>(null);
  const [resizingNoteId, setResizingNoteId] = useState<string | null>(null);
  const [isOverTrash, setIsOverTrash] = useState(false);
  
  // Refs are used here to track values without triggering re-renders during high-frequency mouse events
  const dragOffset = useRef<Position>({ x: 0, y: 0 });
  const saveTimeout = useRef<number | undefined>(undefined);

  // Initial Data Fetch
  useEffect(() => {
    mockApi.fetchNotes().then((data) => {
      setNotes(data);
      setIsLoading(false);
    });
  }, []);

  // Debounced Auto-Save
  // Waits for 1 second of inactivity before triggering the async API call
  useEffect(() => {
    if (isLoading) return; 

    setIsSaving(true);
    
    if (saveTimeout.current) clearTimeout(saveTimeout.current);

    saveTimeout.current = window.setTimeout(() => {
      mockApi.saveNotes(notes).then(() => {
        setIsSaving(false);
      });
    }, 1000);

    return () => clearTimeout(saveTimeout.current);
  }, [notes, isLoading]);

  const getNextZIndex = () => {
    if (notes.length === 0) return 1;
    return Math.max(...notes.map(n => n.zIndex)) + 1;
  };

  const addNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      text: "",
      position: { x: 50, y: 50 },
      width: 200,
      height: 200,
      color: '#ffeb3b', 
      zIndex: getNextZIndex(),
    };
    setNotes((prev) => [...prev, newNote]);
  };

  const updateNoteText = (id: string, text: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, text } : n));
  };

  const updateNoteColor = (id: string, color: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, color } : n));
  };

  // Bring note to visual front by incrementing Z-Index
  const bringToFront = (id: string) => {
    setNotes(prev => {
      const note = prev.find(n => n.id === id);
      if (!note) return prev;
      
      const maxZ = Math.max(...prev.map(n => n.zIndex));
      // Optimization: Don't update if already on top to avoid render cycle
      if (note.zIndex === maxZ) return prev; 
      
      return prev.map(n => n.id === id ? { ...n, zIndex: maxZ + 1 } : n);
    });
  };

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    if (e.button !== 0) return; // Only allow left-click
    const note = notes.find((n) => n.id === id);
    if (!note) return;

    bringToFront(id);
    
    // Calculate distance between mouse pointer and top-left of note to maintain the exact grab point during movement
    dragOffset.current = {
      x: e.clientX - note.position.x,
      y: e.clientY - note.position.y,
    };
    setDraggedNoteId(id);
  };

  const handleResizeStart = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent "Move" logic from firing
    e.preventDefault();  // Prevent text selection during resize
    bringToFront(id);
    setResizingNoteId(id);
  };

  // Global Mouse Move Handler
  // Attached to window to handle fast movements outside the note's boundary
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (draggedNoteId) {
      const newX = e.clientX - dragOffset.current.x;
      const newY = e.clientY - dragOffset.current.y;

      // Trash Logic: Check if cursor is within bottom-right 150x150 zone
      const trashZoneSize = 150;
      const inTrash = (e.clientX > window.innerWidth - trashZoneSize) && 
                      (e.clientY > window.innerHeight - trashZoneSize);
      setIsOverTrash(inTrash);

      setNotes(prev => prev.map(n => n.id === draggedNoteId ? { ...n, position: { x: newX, y: newY } } : n));
    }

    if (resizingNoteId) {
      setNotes(prev => prev.map(note => {
        if (note.id === resizingNoteId) {
          return {
            ...note,
            // Enforce minimum dimensions of 150px
            width: Math.max(150, e.clientX - note.position.x),
            height: Math.max(150, e.clientY - note.position.y)
          };
        }
        return note;
      }));
    }
  }, [draggedNoteId, resizingNoteId]);

  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (draggedNoteId) {
      // Final check for deletion on release
      const trashZoneSize = 150;
      const inTrash = (e.clientX > window.innerWidth - trashZoneSize) && 
                      (e.clientY > window.innerHeight - trashZoneSize);
      
      if (inTrash) {
        setNotes(prev => prev.filter(n => n.id !== draggedNoteId));
      }
    }

    // Reset all interaction states
    setDraggedNoteId(null);
    setResizingNoteId(null);
    setIsOverTrash(false);
  }, [draggedNoteId]);

  // Attach global listeners only when interaction is active
  useEffect(() => {
    if (draggedNoteId || resizingNoteId) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggedNoteId, resizingNoteId, handleMouseMove, handleMouseUp]);

  return { 
    notes, 
    isLoading, 
    isSaving,
    addNote, 
    handleMouseDown, 
    handleResizeStart,
    updateNoteText,
    updateNoteColor,
    bringToFront,
    isOverTrash
  };
};