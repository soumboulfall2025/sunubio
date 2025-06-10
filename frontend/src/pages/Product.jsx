import React, { useContext, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import assets from '../assets/assets'
import RelatedProducts from '../components/RelatedProducts'

const Product = () => {
  const { productId } = useParams()
  const { products, currency, addToCart } = useContext(ShopContext)
  const [productData, setProductData] = useState(null)
  const [image, setImage] = useState("")
  const [size, setSize] = useState("")

  useEffect(() => {
    const found = products.find(item => item._id === productId)
    if (found) {
      setProductData(found)
      setImage(found.image[0])
    } else {
      setProductData(null)
    }
  }, [productId, products])

  if (!productData) {
    return (
      <div className="text-center py-20 text-gray-500">
        Produit bio introuvable.
      </div>
    )
  }

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
          <p className='border px-5 py-3 text-sm'>Avis (122)</p>
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
      {/* PRODUITS SIMILAIRES */}
      <RelatedProducts Category={productData.category} sousCategory={productData.subCategory} />
    </div>
  )
}

export default Product