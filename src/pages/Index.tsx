import React, { useState, useEffect } from 'react';
import { Plus, BookOpen, Search, Loader2, AlertCircle, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useClass } from '@/contexts/ClassContext';
import { useAuth } from '@/contexts/AuthContext';
import CreateClassModal from '@/components/CreateClassModal';
import { MentorAILogo } from '@/components/MentorAILogo';
import { AnalysisService } from '@/services/analysisService';
import { ClassAnalysis } from '@/components/ClassAnalysis';
import { RAGInitializer } from '@/components/RAGInitializer';
import { DocumentUploader } from '@/components/DocumentUploader';

const STRAICO_TOKEN = 'nF-pDByZtLBgRjEquS8Ril0h04tfEGMInrLVUrdSCttTcqIRB24';

const Index = () => {
  const navigate = useNavigate();
  const { classes, loading, error, addClass } = useClass();
  const { user, logout } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [analysis, setAnalysis] = useState<{
    transcript: string;
    analysis: string;
    references: Array<{ page_content: string; page: number }>;
    coinsUsed: number;
  } | null>(null);
  const [ragId, setRagId] = useState<string | null>(null);
  const [ragInfo, setRagInfo] = useState<any>(null);

  const handleCreateClass = async (newClass: {
    name: string;
    teacher: string;
    description?: string;
    subject?: string;
    grade_level?: string;
    duration?: number;
  }) => {
    try {
      await addClass(newClass);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating class:', error);
      // Aquí podrías mostrar un toast o alert de error
    }
  };

  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.teacher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClassClick = (classId: string) => {
    navigate(`/class/${classId}`);
  };

  const handleAnalysis = async (audioUrl: string) => {
    try {
      const analysisService = new AnalysisService(STRAICO_TOKEN, ragId!);
      const result = await analysisService.analyzeClass({
        audioUrl,
        ragId: ragId!,
        straicoToken: STRAICO_TOKEN,
        searchOptions: {
          search_type: 'mmr',
          k: 5,
          fetch_k: 20,
          lambda_mult: 0.7
        }
      });

      setAnalysis({
        transcript: result.data.transcript,
        analysis: result.data.analysis,
        references: result.data.references,
        coinsUsed: result.data.coins_used
      });
    } catch (error) {
      console.error('Error al analizar la clase:', error);
      // Manejar el error apropiadamente
    }
  };

  const handleRAGCreated = (newRagId: string, response: any) => {
    setRagId(newRagId);
    setRagInfo(response);
    // Guardar información en localStorage
    localStorage.setItem('ontrack_rag_id', newRagId);
    localStorage.setItem('ontrack_rag_info', JSON.stringify(response));
  };

  // Cargar RAG ID del localStorage al iniciar
  useEffect(() => {
    const savedRagId = localStorage.getItem('ontrack_rag_id');
    const savedRagInfo = localStorage.getItem('ontrack_rag_info');
    if (savedRagId) {
      setRagId(savedRagId);
    }
    if (savedRagInfo) {
      setRagInfo(JSON.parse(savedRagInfo));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center">
            <div style={{ height: 110, marginRight: 32 }}>
              <MentorAILogo />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Gestión de Clases
              </h1>
              <p className="text-gray-600 text-lg">
                {user?.role === 'teacher' 
                  ? `Tus clases - ${user.name}`
                  : 'Organiza, graba y analiza tus clases con inteligencia artificial'
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{user.name}</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {user.role}
                </span>
              </div>
            )}
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nueva Clase
            </Button>
            <Button 
              onClick={logout}
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar clases por nombre o profesor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white pl-10 py-3 text-lg border-2 border-gray-200 focus:border-blue-400 rounded-lg outline-none"
            style={{
              borderColor: '#e5e7eb',
              backgroundColor: '#ffffff'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e5e7eb';
            }}
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <Loader2 className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Cargando clases...
            </h3>
            <p className="text-gray-500">
              Conectando con la base de datos
            </p>
          </div>
        )}

        {/* Class List */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BookOpen className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    {user?.role === 'teacher' ? 'No tienes clases aún' : 'No hay clases disponibles'}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {user?.role === 'teacher' 
                      ? 'Crea tu primera clase para comenzar a grabar y analizar tus sesiones.'
                      : 'Las clases aparecerán aquí una vez que sean creadas.'
                    }
                  </p>
                  {user?.role === 'teacher' && (
                    <Button 
                      onClick={() => setShowCreateModal(true)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Crear Primera Clase
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              filteredClasses.map((cls) => (
                <div
                  key={cls.id}
                  onClick={() => handleClassClick(cls.id!)}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer transform hover:scale-105 border-2 border-gray-100"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{cls.name}</h3>
                    <p className="text-gray-600 mb-4">Profesor: {cls.teacher}</p>
                    {cls.subject && (
                      <p className="text-sm text-gray-500 mb-2">Materia: {cls.subject}</p>
                    )}
                    {cls.duration && (
                      <p className="text-sm text-gray-500 mb-4">Duración: {cls.duration} min</p>
                    )}
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        Iniciar Clase
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}



        {analysis && (
          <ClassAnalysis
            transcript={analysis.transcript}
            analysis={analysis.analysis}
            references={analysis.references}
            coinsUsed={analysis.coinsUsed}
          />
        )}

        {!ragId ? (
          <div className="max-w-2xl mx-auto mt-8">
            <RAGInitializer
              token={STRAICO_TOKEN}
              onRAGCreated={handleRAGCreated}
            />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto mt-8 space-y-6">
            {ragInfo && (
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-2">RAG Information</h3>
                <div className="text-sm text-gray-600">
                  <p><strong>Name:</strong> {ragInfo.data.name}</p>
                  <p><strong>Files:</strong> {ragInfo.data.original_filename}</p>
                  <p><strong>Total Words:</strong> {ragInfo.total_words}</p>
                  <p><strong>Coins Used:</strong> {ragInfo.total_coins}</p>
                </div>
              </div>
            )}
            
            <DocumentUploader
              token={STRAICO_TOKEN}
              ragId={ragId}
              onUploadComplete={(response) => {
                console.log('Documentos cargados:', response);
                // Actualizar la información del RAG si es necesario
              }}
            />
          </div>
        )}
      </div>

      <CreateClassModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateClass={handleCreateClass}
      />
    </div>
  );
};

export default Index;
