#!/usr/bin/env bash

# Script de configuration pour le VPS - Déploiement du Portfolio
# Ce script doit être exécuté en tant que ROOT (ou avec sudo) sur votre VPS.
# Il va créer l'utilisateur restreint 'portfolio-deploy', configurer les clés SSH,
# et préparer le dossier de destination pour le site.

set -euo pipefail

# Couleurs pour l'affichage
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================================${NC}"
echo -e "${BLUE}   Configuration de l'utilisateur portfolio-deploy    ${NC}"
echo -e "${BLUE}======================================================${NC}"

# 1. Vérification des privilèges root
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}Erreur: Ce script doit être exécuté en tant que root ou avec sudo.${NC}"
  echo -e "Usage: sudo bash setup-vps-user.sh"
  exit 1
fi

USER_NAME="portfolio-deploy"
TARGET_DIR="/var/www/portfolio"

# 2. Création de l'utilisateur système restreint s'il n'existe pas
if id "$USER_NAME" &>/dev/null; then
  echo -e "${YELLOW}L'utilisateur '$USER_NAME' existe déjà. Passage à l'étape suivante.${NC}"
else
  echo -e "${GREEN}[+] Création de l'utilisateur restreint '$USER_NAME'...${NC}"
  # Crée l'utilisateur sans mot de passe et avec un shell bash standard
  useradd -m -s /bin/bash "$USER_NAME"
  # Désactive la connexion par mot de passe pour cet utilisateur (uniquement SSH par clé)
  passwd -l "$USER_NAME"
fi

# 3. Préparation du dossier de destination du site
echo -e "${GREEN}[+] Préparation du dossier de destination: $TARGET_DIR...${NC}"
mkdir -p "$TARGET_DIR"
chown -R "$USER_NAME":"$USER_NAME" "$TARGET_DIR"
chmod 755 "$TARGET_DIR"

# 4. Configuration de SSH pour portfolio-deploy
USER_HOME=$(eval echo "~$USER_NAME")
SSH_DIR="$USER_HOME/.ssh"

echo -e "${GREEN}[+] Configuration des accès SSH dans $SSH_DIR...${NC}"
mkdir -p "$SSH_DIR"

# Génération de la clé SSH ED25519 si elle n'existe pas déjà
PRIVATE_KEY_PATH="$SSH_DIR/id_ed25519"
PUBLIC_KEY_PATH="$PRIVATE_KEY_PATH.pub"

if [ -f "$PRIVATE_KEY_PATH" ]; then
  echo -e "${YELLOW}Une clé SSH existe déjà pour $USER_NAME. Nous allons l'utiliser.${NC}"
else
  echo -e "${GREEN}[+] Génération d'une nouvelle paire de clés SSH ED25519...${NC}"
  ssh-keygen -t ed25519 -C "github-actions-deploy" -f "$PRIVATE_KEY_PATH" -N ""
fi

# Ajout de la clé publique au fichier authorized_keys
touch "$SSH_DIR/authorized_keys"
if ! grep -qf "$PUBLIC_KEY_PATH" "$SSH_DIR/authorized_keys" 2>/dev/null; then
  cat "$PUBLIC_KEY_PATH" >> "$SSH_DIR/authorized_keys"
fi

# Ajustement des permissions impératives pour SSH
chown -R "$USER_NAME":"$USER_NAME" "$SSH_DIR"
chmod 700 "$SSH_DIR"
chmod 600 "$SSH_DIR/authorized_keys"

echo -e "${GREEN}[+] Configuration SSH terminée avec succès !${NC}"
echo -e "${BLUE}======================================================${NC}"
echo -e "${YELLOW}              ACTIONS REQUISES SUR GITHUB             ${NC}"
echo -e "${BLUE}======================================================${NC}"
echo -e "Veuillez copier la clé privée ci-dessous et l'ajouter en tant que"
echo -e "Secret GitHub sous le nom : ${GREEN}VPS_SSH_KEY${NC}"
echo -e "Dans : Votre dépôt > Settings > Secrets and variables > Actions > New repository secret\n"

echo -e "${RED}--- DEBUT DE LA CLÉ PRIVÉE SSH (À COPIER ENTIÈREMENT) ---${NC}"
cat "$PRIVATE_KEY_PATH"
echo -e "${RED}--- FIN DE LA CLÉ PRIVÉE SSH ---${NC}\n"

echo -e "Voici les valeurs pour les autres Secrets GitHub :"
echo -e "- ${BLUE}VPS_HOST${NC}        : L'IP publique de votre VPS"
echo -e "- ${BLUE}VPS_USERNAME${NC}    : ${GREEN}$USER_NAME${NC}"
echo -e "- ${BLUE}VPS_TARGET_DIR${NC}  : ${GREEN}$TARGET_DIR${NC}"
echo -e "${BLUE}======================================================${NC}"
echo -e "${GREEN}Configuration du VPS complétée avec succès !${NC}"
