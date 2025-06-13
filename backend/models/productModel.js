import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    name: {type:String, required:true},
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

const productModel = mongoose.models.product || mongoose.model("product", productSchema)
export default productModel