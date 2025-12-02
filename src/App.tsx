import { useStickyNotes } from './useStickyNotes';
import { StickyNote } from './components/StickyNote';
import { TrashCan } from './components/TrashCan';

function App() {
  // Bind the Controller logic
  const { 
    notes, addNote, handleMouseDown, handleResizeStart,
    updateNoteText, updateNoteColor, bringToFront, isOverTrash,
    isLoading, isSaving
  } = useStickyNotes();

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative', backgroundColor: '#f0f0f0' }}>
      
      {/* Controls & Feedback */}
      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 1000, display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button 
          onClick={addNote}
          style={{ 
            padding: '10px 20px', backgroundColor: '#333', color: '#fff', 
            border: 'none', cursor: 'pointer', borderRadius: '4px' 
          }}
        >
          + Add Note
        </button>
        
        {/* Async State Indicators */}
        {isLoading && <span style={{color: '#666'}}>Loading notes...</span>}
        {!isLoading && isSaving && <span style={{color: '#666'}}>Saving...</span>}
        {!isLoading && !isSaving && <span style={{color: 'green'}}>All changes saved.</span>}
      </div>

      {!isLoading && notes.map((note) => (
        <StickyNote 
          key={note.id} 
          note={note} 
          onMouseDown={handleMouseDown}
          onResizeStart={handleResizeStart}
          onChange={updateNoteText}
          onColorChange={updateNoteColor}
          onFocus={bringToFront}
        />
      ))}

      <TrashCan active={isOverTrash} />
    </div>
  );
}

export default App;