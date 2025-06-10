import crypto from 'crypto';
import orderModel from '../models/orderModel.js'; // pour update DB

app.post('/ipn-url', async (req, res) => {
  try {
    const data = req.body.data;

    if (!data) {
      return res.status(400).send('No data received');
    }

    const status = data.status;
    const invoiceId = data.invoice.token; // ou invoice_id
    const hash = req.headers['x-paydunya-signature']; // Signature HMAC envoyée dans header

    // Calcul du hash HMAC localement
    const payload = JSON.stringify(req.body); // le corps JSON reçu
    const secret = process.env.PAYDUNYA_PRIVATE_KEY; // ou masterKey selon doc officielle

    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(payload);
    const calculatedHash = hmac.digest('hex');

    if (hash !== calculatedHash) {
      console.log('Requête IPN non autorisée (signature invalide)');
      return res.status(403).send('Forbidden');
    }

    if (status === 'completed') {
      // Paiement validé → mettre à jour la commande en base
      await orderModel.findOneAndUpdate(
        { _id: invoiceId },
        { paymentStatus: 'paid' }
      );
      console.log(`Paiement validé pour la commande ${invoiceId}`);

      return res.status(200).send('OK');
    } else {
      // Paiement non terminé, ou autre statut
      console.log(`Paiement status: ${status} pour commande ${invoiceId}`);
      return res.status(200).send('OK');
    }

  } catch (error) {
    console.error("Erreur IPN:", error);
    return res.status(500).send('Erreur serveur');
  }
});
