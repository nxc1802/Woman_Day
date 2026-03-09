import { createContext, useContext, useState, useRef } from 'react';
import {
  supabase,
  fetchAllLetters,
  fetchAllWishlists,
  mapLetterRow,
  mapWishRow,
} from '../lib/supabase';

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const [letters,        setLetters]        = useState([]);
  const [wishlists,      setWishlists]      = useState([]);
  const [lettersReady,   setLettersReady]   = useState(false);
  const [wishlistsReady, setWishlistsReady] = useState(false);
  const channelsRef = useRef([]);

  async function initializeData() {
    try {
      const [l, w] = await Promise.all([fetchAllLetters(), fetchAllWishlists()]);
      setLetters(l);
      setLettersReady(true);
      setWishlists(w);
      setWishlistsReady(true);
    } catch (err) {
      console.error('AppDataContext init error:', err);
    }

    // Realtime — letters
    const lettersChannel = supabase
      .channel('letters-live')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'custom_letters' },
        ({ eventType, new: row, old: oldRow }) => {
          if (eventType === 'INSERT') {
            const mapped = mapLetterRow(row);
            setLetters(prev =>
              prev.find(l => l.id === mapped.id) ? prev : [...prev, mapped]
            );
          }
          if (eventType === 'UPDATE') {
            const mapped = mapLetterRow(row);
            setLetters(prev => prev.map(l => l.id === mapped.id ? mapped : l));
          }
          if (eventType === 'DELETE') {
            setLetters(prev => prev.filter(l => l.id !== oldRow.id));
          }
        }
      )
      .subscribe();

    // Realtime — wishlists
    const wishlistsChannel = supabase
      .channel('wishlists-live')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'wishlists' },
        ({ eventType, new: row, old: oldRow }) => {
          if (eventType === 'INSERT') {
            const mapped = mapWishRow(row);
            setWishlists(prev =>
              prev.find(w => w.id === mapped.id) ? prev : [...prev, mapped]
            );
          }
          if (eventType === 'UPDATE') {
            const mapped = mapWishRow(row);
            setWishlists(prev => prev.map(w => w.id === mapped.id ? mapped : w));
          }
          if (eventType === 'DELETE') {
            setWishlists(prev => prev.filter(w => w.id !== oldRow.id));
          }
        }
      )
      .subscribe();

    channelsRef.current = [lettersChannel, wishlistsChannel];
  }

  return (
    <AppDataContext.Provider value={{
      letters,        setLetters,
      wishlists,      setWishlists,
      lettersReady,
      wishlistsReady,
      initializeData,
    }}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used inside AppDataProvider');
  return ctx;
}
