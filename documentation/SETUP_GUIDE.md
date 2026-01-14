# 🚀 Guide de Configuration - MongoDB Local + Cloudinary

## 📍 Étape 1 : Démarrer MongoDB en Local

MongoDB est déjà installé sur votre Mac ! Pour le démarrer :

```bash
# Option 1 : Démarrer MongoDB manuellement
mongod --dbpath ~/data/db

# Option 2 : Créer le dossier data si nécessaire
mkdir -p ~/data/db
mongod --dbpath ~/data/db
```

**MongoDB démarrera sur :** `mongodb://localhost:27017`

---

## 🔑 Étape 2 : Configurer Cloudinary

### Où trouver vos credentials Cloudinary ?

1. **Ouvrez votre navigateur** et allez sur : https://console.cloudinary.com/

2. **Connectez-vous** avec votre compte

3. **Sur le Dashboard**, vous verrez une section **"Account Details"** ou **"Product Environment Credentials"**

4. **Copiez ces 3 valeurs :**

```
Cloud Name:    votre_cloud_name
API Key:       123456789012345
API Secret:    abcdefghijklmnopqrstuvwxyz123
```

### Capture d'écran de référence :

![Cloudinary Dashboard Guide](file:///Users/keras/web_projects/univault/cloudinary-guide.png)

La section ressemble à ceci :
```
┌─────────────────────────────────────────┐
│  Product Environment Credentials        │
├─────────────────────────────────────────┤
│  Cloud name:    votre_cloud_name        │
│  API Key:       123456789012345         │
│  API Secret:    abc***********xyz       │
│                 [Show] [Copy]           │
└─────────────────────────────────────────┘
```

---

## ⚙️ Étape 3 : Mettre à jour le fichier .env

Ouvrez le fichier `/Users/keras/web_projects/univault/server/.env` et remplacez :

```env
CLOUDINARY_CLOUD_NAME=votre_cloud_name_ici
CLOUDINARY_API_KEY=votre_api_key_ici
CLOUDINARY_API_SECRET=votre_api_secret_ici
```

Par vos vraies valeurs depuis Cloudinary.

---

## ✅ Étape 4 : Vérifier la Configuration

### Terminal 1 - Démarrer MongoDB

```bash
# Créer le dossier de données si nécessaire
mkdir -p ~/data/db

# Démarrer MongoDB
mongod --dbpath ~/data/db
```

Vous devriez voir :
```
[initandlisten] waiting for connections on port 27017
```

### Terminal 2 - Démarrer le Backend

```bash
cd /Users/keras/web_projects/univault/server
npm run dev
```

Vous devriez voir :
```
✅ MongoDB connected :) => localhost:27017
🏛️  UniVault API Server
📡 Serveur démarré sur le port 5000
```

### Terminal 3 - Démarrer le Frontend

```bash
cd /Users/keras/web_projects/univault/client
npm run dev
```

Vous devriez voir :
```
VITE ready in XXX ms
➜  Local:   http://localhost:5173/
```

---

## 🎯 Résumé des Fichiers Modifiés

- ✅ `server/.env` - Configuré pour MongoDB local
- ✅ `server/.env.local` - Backup de la configuration
- ⏳ À faire : Ajouter vos credentials Cloudinary dans `server/.env`

---

## 🔍 Cloudinary - Où Cliquer Exactement

1. **Page d'accueil Cloudinary** : https://console.cloudinary.com/
2. **Menu de gauche** → Cliquez sur **"Dashboard"** (icône maison)
3. **En haut de la page**, vous verrez **"Product Environment Credentials"**
4. **Cliquez sur "Show"** à côté de "API Secret" pour révéler la valeur complète
5. **Copiez les 3 valeurs** dans votre fichier `.env`

---

## 💡 Astuce

Si vous ne voyez pas "Product Environment Credentials" :
- Cliquez sur l'icône ⚙️ (Settings) en haut à droite
- Allez dans **"Account"** → **"Security"**
- Vous y trouverez aussi vos credentials

---

## 🆘 Besoin d'Aide ?

Si vous avez des difficultés à trouver vos credentials Cloudinary, faites-moi signe et je vous guiderai étape par étape !
