# UniVault Server

Backend API pour le système d'archivage numérique de l'Université Nongo Conakry.

## 🚀 Technologies

- **Node.js** + **Express.js** - Framework backend
- **MongoDB** + **Mongoose** - Base de données
- **JWT** - Authentification
- **Cloudinary** - Stockage de fichiers
- **Bcrypt** - Hashage des mots de passe
- **Multer** - Upload de fichiers

## 📋 Prérequis

- Node.js >= 18.x
- MongoDB Atlas account (ou MongoDB local)
- Compte Cloudinary

## ⚙️ Configuration

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer les variables d'environnement

Copiez `.env.example` vers `.env` et configurez les variables :

```bash
cp .env.example .env
```

Modifiez le fichier `.env` avec vos configurations :

```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/univault

# JWT Secret (générez une clé aléatoire sécurisée)
JWT_SECRET=votre_cle_secrete_tres_longue_et_aleatoire

# Cloudinary (depuis votre dashboard Cloudinary)
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret
```

### 3. Configuration MongoDB Atlas

1. Créez un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créez un nouveau cluster (gratuit)
3. Créez un utilisateur de base de données
4. Autorisez votre IP (ou 0.0.0.0/0 pour tous)
5. Récupérez votre connection string

### 4. Configuration Cloudinary

1. Créez un compte sur [Cloudinary](https://cloudinary.com/)
2. Récupérez vos credentials depuis le dashboard
3. Ajoutez-les dans le fichier `.env`

## 🏃 Démarrage

### Mode développement (avec auto-reload)

```bash
npm run dev
```

### Mode production

```bash
npm start
```

Le serveur démarre sur `http://localhost:5000`

## 📚 API Endpoints

### Authentification

- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Créer un utilisateur (admin)
- `GET /api/auth/me` - Profil utilisateur
- `PUT /api/auth/change-password` - Changer mot de passe
- `POST /api/auth/logout` - Déconnexion

### Documents

- `POST /api/documents/upload` - Upload un document
- `GET /api/documents` - Liste des documents (avec filtres)
- `GET /api/documents/:id` - Détails d'un document
- `PUT /api/documents/:id` - Mettre à jour un document
- `DELETE /api/documents/:id` - Supprimer un document
- `POST /api/documents/:id/version` - Ajouter une version

### Scolarité

- `GET /api/students/:matricule` - Rechercher un étudiant
- `GET /api/students/:matricule/documents` - Documents d'un étudiant

### RH - Courriers

- `POST /api/letters` - Créer un courrier
- `GET /api/letters` - Liste des courriers
- `GET /api/letters/pending` - Courriers en attente
- `GET /api/letters/:reference` - Courrier par référence
- `PUT /api/letters/:id/process` - Marquer comme traité

### Recherche

- `GET /api/search` - Recherche avancée
- `GET /api/search/suggestions` - Auto-complétion

## 🔐 Sécurité

- **Helmet** - Protection des headers HTTP
- **CORS** - Configuration stricte
- **Rate Limiting** - Protection contre les attaques
- **JWT** - Authentification sécurisée
- **Bcrypt** - Hashage des mots de passe
- **Validation** - Validation stricte des inputs
- **Audit Logs** - Traçabilité complète

## 👥 Rôles et Permissions

### Super-Admin
- Accès total à tous les services
- Gestion des utilisateurs
- Accès à tous les documents

### Admin
- Accès à son service
- Gestion des documents de son service
- Création d'utilisateurs

### User
- Accès en lecture/écriture à son service
- Upload et gestion de ses documents

## 📁 Structure du Projet

```
server/
├── config/
│   └── database.js          # Configuration MongoDB
├── controllers/
│   ├── authController.js    # Logique authentification
│   ├── documentController.js # Logique documents
│   ├── studentController.js  # Logique scolarité
│   ├── letterController.js   # Logique courriers RH
│   └── searchController.js   # Logique recherche
├── middleware/
│   ├── auth.js              # Authentification JWT
│   ├── authorize.js         # Autorisation RBAC
│   ├── auditLog.js          # Logging automatique
│   ├── upload.js            # Configuration Multer
│   └── rateLimiter.js       # Rate limiting
├── models/
│   ├── User.js              # Modèle utilisateur
│   ├── Document.js          # Modèle document
│   ├── AuditLog.js          # Modèle logs
│   └── Letter.js            # Modèle courrier
├── routes/
│   ├── auth.js              # Routes auth
│   ├── documents.js         # Routes documents
│   ├── students.js          # Routes scolarité
│   ├── letters.js           # Routes courriers
│   └── search.js            # Routes recherche
├── utils/
│   └── cloudinary.js        # Utilitaires Cloudinary
├── uploads/
│   └── temp/                # Fichiers temporaires
├── .env                     # Variables d'environnement
├── .env.example             # Template .env
├── index.js                 # Point d'entrée
└── package.json
```

## 🧪 Tests

Pour tester l'API, vous pouvez utiliser :

- **Postman** - [Collection disponible]
- **Thunder Client** (VS Code extension)
- **curl**

Exemple de test de connexion :

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@unc.edu","password":"password123"}'
```

## 📝 Logs

Les logs sont affichés dans la console :
- Mode développement : logs détaillés (morgan 'dev')
- Mode production : logs combinés (morgan 'combined')

## 🚨 Gestion des Erreurs

Toutes les erreurs sont capturées et retournées au format :

```json
{
  "success": false,
  "message": "Description de l'erreur"
}
```

## 📦 Déploiement

### Render

1. Créez un compte sur [Render](https://render.com)
2. Créez un nouveau Web Service
3. Connectez votre repository GitHub
4. Configurez les variables d'environnement
5. Déployez !

### Variables d'environnement à configurer sur Render

- `MONGODB_URI`
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLIENT_URL` (URL de votre frontend Vercel)
- `NODE_ENV=production`

## 🤝 Contribution

Ce projet est développé pour l'Université Nongo Conakry.

## 📄 Licence

ISC
