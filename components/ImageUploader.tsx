import React, { useRef } from 'react';
import { UploadIcon } from './Icons';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  isUploading: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, isUploading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
        <label htmlFor="file-upload" className="sr-only">Choose a file</label>
        <div 
            onClick={handleClick}
            className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-12 text-center hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green transition-colors duration-200 cursor-pointer"
        >
            <UploadIcon />
            <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-dark-text">
                {isUploading ? 'Uploading...' : 'Click to upload an image'}
            </span>
            <span className="block text-xs text-gray-500 dark:text-dark-text-secondary">PNG, JPG, WEBP up to 10MB</span>
        </div>
        <input
            id="file-upload"
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileChange}
            disabled={isUploading}
        />
    </div>
  );
};

export default ImageUploader;
