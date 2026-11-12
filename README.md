# Recette-du-Monde

Ce projet est un projet étudiant dans le but de mettre en application nos connaissances dans différents langages.

## Description

Recette-du-Monde est une application de partage de recettes de cuisine du monde entier. Les utilisateurs peuvent publier des recettes, les noter et les enregistrer en favoris.

## Stack technique

| Couche | Technologie |
|--------|-------------|
| API (back-end) | [Nest.js](https://nestjs.com/) |
| Base de données | [MariaDB](https://mariadb.org/) 10.4+ (moteur InnoDB, encodage `utf8mb4`) |
| Front-end | [Next.js](https://nextjs.org/) |
| Versionnement | Git / GitHub |

## Base de données

Le script [recettes_du_monde.sql](recettes_du_monde.sql) crée la base `recette_du_monde` avec les tables suivantes :

- `utilisateur`
- `recette`
- `vignette_produit`
- `ingredient_plat`
- `preparation`
- `note`
- `recette_favorite`

### Installation de la base de données

Avec l'authentification `unix_socket` (configuration par défaut sur Debian/Ubuntu/WSL) :

```bash
sudo mariadb < recettes_du_monde.sql
```

Avec un mot de passe root :

```bash
mariadb -u root -p < recettes_du_monde.sql
```

> ⚠️ Le script est rejouable : il supprime puis recrée toutes les tables à chaque exécution. Les données existantes de la base `recette_du_monde` sont perdues.

## Démarrage du projet

> Pour lancer l'API
```bash
cd ./oishii-api/
npm run start:dev
```

> Pour lancer le site
```bash
cd ./oishii/
npm run dev
```

### Réponse en JSON de l'API
```json
{message: '', error: 'Bad Request', statusCode: 400}
```

## Équipe

| Membre | Missions |
|--------|----------|
| Emerick P. | API, |
| Amaury A. | Database, |
| Paul-élie K.| À compléter |


## Nrome de commit

| TAG | description |
|-----|-------------|
| [ADD] | Ajouts de code importants|
| [FIX] | Corection de bug/supression d'erreur/code mort|
| [CHORE] | Changement scementiques |
| [DOCS] | Changementdans la documentation |
| [DELETE] | Supression importante |

## Licence

Voir le fichier [LICENSE](LICENSE).
