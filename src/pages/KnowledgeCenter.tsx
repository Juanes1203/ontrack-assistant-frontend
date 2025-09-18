import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Upload, 
  FileText, 
  Search, 
  Trash2, 
  Download,
  Eye,
  BookOpen,
  Brain,
  RefreshCw,
  Plus,
  AlertCircle
} from 'lucide-react';

interface Document {
  id: string;
  title: string;
  description: string;
  filename: string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
  status: 'processing' | 'ready' | 'error';
  content?: string;
  chunks?: string[];
}

const KnowledgeCenter = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentDescription, setDocumentDescription] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simular carga de documentos (en producción vendría del backend)
      const mockDocuments: Document[] = [
        {
          id: '1',
          title: 'Currículo de Matemáticas - Grado 10',
          description: 'Documento oficial del currículo de matemáticas para grado 10',
          filename: 'curriculo-matematicas-g10.pdf',
          fileType: 'PDF',
          fileSize: 2048576,
          uploadDate: '2024-09-18T10:00:00Z',
          status: 'ready',
          content: 'Contenido del currículo de matemáticas...',
          chunks: ['Álgebra lineal', 'Geometría analítica', 'Funciones trigonométricas']
        },
        {
          id: '2',
          title: 'Guía de Física - Mecánica',
          description: 'Guía de estudio para el tema de mecánica en física',
          filename: 'guia-fisica-mecanica.pdf',
          fileType: 'PDF',
          fileSize: 1536000,
          uploadDate: '2024-09-17T15:30:00Z',
          status: 'ready',
          content: 'Contenido de la guía de física...',
          chunks: ['Leyes de Newton', 'Cinemática', 'Dinámica']
        },
        {
          id: '3',
          title: 'Historia de Colombia - Siglo XIX',
          description: 'Material de estudio sobre la historia de Colombia en el siglo XIX',
          filename: 'historia-colombia-siglo19.docx',
          fileType: 'DOCX',
          fileSize: 1024000,
          uploadDate: '2024-09-16T09:15:00Z',
          status: 'processing'
        }
      ];
      
      setDocuments(mockDocuments);
    } catch (err: any) {
      setError('Error al cargar documentos: ' + err.message);
      console.error('Error loading documents:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setDocumentTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Por favor selecciona un archivo');
      return;
    }

    if (!documentTitle.trim()) {
      setError('Por favor ingresa un título para el documento');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      // Simular upload (en producción se enviaría al backend)
      const newDocument: Document = {
        id: Date.now().toString(),
        title: documentTitle,
        description: documentDescription,
        filename: selectedFile.name,
        fileType: selectedFile.name.split('.').pop()?.toUpperCase() || 'UNKNOWN',
        fileSize: selectedFile.size,
        uploadDate: new Date().toISOString(),
        status: 'processing'
      };

      setDocuments(prev => [newDocument, ...prev]);
      
      // Simular procesamiento
      setTimeout(() => {
        setDocuments(prev => prev.map(doc => 
          doc.id === newDocument.id 
            ? { ...doc, status: 'ready', content: 'Contenido procesado...', chunks: ['Chunk 1', 'Chunk 2'] }
            : doc
        ));
      }, 3000);

      // Reset form
      setSelectedFile(null);
      setDocumentTitle('');
      setDocumentDescription('');
      setShowUploadForm(false);
      
    } catch (err: any) {
      setError('Error al subir documento: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (documentId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este documento?')) {
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ready': return 'Listo';
      case 'processing': return 'Procesando';
      case 'error': return 'Error';
      default: return 'Desconocido';
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Cargando documentos...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Centro de Conocimientos</h1>
            <p className="text-gray-600 mt-1">
              Sube y gestiona documentos para alimentar el análisis de IA de tus clases
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowUploadForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Subir Documento
            </Button>
            <Button onClick={loadDocuments} variant="outline">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* RAG Info */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Brain className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-800">¿Cómo funciona el RAG?</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Los documentos que subas se procesan y dividen en fragmentos que la IA utiliza 
                  para enriquecer el análisis de tus clases. Esto permite que el análisis sea más 
                  preciso y contextualizado con tu material de enseñanza.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar documentos por título, descripción o nombre de archivo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Upload Form Modal */}
        {showUploadForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Subir Nuevo Documento</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Archivo
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt,.md"
                      onChange={handleFileSelect}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Formatos soportados: PDF, DOC, DOCX, TXT, MD
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título del Documento
                    </label>
                    <Input
                      value={documentTitle}
                      onChange={(e) => setDocumentTitle(e.target.value)}
                      placeholder="Ej: Currículo de Matemáticas - Grado 10"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción
                    </label>
                    <Textarea
                      value={documentDescription}
                      onChange={(e) => setDocumentDescription(e.target.value)}
                      placeholder="Describe el contenido y propósito del documento..."
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowUploadForm(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleUpload}
                    disabled={uploading || !selectedFile}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {uploading ? 'Subiendo...' : 'Subir Documento'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Documents List */}
        {filteredDocuments.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  {searchTerm ? 'No se encontraron documentos' : 'No hay documentos disponibles'}
                </h3>
                <p className="text-gray-500">
                  {searchTerm 
                    ? 'Intenta con otros términos de búsqueda'
                    : 'Sube tu primer documento para comenzar a alimentar el análisis de IA'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((document) => (
              <Card key={document.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <CardTitle className="text-lg">{document.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {document.filename}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={getStatusColor(document.status)}>
                      {getStatusText(document.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">{document.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{document.fileType}</span>
                    <span>{formatFileSize(document.fileSize)}</span>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Subido: {formatDate(document.uploadDate)}
                  </div>

                  {/* Chunks preview */}
                  {document.chunks && document.chunks.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">Fragmentos procesados:</p>
                      <div className="flex flex-wrap gap-1">
                        {document.chunks.slice(0, 3).map((chunk, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {chunk}
                          </Badge>
                        ))}
                        {document.chunks.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{document.chunks.length - 3} más
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2 border-t">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedDocument(document)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Ver
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(document.id)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Eliminar
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={document.status !== 'ready'}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Descargar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Document Detail Modal */}
        {selectedDocument && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto w-full">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold">{selectedDocument.title}</h2>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedDocument(null)}
                  >
                    Cerrar
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Archivo:</span> {selectedDocument.filename}
                    </div>
                    <div>
                      <span className="font-medium">Tipo:</span> {selectedDocument.fileType}
                    </div>
                    <div>
                      <span className="font-medium">Tamaño:</span> {formatFileSize(selectedDocument.fileSize)}
                    </div>
                    <div>
                      <span className="font-medium">Estado:</span> 
                      <Badge className={`ml-2 ${getStatusColor(selectedDocument.status)}`}>
                        {getStatusText(selectedDocument.status)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <span className="font-medium">Descripción:</span>
                    <p className="mt-1 text-gray-600">{selectedDocument.description}</p>
                  </div>
                  
                  {selectedDocument.chunks && selectedDocument.chunks.length > 0 && (
                    <div>
                      <span className="font-medium">Fragmentos procesados ({selectedDocument.chunks.length}):</span>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedDocument.chunks.map((chunk, index) => (
                          <Badge key={index} variant="outline">
                            {chunk}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedDocument.content && (
                    <div>
                      <span className="font-medium">Contenido:</span>
                      <div className="mt-2 p-4 bg-gray-50 rounded-lg max-h-64 overflow-y-auto">
                        <p className="text-sm">{selectedDocument.content}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default KnowledgeCenter;
