import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";

import paydunya from "paydunya";
import   { setup, store } from "../config/paydunyaConfig.js"
import { io } from "../server.js";



const frontend_URL = "https://sunuexpressshop.com"




// Placing order using cod method

const placeOrder = async (req, res) => {
  console.log("placeOrder triggered");
  console.log("req.body:", req.body);

  try {
    const { items, amount, address } = req.body;
    const userId = req.user.id; // depuis le middleware authUser

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "cod",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();
    console.log("Order saved:", newOrder);

    // Ajout de points fidélité à l'utilisateur
    const pointsToAdd = Math.floor(amount / 100); // 1 point par 100 FCFA
    await userModel.findByIdAndUpdate(userId, { $inc: { points: pointsToAdd }, cartData: {} });

    // Gestion du parrainage : créditer le parrain si c'est le premier achat du filleul
    const user = await userModel.findById(userId);
    if (user.referredBy) {
      const ordersCount = await orderModel.countDocuments({ userId });
      if (ordersCount === 1) {
        await userModel.findOneAndUpdate(
          { referralCode: user.referredBy },
          { $inc: { points: 100 } }
        );
      }
    }

    // -- ICI émission de la notif --
    io.emit("order-notification", {
      message: "Nouvelle commande passée",
      nomClient: req.user.name || "Client inconnu",
      total: amount,
      orderId: newOrder._id,
      date: new Date(),
    });

    res.json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error placing order",
      error: error.message,
    });
  }
};

export default placeOrder;


// Placing order using stripe method

const placeOrderStripe = async (req, res) => {

}

// Placing order using paydunya method
const placeOrderPaydunya = async (req, res) => {
  try {
    const { items, amount, address } = req.body;

    console.log("PayDunya - items reçus :", items);
    console.log("PayDunya - amount reçu :", amount);
    console.log("BODY PAYDUNYA :", req.body);

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Aucun produit dans la commande." });
    }

    const invoice = new paydunya.CheckoutInvoice(setup, store);

    items.forEach(item => {
      invoice.addItem(
        item.name || "Produit",
        item.quantity || 1,
        item.price || 1000,
        (item.price || 1000) * (item.quantity || 1),
        item.description || ""
      );
    });

    invoice.description = "Achat sur Sunubio";
    invoice.totalAmount = amount;

    // Utilisation de la promesse pour éviter le blocage
    invoice.create()
      .then(async () => {
        console.log("Réponse PayDunya API :", invoice);
        if ((invoice.status === "created" || invoice.status === "pending") && invoice.url) {
          // Création de la commande PayDunya (paiement en attente)
          const userId = req.user.id;
          const orderData = {
            userId,
            items,
            amount,
            address, // Ajoute bien address ici !
            paymentMethod: "paydunya",
            payment: false,
            date: Date.now(),
          };
          const newOrder = new orderModel(orderData);
          await newOrder.save();

          
          // Gestion du parrainage : créditer le parrain si c'est le premier achat du filleul
          const user = await userModel.findById(userId);
          if (user.referredBy) {
            const ordersCount = await orderModel.countDocuments({ userId });
            if (ordersCount === 1) {
              await userModel.findOneAndUpdate(
                { referralCode: user.referredBy },
                { $inc: { points: 100 } }
              );
            }
          }

          return res.json({
            success: true,
            message: 'Facture générée avec succès',
            redirectUrl: invoice.url
          });
        } else {
          return res.status(500).json({
            success: false,
            message: invoice.responseText || "Erreur PayDunya"
          });
        }
      })
      .catch((e) => {
        console.error("Erreur PayDunya (catch):", e);
        return res.status(500).json({
          success: false,
          message: "Erreur serveur PayDunya",
          error: e.message
        });
      });
  } catch (error) {
    console.error("Erreur PayDunya (catch global):", error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur PayDunya",
      error: error.message
    });
  }
};

// paytech 
const webhookPaytech = async (req, res) => {
  try {
    const payload = req.body;

    console.log("📥 Webhook reçu de PayTech :", payload);

    const status = payload.transaction_status || payload.status;
    const orderId = payload.metadata?.order_id || payload.custom_field?.order_id;

    if (!orderId || !status) {
      return res.status(400).json({ success: false, message: "Données manquantes" });
    }

    if (status === "completed") {
      await orderModel.findByIdAndUpdate(orderId, {
        paymentStatus: "paid",
      });

      console.log(`✅ Paiement confirmé pour la commande ${orderId}`);
    } else {
      console.log(`❌ Paiement échoué ou annulé pour la commande ${orderId}`);
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Erreur dans webhookPaytech:", err.message);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};





// Getting all orders data for admin panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({})
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message,
    });
  }

}


// user orders data for frontend
const userOrders = async (req, res) => {
  try {
    const userId = req.user.id; // depuis le middleware authUser
    const orders = await orderModel.find({ userId })
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error fetching user orders",
      error: error.message,
    });

  }

}

// update order status by admin
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body
    await orderModel.findByIdAndUpdate(orderId, { status })

    // Si la commande passe à "payé", crédite les points fidélité
    if (status === "paid") {
      const order = await orderModel.findById(orderId);
      if (order) {
        const pointsToAdd = Math.floor(order.amount / 100);
        await userModel.findByIdAndUpdate(order.userId, { $inc: { points: pointsToAdd } });
      }
    }

    res.json({ success: true, message: "Status Updated" })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error fetching user orders",
      error: error.message,
    });
  }

}

const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await orderModel.countDocuments()
    const totalRevenueAgg = await orderModel.aggregate([
      { $match: { payment: true } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ])
    const totalRevenue = totalRevenueAgg[0]?.total || 0

    const totalUsers = await userModel.countDocuments()
    const totalProducts = await productModel.countDocuments()

    res.json({
      totalOrders,
      totalRevenue,
      totalUsers,
      totalProducts,
    })
  } catch (error) {
    console.error("Erreur getDashboardStats:", error)
    res.status(500).json({ message: "Erreur serveur", error: error.message })
  }
}


export { placeOrder, placeOrderStripe, placeOrderPaydunya, allOrders, userOrders, updateStatus,webhookPaytech, getDashboardStats };
