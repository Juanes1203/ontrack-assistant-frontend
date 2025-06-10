import React, { useState } from 'react';
import { RAGService, RAGConfig } from '@/services/ragService';

interface RAGInitializerProps {
  token: string;
  onRAGCreated: (ragId: string, response: any) => void;
}

export const RAGInitializer: React.FC<RAGInitializerProps> = ({
  token,
  onRAGCreated,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files).slice(0, 4);
      setFiles(selectedFiles);
      setError(null); // Limpiar errores anteriores
    }
  };

  const handleCreateRAG = async () => {
    if (files.length === 0) {
      setError('Please select at least one file');
      return;
    }

    setIsCreating(true);
    setError(null);
    setUploadProgress(0);

    try {
      const ragService = new RAGService(token);
      const config: RAGConfig = {
        chunking_method: 'fixed_size',
        chunk_size: 1000,
        chunk_overlap: 50,
        separator: '\n'
      };

      // Simular progreso de carga
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 1000);

      const response = await ragService.createRAG(
        'MentorAI Course Materials',
        'RAG base for course materials and class analysis',
        files,
        config
      );

      clearInterval(progressInterval);
      setUploadProgress(100);
      onRAGCreated(response.data._id, response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating RAG');
      setUploadProgress(0);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Initialize RAG for Course Materials</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Course Materials (PDF, DOCX, CSV, TXT, XLSX, PY)
        </label>
        <input
          type="file"
          multiple
          accept=".pdf,.docx,.csv,.txt,.xlsx,.py"
          onChange={handleFileChange}
          disabled={isCreating}
          className={`block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            ${isCreating
              ? 'file:bg-gray-100 file:text-gray-400'
              : 'file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
            }`}
        />
        <p className="mt-1 text-sm text-gray-500">
          You can select up to 4 files. Processing may take several minutes.
        </p>
      </div>

      {files.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">Selected files:</h3>
          <ul className="text-sm text-gray-600">
            {files.map((file, index) => (
              <li key={index} className="flex items-center justify-between">
                <span>{file.name}</span>
                <span className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isCreating && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {uploadProgress < 100
              ? 'Processing files...'
              : 'Finalizing...'}
          </p>
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <button
        onClick={handleCreateRAG}
        disabled={isCreating || files.length === 0}
        className={`px-4 py-2 rounded-md text-white font-medium
          ${isCreating || files.length === 0
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
          }`}
      >
        {isCreating ? 'Creating RAG...' : 'Create New RAG'}
      </button>
    </div>
  );
};
 