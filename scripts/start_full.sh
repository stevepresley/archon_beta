#!/bin/bash

# Loop until docker info succeeds (daemon is running)
while ! docker info > /dev/null 2>&1; do  #
  echo "Docker daemon is NOT running. Sleeping for 30 seconds and retrying..." #
  sleep 30  #
done

echo "Docker daemon IS running. Starting docker-compose..."
docker-compose up --build -d  #
