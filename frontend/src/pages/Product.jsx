import React, { useContext, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import assets from '../assets/assets'
import RelatedProducts from '../components/RelatedProducts'
import axios from "axios"
import { toast } from "react-toastify"

const Product = () => {
  const { productId } = useParams()
  const { products, currency, addToCart } = useContext(ShopContext)
  const [productData, setProductData] = useState(null)
  const [image, setImage] = useState("")
  const [size, setSize] = useState("")
  const [question, setQuestion] = useState("")
  const [review, setReview] = useState({ rating: 5, comment: "" })
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.post("/api/product/single", { id: productId });
        setProductData(res.data.product);
        setImage(res.data.product.image[0]);
      } catch {
        setProductData(null);
      }
    };
    fetchProduct();
  }, [productId, refresh]);

  if (!productData) {
    return (
      <div className="text-center py-20 text-gray-500">
        Produit bio introuvable.
      </div>
    )
  }

  // Soumettre une question
  const handleQuestion = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/product/${productId}/question`, { question }, { headers: { token: localStorage.getItem("token") } });
      toast.success("Question envoyée !");
      setQuestion("");
      setRefresh(r => !r);
    } catch {
      toast.error("Erreur lors de l'envoi !");
    }
  };

  // Soumettre un avis
  const handleReview = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/product/${productId}/review`, review, { headers: { token: localStorage.getItem("token") } });
      toast.success("Avis ajouté !");
      setReview({ rating: 5, comment: "" });
      setRefresh(r => !r);
    } catch {
      toast.error("Erreur lors de l'envoi !");
    }
  };

  console.log("productId envoyé:", productId);

  return (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {/* PRODUIT BIO */}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
        {/* IMAGES */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
            {productData.image.map((item, index) => (
              <img onClick={() => setImage(item)} key={index} src={item} alt="" className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' />
            ))}
          </div>
          <div className='w-full sm:w-[80%]'>
            <img className='w-full h-auto ' src={image} alt="" />
          </div>
        </div>
        {/* INFOS PRODUIT */}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          <div className='flex items-center gap-1 mt-2'>
            <img src={assets.icons.star} alt="" className="w-3 5" />
            <img src={assets.icons.star} alt="" className="w-3 5" />
            <img src={assets.icons.star} alt="" className="w-3 5" />
            <img src={assets.icons.star} alt="" className="w-3 5" />
            <img src={assets.icons.star} alt="" className="w-3 5" />
            <p className='pl-2'></p>
          </div>
          <p className='mt-5 text-3xl font-medium'>{productData.price}{currency}</p>
          <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>
          <div className='flex flex-col gap-4 my-8'>
            <p>Sélectionnez la contenance</p>
            <div className='flex gap-2'>
              {productData.sizes.map((item, index) => (
                <button onClick={() => setSize(item)} className={`border py-2 px-4 bg-gray-100 ${item === size ? 'border-green-600' : ''} `} key={index}>{item}</button>
              ))}
            </div>
          </div>
          <button
            onClick={() => addToCart(productData._id, size)}
            className='bg-green-700 text-white px-8 py-3 text-sm active:bg-green-900'
          >
            AJOUTER AU PANIER
          </button>
          <hr className='mt-8 sm:w-4/5' />
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
            <p>Produit bio 100% naturel et certifié.</p>
            <p>Paiement à la livraison disponible.</p>
            <p>Retour facile sous 7 jours.</p>
          </div>
        </div>
      </div>
      {/* DESCRIPTION PRODUIT */}
      <div className='mt-20'>
        <div className='flex'>
          <b className='border px-5 py-3 text-sm'>Description</b>
          <p className='border px-5 py-3 text-sm'>Avis ({productData.reviews?.length || 0})</p>
        </div>
        <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
          <p>
            Découvrez notre sélection de produits bio et naturels, pour une vie plus saine et respectueuse de l’environnement.
          </p>
          <p>
            Qualité, bien-être et authenticité : profitez du meilleur du bio livré chez vous rapidement.
          </p>
        </div>
      </div>

      {/* AVIS CLIENTS */}
      <div className="mt-12">
        <h3 className="font-bold mb-2">Avis clients</h3>
        {productData.reviews?.length ? (
          productData.reviews.map((r, i) => (
            <div key={i} className="mb-2 border-b pb-2">
              <b>{r.name}</b> - {r.rating}★<br />
              <span>{r.comment}</span>
            </div>
          ))
        ) : (
          <p>Aucun avis pour ce produit.</p>
        )}

        {/* Laisser un avis */}
        <form onSubmit={handleReview} className="my-4 flex flex-col gap-2">
          <label>Votre note :
            <select value={review.rating} onChange={e => setReview({ ...review, rating: e.target.value })}>
              {[5,4,3,2,1].map(n => <option key={n} value={n}>{n}★</option>)}
            </select>
          </label>
          <textarea
            placeholder="Votre avis"
            value={review.comment}
            onChange={e => setReview({ ...review, comment: e.target.value })}
            required
          />
          <button
            type="submit"
            className="bg-green-700 text-white px-8 py-3 text-sm rounded hover:bg-green-800 active:bg-green-900 transition"
          >
            Envoyer mon avis
          </button>
        </form>
      </div>

      {/* FAQ DYNAMIQUE */}
      <div className="mt-12">
        <h3 className="font-bold mb-2">Questions fréquentes</h3>
        {productData.faq?.length ? (
          productData.faq.map((q, i) => (
            <div key={i} className="mb-2 border-b pb-2">
              <b>Q :</b> {q.question}<br />
              {q.answer && <span><b>R :</b> {q.answer}</span>}
              <a
                href={`https://wa.me/221787203975?text=Bonjour,%20j'ai%20une%20question%20sur%20le%20produit%20${encodeURIComponent(productData.name)}%20:%20${encodeURIComponent(q.question)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 bg-green-700 text-white px-4 py-2 text-xs rounded hover:bg-green-800 active:bg-green-900 transition"
              >
                Poser sur WhatsApp
              </a>
            </div>
          ))
        ) : (
          <p>Aucune question pour ce produit.</p>
        )}

        {/* Poser une question */}
        <form onSubmit={handleQuestion} className="my-4 flex flex-col gap-2">
          <textarea
            placeholder="Posez votre question sur ce produit"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-green-700 text-white px-8 py-3 text-sm rounded hover:bg-green-800 active:bg-green-900 transition"
          >
            Envoyer ma question
          </button>
        </form>
      </div>

      {/* PRODUITS SIMILAIRES */}
      <RelatedProducts Category={productData.category} sousCategory={productData.subCategory} />
    </div>
  )
}

export default Product