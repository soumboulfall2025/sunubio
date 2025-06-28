import express from "express"
import {
  addProduct,
  listProduct,
  removeProduct,
  singleProduct,
  addReview,
  addQuestion,
  answerQuestion
} from "../controllers/productController.js"
import upload from "../middleware/multer.js"
import authUser from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";
import Product from "../models/productModel.js" // <-- Ajoute ceci pour accéder au modèle




const productRouter = express.Router()
productRouter.post("/add",adminAuth,upload.fields([{name:"image1",maxCount:1},{name:"image2",maxCount:1},{name:"image3",maxCount:1},{name:"image4",maxCount:1}]),addProduct)
productRouter.post("/remove",adminAuth,removeProduct)
productRouter.post("/single",singleProduct)
productRouter.get("/list",listProduct)

// Nouvelle route pour récupérer uniquement les produits bio
productRouter.get("/bio", async (req, res) => {
  try {
    // Adapte le filtre selon la structure de tes produits
    const products = await Product.find({})
    res.json({ success: true, products })
  } catch (err) {
    res.status(500).json({ success: false, message: "Erreur serveur" })
  }
})

// Route pour récupérer un produit par son slug
productRouter.get("/slug/:slug", async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({ success: false, message: "Produit non trouvé" });
    }
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// Ajout des routes pour les avis, questions et réponses aux questions
productRouter.post("/:productId/review", authUser, addReview);
productRouter.post("/:productId/question", authUser, addQuestion);
productRouter.post("/:productId/faq/:faqId/answer", adminAuth, answerQuestion);

export default productRouter