import React from 'react';
import { X } from 'lucide-react';
import { useFiles } from '../context/FilesContext';
import { useFileUpload } from '../hooks/useFileUpload';
import { FilePreview } from './shared/FilePreview';
import { FileMetadata } from './FileDetails/FileMetadata';
import { FileActions } from './FileDetails/FileActions';
import type { FileItem } from '../types/file';

interface FileModalProps {
  file: FileItem;
  onClose: () => void;
}

export function FileModal({ file, onClose }: FileModalProps) {
  const { dispatch } = useFiles();
  const [fileName, setFileName] = React.useState(file.name);
  const [description, setDescription] = React.useState(file.description || '');
  const [hasMetadataChanges, setHasMetadataChanges] = React.useState(false);

  const [
    { selectedFile, previewUrl, fileType, isProcessing },
    { handleFileSelect, fileInputRef }
  ] = useFileUpload();

  const currentPreviewUrl = previewUrl || file.dataUrl;

  const handleShare = () => {
    dispatch({ type: 'TOGGLE_SHARE', payload: file.id });
  };

  const handleDelete = () => {
    dispatch({ type: 'DELETE_FILE', payload: file.id });
    onClose();
  };

  const handleDownload = () => {
    if (currentPreviewUrl) {
      const link = document.createElement('a');
      link.href = currentPreviewUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleInputChange = (field: 'name' | 'description', value: string) => {
    if (field === 'name') {
      setFileName(value);
    } else {
      setDescription(value);
    }
    setHasMetadataChanges(true);
  };

  const handleSave = () => {
    const updates: Partial<FileItem> = {};

    if (hasMetadataChanges) {
      updates.name = fileName;
      updates.description = description;
    }

    if (selectedFile && previewUrl) {
      updates.dataUrl = previewUrl;
      updates.fileType = fileType || file.fileType;
      updates.size = `${(selectedFile.size / 1024).toFixed(2)} KB`;
    }

    if (Object.keys(updates).length > 0) {
      updates.lastModified = new Date().toLocaleString();
      dispatch({
        type: 'UPDATE_FILE',
        payload: { id: file.id, updates }
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg w-[600px] shadow-xl">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">File Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept={file.fileType?.mimeType.startsWith('image/') ? "image/*" : undefined}
          />

          <FilePreview
            file={selectedFile || file}
            previewUrl={currentPreviewUrl}
            isProcessing={isProcessing}
            onReplace={() => fileInputRef.current?.click()}
          />

          <FileMetadata
            file={file}
            fileName={fileName}
            description={description}
            onInputChange={handleInputChange}
          />
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 p-4 flex justify-between">
          <FileActions
            file={file}
            currentPreviewUrl={currentPreviewUrl}
            pendingPreviewUrl={previewUrl}
            fileName={fileName}
            onShare={handleShare}
            onDelete={handleDelete}
            onDownload={handleDownload}
          />
          
          <button
            onClick={handleSave}
            disabled={!hasMetadataChanges && !selectedFile}
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              (hasMetadataChanges || selectedFile) && !isProcessing
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            {isProcessing ? 'Processing...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}