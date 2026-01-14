# 🔑 Guide Cloudinary - Où Trouver Vos Credentials

## 📍 Étapes Simples

### 1. Ouvrir Cloudinary

Allez sur : **https://console.cloudinary.com/**

### 2. Se Connecter

Connectez-vous avec votre compte Cloudinary existant.

### 3. Trouver les Credentials

Une fois connecté, vous arrivez sur le **Dashboard**. Cherchez la section **"Product Environment Credentials"**.

![Cloudinary Dashboard](file:///Users/keras/web_projects/univault/cloudinary-guide.png)

### 4. Copier les 3 Valeurs

Vous verrez 3 informations importantes :

| Champ | Exemple | Description |
|-------|---------|-------------|
| **Cloud name** | `democloud123` | Votre identifiant Cloudinary |
| **API Key** | `123456789012345` | Clé publique |
| **API Secret** | `abc***********xyz` | Clé secrète (cliquez sur "Show") |

### 5. Mettre à Jour le Fichier .env

Ouvrez le fichier : `/Users/keras/web_projects/univault/server/.env`

Remplacez ces lignes :

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

Par vos vraies valeurs, par exemple :

```env
CLOUDINARY_CLOUD_NAME=democloud123
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123
```

---

## 🔍 Où Cliquer Exactement ?

### Option 1 : Dashboard (Recommandé)

1. **Menu de gauche** → Cliquez sur **"Dashboard"** (icône maison 🏠)
2. **En haut de la page**, section **"Product Environment Credentials"**
3. Les 3 valeurs sont affichées directement

### Option 2 : Settings

1. **Cliquez sur l'icône ⚙️** (Settings) en haut à droite
2. **Menu de gauche** → **"Account"**
3. **Onglet "Security"** ou **"API Keys"**
4. Vous y trouverez aussi vos credentials

---

## 💡 Astuces

### Pour révéler l'API Secret

L'API Secret est masqué par défaut (`abc***********xyz`).

**Pour le voir en entier :**
- Cliquez sur le bouton **"Show"** 👁️ à côté de l'API Secret
- Ou cliquez sur **"Copy"** 📋 pour le copier directement

### Vérifier que ça fonctionne

Une fois configuré, démarrez le backend :

```bash
cd /Users/keras/web_projects/univault/server
npm run dev
```

Si Cloudinary est bien configuré, vous ne verrez **aucune erreur** au démarrage.

---

## ❓ Problèmes Courants

### "Invalid cloud_name"
→ Vérifiez que vous avez bien copié le **Cloud name** (sans espaces)

### "Invalid API key"
→ Vérifiez que vous avez bien copié l'**API Key** (chiffres uniquement)

### "Invalid API secret"
→ Assurez-vous d'avoir cliqué sur "Show" pour révéler la valeur complète

---

## 📞 Besoin d'Aide ?

Si vous ne trouvez pas vos credentials :

1. Vérifiez que vous êtes bien connecté à Cloudinary
2. Essayez de rafraîchir la page
3. Essayez l'Option 2 (Settings → Account → Security)
4. Contactez le support Cloudinary si nécessaire

---

## ✅ Une Fois Configuré

Après avoir mis à jour le fichier `.env`, vous êtes prêt !

**Prochaines étapes :**

```bash
# Terminal 1 - MongoDB
./start-mongodb.sh

# Terminal 2 - Backend
cd server
npm run dev

# Terminal 3 - Frontend
cd client
npm run dev
```

🎉 **Votre application sera accessible sur http://localhost:5173**
