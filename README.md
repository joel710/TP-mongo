# Système de Gestion Universitaire - Backend Node.js & MongoDB

Ce projet est un backend complet pour la gestion des étudiants, des cours et des notes au sein d'une université.

## Table des matières
1. [Installation](#installation)
2. [Structure du Projet](#structure-du-projet)
3. [API Documentation](#api-documentation)
4. [Cours complet sur MongoDB](#cours-complet-sur-mongodb)

---

## Installation

1. Cloner le projet.
2. Installer les dépendances :
   ```bash
   npm install
   ```
3. Configurer votre base de données MongoDB dans le fichier `.env` :
   ```env
   MONGODB_URI=votre_uri_mongodb
   PORT=5000
   ```
4. Lancer le serveur :
   ```bash
   npm start
   ```

---

## Structure du Projet

```text
src/
├── config/         # Configuration de la base de données
├── controllers/    # Logique métier des routes
├── models/         # Schémas Mongoose (Student, Course, Grade)
├── routes/         # Définition des endpoints API
└── app.js          # Point d'entrée de l'application
```

---

## API Documentation

### Étudiants (`/api/students`)
- `POST /` : Créer un étudiant.
- `GET /` : Lister tous les étudiants.
- `GET /search?q=...` : Rechercher par nom ou email.
- `GET /:id/report` : Générer un bulletin (moyenne et détails).
- `PUT /:id` : Modifier un étudiant.
- `DELETE /:id` : Supprimer un étudiant.

### Cours (`/api/courses`)
- `POST /` : Créer un cours.
- `GET /` : Lister tous les cours.
- `POST /:courseId/enroll/:studentId` : Inscrire un étudiant à un cours.
- `GET /:id/students` : Lister les étudiants inscrits à un cours.
- `POST /:courseId/students/:studentId/grade` : Ajouter ou modifier une note.

---

## Cours complet sur MongoDB

### 1. Qu'est-ce que MongoDB ?
MongoDB est une base de données **NoSQL** orientée **documents**. Contrairement aux bases de données relationnelles (SQL), MongoDB stocke les données sous forme de documents JSON-like (appelés BSON).

#### Concepts clés :
- **Collection** : Équivalent d'une *table* en SQL.
- **Document** : Équivalent d'une *ligne* (row) en SQL.
- **Champ (Field)** : Équivalent d'une *colonne* en SQL.

### 2. Pourquoi utiliser MongoDB ?
- **Flexibilité du schéma** : Pas besoin de définir une structure rigide à l'avance.
- **Scalabilité** : Conçu pour être distribué sur plusieurs serveurs facilement.
- **Vitesse** : Performant pour les opérations de lecture et d'écriture massives.

### 3. Les opérations CRUD (Create, Read, Update, Delete)

#### Insertion (Create)
Pour ajouter un document dans une collection :
```javascript
db.collection('students').insertOne({ firstName: 'Jean', lastName: 'Dupont' });
```

#### Lecture (Read)
Pour trouver des documents :
```javascript
// Trouver tous les étudiants
db.collection('students').find({});

// Trouver un étudiant par email
db.collection('students').findOne({ email: 'jean@test.com' });
```

#### Mise à jour (Update)
Pour modifier un document :
```javascript
db.collection('students').updateOne(
  { _id: ObjectId("...") },
  { $set: { firstName: 'Jean-Pierre' } }
);
```

#### Suppression (Delete)
Pour supprimer un document :
```javascript
db.collection('students').deleteOne({ _id: ObjectId("...") });
```

### 4. Modélisation des données avec Mongoose
Mongoose est une bibliothèque (ODM) pour Node.js qui permet de modéliser les données MongoDB de manière structurée.

#### Exemple de Schéma :
```javascript
const studentSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true }
});
```

### 5. Relations et Agrégations

#### Relations (Population)
Dans ce TP, nous lions les étudiants et les cours via leurs IDs. Mongoose utilise `.populate()` pour remplacer un ID par le document complet lors d'une requête.

#### Agrégation (Averages)
Pour calculer des moyennes, on utilise souvent le pipeline d'agrégation (`aggregate`), mais dans ce TP, nous avons opté pour une approche simplifiée via JS pour plus de clarté pédagogique.

### 6. Bonnes pratiques
- Toujours valider les données en entrée.
- Utiliser des index pour accélérer les recherches fréquentes.
- Gérer les erreurs de connexion à la base de données de manière robuste.
