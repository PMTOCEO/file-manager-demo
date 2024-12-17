import React from 'react';
import { Search, X } from 'lucide-react';
import { useSearch } from '../context/SearchContext';

export function SearchBar() {
  const { searchQuery, setSearchQuery } = useSearch();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleClear = () => {
    setSearchQuery('');
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search files..."
        className="pl-10 pr-10 py-2 rounded-lg border border-gray-200 dark:border-gray-700 w-[400px] 
          focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-600 
          text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
          bg-white dark:bg-gray-900 transition-colors duration-200"
      />
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
      {searchQuery && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 
            hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}