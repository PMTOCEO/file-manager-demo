import React from 'react';
import { FilesTabs } from './FilesTabs';
import { FilesTable } from './FilesTable';
import { FolderNavigation } from './FolderNavigation';

export function FilesMainContent() {
  const [activeTab, setActiveTab] = React.useState<'my-files' | 'shared'>('my-files');

  return (
    <main className="flex-1 flex flex-col">
      <FilesTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <FolderNavigation />
      <FilesTable type={activeTab} />
    </main>
  );
}