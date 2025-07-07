import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import cors from 'cors';
import nodemailer from 'nodemailer';
import db from './db.js';
import Stripe from 'stripe';

const app = express();
const PORT = 5002;
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === Middleware ===
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));






// === Configuration Multer pour les uploads multiples ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });
const multiUpload = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'colorImages', maxCount: 10 }
]);

// === Stripe Checkout Session ===
app.post('/api/create-checkout-session', async (req, res) => {
  const items = req.body.items;
  console.log("📦 Données reçues pour Stripe :", items);

  try {
    const line_items = items.map(item => {
      if (!item.name || !item.price || !item.quantity) {
        throw new Error("Un item du panier est invalide");
      }
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(Number(item.price) * 100),
        },
        quantity: Number(item.quantity),
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: 'http://localhost:5173/success',
      cancel_url: 'http://localhost:5173/cancel',
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("❌ Erreur Stripe:", err.message);
    res.status(500).json({ error: 'Erreur lors du paiement Stripe.' });
  }
});

// === Routes Produits ===

// Créer un nouveau produit avec tailles et couleurs
app.post('/api/products', multiUpload, async (req, res) => {
  const { 
    name, 
    description, 
    category, 
    price, 
    originalPrice, 
    sizes, 
    colors 
  } = req.body;

  try {
    // Démarrer une transaction
    await db.promise().beginTransaction();

    // Traiter l'image principale
    const mainImage = req.files['image'] ? req.files['image'][0] : null;
    const mainImageUrl = mainImage ? `/uploads/${mainImage.filename}` : '';

    // Insérer le produit principal
    const [productResult] = await db.promise().query(
      `INSERT INTO products 
       (name, description, category, price, original_price, image_url) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, description, category, price, originalPrice || price, mainImageUrl]
    );

    const productId = productResult.insertId;

    // Traiter les tailles
    const sizesArray = sizes ? sizes.split(',') : ['S', 'M', 'L', 'XL'];
    for (const size of sizesArray) {
      await db.promise().query(
        `INSERT INTO product_sizes (product_id, size) VALUES (?, ?)`,
        [productId, size.trim()]
      );
    }

    // Traiter les couleurs
    const colorsArray = JSON.parse(colors || '[]');
    const colorImages = req.files['colorImages'] || [];
    
    for (let i = 0; i < colorsArray.length; i++) {
      const color = colorsArray[i];
      const colorImage = colorImages[i];
      
      const colorImageUrl = colorImage ? `/uploads/${colorImage.filename}` : '';
      
      await db.promise().query(
        `INSERT INTO product_colors 
         (product_id, name, image_url) 
         VALUES (?, ?, ?)`,
        [productId, color.name, colorImageUrl]
      );
    }

    // Valider la transaction
    await db.promise().commit();

    // Récupérer le produit complet pour la réponse
    const [product] = await db.promise().query(
      `SELECT * FROM products WHERE id = ?`, 
      [productId]
    );
    
    const [productSizes] = await db.promise().query(
      `SELECT size FROM product_sizes WHERE product_id = ?`,
      [productId]
    );
    
    const [productColors] = await db.promise().query(
      `SELECT name, image_url FROM product_colors WHERE product_id = ?`,
      [productId]
    );

    res.status(201).json({
      success: true,
      data: {
        ...product[0],
        sizes: productSizes.map(s => s.size),
        colors: productColors.map(c => ({
          name: c.name,
          image: c.image_url
        }))
      }
    });

  } catch (error) {
    // Annuler en cas d'erreur
    await db.promise().rollback();
    console.error('Error adding product:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to add product',
      error: error.message 
    });
  }
});

// Récupérer tous les produits
app.get('/api/products', async (req, res) => {
  try {
    const [products] = await db.promise().query('SELECT * FROM products');
    
    // Pour chaque produit, récupérer la première couleur comme image par défaut
    for (const product of products) {
      const [colors] = await db.promise().query(
        `SELECT image_url FROM product_colors WHERE product_id = ? LIMIT 1`,
        [product.id]
      );
      
      if (colors.length > 0) {
        product.imageUrl = colors[0].image_url || product.image_url;
      }
    }

    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch products',
      error: error.message 
    });
  }
});

// Récupérer un produit spécifique avec tous ses détails
app.get('/api/products/:id', async (req, res) => {
  const productId = req.params.id;
  
  try {
    // Récupérer les infos de base du produit
    const [product] = await db.promise().query(
      `SELECT * FROM products WHERE id = ?`, 
      [productId]
    );
    
    if (product.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    // Récupérer les tailles
    const [sizes] = await db.promise().query(
      `SELECT size FROM product_sizes WHERE product_id = ?`,
      [productId]
    );

    // Récupérer les couleurs
    const [colors] = await db.promise().query(
      `SELECT name, image_url FROM product_colors WHERE product_id = ?`,
      [productId]
    );

    res.json({
      success: true,
      data: {
        ...product[0],
        sizes: sizes.map(s => s.size),
        colors: colors.map(c => ({
          name: c.name,
          image: c.image_url
        }))
      }
    });

  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch product',
      error: error.message 
    });
  }
});

// Récupérer les produits par catégorie
app.get('/api/products/category/:cat', async (req, res) => {
  const category = req.params.cat;
  
  try {
    // Récupérer les produits de la catégorie
    const [products] = await db.promise().query(
      `SELECT * FROM products WHERE category = ?`,
      [category]
    );

    // Pour chaque produit, récupérer la première couleur comme image par défaut
    for (const product of products) {
      const [colors] = await db.promise().query(
        `SELECT image_url FROM product_colors WHERE product_id = ? LIMIT 1`,
        [product.id]
      );
      
      if (colors.length > 0) {
        product.imageUrl = colors[0].image_url || product.image_url;
      }
    }

    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch products',
      error: error.message 
    });
  }
});

// Supprimer un produit
app.delete('/api/products/:id', async (req, res) => {
  const productId = req.params.id;
  
  try {
    // La suppression en cascade s'occupera des tailles et couleurs associées
    await db.promise().query('DELETE FROM products WHERE id = ?', [productId]);
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete product',
      error: error.message 
    });
  }
});

// === Authentification ===
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  db.query(
    'SELECT password, role FROM users WHERE (username = ? OR email = ?)',
    [username, username],
    (err, results) => {
      if (err) return res.status(500).json({ success: false, message: 'Database error' });
      if (results.length === 0) return res.status(401).json({ success: false, message: 'Invalid credentials' });

      const dbPassword = results[0].password;
      const role = results[0].role;

      if (password !== dbPassword) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      res.json({ success: true, role });
    }
  );
});

app.post('/api/createAccount', (req, res) => {
  const { username, password, nom, prenom, email, telephone, pays } = req.body;

  db.query('SELECT id FROM users WHERE username = ? OR email = ?', [username, email], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });
    if (results.length > 0) return res.status(409).json({ success: false, message: 'User already exists' });

    db.query(
      'INSERT INTO users (username, password, nom, prenom, email, telephone, pays, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [username, password, nom, prenom, email, telephone, pays, 'user'],
      (err2) => {
        if (err2) return res.status(500).json({ success: false, message: 'Database error' });
        res.json({ success: true });
      }
    );
  });
});

// === Réinitialisation de mot de passe ===
app.post('/api/forgot-password', (req, res) => {
  const { email } = req.body;

  db.query('SELECT id FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });
    if (results.length === 0) return res.status(404).json({ success: false, message: 'Email not found' });

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    db.query('UPDATE users SET reset_code = ? WHERE email = ?', [code, email], (err2) => {
      if (err2) return res.status(500).json({ success: false, message: 'Database error' });

      const mailOptions = {
        from: 'salimfekih35@gmail.com',
        to: email,
        subject: 'Reset Password',
        text: `Votre code de réinitialisation est : ${code}`
      };

      transporter.sendMail(mailOptions, (error) => {
        if (error) return res.status(500).json({ success: false, message: 'Échec de l\'envoi de l\'email' });

        res.json({ success: true });
      });
    });
  });
});

app.post('/api/reset-password', (req, res) => {
  const { email, code, newPassword } = req.body;

  db.query('SELECT id FROM users WHERE email = ? AND reset_code = ?', [email, code], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });
    if (results.length === 0) return res.status(400).json({ success: false, message: 'Code invalide' });

    db.query('UPDATE users SET password = ?, reset_code = NULL WHERE email = ?', [newPassword, email], (err2) => {
      if (err2) return res.status(500).json({ success: false, message: 'Erreur serveur' });
      res.json({ success: true });
    });
  });
});

// === Nodemailer Configuration ===
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'salimfekih35@gmail.com',
    pass: 'pkqs zwrc vhfh vvzi' // ❗ Ne pas exposer en production
  }
});

// === Lancer le serveur ===
app.listen(PORT, () => {
  console.log(`✅ Serveur backend démarré sur http://localhost:${PORT}`);
});

app.get('/api/admin/stats', async (req, res) => {
  try {
    // Chiffre d'affaires total (somme des prix des commandes)
    const [[{ revenue }]] = await db.promise().query('SELECT SUM(total) as revenue FROM orders');
    // Nombre de commandes
    const [[{ orders }]] = await db.promise().query('SELECT COUNT(*) as orders FROM orders');
    // Nombre de produits
    const [[{ products }]] = await db.promise().query('SELECT COUNT(*) as products FROM products');
    // Tu peux ajouter d'autres stats ici (ex: top produits, etc.)

    res.json({
      revenue: revenue || 0,
      orders: orders || 0,
      products: products || 0
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
  }
});