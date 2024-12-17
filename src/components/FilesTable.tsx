import React from 'react';
import { Folder, FileText, MoreVertical } from 'lucide-react';
import { 
  DndContext, 
  DragEndEvent,
  DragOverEvent, 
  DragOverlay,
  useSensor, 
  useSensors, 
  PointerSensor,
  closestCenter
} from '@dnd-kit/core';
import { 
  SortableContext, 
  verticalListSortingStrategy,
  useSortable 
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useFiles } from '../context/FilesContext';
import { useSearch } from '../context/SearchContext';
import { FileModal } from './FileModal';
import { FileContextMenu } from './FileContextMenu';
import { searchFiles } from '../utils/searchUtils';
import type { FileItem } from '../types/file';

interface SortableItemProps {
  file: FileItem;
  onItemClick: () => void;
  isOver: boolean;
  isDraggingOverFolder: boolean;
  isEditing: boolean;
  editingName: string;
  onEditingNameChange: (value: string) => void;
  onEditComplete: () => void;
}

const SortableItem = React.memo(({ 
  file, 
  onItemClick, 
  isOver,
  isDraggingOverFolder,
  isEditing,
  editingName,
  onEditingNameChange,
  onEditComplete
}: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: file.id,
    data: {
      type: file.type,
      item: file,
    },
  });

  const style = {
    transform: CSS.Transform.toString(
      isDraggingOverFolder && file.type === 'folder' ? undefined : transform
    ),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onEditComplete();
    }
  };

  const handleBlur = () => {
    onEditComplete();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`grid grid-cols-[auto_auto_1fr_1fr_1fr_1fr_auto] gap-4 p-4 items-center cursor-grab active:cursor-grabbing
        ${isDragging ? 'bg-gray-100 dark:bg-gray-800' : ''}
        ${isOver && file.type === 'folder' ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}
        transition-colors duration-200`}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <FileContextMenu file={file} onRename={() => {}} />
      </div>
      <div 
        className="text-gray-400 dark:text-gray-500"
        onClick={(e) => {
          e.stopPropagation();
          onItemClick();
        }}
      >
        {file.type === 'folder' ? <Folder size={20} /> : <FileText size={20} />}
      </div>
      <div 
        className="cursor-pointer text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
        onClick={(e) => {
          e.stopPropagation();
          onItemClick();
        }}
      >
        {isEditing ? (
          <input
            type="text"
            value={editingName}
            onChange={(e) => onEditingNameChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className="w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 
              rounded focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-500"
            autoFocus
          />
        ) : (
          file.name
        )}
      </div>
      <div className="text-gray-900 dark:text-white">{file.size}</div>
      <div className="text-gray-900 dark:text-white">{file.permissions}</div>
      <div className="text-gray-900 dark:text-white">
        {file.createdDate}
      </div>
    </div>
  );
});

SortableItem.displayName = 'SortableItem';

interface FilesTableProps {
  type: 'my-files' | 'shared';
}

export function FilesTable({ type }: FilesTableProps) {
  const { state, dispatch } = useFiles();
  const { searchQuery } = useSearch();
  const [selectedFile, setSelectedFile] = React.useState<FileItem | null>(null);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [overId, setOverId] = React.useState<string | null>(null);
  const [isDraggingOverFolder, setIsDraggingOverFolder] = React.useState(false);
  const [editingFileId, setEditingFileId] = React.useState<string | null>(null);
  const [editingName, setEditingName] = React.useState('');

  const allFiles = type === 'my-files' 
    ? state.files.filter(file => !file.shared && file.parentId === state.currentFolder)
    : state.files.filter(file => file.shared && file.parentId === state.currentFolder);

  const files = searchFiles(allFiles, searchQuery);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragOver = (event: DragOverEvent) => {
    const { over, active } = event;
    if (!over) {
      setOverId(null);
      setIsDraggingOverFolder(false);
      return;
    }

    const overFile = files.find(f => f.id === over.id);
    if (overFile?.type === 'folder' && active.id !== over.id) {
      setOverId(over.id as string);
      setIsDraggingOverFolder(true);
      event.over = null;
    } else {
      setOverId(null);
      setIsDraggingOverFolder(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setOverId(null);
    setIsDraggingOverFolder(false);

    if (!over) return;

    const overFile = files.find(f => f.id === over.id);
    
    if (overFile?.type === 'folder' && active.id !== over.id) {
      dispatch({
        type: 'MOVE_FILE',
        payload: {
          fileId: active.id as string,
          destinationFolderId: over.id as string
        }
      });
      return;
    }

    const newIndex = files.findIndex(f => f.id === over.id);
    dispatch({ 
      type: 'REORDER_FILES', 
      payload: {
        fileId: active.id as string,
        newIndex
      }
    });
  };

  const handleItemClick = (file: FileItem) => {
    if (file.type === 'folder') {
      dispatch({ type: 'SET_CURRENT_FOLDER', payload: file.id });
    } else {
      setSelectedFile(file);
    }
  };

  const handleEditComplete = () => {
    if (editingFileId && editingName.trim()) {
      dispatch({
        type: 'UPDATE_FILE',
        payload: {
          id: editingFileId,
          updates: { name: editingName }
        }
      });
    }
    setEditingFileId(null);
    setEditingName('');
  };

  return (
    <div className="p-6">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow">
        <div className="grid grid-cols-[auto_auto_1fr_1fr_1fr_1fr_auto] gap-4 p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="w-6"></div>
          <div className="w-6"></div>
          <div className="text-gray-900 dark:text-white font-medium">Name</div>
          <div className="text-gray-900 dark:text-white font-medium">Size</div>
          <div className="text-gray-900 dark:text-white font-medium">Permissions</div>
          <div className="text-gray-900 dark:text-white font-medium">Date</div>
          <div className="w-6"></div>
        </div>
        
        {files.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            {type === 'my-files' ? 'No files found' : 'No shared files found'}
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={(event) => setActiveId(event.active.id as string)}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={files.map(f => f.id)}
              strategy={verticalListSortingStrategy}
            >
              {files.map((file) => (
                <SortableItem 
                  key={file.id}
                  file={file}
                  onItemClick={() => handleItemClick(file)}
                  isOver={overId === file.id}
                  isDraggingOverFolder={isDraggingOverFolder}
                  isEditing={editingFileId === file.id}
                  editingName={editingName}
                  onEditingNameChange={setEditingName}
                  onEditComplete={handleEditComplete}
                />
              ))}
            </SortableContext>
            <DragOverlay>
              {activeId ? (
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 opacity-90">
                  <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                    {files.find(f => f.id === activeId)?.type === 'folder' ? (
                      <Folder size={20} className="text-gray-400 dark:text-gray-500" />
                    ) : (
                      <FileText size={20} className="text-gray-400 dark:text-gray-500" />
                    )}
                    <span>{files.find(f => f.id === activeId)?.name}</span>
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>

      {selectedFile && (
        <FileModal
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
        />
      )}
    </div>
  );
}