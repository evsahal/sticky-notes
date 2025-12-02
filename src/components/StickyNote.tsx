import React from 'react';
import type { Note } from '../types';

interface Props {
  note: Note;
  onMouseDown: (e: React.MouseEvent, id: string) => void;
  onResizeStart: (e: React.MouseEvent, id: string) => void;
  onChange: (id: string, text: string) => void;
  onColorChange: (id: string, color: string) => void;
  onFocus: (id: string) => void;
}

const COLORS = ['#ffeb3b', '#a7ffeb', '#ccff90', '#f8bbd0', '#d1c4e9'];

export const StickyNote: React.FC<Props> = ({ 
  note, onMouseDown, onResizeStart, onChange, onColorChange, onFocus 
}) => {
  return (
    <div
      onMouseDown={(e) => onMouseDown(e, note.id)}
      style={{
        position: 'absolute',
        left: note.position.x,
        top: note.position.y,
        width: note.width,
        height: note.height,
        backgroundColor: note.color,
        border: '1px solid #bbb',
        boxShadow: '2px 4px 8px rgba(0,0,0,0.2)',
        padding: '0', 
        display: 'flex',
        flexDirection: 'column',
        zIndex: note.zIndex,
        boxSizing: 'border-box', 
        borderRadius: '2px'
      }}
    >
      {/* Header Area: Handles dragging and color selection */}
      <div style={{
          height: '24px',
          backgroundColor: 'rgba(0,0,0,0.05)',
          cursor: 'grab',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingRight: '5px'
      }}>
        {COLORS.map(c => (
           <div 
             key={c}
             onMouseDown={(e) => {
               e.stopPropagation(); 
               onColorChange(note.id, c);
             }}
             style={{
               width: '12px',
               height: '12px',
               backgroundColor: c,
               borderRadius: '50%',
               marginLeft: '4px',
               cursor: 'pointer',
               border: note.color === c ? '1px solid black' : '1px solid transparent'
             }}
           />
        ))}
      </div>

      <textarea
        style={{
          flex: 1,
          width: '100%',
          padding: '10px',
          background: 'transparent',
          border: 'none',
          resize: 'none',
          outline: 'none',
          fontFamily: 'sans-serif',
          fontSize: '16px',
          boxSizing: 'border-box'
        }}
        value={note.text}
        onChange={(e) => onChange(note.id, e.target.value)}
        onFocus={() => onFocus(note.id)}
        onMouseDown={(e) => e.stopPropagation()} 
      />

      {/* Resize Handle */}
      <div 
        onMouseDown={(e) => onResizeStart(e, note.id)}
        style={{
          position: 'absolute', bottom: 0, right: 0, width: '20px', height: '20px',
          cursor: 'nwse-resize', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end'
        }}
      >
        <div style={{ width: 0, height: 0, borderLeft: '10px solid transparent', borderBottom: '10px solid rgba(0,0,0,0.3)' }} />
      </div>
    </div>
  );
};