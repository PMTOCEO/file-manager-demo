import React from 'react';
import { Search } from 'lucide-react';

export function FilesSearchBar() {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search criteria in here..."
        className="pl-4 pr-10 py-2 rounded-lg border border-gray-200 dark:border-gray-700 w-[400px] 
          focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-600 
          text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
          bg-white dark:bg-gray-900 transition-colors duration-200"
      />
      <button className="absolute right-3 top-1/2 -translate-y-1/2">
        <Search className="w-5 h-5 text-gray-400 dark:text-gray-500" />
      </button>
    </div>
  );
}