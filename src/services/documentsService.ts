import apiClient from './apiClient';

export interface Document {
  id: string;
  title: string;
  description: string;
  filename: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  s3Key: string;
  s3Url: string;
  category: string;
  tags: string[];
  content?: string;
  chunks?: string[];
  status: 'PROCESSING' | 'READY' | 'ERROR';
  teacherId: string;
  schoolId: string;
  createdAt: string;
  updatedAt: string;
}

export interface UploadDocumentData {
  title: string;
  description?: string;
  file: File;
  category?: string;
  tags?: string[];
}

export const documentsService = {
  // Obtener todos los documentos del usuario
  async getDocuments(): Promise<{ success: boolean; data: Document[] }> {
    const response = await apiClient.get('/documents');
    return response.data;
  },

  // Subir un nuevo documento
  async uploadDocument(data: UploadDocumentData): Promise<{ success: boolean; data: Document; message: string }> {
    const formData = new FormData();
    formData.append('title', data.title);
    if (data.description) {
      formData.append('description', data.description);
    }
    if (data.category) {
      formData.append('category', data.category);
    }
    if (data.tags && data.tags.length > 0) {
      formData.append('tags', JSON.stringify(data.tags));
    }
    formData.append('file', data.file);

    const response = await apiClient.post('/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Obtener un documento específico
  async getDocument(id: string): Promise<{ success: boolean; data: Document }> {
    const response = await apiClient.get(`/documents/${id}`);
    return response.data;
  },

  // Eliminar un documento
  async deleteDocument(id: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete(`/documents/${id}`);
    return response.data;
  },

  // Descargar un documento
  async downloadDocument(id: string): Promise<Blob> {
    const response = await apiClient.get(`/documents/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
