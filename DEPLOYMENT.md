# 🚀 Guía de Deployment - OnTrack Assistant

## 📋 Requisitos del Servidor

### **Sistema Operativo**
- Ubuntu 20.04 LTS o superior
- Mínimo 4GB RAM (recomendado 8GB)
- Mínimo 20GB espacio en disco
- Acceso a internet para descargar dependencias

### **Software Requerido**
- Node.js 18+ (LTS)
- PostgreSQL 13+
- Nginx (proxy reverso)
- PM2 (gestor de procesos)
- Git

## 🛠️ Instalación Paso a Paso

### **1. Preparar el Servidor**

```bash
# Actualizar el sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependencias básicas
sudo apt install -y curl wget git build-essential

# Instalar Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Instalar Nginx
sudo apt install -y nginx

# Instalar PM2 globalmente
sudo npm install -g pm2
```

### **2. Configurar PostgreSQL**

```bash
# Cambiar a usuario postgres
sudo -u postgres psql

# Crear base de datos y usuario
CREATE DATABASE ontrack_db;
CREATE USER ontrack_user WITH PASSWORD 'tu_password_seguro';
GRANT ALL PRIVILEGES ON DATABASE ontrack_db TO ontrack_user;
\q
```

### **3. Clonar Repositorios**

```bash
# Crear directorio para la aplicación
sudo mkdir -p /var/www/ontrack
sudo chown $USER:$USER /var/www/ontrack
cd /var/www/ontrack

# Clonar repositorios
git clone https://github.com/tu-usuario/OnTrack_Assistant.git frontend
git clone https://github.com/tu-usuario/OnTrack_Backend.git backend
```

### **4. Configurar Backend**

```bash
cd /var/www/ontrack/backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp env.example .env
nano .env
```

**Configuración del archivo `.env`:**
```env
NODE_ENV=production
PORT=3001
DATABASE_URL="postgresql://ontrack_user:tu_password_seguro@localhost:5432/ontrack_db"
JWT_SECRET="tu_jwt_secret_muy_seguro"
JWT_EXPIRES_IN="7d"
STRAICO_API_KEY="tu_straico_api_key"
```

```bash
# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma db push

# Poblar base de datos (opcional)
npx prisma db seed

# Probar la aplicación
npm run build
npm start
```

### **5. Configurar Frontend**

```bash
cd /var/www/ontrack/frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp env.example .env.production
nano .env.production
```

**Configuración del archivo `.env.production`:**
```env
VITE_API_BASE_URL=https://tu-dominio.com/api
VITE_ELEVENLABS_AGENT_ID=tu_elevenlabs_agent_id
```

```bash
# Construir para producción
npm run build

# Probar la construcción
npm run preview
```

### **6. Configurar PM2**

```bash
# Crear archivo de configuración PM2
nano /var/www/ontrack/ecosystem.config.js
```

**Contenido del archivo `ecosystem.config.js`:**
```javascript
module.exports = {
  apps: [
    {
      name: 'ontrack-backend',
      cwd: '/var/www/ontrack/backend',
      script: 'dist/index.js',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      error_file: '/var/log/pm2/ontrack-backend-error.log',
      out_file: '/var/log/pm2/ontrack-backend-out.log',
      log_file: '/var/log/pm2/ontrack-backend.log'
    }
  ]
};
```

```bash
# Iniciar aplicación con PM2
pm2 start /var/www/ontrack/ecosystem.config.js

# Configurar PM2 para iniciar automáticamente
pm2 startup
pm2 save
```

### **7. Configurar Nginx**

```bash
# Crear configuración de Nginx
sudo nano /etc/nginx/sites-available/ontrack
```

**Contenido del archivo de configuración:**
```nginx
server {
    listen 80;
    server_name tu-dominio.com www.tu-dominio.com;

    # Frontend (React)
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

    # Archivos estáticos
    location /static {
        alias /var/www/ontrack/frontend/dist;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Habilitar sitio
sudo ln -s /etc/nginx/sites-available/ontrack /etc/nginx/sites-enabled/

# Probar configuración
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

### **8. Configurar SSL (Opcional pero Recomendado)**

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtener certificado SSL
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com

# Configurar renovación automática
sudo crontab -e
# Agregar: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🔧 Comandos de Mantenimiento

### **Reiniciar Servicios**
```bash
# Reiniciar backend
pm2 restart ontrack-backend

# Reiniciar Nginx
sudo systemctl restart nginx

# Reiniciar PostgreSQL
sudo systemctl restart postgresql
```

### **Ver Logs**
```bash
# Logs de PM2
pm2 logs ontrack-backend

# Logs de Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### **Actualizar Aplicación**
```bash
# Backend
cd /var/www/ontrack/backend
git pull origin main
npm install
npm run build
pm2 restart ontrack-backend

# Frontend
cd /var/www/ontrack/frontend
git pull origin main
npm install
npm run build
sudo systemctl reload nginx
```

## 🔒 Consideraciones de Seguridad

### **Firewall**
```bash
# Configurar UFW
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### **Base de Datos**
- Cambiar contraseñas por defecto
- Configurar backup automático
- Restringir acceso por IP

### **Aplicación**
- Usar variables de entorno para secretos
- Configurar rate limiting
- Implementar logging de seguridad

## 📊 Monitoreo

### **PM2 Monitoring**
```bash
# Dashboard de PM2
pm2 monit

# Estado de procesos
pm2 status
```

### **Logs del Sistema**
```bash
# Ver logs del sistema
sudo journalctl -u nginx
sudo journalctl -u postgresql
```

## 🆘 Solución de Problemas

### **Backend no inicia**
1. Verificar logs: `pm2 logs ontrack-backend`
2. Verificar variables de entorno
3. Verificar conexión a base de datos

### **Frontend no carga**
1. Verificar que Nginx esté corriendo
2. Verificar configuración de Nginx
3. Verificar que los archivos estén en `/var/www/ontrack/frontend/dist`

### **Base de datos no conecta**
1. Verificar que PostgreSQL esté corriendo
2. Verificar credenciales en `.env`
3. Verificar que la base de datos exista

## 📞 Soporte

Para problemas específicos, revisar:
1. Logs de la aplicación
2. Logs del sistema
3. Estado de los servicios
4. Configuración de red

---

**Nota**: Esta guía asume un servidor Ubuntu limpio. Ajusta los comandos según tu configuración específica.
