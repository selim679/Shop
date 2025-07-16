-- Script pour mettre à jour la base de données existante
-- Ajouter la colonne status à la table orders

USE myapp;

-- Ajouter la colonne status si elle n'existe pas
ALTER TABLE orders ADD COLUMN status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending';

-- Mettre à jour les commandes existantes sans statut
UPDATE orders SET status = 'pending' WHERE status IS NULL;

-- Afficher la structure de la table orders
DESCRIBE orders; 