import { v2 as cloudinary } from "cloudinary"
import productModel from "../models/productModel.js"


// function for add product 
const addProduct = async (req, res) => {
   

    try {
        const { name, description, price, category, subCategory, sizes, bestSeller } = req.body;

        // req.files = { image1: [file], image2: [file], ... }
        const images = [];

        ['image1', 'image2', 'image3', 'image4'].forEach((key) => {
            if (req.files[key] && req.files[key][0]) {
                images.push(req.files[key][0]);
            }
        });

        if (images.length === 0) {
            return res.status(400).json({ success: false, message: "No images uploaded" });
        }

        // Upload each image to Cloudinary
        const imagesUrl = await Promise.all(
            images.map(async (file) => {
                const result = await cloudinary.uploader.upload(file.path, { resource_type: "image" });
                return result.secure_url;
            })
        );

        const productData = {
            name,
            description,
            category,
            subCategory,
            price: Number(price),
            bestSeller: bestSeller === "true",
            sizes: JSON.parse(sizes),
            image: imagesUrl,
            date: Date.now(),
        };

        const product = new productModel(productData);
        await product.save();

        res.json({ success: true, message: "Product Added" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};




// function for list product 
const listProduct = async (req, res) => {
    try {
        const products = await productModel.find({})
        res.json({ success: true, products })
    } catch (error) {
        console.log(error);

        res.json({ success: false, message: error.message })
    }
}


// function for removing product 
const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: "Product Removed" })



    } catch (error) {
        console.log(error);

        res.json({ success: false, message: error.message })

    }

}


// function for single product info
const singleProduct = async (req, res) => {
    try {
        console.log("Reçu dans singleProduct:", req.body);
        const { id } = req.body;
        const product = await productModel.findById(id);
        res.json({ success: true, product });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Ajouter un avis
export const addReview = async (req, res) => {
  const { productId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user.id;
  const userName = req.user.name;
  await productModel.findByIdAndUpdate(productId, {
    $push: { reviews: { userId, name: userName, rating, comment } }
  });
  res.json({ success: true, message: "Avis ajouté !" });
};

// Poser une question
export const addQuestion = async (req, res) => {
  const { productId } = req.params;
  const { question } = req.body;
  const userId = req.user.id;
  await productModel.findByIdAndUpdate(productId, {
    $push: { faq: { userId, question, answer: "" } }
  });
  res.json({ success: true, message: "Question envoyée !" });
};

// Répondre à une question (admin)
export const answerQuestion = async (req, res) => {
  const { productId, faqId } = req.params;
  const { answer } = req.body;
  await productModel.updateOne(
    { _id: productId, "faq._id": faqId },
    { $set: { "faq.$.answer": answer } }
  );
  res.json({ success: true, message: "Réponse ajoutée !" });
};

export { addProduct, listProduct, removeProduct, singleProduct }