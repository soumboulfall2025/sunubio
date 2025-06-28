import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'

const BestSeller = () => {
    const { products } = useContext(ShopContext)
    const [bestSeller, setBestSeller] = useState([])

    useEffect(() => {
        const bestProduct = products.filter((item) => item.bestSeller === true)
        setBestSeller(bestProduct.slice(0, 10)) // Prend les 10 premiers produits best-sellers
    }, [products])

    return (
        <div className='my-10'>
            <div className='text-center text-3xl py-8'>
                <Title text1={"MEILLEURES"} text2={"VENTES BIO"} />
                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-700'>
                    Découvrez nos produits bio les plus appréciés, naturels et certifiés pour votre bien-être.
                </p>
            </div>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                {
                    bestSeller.map((item, index) => (
                        <ProductItem
                            key={index}
                            id={item._id}
                            slug={item.slug}
                            name={item.name}
                            image={Array.isArray(item.image) && item.image.length > 0 ? item.image[0] : ""}
                            price={item.price}
                        />
                    ))
                }
            </div>
        </div>
    )
}

export default BestSeller