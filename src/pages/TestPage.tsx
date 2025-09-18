import React from 'react';

const TestPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🎉 OnTrack Assistant
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Sistema de Grabación y Análisis de Clases
        </p>
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl font-semibold mb-4">Estado del Sistema</h2>
          <div className="space-y-2 text-left">
            <div className="flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
              <span>Backend: Funcionando</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
              <span>Frontend: Funcionando</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
              <span>Base de Datos: SQLite</span>
            </div>
          </div>
          <div className="mt-6">
            <a 
              href="/classes" 
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Ir a Clases
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
