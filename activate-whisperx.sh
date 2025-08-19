#!/bin/bash
source whisperx-env/bin/activate
export PYTHONPATH="${PYTHONPATH}:$(pwd)/whisperx-env/lib/python3.*/site-packages"
echo "✅ Entorno WhisperX activado"
echo "Para usar WhisperX, ejecuta: whisperx --help"
