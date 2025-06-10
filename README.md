# BambaElectro

## Description
BambaElectro est une application e-commerce complète composée de trois parties principales :
- **frontend** : l’interface utilisateur principale côté client (React)
- **backend** : l’API serveur et la logique métier (Node.js/Express)
- **admin** : panneau d’administration pour la gestion des produits, commandes, utilisateurs (React)

---

## Structure du projet

ecommerce-app/
│
├── frontend/ # Client React, affichage et interaction utilisateur
├── backend/ # API RESTful en Node.js/Express avec MongoDB
├── admin/ # Interface d’administration React
├── .gitignore # Fichier global d’exclusion Git
└── README.md # Documentation du projet (ce fichier)


---

## Installation

1. **Cloner le dépôt :**

```bash
git clone https://github.com/soumboulfall2025/bambaElectro.git
cd ecommerce-app

Installation des dépendances :

Pour chaque dossier (frontend, backend, admin), installer les dépendances :
cd frontend
npm install
cd ../backend
npm install
cd ../admin
npm install


Démarrer le backend
cd frontend
npm run dev


Démarrer l’interface admin
cd admin
npm run dev


Configuration
Créez un fichier .env dans le dossier backend pour les variables d’environnement (exemple) :

PORT=5000
MONGO_URI=mongodb://localhost:27017/mon_site_web
JWT_SECRET=ton_secret_jwt


Contribution
Les contributions sont les bienvenues !
Merci de faire une pull request et d’ouvrir un ticket pour toute nouvelle fonctionnalité ou bug.


Licence
Ce projet est sous licence MIT.


Auteur
Soumboul Fall - https://github.com/soumboulfall2025
