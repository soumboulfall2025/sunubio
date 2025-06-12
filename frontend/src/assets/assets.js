import arrowsRotate from './exchange.png';
import bars from './bars-solid.png';
 import cartShopping from './cart-shopping-solid.png'; // <-- Commentez si le fichier n'existe pas
// import trash from './trash-solid.png'; // <-- Commentez si le fichier n'existe pas
import user from './user-solid.png';
import xmark from './xmark-solid.png';
import magnifyingGlass from './magnifying-glass-solid.png';
import support from './headset-solid.png';
import retour from './certificate-solid.png';
import dropdown from './caret-down-solid.png';
import hero from './hero.jpg'; // <-- Assurez-vous que ce fichier existe
import logo from './logo.jpeg'; // <-- Assurez-vous que ce fichier existe
import paydunyaLogo from './paydunya.png'; // <-- Assurez-vous que ce fichier existe
// import star from './star-solid.png'; // <-- Commentez si le fichier n'existe pas
import bin from './bin_icon.png'

// Importation des produits bio et santé
import products from './products.js'; // <-- Assurez-vous d'avoir ce fichier avec vos produits

const assets = {
  icons: {
    arrowsRotate,
    bars,
    cartShopping,
    // trash,
    user,
    xmark,
    magnifyingGlass,
    support,
    retour,
    dropdown,
    // star,
    bin
  },
  images: {
    // Ajoutez ici vos images si besoin
    hero,
    logo,
    paydunyaLogo
  },
  products, // Les produits sont maintenant importés proprement
};

export default assets;