import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "F CFA";
  const delivery_fee = 2000;

  
  console.log("Backend URL from env:", import.meta.env.VITE_BACKEND_URL);

  const backendUrl = import.meta.env.VITE_BACKEND_URL ||  "http://localhost:4000";

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  // Charger uniquement les produits bio depuis l'API
  const getProductsData = async () => {
    try {
      const url = backendUrl + "/api/product/list";
      const response = await axios.get(url);
      if (response.data.success && Array.isArray(response.data.products)) {
        setProducts(response.data.products);
      } else {
        toast.error("Format inattendu :", response.data.message);
      }
    } catch (error) {
      toast.error("Impossible de charger les produits bio.");
    }
  };

  // Charger le panier utilisateur
  const getUserCart = async (token) => {
    if (!token) return;
    try {
      const response = await axios.post(backendUrl + "/api/cart/get", {}, { headers: { token } });
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      toast.error("Impossible de récupérer le panier utilisateur.");
    }
  };

  // Ajout au panier
  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Sélectionnez une taille");
      return;
    }
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
    } else {
      cartData[itemId] = { [size]: 1 };
    }
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(backendUrl + "/api/cart/add", { itemId, size }, { headers: { token } });
      } catch (error) {
        toast.error("Erreur lors de l'ajout au panier.");
      }
    }
  };

  // Calcul du nombre total d'articles dans le panier
  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          totalCount += cartItems[items][item];
        }
      }
    }
    return totalCount;
  };

  // Mise à jour de la quantité d'un produit dans le panier
  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(backendUrl + "/api/cart/update", { itemId, size, quantity }, { headers: { token } });
      } catch (error) {
        toast.error("Erreur lors de la mise à jour du panier.");
      }
    }
  };

  // Calcul du montant total du panier
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find(
        (product) => String(product._id) === String(items)
      );
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          totalAmount += itemInfo?.price * cartItems[items][item];
        }
      }
    }
    return totalAmount;
  };

  // Effets pour charger les produits et le panier utilisateur
  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) setToken(savedToken);
  }, []);

  useEffect(() => {
    if (token) getUserCart(token);
  }, [token]);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    setToken,
    token,
    setCartItems
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;