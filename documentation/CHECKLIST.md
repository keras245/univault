# ✅ Configuration UniVault - Checklist

## 📋 Étapes de Configuration

### ✅ 1. MongoDB Local
- [x] MongoDB installé (v7.0.23)
- [x] Fichier `.env` configuré avec `mongodb://localhost:27017/univault`
- [x] Script `start-mongodb.sh` créé
- [ ] **À FAIRE :** Démarrer MongoDB avec `./start-mongodb.sh`

### ⏳ 2. Cloudinary
- [ ] **À FAIRE :** Aller sur https://console.cloudinary.com/
- [ ] **À FAIRE :** Copier le **Cloud name**
- [ ] **À FAIRE :** Copier l'**API Key**
- [ ] **À FAIRE :** Copier l'**API Secret** (cliquer sur "Show")
- [ ] **À FAIRE :** Mettre à jour `server/.env` avec ces valeurs

### ✅ 3. Dépendances
- [x] Backend : `npm install` ✅ (137 packages)
- [x] Frontend : `npm install` ✅ (193 packages)

---

## 🎯 Prochaines Étapes

### Étape 1 : Configurer Cloudinary

**Fichier à modifier :** `server/.env`

```env
# Remplacez ces lignes :
CLOUDINARY_CLOUD_NAME=your_cloud_name_here    # ← Mettez votre Cloud name
CLOUDINARY_API_KEY=your_api_key_here          # ← Mettez votre API Key
CLOUDINARY_API_SECRET=your_api_secret_here    # ← Mettez votre API Secret
```

**📖 Guide détaillé :** [CLOUDINARY_GUIDE.md](file:///Users/keras/web_projects/univault/CLOUDINARY_GUIDE.md)

---

### Étape 2 : Démarrer l'Application

**Ouvrez 3 terminaux :**

#### Terminal 1 - MongoDB
```bash
cd /Users/keras/web_projects/univault
./start-mongodb.sh
```

Vous devriez voir :
```
✅ MongoDB connected :) => localhost:27017
```

#### Terminal 2 - Backend
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

#### Terminal 3 - Frontend
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

## 🌐 URLs de l'Application

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:5173 | Interface utilisateur |
| **Backend API** | http://localhost:5000 | API REST |
| **MongoDB** | mongodb://localhost:27017 | Base de données |

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [README.md](file:///Users/keras/web_projects/univault/README.md) | Documentation générale du projet |
| [SETUP_GUIDE.md](file:///Users/keras/web_projects/univault/SETUP_GUIDE.md) | Guide de configuration complet |
| [CLOUDINARY_GUIDE.md](file:///Users/keras/web_projects/univault/CLOUDINARY_GUIDE.md) | Guide Cloudinary détaillé |
| [server/README.md](file:///Users/keras/web_projects/univault/server/README.md) | Documentation API Backend |

---

## 🔧 Scripts Utiles

| Script | Commande | Description |
|--------|----------|-------------|
| Démarrer MongoDB | `./start-mongodb.sh` | Lance MongoDB en local |
| Guide de démarrage | `./start.sh` | Affiche les instructions |
| Backend dev | `cd server && npm run dev` | Lance le serveur backend |
| Frontend dev | `cd client && npm run dev` | Lance l'interface |

---

## ⚠️ Points Importants

### MongoDB
- ✅ Déjà configuré pour fonctionner en local
- ✅ Pas besoin de MongoDB Atlas pour le développement
- ✅ Les données seront stockées dans `~/data/db`

### Cloudinary
- ⏳ **REQUIS** : Vous devez configurer vos credentials
- 📍 Trouvez-les sur : https://console.cloudinary.com/
- 📝 Section : "Product Environment Credentials"

### Premier Utilisateur
- Une fois l'application démarrée, vous devrez créer un utilisateur admin
- Voir la section "Comptes par Défaut" dans le README

---

## 🎉 Une Fois Tout Configuré

Vous pourrez :
- ✅ Vous connecter sur http://localhost:5173
- ✅ Uploader des documents
- ✅ Gérer les utilisateurs
- ✅ Utiliser toutes les fonctionnalités

---

## 💡 Aide Rapide

**Problème avec MongoDB ?**
```bash
# Vérifier si MongoDB tourne
ps aux | grep mongod

# Arrêter MongoDB
killall mongod

# Redémarrer MongoDB
./start-mongodb.sh
```

**Problème avec Cloudinary ?**
- Vérifiez que vous avez bien copié les 3 valeurs
- Assurez-vous qu'il n'y a pas d'espaces avant/après
- Consultez [CLOUDINARY_GUIDE.md](file:///Users/keras/web_projects/univault/CLOUDINARY_GUIDE.md)

**Problème avec le Backend ?**
```bash
# Vérifier les logs
cd server
npm run dev

# Les erreurs s'afficheront dans le terminal
```

---

## 📞 Besoin d'Aide ?

Si vous rencontrez un problème, vérifiez :
1. MongoDB est bien démarré
2. Cloudinary est bien configuré dans `.env`
3. Les 3 terminaux sont bien ouverts
4. Aucune erreur dans les logs

**Tout est prêt ! Il ne reste plus qu'à configurer Cloudinary ! 🚀**
