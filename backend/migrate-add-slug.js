// Script de migration pour ajouter un slug à tous les produits existants
// Place ce fichier dans ton dossier backend et exécute-le avec : node migrate-add-slug.js

import mongoose from "mongoose";
import Product from "./models/productModel.js";
import generateUniqueSlug from "./utils/slug.js";
import "dotenv/config";

// Mets ici l'URL de ta base MongoDB si besoin
const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/sunubio";

async function migrate() {
  await mongoose.connect(MONGO_URI);
  const products = await Product.find({});
  let updated = 0;
  for (const product of products) {
    if (!product.slug || product.slug === "" || product.slug === undefined) {
      product.slug = generateUniqueSlug(product.name);
      await product.save();
      updated++;
    }
  }
  console.log(`Migration terminée : ${updated} produits mis à jour.`);
  await mongoose.disconnect();
}

migrate().catch(err => {
  console.error("Erreur de migration :", err);
  process.exit(1);
});
