#!/bin/sh
set -e

echo "Cargando el dataset en Redis..."
node dist/loadDataset.js

echo "Iniciando la aplicación..."
node dist/index.js