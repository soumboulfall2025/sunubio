import Order from '../models/orderModel.js';

export const handlePaydunyaCallback = async (req, res) => {
  try {
    console.log("PayDunya Callback reçu :", JSON.stringify(req.body, null, 2));

    const data = req.body;
    const orderId = data.custom_data?.orderId;
    const status = data.status;

    // Sécurité IPN (facultatif)
    const ipnToken = req.headers['x-ipn-secret'];
    if (ipnToken !== process.env.PAYDUNYA_IPN_SECRET) {
      return res.status(403).send("Unauthorized IPN");
    }

    if (!orderId) return res.status(400).send('Commande inconnue');

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).send('Commande non trouvée');

    console.log(`Commande #${orderId} - Statut PayDunya : ${status}`);

    if (status === "completed") {
      order.status = "paid";
      order.transactionId = data.transaction_id;
    } else if (["cancelled", "declined", "expired", "unpaid"].includes(status)) {
      order.status = "failed";
    } else if (status === "pending") {
      order.status = "pending";
    }

    await order.save();
    res.status(200).send('Notification reçue');
  } catch (error) {
    console.error("Erreur IPN PayDunya:", error);
    res.status(500).send('Erreur interne');
  }
};
