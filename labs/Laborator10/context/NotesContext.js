import {
  createContext, useContext, useEffect, useMemo, useReducer,
} from 'react';
import { useAuth } from './AuthContext';
import { loadNotes, saveNotes } from '../storage/notesStorage';

const initialState = { notes: [], loaded: false };

function notesReducer(state, action) {
  switch (action.type) {
    case 'loaded':
      return { notes: action.notes, loaded: true };
    case 'added':
      return {
        ...state,
        notes: [{ id: String(Date.now()), text: action.text }, ...state.notes],
      };
    case 'removed':
      return { ...state, notes: state.notes.filter((n) => n.id !== action.id) };
    case 'reset':
      return initialState;
    default:
      throw new Error('Acțiune necunoscută: ' + action.type);
  }
}

// Două contexte: starea (se schimbă des) și acțiunile (stabile)
const NotesStateContext = createContext(null);
const NotesActionsContext = createContext(null);

export function NotesProvider({ children }) {
  const { user } = useAuth(); // NotesProvider trebuie montat ÎN INTERIORUL AuthProvider
  const [state, dispatch] = useReducer(notesReducer, initialState);

  // Citire la autentificare, golire la deconectare
  useEffect(() => {
    if (!user) {
      dispatch({ type: 'reset' });
      return;
    }
    let cancelled = false;
    loadNotes(user.id).then((notes) => {
      if (!cancelled) dispatch({ type: 'loaded', notes });
    });
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  // Salvare după fiecare modificare, doar după citire
  useEffect(() => {
    if (user && state.loaded) saveNotes(user.id, state.notes);
  }, [state.notes, state.loaded]);

  // dispatch este stabil, deci și obiectul de acțiuni rămâne același
  const actions = useMemo(
    () => ({
      addNote: (text) => dispatch({ type: 'added', text }),
      deleteNote: (id) => dispatch({ type: 'removed', id }),
    }),
    []
  );

  return (
    <NotesStateContext.Provider value={state}>
      <NotesActionsContext.Provider value={actions}>
        {children}
      </NotesActionsContext.Provider>
    </NotesStateContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesStateContext);
  if (context === null) {
    throw new Error('useNotes trebuie folosit în interiorul unui NotesProvider');
  }
  return context;
}

export function useNotesActions() {
  const context = useContext(NotesActionsContext);
  if (context === null) {
    throw new Error('useNotesActions trebuie folosit în interiorul unui NotesProvider');
  }
  return context;
}
