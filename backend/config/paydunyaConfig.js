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
  baseURL: "https://app.paydunya.com/api/v1",    // URL API live (optionnel si mode live)
});


const store = new paydunya.Store({
  name: 'Bamba Electro',
  tagline: 'Votre boutique de confiance',
  phoneNumber: '771234567',
  postalAddress: 'Dakar, Sénégal',
  websiteUrl: 'https://bambaelectro.com',
  logoUrl: 'https://bambaelectro.com/logo.png',
  callbackURL: 'https://bambaelectro.com/callbackurl'
});

export { setup, store };
