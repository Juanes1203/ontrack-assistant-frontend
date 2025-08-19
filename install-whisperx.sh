#!/bin/bash

# Script de instalación de WhisperX para MentorAI
# Este script instala WhisperX y todas sus dependencias

set -e  # Salir si hay algún error

echo "🚀 Instalando WhisperX para MentorAI..."
echo "======================================"

# Verificar si Python está instalado
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 no está instalado. Por favor, instala Python 3.8 o superior."
    exit 1
fi

PYTHON_VERSION=$(python3 --version | cut -d' ' -f2 | cut -d'.' -f1,2)
echo "✅ Python $PYTHON_VERSION detectado"

# Verificar si pip está instalado
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 no está instalado. Por favor, instala pip."
    exit 1
fi

echo "✅ pip3 detectado"

# Actualizar pip
echo "📦 Actualizando pip..."
python3 -m pip install --upgrade pip

# Instalar dependencias del sistema (Ubuntu/Debian)
if command -v apt-get &> /dev/null; then
    echo "📦 Instalando dependencias del sistema..."
    sudo apt-get update
    sudo apt-get install -y \
        ffmpeg \
        git \
        build-essential \
        python3-dev \
        libffi-dev \
        libssl-dev
elif command -v brew &> /dev/null; then
    echo "📦 Instalando dependencias del sistema (macOS)..."
    brew install ffmpeg git
else
    echo "⚠️  No se detectó apt-get ni brew. Asegúrate de tener ffmpeg instalado."
fi

# Crear entorno virtual (opcional pero recomendado)
echo "🐍 Creando entorno virtual..."
python3 -m venv whisperx-env
source whisperx-env/bin/activate

# Instalar PyTorch (CPU o GPU)
echo "🔥 Instalando PyTorch..."
if command -v nvidia-smi &> /dev/null; then
    echo "🎮 GPU detectada, instalando PyTorch con soporte CUDA..."
    pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
else
    echo "💻 Instalando PyTorch para CPU..."
    pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
fi

# Instalar WhisperX
echo "🎤 Instalando WhisperX..."
pip3 install git+https://github.com/m-bain/whisperX.git

# Instalar dependencias adicionales
echo "📚 Instalando dependencias adicionales..."
pip3 install \
    transformers \
    accelerate \
    sentencepiece \
    pyannote.audio \
    torch-audio

# Verificar instalación
echo "🔍 Verificando instalación..."
if python3 -c "import whisperx; print('✅ WhisperX instalado correctamente')" 2>/dev/null; then
    echo "✅ Verificación exitosa"
else
    echo "❌ Error en la verificación de WhisperX"
    exit 1
fi

# Crear script de activación
echo "📝 Creando script de activación..."
cat > activate-whisperx.sh << 'EOF'
#!/bin/bash
# Script para activar el entorno de WhisperX
source whisperx-env/bin/activate
export PYTHONPATH="${PYTHONPATH}:$(pwd)/whisperx-env/lib/python3.*/site-packages"
echo "✅ Entorno WhisperX activado"
echo "Para usar WhisperX, ejecuta: whisperx --help"
EOF

chmod +x activate-whisperx.sh

# Configurar variables de entorno
echo "⚙️  Configurando variables de entorno..."
if [ ! -f .env ]; then
    cat > .env << EOF
# WhisperX Configuration
WHISPERX_PATH=whisperx
PYTHON_PATH=python3
WHISPERX_ENV_PATH=$(pwd)/whisperx-env/bin/python3
EOF
    echo "✅ Archivo .env creado"
else
    echo "⚠️  Archivo .env ya existe, no se sobrescribió"
fi

echo ""
echo "🎉 ¡Instalación completada!"
echo "=========================="
echo ""
echo "Para usar WhisperX:"
echo "1. Activa el entorno: source activate-whisperx.sh"
echo "2. Prueba la instalación: whisperx --help"
echo "3. Ejecuta el backend: npm run dev (en la carpeta backend)"
echo ""
echo "📝 Notas importantes:"
echo "• WhisperX requiere archivos de audio en formatos comunes (WAV, MP3, etc.)"
echo "• El primer uso descargará automáticamente los modelos necesarios"
echo "• Para diarización, necesitarás un token de Hugging Face (opcional)"
echo ""
echo "🔗 Recursos útiles:"
echo "• Documentación: https://github.com/m-bain/whisperX"
echo "• Modelos disponibles: https://huggingface.co/openai/whisper-large-v2"
echo "" 