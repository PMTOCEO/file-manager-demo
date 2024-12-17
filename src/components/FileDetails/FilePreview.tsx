import React from 'react';
import { FileText, Image as ImageIcon, Upload } from 'lucide-react';
import type { FileItem } from '../../types/file';
import { FileUploadBox } from '../shared/FileUploadBox';

interface FilePreviewProps {
  file: FileItem;
  previewUrl: string | null;
  onReplace: () => void;
  isImage: boolean;
  isPending?: boolean;
  pendingPreviewUrl: string | null;
}

export function FilePreview({
  file,
  previewUrl,
  onReplace,
  isImage,
  isPending,
  pendingPreviewUrl
}: FilePreviewProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const currentPreviewUrl = pendingPreviewUrl || previewUrl;
  const hasAttachment = Boolean(currentPreviewUrl);

  const renderPreviewContent = () => {
    if (!hasAttachment) {
      return <FileUploadBox onClick={onReplace} />;
    }

    if (!isImage) {
      return (
        <div className="flex flex-col items-center space-y-2">
          <FileText size={48} className="text-gray-400 dark:text-gray-500" />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {file.name}
          </span>
        </div>
      );
    }

    return (
      <>
        <img
          src={currentPreviewUrl}
          alt={file.name}
          className={`w-full h-full object-contain ${isPending ? 'opacity-75' : ''}`}
        />
        {(isHovered || isPending) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-200">
            <div className="flex flex-col items-center space-y-2 text-white">
              {isPending ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
                  <span className="text-sm">Processing...</span>
                </>
              ) : (
                <>
                  <Upload size={24} />
                  <span className="text-sm">Replace {isImage ? 'Image' : 'File'}</span>
                </>
              )}
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div
      className="relative h-48 bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onReplace}
    >
      {renderPreviewContent()}
    </div>
  );
}