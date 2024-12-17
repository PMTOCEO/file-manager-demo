import React from 'react';
import { Folder, FileText } from 'lucide-react';
import type { FileItem } from '../types/file';
import { FileTabs } from './FileTabs';

const files: FileItem[] = [];

export function FileList() {
  const [activeTab, setActiveTab] = React.useState<'my-files' | 'shared'>('my-files');

  return (
    <div className="flex-1 flex flex-col">
      <FileTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="p-6">
        <div className="bg-white rounded-lg shadow">
          <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr] gap-4 p-4 border-b border-gray-100 font-medium text-gray-600">
            <div className="w-6"></div>
            <div>Name</div>
            <div>Size</div>
            <div>Permissions</div>
            <div>Date</div>
          </div>
          
          {files.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No files found
            </div>
          )}
          
          {files.map((file) => (
            <div
              key={file.name}
              className="grid grid-cols-[auto_1fr_1fr_1fr_1fr] gap-4 p-4 hover:bg-gray-50 items-center"
            >
              <div className="text-gray-400">
                {file.type === 'folder' ? <Folder size={20} /> : <FileText size={20} />}
              </div>
              <div>{file.name}</div>
              <div>{file.size}</div>
              <div>{file.permissions}</div>
              <div>{file.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}