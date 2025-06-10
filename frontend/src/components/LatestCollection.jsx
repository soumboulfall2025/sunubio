import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const LatestCollection = () => {

  const { products } = useContext(ShopContext);
  const [LatestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    if (products && products.length > 0) {
      setLatestProducts(products.slice(0, 10)); // Prend les 10 premiers produits
    }
  }, [products])

  return (
    <div className='my-10'>
      <div className='text-center py-8 text-3xl'>
        <Title text1={"NOUVEAUTÉS"} text2={"BIO"} />
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
          Découvrez les dernières nouveautés bio : huiles, compléments, cosmétiques et bien-être pour une vie plus saine.
        </p>
      </div>
      {/* Affichage des produits */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {LatestProducts && LatestProducts.length > 0 && LatestProducts.map((item, index) => (
          <ProductItem
            key={index}
            id={item._id}
            image={Array.isArray(item.image) && item.image.length > 0 ? item.image[0] : ""}
            name={item.name}
            price={item.price}
          />
        ))}
      </div>
    </div>
  )
}

export default LatestCollection