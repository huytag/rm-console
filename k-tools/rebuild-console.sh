#!/usr/bin/env bash
# =============================================================================
# Rebuild and Start RM Console Container
# =============================================================================
set -euo pipefail

CONSOLE_DIR="/home/cesit/rm-console"
CONTAINER_NAME="rm-console-app"

echo "Checking if console directory exists..."
if [ ! -d "${CONSOLE_DIR}" ]; then
    echo "Error: Console directory not found at ${CONSOLE_DIR}"
    exit 1
fi

echo "Stopping running console services..."
podman-compose -f "${CONSOLE_DIR}/podman-compose.yaml" down || true
podman rm -f "${CONTAINER_NAME}" || true

echo "Rebuilding and starting console services..."
podman-compose -f "${CONSOLE_DIR}/podman-compose.yaml" up -d --build --remove-orphans

echo "RM Console successfully rebuilt and restarted!"
