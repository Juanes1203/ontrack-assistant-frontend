#!/bin/bash

# Script completo de limpieza y deployment para OnTrack Assistant
# Dominio: http://assistant.ontrack.global

echo "🚀 OnTrack Assistant - Limpieza y Deployment Completo"
echo "🌐 Dominio: http://assistant.ontrack.global"
echo "=================================================="

# Configuración
SERVER="ubuntu@44.245.182.169"
KEY="/Users/juanes/Desktop/claveAI"
DOMAIN="assistant.ontrack.global"

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Verificar conexión SSH
print_status "Verificando conexión SSH..."
ssh -o ConnectTimeout=10 -i "$KEY" "$SERVER" "echo 'Conexión SSH exitosa'" || {
    print_error "No se pudo conectar al servidor. Verifica la clave SSH."
    exit 1
}

print_status "1. Limpiando servidor Ubuntu..."

# Limpiar procesos y servicios innecesarios
ssh -i "$KEY" "$SERVER" << 'EOF'
echo "🧹 Limpiando procesos y servicios..."

# Detener servicios innecesarios
sudo systemctl stop apache2 2>/dev/null || true
sudo systemctl disable apache2 2>/dev/null || true

# Limpiar paquetes innecesarios
sudo apt-get update
sudo apt-get autoremove -y
sudo apt-get autoclean

# Limpiar logs antiguos
sudo journalctl --vacuum-time=7d

# Limpiar archivos temporales
sudo rm -rf /tmp/*
sudo rm -rf /var/tmp/*

# Limpiar cache de apt
sudo apt-get clean

echo "✅ Limpieza básica completada"
EOF

print_status "2. Instalando dependencias necesarias..."

# Instalar dependencias
ssh -i "$KEY" "$SERVER" << 'EOF'
echo "📦 Instalando dependencias..."

# Actualizar sistema
sudo apt-get update
sudo apt-get upgrade -y

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib

# Instalar Nginx
sudo apt-get install -y nginx

# Instalar PM2 globalmente
sudo npm install -g pm2

# Instalar Git
sudo apt-get install -y git

# Instalar herramientas adicionales
sudo apt-get install -y curl wget unzip

echo "✅ Dependencias instaladas"
EOF

print_status "3. Configurando PostgreSQL..."

# Configurar PostgreSQL
ssh -i "$KEY" "$SERVER" << 'EOF'
echo "🗄️ Configurando PostgreSQL..."

# Iniciar PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Crear usuario y base de datos
sudo -u postgres psql << 'PSQL'
CREATE DATABASE ontrack;
CREATE USER ontrack_user WITH ENCRYPTED PASSWORD 'ontrack_secure_password_2024';
GRANT ALL PRIVILEGES ON DATABASE ontrack TO ontrack_user;
ALTER USER ontrack_user CREATEDB;
\q
PSQL

echo "✅ PostgreSQL configurado"
EOF

print_status "4. Creando estructura de directorios..."

# Crear estructura de directorios
ssh -i "$KEY" "$SERVER" << 'EOF'
echo "📁 Creando estructura de directorios..."

# Crear directorios principales
sudo mkdir -p /var/www/ontrack
sudo mkdir -p /var/www/ontrack/frontend
sudo mkdir -p /var/www/ontrack/backend
sudo mkdir -p /var/www/ontrack/backend/uploads/recordings

# Configurar permisos
sudo chown -R ubuntu:ubuntu /var/www/ontrack
sudo chmod -R 755 /var/www/ontrack

echo "✅ Estructura de directorios creada"
EOF

print_status "5. Clonando repositorios desde GitHub..."

# Clonar repositorios
ssh -i "$KEY" "$SERVER" << 'EOF'
echo "📥 Clonando repositorios..."

cd /var/www/ontrack

# Clonar frontend
git clone https://github.com/Juanes1203/OnTrack_Assistant.git frontend-temp
cp -r frontend-temp/* frontend/
rm -rf frontend-temp

# Clonar backend
git clone https://github.com/Juanes1203/ontrack-assistant-backend.git backend-temp
cp -r backend-temp/* backend/
rm -rf backend-temp

echo "✅ Repositorios clonados"
EOF

print_status "6. Configurando Backend..."

# Configurar backend
ssh -i "$KEY" "$SERVER" << 'EOF'
echo "⚙️ Configurando backend..."

cd /var/www/ontrack/backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cat > .env << 'ENV'
NODE_ENV=production
PORT=3001
DATABASE_URL="postgresql://ontrack_user:ontrack_secure_password_2024@localhost:5432/ontrack"
JWT_SECRET="ontrack_jwt_secret_2024_very_secure"
JWT_EXPIRES_IN=7d
STRAICO_API_KEY="your_straico_api_key_here"
CORS_ORIGIN="http://assistant.ontrack.global"
ENV

# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma db push

# Poblar con datos de prueba
npm run db:seed

echo "✅ Backend configurado"
EOF

print_status "7. Configurando Frontend..."

# Configurar frontend
ssh -i "$KEY" "$SERVER" << 'EOF'
echo "⚙️ Configurando frontend..."

cd /var/www/ontrack/frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cat > .env.production << 'ENV'
VITE_API_BASE_URL=http://assistant.ontrack.global/api
VITE_ELEVENLABS_AGENT_ID=your_elevenlabs_agent_id_here
ENV

# Build para producción
npm run build

echo "✅ Frontend configurado"
EOF

print_status "8. Configurando Nginx..."

# Configurar Nginx
ssh -i "$KEY" "$SERVER" << 'EOF'
echo "🌐 Configurando Nginx..."

# Crear configuración de Nginx
sudo tee /etc/nginx/sites-available/ontrack << 'NGINX'
server {
    listen 80;
    server_name assistant.ontrack.global;

    # Frontend
    location / {
        root /var/www/ontrack/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Archivos estáticos del backend
    location /uploads {
        alias /var/www/ontrack/backend/uploads;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
NGINX

# Habilitar sitio
sudo ln -sf /etc/nginx/sites-available/ontrack /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Verificar configuración
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx

echo "✅ Nginx configurado"
EOF

print_status "9. Configurando PM2..."

# Configurar PM2
ssh -i "$KEY" "$SERVER" << 'EOF'
echo "🔄 Configurando PM2..."

cd /var/www/ontrack/backend

# Crear configuración PM2
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
    },
    error_file: '/var/log/ontrack/error.log',
    out_file: '/var/log/ontrack/out.log',
    log_file: '/var/log/ontrack/combined.log',
    time: true
  }]
};
PM2

# Crear directorio de logs
sudo mkdir -p /var/log/ontrack
sudo chown ubuntu:ubuntu /var/log/ontrack

# Iniciar aplicación
pm2 start ecosystem.config.js
pm2 save
pm2 startup

echo "✅ PM2 configurado"
EOF

print_status "10. Configurando SSL con Let's Encrypt..."

# Configurar SSL
ssh -i "$KEY" "$SERVER" << 'EOF'
echo "🔒 Configurando SSL..."

# Instalar Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Obtener certificado SSL
sudo certbot --nginx -d assistant.ontrack.global --non-interactive --agree-tos --email admin@ontrack.global

# Configurar renovación automática
sudo crontab -l | { cat; echo "0 12 * * * /usr/bin/certbot renew --quiet"; } | sudo crontab -

echo "✅ SSL configurado"
EOF

print_status "11. Verificando deployment..."

# Verificar deployment
ssh -i "$KEY" "$SERVER" << 'EOF'
echo "🔍 Verificando deployment..."

# Verificar servicios
sudo systemctl status nginx
sudo systemctl status postgresql
pm2 status

# Verificar puertos
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443
sudo netstat -tlnp | grep :3001

echo "✅ Verificación completada"
EOF

print_success "🎉 Deployment completado exitosamente!"
print_success "🌐 Aplicación disponible en: https://assistant.ontrack.global"
print_success "📊 Backend API: https://assistant.ontrack.global/api"
print_success "📝 Logs: pm2 logs ontrack-backend"

echo ""
echo "🔧 Comandos útiles:"
echo "  - Ver logs: ssh -i $KEY $SERVER 'pm2 logs ontrack-backend'"
echo "  - Reiniciar: ssh -i $KEY $SERVER 'pm2 restart ontrack-backend'"
echo "  - Estado: ssh -i $KEY $SERVER 'pm2 status'"
echo "  - Nginx: ssh -i $KEY $SERVER 'sudo systemctl status nginx'"
