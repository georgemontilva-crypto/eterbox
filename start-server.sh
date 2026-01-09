#!/bin/bash
# Script de inicio automático para Hostinger
# Este script se ejecuta después del build y mantiene el servidor corriendo

echo "Starting EterBox server..."
NODE_ENV=production node dist/index.js
