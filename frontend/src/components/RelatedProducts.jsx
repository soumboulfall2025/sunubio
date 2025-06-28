import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'

const RelatedProducts = ({Category, sousCategory}) => {

    const {products} = useContext(ShopContext)
    const [related, setRelated] = useState([])

    useEffect(()=>{
        if(products.length > 0) {
            let productsCopy = products.slice()
            productsCopy = productsCopy.filter((item)=>Category === item.category)
            productsCopy = productsCopy.filter((item)=>sousCategory === item.subCategory)
           
            setRelated(productsCopy.slice(0,5));
            
        }

    },[])








    
  return (
    <div className='my-24'>
        <div className='text-center text-3xl py-2'>
            <Title text1={'RELATED'} text2={'PRODUCTS'} />

        </div>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
            {related.map((item, index) => {
  // Si image est un tableau, prends la première image, sinon prends l'image telle quelle
  const imageUrl = Array.isArray(item.image) ? item.image[0] : item.image;

  return (
    <ProductItem 
      key={index} 
      id={item._id} 
      slug={item.slug}
      name={item.name} 
      price={item.price} 
      image={imageUrl} 
    />
  )
})}


        </div>

    </div>
  )
}

export default RelatedProducts