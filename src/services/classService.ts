export interface Class {
  id?: string;
  name: string;
  teacher: string;
  description?: string;
  subject?: string;
  grade_level?: string;
  duration?: number;
  status?: 'active' | 'inactive';
  recording_url?: string;
  transcript?: string;
  analysis_data?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  count?: number;
  error?: string;
}

class ClassService {
  private baseUrl = 'http://localhost:5001/api';

  // Obtener el token de autenticación
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Obtener todas las clases
  async getAllClasses(): Promise<Class[]> {
    try {
      console.log('🌐 Haciendo petición a:', `${this.baseUrl}/classes`);
      const response = await fetch(`${this.baseUrl}/classes`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      console.log('📡 Respuesta recibida:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse<Class[]> = await response.json();
      console.log('📦 Datos recibidos:', result);
      
      if (!result.success) {
        throw new Error(result.message || 'Error al obtener las clases');
      }
      
      return result.data || [];
    } catch (error) {
      console.error('❌ Error fetching classes:', error);
      throw error;
    }
  }

  // Obtener una clase por ID
  async getClassById(id: string): Promise<Class | null> {
    try {
      const response = await fetch(`${this.baseUrl}/classes/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      const result: ApiResponse<Class> = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Error al obtener la clase');
      }
      
      return result.data || null;
    } catch (error) {
      console.error('Error fetching class:', error);
      throw error;
    }
  }

  // Crear una nueva clase
  async createClass(classData: Omit<Class, 'id' | 'created_at' | 'updated_at'>): Promise<Class> {
    try {
      const response = await fetch(`${this.baseUrl}/classes`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(classData),
      });
      
      const result: ApiResponse<Class> = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Error al crear la clase');
      }
      
      return result.data!;
    } catch (error) {
      console.error('Error creating class:', error);
      throw error;
    }
  }

  // Actualizar una clase
  async updateClass(id: string, classData: Partial<Class>): Promise<Class> {
    try {
      const response = await fetch(`${this.baseUrl}/classes/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(classData),
      });
      
      const result: ApiResponse<Class> = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Error al actualizar la clase');
      }
      
      return result.data!;
    } catch (error) {
      console.error('Error updating class:', error);
      throw error;
    }
  }

  // Eliminar una clase
  async deleteClass(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/classes/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });
      
      const result: ApiResponse<null> = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Error al eliminar la clase');
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting class:', error);
      throw error;
    }
  }

  // Buscar clases
  async searchClasses(searchTerm: string): Promise<Class[]> {
    try {
      const response = await fetch(`${this.baseUrl}/classes/search?q=${encodeURIComponent(searchTerm)}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      const result: ApiResponse<Class[]> = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Error al buscar clases');
      }
      
      return result.data || [];
    } catch (error) {
      console.error('Error searching classes:', error);
      throw error;
    }
  }

  // Actualizar datos de análisis
  async updateAnalysisData(id: string, analysisData: any): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/classes/${id}/analysis`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ analysisData }),
      });
      
      const result: ApiResponse<null> = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Error al actualizar los datos de análisis');
      }
      
      return true;
    } catch (error) {
      console.error('Error updating analysis data:', error);
      throw error;
    }
  }
}

export const classService = new ClassService(); 