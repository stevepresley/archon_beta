#!/bin/bash

# Check for flags
NO_CACHE_FLAG=""
SERVICES="archon-frontend"
MESSAGE="frontend only"

if [[ "$*" == *"--force"* ]]; then
    NO_CACHE_FLAG="--no-cache"
fi

if [[ "$*" == *"--all"* ]]; then
    SERVICES="archon-server archon-frontend"
    MESSAGE="both frontend and backend"
fi

echo "🔄 Rebuilding $MESSAGE..."

docker-compose down
docker-compose build $SERVICES $NO_CACHE_FLAG
docker-compose up archon-server archon-frontend -d

