import express from 'express';
import Product from '../models/productModel.js';

const router = express.Router();

router.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = 'https://sunubio-frontend.onrender.com';

    // Pages statiques à indexer
    const staticRoutes = [
      '/',
      '/collection',
      '/about',
      '/contact',
      '/place-order',
      
      
      // Ajoute ici d'autres pages publiques si besoin
    ];

    let urls = staticRoutes.map(route => `
  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>`).join('');

    // Pages produits dynamiques
    const products = await Product.find({}, '_id updatedAt createdAt');
    products.forEach(product => {
      const lastMod = product.updatedAt || product.createdAt || Date.now();
      urls += `
  <url>
    <loc>${baseUrl}/product/${product._id}</loc>
    <lastmod>${new Date(lastMod).toISOString().split('T')[0]}</lastmod>
  </url>`;
    });

    // Génération du sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset 
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 
                      http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls}
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(sitemap);

  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de la génération du sitemap');
  }
});

export default router;