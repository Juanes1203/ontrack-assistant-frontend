#!/bin/bash

# Script de deployment para OnTrack Assistant
# Ejecutar en el servidor Ubuntu

echo "🚀 Iniciando deployment de OnTrack Assistant..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar si estamos en el directorio correcto
if [ ! -d "/var/www/ontrack" ]; then
    print_error "Directorio /var/www/ontrack no existe. Ejecutar primero el script de instalación."
    exit 1
fi

cd /var/www/ontrack

# Actualizar repositorios
print_status "Actualizando repositorios..."
cd backend
git pull origin main
cd ../frontend
git pull origin main
cd ..

# Instalar dependencias del backend
print_status "Instalando dependencias del backend..."
cd backend
npm install --production
npm run build

# Verificar que el build fue exitoso
if [ ! -d "dist" ]; then
    print_error "Error en el build del backend"
    exit 1
fi

# Instalar dependencias del frontend
print_status "Instalando dependencias del frontend..."
cd ../frontend
npm install
npm run build

# Verificar que el build fue exitoso
if [ ! -d "dist" ]; then
    print_error "Error en el build del frontend"
    exit 1
fi

# Reiniciar servicios
print_status "Reiniciando servicios..."

# Reiniciar backend con PM2
pm2 restart ontrack-backend || pm2 start /var/www/ontrack/backend/ecosystem.config.js

# Recargar Nginx
sudo systemctl reload nginx

print_status "✅ Deployment completado exitosamente!"
print_status "🌐 Aplicación disponible en: http://44.245.182.169"
print_status "📊 Backend API: http://44.245.182.169/api"

# Mostrar estado de los servicios
print_status "Estado de los servicios:"
pm2 status
sudo systemctl status nginx --no-pager -l
