import { createContext, useState, useContext } from 'react';

const SearchContext = createContext(null);

// Default values when used outside provider
const defaultSearchContext = {
  searchResults: null,
  setSearchResults: () => {},
  isSearching: false,
  setIsSearching: () => {},
  searchQuery: '',
  setSearchQuery: () => {},
  clearSearch: () => {},
};

export const SearchProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const clearSearch = () => {
    setSearchResults(null);
    setSearchQuery('');
  };

  return (
    <SearchContext.Provider
      value={{
        searchResults,
        setSearchResults,
        isSearching,
        setIsSearching,
        searchQuery,
        setSearchQuery,
        clearSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  // Return default context if not within provider (prevents crashes)
  if (!context) {
    return defaultSearchContext;
  }
  return context;
};

export default SearchProvider;
