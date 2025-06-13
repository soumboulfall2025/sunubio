import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import assets from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

function formatAddress(formData) {
  return `${formData.firstName} ${formData.lastName}, ${formData.street}, ${formData.city}, ${formData.state}, ${formData.zipcode}, ${formData.country}, Tel: ${formData.phone}`;
}

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod')
  const [orderStatus, setOrderStatus] = useState(null)
  const [errorStatus, setErrorStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  })

  const onChangeHandler = (event) => {
    const { name, value } = event.target
    setFormData(data => ({ ...data, [name]: value }))
  }



  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (loading) return;
    setLoading(true);

    try {
      console.log("Méthode sélectionnée au submit :", method);

      // Construction de la liste des produits commandés
      const orderItems = [];
      for (const productId in cartItems) {
        for (const size in cartItems[productId]) {
          if (cartItems[productId][size] > 0) {
            const product = structuredClone(products.find(p => p._id === productId));
            if (product) {
              product.size = size;
              product.quantity = cartItems[productId][size];
              orderItems.push(product);
            }
          }
        }
      }

      const orderData = {
        address: formatAddress(formData), // <-- ici, une string
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };

      switch (method) {
        case "cod": {
          const response = await axios.post(`${backendUrl}/api/order/place`, orderData, {
            headers: { token }
          });

          console.log("Réponse COD :", response.data);

          if (response.data.success) {
            const total = getCartAmount() + delivery_fee; // 🟡 Calcul avant vidage

            // Génération du message WhatsApp personnalisé
            const productListText = orderItems.map(item =>
              `- ${item.name} (${item.size}) x${item.quantity}`
            )
            const rawMessage = `Bonjour, je suis ${formData.firstName} ${formData.lastName}
             Je viens de passer une commande d’un montant total de ${total} FCFA
             dans votre site web Sunubio & Co.
             Voici le détail de ma commande :${productListText}
             📞 Tel : ${formData.phone}`
            const message = encodeURIComponent(rawMessage);


            const whatsappUrl = `https://wa.me/221787203975?text=${message}`;

            setOrderStatus(response.data.message);
            setErrorStatus(null);
            setCartItems({});
            navigate('/orders');

            // ✅ Ouvre WhatsApp après 1.5 sec
            setTimeout(() => {
              window.open(whatsappUrl, '_blank');
            }, 1500);
          } else {
            setOrderStatus(null);
            setErrorStatus(response.data.message);
          }
          break;
        }



        case "paydunya": {
          const response = await axios.post(`${backendUrl}/api/order/paydunya`, orderData, {
            headers: { token }
          });

          console.log("Réponse complète PayDunya :", response);

          if (response.data.success && response.data.redirectUrl) {
            const url = response.data.redirectUrl;
            if (typeof url === 'string' && url.startsWith('http')) {
              window.location.href = url;
            } else {
              setErrorStatus("L’URL de redirection PayDunya est invalide.");
              console.error("URL invalide :", url);
            }
          }

          break;
        }


        case "stripe": {
          const response = await axios.post(`${backendUrl}/api/order/stripe`, orderData, {
            headers: { token }
          });

          console.log("Réponse Stripe :", response.data);

          if (response.data.success) {
            setOrderStatus("Redirection vers Stripe...");
            setErrorStatus(null);
            window.location.href = response.data.redirectUrl;
          } else {
            setOrderStatus(null);
            setErrorStatus(response.data.message || "Erreur avec Stripe");
          }
          break;
        }

        default:
          setErrorStatus("Méthode de paiement invalide");
          break;
      }

    } catch (error) {
      console.error("Erreur lors de la commande :", error);
      setOrderStatus(null);
      setErrorStatus("Erreur lors de la commande, veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };







  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      {/* LEFT - DELIVERY INFO */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1="DELIVERY" text2="INFORMATION" />
        </div>

        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='First name' />
          <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Last name' />
        </div>

        <input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="email" placeholder='Email address' />
        <input required onChange={onChangeHandler} name='street' value={formData.street} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Street' />

        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='City' />
          <input required onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='State' />
        </div>

        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Zipcode' />
          <input required onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Country' />
        </div>

        <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Phone' />
      </div>

      {/* RIGHT - PAYMENT METHOD */}
      <div className='mt-8'>
        <div className='min-w-80'>
          <CartTotal />
        </div>

        <div className='mt-12'>
          <Title text1="PAYMENT" text2="METHOD" />
          {/* Méthodes de paiement compactes et alignées */}
          <div className='flex gap-3 flex-col lg:flex-row mt-4'>
            {/* Cash on delivery */}
            <div
              onClick={() => setMethod('cod')}
              className={`flex items-center gap-2 border rounded-lg p-2 px-3 cursor-pointer transition ${method === 'cod' ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-white'}`}
              style={{ minWidth: 160 }}
            >
              <span className={`inline-block w-4 h-4 border rounded-full mr-2 ${method === 'cod' ? 'bg-green-400 border-green-400' : 'bg-white border-gray-300'}`} />
              <span className='text-gray-700 text-sm font-medium'>Cash on delivery</span>
            </div>

            {/* PayDunya */}
            <div
              onClick={() => setMethod('paydunya')}
              className={`flex items-center gap-2 border rounded-lg p-2 px-3 cursor-pointer transition ${method === 'paydunya' ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-white'}`}
              style={{ minWidth: 160 }}
            >
              <span className={`inline-block w-4 h-4 border rounded-full mr-2 ${method === 'paydunya' ? 'bg-green-400 border-green-400' : 'bg-white border-gray-300'}`} />
              <img
                src={assets.images.paydunyaLogo}
                alt="PayDunya"
                style={{ height: 20, width: 'auto', marginRight: 6 }}
              />
              <span className='text-gray-700 text-sm font-medium'>Mobile Money</span>
            </div>
          </div>

          <div className='w-full text-end mt-8'>
            <button disabled={loading} type='submit' className='bg-black text-white px-16 py-3 text-sm'>PLACE ORDER</button>
          </div>

          {orderStatus && <p className="text-green-600 mt-4">{orderStatus}</p>}
          {errorStatus && <p className="text-red-600 mt-4">{errorStatus}</p>}
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
