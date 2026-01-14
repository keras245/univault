#!/bin/bash

# Couleurs pour l'affichage
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║   🏛️  UniVault - Démarrage MongoDB Local                ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Créer le dossier de données si nécessaire
DATA_DIR="$HOME/data/db"

if [ ! -d "$DATA_DIR" ]; then
    echo -e "${YELLOW}📁 Création du dossier de données MongoDB...${NC}"
    mkdir -p "$DATA_DIR"
    echo -e "${GREEN}✅ Dossier créé : $DATA_DIR${NC}"
fi

# Démarrer MongoDB
echo -e "${BLUE}🚀 Démarrage de MongoDB...${NC}"
echo -e "${YELLOW}📍 Port : 27017${NC}"
echo -e "${YELLOW}📂 Data : $DATA_DIR${NC}"
echo ""
echo -e "${GREEN}MongoDB est prêt ! Vous pouvez maintenant démarrer le serveur backend.${NC}"
echo ""

mongod --dbpath "$DATA_DIR"
