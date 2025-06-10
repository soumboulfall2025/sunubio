import userModel from "../models/userModel.js"

// Ajouter un produit au panier de l'utilisateur
const addToCart = async (req, res) => {
    try {
        const userId = req.user.id; // ou req.userId selon ton middleware
        const { itemId, size } = req.body;

        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.json({ success: false, message: "Utilisateur non trouvé." });
        }
        let cartData = userData.cartData || {};

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Ajouté au panier" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Mettre à jour la quantité d'un produit dans le panier
const updateCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId, size, quantity } = req.body;
        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.json({ success: false, message: "Utilisateur non trouvé." });
        }
        let cartData = userData.cartData || {};

        if (cartData[itemId]) {
            cartData[itemId][size] = quantity;
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = quantity;
        }

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Panier mis à jour" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Récupérer le panier de l'utilisateur
const getUserCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.json({ success: true, cartData: {} });
        }
        let cartData = userData.cartData || {};
        res.json({ success: true, cartData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { addToCart, updateCart, getUserCart }