#!/usr/bin/env bash
echo "[INFO] [ Analytic parameter -> ]"
# Environment parameters with $1
if [[ "$1" == "dev" ]]; then
  ENV="dev"
  SUFFIX="-dev"
elif [[ "$1" == "pre" ]]; then
  ENV="pre"
  SUFFIX="-pre"
elif [[ "$1" == "prod" ]]; then
  ENV="prod"
  SUFFIX=""
else
  ENV="dev"
  SUFFIX="-dev"
fi

# Console debug parameters with $2   
if [[ "$2" == "false" ]]; then
  DISABLE_CONSOLE=false
else
  DISABLE_CONSOLE=true
fi

echo "[INFO] [ Environment : $ENV ]"
echo "[INFO] [ DISABLE_CONSOLE : $DISABLE_CONSOLE ]"

#build
rm -rf dist
mkdir -p dist
npm install
npm run build:$ENV


echo "[INFO] [ Build successful -> [ environment : $ENV ] [ console_disabled : $DISABLE_CONSOLE ] [ version : $VERSION ] ]"
