import { useState } from 'react';

export const useOrderNotes = (initialNotes: string = '') => {
  const [notes, setNotes] = useState(initialNotes);

  const updateNotes = (newNotes: string) => {
    setNotes(newNotes);
  };

  const clearNotes = () => {
    setNotes('');
  };

  return {
    notes,
    updateNotes,
    clearNotes,
  };
};