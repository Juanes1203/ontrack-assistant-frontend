import React, { useState } from 'react';
import { MainLayout } from '@/components/Layout';
import { Search, Plus, MessageSquare, ThumbsUp, ThumbsDown, Star, Filter, Download, TrendingUp, TrendingDown, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';

const Feedback = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const summaryData = [
    {
      title: 'Total de Feedback',
      value: '156',
      icon: MessageSquare,
      iconColor: 'text-blue-600',
      bgColor: 'bg-white',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Satisfacción General',
      value: '4.2',
      subtitle: '/5.0',
      icon: Star,
      iconColor: 'text-yellow-600',
      bgColor: 'bg-white',
      borderColor: 'border-yellow-200'
    },
    {
      title: 'Feedback Positivo',
      value: '78%',
      icon: ThumbsUp,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'Respuestas Pendientes',
      value: '12',
      icon: Clock,
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    }
  ];

  const feedbackData = [
    {
      id: '1',
      studentName: 'María González',
      studentImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      class: 'Matemáticas Avanzadas',
      rating: 5,
      type: 'positive',
      status: 'responded',
      message: 'Excelente clase hoy! La explicación de las derivadas fue muy clara y los ejemplos prácticos me ayudaron mucho a entender el concepto.',
      date: '2024-01-15',
      time: '14:30',
      response: '¡Gracias María! Me alegra que hayas entendido bien el tema. ¿Te gustaría que profundicemos en algún aspecto específico?',
      responseDate: '2024-01-15',
      responseTime: '15:45'
    },
    {
      id: '2',
      studentName: 'Carlos Rodríguez',
      studentImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      class: 'Química Básica',
      rating: 4,
      type: 'positive',
      status: 'pending',
      message: 'La práctica de laboratorio fue muy interesante. Me gustaría que tuviéramos más tiempo para experimentar con las reacciones.',
      date: '2024-01-14',
      time: '16:20'
    },
    {
      id: '3',
      studentName: 'Ana Martínez',
      studentImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      class: 'Laboratorio de Física',
      rating: 3,
      type: 'neutral',
      status: 'responded',
      message: 'El experimento estuvo bien, pero creo que podríamos mejorar la explicación de los conceptos teóricos antes de la práctica.',
      date: '2024-01-13',
      time: '11:15',
      response: 'Tienes razón Ana, voy a reorganizar la clase para dedicar más tiempo a la teoría antes de la práctica. Gracias por la sugerencia.',
      responseDate: '2024-01-13',
      responseTime: '12:30'
    },
    {
      id: '4',
      studentName: 'Luis Herrera',
      studentImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      class: 'Matemáticas Avanzadas',
      rating: 5,
      type: 'positive',
      status: 'responded',
      message: '¡Increíble clase! Los problemas de optimización que resolvimos fueron muy desafiantes y divertidos. Me encantó el enfoque práctico.',
      date: '2024-01-12',
      time: '09:45',
      response: '¡Me alegra que te haya gustado Luis! Eres muy bueno resolviendo problemas complejos. ¿Te gustaría que exploremos más temas avanzados?',
      responseDate: '2024-01-12',
      responseTime: '10:30'
    },
    {
      id: '5',
      studentName: 'Sofia Jiménez',
      studentImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      class: 'Química Básica',
      rating: 2,
      type: 'negative',
      status: 'pending',
      message: 'La clase de hoy fue muy rápida y no pude tomar buenas notas. Necesito que vayamos más despacio con los conceptos nuevos.',
      date: '2024-01-11',
      time: '13:20'
    },
    {
      id: '6',
      studentName: 'Diego Silva',
      studentImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h-150&fit=crop&crop=face',
      class: 'Laboratorio de Física',
      rating: 4,
      type: 'positive',
      status: 'responded',
      message: 'El laboratorio estuvo genial! Los sensores que usamos para medir la velocidad fueron muy precisos. ¿Podemos hacer más experimentos similares?',
      date: '2024-01-10',
      time: '15:00',
      response: '¡Por supuesto Diego! Me alegra que te haya gustado. La próxima semana haremos experimentos con ondas sonoras usando equipos similares.',
      responseDate: '2024-01-10',
      responseTime: '16:15'
    }
  ];

  const filteredFeedback = feedbackData.filter(feedback => {
    const matchesSearch = feedback.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.class.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || feedback.type === filterType;
    const matchesStatus = filterStatus === 'all' || feedback.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'positive':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'negative':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'neutral':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'responded':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'positive':
        return 'Positivo';
      case 'negative':
        return 'Negativo';
      case 'neutral':
        return 'Neutral';
      default:
        return 'Desconocido';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'responded':
        return 'Respondido';
      case 'pending':
        return 'Pendiente';
      default:
        return 'Desconocido';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleNewFeedback = () => {
    navigate('/feedback/new');
  };

  const handleRespond = (feedbackId: string) => {
    navigate(`/feedback/${feedbackId}/respond`);
  };

  return (
    <MainLayout>
      <div className="space-y-6 max-w-full">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Gestión de Feedback
            </h1>
            <p className="text-gray-600 text-lg">
              Monitorea y responde al feedback de tus estudiantes
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar feedback..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full bg-white border-gray-300 focus:border-green-400 focus:ring-green-400"
              />
            </div>
            
            {/* Export Button */}
            <Button 
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 w-full sm:w-auto"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            
            {/* New Feedback Button */}
            <Button 
              onClick={handleNewFeedback}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 w-full sm:w-auto"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nuevo Feedback
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {summaryData.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`${item.bgColor} rounded-lg p-4 lg:p-6 border ${item.borderColor} shadow-sm`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{item.title}</p>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-2xl lg:text-3xl font-bold text-gray-800">{item.value}</span>
                      {item.subtitle && (
                        <span className="text-sm text-gray-500">{item.subtitle}</span>
                      )}
                    </div>
                  </div>
                  <div className={`p-2 lg:p-3 rounded-lg bg-gray-50`}>
                    <Icon className={`w-5 h-5 lg:w-6 lg:h-6 ${item.iconColor}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Feedback</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="positive">Positivo</SelectItem>
                  <SelectItem value="negative">Negativo</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="responded">Respondido</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Feedback List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Lista de Feedback ({filteredFeedback.length})
            </h2>
          </div>
          
          <div className="space-y-4">
            {filteredFeedback.map((feedback) => (
              <div
                key={feedback.id}
                className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                {/* Feedback Header */}
                <div className="p-4 lg:p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={feedback.studentImage} alt={feedback.studentName} />
                        <AvatarFallback className="bg-green-100 text-green-800">
                          {feedback.studentName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {feedback.studentName}
                        </h3>
                        <p className="text-sm text-gray-500">{feedback.class}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="secondary" 
                        className={getTypeColor(feedback.type)}
                      >
                        {getTypeLabel(feedback.type)}
                      </Badge>
                      <Badge 
                        variant="secondary" 
                        className={getStatusColor(feedback.status)}
                      >
                        {getStatusLabel(feedback.status)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Calificación:</span>
                      <div className="flex space-x-1">
                        {renderStars(feedback.rating)}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{feedback.date}</p>
                      <p className="text-sm text-gray-400">{feedback.time}</p>
                    </div>
                  </div>
                </div>

                {/* Feedback Content */}
                <div className="p-4 lg:p-6">
                  <div className="mb-4">
                    <p className="text-gray-700 leading-relaxed">{feedback.message}</p>
                  </div>

                  {/* Response Section */}
                  {feedback.status === 'responded' && feedback.response && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">Tu respuesta:</span>
                      </div>
                      <p className="text-green-700 text-sm leading-relaxed">{feedback.response}</p>
                      <div className="text-right mt-2">
                        <p className="text-xs text-green-600">
                          {feedback.responseDate} - {feedback.responseTime}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    {feedback.status === 'pending' ? (
                      <Button
                        onClick={() => handleRespond(feedback.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Responder
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleRespond(feedback.id)}
                        variant="outline"
                        className="flex-1 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Editar Respuesta
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      <TrendingUp className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Feedback;
