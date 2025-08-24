import React, { useState } from 'react';
import { MainLayout } from '@/components/Layout';
import { Search, Plus, Users, GraduationCap, Mail, Phone, MapPin, Eye, Edit, Trash2, Filter, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { useStudent } from '@/contexts/StudentContext';

const Students = () => {
  const navigate = useNavigate();
  const { students } = useStudent();
  const [searchTerm, setSearchTerm] => useState('');
  const [filterGrade, setFilterGrade] => useState('all');
  const [filterStatus, setFilterStatus] => useState('all');

  const summaryData = [
    {
      title: 'Total de Estudiantes',
      value: students.length.toString(),
      icon: Users,
      iconColor: 'text-blue-600',
      bgColor: 'bg-white',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Estudiantes Activos',
      value: students.filter(s => s.attendance >= 80).length.toString(),
      icon: GraduationCap,
      iconColor: 'text-green-600',
      bgColor: 'bg-white',
      borderColor: 'border-green-200'
    },
    {
      title: 'Nuevos este Mes',
      value: students.filter(s => {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return s.createdAt > monthAgo;
      }).length.toString(),
      icon: Users,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      title: 'Promedio de Asistencia',
      value: `${Math.round(students.reduce((acc, s) => acc + s.attendance, 0) / students.length)}%`,
      icon: GraduationCap,
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    }
  ];

  // Transform context students to match the expected format
  const studentsData = students.map(student => ({
    id: student.id,
    name: student.fullName,
    email: student.email,
    phone: '+57 300 123 4567', // Placeholder phone
    grade: student.grade,
    status: student.attendance >= 80 ? 'active' : 'inactive',
    attendance: student.attendance,
    classes: student.subjects,
    image: student.avatar,
    location: 'Colombia' // Placeholder location
  }));


  const filteredStudents = studentsData.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = filterGrade === 'all' || student.grade === filterGrade;
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
    
    return matchesSearch && matchesGrade && matchesStatus;
  });

  const handleViewStudent = (studentId: string) => {
    navigate(`/student/${studentId}`);
  };

  const handleNewStudent = () => {
    navigate('/students/new');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 90) return 'text-green-600';
    if (attendance >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <MainLayout>
      <div className="space-y-6 max-w-full">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Gestión de Estudiantes
            </h1>
            <p className="text-gray-600 text-lg">
              Administra y monitorea el progreso de tus estudiantes
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar estudiantes..."
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
            
            {/* New Student Button */}
            <Button 
              onClick={handleNewStudent}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 w-full sm:w-auto"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nuevo Estudiante
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Grado</label>
              <Select value={filterGrade} onValueChange={setFilterGrade}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Todos los grados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los grados</SelectItem>
                  <SelectItem value="9°">9°</SelectItem>
                  <SelectItem value="10°">10°</SelectItem>
                  <SelectItem value="11°">11°</SelectItem>
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
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="inactive">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Students List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Lista de Estudiantes ({filteredStudents.length})
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                {/* Student Header */}
                <div className="p-4 lg:p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={student.image} alt={student.name} />
                        <AvatarFallback className="bg-green-100 text-green-800">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {student.name}
                        </h3>
                        <p className="text-sm text-gray-500">{student.email}</p>
                      </div>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={getStatusColor(student.status)}
                    >
                      {student.status === 'active' ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-gray-600 border-gray-300">
                      {student.grade}
                    </Badge>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Asistencia</p>
                      <p className={`text-lg font-semibold ${getAttendanceColor(student.attendance)}`}>
                        {student.attendance}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Student Details */}
                <div className="p-4 lg:p-6">
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{student.phone}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{student.location}</span>
                    </div>
                  </div>

                  {/* Classes */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Clases Inscritas</p>
                    <div className="flex flex-wrap gap-1">
                      {student.classes.map((cls, index) => (
                        <Badge key={index} variant="outline" className="text-xs text-gray-600 border-gray-200">
                          {cls}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleViewStudent(student.id)}
                      variant="outline"
                      className="flex-1 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Detalles
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-300 text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
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

export default Students;
