import express from 'express';
import Product from '../models/productModel.js'; // adapte le chemin et l'extension

const router = express.Router();

router.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = 'https://sunubio-frontend.onrender.com';

    const staticRoutes = [
      '/',
      '/collection',
      '/about',
      '/contact',
      '/cart',
      '/login',
      '/place-order',
      '/orders',
      '/profile'
    ];

    let urls = staticRoutes.map(route => `
<url>
  <loc>${baseUrl}${route}</loc>
  <lastmod>${new Date().toISOString()}</lastmod>
</url>`).join('');

    const products = await Product.find({}, '_id updatedAt createdAt');

    products.forEach(product => {
      const lastMod = product.updatedAt || product.createdAt || Date.now();
      urls += `
<url>
  <loc>${baseUrl}/product/${product._id}</loc>
  <lastmod>${new Date(lastMod).toISOString()}</lastmod>
</url>`;
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
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