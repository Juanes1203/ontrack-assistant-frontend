#!/bin/bash

# Script para subir OnTrack Assistant al servidor Ubuntu
# Ejecutar desde la máquina local

echo "🚀 Subiendo OnTrack Assistant al servidor Ubuntu..."

# Configuración del servidor
SERVER="ubuntu@44.245.182.169"
KEY="/Users/juanes/Desktop/claveAI"

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar que la clave existe
if [ ! -f "$KEY" ]; then
    print_error "Clave SSH no encontrada en: $KEY"
    exit 1
fi

print_status "Clave SSH encontrada: $KEY"
print_warning "IMPORTANTE: El script pedirá la contraseña 'rhododactylos' varias veces"

print_status "1. Subiendo scripts de instalación..."
scp -i "$KEY" install.sh "$SERVER":~/
scp -i "$KEY" deploy.sh "$SERVER":~/

print_status "2. Subiendo configuración de Nginx..."
scp -i "$KEY" OnTrack_Backend/nginx.conf "$SERVER":~/

print_status "3. Subiendo configuración de PM2..."
scp -i "$KEY" OnTrack_Backend/ecosystem.config.js "$SERVER":~/

print_status "4. Subiendo documentación..."
scp -i "$KEY" DEPLOYMENT.md "$SERVER":~/

print_status "5. Creando directorio de la aplicación en el servidor..."
ssh -i "$KEY" "$SERVER" "sudo mkdir -p /var/www/ontrack && sudo chown ubuntu:ubuntu /var/www/ontrack"

print_status "6. Subiendo código del backend..."
rsync -avz -e "ssh -i $KEY" --exclude 'node_modules' --exclude 'dist' --exclude '.env' OnTrack_Backend/ "$SERVER":/var/www/ontrack/backend/

print_status "7. Subiendo código del frontend..."
rsync -avz -e "ssh -i $KEY" --exclude 'node_modules' --exclude 'dist' --exclude '.env*' OnTrack_Assistant/ "$SERVER":/var/www/ontrack/frontend/

print_status "8. Configurando permisos..."
ssh -i "$KEY" "$SERVER" "chmod +x ~/install.sh ~/deploy.sh"

print_status "✅ Archivos subidos exitosamente!"
print_status ""
print_warning "PRÓXIMOS PASOS:"
print_warning "1. Conectarse al servidor: ssh -i $KEY $SERVER"
print_warning "2. Ejecutar: ./install.sh"
print_warning "3. Ejecutar: ./deploy.sh"
print_warning "4. Verificar en: http://44.245.182.169"
