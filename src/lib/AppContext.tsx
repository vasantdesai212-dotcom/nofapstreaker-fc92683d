import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { AppState } from '@/lib/types';
import { loadState, saveState } from '@/lib/storage';

const AppContext = createContext<{
  state: AppState;
  setState: (s: AppState | ((prev: AppState) => AppState)) => void;
} | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setStateRaw] = useState<AppState>(loadState);

  const setState = useCallback((s: AppState | ((prev: AppState) => AppState)) => {
    setStateRaw((prev) => {
      const next = typeof s === 'function' ? s(prev) : s;
      saveState(next);
      return next;
    });
  }, []);

  return (
    <AppContext.Provider value={{ state, setState }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppState = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppState must be used within AppProvider');
  return ctx;
};
