import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/Layout';
import { 
  FileText, 
  Upload, 
  Trash2, 
  Eye, 
  Download, 
  Search, 
  Filter,
  Calendar,
  File,
  AlertCircle,
  CheckCircle,
  Clock,
  Plus,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface DocumentItem {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  status: 'processed' | 'processing' | 'error';
  category: string;
  description?: string;
  pages?: number;
  lastAccessed?: string;
  file?: File;
  url?: string;
}

const Documents = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Sample documents data with real files from Documentos_RAG
  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  const categories = [
    'Syllabus',
    'Lecture Notes',
    'Practice Problems',
    'Research',
    'Assignments',
    'Exams',
    'Textbooks',
    'Other'
  ];

  const statuses = [
    { value: 'processed', label: 'Procesado', color: 'bg-green-100 text-green-800 border-green-200' },
    { value: 'processing', label: 'Procesando', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    { value: 'error', label: 'Error', color: 'bg-red-100 text-red-800 border-red-200' }
  ];

  // Load sample documents automatically when component mounts
  useEffect(() => {
    const loadSampleDocuments = () => {
      const sampleDocs: DocumentItem[] = [
        {
          id: 'sample-1',
          name: 'DBA MATEMATICAS.pdf',
          type: 'PDF',
          size: '21.0 MB',
          uploadedAt: new Date().toISOString().split('T')[0],
          status: 'processed',
          category: 'Textbooks',
          description: 'Derechos Básicos de Aprendizaje en Matemáticas - Documento oficial del Ministerio de Educación',
          pages: 45,
          lastAccessed: new Date().toISOString().split('T')[0],
          url: '/OnTrack_Assistant/Documentos_RAG/DBA MATEMATICAS.pdf'
        },
        {
          id: 'sample-2',
          name: 'ESTANDARES BASICOS DE COMPETENCIA.pdf',
          type: 'PDF',
          size: '1.8 MB',
          uploadedAt: new Date().toISOString().split('T')[0],
          status: 'processed',
          category: 'Syllabus',
          description: 'Estándares Básicos de Competencia en Matemáticas - Guía curricular nacional',
          pages: 32,
          lastAccessed: new Date().toISOString().split('T')[0],
          url: '/OnTrack_Assistant/Documentos_RAG/ESTANDARES BASICOS DE COMPETENCIA.pdf'
        },
        {
          id: 'sample-3',
          name: 'Rubrica ecdf.pdf',
          type: 'PDF',
          size: '5.0 MB',
          uploadedAt: new Date().toISOString().split('T')[0],
          status: 'processed',
          category: 'Assignments',
          description: 'Rúbrica de evaluación para competencias digitales y formación ciudadana',
          pages: 18,
          lastAccessed: new Date().toISOString().split('T')[0],
          url: '/OnTrack_Assistant/Documentos_RAG/Rubrica ecdf.pdf'
        },
        {
          id: 'sample-4',
          name: 'articles-169241_archivo_pdf.pdf',
          type: 'PDF',
          size: '1.7 MB',
          uploadedAt: new Date().toISOString().split('T')[0],
          status: 'processed',
          category: 'Research',
          description: 'Artículo de investigación sobre metodologías educativas en matemáticas',
          pages: 12,
          lastAccessed: new Date().toISOString().split('T')[0],
          url: '/OnTrack_Assistant/Documentos_RAG/articles-169241_archivo_pdf.pdf'
        }
      ];

      setDocuments(sampleDocs);
      
      toast({
        title: "Documentos cargados",
        description: "Se han cargado 4 documentos desde la carpeta Documentos_RAG",
      });
    };

    // Load documents automatically when page opens
    loadSampleDocuments();
  }, []);

  const getStatusBadge = (status: string) => {
    const statusInfo = statuses.find(s => s.value === status);
    return (
      <Badge variant="outline" className={`text-xs ${statusInfo?.color}`}>
        {status === 'processing' && <Clock className="w-3 h-3 mr-1 animate-pulse" />}
        {status === 'processed' && <CheckCircle className="w-3 h-3 mr-1" />}
        {status === 'error' && <AlertCircle className="w-3 h-3 mr-1" />}
        {statusInfo?.label}
      </Badge>
    );
  };

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText className="w-8 h-8 text-red-500" />;
      case 'docx':
      case 'doc':
        return <FileText className="w-8 h-8 text-blue-500" />;
      case 'pptx':
      case 'ppt':
        return <FileText className="w-8 h-8 text-orange-500" />;
      case 'xlsx':
      case 'xls':
        return <FileText className="w-8 h-8 text-green-500" />;
      default:
        return <File className="w-8 h-8 text-gray-500" />;
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Process each file
    Array.from(files).forEach((file, index) => {
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            
            // Add new document to the list
            const newDoc: DocumentItem = {
              id: Date.now().toString() + index,
              name: file.name,
              type: file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN',
              size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
              uploadedAt: new Date().toISOString().split('T')[0],
              status: 'processing',
              category: 'Other',
              pages: 0,
              file: file
            };
            
            setDocuments(prev => [newDoc, ...prev]);
            
            toast({
              title: "Documento subido exitosamente",
              description: `${file.name} se está procesando para el análisis RAG`,
            });
            
            // Simulate processing completion after 3 seconds
            setTimeout(() => {
              setDocuments(prev => 
                prev.map(doc => 
                  doc.id === newDoc.id 
                    ? { ...doc, status: 'processed' as const }
                    : doc
                )
              );
            }, 3000);
            
            return 0;
          }
          return prev + 10;
        });
      }, 200);
    });

    // Reset upload state after all files are processed
    setTimeout(() => {
      setIsUploading(false);
      setUploadProgress(0);
    }, 2000);
  };

  const handleDeleteDocument = (documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    toast({
      title: "Documento eliminado",
      description: "El documento ha sido eliminado del sistema",
    });
  };

  const handleDownloadDocument = (document: DocumentItem) => {
    if (document.file) {
      // Create download link for uploaded files
      const url = URL.createObjectURL(document.file);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = document.name;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Descarga iniciada",
        description: `Descargando ${document.name}`,
      });
    } else if (document.url) {
      // For sample documents, try to download from URL
      const a = window.document.createElement('a');
      a.href = document.url;
      a.download = document.name;
      a.target = '_blank';
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      
      toast({
        title: "Descarga iniciada",
        description: `Descargando ${document.name}`,
      });
    }
  };

  const handleViewDocument = (document: DocumentItem) => {
    if (document.file) {
      // For uploaded files, create preview URL
      const url = URL.createObjectURL(document.file);
      window.open(url, '_blank');
    } else if (document.url) {
      // For sample documents, open in new tab
      window.open(document.url, '_blank');
    }
    
    toast({
      title: "Vista previa",
      description: `Abriendo vista previa de ${document.name}`,
    });
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || doc.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getTotalSize = () => {
    return documents.reduce((total, doc) => {
      const sizeInMB = parseFloat(doc.size.replace(' MB', ''));
      return total + sizeInMB;
    }, 0).toFixed(1);
  };

  const getProcessedCount = () => {
    return documents.filter(doc => doc.status === 'processed').length;
  };

  return (
    <MainLayout>
      <div className="space-y-6 max-w-full">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Documentos
            </h1>
            <p className="text-gray-600 text-lg">
              Gestiona la documentación que alimenta el análisis RAG de tus clases
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            {/* Upload Button */}
            <div className="relative">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.rtf"
                onChange={handleFileUpload}
                multiple
              />
              <label htmlFor="file-upload">
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto cursor-pointer"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Subiendo... {uploadProgress}%
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Subir Documentos
                    </>
                  )}
                </Button>
              </label>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Documentos</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{documents.length}</div>
              <p className="text-xs text-muted-foreground">
                Documentos en el sistema
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Espacio Utilizado</CardTitle>
              <File className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getTotalSize()} MB</div>
              <p className="text-xs text-muted-foreground">
                Espacio total ocupado
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Procesados</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getProcessedCount()}</div>
              <p className="text-xs text-muted-foreground">
                Listos para análisis RAG
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Buscar documentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Status Filter */}
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  {statuses.map(status => (
                    <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Documents List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              Documentos ({filteredDocuments.length})
            </h2>
            {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all' ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedStatus('all');
                }}
                className="text-gray-600"
              >
                <X className="w-4 h-4 mr-2" />
                Limpiar Filtros
              </Button>
            ) : null}
          </div>

          {filteredDocuments.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron documentos</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all'
                    ? 'Intenta ajustar los filtros de búsqueda'
                    : 'Sube tu primer documento para comenzar'
                  }
                </p>
                {!searchTerm && selectedCategory === 'all' && selectedStatus === 'all' && (
                  <Button onClick={() => document.getElementById('file-upload')?.click()}>
                    <Upload className="w-4 h-4 mr-2" />
                    Subir Documento
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredDocuments.map((document) => (
                <Card key={document.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      {/* File Icon */}
                      <div className="flex-shrink-0">
                        {getFileIcon(document.type)}
                      </div>
                      
                      {/* Document Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-medium text-gray-900 truncate">
                              {document.name}
                            </h3>
                            {document.description && (
                              <p className="text-sm text-gray-600 mt-1">
                                {document.description}
                              </p>
                            )}
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                              <span className="flex items-center">
                                <File className="w-4 h-4 mr-1" />
                                {document.type} • {document.size}
                              </span>
                              {document.pages && (
                                <span className="flex items-center">
                                  <FileText className="w-4 h-4 mr-1" />
                                  {document.pages} páginas
                                </span>
                              )}
                              <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {document.uploadedAt}
                              </span>
                            </div>
                          </div>
                          
                          {/* Status Badge */}
                          <div className="flex-shrink-0 ml-4">
                            {getStatusBadge(document.status)}
                          </div>
                        </div>
                        
                        {/* Category Badge */}
                        <div className="mt-3">
                          <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
                            {document.category}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex-shrink-0 flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDocument(document)}
                          className="text-blue-600 hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadDocument(document)}
                          className="text-green-600 hover:bg-green-50"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteDocument(document.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Documents;
