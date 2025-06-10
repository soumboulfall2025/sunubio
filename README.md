# SunuBio

## Description
SunuBio est une application e-commerce complète composée de trois parties principales :
- **frontend** : l’interface utilisateur principale côté client (React)
- **backend** : l’API serveur et la logique métier (Node.js/Express)
- **admin** : panneau d’administration pour la gestion des produits, commandes, utilisateurs (React)

---

## Structure du projet

sunubio/
│
├── frontend/   # Client React, affichage et interaction utilisateur
├── backend/    # API RESTful en Node.js/Express avec MongoDB
├── admin/      # Interface d’administration React
├── .gitignore  # Fichier global d’exclusion Git
└── README.md   # Documentation du projet (ce fichier)

---

## Installation

1. **Cloner le dépôt :**

```bash
git clone https://github.com/soumboulfall2025/sunubio.git
cd sunubio
```

2. **Installation des dépendances :**

Pour chaque dossier (frontend, backend, admin), installer les dépendances :
```bash
cd frontend
npm install
cd ../backend
npm install
cd ../admin
npm install
```

3. **Démarrer le backend**
```bash
cd backend
npm run dev
```

4. **Démarrer le frontend**
```bash
cd ../frontend
npm run dev
```

5. **Démarrer l’interface admin**
```bash
cd ../admin
npm run dev
```

---

## Configuration

Créez un fichier `.env` dans le dossier backend pour les variables d’environnement (exemple) :

```
PORT=4000
MONGO_URI=mongodb://localhost:27017/sunubio
JWT_SECRET=ton_secret_jwt
```

---

## Contribution

Les contributions sont les bienvenues !  
Merci de faire une pull request et d’ouvrir un ticket pour toute nouvelle fonctionnalité ou bug.

---

## Licence

Ce projet est sous licence MIT.

---

## Auteur

Soumboul Fall - https://github.com/soumboulfall2025