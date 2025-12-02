import type { Note } from './types';

const NETWORK_DELAY = 800; // Simulate 800ms server lag
const DB_KEY = 'sticky-notes-db';

export const mockApi = {
  // Simulate GET /notes
  fetchNotes: async (): Promise<Note[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const raw = localStorage.getItem(DB_KEY);
        const data = raw ? JSON.parse(raw) : [];
        resolve(data);
      }, NETWORK_DELAY);
    });
  },

  // Simulate POST/PUT /notes
  // Returns a Promise to allow UI to show "Saving..." state
  saveNotes: async (notes: Note[]): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem(DB_KEY, JSON.stringify(notes));
        resolve(true);
      }, NETWORK_DELAY);
    });
  }
};