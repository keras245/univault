# 🧪 Guide de Test - Gestion des Utilisateurs

## 📋 Prérequis

Avant de commencer les tests, assurez-vous que :

1. ✅ **MongoDB** est démarré (`./start-mongodb.sh`)
2. ✅ **Backend** tourne sur le port 5000 (`cd server && npm run dev`)
3. ✅ **Frontend** tourne sur le port 5173 (`cd client && npm run dev`)
4. ✅ Vous avez un compte super-admin : `admin@unc.edu` / `password123`

---

## 🎯 Scénarios de Test

### 1️⃣ Test de Connexion

**Étapes :**
1. Ouvrez http://localhost:5173/login
2. Connectez-vous avec :
   - Email : `admin@unc.edu`
   - Mot de passe : `password123`

**Résultat attendu :**
- ✅ Redirection vers `/dashboard`
- ✅ Message de bienvenue avec votre nom
- ✅ Sidebar visible avec navigation

---

### 2️⃣ Test du Dashboard

**Étapes :**
1. Vérifiez que vous êtes sur `/dashboard`
2. Observez les éléments suivants :

**Résultat attendu :**
- ✅ Horloge en temps réel en haut à droite
- ✅ 4 cartes d'actions rapides (Nouveau Document, Gérer Utilisateurs, etc.)
- ✅ 4 cartes de statistiques (Documents, Utilisateurs, Espace, En Attente)
- ✅ Graphique d'activité d'upload (7 derniers jours)
- ✅ Graphique de répartition du stockage (Pie chart)

---

### 3️⃣ Test de la Navigation vers Management

**Étapes :**
1. Dans la sidebar, cliquez sur **"Gestion"** (icône Users)
2. Vous devriez être redirigé vers `/management`

**Résultat attendu :**
- ✅ Page "Gestion des utilisateurs" s'affiche
- ✅ Bannière bleue/violette avec statistiques (Total: 50, +8%)
- ✅ Barre de recherche fonctionnelle
- ✅ 3 onglets : Utilisateurs, Administrateurs, Services

---

### 4️⃣ Test de l'Onglet Administrateurs

**Étapes :**
1. Sur `/management`, cliquez sur l'onglet **"Administrateurs"**
2. Vérifiez le contenu

**Résultat attendu :**
- ✅ Votre compte admin s'affiche dans la liste
- ✅ 4 cartes de statistiques (Total, Actifs, Super-Admins, Ce mois)
- ✅ Boutons "Grille" / "Tableau" pour changer la vue
- ✅ Bouton "Nouvel administrateur" (affiche "Fonctionnalité à venir")

**Détails de la carte admin :**
- ✅ Avatar avec initiales (ex: "AC" pour Admin Conakry)
- ✅ Nom complet
- ✅ Email
- ✅ Service
- ✅ Badge "Actif" (vert)
- ✅ Boutons Modifier (bleu) et Supprimer (rouge)

---

### 5️⃣ Test de l'Onglet Utilisateurs

**Étapes :**
1. Cliquez sur l'onglet **"Utilisateurs"**

**Résultat attendu :**
- ✅ Message "Aucun utilisateur trouvé" (car seul le super-admin existe pour l'instant)
- ✅ Bouton "Ajouter un utilisateur"
- ✅ Statistiques affichent 0 utilisateurs

---

### 6️⃣ Test de la Recherche

**Étapes :**
1. Retournez sur l'onglet **"Administrateurs"**
2. Dans la barre de recherche, tapez votre nom ou email

**Résultat attendu :**
- ✅ La liste se filtre en temps réel
- ✅ Seuls les résultats correspondants s'affichent

---

### 7️⃣ Test du Changement de Vue

**Étapes :**
1. Cliquez sur le bouton **"Tableau"**

**Résultat attendu :**
- ✅ La vue passe de grille à tableau
- ✅ Les données sont affichées dans un tableau avec colonnes :
  - Utilisateur (avec avatar)
  - Contact (email)
  - Service
  - Statut
  - Actions

---

### 8️⃣ Test de la Suppression (⚠️ Attention)

**Étapes :**
1. Cliquez sur le bouton **Supprimer** (icône poubelle rouge)
2. Une confirmation apparaît

**Résultat attendu :**
- ✅ Popup de confirmation "Êtes-vous sûr..."
- ✅ Si vous confirmez : erreur "Vous ne pouvez pas supprimer votre propre compte"
- ✅ Notification toast s'affiche

---

### 9️⃣ Test de la Déconnexion

**Étapes :**
1. En bas de la sidebar, cliquez sur **"Déconnexion"**

**Résultat attendu :**
- ✅ Redirection vers `/login`
- ✅ Token supprimé du localStorage
- ✅ Impossible d'accéder à `/dashboard` sans se reconnecter

---

## 🐛 Problèmes Potentiels et Solutions

### Problème : "Erreur lors du chargement des administrateurs"

**Causes possibles :**
- Backend pas démarré
- MongoDB pas connecté
- Port 5000 déjà utilisé

**Solution :**
```bash
# Vérifier que le backend tourne
cd server
npm run dev

# Vérifier MongoDB
mongosh
> show dbs
```

---

### Problème : "401 Unauthorized"

**Cause :** Token expiré ou invalide

**Solution :**
1. Déconnectez-vous
2. Reconnectez-vous
3. Le nouveau token sera généré

---

### Problème : Sidebar ne s'affiche pas sur mobile

**Cause :** Design responsive

**Solution :**
- Cliquez sur l'icône Menu (☰) en haut à gauche
- La sidebar s'ouvrira en overlay

---

## 📊 Endpoints API Testés

Voici les endpoints qui sont appelés pendant les tests :

| Endpoint | Méthode | Description | Testé par |
|----------|---------|-------------|-----------|
| `/api/auth/login` | POST | Connexion | Test 1 |
| `/api/users?role=admin` | GET | Liste admins | Test 4 |
| `/api/users?role=user` | GET | Liste users | Test 5 |
| `/api/users/:id` | DELETE | Supprimer | Test 8 |
| `/api/auth/logout` | POST | Déconnexion | Test 9 |

---

## ✅ Checklist de Validation

Cochez au fur et à mesure :

- [ ] Connexion réussie
- [ ] Dashboard s'affiche correctement
- [ ] Navigation vers Management fonctionne
- [ ] Onglet Administrateurs affiche le compte admin
- [ ] Onglet Utilisateurs affiche le message vide
- [ ] Recherche filtre en temps réel
- [ ] Changement de vue Grille/Tableau fonctionne
- [ ] Suppression affiche une erreur (compte propre)
- [ ] Déconnexion redirige vers login
- [ ] Animations Framer Motion sont fluides
- [ ] Design glassmorphism s'affiche correctement

---

## 🎨 Points de Design à Vérifier

- ✅ Dégradés bleu/violet sur les bannières
- ✅ Effet glassmorphism (flou + transparence)
- ✅ Animations au hover sur les cartes
- ✅ Transitions fluides entre les onglets
- ✅ Badges colorés (vert pour actif, rouge pour inactif)
- ✅ Avatars avec initiales et dégradés
- ✅ Scrollbar personnalisée

---

**Bon test ! 🚀**

Si vous rencontrez un problème, vérifiez d'abord la console du navigateur (F12) et les logs du serveur.
