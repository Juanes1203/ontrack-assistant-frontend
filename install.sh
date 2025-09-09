#!/bin/bash

# Script de instalación para OnTrack Assistant en Ubuntu
# Ejecutar en el servidor Ubuntu

echo "🔧 Instalando OnTrack Assistant en Ubuntu..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

print_header() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Verificar si es root
if [ "$EUID" -eq 0 ]; then
    print_error "No ejecutar como root. Usar sudo cuando sea necesario."
    exit 1
fi

print_header "1. Actualizando sistema..."
sudo apt update && sudo apt upgrade -y

print_header "2. Instalando dependencias básicas..."
sudo apt install -y curl wget git build-essential software-properties-common

print_header "3. Instalando Node.js 18 LTS..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar instalación de Node.js
node_version=$(node --version)
npm_version=$(npm --version)
print_status "Node.js instalado: $node_version"
print_status "NPM instalado: $npm_version"

print_header "4. Instalando PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib

# Iniciar PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

print_header "5. Configurando PostgreSQL..."
# Crear base de datos y usuario
sudo -u postgres psql -c "CREATE DATABASE ontrack_db;"
sudo -u postgres psql -c "CREATE USER ontrack_user WITH PASSWORD 'ontrack_password_2024';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ontrack_db TO ontrack_user;"

print_status "Base de datos 'ontrack_db' creada"
print_status "Usuario 'ontrack_user' creado"

print_header "6. Instalando Nginx..."
sudo apt install -y nginx

# Iniciar Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

print_header "7. Instalando PM2..."
sudo npm install -g pm2

print_header "8. Configurando directorio de la aplicación..."
sudo mkdir -p /var/www/ontrack
sudo chown $USER:$USER /var/www/ontrack
cd /var/www/ontrack

print_header "9. Clonando repositorios..."
# Nota: El usuario debe configurar los repositorios Git
print_warning "IMPORTANTE: Necesitas configurar los repositorios Git antes de continuar"
print_warning "Ejecuta los siguientes comandos:"
echo ""
echo "git clone https://github.com/tu-usuario/OnTrack_Assistant.git frontend"
echo "git clone https://github.com/tu-usuario/OnTrack_Backend.git backend"
echo ""

print_header "10. Configurando variables de entorno..."
# Crear archivo .env para backend
cat > backend/.env << EOF
NODE_ENV=production
PORT=3001
DATABASE_URL="postgresql://ontrack_user:ontrack_password_2024@localhost:5432/ontrack_db"
JWT_SECRET="ontrack_jwt_secret_2024_very_secure"
JWT_EXPIRES_IN="7d"
STRAICO_API_KEY="dR-V0csHwxpoaZsR608sLWMMoxzqeQonX4UWGCpUbkB8ljEBaZW"
EOF

# Crear archivo .env para frontend
cat > frontend/.env.production << EOF
VITE_API_BASE_URL=http://44.245.182.169/api
VITE_ELEVENLABS_AGENT_ID=tu_elevenlabs_agent_id
EOF

print_status "Variables de entorno configuradas"

print_header "11. Configurando Nginx..."
sudo cp backend/nginx.conf /etc/nginx/sites-available/ontrack
sudo ln -sf /etc/nginx/sites-available/ontrack /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Probar configuración de Nginx
sudo nginx -t
if [ $? -eq 0 ]; then
    sudo systemctl reload nginx
    print_status "Nginx configurado correctamente"
else
    print_error "Error en la configuración de Nginx"
    exit 1
fi

print_header "12. Configurando firewall..."
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

print_header "13. Creando directorio de logs..."
sudo mkdir -p /var/log/pm2
sudo chown $USER:$USER /var/log/pm2

print_status "✅ Instalación base completada!"
print_status ""
print_warning "PRÓXIMOS PASOS:"
print_warning "1. Clona los repositorios Git en /var/www/ontrack/"
print_warning "2. Ejecuta: chmod +x deploy.sh && ./deploy.sh"
print_warning "3. Verifica que todo funcione en: http://44.245.182.169"
print_status ""
print_status "Comandos útiles:"
print_status "- Ver logs: pm2 logs ontrack-backend"
print_status "- Estado: pm2 status"
print_status "- Reiniciar: pm2 restart ontrack-backend"
print_status "- Nginx: sudo systemctl status nginx"
