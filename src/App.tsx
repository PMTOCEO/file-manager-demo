import React from 'react';
import { FilesSidebar } from './components/FilesSidebar';
import { FilesMainContent } from './components/FilesMainContent';
import { FilesProvider } from './context/FilesContext';
import { SearchProvider } from './context/SearchContext';
import { Moon, Sun } from 'lucide-react';

function App() {
  const [isDark, setIsDark] = React.useState(true);

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  return (
    <FilesProvider>
      <SearchProvider>
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
          <button
            onClick={() => setIsDark(!isDark)}
            className="fixed top-4 right-4 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div className="flex min-h-screen">
            <FilesSidebar />
            <FilesMainContent />
          </div>
        </div>
      </SearchProvider>
    </FilesProvider>
  );
}

export default App;