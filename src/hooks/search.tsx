import React, { createContext, useState, useCallback, useContext } from 'react';

interface SearchContextState {
  searchWord: string;
  setSearchWord(word: string): void;
}

const SearchContext = createContext<SearchContextState>(
  {} as SearchContextState,
);

export const SearchProvider: React.FC = ({ children }) => {
  const [data, setData] = useState('');

  const setSearchWord = useCallback((word: string) => {
    setData(word);
  }, []);

  return (
    <SearchContext.Provider value={{ searchWord: data, setSearchWord }}>
      {children}
    </SearchContext.Provider>
  );
};

export function useSearch(): SearchContextState {
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error('useSearch must be used within an AuthProvider');
  }

  return context;
}
