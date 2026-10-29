-- =====================================================================
--  Recette du Monde — création de la BDD de test (MariaDB 10.4+ / MySQL 8.0.16+)
--  Script REJOUABLE : il supprime puis recrée tout à chaque exécution.
--  ⚠️ Toutes les données existantes de la base recette_du_monde sont perdues.
--
--  Lancer :  mariadb -u root -p < recette_du_monde.sql
-- =====================================================================

CREATE DATABASE IF NOT EXISTS recette_du_monde
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE recette_du_monde;

SET NAMES utf8mb4;

-- ---------------------------------------------------------------------
-- 1. Nettoyage : on désactive les FK le temps de tout supprimer
--    (sinon l'ordre des DROP compte, et recette <-> vignette_produit
--    se référencent mutuellement)
-- ---------------------------------------------------------------------
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS preparation;
DROP TABLE IF EXISTS recette_favorite;
DROP TABLE IF EXISTS note;
DROP TABLE IF EXISTS ingredient_plat;
DROP TABLE IF EXISTS vignette_produit;
DROP TABLE IF EXISTS recette;
DROP TABLE IF EXISTS utilisateur;

SET FOREIGN_KEY_CHECKS = 1;

-- ---------------------------------------------------------------------
-- 2. Tables
-- ---------------------------------------------------------------------

CREATE TABLE utilisateur (
  id                   INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  nom                  VARCHAR(50)   NOT NULL,
  photo_profil         VARCHAR(255)  NULL,
  description          TEXT          NULL,
  professionnel        BOOLEAN       NOT NULL DEFAULT FALSE,
  role                 ENUM('utilisateur', 'administrateur', 'super_utilisateur')
                                     NOT NULL DEFAULT 'utilisateur',
  date_creation_compte DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  mot_de_passe_hash    VARCHAR(255)  NOT NULL,

  CONSTRAINT pk_utilisateur     PRIMARY KEY (id),
  CONSTRAINT uq_utilisateur_nom UNIQUE (nom)
) ENGINE = InnoDB;


CREATE TABLE recette (
  id                  INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  id_auteur           INT UNSIGNED  NOT NULL,
  id_vignette_produit INT UNSIGNED  NULL,          -- FK ajoutée plus bas (référence circulaire)
  titre               VARCHAR(150)  NOT NULL,
  visibilite          ENUM('visible', 'cacher', 'bannie') NOT NULL DEFAULT 'visible',
  description         TEXT          NULL,
  categorie_moment    ENUM('entrée', 'plat', 'dessert') NOT NULL,
  categorie_type      ENUM('Pizzas', 'Salade verte', 'Soupe', 'Pain et fromages', 'Pâtes',
                           'Crudités', 'Charcuterie', 'Barbecue', 'Crêpes', 'Croque-monsieur',
                           'Quiches', 'Savoyard', 'Traditionnel', 'Pique-nique', 'Hamburgers',
                           'Brochettes', 'Gratin') NULL,
  categorie_origine   ENUM('Afrique', 'Amérique du Nord', 'Amérique du Sud', 'Antarctique',
                           'Asie', 'Europe', 'Océanie') NULL,
  categorie_saison    ENUM('été', 'automne', 'hiver', 'printemps') NULL,
  vegetarien          BOOLEAN       NOT NULL DEFAULT FALSE,
  sans_gluten         BOOLEAN       NOT NULL DEFAULT FALSE,
  sans_fruits_a_coque BOOLEAN       NOT NULL DEFAULT FALSE,
  duree_preparation   INT UNSIGNED  NOT NULL,          -- minutes
  duree_cuisson       INT UNSIGNED  NOT NULL DEFAULT 0, -- minutes
  duree_repos         INT UNSIGNED  NOT NULL DEFAULT 0, -- minutes
  personne            INT UNSIGNED  NOT NULL,
  difficulte          ENUM('facile', 'moyen', 'difficile') NOT NULL,
  prix                ENUM('bon_marche', 'moyen', 'eleve') NOT NULL,

  CONSTRAINT pk_recette PRIMARY KEY (id),
  CONSTRAINT ck_recette_duree_preparation CHECK (duree_preparation >= 1),
  CONSTRAINT ck_recette_personne          CHECK (personne >= 1),
  -- duree_cuisson / duree_repos >= 0 garanti par UNSIGNED
  CONSTRAINT fk_recette_auteur
    FOREIGN KEY (id_auteur) REFERENCES utilisateur (id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE = InnoDB;


CREATE TABLE vignette_produit (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_recette INT UNSIGNED NOT NULL,
  photo      VARCHAR(255) NOT NULL,

  CONSTRAINT pk_vignette_produit PRIMARY KEY (id),
  CONSTRAINT fk_vignette_recette
    FOREIGN KEY (id_recette) REFERENCES recette (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB;

-- Maintenant que vignette_produit existe, on ferme la boucle
ALTER TABLE recette
  ADD CONSTRAINT fk_recette_vignette
    FOREIGN KEY (id_vignette_produit) REFERENCES vignette_produit (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE;


CREATE TABLE ingredient_plat (
  id         INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  id_recette INT UNSIGNED  NOT NULL,
  nom        VARCHAR(100)  NOT NULL,
  quantite   DECIMAL(10,2) NOT NULL,
  unite      VARCHAR(20)   NULL,

  CONSTRAINT pk_ingredient_plat PRIMARY KEY (id),
  CONSTRAINT ck_ingredient_quantite CHECK (quantite >= 0),
  CONSTRAINT fk_ingredient_recette
    FOREIGN KEY (id_recette) REFERENCES recette (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB;


CREATE TABLE note (
  id         INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  id_auteur  INT UNSIGNED     NOT NULL,
  id_recette INT UNSIGNED     NOT NULL,
  note       TINYINT UNSIGNED NOT NULL,

  CONSTRAINT pk_note PRIMARY KEY (id),
  CONSTRAINT ck_note_valeur CHECK (note BETWEEN 1 AND 5),
  CONSTRAINT uq_note_auteur_recette UNIQUE (id_auteur, id_recette),
  CONSTRAINT fk_note_auteur
    FOREIGN KEY (id_auteur) REFERENCES utilisateur (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_note_recette
    FOREIGN KEY (id_recette) REFERENCES recette (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB;


CREATE TABLE recette_favorite (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_auteur  INT UNSIGNED NOT NULL,
  id_recette INT UNSIGNED NOT NULL,

  CONSTRAINT pk_recette_favorite PRIMARY KEY (id),
  CONSTRAINT uq_favori_auteur_recette UNIQUE (id_auteur, id_recette), 
  CONSTRAINT fk_favori_auteur
    FOREIGN KEY (id_auteur) REFERENCES utilisateur (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_favori_recette
    FOREIGN KEY (id_recette) REFERENCES recette (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB;


CREATE TABLE preparation (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_recette INT UNSIGNED NOT NULL,
  id_etape   INT UNSIGNED NOT NULL,      -- numéro de l'étape : 1, 2, 3...
  texte      TEXT         NOT NULL,

  CONSTRAINT pk_preparation PRIMARY KEY (id),
  CONSTRAINT ck_preparation_etape CHECK (id_etape >= 1),
  CONSTRAINT uq_preparation_etape UNIQUE (id_recette, id_etape),
  CONSTRAINT fk_preparation_recette
    FOREIGN KEY (id_recette) REFERENCES recette (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB;


-- ---------------------------------------------------------------------
-- 3. Données de test (supprime cette section pour une base vide)
--    Les mots de passe sont des faux hash : à remplacer par de vrais
--    hash bcrypt/argon2 générés par l'API.
-- ---------------------------------------------------------------------

INSERT INTO utilisateur (id, nom, description, professionnel, role, mot_de_passe_hash) VALUES
  (1, 'Alice',   'Admin du site',          FALSE, 'super_utilisateur', '$2b$10$fauxhashfauxhashfauxhashfauxhashfauxhashfauxha'),
  (2, 'Bob',     'Modérateur',             FALSE, 'administrateur',    '$2b$10$fauxhashfauxhashfauxhashfauxhashfauxhashfauxhb'),
  (3, 'Candice', 'Cheffe à domicile',      TRUE,  'utilisateur',       '$2b$10$fauxhashfauxhashfauxhashfauxhashfauxhashfauxhc'),
  (4, 'David',   'Amateur de cuisine',     FALSE, 'utilisateur',       '$2b$10$fauxhashfauxhashfauxhashfauxhashfauxhashfauxhd');

-- Recettes insérées SANS vignette d'abord (la vignette n'existe pas encore)
INSERT INTO recette (id, id_auteur, titre, description, categorie_moment, categorie_type,
                     categorie_origine, categorie_saison, vegetarien, sans_gluten, sans_fruits_a_coque,
                     duree_preparation, duree_cuisson, duree_repos, personne, difficulte, prix) VALUES
  (1, 3, 'Pizza margherita', 'La classique napolitaine.', 'plat', 'Pizzas',
      'Europe', 'été', TRUE, FALSE, TRUE, 30, 12, 60, 4, 'moyen', 'bon_marche'),
  (2, 4, 'Soupe miso', 'Soupe japonaise rapide.', 'entrée', 'Soupe',
      'Asie', 'hiver', TRUE, TRUE, TRUE, 10, 5, 0, 2, 'facile', 'bon_marche'),
  (3, 3, 'Tartiflette', 'Plat savoyard bien réconfortant.', 'plat', 'Savoyard',
      'Europe', 'hiver', FALSE, TRUE, TRUE, 20, 40, 0, 6, 'facile', 'moyen');

INSERT INTO vignette_produit (id, id_recette, photo) VALUES
  (1, 1, 'uploads/recettes/pizza-margherita.jpg'),
  (2, 2, 'uploads/recettes/soupe-miso.jpg'),
  (3, 3, 'uploads/recettes/tartiflette.jpg');

-- Puis on rattache la vignette principale
UPDATE recette SET id_vignette_produit = 1 WHERE id = 1;
UPDATE recette SET id_vignette_produit = 2 WHERE id = 2;
UPDATE recette SET id_vignette_produit = 3 WHERE id = 3;

INSERT INTO ingredient_plat (id_recette, nom, quantite, unite) VALUES
  (1, 'Farine',          500, 'g'),
  (1, 'Mozzarella',      250, 'g'),
  (1, 'Sauce tomate',    200, 'ml'),
  (2, 'Pâte miso',         2, 'c. à soupe'),
  (2, 'Tofu',            100, 'g'),
  (3, 'Pommes de terre',   1, 'kg'),
  (3, 'Reblochon',         1, NULL),
  (3, 'Lardons',         200, 'g');

INSERT INTO preparation (id_recette, id_etape, texte) VALUES
  (1, 1, 'Préparer la pâte et la laisser reposer 1 h.'),
  (1, 2, 'Étaler la pâte, ajouter la sauce et la mozzarella.'),
  (1, 3, 'Cuire 12 min à 250 °C.'),
  (2, 1, 'Faire chauffer l''eau sans la faire bouillir.'),
  (2, 2, 'Délayer le miso, ajouter le tofu en dés.'),
  (3, 1, 'Cuire les pommes de terre à l''eau.'),
  (3, 2, 'Faire revenir les lardons, tout mettre dans un plat avec le reblochon.'),
  (3, 3, 'Enfourner 25 min à 200 °C.');

INSERT INTO note (id_auteur, id_recette, note) VALUES
  (4, 1, 5),
  (2, 1, 4),
  (3, 2, 3),
  (4, 3, 5);

INSERT INTO recette_favorite (id_auteur, id_recette) VALUES
  (4, 1),
  (4, 3),
  (2, 2);

-- Fin du script