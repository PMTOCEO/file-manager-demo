import type { FileItem } from '../types/file';

export function searchFiles(files: FileItem[], query: string): FileItem[] {
  if (!query.trim()) return files;

  const normalizedQuery = query.toLowerCase().trim();
  
  return files.filter(file => 
    file.name.toLowerCase().includes(normalizedQuery)
  );
}