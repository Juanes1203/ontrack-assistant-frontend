import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { 
  Mic, 
  MicOff, 
  Plus, 
  X,
  UserPlus,
  GraduationCap,
  User
} from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  isRecording: boolean;
  transcript: string;
  type: 'teacher' | 'student';
}

interface RecordingControlsProps {
  isRecording: boolean;
  participants: Participant[];
  startRecording: (participantId: string) => void;
  stopRecording: (participantId: string) => void;
  addParticipant: (name: string, type: 'teacher' | 'student') => void;
  removeParticipant: (id: string) => void;
}

export const RecordingControls: React.FC<RecordingControlsProps> = ({
  isRecording,
  participants,
  startRecording,
  stopRecording,
  addParticipant,
  removeParticipant
}) => {
  const [newParticipantName, setNewParticipantName] = useState('');

  const handleAddParticipant = (type: 'teacher' | 'student') => {
    if (newParticipantName.trim()) {
      addParticipant(newParticipantName.trim(), type);
      setNewParticipantName('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Participant Section */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-100">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center">
              <UserPlus className="w-5 h-5 mr-2" />
              Agregar Participante
            </h3>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Nombre del participante"
                value={newParticipantName}
                onChange={(e) => setNewParticipantName(e.target.value)}
                className="flex-1 bg-white border-blue-200 focus:border-blue-400"
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
                onKeyPress={(e) => e.key === 'Enter' && handleAddParticipant('student')}
              />
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleAddParticipant('teacher')}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Profesor
                </Button>
                <Button 
                  onClick={() => handleAddParticipant('student')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <User className="w-4 h-4 mr-2" />
                  Estudiante
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Participants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {participants.map((participant) => (
          <Card 
            key={participant.id}
            className={`p-4 transition-all duration-200 ${
              participant.isRecording 
                ? 'bg-red-50 border-red-200 shadow-lg ring-2 ring-red-200' 
                : 'bg-white hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {participant.type === 'teacher' ? (
                  <GraduationCap className="w-4 h-4 text-green-600" />
                ) : (
                  <User className="w-4 h-4 text-blue-600" />
                )}
                <h3 className="font-medium text-gray-900">{participant.name}</h3>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                  {participant.type === 'teacher' ? 'Profesor' : 'Estudiante'}
                </span>
                {participant.isRecording && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-red-600 font-medium">Grabando</span>
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeParticipant(participant.id)}
                className="text-gray-500 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <Button
              onClick={() => participant.isRecording ? stopRecording(participant.id) : startRecording(participant.id)}
              className={`w-full ${
                participant.isRecording
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {participant.isRecording ? (
                <>
                  <MicOff className="w-4 h-4 mr-2" />
                  Detener Grabación
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 mr-2" />
                  Iniciar Grabación
                </>
              )}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
