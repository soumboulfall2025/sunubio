import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import assets from '../assets/assets'
import Title from '../components/Title'
import ProductItem from '../components/ProductItem'

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext)
  const [showFilters, setShowFilters] = useState(false)
  const [filterProducts, setFilterProducts] = useState([])
  const [Category, setCategory] = useState([])
  const [SousCategory, setSousCategory] = useState([])
  const [sortType, setSortType] = useState('relevant')

  // Catégories et sous-catégories adaptées au bio
  const bioCategories = [
    "Huiles",
    "Compléments",
    "Cosmétiques",
    "Épicerie",
    "Hygiène",
    "Bien-être"
  ]
  const bioSousCategories = [
    "Huile végétale",
    "Gélules",
    "Savon",
    "Infusion",
    "Crème",
    "Graines"
  ]

  const toggleCategory = (e) => {
    if (Category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item => item !== e.target.value))
    } else {
      setCategory(prev => [...prev, e.target.value])
    }
  }

  const toggleSousCategory = (e) => {
    if (SousCategory.includes(e.target.value)) {
      setSousCategory(prev => prev.filter(item => item !== e.target.value))
    } else {
      setSousCategory(prev => [...prev, e.target.value])
    }
  }

  const applyFilter = () => {
    let productsCopy = products.slice()
    if (showSearch && search) {
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    }
    if (Category.length > 0) {
      productsCopy = productsCopy.filter(item => Category.includes(item.category))
    }
    if (SousCategory.length > 0) {
      productsCopy = productsCopy.filter(item => SousCategory.includes(item.subCategory))
    }
    setFilterProducts(productsCopy)
  }

  const sortProduct = () => {
    let fpCopy = filterProducts.slice()
    switch (sortType) {
      case 'low-high':
        setFilterProducts(fpCopy.sort((a, b) => a.price - b.price))
        break;
      case 'high-low':
        setFilterProducts(fpCopy.sort((a, b) => b.price - a.price))
        break;
      default:
        applyFilter()
        break;
    }
  }

  useEffect(() => {
    applyFilter()
  }, [Category, SousCategory, search, showSearch, products])

  useEffect(() => {
    sortProduct()
    // eslint-disable-next-line
  }, [sortType])

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-1'>
      {/* FILTRES BIO */}
      <div className='min-w-60'>
        <p onClick={() => setShowFilters(!showFilters)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>
          FILTRES
          <img src={assets.icons.dropdown} className={`h-3 sm:hidden ${showFilters ? 'rotate-90' : ''}`} alt="" />
        </p>
        {/* CATÉGORIES BIO */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilters ? 'block' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>CATÉGORIES</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            {bioCategories.map((cat, idx) => (
              <p className='flex gap-2' key={idx}>
                <input type="checkbox" className='w-3' value={cat} onChange={toggleCategory} />{cat}
              </p>
            ))}
          </div>
        </div>
        {/* SOUS-CATÉGORIES BIO */}
        <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilters ? 'block' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>SOUS-CATÉGORIES</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            {bioSousCategories.map((sous, idx) => (
              <p className='flex gap-2' key={idx}>
                <input type="checkbox" className='w-3' value={sous} onChange={toggleSousCategory} />{sous}
              </p>
            ))}
          </div>
        </div>
      </div>
      {/* AFFICHAGE DES PRODUITS */}
      <div className='flex-1'>
        <div className='flex justify-between text-base sm:text-2xl mb-4'>
          <Title text1={'TOUS'} text2={'LES PRODUITS BIO'} />
          {/* TRI */}
          <select onChange={(e) => setSortType(e.target.value)} className='border-2 border-gray-300 text-sm px-2'>
            <option value="relevant">Trier : Pertinence</option>
            <option value="low-high">Trier : Prix croissant</option>
            <option value="high-low">Trier : Prix décroissant</option>
          </select>
        </div>
        {/* LISTE DES PRODUITS */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {filterProducts.map((item, index) => (
            <ProductItem
              key={index}
              name={item.name}
              id={item._id}
              price={item.price}
              image={Array.isArray(item.image) && item.image.length > 0 ? item.image[0] : ''}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Collection