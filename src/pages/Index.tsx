import React, { useState, useEffect } from 'react';
import { Plus, BookOpen, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useClass } from '@/contexts/ClassContext';
import CreateClassModal from '@/components/CreateClassModal';
import { MentorAILogo } from '@/components/MentorAILogo';
import { AnalysisService } from '@/services/analysisService';
import { ClassAnalysis } from '@/components/ClassAnalysis';
import { RAGInitializer } from '@/components/RAGInitializer';
import { DocumentUploader } from '@/components/DocumentUploader';

const STRAICO_TOKEN = 'nF-pDByZtLBgRjEquS8Ril0h04tfEGMInrLVUrdSCttTcqIRB24';

const Index = () => {
  const navigate = useNavigate();
  const { classes, addClass } = useClass();
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

  const handleCreateClass = (newClass: {
    name: string;
    teacher: string;
  }) => {
    addClass(newClass);
    setShowCreateModal(false);
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
    localStorage.setItem('mentorai_rag_id', newRagId);
    localStorage.setItem('mentorai_rag_info', JSON.stringify(response));
  };

  // Cargar RAG ID del localStorage al iniciar
  useEffect(() => {
    const savedRagId = localStorage.getItem('mentorai_rag_id');
    const savedRagInfo = localStorage.getItem('mentorai_rag_info');
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
                Organiza, graba y analiza tus clases con inteligencia artificial
              </p>
            </div>
          </div>
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nueva Clase
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Buscar clases por nombre o profesor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 py-3 text-lg border-2 border-gray-200 focus:border-blue-400 rounded-lg"
          />
        </div>

        {/* Class List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((cls) => (
            <div
              key={cls.id}
              onClick={() => handleClassClick(cls.id)}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer transform hover:scale-105 border-2 border-gray-100"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{cls.name}</h3>
                <p className="text-gray-600 mb-4">Profesor: {cls.teacher}</p>
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
          ))}
        </div>

        {filteredClasses.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-24 h-24 text-gray-300 mx-auto mb-4 float-animation" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              {searchTerm ? 'No se encontraron clases' : 'No hay clases creadas'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm 
                ? 'Intenta con otros términos de búsqueda' 
                : 'Comienza creando tu primera clase'
              }
            </p>
            {!searchTerm && (
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Crear Primera Clase
              </Button>
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
