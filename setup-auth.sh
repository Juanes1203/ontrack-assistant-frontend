#!/bin/bash

echo "🚀 Configurando sistema de autenticación para MentorAI..."

# Verificar si estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: Debes ejecutar este script desde el directorio raíz del proyecto"
    exit 1
fi

# Instalar dependencias del backend si no están instaladas
echo "📦 Verificando dependencias del backend..."
cd backend
if [ ! -d "node_modules" ]; then
    echo "Instalando dependencias del backend..."
    npm install
fi

# Compilar el backend
echo "🔨 Compilando el backend..."
npm run build

# Crear usuarios de prueba
echo "👥 Creando usuarios de prueba..."
npx ts-node src/scripts/createUsers.ts

echo ""
echo "✅ Configuración completada!"
echo ""
echo "📋 Credenciales de acceso:"
echo "👤 Admin: admin@mentorai.com / admin123"
echo "👨‍🏫 Profesores:"
echo "   - maria.gonzalez@mentorai.com / teacher123"
echo "   - carlos.rodriguez@mentorai.com / teacher123"
echo "   - ana.martinez@mentorai.com / teacher123"
echo "👑 Super Admin: superadmin@mentorai.com / admin456"
echo ""
echo "🚀 Para iniciar el backend:"
echo "   cd backend && npm run dev"
echo ""
echo "🌐 Para iniciar el frontend:"
echo "   npm run dev" 