import mongoose from "mongoose"
import generateUniqueSlug from "../utils/slug.js";

const productSchema = new mongoose.Schema({
    name: {type:String, required:true},
    slug: {type:String, unique:true},
    description: {type:String, required:true},
    price: {type:Number, required:true},
    image: {type:Array, required:true},
    category: {type:String, required:true},
    subCategory: {type:String, required:true},
    sizes: {type:Array, required:true},
    bestSeller: {type:Boolean},
    date: {type:Number, required:true},
    reviews: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        name: String,
        rating: Number,
        comment: String,
        date: { type: Date, default: Date.now }
      }
    ],
    faq: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        question: String,
        answer: String, // Peut être vide au départ
        date: { type: Date, default: Date.now }
      }
    ],
})

// Génération automatique du slug avant sauvegarde
productSchema.pre("save", function(next) {
  if (this.isModified("name") || !this.slug) {
    this.slug = generateUniqueSlug(this.name);
  }
  next();
});

const productModel = mongoose.models.product || mongoose.model("product", productSchema)
export default productModel