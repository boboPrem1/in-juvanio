#!/usr/bin/env bash

# Script de configuration Nginx et SSL pour le VPS
# Ce script doit être exécuté en tant que ROOT (ou avec sudo) sur votre VPS.
# Il va installer Nginx, Certbot, copier le fichier de configuration et activer le SSL.

set -euo pipefail

# Couleurs pour l'affichage
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================================${NC}"
echo -e "   Configuration Nginx & SSL pour in-juv-folio.duckdns.org   "
echo -e "${BLUE}======================================================${NC}"

# 1. Vérification des privilèges root
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}Erreur: Ce script doit être exécuté en tant que root ou avec sudo.${NC}"
  echo -e "Usage: sudo bash setup-nginx.sh"
  exit 1
fi

DOMAIN="in-juv-folio.duckdns.org"
CONF_FILE="/etc/nginx/sites-available/$DOMAIN"
ENABLED_LINK="/etc/nginx/sites-enabled/$DOMAIN"

# 2. Mise à jour système et installation de Nginx + Certbot
echo -e "${GREEN}[+] Mise à jour des paquets et installation de Nginx et Certbot...${NC}"
apt-get update

# Installe Nginx, Certbot et le plugin Nginx de Certbot (Debian/Ubuntu)
apt-get install -y nginx certbot python3-certbot-nginx

# 3. Écriture du fichier de configuration Nginx
echo -e "${GREEN}[+] Configuration du serveur bloc pour $DOMAIN...${NC}"

cat << 'EOF' > "$CONF_FILE"
server {
    listen 80;
    listen [::]:80;
    server_name in-juv-folio.duckdns.org;

    root /var/www/portfolio;
    index index.html;

    # Prise en charge du routage React / SPA (Vite)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gestion optimale du cache pour les assets compilés (Vite utilise des hashs uniques)
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }

    # Compression gzip pour accélérer le chargement
    gzip on;
    gzip_vary on;
    gzip_min_length 10240;
    gzip_proxied any;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/x-javascript application/xml;
    gzip_disable "MSIE [1-6]\.";
}
EOF

# 4. Activation de la configuration (lien symbolique)
if [ ! -L "$ENABLED_LINK" ]; then
  echo -e "${GREEN}[+] Activation du serveur block Nginx...${NC}"
  ln -s "$CONF_FILE" "$ENABLED_LINK"
fi

# Supprimer la configuration par défaut de nginx si elle existe pour éviter les conflits (optionnel)
if [ -f "/etc/nginx/sites-enabled/default" ]; then
  echo -e "${YELLOW}[!] Désactivation du site Nginx par défaut...${NC}"
  rm -f "/etc/nginx/sites-enabled/default"
fi

# 5. Validation de la configuration Nginx
echo -e "${GREEN}[+] Test de la syntaxe Nginx...${NC}"
nginx -t

# 6. Redémarrage de Nginx
echo -e "${GREEN}[+] Redémarrage de Nginx...${NC}"
systemctl restart nginx

# 7. Génération et installation du certificat SSL Let's Encrypt via Certbot
echo -e "${BLUE}======================================================${NC}"
echo -e "${YELLOW}           INSTALLATION DU CERTIFICAT SSL (Certbot)   ${NC}"
echo -e "${BLUE}======================================================${NC}"
echo -e "Certbot va générer le certificat SSL Let's Encrypt gratuit pour ${GREEN}$DOMAIN${NC}"
echo -e "et configurer automatiquement la redirection HTTP -> HTTPS dans Nginx.\n"

certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos --register-unsafely-without-email

# 8. Test et redémarrage final de Nginx
echo -e "${GREEN}[+] Test et application finale de la configuration SSL...${NC}"
nginx -t
systemctl reload nginx

echo -e "${BLUE}======================================================${NC}"
echo -e "${GREEN}Félicitations ! Votre site est disponible de manière sécurisée sur :${NC}"
echo -e "${BLUE}https://$DOMAIN${NC}"
echo -e "${BLUE}======================================================${NC}"
