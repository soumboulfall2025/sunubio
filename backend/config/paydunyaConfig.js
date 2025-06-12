// backend/config/paydunyaConfig.js
import paydunya from 'paydunya';
import dotenv from 'dotenv';
dotenv.config();

const setup = new paydunya.Setup({
  masterKey: process.env.PAYDUNYA_MASTER_KEY,    // Clé production
  privateKey: process.env.PAYDUNYA_PRIVATE_KEY,  // Clé production
  publicKey: process.env.PAYDUNYA_PUBLIC_KEY,    // Clé production
  token: process.env.PAYDUNYA_TOKEN,              // Clé production
  mode: 'live',                                  // mode production
      // URL API live (optionnel si mode live)
});


const store = new paydunya.Store({
  name: 'Sunubio & Co',
  tagline: 'Votre boutique de confiance',
  phoneNumber: '787203975',
  postalAddress: 'Dakar, Sénégal',
  websiteUrl: 'https://sunubio-frontend.onrender.com',
  logoUrl: 'https://sunubio-frontend.onrender.com/logo.png',
});

export { setup, store };
