# 🏛️ UniVault

**Système d'Archivage Numérique - Université Nongo Conakry (UNC)**

UniVault est une application web moderne et sécurisée permettant la gestion centralisée des documents administratifs et pédagogiques de l'Université Nongo Conakry.

![Status](https://img.shields.io/badge/status-en%20développement-yellow)
![License](https://img.shields.io/badge/license-ISC-blue)

## ✨ Fonctionnalités

### 🔐 Authentification et Sécurité
- Authentification JWT sécurisée
- Gestion des rôles (Super-Admin, Admin, User)
- Contrôle d'accès basé sur les services (RBAC)
- Audit logs complet de toutes les actions
- Rate limiting et protection contre les attaques

### 📁 Gestion des Documents
- Upload de documents (PDF, Word, Excel, Images)
- Stockage sécurisé sur Cloudinary
- Versionnement des documents
- Métadonnées personnalisées par service
- Recherche avancée multi-critères
- Prévisualisation des documents

### 🏫 Services Spécialisés

#### Scolarité
- Recherche d'étudiants par matricule
- Gestion des dossiers étudiants
- Documents: inscriptions, relevés de notes, diplômes, etc.

#### Comptabilité
- Gestion des ordres de virement
- Bons de commande et factures
- Archivage par période et bénéficiaire

#### Ressources Humaines
- États de salaire mensuels
- Gestion des courriers avec référencement automatique
- Suivi du statut (traité/non traité)
- Avances sur salaire

## 🚀 Technologies

### Backend
- **Node.js** + **Express.js** - Framework serveur
- **MongoDB** + **Mongoose** - Base de données NoSQL
- **JWT** - Authentification
- **Cloudinary** - Stockage de fichiers
- **Bcrypt** - Hashage des mots de passe
- **Multer** - Upload de fichiers

### Frontend
- **React 19** - Bibliothèque UI
- **Vite** + **SWC** - Build tool ultra-rapide
- **React Router** - Navigation
- **Zustand** - State management
- **React Query** - Gestion du cache et des requêtes
- **Axios** - Client HTTP
- **Lucide React** - Icônes modernes
- **React Hot Toast** - Notifications

## 📦 Installation

### Prérequis
- Node.js >= 18.x
- MongoDB Atlas account (ou MongoDB local)
- Compte Cloudinary

### 1. Cloner le repository

```bash
git clone <repository-url>
cd univault
```

### 2. Installation Backend

```bash
cd server
npm install
```

Configurez les variables d'environnement :

```bash
cp .env.example .env
```

Éditez `.env` avec vos configurations :
- MongoDB URI
- JWT Secret
- Cloudinary credentials

### 3. Installation Frontend

```bash
cd ../client
npm install
```

Configurez les variables d'environnement :

```bash
cp .env.example .env.local
```

## 🏃 Démarrage

### Mode Développement

Dans deux terminaux séparés :

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

Le serveur démarre sur `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

L'application démarre sur `http://localhost:5173`

### Mode Production

**Backend:**
```bash
cd server
npm start
```

**Frontend:**
```bash
cd client
npm run build
npm run preview
```

## 📁 Structure du Projet

```
univault/
├── server/                 # Backend Node.js
│   ├── config/            # Configuration (DB, etc.)
│   ├── controllers/       # Logique métier
│   ├── middleware/        # Middleware (auth, logs, etc.)
│   ├── models/            # Modèles MongoDB
│   ├── routes/            # Routes API
│   ├── utils/             # Utilitaires
│   ├── index.js           # Point d'entrée
│   └── package.json
│
├── client/                # Frontend React
│   ├── src/
│   │   ├── components/   # Composants réutilisables
│   │   ├── pages/        # Pages de l'application
│   │   ├── config/       # Configuration API
│   │   ├── store/        # State management (Zustand)
│   │   ├── App.jsx       # Composant principal
│   │   └── main.jsx      # Point d'entrée
│   ├── index.html
│   └── package.json
│
└── README.md
```

## 🔑 Comptes par Défaut

Après le premier déploiement, vous devrez créer un compte super-admin manuellement dans MongoDB ou via l'API.

**Format du compte:**
```json
{
  "email": "admin@unc.edu",
  "password": "password123",
  "firstName": "Admin",
  "lastName": "UNC",
  "service": "Administration",
  "role": "super-admin"
}
```

## 📚 Documentation API

La documentation complète de l'API est disponible dans `/server/README.md`

### Endpoints Principaux

- `POST /api/auth/login` - Connexion
- `GET /api/documents` - Liste des documents
- `POST /api/documents/upload` - Upload un document
- `GET /api/students/:matricule` - Recherche étudiant
- `GET /api/letters` - Liste des courriers RH
- `GET /api/search` - Recherche avancée

## 🎨 Design System

L'application utilise un design system moderne avec :
- **Thème sombre** élégant
- **Glassmorphism** pour les cartes
- **Gradients** dynamiques
- **Animations** fluides avec Framer Motion
- **Typographie** Inter (Google Fonts)
- **Icônes** Lucide React

## 🔒 Sécurité

- ✅ HTTPS obligatoire en production
- ✅ Helmet.js pour la sécurité HTTP
- ✅ CORS configuré strictement
- ✅ Rate limiting sur toutes les routes
- ✅ Validation stricte des inputs
- ✅ Hashage bcrypt des mots de passe
- ✅ Tokens JWT avec expiration
- ✅ Audit logs complet

## 🚀 Déploiement

### Frontend (Vercel)

```bash
cd client
npm run build
# Déployer le dossier dist/ sur Vercel
```

### 4. Configuration Cloudinary

**Où trouver vos credentials :**

1. Allez sur [Cloudinary Console](https://console.cloudinary.com/)
2. Connectez-vous avec votre compte
3. Sur le **Dashboard**, cherchez **"Product Environment Credentials"**
4. Vous y trouverez :
   - **Cloud Name** (ex: `dxxxxx`)
   - **API Key** (ex: `123456789012345`)
   - **API Secret** (cliquez sur "Show" pour voir la valeur complète)
5. Copiez ces 3 valeurs dans `server/.env` :

```env
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret
```

📖 **Guide détaillé** : Consultez [SETUP_GUIDE.md](file:///Users/keras/web_projects/univault/SETUP_GUIDE.md) pour des instructions avec captures d'écran.

### Backend (Render)

1. Créez un nouveau Web Service sur Render
2. Connectez votre repository
3. Configurez les variables d'environnement
4. Déployez !

## 📝 Roadmap

- [x] Phase 1: Backend infrastructure
- [x] Phase 2: API Core
- [x] Phase 3: Frontend base + Login
- [ ] Phase 4: Dashboard et gestion documents
- [ ] Phase 5: Modules spécifiques par service
- [ ] Phase 6: Tests et optimisation
- [ ] Phase 7: Déploiement production

## 🤝 Contribution

Ce projet est développé pour l'Université Nongo Conakry.

## 📄 Licence

ISC © 2026 Université Nongo Conakry

---

**Développé avec ❤️ pour l'UNC**


Email : admin@unc.edu
Mot de passe : password123
