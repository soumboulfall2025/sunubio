// backend/config/paydunyaConfig.js
import paydunya from 'paydunya';
import dotenv from 'dotenv';
dotenv.config();

const setup = new paydunya.Setup({
  masterKey: process.env.PAYDUNYA_MASTER_KEY,
  privateKey: process.env.PAYDUNYA_PRIVATE_KEY,
  publicKey: process.env.PAYDUNYA_PUBLIC_KEY,
  token: process.env.PAYDUNYA_TOKEN,
  mode: 'live', // ou 'live'
});

const store = new paydunya.Store({
  name: 'Sunubio & Co',
  tagline: 'Votre boutique de confiance',
  phoneNumber: '787203975',
  postalAddress: 'Dakar, Sénégal',
  websiteURL: 'https://sunubio-frontend.onrender.com', // ⚠️ camelCase
  logoURL: 'https://sunubio-frontend.onrender.com/logo.png', // ⚠️ camelCase
});

console.log("setup:", setup);
console.log("store:", store);

export { setup, store };
