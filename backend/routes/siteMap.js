import express from 'express';
import Product from '../models/productModel.js'; // adapte le nom du fichier modèle si besoin

const router = express.Router();

router.get('/sitemap.xml', async (req, res) => {
  try {
    const products = await Product.find(); // Assure-toi que la collection existe

    const baseUrl = 'https://www.bambaelectro.com';

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Pages fixes
    xml += `  <url><loc>${baseUrl}/</loc><priority>1.0</priority></url>\n`;
    xml += `  <url><loc>${baseUrl}/product</loc></url>\n`;
    xml += `  <url><loc>${baseUrl}/contact</loc></url>\n`;

    // Pages dynamiques (produits)
    products.forEach((product) => {
      xml += `  <url><loc>${baseUrl}/product/${product._id}</loc></url>\n`;
    });

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur lors de la génération du sitemap.');
  }
});

export default router;
