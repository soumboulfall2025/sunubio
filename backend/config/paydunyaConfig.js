// backend/config/paydunyaConfig.js
import paydunya from 'paydunya';
import dotenv from 'dotenv';
dotenv.config();

const setup = new paydunya.Setup({
  masterKey: process.env.PAYDUNYA_MASTER_KEY,
  privateKey: process.env.PAYDUNYA_PRIVATE_KEY,
  publicKey: process.env.PAYDUNYA_PUBLIC_KEY,
  token: process.env.PAYDUNYA_TOKEN,
  mode: 'live', 
});

const store = new paydunya.Store({
  name: 'Sunu Express Shop & Co',
  tagline: 'Votre boutique de confiance',
  phone_number: '787203975',
  postal_address: 'Dakar, Sénégal',
  websiteUrl: 'https://www.sunuexpressshop.com',
  logoUrl: 'https://www.sunuexpressshop.com/logo.png',
});


export { setup, store };
