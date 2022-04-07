#!/bin/bash
read_var() {
  if [ -z "$1" ]; then
    echo "environment variable name is required"
    return
  fi

  local ENV_FILE='.env'
  if [ ! -z "$2" ]; then
    ENV_FILE="$2"
  fi

  local VAR
  VAR=$(grep $1 "$ENV_FILE" | xargs)
  IFS="=" read -ra VAR <<< "$VAR"
  echo ${VAR[1]}
}

REDIS_PASSWORD=$(read_var REDIS_PASSWORD .env)
REDIS_PORT=$(read_var REDIS_PORT .env)

#iniciar servicios
echo "Iniciando instancia de REDIS..."
docker run -p 127.0.0.1:$REDIS_PORT:6379 -d -v redis_sanfrancisco:/data --name redis-sanfrancisco redis:5-alpine --appendonly yes --requirepass $REDIS_PASSWORD
REDIS_IP=`docker inspect -f "{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}" redis-sanfrancisco`
echo "REDIS_IP=$REDIS_IP"
