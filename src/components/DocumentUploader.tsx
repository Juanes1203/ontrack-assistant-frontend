import React, { useState } from 'react';
import { RAGService, RAGConfig } from '@/services/ragService';

interface DocumentUploaderProps {
  token: string;
  ragId: string;
  onUploadComplete?: (response: any) => void;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  token,
  ragId,
  onUploadComplete,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ragService = new RAGService(token, ragId);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Please select at least one file');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const config: RAGConfig = {
        chunking_method: 'fixed_size',
        chunk_size: 1000,
        chunk_overlap: 50,
        buffer_size: 100,
        breakpoint_threshold_type: 'percentile',
        separator: '\n',
        separators: ['\n\n', '\n', ' ', ''],
      };

      const response = await ragService.updateRAG(files, config);
      onUploadComplete?.(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during upload');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Upload Documents for RAG</h2>
      
      <div className="mb-4">
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>

      {files.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">Selected files:</h3>
          <ul className="text-sm text-gray-600">
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <div className="mb-4 text-red-600 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={isUploading || files.length === 0}
        className={`px-4 py-2 rounded-md text-white font-medium
          ${isUploading || files.length === 0
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
          }`}
      >
        {isUploading ? 'Uploading...' : 'Upload Documents'}
      </button>
    </div>
  );
}; 