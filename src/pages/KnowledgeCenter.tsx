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
  AlertCircle,
  X
} from 'lucide-react';
import { documentsService, Document, DocumentStats, SearchResult } from '@/services/documentsService';

// Document interface is now imported from documentsService

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
  const [documentCategory, setDocumentCategory] = useState('');
  const [documentTags, setDocumentTags] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [stats, setStats] = useState<DocumentStats | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    loadDocuments();
    loadStats();
  }, []);

  // Cerrar modal con tecla Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showUploadForm) {
        setShowUploadForm(false);
      }
    };

    if (showUploadForm) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [showUploadForm]);

  const loadDocuments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await documentsService.getDocuments();
      setDocuments(response.data);
    } catch (err: any) {
      setError('Error al cargar documentos: ' + err.message);
      console.error('Error loading documents:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await documentsService.getDocumentStats();
      setStats(response.data);
    } catch (err: any) {
      console.error('Error loading stats:', err);
    }
  };

  const handleSemanticSearch = async () => {
    if (!searchTerm.trim()) return;
    
    try {
      setIsSearching(true);
      setError(null);
      
      const response = await documentsService.searchDocuments(searchTerm, 10);
      setSearchResults(response.data);
    } catch (err: any) {
      setError('Error en búsqueda semántica: ' + err.message);
      console.error('Error in semantic search:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleReprocessDocument = async (documentId: string) => {
    if (window.confirm('¿Estás seguro de que quieres re-procesar este documento? Esto puede tomar unos minutos.')) {
      try {
        await documentsService.reprocessDocument(documentId);
        setError(null);
        // Recargar documentos y estadísticas
        await loadDocuments();
        await loadStats();
      } catch (err: any) {
        setError('Error al re-procesar documento: ' + err.message);
      }
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

      const tagsArray = documentTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      
      const response = await documentsService.uploadDocument({
        title: documentTitle,
        description: documentDescription,
        file: selectedFile,
        category: documentCategory || 'general',
        tags: tagsArray
      });

      // Agregar el nuevo documento a la lista
      setDocuments(prev => [response.data, ...prev]);

      // Recargar estadísticas
      await loadStats();

      // Reset form
      setSelectedFile(null);
      setDocumentTitle('');
      setDocumentDescription('');
      setDocumentCategory('');
      setDocumentTags('');
      setShowUploadForm(false);
      
    } catch (err: any) {
      setError('Error al subir documento: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (documentId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este documento?')) {
      try {
        await documentsService.deleteDocument(documentId);
        setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      } catch (err: any) {
        setError('Error al eliminar documento: ' + err.message);
      }
    }
  };

  const handleDownload = async (documentId: string, filename: string) => {
    try {
      const blob = await documentsService.downloadDocument(documentId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      setError('Error al descargar documento: ' + err.message);
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
      case 'READY': return 'bg-green-100 text-green-800';
      case 'PROCESSING': return 'bg-yellow-100 text-yellow-800';
      case 'VECTORIZED': return 'bg-blue-100 text-blue-800';
      case 'ERROR': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'READY': return 'Listo';
      case 'PROCESSING': return 'Procesando';
      case 'VECTORIZED': return 'Vectorizado';
      case 'ERROR': return 'Error';
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
              onClick={() => setShowStats(true)}
              variant="outline"
              className="border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              <Brain className="h-4 w-4 mr-2" />
              Estadísticas
            </Button>
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
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              placeholder="Buscar documentos por título, descripción o nombre de archivo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-gray-800 placeholder:text-gray-600 border-gray-300 focus:border-blue-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSemanticSearch();
                }
              }}
            />
          </div>
          
          {searchTerm && (
            <div className="flex gap-2">
              <Button 
                onClick={handleSemanticSearch}
                disabled={isSearching}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isSearching ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Buscando...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Búsqueda Semántica
                  </>
                )}
              </Button>
              <Button 
                onClick={() => {
                  setSearchResults(null);
                  setSearchTerm('');
                }}
                variant="outline"
              >
                Limpiar
              </Button>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Search Results */}
        {searchResults && (
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-purple-800 flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                Resultados de Búsqueda Semántica
              </CardTitle>
              <CardDescription>
                Encontrados {searchResults.totalResults} resultados para "{searchResults.query}"
              </CardDescription>
            </CardHeader>
            <CardContent>
              {searchResults.results.length === 0 ? (
                <p className="text-gray-600">No se encontraron documentos relevantes.</p>
              ) : (
                <div className="space-y-4">
                  {searchResults.results.map((result, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border border-purple-200">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-800">{result.document.title}</h4>
                        <Badge className="bg-purple-100 text-purple-800">
                          {(result.similarity * 100).toFixed(1)}% relevancia
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Categoría: {result.document.category || 'Sin categoría'}
                      </p>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded border-l-4 border-purple-400">
                        "{result.chunk.text}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Upload Form Modal */}
        {showUploadForm && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 relative">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 px-6 py-4 relative">
                <button
                  onClick={() => setShowUploadForm(false)}
                  className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors duration-200"
                >
                  <X className="h-6 w-6" />
                </button>
                <div className="flex items-center space-x-3 pr-8">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Upload className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Subir Nuevo Documento</h2>
                    <p className="text-blue-100 text-sm">Comparte tu conocimiento con la comunidad</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                
                <div className="space-y-6">
                  {/* File Upload Area */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-3">
                      📁 Seleccionar Archivo
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors duration-200">
                      <div className="space-y-4">
                        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                          <Upload className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.txt,.md"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="file-upload-modal"
                          />
                          <label 
                            htmlFor="file-upload-modal"
                            className="cursor-pointer inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Seleccionar Archivo
                          </label>
                        </div>
                        {selectedFile ? (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <div className="flex items-center space-x-2">
                              <FileText className="h-5 w-5 text-green-600" />
                              <div className="text-left">
                                <p className="text-sm font-medium text-green-800">{selectedFile.name}</p>
                                <p className="text-xs text-green-600">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">
                            Arrastra y suelta tu archivo aquí o haz clic para seleccionar
                          </p>
                        )}
                        <p className="text-xs text-gray-400">
                          Formatos soportados: PDF, DOC, DOCX, TXT, MD (máx. 10MB)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Document Title */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      📝 Título del Documento
                    </label>
                    <Input
                      value={documentTitle}
                      onChange={(e) => setDocumentTitle(e.target.value)}
                      placeholder="Ej: Currículo de Matemáticas - Grado 10"
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg placeholder:text-gray-600"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      📄 Descripción
                    </label>
                    <Textarea
                      value={documentDescription}
                      onChange={(e) => setDocumentDescription(e.target.value)}
                      placeholder="Describe el contenido y propósito del documento..."
                      rows={3}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg resize-none placeholder:text-gray-600"
                    />
                  </div>

                  {/* Category and Tags Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        🏷️ Categoría
                      </label>
                      <Input
                        value={documentCategory}
                        onChange={(e) => setDocumentCategory(e.target.value)}
                        placeholder="Ej: lecturas, recursos"
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg placeholder:text-gray-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        🏷️ Tags
                      </label>
                      <Input
                        value={documentTags}
                        onChange={(e) => setDocumentTags(e.target.value)}
                        placeholder="Ej: matemáticas, grado 10"
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg placeholder:text-gray-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={() => setShowUploadForm(false)}
                    className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleUpload}
                    disabled={uploading || !selectedFile}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white rounded-lg font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {uploading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Subiendo...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Subir Documento
                      </>
                    )}
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
              <Card key={document.id} className="hover:shadow-lg transition-shadow border border-gray-200 h-fit">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <FileText className="h-6 w-6 text-blue-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-lg font-semibold text-gray-900 truncate">
                          {document.title}
                        </CardTitle>
                        <CardDescription className="mt-1 text-sm text-gray-600 truncate">
                          {document.originalName || document.filename}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={`ml-2 flex-shrink-0 ${getStatusColor(document.status)}`}>
                      {getStatusText(document.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  {document.description && (
                    <p className="text-sm text-gray-700 leading-relaxed">{document.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-md">
                    <span className="font-medium">{document.fileType}</span>
                    <span className="font-medium">{formatFileSize(document.fileSize)}</span>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Subido:</span> {formatDate(document.createdAt)}
                  </div>

                  {/* Category and Tags */}
                  <div className="space-y-3">
                    {document.category && (
                      <div>
                        <span className="text-sm font-semibold text-gray-800">Categoría:</span>
                        <Badge variant="outline" className="ml-2 text-sm bg-blue-50 text-blue-700 border-blue-200">
                          {document.category}
                        </Badge>
                      </div>
                    )}
                    
                    {document.tags && (
                      <div>
                        <span className="text-sm font-semibold text-gray-800">Tags:</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {(Array.isArray(document.tags) ? document.tags : 
                            typeof document.tags === 'string' ? JSON.parse(document.tags || '[]') : 
                            []).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-sm bg-green-50 text-green-700 border-green-200">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Chunks preview */}
                  {document.chunks && document.chunks.length > 0 && (
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm font-semibold text-gray-800 mb-2">Fragmentos procesados:</p>
                      <div className="flex flex-wrap gap-2">
                        {document.chunks.slice(0, 3).map((chunk, index) => (
                          <Badge key={index} variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                            {chunk}
                          </Badge>
                        ))}
                        {document.chunks.length > 3 && (
                          <Badge variant="outline" className="text-xs bg-gray-100 text-gray-600">
                            +{document.chunks.length - 3} más
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                    <div className="flex justify-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedDocument(document)}
                        className="text-blue-600 hover:bg-blue-50 border-blue-200 flex-1"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(document.id)}
                        className="text-red-600 hover:bg-red-50 border-red-200 flex-1"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Eliminar
                      </Button>
                    </div>
                    
                    {/* Reprocess button for READY documents */}
                    {document.status === 'READY' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReprocessDocument(document.id)}
                        className="text-purple-600 hover:bg-purple-50 border-purple-200 w-full"
                      >
                        <Brain className="h-4 w-4 mr-1" />
                        Vectorizar
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={document.status !== 'READY'}
                      onClick={() => handleDownload(document.id, document.filename)}
                      className="text-green-600 hover:bg-green-50 border-green-200 disabled:opacity-50 w-full"
                    >
                      <Download className="h-4 w-4 mr-1" />
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
                      <span className="font-medium">Archivo:</span> {selectedDocument.originalName || selectedDocument.filename}
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
                    <div>
                      <span className="font-medium">Categoría:</span> {selectedDocument.category || 'Sin categoría'}
                    </div>
                    <div>
                      <span className="font-medium">Tags:</span> {
                        selectedDocument.tags ? 
                          (Array.isArray(selectedDocument.tags) ? 
                            selectedDocument.tags.join(', ') : 
                            typeof selectedDocument.tags === 'string' ? 
                              JSON.parse(selectedDocument.tags || '[]').join(', ') : 
                              'Sin tags'
                          ) : 
                          'Sin tags'
                      }
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

        {/* Stats Modal */}
        {showStats && stats && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 relative">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 relative">
                <button
                  onClick={() => setShowStats(false)}
                  className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors duration-200"
                >
                  <X className="h-6 w-6" />
                </button>
                <div className="flex items-center space-x-3 pr-8">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Estadísticas del Centro de Conocimiento</h2>
                    <p className="text-purple-100 text-sm">Resumen de documentos y vectorización</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-blue-200 bg-blue-50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-blue-800 flex items-center">
                        <FileText className="h-5 w-5 mr-2" />
                        Documentos Totales
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-600">{stats.totalDocuments}</div>
                      <p className="text-sm text-blue-600">documentos subidos</p>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200 bg-green-50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-green-800 flex items-center">
                        <Brain className="h-5 w-5 mr-2" />
                        Documentos Vectorizados
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600">{stats.vectorizedDocuments}</div>
                      <p className="text-sm text-green-600">listos para RAG</p>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-200 bg-purple-50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-purple-800 flex items-center">
                        <RefreshCw className="h-5 w-5 mr-2" />
                        Fragmentos Totales
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-purple-600">{stats.totalChunks}</div>
                      <p className="text-sm text-purple-600">chunks procesados</p>
                    </CardContent>
                  </Card>

                  <Card className="border-orange-200 bg-orange-50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-orange-800 flex items-center">
                        <BookOpen className="h-5 w-5 mr-2" />
                        Categorías
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-orange-600">{stats.categories.length}</div>
                      <p className="text-sm text-orange-600">categorías diferentes</p>
                    </CardContent>
                  </Card>
                </div>

                {stats.categories.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Distribución por Categorías</h3>
                    <div className="space-y-2">
                      {stats.categories.map((category, index) => (
                        <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                          <span className="font-medium text-gray-700">{category.category || 'Sin categoría'}</span>
                          <Badge className="bg-blue-100 text-blue-800">{category.count} documentos</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
                  <Button
                    onClick={() => setShowStats(false)}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium shadow-lg"
                  >
                    Cerrar
                  </Button>
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
