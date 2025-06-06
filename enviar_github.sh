#!/bin/bash

# Configurações
REPO_URL="https://github.com/developeragencia/visaomaisalex.git"
BRANCH="main"

# Inicializa o repositório git se não existir
git rev-parse --is-inside-work-tree 2>/dev/null
if [ $? -ne 0 ]; then
  git init
fi

# Adiciona todos os arquivos e faz commit
git add .
git commit -m "Deploy inicial para o GitHub" || echo "Nada novo para commitar."

git branch -M $BRANCH

git remote | grep origin >/dev/null 2>&1
if [ $? -ne 0 ]; then
  git remote add origin "$REPO_URL"
else
  git remote set-url origin "$REPO_URL"
fi

# Envia para o GitHub
git push -u origin $BRANCH

echo "Projeto enviado para o GitHub com sucesso!" 