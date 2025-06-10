import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";

import paydunya from "paydunya";
import { setup, store } from "../config/paydunyaConfig.js"
import { io } from "../server.js";



const frontend_URL = "https://bambaelectro-frontend.onrender.com/"




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

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

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
  console.log("=== placeOrderPaydunya called ===");

  try {
    const { address, items, amount } = req.body;
    const userId = req.user.id;

    console.log("Reçu du client :", { address, items, amount, userId });

    if (!address || !items || !amount) {
      return res.status(400).json({ success: false, message: "Informations manquantes" });
    }

    const newOrder = new orderModel({
      userId,
      address,
      items,
      amount,
      paymentMethod: "paydunya",
      paymentStatus: "pending",
      date: new Date(),
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    console.log("Commande sauvegardée:", newOrder._id);

    const invoice = new paydunya.CheckoutInvoice(setup, store);
    console.log("Invoice initialisée avec setup et store");

    for (const item of items) {
      if (!item.name || !item.quantity || !item.price) continue;
      const unitPrice = Number(item.price);
      const quantity = Number(item.quantity);
      const totalPrice = unitPrice * quantity;

      invoice.addItem(item.name, quantity, unitPrice, totalPrice);
      console.log(`Item ajouté : ${item.name} x${quantity} à ${unitPrice} USD`);
    }

    const usdToFcfaRate = 600;
    const amountInFCFA = Math.round(amount * usdToFcfaRate);

    if (amountInFCFA < 200) {
      return res.status(400).json({
        success: false,
        message: "Le montant est trop bas pour PayDunya (minimum : 200 FCFA)",
      });
    }

    invoice.totalAmount = amountInFCFA;
    invoice.description = `Commande #${newOrder._id} chez Bamba Electro`;
    invoice.addCustomData("orderId", newOrder._id.toString());

    console.log("Création de la facture PayDunya...",invoice);

    try {
     const invoice = await invoice.create();
   
     

      // Log réponse brute
      const rawResponse = invoice.responseText;
      console.log("Réponse brute de PayDunya :", rawResponse);

    
    
      console.log("ceci est ", response);
      
      const redirectUrl = response.invoice_url;
    

      if (!redirectUrl) {
        return res.status(500).json({
          success: false,
          message: "URL de facture manquante dans la réponse PayDunya",
          details: response,
        });
      }

      console.log("Facture créée avec succès !");
      return res.status(200).json({ success: true, redirectUrl });

    } catch (err) {
      console.error("Erreur lors de invoice.create():", err?.response?.text || err.message || err);
      console.error("Code réponse:", invoice.response_code);
      console.error("Message réponse:", invoice.response_text);

      return res.status(500).json({
        success: false,
        message: "Erreur lors de la création de la facture PayDunya",
        details: invoice.response_text,
      });
    }

  } catch (error) {
    console.error("Erreur dans placeOrderPaydunya:", error);
    if (!res.headersSent) {
      return res.status(500).json({ success: false, message: "Erreur serveur" });
    }
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
