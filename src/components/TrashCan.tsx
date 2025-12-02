import React from 'react';

interface Props {
  active: boolean; // Driven by cursor position in the hook
}

export const TrashCan: React.FC<Props> = ({ active }) => {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        right: 0,
        width: '150px',
        height: '150px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999999, 
        // Critical: allows mouse events to pass through this overlay so the window mousemove listener in the hook still receives data
        pointerEvents: 'none', 
        userSelect: 'none',
        color: active ? '#d32f2f' : '#757575',
        transition: 'color 0.2s ease',
      }}
    >
       <div style={{ 
           transform: active ? 'scale(1.2) translateY(-5px)' : 'scale(1)', 
           transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)' 
       }}>
        {active ? (
          // Open Lid SVG
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="64" height="64" fill="currentColor">
            <path d="M5 10H19V20C19 21.1 18.1 22 17 22H7C5.9 22 5 21.1 5 20V10Z" />
            <path d="M8 12H10V20H8V12Z" fill="white"/>
            <path d="M14 12H16V20H14V12Z" fill="white"/>
            <g transform="translate(12, 8) rotate(-30) translate(-12, -8)">
                 <path d="M4 6H20V8H4V6Z" />
                 <path d="M8 4H16V6H8V4Z" /> 
            </g>
          </svg>
        ) : (
          // Closed Lid SVG
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="64" height="64" fill="currentColor">
             <path d="M5 10H19V20C19 21.1 18.1 22 17 22H7C5.9 22 5 21.1 5 20V10Z" />
             <path d="M8 12H10V20H8V12Z" fill="white"/>
             <path d="M14 12H16V20H14V12Z" fill="white"/>
             <path d="M4 6H20V8H4V6Z" />
             <path d="M8 4H16V6H8V4Z" />
          </svg>
        )}
      </div>
    </div>
  );
};