#!/bin/bash

# Script de deployment paso a paso para OnTrack Assistant
# Dominio: http://assistant.ontrack.global

echo "🚀 OnTrack Assistant - Deployment Paso a Paso"
echo "🌐 Dominio: http://assistant.ontrack.global"
echo "=============================================="

# Configuración
SERVER="ubuntu@44.245.182.169"
KEY="/Users/juanes/Desktop/claveAI"
DOMAIN="assistant.ontrack.global"

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Función para ejecutar comandos en el servidor
run_on_server() {
    ssh -i "$KEY" "$SERVER" "$1"
}

# Función para esperar confirmación del usuario
wait_for_user() {
    echo ""
    read -p "¿Continuar con el siguiente paso? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Deployment cancelado."
        exit 1
    fi
}

print_status "Este script realizará el deployment paso a paso."
print_warning "Asegúrate de que el dominio assistant.ontrack.global apunte a tu servidor Ubuntu."
wait_for_user

# Paso 1: Limpiar servidor
print_status "PASO 1: Limpiando servidor Ubuntu..."
run_on_server "
echo '🧹 Limpiando servidor...'
sudo apt-get update
sudo apt-get autoremove -y
sudo apt-get autoclean
sudo systemctl stop apache2 2>/dev/null || true
sudo systemctl disable apache2 2>/dev/null || true
echo '✅ Limpieza completada'
"
wait_for_user

# Paso 2: Instalar dependencias
print_status "PASO 2: Instalando dependencias..."
run_on_server "
echo '📦 Instalando dependencias...'
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs postgresql postgresql-contrib nginx git curl wget
sudo npm install -g pm2
echo '✅ Dependencias instaladas'
"
wait_for_user

# Paso 3: Configurar PostgreSQL
print_status "PASO 3: Configurando PostgreSQL..."
run_on_server "
echo '🗄️ Configurando PostgreSQL...'
sudo systemctl start postgresql
sudo systemctl enable postgresql
sudo -u postgres psql -c \"CREATE DATABASE ontrack;\"
sudo -u postgres psql -c \"CREATE USER ontrack_user WITH ENCRYPTED PASSWORD 'ontrack_secure_password_2024';\"
sudo -u postgres psql -c \"GRANT ALL PRIVILEGES ON DATABASE ontrack TO ontrack_user;\"
sudo -u postgres psql -c \"ALTER USER ontrack_user CREATEDB;\"
echo '✅ PostgreSQL configurado'
"
wait_for_user

# Paso 4: Crear directorios
print_status "PASO 4: Creando estructura de directorios..."
run_on_server "
echo '📁 Creando directorios...'
sudo mkdir -p /var/www/ontrack/{frontend,backend,backend/uploads/recordings}
sudo chown -R ubuntu:ubuntu /var/www/ontrack
sudo chmod -R 755 /var/www/ontrack
echo '✅ Directorios creados'
"
wait_for_user

# Paso 5: Clonar repositorios
print_status "PASO 5: Clonando repositorios desde GitHub..."
run_on_server "
echo '📥 Clonando repositorios...'
cd /var/www/ontrack
git clone https://github.com/Juanes1203/OnTrack_Assistant.git frontend-temp
cp -r frontend-temp/* frontend/
rm -rf frontend-temp
git clone https://github.com/Juanes1203/ontrack-assistant-backend.git backend-temp
cp -r backend-temp/* backend/
rm -rf backend-temp
echo '✅ Repositorios clonados'
"
wait_for_user

# Paso 6: Configurar backend
print_status "PASO 6: Configurando backend..."
run_on_server "
echo '⚙️ Configurando backend...'
cd /var/www/ontrack/backend
npm install
cat > .env << 'ENV'
NODE_ENV=production
PORT=3001
DATABASE_URL=\"postgresql://ontrack_user:ontrack_secure_password_2024@localhost:5432/ontrack\"
JWT_SECRET=\"ontrack_jwt_secret_2024_very_secure\"
JWT_EXPIRES_IN=7d
STRAICO_API_KEY=\"your_straico_api_key_here\"
CORS_ORIGIN=\"http://assistant.ontrack.global\"
ENV
npx prisma generate
npx prisma db push
echo '✅ Backend configurado'
"
wait_for_user

# Paso 7: Configurar frontend
print_status "PASO 7: Configurando frontend..."
run_on_server "
echo '⚙️ Configurando frontend...'
cd /var/www/ontrack/frontend
npm install
cat > .env.production << 'ENV'
VITE_API_BASE_URL=http://assistant.ontrack.global/api
VITE_ELEVENLABS_AGENT_ID=your_elevenlabs_agent_id_here
ENV
npm run build
echo '✅ Frontend configurado'
"
wait_for_user

# Paso 8: Configurar Nginx
print_status "PASO 8: Configurando Nginx..."
run_on_server "
echo '🌐 Configurando Nginx...'
sudo tee /etc/nginx/sites-available/ontrack << 'NGINX'
server {
    listen 80;
    server_name assistant.ontrack.global;

    location / {
        root /var/www/ontrack/frontend/dist;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    location /uploads {
        alias /var/www/ontrack/backend/uploads;
        expires 1y;
        add_header Cache-Control \"public, immutable\";
    }
}
NGINX
sudo ln -sf /etc/nginx/sites-available/ontrack /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx
echo '✅ Nginx configurado'
"
wait_for_user

# Paso 9: Configurar PM2
print_status "PASO 9: Configurando PM2..."
run_on_server "
echo '🔄 Configurando PM2...'
cd /var/www/ontrack/backend
cat > ecosystem.config.js << 'PM2'
module.exports = {
  apps: [{
    name: 'ontrack-backend',
    script: 'dist/index.js',
    cwd: '/var/www/ontrack/backend',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
};
PM2
sudo mkdir -p /var/log/ontrack
sudo chown ubuntu:ubuntu /var/log/ontrack
pm2 start ecosystem.config.js
pm2 save
pm2 startup
echo '✅ PM2 configurado'
"
wait_for_user

# Paso 10: Configurar SSL
print_status "PASO 10: Configurando SSL con Let's Encrypt..."
run_on_server "
echo '🔒 Configurando SSL...'
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d assistant.ontrack.global --non-interactive --agree-tos --email admin@ontrack.global
sudo crontab -l | { cat; echo '0 12 * * * /usr/bin/certbot renew --quiet'; } | sudo crontab -
echo '✅ SSL configurado'
"
wait_for_user

# Verificación final
print_status "PASO 11: Verificando deployment..."
run_on_server "
echo '🔍 Verificando deployment...'
sudo systemctl status nginx
sudo systemctl status postgresql
pm2 status
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443
sudo netstat -tlnp | grep :3001
echo '✅ Verificación completada'
"

print_success "🎉 Deployment completado exitosamente!"
print_success "🌐 Aplicación disponible en: https://assistant.ontrack.global"
print_success "📊 Backend API: https://assistant.ontrack.global/api"

echo ""
echo "🔧 Comandos útiles:"
echo "  - Ver logs: ssh -i $KEY $SERVER 'pm2 logs ontrack-backend'"
echo "  - Reiniciar: ssh -i $KEY $SERVER 'pm2 restart ontrack-backend'"
echo "  - Estado: ssh -i $KEY $SERVER 'pm2 status'"
echo "  - Nginx: ssh -i $KEY $SERVER 'sudo systemctl status nginx'"
