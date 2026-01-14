#!/bin/bash

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║   🏛️  UniVault - Guide de Démarrage Rapide              ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Vérifier si .env existe
if [ ! -f "server/.env" ]; then
    echo -e "${RED}❌ Fichier server/.env non trouvé !${NC}"
    echo -e "${YELLOW}📝 Création du fichier .env...${NC}"
    cp server/.env.local server/.env
    echo -e "${GREEN}✅ Fichier .env créé !${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  IMPORTANT : Vous devez configurer Cloudinary !${NC}"
    echo -e "${YELLOW}   Ouvrez server/.env et ajoutez vos credentials Cloudinary${NC}"
    echo ""
    echo -e "${BLUE}📖 Consultez SETUP_GUIDE.md pour savoir où trouver vos credentials${NC}"
    echo ""
    read -p "Appuyez sur Entrée une fois que vous avez configuré Cloudinary..."
fi

echo ""
echo -e "${BLUE}📋 Pour démarrer UniVault, vous avez besoin de 3 terminaux :${NC}"
echo ""

echo -e "${YELLOW}Terminal 1 - MongoDB${NC}"
echo -e "${GREEN}cd $(pwd)${NC}"
echo -e "${GREEN}./start-mongodb.sh${NC}"
echo ""

echo -e "${YELLOW}Terminal 2 - Backend (API)${NC}"
echo -e "${GREEN}cd $(pwd)/server${NC}"
echo -e "${GREEN}npm run dev${NC}"
echo ""

echo -e "${YELLOW}Terminal 3 - Frontend (Interface)${NC}"
echo -e "${GREEN}cd $(pwd)/client${NC}"
echo -e "${GREEN}npm run dev${NC}"
echo ""

echo -e "${BLUE}🌐 URLs une fois démarré :${NC}"
echo -e "   Backend API:  ${GREEN}http://localhost:5000${NC}"
echo -e "   Frontend:     ${GREEN}http://localhost:5173${NC}"
echo ""

echo -e "${BLUE}📖 Documentation complète :${NC}"
echo -e "   README:       ${GREEN}$(pwd)/README.md${NC}"
echo -e "   Setup Guide:  ${GREEN}$(pwd)/SETUP_GUIDE.md${NC}"
echo ""

echo -e "${YELLOW}💡 Astuce : Ouvrez 3 onglets dans votre terminal et exécutez les commandes ci-dessus${NC}"
echo ""
